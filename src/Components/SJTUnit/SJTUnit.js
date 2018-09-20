/*

This component returns a div that has:

- A loop, determined by the props provided
- A button, which stops and starts the loop
- Some sets of text which display information about the loop.
- A slider, which can be used to set the initial pitch
- A text field, which takes a space delimited string of integers which will be turned into an array and be used as notes to go through the Steinhaus johnson trotter algorithm

This needs to broken out into components.

*/


import React from 'react';
//class to generate loop of notes
import createNotesAndSquares from "./createSquaresNotes.js";
//Steinhaus Johnson Trotter permutation algorithm
import './SJT.js';
import Tone from 'tone';
//stylesheet for buttons
import './SJTUnit_Styles.css'
import Slider from 'react-rangeslider'
import '../../sliderstyles.css'


class SJTUnit extends React.Component {

  constructor(props) {
    super(props);
    /*
    properties of state:

    loopCreated = has a loop been created? Used for conditional rendering of buttons

    */
    this.state = {
      loopCreated: false,
      //loopState is added in order to initialise values that will later be used to create a loop
      loopState: {
        noteArray: [0,2,3,5,7,12],
        offsetsOn: [true],
        offsetNumbers: [50],
        initialIteration: 0,
        noteLength: "4n"
      },
      //This will be added as a string then converted into noteArray on creation
      noteArrayString: "",
      //Is the loop playing?
      loopPlaying: false,
    }
  }

  loopStop = (loop) => {
    this.setState({loopPlaying: false})
    loop.stop(0)
  }

  loopStart = (loop) => {
    loop.start("@1m")
    this.setState({loopPlaying: true})
  }

  //This is a function which takes an object containing properties of the SJT loop to be created. This is then created using createNotesAndSquares, old version where noteArray is designed to take an array
  createLoop_old = (stuff = {
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

  //This is a function which takes an object containing properties of the SJT loop to be created. This is then created using createNotesAndSquares, old version.
  createLoop = (stuff = {
    noteArray: [0,2,5,7,12],
    offsetsOn: [true],
    offsetNumbers: [50],
    initialIteration: 0,
    noteLength: "8n"
  }, noteString = "0 2 5 7 12") => {
    this.setState({loopCreated: true});

    //this splits the array, then converts the whole array to integers
    const newNoteString = noteString.split(" ")
    const processedNotes = newNoteString.map(x => parseInt(x));

    console.log("created")
    return(
    createNotesAndSquares(
      processedNotes,
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
    //An object containing information used to create a loop.
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
    let offsetEvent;
    if (typeof(e) === 'object') {
      //parse the target value object
      offsetEvent = parseInt(e.target.value)
    } else if (typeof(e) === 'number') {
      //directly assign the target value object
      offsetEvent = parseInt(e)
    }
    //using this method to inherit object properties  https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
    this.setState(prevState => ({
      loopState: {
        ...prevState.loopState,
        offsetNumbers: [offsetEvent]
      }
    })
  )
  }

  //function to update component state with a string.
  setIndices = (e) => {
    this.setState({noteArrayString: e.target.value});
  }

  //function to update component state with the note length
  setNoteLength = (e) => {
    const noteLengthValue = e.target.value;
    this.setState(prevState => ({
      loopState: {
        ...prevState.loopState,
        noteLength: noteLengthValue
      }
    })
  )
  }

  //THIS NEEDS TO BE DONE DYNAMICALLY


//	  Tone.Transport.start();
  render() {
    let buttons, loop

    if (this.state.loopCreated) {
      buttons = (
        <div className="createdLoopLayout">
          <div className="createdLoopButtonContainer center-contents">
          {
          !this.state.loopPlaying ? <a className="SJTUnitButton createdLoopButton center-contents" onClick={() => this.loopStart(this.loop[0])}>Play Loop</a> : <a className="SJTUnitButton createdLoopButton center-contents" onClick={() => this.loopStop(this.loop[0])}>Stop Loop</a>
              }
            </div>
            <div className="createdLoopButtonContainer center-contents">
        <a className="SJTUnitButton createdLoopButton center-contents" onClick={() => {
          this.loopStop(this.loop[0]);
          this.clearLoop()
        }}>Clear Loop</a>
      </div>
      </div>
      )
    } else {
      buttons = (
        <div className="loopCreationLayout">
          {/* The button is created using loopState as it is when the button is pressed */}
          <div className="dataInputUnit center-contents">
          <label>
            Scale Indices:
            <input type="text" name="indices" placeholder="0 2 4 6 8" onChange={this.setIndices} />
          </label>
        </div>

        <div className="dataInputUnit center-contents">
          <label>
            initial MIDI note: {this.state.loopState.offsetNumbers[0]}
            <Slider
              onChange={this.setInitialOffset}
              min={30}
              max={90}
              value={this.state.loopState.offsetNumbers[0]}
              tooltip={false}/>
          </label>
        </div>

          <div className="dataInputUnit center-contents">
          <label>
          {`Note Duration:    `}
            <select defaultValue="4n" onChange={this.setNoteLength}>
              <option value="2n" >2n</option>
              <option value="4n">4n</option>
              <option value="8n">8n</option>
              <option value="16n">16n</option>
            </select>
          </label>
        </div>

          <div className="dataInputUnit center-contents flow-table">
          <a className="SJTUnitButton center-contents" onClick={() => {this.loop = this.createLoop(this.state.loopState, this.state.noteArrayString)}}>Create Loop</a>
          <a className="SJTUnitButton center-contents" onClick={this.props.externalFunction}> Remove Loop </a>
        </div>
        </div>
      )
    }

  return (
    <div className="buttonHolder" >
      {/* This could be extracted out into a play/stop button. */}
      {buttons}
    </div>
  )
}
}

export default SJTUnit
