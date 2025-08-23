.PHONY: banners clean_banners

BANNERS := $(shell find content -type f -name "banner.jpg")

banners:
	@for f in $(BANNERS); do \
		name=$${f#content/}; \
		name=$$(echo "$$name" | sed 's,/,-,g'); \
		echo "cp $$f website/img/$$name"; \
		cp "$$f" "website/img/$$name"; \
	done

clean_banners:
	find  website/img -type f -name "*banner*" -delete

.PHONY: all serve

all: banners
	$(MAKE) -C website/members html

serve: all
	python website/serve.py

.PHONY: clean remake reload

clean: clean_banners
	$(MAKE) -C website/members clean

remake: clean all

reload: clean serve
