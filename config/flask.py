import os

from config.secrets import SQLALCHEMY_DATABASE_URI


class Config(object):
    CSRF_ENABLED = True
    SOCIAL_AUTH_AUTHENTICATION_BACKENDS = ( 'social_core.backends.google.GoogleOAuth2',)
    SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '159531093281-6t6pme7r12ooc4o979qgtmsalc590k6g.apps.googleusercontent.com'
    SOCIAL_AUTH_USER_MODEL = 'app.models.User'
    USER_MODEL = 'app.models.User'


class Development(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI


class Production(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', '')
