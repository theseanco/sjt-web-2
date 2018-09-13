/*

This component returns a div that has:

- A loop, determined by the props provided
- A button, which stops and starts the loop
- Some sets of text which display information about the loop.
- A slider, which can be used to set the initial pitch

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
      //loopState is added in order to
      loopState: {
        noteArray: [0,2,5,7,12],
        offsetsOn: [true],
        offsetNumbers: [50],
        initialIteration: 0,
        noteLength: "16n"
      }
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

  clearLoop = () => {
    //This will make the state remove the relevant buttons from the DOM.
    this.setState({loopCreated: false});
    this.setState({loopState: {
        noteArray: [0,2,5,7,12],
        offsetsOn: [true],
        offsetNumbers: [50],
        initialIteration: 0,
        noteLength: "16n"
      }})
  }

  //for testing
  createDefaultLoop = (stuff) => {
    console.log("bang")
    return(
    createNotesAndSquares()
  )
  }

  setInitialOffset = (e) => {
    const offsetEvent = parseInt(e.target.value);
    let stateSetting = Object.assign({},this.state.loopState);
    console.log(offsetEvent);
    stateSetting.offsetNumbers = [offsetEvent]
    this.setState({loopState:stateSetting})
    /*
    //using this method to inherit object properties  https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
    this.setState(prevState => ({
      loopState: {
        ....loopState,
        offsetNumbers: [offsetEvent]
      }
    })
  )
  */

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
        <button onClick={() => {
          this.loopStop(this.loop[0]);
          this.clearLoop()
        }}>Clear Loop</button>
      </div>
      )
    } else {
      buttons = (
        <div>
          {/* The button is created using loopState as it is when the button is pressed */}
          <label>
            Scale Indices:
            <input type="text" name="indices" />
          </label>
          <label>
            initial MIDI note: {this.state.loopState.offsetNumbers[0]}
            <input type="range" name="initial pitch" onChange={this.setInitialOffset} min="30" max="90"/>
          </label>
          <button onClick={() => {this.loop = this.createLoop(this.state.loopState)}}>Create Loop</button>
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
