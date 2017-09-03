import binascii
import os
from app import app, db
from app.models import Token
from flask import g, jsonify, request, Response
from social_core.actions import do_auth
from social_flask.utils import psa
from app.api import api

@app.route('/')
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

@app.route('/api/poop/', methods=['POST'])
@api
def poop():
    return jsonify({ 'hello': True })
