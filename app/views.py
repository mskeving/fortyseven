import binascii
import os
from app import app, db
from app.models import Token
from flask import abort, g, jsonify, request, Response
from social_core.actions import do_auth
from social_flask.utils import psa
from sqlalchemy.sql import text

from app.auth import login_required
from app.lib.util import convert_to_timestamp
from app.models import Message


@app.route('/', methods=['GET'])
def index():
	return "It's working"

@app.route('/social/<backend>/', methods=['POST'])
@psa()
def exchange_token(backend):
    access_token = request.get_json().get('access_token')
    if not access_token:
        return jsonify({ 'error': True })
    try:
        user = g.backend.do_auth(access_token)
        token = Token.query.filter(Token.user_id == user.id).first()

        if not token:
            key = binascii.hexlify(os.urandom(20)).decode()
            token = Token(key=key, user_id=user.id)
            db.session.add(token)
            db.session.commit()

        return jsonify({ 'token': token.key });
    except Exception as e:
        print(e)
        return jsonify({ 'error': True })

@app.route('/api/messages', methods=['GET'])
def get_messages(message_id=None):
    # TODO add paging because right now you could query
    # for and return ALL messages, which is nuts.
    limit = request.args.get('limit')
    after = request.args.get('after', '1/1/70')
    try:
        timestamp = convert_to_timestamp(after)
    except ValueError:
        return jsonify({
            'error': "date not formatted correctly. Received: {} Expected: mm/dd/yy".format(after)
        })

    messages = Message.query.order_by(Message.timestamp.asc()).filter(Message.timestamp>timestamp).limit(limit).all()
    messages = [m.to_api_dict() for m in messages]

    return jsonify({
        'count': len(messages),
        'messages': messages
    })

@app.route('/api/messages/<message_id>', methods=['GET'])
def get_message(message_id=None):
    message = Message.query.filter_by(id=message_id).first()
    if message is None:
        return abort(404)

    return jsonify({'message': message.to_api_dict()})

@app.route('/api/activity', methods=['GET'])
def get_activity():
    sql = text(
        """
        SELECT date_trunc('day', timestamp at time zone 'PDT') as date, count(1)
        from messages where timestamp > (current_date - 365)
        group by date
        order by date asc;
        """
    )
    date_counts = db.session.execute(sql).fetchall()

    date_to_count = {}
    for date_count in date_counts:
        datetime, count_long = date_count
        date_str = datetime.strftime('%Y%m%d')
        date_to_count[date_str] = int(count_long)

    return jsonify({
        'date_to_count': date_to_count
    })
