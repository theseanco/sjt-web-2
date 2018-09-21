
//TODO: Maybe offsets don't need to be generated in an array
//Class for generating notes
import NoteInfoGenerator from "./NoteInfoGenerator.js";
import Tone from 'tone';
import permute from './SJT.js'


//callback function added in order to pass information out of scope
const creatorFunction = (noteArray = [0,3,7,12], offsetsOn = [true], offsetNumbers = [50], initialIteration = 0, noteLength = '8n', callback) => {

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
    //UNCOMMENT THIS FOR DEBUGGING
    console.log(voiceArray[0], offsets);
    */
    callback(voiceArray[0])

}, noteLength) , voiceArray[0]]
)
}

export default creatorFunction
