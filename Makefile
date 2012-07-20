SHELL := /bin/bash

test:
	@node_modules/.bin/autolint --once
	@node -e "require('urun')('test');"

compile: test
	@nomo
	@node_modules/.bin/uglifyjs listen.js > listen.min.js

.PHONY: test
