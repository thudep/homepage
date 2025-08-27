# 背景图部分
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

# logs部分
website/logs:
	@mkdir -p $@
	mdbook build content/logs -d $(CURDIR)/$@

# 构建与预览部分
.PHONY: all serve

all: banners website/logs
	$(MAKE) -C website/index show.json
	$(MAKE) -C website/members html
	$(MAKE) -C website/events html
	$(MAKE) -C website/publicity publicity.json

serve: all
	python website/serve.py

# 清理与重建部分
.PHONY: clean remake reload

clean: clean_banners
	$(MAKE) -C website/index clean
	$(MAKE) -C website/members clean
	$(MAKE) -C website/events clean
	$(MAKE) -C website/publicity clean
	rm -rf website/logs

remake: clean all

reload: clean serve
