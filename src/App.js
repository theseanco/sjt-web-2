import React, { Component } from 'react';
import './App.css';
//Styling imported, ported from old project
import './stylesheet.css'
//buttons
import './buttons.css'
//components
import SJTUnit from "./Components/SJTUnit/SJTUnit"
import Tone from 'tone'
//Import enhanced range slider
import Slider from 'react-rangeslider'
//import overlay that explains the app
import Overlay from "./Components/Overlay/Overlay"
//import tempo changing checkbox
import TempoChanger from "./Components/TempoChanger/TempoChanger"
//import volume slider
import VolumeChanger from "./Components/VolumeChanger/VolumeChanger"
//Custom stylesheet for Slider - Makes the slider smaller to better sit underneath loop generators.
import './sliderstyles.css'


/*

TODO:

- Input formatting: This can be done by using a regex.
- The correct regex is: (\d{1,2}\s){1,6}
- Change the colour of links once already clicked

SCALES:
- Make a 'normal' and 'advanced' mode dropdown.
  - Normal has major/minor/chromatic, octave
  - Advanced has a whole bunch more, octave, transposition.
  - Add the Tizita scale (request from HB)

- Currently all negative integers are rejected. These could be accepted.
- createSquaresNotes and SJTUnit need rewriting, they're getting very messy
- Mute doesn't work
x Change of tempo can stop loops working for some reason.
  - Some loops will inexplicably not work.
  - THIS COULD BE SOLVED BY MAKING TEMPO CHANGES ONLY HAPPEN ON RELEASE
*/

//This works to stop the transport
const startPlaying = () => {
  Tone.Transport.start("+0.1");
}

/*
A default tempo value.

TODO: Perhaps this isn't the best way to do this, starting with a hardcoded value, but it works for now.
*/
//Some values that are used in tempo and bpm calculation
const defaultTempo = 60;
const defaultVolume = -3;
const minVolume = -40;

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      //Booleans control whether loops are activated or not
      arrayOfIndexes: [false , false, false, false],
      //inherits from global variable
      tempoValue: defaultTempo,
      //inherits from global variable
      volume: defaultVolume,
      //Four colours taken from color scheme site.
      colours: ["rgba(71, 151, 97, 0.5)",
      "rgba(161, 110, 131, 0.5)",
      "rgba(206, 188, 129, 0.5)",
      "rgba(177, 159, 158, 0.5)" ],
      muted: false
    }
  }

  //Function to add a SJT component. Not used
  addSJT = () => {
    this.setState((state, props) => {
      return {arrayOfIndexes: state.arrayOfIndexes.push(true)}
    })
  }

  //Function to invert a boolean of a particular index of the state array
  invertState = (index) => {
    let stateArray = this.state.arrayOfIndexes;
    stateArray[index] = !stateArray[index];
    this.setState({arrayOfIndexes: stateArray})
  }

  //Function to remove a particular index of a state array.
  removeFromArray = (index) => {
    let stateArray = this.state.arrayOfIndexes;
    stateArray = stateArray.splice(index,1)
    this.setState({arrayOfIndexes: stateArray})
  }

  //Function to add an index to the end of the state array.
  addToArray = (index) => {
    let stateArray = this.state.arrayOfIndexes;
    stateArray = stateArray.push(true);
    this.setState({arrayOfIndexes: stateArray})
  }

  componentDidMount() {
    startPlaying();
  }

  render() {
    return (
      <div className="container">
        {/* Component rendering an infobox upon opening then page  */}
          <Overlay />

        {
          this.state.arrayOfIndexes.map((data, i) => {
            if (!data) {
              return(
                //This returns a div with a button asking whether you want to initialise a loop
              <div className="div-styling center-contents" key={i} style={{background: this.state.colours[i]}}>
                <a className="initialiseButtonStyling initialiseButton center-contents" onClick={() => this.invertState(i)}>Initialise Loop {i+1}</a>
              </div>
          )
            } else {
              return (
                //This returns a div contaning an SJTUnit component, which is wrapped in a div which will be used to generate Konva squares. The ID of the konva div will then be passed into the SJTUnit, which will be passed into the creation argument of createSquaresNotes. This passing-down can probably be done better, but will be tackled during a refactor.
                <div className="div-styling" style={{background: this.state.colours[i]}} >

                <div className="konva-container" id={`konva-${i}`}>
                </div>
                  <div className="SJTUnit-container" key={i} >
                    <SJTUnit key={i} externalFunction={() => this.invertState(i)} konvaIdName={`konva-${i}`}/>
                  </div>
                </div>

              )
            }
          })
        }

        {/* This could do with being extracted out */}
        <div className="slidersDiv" >
        <TempoChanger />
        <VolumeChanger />
        </div>
      </div>
    );
  }
}

export default App;
