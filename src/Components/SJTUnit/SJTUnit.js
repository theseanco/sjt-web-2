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
    /*
    properties of state:

    loopCreated = has a loop been created? Used for conditional rendering of buttons

    */
    this.state = {
      loopCreated: false,
    }
  }

  loopStop = (loop) => {
    loop.stop(0)
  }

  loopStart = (loop) => {
    loop.start("+0.1")
  }

  //This is a function which takes an object containing properties of the SJT loop to be created. This is then created using createNotesAndSquares.
  createLoop = (stuff = {
    noteArray: [0,2,5,7,12],
    offsetsOn: [true],
    offsetNumbers: [50],
    initialIteration: 0,
    noteLength: "8n"
  }) => {
    this.setState({loopCreated: true});
    console.log("created")
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
    let buttons, loop

    if (this.state.loopCreated) {
      buttons = (
        <div>
        <button onClick={() => this.loopStart(this.loop[0])}>Play Loop</button>
        <button onClick={() => this.loopStop(this.loop[0])}>Stop Loop</button>
      </div>
      )
    } else {
      buttons = (
        <div>
          <button onClick={() => {this.loop = this.createLoop()}}>Create Loop</button>
        </div>
      )
    }

  return (
    <div className="thisDiv" >
      Thigins
      {/* This could be extracted out into a play/stop button. */}
      {buttons}
    </div>
  )
}
}

export default SJTUnit
