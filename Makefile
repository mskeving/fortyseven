SHELL = /bin/bash

GIT_ROOT := $(shell git rev-parse --show-toplevel)
VAULT_PASSWORD_FILE := $(GIT_ROOT)/.vault-password-file
SECRETS_ENCRYPTED := $(GIT_ROOT)/config/secrets.encrypted
SECRETS_DECRYPTED := $(GIT_ROOT)/config/secrets.py
VAULT_OPTIONS := --vault-password-file $(VAULT_PASSWORD_FILE)

.PHONY: dev prod frontend secrets decrypt setup install

db-connect:
	psql -h fortyseven.cu0htr59h67r.us-west-1.rds.amazonaws.com -d fortyseven -U fortyseven_admin	

db-down:
	aws --profile fortyseven --region=us-west-1 rds stop-db-instance --db-instance-identifier fortyseven

db-status:
	aws --profile fortyseven --region us-west-1 rds describe-db-instances --db-instance-identifier fortyseven | jq '.DBInstances[0].DBInstanceStatus'

db-up:
	aws --profile fortyseven --region us-west-1 rds start-db-instance --db-instance-identifier fortyseven
	aws --profile fortyseven --region us-west-1 rds wait db-instance-available --db-instance-identifier fortyseven

decrypt:
	ansible-vault decrypt $(VAULT_OPTIONS) $(SECRETS_ENCRYPTED) --output $(SECRETS_DECRYPTED)

dev:
	python dev.py

frontend:
	cd frontend && npm run start

install:
	pip install -U -r requirements.txt
	cd frontend && yarn install

secrets:
	ansible-vault edit $(VAULT_OPTIONS) $(SECRETS_ENCRYPTED)
	$(MAKE) decrypt

prod:
	python prod.py

setup:
	$(MAKE) install
	$(MAKE) decrypt

