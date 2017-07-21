from app import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    avatar_url = db.Column(db.Text())
    username = db.Column(db.Text())
    email = db.Column(db.Text())
    first_name = db.Column(db.Text())
    last_name = db.Column(db.Text())


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text())
    body = db.Column(db.Text())
    label = db.Column(db.Text())  # "chats"
    message_id = db.Column(db.Text(), unique=True)
    pruned = db.Column(db.Text())
    timestamp = db.Column(db.Text())
    subject = db.Column(db.Text())
    thread_id = db.Column(db.Text())

class Token(db.Model):
    __tablename__ = "tokens"
    key = db.Column(db.Text(), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Media(db.Model):
    __tablename__ = "media"

    id = db.Column(db.Integer, primary_key=True)
    media_type = db.Column(db.Text())
    message_id = db.Column(db.Integer, db.ForeignKey('messages.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.Text())
    url = db.Column(db.Text())
