
//TODO: Chromatic scale doesn't work.
//Class for generating notes
import NoteInfoGenerator from "./NoteInfoGenerator.js";
import Tone from 'tone';
import permute from './SJT.js';
import Konva from 'konva';
import {transpose, Scale} from 'tonal';

//callback function added in order to pass information out of scope that allows animation
//After the callback there are attributes which will determine the colour of block to animate
/*

noteArray = Array of indices inputted at the start
initialIteration = Initial note number. Not sure if this is needed
noteLength = Length of the notes fed to createAttackRelease
callback = function used to pass data out of this component and be read by the SJTUnit component
elementName = id of div to create konva canvas onto
blockColour = colour of blocks to be drawn behind the SJTUnit informarion
scaleRootNote = Root note of scale to be used in Tonal scale generation (where previously indices were used)
scaleKey = Key of scale to be used in Tonal scale generation
scaleOctabe = Octave of scale to be used in Tonal scale generation

*/
const creatorFunction = (noteArray = [0,3,7,12], initialIteration = 0, noteLength = '4n', callback, elementName = "konva-test", blockColour = "#FFFFFF", scaleRootNote = "C", scaleKey="minor", scaleOctave="4") => {

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

const generateSynthVoice = (arrayOfNotes, initialIteration) => {
  const notePermutations = permuteNotes(arrayOfNotes);
  const player = new NoteInfoGenerator(notePermutations, initialIteration);
  return player
}

//TODO: This could be abstracted out into a function
const arrayNoteNames = generateScaleArray(noteArray, scaleKey, scaleRootNote, scaleOctave)
//generate an array of synths to be used
const synthVoice = generateSynthVoice(arrayNoteNames, initialIteration)

const konvaWidth = document.getElementById(elementName).offsetWidth;
const konvaHeight = document.getElementById(elementName).offsetHeight;

const stage = new Konva.Stage({
  container: elementName,
  width: konvaWidth,
  height: konvaHeight
});

const layer = new Konva.Layer();

let availableRects = [];

//THIS IS MESSY - Needs to be abstracted out into a function.

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
callback(synthVoice);

//This is returned so that the loop can be referenced. It also triggers the rest of the loop which is in scope.
return (
  [new Tone.Loop(function(time){
    synthVoice.playNote();
    synth.triggerAttackRelease(synthVoice.note, noteLength)
    /*
    An extremely ugly function which uses the current note playing and plots it
    against the original voice array to determine which note of the original voice array
    is playing. this is used to visualise the playing of each particular note
    */
    availableRects[arrayNoteNames.indexOf(synthVoice.note)].tween.play();
    //console log synthVoice for debugging if needed
    callback(synthVoice)
}, noteLength) , synthVoice]
)
}

export default creatorFunction
