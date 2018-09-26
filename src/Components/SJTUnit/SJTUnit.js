/*

This component returns a div that has:

- A loop, determined by the props provided
- A button, which stops and starts the loop
- Some sets of text which display information about the loop.
- A slider, which can be used to set the initial pitch
- A text field, which takes a space delimited string of integers which will be turned into an array and be used as notes to go through the Steinhaus johnson trotter algorithm

This needs to broken out into components.

TODO: A function to set default loop state
TODO: REMOVING OLD ARGUMENTS FROM SETTING THE LOOP STATE
TODO: condense event handler arguments down to one function. This would be done by parsing information from e.target and filing these through a conditional statement. This is done by assigning an id to each selector and using e.target.id and maybe a switch statement to organise by case

*/


import React from 'react';
//class to generate loop of notes
import createNotesAndSquares from "./createSquaresNotes.js";
//Steinhaus Johnson Trotter permutation algorithm
import './SJT.js';
import Tone from 'tone';
//stylesheet for buttons
import './SJTUnit_Styles.css';
import Slider from 'react-rangeslider';
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
        offsetsOn: [true],
        offsetNumbers: [50],
        initialIteration: 0,
        noteLength: "4n",
        rooteNote: "C",
        scaleKey: "minor",
        octave: 4
      },
      //This will be added as a string then converted into noteArray on creation
      noteArrayString: "",
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
      }
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

  /*
  //This is a function which takes an object containing properties of the SJT loop to be created. This is then created using createNotesAndSquares, old version where noteArray is designed to take an array
  createLoop_old = (stuff = {
    noteArray: [0,2,5,7,12],
    offsetsOn: [true],
    offsetNumbers: [50],
    initialIteration: 0,
    noteLength: "4n"
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
}*/


  //This is a function which takes an object containing properties of the SJT loop to be created. This is then created using createNotesAndSquares, old version.
  createLoop = (stuff = {
    noteArray: [0,2,5,7,12],
    offsetsOn: [true],
    offsetNumbers: [50],
    initialIteration: 0,
    noteLength: "4n"
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
      stuff.noteLength,
      //callback function that handles data
      (data) => {
        //TODO: Delete this.
        console.log(data)
        this.setState({loopData: data})
      },
      //element name
      this.props.konvaIdName,
      //blockColour
      '#FFFFFF',
      stuff.rootNote,
      stuff.scaleKey,
      stuff.octave
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
        noteLength: "4n"
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

  setRoot = (e) => {
    const rootNote = e.target.value;
    this.setState(prevState => ({
      loopState: {
        ...prevState.loopState,
        rootNote: rootNote
      }
    })
  )
  }

  setScaleKey = (e) => {
    const scaleKey = e.target.value;
    this.setState(prevState => ({
      loopState: {
        ...prevState.loopState,
        scaleKey: scaleKey
      }
    })
  )
  }

  setOctave = (e) => {
    const octave = e.target.value;
    this.setState(prevState => ({
      loopState: {
        ...prevState.loopState,
        octave: octave
      }
    })
  )
  }

  eventHandler = (e) => {
    const eventId = e.target.id;
    const eventValue = e.target.value;
    //A holder for stateKey so that the writeToState function can be called at the end of the function rather than for each case
    let stateKey;
    let modifier = false;

    //function to print returned value
    //For setting state, this should be replaced with a function which aps the previous state onto the current state and sets it based on a conditional (switch) which determines the state key that will be changed with the resulting value.
    const returnValues = (string, id, val) => {
      console.log(string, id,val)
    }

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
        returnValues("Key:", eventId, eventValue);
        stateKey = "scaleKey";
        writeToState(stateKey, eventValue)
        break;
      case "scaleOctave":
        returnValues("Octaves:", eventId, eventValue);
        stateKey = "octave"
        writeToState(stateKey, eventValue)
        break;
      case "scaleRoot":
        returnValues("Root:", eventId, eventValue);
        stateKey = "rootNote"
        writeToState(stateKey, eventValue)
        break;
      case "noteLength":
        returnValues("Length:", eventId, eventValue);
        stateKey = "noteLength"
        writeToState(stateKey, eventValue)
        break;
      case "scaleIndices":
        returnValues("Indices: ", eventId, eventValue);
        this.setState({noteArrayString: eventValue});
        break;
    }

  }


          /*
          rooteNote: "C",
        scaleKey: "minor",
        octave: 4
        */

  render() {
    let buttons, loop;

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
          <span>Scale: {String(this.state.loopData.noteArray[0])}</span>
          <span>Note Number: {this.state.loopData.iterator}</span>
          <span>Generation: {`${this.state.loopData.generation+1}/${this.state.loopData.noteArray.length}`}</span>
          <span>Total Number of Notes: {this.state.loopData.maxIndex}</span>
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
            <input type="text" name="indices" placeholder="0 2 4 6 8" onChange={this.eventHandler} id="scaleIndices" />
          </label>
        </div>

        <div className="dataInputUnit center-contents">
          <label>
            Scale Root:
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
          </label>
          <label>
            Octave:
            <select defaultValue="4" onChange={/*this.setOctave*/ this.eventHandler} id="scaleOctave">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </label>
          <label>
            Key:
            <select defaultValue="minor" onChange={/*this.setScaleKey*/ this.eventHandler} id="scaleKey">
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="mixolydian">Mixolydian</option>
              <option value="chromatic">Chromatic</option>
            </select>
          </label>
        </div>

          <div className="dataInputUnit center-contents">
          <label>
          {`Note Duration:    `}
            <select defaultValue="4n" onChange={/*this.setNoteLength*/ this.eventHandler} id="noteLength">
              <option value="2n" >2n</option>
              <option value="4n">4n</option>
              <option value="8n">8n</option>
              <option value="16n">16n</option>
            </select>
          </label>
        </div>

        <label>
          EVENT HANDLER TEST
            <select defaultValue="event" onChange={this.eventHandler} id="doesthisshowup">
              <option value="one">one</option>
              <option value="foo">foo</option>
              <option value="event">event</option>
            </select>
        </label>

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
