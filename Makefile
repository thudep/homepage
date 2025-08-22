.PHONY: all serve

all:
	$(MAKE) -C website/INDEX/members html

serve: all
	python website/serve.py
