all:
	coffee -c -j script.js -o js/ main.coffee

watch:
	coffee -w -c -j script.js -o js/ main.coffee
	
run:
	python -m SimpleHTTPServer
