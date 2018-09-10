//Class for generating notes
import NoteInfoGenerator from "./NoteInfoGenerator.js";

const noteArray = [0,3,7,12,11,18,30];
var synth = new Tone.PolySynth().toMaster();
var synth2 = new Tone.PolySynth().toMaster();
let numberOfVoices = 4;
const elementName = 'movie';
const elementWidth = document.getElementById(elementName).clientWidth;
const elementHeight = document.getElementById(elementName).clientHeight;
const totalRects = noteArray.length;

//Function to permute available notes
const permuteNotes = (notesToPermute) => {
  return permute.all(notesToPermute)
}

const createOffsetArray = (createOffset = [false], offsetNumber = [0,0,0,0,0,0,0]) => {
  let offsetArray = [];
  const createoffsetArray = createOffset.map((data,i) => {
    if (data) {
      offsetNumber[i] == null ? offsetArray.push(0) : offsetArray.push(offsetNumber[i])
    }
  })
  return offsetArray
}

console.log(createOffsetArray([true,true,true],[0,3,4,5]))

//for loop to generate an array of permutation classes. This should be a function in itself so that it can be refreshed if needs be.
const generateVoices = (numberOfVoices) => {
  let voicesArray = [];
  let i=0;
  const notePermutations = permuteNotes(noteArray);
  for (i=0; i<numberOfVoices; i++) {
    voicesArray.push(new NoteInfoGenerator(notePermutations, initialIteration));
  }
  return voicesArray
}

//generate an array of synths to be used
const voiceArray = generateVoices(numberOfVoices)

//movie
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


//taken from https://tonejs.github.io/docs/r12/Loop
var loop = new Tone.Loop(function(time){
    //an array of offsets
    const offsets = createOffsetArray([true,true,true,true],[30,37,42,49])
    //a map function which plays the note of every index of array of SJT classes and then returns them.
    const midiNoteArray = voiceArray.map((data,i) => {
      voiceArray[i].playNote();
      return(Tone.Frequency(data.note+offsets[i],"midi"))
    })
    synth.triggerAttackRelease(midiNoteArray,"8n");

        //OUT OF SCOPE
    movie.sendMessage('animateSquare', {
      square: noteArray.indexOf(voiceArray[0].note)
    })

}, "8n").start(0);


//UNCOMMENT TO START
//Tone.Transport.start();
