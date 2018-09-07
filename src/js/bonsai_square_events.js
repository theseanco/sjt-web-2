

const elementName = 'movie';
const elementWidth = document.getElementById(elementName).clientWidth;
const elementHeight = document.getElementById(elementName).clientHeight;

  var movie = bonsai.run(
    document.getElementById(elementName),
    {
      code: function() {
        // receive data from the other side
        var text = new Text().addTo(stage);
        stage.on('message:externalData', function(data) {
          text.attr('text', data.nodeData);
        });
        stage.on('message', function(data) {
          if (data.bonsai === 'tree') {
            text.attr('textFillColor', 'red');
          }
        });
        stage.sendMessage('ready', {});
      },
    width: elementWidth,
    height: elementHeight
    },
  );
  // emitted before code gets executed
  movie.on('load', function() {
    // receive event from the runner context
    movie.on('message:ready', function() {
      // send a categorized message to the runner context
      movie.sendMessage('externalData', {
        nodeData: document.getElementById('movie').innerHTML
      });
      // send just a message to the runner context
      movie.sendMessage({
        bonsai: 'tree'
      });
    });
  });
