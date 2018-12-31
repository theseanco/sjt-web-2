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
//stylesheet for buttons
import './SJTUnit_Styles.css';
import '../../sliderstyles.css';


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
        initialIteration: 0,
        noteLength: "4n",
        rooteNote: "C",
        scaleKey: "minor",
        octave: 4
      },
      //This will be added as a string then converted into noteArray on creation
      noteArrayString: "0 4 7",
      //Is the loop playing?
      loopPlaying: false,
      //placeholder for loop data fed out of createSquaresNotes callback function
      loopData: {
        generation: 0,
        generationIndex: 0,
        iterator: 0,
        maxIndex: 600,
        note: 0,
        noteArray: [0,0,0],
        scaleSize: 5
      },
      //updated scale information sent from createSquaresNotes
      scaleInfo: ["C"],
    }
  }

  setDefaultLoopState = () => {
    this.setState({
      loopState: {
        noteArray: [0,2,3,5,7,12],
        initialIteration: 0,
        noteLength: "4n",
        rooteNote: "C",
        scaleKey: "minor",
        octave: 4
      },
      //This will be added as a string then converted into noteArray on creation
      noteArrayString: "0 4 7"
    })
  }

  loopStop = (loop) => {
    this.setState({loopPlaying: false})
    loop.stop(0)
  }

  loopStart = (loop) => {
    loop.start("@1m")
    this.setState({loopPlaying: true})
  }

  //This is a function which takes an object containing properties of the SJT loop to be created. This is then created using createNotesAndSquares, old version.
  //TODO: See if this can interrupt processing and re-spawn the input field
  createLoop = (stuff = {
    noteArray: [0,2,5,7,12],
    initialIteration: 0,
    noteLength: "4n",
    rooteNote: "C",
    scaleKey: "minor",
    octave: 4
  }, noteString = "0 2 5 7 12") => {
    this.setState({loopCreated: true});

    //this splits the array, then converts the whole array to integers
    const newNoteString = noteString.split(" ")
    const intNoteString = newNoteString.map(x => parseInt(x, 10));
    /*
    Processes the notes: Checks if:
    - Rejects strings
    - Rejects negative integers
    - Rejects integers over 30
    */
    const processedNotes = intNoteString.filter((data) => {
      if (Number.isInteger(data) && data >= 0 && data < 30) {
        return true
      }
    })
    console.log(processedNotes)

    return(
    createNotesAndSquares(
      processedNotes,
      stuff.initialIteration,
      stuff.noteLength,
      //callback function that handles data
      (data) => {
        //an array is put out through the callback function. One will be the loop data and on
        this.setState({loopData: data});
      },
      //element name
      this.props.konvaIdName,
      //blockColour
      '#e0e0e0',
      stuff.rootNote,
      stuff.scaleKey,
      stuff.octave
    )
  )
  }

  clearLoop = () => {
    //This will make the state remove the relevant buttons from the DOM.
    this.setState({loopCreated: false});
    this.setDefaultLoopState();
  }

  //for testing
  createDefaultLoop = (stuff) => {
    console.log("bang")
    return(
    createNotesAndSquares()
  )
  }

  //NOTE: This is dependent upon side-effects and could do with Redux integration
  eventHandler = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    //A holder for stateKey so that the writeToState function can be called at the end of the function rather than for each case
    let stateKey;

    //TODO: This doesn't work, why?
    const writeToState = (stateKey, valueToWrite) => {
      //
      this.setState(prevState => ({
        loopState: {
        ...prevState.loopState,
        //writes state key and value to previous loopState value
        [stateKey]: valueToWrite
      }
      }))
    }

    switch(eventId) {
      case "scaleKey":
        stateKey = "scaleKey";
        writeToState(stateKey, eventValue)
        break;
      case "scaleOctave":
        stateKey = "octave"
        writeToState(stateKey, eventValue)
        break;
      case "scaleRoot":
        stateKey = "rootNote"
        writeToState(stateKey, eventValue)
        break;
      case "noteLength":
        stateKey = "noteLength"
        writeToState(stateKey, eventValue)
        break;
      case "scaleIndices":
        this.setState({noteArrayString: eventValue});
        break;
      default:
        return true;
    }

  }

  render() {
    let buttons ;

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
        <div className="loopInformation">
          <span>Note: {this.state.loopData.note}</span>
          <span>Scale: {String(this.state.loopData.initialScaleNoteNames)}</span>
          <span>Note Number: {this.state.loopData.iterator}</span>
          <span>Generation: {`${this.state.loopData.generation+1}/${this.state.loopData.noteArray.length}`}</span>
          <span>Total Notes: {this.state.loopData.maxIndex}</span>
        </div>
        </div>
      )
    } else {
      buttons = (
        <div className="loopCreationLayout">
          {/* The button is created using loopState as it is when the button is pressed */}
          <div className="dataInputUnit center-contents">
          <label>
            {`Indices: `}
            <div>
            <input type="text" name="indices" placeholder="Default: 0 4 7" onChange={this.eventHandler} id="scaleIndices" pattern="(\d{1,2}\s){1,6}" size="10"/>
            </div>
          </label>
        </div>

        <div className="scale-dropdown-menus">

        <div className="dropdown-layout center-contents">
          <label>
            {`Root: `}
            <div>
            <select defaultValue="C" onChange={/*this.setRoot*/ this.eventHandler} id="scaleRoot">
              <option value="A">A</option>
              <option value="Bb">Bb</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="C#">C#</option>
              <option value="D">D</option>
              <option value="Eb">Eb</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="F#">F#</option>
              <option value="G">G</option>
              <option value="G#">G#</option>
            </select>
            </div>
          </label>
        </div>

        <div className="dropdown-layout center-contents">
          <label>
            {`Octave: `}
            <div>
            <select defaultValue="4" onChange={/*this.setOctave*/ this.eventHandler} id="scaleOctave">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            </div>
          </label>
        </div>

        <div className="dropdown-layout center-contents">
          <label>
            {`Key: `}
            <select defaultValue="minor" onChange={/*this.setScaleKey*/ this.eventHandler} id="scaleKey">
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option valye="dorian">Dorian</option>
              <option value="mixolydian">Mixolydian</option>
              <option value="chromatic">Chromatic</option>
            </select>
          </label>
        </div>


          <div className="dropdown-layout center-contents">
          <label>
          {`Duration:    `}
          <div>
            <select defaultValue="4n" onChange={/*this.setNoteLength*/ this.eventHandler} id="noteLength">
              <option value="2n" >1/2</option>
              <option value="4n">1/4</option>
              <option value="8n">1/8</option>
              <option value="16n">1/16</option>
            </select>
            </div>
          </label>
        </div>
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
