from app import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    avatar_url = db.Column(db.Text())
    email_address = db.Column(db.Text())
    first_name = db.Column(db.Text())
    last_name = db.Column(db.Text())


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text())
    body = db.Column(db.Text())
    message_id = db.Column(db.Text(), unique=True)
    pruned = db.Column(db.Text())  # without quoted replies
    send_time_unix = db.Column(db.Text())  # unix
    subject = db.Column(db.Text())
    thread_id = db.Column(db.Text())
    type = db.Column(db.Text())  # "email" or "chat"
