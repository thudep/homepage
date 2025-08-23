.PHONY: all serve

all:
	$(MAKE) -C website/members html

serve: all
	python website/serve.py

.PHONY: clean remake reload

clean:
	$(MAKE) -C website/members clean

remake: clean all

reload: clean serve
