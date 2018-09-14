
//TODO: Maybe offsets don't need to be generated in an array
//Class for generating notes
import NoteInfoGenerator from "./NoteInfoGenerator.js";
import Tone from 'tone';
import permute from './SJT.js'


const creatorFunction = (noteArray = [0,3,7,12], offsetsOn = [true], offsetNumbers = [50], initialIteration = 0, noteLength = '8n', elementName = 'movie') => {

var synth = new Tone.PolySynth().toMaster();
let numberOfVoices = 1;
//TODO: Once Bonsai is working, pass these in dynamically as props
//const elementWidth = document.getElementById(elementName).clientWidth;
//const elementHeight = document.getElementById(elementName).clientHeight;
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
//TODO: get Bonsai working
/*
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
        const totalWidth = data.width-30;
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
*/


//This is returned so that the loop can be referenced. It also triggers the rest of the loop which is in scope.
return (
  [new Tone.Loop(function(time){
    //an array of offsets
    const offsets = createOffsetArray(offsetsOn, offsetNumbers)
    //a map function which plays the note of every index of array of SJT classes and then returns them.
    const midiNoteArray = voiceArray.map((data,i) => {
      voiceArray[i].playNote();
      return(Tone.Frequency(data.note+offsets[i],"midi"))
    })
    synth.triggerAttackRelease(midiNoteArray,noteLength);
    /*
    UNCOMMENT THIS FOR DEBUGGING
    console.log(voiceArray[0], offsets);
    */
}, noteLength) , voiceArray[0]]
)
}

export default creatorFunction
