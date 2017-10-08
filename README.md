# fortyseven

### Backend setup

- `$ pip install virtualenvwrapper`
- `$ mkvirtualenv -p python3 fortyseven`
- `$ workon fortyseven`
- `$ make setup`
- `$ make dev`

### Set up local db

- Install [psql](https://postgresapp.com/)
- `$ psql`
- `$ create database fortyseven`
- In another tab, `$ cd fortyseven/`
- `alembic upgrade head`

### Re-initialize db

- `$ cd fortyseven/`
- `$ python manage.py initdb`

### Frontend setup

- `$ make install`
- `$ make frontend`
