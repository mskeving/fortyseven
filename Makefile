SHELL = /bin/bash

GIT_ROOT := $(shell git rev-parse --show-toplevel)
VAULT_PASSWORD_FILE := $(GIT_ROOT)/.vault-password-file
SECRETS_ENCRYPTED := $(GIT_ROOT)/config/secrets.encrypted
SECRETS_DECRYPTED := $(GIT_ROOT)/config/secrets.cfg
VAULT_OPTIONS := --vault-password-file $(VAULT_PASSWORD_FILE)

.PHONY: edit-secrets decrypt dev prod setup install

view-secrets:
	ansible-vault view $(VAULT_OPTIONS) $(SECRETS_ENCRYPTED)

edit-secrets:
	ansible-vault edit $(VAULT_OPTIONS) $(SECRETS_ENCRYPTED)
	$(MAKE) decrypt

decrypt:
	ansible-vault decrypt $(VAULT_OPTIONS) $(SECRETS_ENCRYPTED) --output $(SECRETS_DECRYPTED)

install:
	pip install -U -r requirements.txt

setup:
	$(MAKE) install
	$(MAKE) decrypt

dev:
	python dev.py

prod:
	python prod.py
