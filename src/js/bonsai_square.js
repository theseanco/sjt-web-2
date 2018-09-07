/*

Code to make a pulsing square using bonsai.js

Trying to make an animate that can be called from within Tone.js

The trick to this is to control the easing. I want the squares to go from 0.3 opacity to 1 opacity then 0.3 opacity again.

There's a list of types of easing here http://docs.bonsaijs.org/overview/Easing.html.
But it's actually easier

According to the Execution documents, any code executed within the `bonsai.run` statement is stringified and run in a different context to the rest of the code.

http://docs.bonsaijs.org/overview/Execution.html

In order to communicate with Bonsai you need to use this method of communication:

http://docs.bonsaijs.org/overview/Communication.html

*/

//currently hardcoded but will be abstracted out
const elementName = 'movie';
const elementWidth = document.getElementById(elementName).clientWidth;
const elementHeight = document.getElementById(elementName).clientHeight;

console.log(elementWidth, elementHeight)

bonsai.run(document.getElementById(elementName), {
        code: function() {

            //create the rectangle
      var rect = new Rect(10, 10, 30, 30)
        .addTo(stage)
        .attr({fillColor: 'green', opacity: 0.5})

        //the keyframe animation to symbolise 'played'
        var animation = new KeyframeAnimation('.5s', {
          from: {opacity: 0.5},
          '5%': {opacity: 1},
          to: {opacity: 0.5}
        });

        rect.animate(animation)

    },
    width: elementWidth,
    height: elementHeight
  });
