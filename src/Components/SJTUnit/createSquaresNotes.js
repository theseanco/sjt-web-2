
//TODO: Clean up TestScaleArray, call it something else
//Class for generating notes
import NoteInfoGenerator from "./NoteInfoGenerator.js";
import Tone from 'tone';
import permute from './SJT.js';
import Konva from 'konva';
import {transpose, Scale} from 'tonal';

//callback function added in order to pass information out of scope that allows animation
//After the callback there are attributes which will determine the colour of block to animate
const creatorFunction = (noteArray = [0,3,7,12], offsetsOn = [true], offsetNumbers = [50], initialIteration = 0, noteLength = '4n', callback, elementName = "konva-test", blockColour = "#FFFFFF") => {

var synth = new Tone.PolySynth().toMaster();
let numberOfVoices = 1;
const totalRects = noteArray.length;

//Function to turn a degree list, key, root note and octave into a sorted array of notes.
const generateScaleArray = (degreeList = [0, 1, 4, 8], key = "minor", rootNote = "C", octave = "4") => {
  //Holding values for a scale (empty array to allow .concat method) and a final value
  let scale = [], indexedScale;
  //Returns how many degrees are in the scale to see how many octaves need to be generated
  const scaleLength = Scale.notes(`${rootNote}${octave} ${key}`).length
  //See which octave boundaries degrees fall into
  const maxIndex = Math.max(...degreeList);
  //If statement which either generates one octave or generates multiple octaves.
  if (maxIndex < scaleLength) {
    scale = Scale.notes(`${rootNote}${octave} ${key}`)
  } else {
    //Get the number of octaves to generate, this is +1 as it is zero-indexed
    let numTimes = Math.floor(maxIndex/scaleLength)+1;
    //holding value for generated scales to be concatenated onto the empty `scale` array
    let newScale;
    //Work out if more scales are needed, and generate them accordingly, appending them to the empty `scale` variable
    for(i=0; i<=numTimes; i++) {
      newScale = Scale.notes(`${rootNote}${String(parseInt(octave)+i)} ${key}`);
      scale = scale.concat(newScale);
    }
  }
  //Select which indexes of the generated scale list needs to be returned in the final processed array
  indexedScale = degreeList.map(index => scale[index])
  return(indexedScale)
}



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
const generateVoices = (numberOfVoices, arrayOfNotes, initialIteration) => {
  let voicesArray = [];
  let i=0;
  const notePermutations = permuteNotes(arrayOfNotes);
  for (i=0; i<numberOfVoices; i++) {
    voicesArray.push(new NoteInfoGenerator(notePermutations, initialIteration));
  }
  return voicesArray
}

const arrayNoteNames = generateScaleArray(noteArray)
//generate an array of synths to be used
const voiceArray = generateVoices(numberOfVoices, arrayNoteNames, initialIteration)

console.log("voice array: ",voiceArray)
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

let availableRects = [];

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
    //TODO: Why do we need this? It's called MIDINoteArray, but that's probably not necessary.
    //TODO: Rewrite this.
    const midiNoteArray = voiceArray.map((data,i) => {
      voiceArray[i].playNote();
      //Old return which returns this as a frequency - Used for converting MIDI only.
      /*
      return(Tone.Frequency(data.note))
      */
      return(data.note)
    })
    synth.triggerAttackRelease(midiNoteArray[0], noteLength)
    /*
    An extremely ugly function which uses the current note playing and plots it
    against the original voice array to determine which note of the original voice array
    is playing. this is used to visualise the playing of each particular note
    */
    availableRects[arrayNoteNames.indexOf(voiceArray[0].note)].tween.play();
    /*
    //UNCOMMENT THIS FOR DEBUGGING
    console.log(voiceArray[0], offsets);
    */
    callback(voiceArray[0])

}, noteLength) , voiceArray[0]]
)
}

export default creatorFunction
