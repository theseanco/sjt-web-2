/*

This component returns a div that has:

- A loop, determined by the props provided
- A button, which stops and starts the loop
- Some sets of text which display information about the loop.

*/


import React from 'react';
//import './require.js'
//import bonsai from 'bonsai'
// import './bonsai_square_events.js';
//class to generate loop of notes
import createNotesAndSquares from "./createSquaresNotes.js";
//Steinhaus Johnson Trotter permutation algorithm
import './SJT.js';
import Tone from 'tone';


class SJTUnit extends React.Component {

  constructor(props) {
    super(props);
  }

  loopStop = (loop) => {
    loop.stop(0)
  }

  loopStart = (loop) => {
    loop.start("+0.1")
  }

  //This is a function which takes an object containing properties of the SJT loop to be created. This is then created using createNotesAndSquares.
  createLoop = (stuff) => {
    console.log("bang")
    return(
    createNotesAndSquares(
      stuff.noteArray,
      stuff.offsetsOn,
      stuff.offsetNumbers,
      stuff.initialIteration,
      stuff.noteLength
    )
  )
  }

  //for testing, not relevant just now
  createDefaultLoop = (stuff) => {
    console.log("bang")
    return(
    createNotesAndSquares()
  )
  }

  //THIS NEEDS TO BE DONE DYNAMICALLY


//	  Tone.Transport.start();
  render() {

    const loopOne = this.createLoop(
      {
        noteArray: [0,1,2,3,4],
        offsetsOn: [true],
        offsetNumbers: [50],
        initialIteration: 0,
        noteLength: "8n"
      }
    )

  return (
    <div className="thisDiv" >
      Thigins
      {/* This could be extracted out into a play/stop button. */}
      <button onClick={() => this.loopStart(loopOne[0])}>Play Loop</button>
      <button onClick={() => this.loopStop(loopOne[0])}>Stop Loop</button>
    </div>
  )
}
}

export default SJTUnit
