from datetime import datetime

from app import db
from app.models import Message

# We originally stored timestamp as a string - ms from epoch, which
# is what we got from gmail API. This will convert that to a datetime
# object under `Message.time`. Future plan is to remove timestamp column
# and rename `time` to `timestamp`.
if __name__ == "__main__":
    print "Updating timetamps to be datetime objects"
    messages = Message.query.all()
    count = 0
    for message in messages:
        time_secs = int(message.timestamp) / 1000 # convert to seconds
        message.time = datetime.fromtimestamp(time_secs)
        db.session.add(message)
        count += 1
        print message.id

    print "commit {} changes".format(count)
    db.session.commit()

