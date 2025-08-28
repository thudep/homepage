EVENTS := ../../content/events

events.json:
	python3 md2html.py $(EVENTS)
	cp $(EVENTS)/cover_img/*.png .
	if [ -d "$(EVENTS)/img" ]; then cp -r $(EVENTS)/img img; fi

../members/members.json:
	$(MAKE) -C ../members members.json

OTHERS := ../../content/events/others.csv

.PHONY: json

json: events.json ../members/members.json
	python csv2json.py $(OTHERS) $^

.PHONY: clean

clean:
	rm -f events.json
	find . -type f -name "*.png" -delete
	rm -rf img
	find event -type f ! -name '.gitignore' ! -name 'template.html' -delete
