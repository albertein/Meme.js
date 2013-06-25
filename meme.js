/*
Meme.js
=======

Use one function to generate a meme, returns a meme object to manipulate the text of the meme.

You can call it all with strings:

     var meme = Meme('dog.jpg', 'containerID', 'Buy pizza, 'Pay in snakes');

Or with a selected container element:

     var container = document.getElementById('containerID');
     var meme = Meme('wolf.jpg', container, 'The time is now', 'to take what\'s yours');

Or with a jQuery/Zepto selection:

     var meme = Meme('spidey.jpg', $('#containerID'), 'Did someone say', 'Spiderman JS?');

You can also pass in an image:

     var img = new Image();
     img.src = 'insanity.jpg';
     var container = document.getElementById('containerID');
     var meme = Meme(img, container, 'you ignore my calls', 'I ignore your screams of mercy');

Once you have a meme object you can update it's text:
		
		meme.setText('Top text', 'Bottom text');

The meme function dinamically creates and loads the canvas needed and insert them into the container element given.

********************************************************************************

Copyright (c) 2012 BuddyMeme

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

window.Meme = function(image, container, topText, bottomText) {


	/*
	Deal with the canvas
	*/

	// If it's nothing, set it to a dummy value to trigger error
	if (!container)
		container = 0;

	// If it's a string, conver it
	if (container.toUpperCase)
		container = document.getElementById(container);

	// If it's jQuery or Zepto, convert it
	if (($) && (container instanceof $))
		container = container[0];

	// Throw error
	if (!(container instanceof HTMLElement))
		throw new Error('No container selected');

	var imageCanvas = document.createElement("CANVAS");
	var textCanvas = document.createElement("CANVAS");
	container.appendChild(imageCanvas);
	container.appendChild(textCanvas);

	container.style.position = "relative";
	imageCanvas.style.position = textCanvas.style.position = "absolute";
	imageCanvas.style.left = textCanvas.style.left = "0";
	imageCanvas.style.top = textCanvas.style.top = "0";

	// Get context
	var imageContext = imageCanvas.getContext('2d');
	var textContext = textCanvas.getContext('2d');

	/*
	Deal with the image
	*/

	// If there's no image, set it to a dummy value to trigger an error
	if (!image)
		image = 0;

	// Convert it from a string
	if (image.toUpperCase) {
		var src = image;
		image = new Image();
		image.src = src;
	}

	// Set the proper width and height of the canvas
	var setCanvasDimensions = function(w, h) {
		imageCanvas.width = textCanvas.width = w;
		imageCanvas.height = textCanvas.height = h;
	};
	setCanvasDimensions(image.width, image.height);	

	/*
	Draw a centered meme string
	*/

	var drawText = function(text, topOrBottom, y) {
		// Variable setup
		var canvas = textCanvas;
		var context = textContext;
		topOrBottom = topOrBottom || 'top';
		var fontSize = (canvas.height / 8);
		var x = canvas.width / 2;
		if (typeof y === 'undefined') {
			y = fontSize;
			if (topOrBottom === 'bottom')
				y = canvas.height - 10;
		}

		// Should we split it into multiple lines?
		if (context.measureText(text).width > (canvas.width * 1.1)) {

			// Split word by word
			var words = text.split(' ');
			var wordsLength = words.length;

			// Start with the entire string, removing one word at a time. If
			// that removal lets us make a line, place the line and recurse with
			// the rest. Removes words from the back if placing at the top;
			// removes words at the front if placing at the bottom.
			if (topOrBottom === 'top') {
				var i = wordsLength;
				while (i --) {
					var justThis = words.slice(0, i).join(' ');
					if (context.measureText(justThis).width < (canvas.width * 1.0)) {
						drawText(justThis, topOrBottom, y);
						drawText(words.slice(i, wordsLength).join(' '), topOrBottom, y + fontSize);
						return;
					}
				}
			}
			else if (topOrBottom === 'bottom') {
				for (var i = 0; i < wordsLength; i ++) {
					var justThis = words.slice(i, wordsLength).join(' ');
					if (context.measureText(justThis).width < (canvas.width * 1.0)) {
						drawText(justThis, topOrBottom, y);
						drawText(words.slice(0, i).join(' '), topOrBottom, y - fontSize);
						return;
					}
				}
			}

		}

		// Draw!
		context.fillText(text, x, y, canvas.width * .9);
		context.strokeText(text, x, y, canvas.width * .9);

	};

	/*
	Do everything else after image loads
	*/

	image.onload = function() {
		var canvas = imageCanvas;
		// Set dimensions
		setCanvasDimensions(this.width, this.height);

		// Draw the image
		imageContext.drawImage(image, 0, 0);

		// Set up text variables
		textContext.fillStyle = 'white';
		textContext.strokeStyle = 'black';
		textContext.lineWidth = 2;
		var fontSize = (canvas.height / 8);
		textContext.font = fontSize + 'px Impact';
		textContext.textAlign = 'center';
		if (topText)
			drawText(topText, 'top');
		if (bottomText)
			drawText(bottomText, 'bottom');

	};
	return {
		setText: function(topText, bottomText) {
			textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
			drawText(topText, 'top');
			drawText(bottomText, 'bottom');
		}
	};
};
