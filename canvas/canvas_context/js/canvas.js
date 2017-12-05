'use strict';

//First version
//
//In this version we're using separating the data from the functions.
//This is similar in style to the code examples we first encountered
//functions.  The data was passed into the functions.

function clamp(v,min,max) {
  if(v.constructor === Number) {
    if(v < min) {
      v = min;
    }
    else if(v > max) {
      v = max;
    }
  }
  return v;
}

function setPixel(canvasImageData,canvasWidth,canvasHeight,x,y,colour = {}) {

  if(canvasImageData != null) {

    //Ensure that x and y rounded to the nearest integer.
    //Otherwise attempts to access the data array wont work
    //** fractions as array indices dont work **
    //
    x = clamp(Math.round(x), 0, canvasWidth);
    y = clamp(Math.round(y), 0, canvasHeight);

    //Compute the array offset once:
    const arrayOffset = (x + y * canvasWidth) * 4;

    //
    //The above formula converts from a 2D coordinate (x,y) to a
    //1D array index.
    //
    //Everything has to be multiplied by 4 to account for each
    //pixels is represented by 4 values [R,G,B,A].
    //
    //To understand how it better, it is generally useful to
    //draw a diargam.  Consider this 5 x 2 image:
    //
    //     0    1    2    3    4  x
    //   +----+----+----+----+----+
    // 0 |RGBA|RGBA|RGBA|RGBA|RGBA|  Each box stores a value for RED, GREEN, BLUE, ALPHA
    //   +----+----+----+----+----+  Each of these values are in the range 0 to 255.
    // 1 |RGBA|RGBA|RGBA|RGBA|RGBA|
    // y +----+----+----+----+----+
    //
    // However, it is actually stored in an array, where each element
    // of the array stores a single number for either Red, or Green, or Blue, or Alpha.
    //
    //   |<----           Row 0             ---->|<----         Row 1               ---->|
    //   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    //   | | | | | | | | | | |1|1|1|1|1|1|1|1|1|1|2|2|2|2|2|2|2|2|2|2|3|3|3|3|3|3|3|3|3|3|
    //   |0|1|2|3|4|5|6|7|8|9|0|1|2|3|4|5|6|7|8|9|0|1|2|3|4|5|6|7|8|9|0|1|2|3|4|5|6|7|8|9|
    //   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-|
    //   |R|G|B|A|R|G|B|A|R|G|B|A|R|G|B|A|R|G|B|A|R|G|B|A|R|G|B|A|R|G|B|A|R|G|B|A|R|G|B|A|
    //   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    //
    //   To get the correct element of the array, we need to know the width
    //   of the image (in this example, 5) and also that there are 4 values per colour pixel.
    //
    //   Example 1)
    //    x = 0, y = 1
    //   arrayOffset = (x + y * canvasWidth) * 4
    //               = (0 + 1 * 5) * 4
    //               = 5 * 4
    //               = 20
    //
    //   Therefore, the RED value coordinate (0,1) is 20
    //                  GREEN will be + 1 (ie. 21)
    //                  BLUE  will be + 2 (ie. 22)
    //                  ALPHA will be + 3 (ie. 23)
    //
    //   Example 2)
    //    x = 3, y = 0
    //   arrayOffset = (x + y * canvasWidth) * 4
    //               = (3 + 0 * 5) * 4
    //               = 3 * 4
    //               = 12
    //
    //   Therefore, the RED value coordinate (3,0) is 12
    //                  GREEN will be + 1 (ie. 13)
    //                  BLUE  will be + 2 (ie. 14)
    //                  ALPHA will be + 3 (ie. 15)

    //Modify the RGB data
    //
    //RED value. + 0 is unecessary, only there for consistency & clarity!
    canvasImageData.data[arrayOffset + 0] = clamp(Math.round(colour.r || 0),0,255);

    //GREEN value. + 1 is Necessary. 1 after RED is GREEN!
    canvasImageData.data[arrayOffset + 1] = clamp(Math.round(colour.g || 0),0,255);

    //BLUE value. + 2 is Necessary. 2 after RED is BLUE!
    canvasImageData.data[arrayOffset + 2] = clamp(Math.round(colour.b || 0),0,255);

    //ALPHA value. + 2 is Necessary. 2 after RED is ALPHA!
    canvasImageData.data[arrayOffset + 3] = clamp(Math.round(colour.a || 255),0, 255);
  }
  else {
    console.log("canvasImageData is null");
  }
}

