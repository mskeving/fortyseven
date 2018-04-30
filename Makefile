SHELL = /bin/bash

GIT_ROOT := $(shell git rev-parse --show-toplevel)
VAULT_PASSWORD_FILE := $(GIT_ROOT)/.vault-password-file
SECRETS_ENCRYPTED := $(GIT_ROOT)/config/secrets.encrypted
SECRETS_DECRYPTED := $(GIT_ROOT)/config/secrets.py
VAULT_OPTIONS := --vault-password-file $(VAULT_PASSWORD_FILE)

.PHONY: dev prod frontend secrets decrypt setup install

dev:
	python dev.py

prod:
	python prod.py

frontend:
	cd frontend && npm run start

secrets:
	ansible-vault edit $(VAULT_OPTIONS) $(SECRETS_ENCRYPTED)
	$(MAKE) decrypt

decrypt:
	ansible-vault decrypt $(VAULT_OPTIONS) $(SECRETS_ENCRYPTED) --output $(SECRETS_DECRYPTED)

setup:
	$(MAKE) install
	$(MAKE) decrypt

install:
	pip install -U -r requirements.txt
	cd frontend && yarn install

db-up:
	aws --profile fortyseven --region us-west-1 rds start-db-instance --db-instance-identifier fortyseven
	aws --profile fortyseven --region us-west-1 rds wait db-instance-available --db-instance-identifier fortyseven

db-down:
	aws --profile fortyseven --region=us-west-1 rds stop-db-instance --db-instance-identifier fortyseven

db-status:
	aws --profile fortyseven --region us-west-1 rds describe-db-instances --db-instance-identifier fortyseven | jq '.DBInstances[0].DBInstanceStatus'
