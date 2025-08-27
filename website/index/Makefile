CSV_PATH = ../../content/index/show.csv

show.json:
	PYTHONPATH=../.. python -m website.index.csv2json $(CSV_PATH)

clean:
	rm -f show.json
	rm -rf __pycache__
	find . -type f -name "*.png" -delete

remake: clean show.json
