import app
from app.models import User
from config.secrets import USER_INFO_BY_EMAIL

db = app.db


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


def is_exclusive():
    """
    Exclude any messages that have other recipients on the email. For
    Example, if there are CCs or other email addresses in the TO field.

    returns True if email is exclusive between known emails.
    """
    pass


if __name__ == "__main__":
    create_or_update_users()