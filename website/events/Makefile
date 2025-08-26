EVENTS := ../../content/events

.PHONY: html

html:
	python3 md2html.py $(EVENTS)
	cp $(EVENTS)/cover_img/*.png .
	cp -r $(EVENTS)/img img

.PHONY: clean

clean:
	rm -f events.json
	find . -type f -name "*.png" -delete
	rm -rf img
	find event -type f ! -name '.gitignore' ! -name 'template.html' -delete
