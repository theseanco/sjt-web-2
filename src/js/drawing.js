//this looks like shit.
import TranslationGroup from "./TranslateGroup.js";
import NoteInfoGenerator from "./NoteInfoGenerator.js";

//add to the drawing div
var elem = document.getElementById('drawing');
const noteArray = [0,5,10,1];
var synth = new Tone.PolySynth().toMaster();
//number of voices to create, each will be instantiated as a new class
let numberOfVoices = 4;

//Function to permute available notes
const permuteNotes = (notesToPermute) => {
  return permute.all(notesToPermute)
}

//for loop to generate an array of permutation classes. This should be a function in itself so that it can be refreshed if needs be.
const generateVoices = (numberOfVoices) => {
  let voicesArray = [];
  let i=0;
  const notePermutations = permuteNotes(noteArray);
  for (i=0; i<numberOfVoices; i++) {
    voicesArray.push(new NoteInfoGenerator(notePermutations));
  }
  return voicesArray
}

//generate an array of synths to be used
const voiceArray = generateVoices(numberOfVoices)

//create the window used to draw with two.js, inheriting the dimensions of the div
var two = new Two({
  width: elem.offsetWidth,
  height: elem.offsetHeight,
  autostart: true
}).appendTo(elem);

/*

Failure
//adding a decrementormethod to the group to make it jump off of the screen

*/

var circle = two.makeCircle(100, two.height, 40);
var rect = two.makeRectangle(230, two.height, 50, 50);
var translation = 0;
var group = two.makeGroup(circle,rect)

two.bind('update', function(frameCount) {
  //translationGroup.decrement()
});

//LOOP in which SJT will go.
//This needs basically to increment something on loop only, nothing more.
//The rest should be abstracted out.

//taken from https://tonejs.github.io/docs/r12/Loop

var loop = new Tone.Loop(function(time){
    //an array of offsets
    const offsets = [50, 57, 62, 53, 54]
    //a map function which plays the note of every index of array of SJT classes and then returns them.
    const midiNoteArray = voiceArray.map((data,i) => {
      voiceArray[i].playNote();
      return(Tone.Frequency(data.note+offsets[i],"midi"))
    })
    synth.triggerAttackRelease(midiNoteArray,"16n");
}, "16n").start(0);

Tone.Transport.start();
