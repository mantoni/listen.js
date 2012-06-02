SHELL := /bin/bash

test:
	@node -e "require('urun')('test');"

compile: test
	@nomo
	@node_modules/.bin/uglifyjs listen.js > listen.min.js

.PHONY: test
