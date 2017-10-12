import re
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from social_flask.routes import social_auth
from social_flask_sqlalchemy.models import init_social, PSABase
from flask_cors import CORS

from config.flask import Development


SQLALCHEMY_DATABASE_URI = Development.SQLALCHEMY_DATABASE_URI

app = Flask(__name__, template_folder='static/templates')
app.config.from_object(__name__)  # add capitalized variables above to config
app.register_blueprint(social_auth)
cors = CORS(app, origins=[re.compile('https?:\/\/localhost:[0-9]+')])

db = SQLAlchemy(app)

def create_app(config, manager=False):
    app.config.from_object('config.flask.{}'.format(config))
    app.config.from_pyfile('../config/secrets.py')
    db.init_app(app)
    if not manager:
        init_social(app, db.session)
    return app

def create_db(app):
    db.init_app(app)
    PSABase.metadata.drop_all(db.engine)
    db.drop_all()
    db.create_all()
    PSABase.metadata.create_all(db.engine)

from app import models, views
