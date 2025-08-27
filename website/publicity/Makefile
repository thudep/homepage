CSV_PATH = ../../content/publicity/publicity.csv

publicity.json:
	python csv2json_png.py $(CSV_PATH)

.PHONY: clean remake

clean:
	rm -f publicity.json
	rm -rf __pycache__
	find . -type f -name "*.png" -delete

remake: clean publicity.json
