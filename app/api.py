from functools import wraps
from flask import abort, request
from app import app, db
from app.models import Token
import types

def api(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        authorization = request.headers.get('Authorization')
        parts = authorization.split()
        token = Token.query.filter(Token.key == parts[1]).first()
        print(token)
        if not token:
            abort(401)
        return f(*args, **kwargs)
    return decorated
