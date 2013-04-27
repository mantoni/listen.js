SHELL := /bin/bash

default: lint test phantom browser

bin   = node_modules/.bin
tests = ./test/fixture/utest.js `ls ./test/test-*`
html  = test/all.html

lint:
	@node_modules/.bin/autolint --once

.PHONY: test
test:
	@node -e "require('urun')('test');"

phantom:
	@${bin}/browserify ${tests} | ${bin}/phantomic

browser:
	@${bin}/consolify ${tests} > ${html}

compile: lint test phantom browser
	@${bin}/browserify lib/listen.js -s listen -o listen.js
	@${bin}/uglifyjs listen.js > listen.min.js

version = $(shell node -e "console.log(require('./package.json').version)")
folder  = listen-${version}

package: compile
	@echo "Creating package ${folder}.tgz"
	@mkdir ${folder}
	@mv listen.js listen.min.js ${folder}
	@cp LICENSE README.md ${folder}
	@cp test/all.html ${folder}/tests.html
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
