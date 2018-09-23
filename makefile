install:
	@echo "[INFO] Installing Dependences"
	@npm install
	@npm install --only=dev

publish:
	npm publish --access=public