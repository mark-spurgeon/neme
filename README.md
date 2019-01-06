News Meme generator
----

This is a simple meme generator for articles published from [topolitque.ch](http://www.topolitique.ch) destined for sharing them on various social media platforms. It is inspired from Vox's [meme project](https://github.com/voxmedia/meme), however this tool doesn't generate an image from a link, and lacks some options specific to news articles. Also, the code from vox's repo is outdated.

![neme image](https://github.com/the-duck/neme/raw/master/screenshot.png)

## The code

It is implemented solely on html5 and js, thus saving the cost of running a server side image-editing system as all the computing is done on the client side, while keeping the advantages of the web : easy usage by anyone, and continuous updates on the code.

It also doesn't require any building, as it is HTML and JS to its most basic, meaning that it is easily hackable. Feel free to steal functions that might be useful if you need to draw things like text and rounded images on canvas in the `js/functions.js` file.

##  TODO - version .2 (planned 30/01/2019):
* Change text drawing functions (prepare text, then draw, to know the size it takes) √
* Enable support for options (functions should also take into account the options) √
* Draw one image rather than all, thus skimming duplicate code √
* Implement Twitter and Facebook images (right now only insta stories and feed) ~√
* Make it more general (less focused on *TOPO*), compatible with most articles
* Fix issue when no image is found -> freezes the process, essentially due to the asynchronous nature of JS and the impossibility of findinf a good solution to not write hundreds of lines of code that do the same thing.
* Find out about multiple authors standard with `meta` tags, or other

## TODO : future
* Look into animation
