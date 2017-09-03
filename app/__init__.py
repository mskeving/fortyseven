from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='static/templates')
db = SQLAlchemy(app)

def create_app(config):
    app.config.from_object('config.flask.{}'.format(config))
    app.config.from_pyfile('../config/secrets.cfg')
    db.init_app(app)
    return app

def create_db(app):
    db.init_app(app)
    db.drop_all()
    db.create_all()

from app import models, views
