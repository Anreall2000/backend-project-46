JEST=NODE_OPTIONS=--experimental-vm-modules npx jest

install:
	npm ci

publish:
	npm publish --dry-run

test:
	$(JEST)

coverage:
	$(JEST) --coverage

lint:
	npx eslint .

.PHONY: install publish coverage lint