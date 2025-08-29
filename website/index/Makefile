CSV_PATH = ../../content/index/show.csv
CACHE_DIR = ../../cache_dir

show.json:
	PYTHONPATH=../.. python -m website.index.csv2json $(CSV_PATH) $(CACHE_DIR)

clean:
	rm -f show.json
	rm -rf __pycache__
	find . -type f -name "*.png" -delete

remake: clean show.json
