manual.pdf:
	typst compile manual.typ

.PHONY: clean remake

clean:
	rm -f manual.pdf

remake: clean
	typst compile manual.typ 2> test-warning.log
