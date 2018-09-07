/*

This is a version of bonsai_square that uses Communication

It gets information about the size of the div at the start of the render with the divProperties message

TODO:

Turn this into a gradient
Integrate it with the SJT function


*/

const elementName = 'movie';
const elementWidth = document.getElementById(elementName).clientWidth;
const elementHeight = document.getElementById(elementName).clientHeight;
const totalRects = 5;

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
        /*
        //test adding a square to the div
        availableRects.push(new Rect(10, 10, totalWidth/8, totalHeight)
          .addTo(stage)
          .attr({fillColor: 'green', opacity: 0.5}))
        */
        for(i=0; i<totalRectsData; i++) {
          console.log("fhsjk")
          //THIS NEEDS COMPANSATING FOR THE GRID
          availableRects.push(new Rect(10 + (totalWidth/totalRectsData*i),10,totalWidth/totalRectsData,totalHeight)
          .attr({fillColor: 'green', opacity: 0.5}))
        }

        stage.children(availableRects)

      });

      stage.on('message:createRects', function(data) {
        const totalRects = data.totalRects;
        console.log("Rects Created?");
        availableRects.push(new Rect(10,10,totalWidth/8,totalHeight)
        .addTo(stage)
        .attr({fillColor: 'green', opacity: 0.5}))
        console.log(availableRects)
      })

      stage.sendMessage('ready', {});

      /*
      var rect = new Rect(10, 10, 30, totalWidth)
      .addTo(stage)
      .attr({fillColor: 'green', opacity: 0.5})
      */

      //the keyframe animation to symbolise 'played'
      var animation = new KeyframeAnimation('.5s', {
        from: {opacity: 0.5},
        '5%': {opacity: 1},
        to: {opacity: 0.5}
      });

      stage.on('message:animateSquare', function(data) {
        availableRects[0].animate(animation)
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

//animation needs to be triggered asynchronously, so here's a quick test. this will eventually be integrated into the SJT process.
setTimeout(() => {
  console.log("bang");
  movie.sendMessage('animateSquare', {
      nodeData: true
    })}, 3000);
