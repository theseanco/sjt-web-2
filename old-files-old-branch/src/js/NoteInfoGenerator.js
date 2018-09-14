/*

A class that handles iterating over array indexes of the Steinhaus-Johnson-Trotter algorithm

it needs:

- iterator
- generation of pattern being played
- Number within pattern
- Note to be played

*/

export default class NoteInfoGenerator {

  /*
  PROPERTIES:

  noteArray = array of notes constructed using SJT.js
  iterator = iterator for the number of notes traversed
  generation = number of permutation to return
  generationIndex = index within the permutation we are referencing
  note = note we are referenceing (noteArray[generation][generationIndex])
  scaleSize = number of entries in a scale, used to work out generation
  maxIndex = maximum index of the array. At present this is calculated dumbly, just by mutiplying the length of the two levels of the array. TODO: This could be done by using a flattening function later

  */
  constructor(noteArray, iterator = 0, generation = 0, generationIndex = 0, scaleSize = 0) {
    this.noteArray = noteArray;
    this.iterator = iterator;
    this.generation = generation;
    this.generationIndex = generationIndex;
    this.note = this.noteArray[this.generation][this.generationIndex];
    this.scaleSize = noteArray[0].length;
    this.maxIndex = this.noteArray.length * this.noteArray[0].length
  }

  //returns all relevant information as an object
  getInfo() {
    return {
      iteration: this.iterator,
      generation: this.generation,
      generationIndex: this.generationIndex,
      note: this.note,
      scaleSize: this.scaleSize
    }
  }

  //increments ONLY, does not return information, also checks to make sure the iteration isn't over the maximum. The maximum is only calculated once in the constructor so that it's not calculated multiple times to save on power
  increment() {
    this.iterator++;
    if (this.iterator >= this.maxIndex) {
      this.iterator = 0;
    }
  }

  //returns an object of information about the current note, then moves onto the next generation
  getNoteInfo() {

    //get size of scale and use it to work out how many generations have elapsed
    this.generation = parseInt(this.iterator/this.scaleSize);
    this.generationIndex = this.iterator%this.scaleSize;
    this.note = this.noteArray[this.generation][this.generationIndex]

    //return all of the relevant information to be used later on by the visuals side. 
    return {
      iteration: this.iterator,
      generation: this.generation,
      generationIndex: this.generationIndex,
      note: this.note
    }
  }

  getInformation() {
    return {
      iteration: this.iterator
    }
  }

  //there's probably a better way to do this but this will return note values as an object AND increment the iterator.
  playNote() {
    const noteInfo = this.getNoteInfo();
    this.increment()
    return noteInfo
  }
}
