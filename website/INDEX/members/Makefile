.PHONY: html all

Members.json:
	python members.py

html: Members.json
	python member_html.py

all: html

.PHONY: clean

clean:
	rm Members.json
	find member -type f ! -name '.gitignore' ! -name 'template.html' -delete
