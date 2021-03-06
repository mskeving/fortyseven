"""add index to timestamp

Revision ID: 5a99fc895bba
Revises: 4262343ecf80
Create Date: 2017-12-04 21:34:39.028642

"""

# revision identifiers, used by Alembic.
revision = '5a99fc895bba'
down_revision = '4262343ecf80'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_index(op.f('ix_messages_timestamp'), 'messages', ['timestamp'], unique=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_messages_timestamp'), table_name='messages')
    ### end Alembic commands ###
