# fortyseven

### Backend setup

- `$ pip install virtualenvwrapper`
- `$ mkvirtualenv -p python3 fortyseven`
- `$ workon fortyseven`
- `$ pip install -r requirements.txt`
- `$ python dev.py`

### Set up local db

- Install [psql](https://postgresapp.com/)
- `$ psql`
- `$ create database fortyseven`
- In another tab, `$ cd fortyseven/`
- `alembic upgrade head`

### Re-initialize db

- `$ cd fortyseven/`
- `$ python manage.py initdb`