window.addEventListener(
  'load',
  function() {

    //Step 1: Create and configure a new HTML5 canvas
    //
    //Note: The canvas object is a DOM object.
    //      You can't directly perform any image manipulation
    //      operations on it.
    //
    let canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 750;

    //Step 2: Add the newly created canvas object to the DOM.
    //
    document.getElementsByTagName('body')[0].appendChild(canvas);

    //Step 3: Get the canvas "context" for 2d images.
    //
    //More info: http://www.w3schools.com/tags/ref_canvas.asp
    //
    //Note: This is the object that you can use the HTML5 canvas
    //      drawing operations on, for example canvasContext.fillRect()
    //
    let canvasContext = canvas.getContext('2d');

    //Step 4: Draw some stuff...

    // Example #1: draw a filled rectangle

    //first set the fill style colour
    canvasContext.fillStyle = "#FF00FF";

    //Now specify the rectangle region to
    //fill with the fill colour.
    //
    canvasContext.fillRect(50, 50, 650, 650);

    canvasContext.fillStyle = "#2AB";
    canvasContext.fillRect(400, 10, 750, 280);

    canvasContext.fillStyle = "#BF6";
    canvasContext.fillRect(30, 100, 500, 280);




    // Example #2: Use a path to draw circle
    //
    // More info: http://www.w3schools.com/tags/canvas_arc.asp
    //
    canvasContext.strokeStyle = "red";
    canvasContext.lineWidth = 6;
    canvasContext.beginPath();
    canvasContext.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI);
    canvasContext.stroke();
    canvasContext.closePath();

    // Example #3: Write some text
    //
    // More info: http://www.w3schools.com/graphics/canvas_text.asp
    //
    canvasContext.fillStyle = "#FF0000";  //change colour
    canvasContext.font = "40pt Comic Sans MS"; //whatever font./
    canvasContext.fillText("Officially Christmas",150,300); // draw the text

    //For more 'low-level' manipulation of the image, we need
    //to get access to the colour information.

    //Step 5a: Get the current image colour data.
    //
    //More info: http://www.w3schools.com/tags/canvas_getimagedata.asp
    //
    // canvasImageData.data is an array containing the colour information.
    //
    // You need to think of them in groups of 4, where each group of
    // 4 elements in the array are the Red, Green, Blue, and Alpha values
    //
    let canvasImageData = canvasContext.getImageData(0,0,canvas.width,canvas.height);

    //Do stuff to the colour information.
    //
    //Silly example, draw 1000 randomly coloured dots.
    //
    for(let dotCount = 0; dotCount < 100050; dotCount++) {
      setPixel(
        canvasImageData,
        canvas.width,
        canvas.height,
        Math.random() * canvas.width,   //X
        Math.random() * canvas.height,  //Y
        {
          r: Math.random() * 255,
          g: Math.random() * 255,
          b: Math.random() * 255
        }
      );
    }

    //Step 5b: Update the canvasContext.
    //
    //Because we've modified values in the array canvasImageData.data
    //we must commit the changes to the canvasContext.
    //
    //More info: http://www.w3schools.com/tags/canvas_putimagedata.asp
    //
    canvasContext.putImageData(canvasImageData,0,0);
  }
);

//TODO #1:
//      Change various values in the existing code.  For example, the canvas
//      width and height, text written and its position, etc.

//TODO #2:
//      For each of the examples (1 to 3) of drawing something to the canvas,
//      move the relevant statements into a function.  Test these functions.

//TODO #3:
//      Modify the functions from TODO #2 so that they receive arguments
//      appropriate to their functionality.
//      For example, the function to draw the text could receive a string
//      containing the text to actually draw instead of hardcoding the value.
//      Other things could be passed too,
//      such as colour and position.

//TODO #4:
//      Put the code that draws random dots into its own function.  One of the
//      function's arguments will be the total number of dots to draw.
//

//TODO #5:
//      Write a function that accepts as arguments text to write, position (x and y),
//      to draw at in the canvas, a colour for the text, and a background colour.
//      Using the fillRect(), fillText() methods from the canvas API the function
//      will draw the text, centered over top of a filled rectangle.  The background
//      rectangle will be 10 pixels wider and taller than the text.
//
//      You will also need to use the following canvas API method to determine
//      the width of the rectangle based upon the width of the text.
//
//      measureText() - http://www.w3schools.com/tags/canvas_measuretext.asp
//
//      Determining the height of the text is a little tricky.  For the sake of
//      simplicity, I suggest that you do this:
//
//      textDimensions.height = parseInt(canvasContext.font) * 1.5;
//
//      Where 1.5 is just an arbitrary number to account for ascending characters
//      like 'b' and descending characters like 'g'.  You may want to try
//      different values to see what gives the 'best' approximation.
//
//      Using the width, you can determine the Horizontal alignment:
//      http://www.w3schools.com/tags/canvas_textalign.asp
//
//      Vertical alignment will be based upon the height of the rectangle,
//      the fudged height of the text, and the your solution will also need
//      to be aware of how the canvasContext.fillText() and canvasContext.textBaseline
//      property work together.
//      http://www.w3schools.com/tags/canvas_textbaseline.asp
//

//TODO #6:
//      Write a function that fills the canvas data array pixels in alternating
//      colours.  The rows alternate between which colour start the alternating
//      pattern.
//
//      For example, color 1 was [Y]ellow, and colour 2 was [B]lack.
//
//      The first 2 rows would begin like this:
//
//      YBYBYB...
//      BYBYBY...

//TODO #7:
//      Write a function that makes use of the Canvas' fillRect method to draw
//      8 x 8 checkerboard pattern (like you find on a chess or draughts board).
//
//      Bonus if you can make it work with a canvas whose width and height
//      are not the same (ie. a rectangle!)
//      Hint: You need to consider the ratio betwen height and width and use
//      this value when drawing the rectangles.
