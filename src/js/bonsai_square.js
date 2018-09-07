/*

Code to make a pulsing square using bonsai.js

Trying to make an animate that can be called from within Tone.js

The trick to this is to control the easing. I want the squares to go from 0.3 opacity to 1 opacity then 0.3 opacity again.

There's a list of types of easing here http://docs.bonsaijs.org/overview/Easing.html.
But it's actually easier

*/


bonsai.run(document.getElementById('movie'), {
    code: function() {

      //create the rectangle
      var rect = new Rect(10, 10, 100, 100)
        .addTo(stage)
        .attr({fillColor: 'green', opacity: 0.3})

        //the keyframe animation to symbolise 'played'
        var animation = new KeyframeAnimation('2s', {
          from: {opacity: 0.3},
          '5%': {opacity: 1},
          to: {opacity: 0.3}
        });

        rect.animate(animation)

    },
    width: document.getElementById('movie').clientWidth,
    height: document.getElementById('movie').clientHeight
  });
