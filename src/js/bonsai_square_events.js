/*

This is a version of bonsai_square that uses Communication

It gets information about the size of the div at the start of the render with the divProperties message

TODO:

Turn this into a gradient
Make things generate programmatically, possibly moving things over to react.

*/

const generateMovie = (totalRects) => {
const elementName = 'movie';
const elementWidth = document.getElementById(elementName).clientWidth;
const elementHeight = document.getElementById(elementName).clientHeight;

var movie = bonsai.run(
  document.getElementById(elementName),
  {
    code: function() {
      // receive data from the other side
      //array of available rectangles
      let availableRects = [];
      let totalWidth = 0;
      let totalHeight = 0;

      //This is a message which takes the properties of the div
      stage.on('message:divProperties', function(data) {
        const totalWidth = data.width;
        const totalHeight = data.height;
        const totalRectsData = data.totalRects
        for(i=0; i<totalRectsData; i++) {
          //THIS NEEDS COMPANSATING FOR THE GRID
          availableRects.push(new Rect(10 + (totalWidth/totalRectsData*i),10,totalWidth/totalRectsData,totalHeight)
          .attr({fillColor: 'red', opacity: 0.2}))
        }

        stage.children(availableRects)

      });

      stage.sendMessage('ready', {});

      //the keyframe animation to symbolise 'played'
      var animation = new KeyframeAnimation('.2s', {
        from: {opacity: 0.2},
        '5%': {opacity: 1},
        to: {opacity: 0.2}
      });

      stage.on('message:animateSquare', function(data) {
        animation.removeSubjects(availableRects)
        animation.addSubjects([availableRects[data.square]])
        animation.play();
      });

    },
    width: elementWidth,
    height: elementHeight
  },
);
// emitted before code gets executed
movie.on('load', function() {
  // receive event from the runner context
  movie.on('message:ready', function() {
    // send the window properties to bonsai.
    movie.sendMessage('divProperties', {
      width: elementWidth,
      height: elementHeight,
      totalRects: totalRects
    })
  });
});


setTimeout(() => {
  movie.sendMessage('createRects', {
      nodeData: true
    })}, 1000);
  }

export default movie
