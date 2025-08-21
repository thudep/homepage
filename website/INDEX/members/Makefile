.PHONY: html

members.json:
	python csv2json.py

html: members.json
	python json2html.py

.PHONY: clean

clean:
	rm members.json
	find member -type f ! -name '.gitignore' ! -name 'template.html' -delete
