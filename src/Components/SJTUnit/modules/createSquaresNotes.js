
//TODO: Chromatic scale doesn't work.
//Class for generating notes
import NoteInfoGenerator from "./NoteInfoGenerator.js";
import Tone from 'tone';
import permute from './SJT.js';
import Konva from 'konva';
import {Scale} from 'tonal';

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
const creatorFunction = (noteArray = [0,4,7], initialIteration = 0, noteLength = '4n', scaleRootNote = "C", scaleKey="minor", scaleOctave="4",elementName = "konva-test", blockColour = "#FFFFFF", callback) => {

//Function to turn a degree list, key, root note and octave into a sorted array of notes.
const generateScaleArray = (degreeList, key = "minor", rootNote = "C", octave = "4") => {
  if (degreeList.length === 0 || degreeList === undefined) {
    degreeList = [0, 4, 7]
  }
  console.log(degreeList)
  //Holding values for a scale (empty array to allow .concat method) and a final value
  let scale = [], indexedScale;
  //Returns how many degrees are in the scale to see how many octaves need to be generated
  const scaleLength = Scale.notes(`${rootNote}${octave} ${key}`).length;
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
    for(let i=0; i<=numTimes; i++) {
      newScale = Scale.notes(`${rootNote}${String(parseInt(octave, 10)+i)} ${key}`);
      scale = scale.concat(newScale);
    }
  }

  //mapping degreeList _against_ a scale to create a new
  indexedScale = degreeList.map(index => scale[index]);

  return(indexedScale)
}

//Function to permute available notes
const permuteNotes = (notesToPermute) => {
  return permute.all(notesToPermute)
}

//This function generates a SEQUENTIAL ARRAY, and then performs STEINHAUS-JOHNSON-TROTTER on it.
const generateSynthVoice = (arrayOfNotes, initialIteration) => {
  const incrementalArray = arrayOfNotes.map((data,i) => i)
  const notePermutations = permuteNotes(incrementalArray);
  const player = new NoteInfoGenerator(notePermutations, initialIteration);
  return player
}

  //a function   to add a tween to a square. This needed to be created in order to get availableRects correctly assigned.
  //This could do with being refactored as it's quite messy.
  const addTween = (availableRects, index) => {
    console.log("index", index, "availableRects", availableRects);
    availableRects[index].tween = new Konva.Tween({
    node: availableRects[index],
    opacity: 0.8,
    easing: Konva.Easings.EaseOut,
    duration: 0.1,
    onFinish: function() {
     availableRects[index].tween.reverse()
   }
 })
}

//the synth to be used
var synth = new Tone.PolySynth().toMaster();

//if there are no usable notes, insert the defaults.
if (noteArray.length === 0 || noteArray === [] || noteArray === undefined) {
  noteArray = [0,4,7]
}
const totalRects = noteArray.length;

//This generates an array of note names. These will be referenced within the tonejs timing loop
const scaleArray = generateScaleArray(noteArray, scaleKey, scaleRootNote, scaleOctave)
//generate an array of synths to be used
let synthVoice = generateSynthVoice(scaleArray, initialIteration)
//add the initial scale by  note name to the SynthVoice object
synthVoice.initialScaleNoteNames = noteArray.map((data, i) => scaleArray[i])

//Generate Konva dimensions using JS
const konvaWidth = document.getElementById(elementName).offsetWidth;
const konvaHeight = document.getElementById(elementName).offsetHeight;

//Create stage
const stage = new Konva.Stage({
  container: elementName,
  width: konvaWidth,
  height: konvaHeight
});

const layer = new Konva.Layer();

let availableRects = [];
//THIS IS MESSY - Needs to be abstracted out into a function.

for(let i=0; i<totalRects; i++){
  availableRects.push(new Konva.Rect({
    x: (konvaWidth/totalRects*i),
    y: 0,
    width: (konvaWidth/totalRects),
    height: konvaHeight,
    fill: blockColour,
  opacity: 0.05}))
}

//A for loop to create rectangles and add tweening animations to them.
for (let i=0; i<totalRects; i++) {
  layer.add(availableRects[i]);
  addTween(availableRects, i)
}

//add the Konva layer
stage.add(layer);

//return the data to component state
callback(synthVoice);

console.log(synthVoice);

//This is returned so that the loop can be referenced. It also triggers the rest of the loop which is in scope.
return (
  new Tone.Loop(function(time){
    synthVoice.playNote();
    //uses the master SJT array to refer to notes by index against an array of note names generated earlier.
    synth.triggerAttackRelease(scaleArray[synthVoice.note], noteLength);
    availableRects[synthVoice.note].tween.play();
    //console log synthVoice for debugging if needed
    synthVoice.note = scaleArray[synthVoice.note];
    console.log(synthVoice);
    callback(synthVoice)
}, noteLength)
)
}

export default creatorFunction
