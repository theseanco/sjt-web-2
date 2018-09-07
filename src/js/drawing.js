/*

TODO:

Consolidate drawing.js and bonsai_square.js, abstract out any hardcoded elements

*/



//this looks like shit.
import NoteInfoGenerator from "./NoteInfoGenerator.js";

//add to the drawing div
const noteArray = [0,1,2,3,4];
var synth = new Tone.PolySynth().toMaster();
//number of voices to create, each will be instantiated as a new class
let numberOfVoices = 4;

//Function to permute available notes
const permuteNotes = (notesToPermute) => {
  return permute.all(notesToPermute)
}

//Function to create an array of notes based on Gthe number of boxes checked or something.
//This would need to take an array of booleans and an array of numbers.
//Then use a map on the array of booleans to create a new array.
//This can be used to generate note offsets as well as iteration offsets
//this also checks if the number of booleans exceeds the number of values, and adds a 0 by typechecking if so.
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
    voicesArray.push(new NoteInfoGenerator(notePermutations));
  }
  return voicesArray
}

//generate an array of synths to be used
const voiceArray = generateVoices(numberOfVoices)

//taken from https://tonejs.github.io/docs/r12/Loop
var loop = new Tone.Loop(function(time){
    //an array of offsets
    const offsets = [50, 57, 38, 62]
    //a map function which plays the note of every index of array of SJT classes and then returns them.
    const midiNoteArray = voiceArray.map((data,i) => {
      voiceArray[i].playNote();
      return(Tone.Frequency(data.note+offsets[i],"midi"))
    })
    synth.triggerAttackRelease(midiNoteArray,"8n");

    //THIS WORKS ON THE BONSAI SQUARE. This seems to be out of scope, but it does work
    //There's a problem, in that the generation index doesn't show the position AFTER the iterations, it just goes from 0 -> end
    //The new note needs to be compared to the generation array
    //This is done using indexOf: noteArray.indexOf(voiceArray[0].note)
    movie.sendMessage('animateSquare', {
      square: noteArray.indexOf(voiceArray[0].note)
    })

}, "8n").start(0);

//UNCOMMENT TO START
//Tone.Transport.start();
