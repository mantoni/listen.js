SHELL := /bin/bash

default: lint test

lint:
	@node_modules/.bin/autolint --once

.PHONY: test
test:
	@node -e "require('urun')('test');"

phantom:
	@browserify test/fixture/browserify.js `ls test/test-*` | node_modules/.bin/phantomic

browser:
	@cp test/fixture/test-pre.html test/all.html
	@browserify test/fixture/browserify.js `ls test/test-*` >> test/all.html
	@cat test/fixture/test-post.html >> test/all.html
	@open test/all.html

compile: lint test phantom
	@browserify lib/listen.js -s listen -o listen.js
	@node_modules/.bin/uglifyjs listen.js > listen.min.js

version = $(shell node -e "console.log(require('./package.json').version)")
folder  = listen-${version}

package: compile
	@echo "Creating package ${folder}.tgz"
	@mkdir ${folder}
	@mv listen.js listen.min.js ${folder}
	@cp LICENSE README.md ${folder}
	@tar -czf ${folder}.tgz ${folder}
	@rm -r ${folder}

release:
ifeq (v${version},$(shell git tag -l v${version}))
	@echo "Version ${version} already released!"
	@exit 1
endif
	@make package
	@echo "Creating tag v${version}"
	@git tag -a -m "Release ${version}" v${version}
	@git push --tags
	@echo "Publishing to NPM"
	@npm publish
