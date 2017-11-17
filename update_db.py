import base64
import json
import re
import time
from apiclient import errors
from collections import namedtuple

import app
from app.lib.gmail_api import GmailApi
from app.models import User, Message
from config.secrets import USER_INFO_BY_EMAIL, GMAIL_QUERIES

CHUNK_SIZE = 100

# TODO don't run query up here? But don't do it in _parse_response
# either, otherwise we'll be doing this for every response.
EMAIL_TO_USER_ID = {user.email: user.id for user in User.query.all()}

db = app.db
service = GmailApi().get_service()

MessageData = namedtuple('MessageData', [
    'body',
    'timestamp',
    'message_id',
    'label',
    'data',
    'sender_user_id',
    'thread_id',
])


def create_or_update_users():
    for email, user_attributes in USER_INFO_BY_EMAIL.items():
        existing_user = User.query.filter_by(email=email).first()
        if existing_user is not None:
            print("Updating: {}".format(email))
            User.query.filter_by(email=email).update(user_attributes)
        else:
            print("Creating: {}".format(email))
            new_user = User(**user_attributes)
            db.session.add(new_user)

    db.session.commit()


def fetch_and_save_new_messages(query):
    """
    Get all messages from gmail api and save to db. This happens in a few steps - 
    1. use gmail api messages.list() to get a list of all message ids returned from query
    2. loop through each of those messages ids and use messages.get() to get more detailed info
    3. parse through response so we can get get the fields we want to save in the db

    Params
        query [String] passed to gmailAPI to fetch messages
    Returns
        [Int] Count of new messages saved
    """
    # Find the last 500 messages we stored in the db to check against to make sure we're
    # not trying to save an existing message. We'll alter our query to only
    # search for messages after the most recent one, but because we can't get more granular
    # than searching by day, so there may still be overlap to check for (and we can chat a
    # lot in a day).
    existing_messages = Message.query.order_by(Message.timestamp.desc()).limit(500).all()
    existing_ids = set(m.message_id for m in existing_messages)

    # Update query to search only after last saved message
    last_timestamp = int(existing_messages[0].timestamp) / 1000  # convert to seconds
    formatted_timestamp = time.strftime('%Y/%m/%d', time.localtime(last_timestamp))
    query = "{} after:{}".format(query, formatted_timestamp)

    try:
        print("Fetching new messages with query: {}".format(query))
        response = service.users().messages().list(userId='me', q=query).execute()
        messages = response.get('messages', [])

        while 'nextPageToken' in response:
            response = service.users().messages().list(
                userId='me',
                q=query,
                pageToken=response['nextPageToken']
            ).execute()
            messages.extend(response.get('messages', []))

    except errors.HttpError as error:
        print('An error occurred retrieving messages via messages.list(): {}'.format(error))
        return

    new_message_ids = [m['id'] for m in messages if m['id'] not in existing_ids]
    print("Found {} new messages".format(len(new_message_ids)))

    count = 0
    chunks = _chunk(new_message_ids, CHUNK_SIZE)
    for chunk in chunks:
        batch = service.new_batch_http_request(callback=_parse_response_and_save)
        for message_id in chunk:
            batch.add(service.users().messages().get(userId='me', id=message_id))

        try:
            batch.execute()
        except errors.HttpError as error:
            print('An error occurred retrieving messages via messages.get(): {}'.format(error))
            return

        db.session.commit()

        count += len(chunk)
        print("{} left to save".format(len(new_message_ids) - count))

    return len(new_message_ids)


def _chunk(l, size):
    for i in xrange(0, len(l), size):
        yield l[i:i+size]


def _parse_response_and_save(request_id, response, exception):
    if exception is not None:
        raise Exception(exception)

    parsed_response = _parse_response(response)
    if parsed_response:
        new_message = Message(
            data=parsed_response.data,
            body=parsed_response.body,
            label=parsed_response.label,
            message_id=parsed_response.message_id,
            sender_user_id=parsed_response.sender_user_id,
            timestamp=parsed_response.timestamp,
            thread_id=parsed_response.thread_id
        )
        db.session.add(new_message)


def _parse_response(resp):
    """
    Picks out relevant fields from gmail api response for us to save. We'll
    only save message info if all fields are present.

    For reference, here are the only fields returned from messages.get() for a chat.
    Emails come back with more information, specifically in headers.
    https://developers.google.com/gmail/api/v1/reference/users/messages#resource
    {
     "id": "uniquestring",
     "threadId": "uniquestring",
     "labelIds": [
      "CHAT"
     ],
     "snippet": "sneak peak of chat string",
     "historyId": "12345678",
     "internalDate": "1508199889326",
     "payload": {
      "partId": "",
      "mimeType": "text/html",
      "filename": "",
      "headers": [
       {
        "name": "From",
        "value": "Firstname Lastname \u003cemail@gmail.com\u003e"
       }
      ],
      "body": {
       "size": 30,
       "data": "base64encodedstring"
      }
     },
     "sizeEstimate": 100
    }

    Params
        resp [object] User.messages resource returned from gmail message.get()
    Returns
        MessageData [namedtuple]
    """
    for header in resp['payload']['headers']:
        if header['name'] == 'From':
            email = _parse_email_value(header['value'])
            sender_user_id = EMAIL_TO_USER_ID.get(email)
            if not sender_user_id:
                print("sender_user_id not found {}".format(email))
                return

    if resp['payload']['mimeType'] in ['text/html', 'text/plain']:
        encoded_data = resp['payload']['body']['data'].encode('utf-8')
        body = base64.urlsafe_b64decode(encoded_data)
    else:
        # unclear if other options may come through
        print("found new mimeType: {}, id: {}".format(resp['payload']['mimeType'], resp['id']))
        return

    # we only care about chat labels for now
    label = 'chats' if 'chats' in resp['labelIds'] else None

    return MessageData(
        body=body,
        timestamp=resp['internalDate'],
        message_id=resp['id'],
        label=label,
        data=json.dumps(resp),
        sender_user_id=sender_user_id,
        thread_id=resp['threadId']
    )

def _parse_email_value(value):
    # comes in as "firstname lastname \u003cemailaddress\u003e"
    regex = re.compile('<(.*?)>')
    try:
        email_address = regex.findall(value)[0].lower()
    except Exception:
        print("Couldn't get sender from: {}".format('value'))
        return

    return email_address


if __name__ == "__main__":
    create_or_update_users()

    total_messages = 0
    for query in GMAIL_QUERIES:
        total_messages += fetch_and_save_new_messages(query)
    print("{} new messages saved".format(total_messages))
