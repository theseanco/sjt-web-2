
//TODO: Maybe offsets don't need to be generated in an array
//Class for generating notes
import NoteInfoGenerator from "./NoteInfoGenerator.js";
import Tone from 'tone';
import permute from './SJT.js';
import Konva from 'konva';



//callback function added in order to pass information out of scope that allows animation
//After the callback there are attributes which will determine the colour of block to animate
const creatorFunction = (noteArray = [0,3,7,12], offsetsOn = [true], offsetNumbers = [50], initialIteration = 0, noteLength = '4n', callback, elementName = "konva-test", blockColour = "#FFFFFF") => {

var synth = new Tone.PolySynth().toMaster();
let numberOfVoices = 1;
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



/*
*
*
* KONVA CODE STARTS HERE.
*
* initially attempted based on https://konvajs.github.io/docs/animations/Rotation.html
*
*
*/

const konvaWidth = document.getElementById(elementName).offsetWidth;
const konvaHeight = document.getElementById(elementName).offsetHeight;

const stage = new Konva.Stage({
  container: elementName,
  width: konvaWidth,
  height: konvaHeight
});

const layer = new Konva.Layer();

console.log(stage);

let availableRects = [];
//TODO: adapt this to spawn dynamically

let i;
for(i=0; i<totalRects; i++){
  availableRects.push(new Konva.Rect({
    x: (konvaWidth/totalRects*i),
    y: 0,
    width: (konvaWidth/totalRects),
    height: konvaHeight,
    fill: blockColour,
  opacity: 0.2}))
}
console.log(availableRects);

//A for loop to create rectangles and add tweening animations to them.
for (i=0; i<totalRects; i++) {
  layer.add(availableRects[i])
  }

  //a function to add a tween to a square. This needed to be created in order to get availableRects correctly assigned.
  //This could do with being refactored as it's quite messy.
  const addTween = (index, availableRects) => {
    availableRects[index].tween = new Konva.Tween({
    node: availableRects[index],
    opacity: 1,
    easing: Konva.Easings.EaseOut,
    duration: 0.1,
    onFinish: function() {
     availableRects[index].tween.reverse()
   }
 })
console.log("tween added to index", index);
}

 // this now works with the above function
 // TODO: Refactor this, it's dependent on side-effects and is quite messy
for (i=0; i<totalRects; i++) {
  addTween(i,availableRects);
}

stage.add(layer);


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

    console.log(voiceArray[0].generationIndex)
    /*

    An extremely ugly function which uses the current note playing and plots it
    against the original voice array to determine which note of the original voice array
    is playing. this is used to visualise the playing of each particular note
    */
    availableRects[noteArray.indexOf(voiceArray[0].note)].tween.play()
    /*
    //UNCOMMENT THIS FOR DEBUGGING
    console.log(voiceArray[0], offsets);
    */
    callback(voiceArray[0])

}, noteLength) , voiceArray[0]]
)
}

export default creatorFunction
