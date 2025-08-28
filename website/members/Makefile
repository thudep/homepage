.PHONY: html

members.json:
	python csv2json.py

../events/events.json:
	$(MAKE) -C ../events events.json

html: members.json ../events/events.json
	python json2html.py

.PHONY: clean

clean:
	rm -f members.json
	find member -type f ! -name '.gitignore' ! -name 'template.html' -delete
