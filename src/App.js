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
//Custom stylesheet for Slider - Makes the slider smaller to better sit underneath loop generators.
import './sliderstyles.css'

/*

TODO:


SCALES:
- Make a scale selector dropdown
- Make parallel octave and transposition sliders
- Make a 'normal' and 'advanced' mode dropdown.
  - Normal has major/minor/chromatic, octave
  - Advanced has a whole bunch more, octave, transposition.

- Mute doesn't work
- errors with multiple of the same values on input
- Input formatting
- refresh loop information on first creation.
*/

/*
//This works to start the transport
const stopPlaying = () => {
  Tone.Transport.stop();
  console.log("stopped")
}
*/

//This works to stop the transport
const startPlaying = () => {
  Tone.Transport.start("+0.1");
  console.log("started")
}

/*
A default tempo value.

TODO: Perhaps this isn't the best way to do this, starting with a hardcoded value, but it works for now.
*/
//Some values that are used in tempo and bpm calculation
const defaultTempo = 100;
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


  testFunction = (index) => {
    console.log("works", index);
  }



  //function to set the bpm of  the transport and apply it to state to be printed to the page.
  //TODO: A LOT of errors that are: "Failed to execute 'setValueAtTime' on 'AudioParam': The provided float value is non-finite."
  //This is now deprecated in favour of using react-input-range component grabbed from npm.
  setBpm = (e) => {
    let tempoValue;
    if (typeof(e) === 'object') {
      //parse the target value object
      tempoValue = parseInt(e.target.value, 10)
    } else if (typeof(e) === 'number') {
      //directly assign the target value object
      tempoValue = parseInt(e, 10)
    }
    const currentState = this.state.tempoValue;
    const difference = Math.abs(tempoValue - currentState);
    //check if value is finite
    if (isFinite(tempoValue)) {
    //Check the difference in the values. If it's more than 2, it's a good idea to ramp it.
    if(difference <= 2) {
      //no ramp
      Tone.Transport.bpm.value = tempoValue;
      this.setState({tempoValue: tempoValue});
    } else if (difference < 10) {
      //ramp
      this.setState({tempoValue: tempoValue});
      Tone.Transport.bpm.rampTo(tempoValue,difference/50)
    } else {
      this.setState({tempoValue: tempoValue});
      Tone.Transport.bpm.rampTo(tempoValue,1)
    }
  }
  }

  setVolume = (e) => {
    let volumeValue
    if (typeof(e) === 'object') {
      //parse the target value object
      volumeValue = parseFloat(e.target.value)
    } else if (typeof(e) === 'number') {
      //directly assign the target value object
      volumeValue = parseFloat(e, 10)
    }
    if (isFinite(volumeValue)) {
      if (parseInt(volumeValue, 10) === minVolume) {
        console.log("muted")
        Tone.Master.mute = true
        this.setState({muted: true})
      } else if (parseInt(volumeValue, 10) !== minVolume && this.state.muted === true) {
        console.log("unmuted")
        Tone.Master.mute = false;
        this.setState({muted: false});
      }
    this.setState({volume: volumeValue})
    //NOTE: The use of signal `.value` call is essential here.
    //Documented here: https://github.com/Tonejs/Tone.js/wiki/Signals
    Tone.Master.volume.rampTo(volumeValue,0.1)

  }
}


  //Function taken from https://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges to scale volume value printouts to 0-100 to be more user-accessible for people who don't know about decibels
  convertRange = ( value, r1, r2 ) => {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

  componentDidMount() {
    startPlaying();
    //set default tempo and volume values
    Tone.Transport.bpm.value = defaultTempo;
    Tone.Master.volume.value = defaultVolume
  }

  render() {
    return (
      <div className="container">
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
                <div className="div-styling">
                <div className="konva-container" id={`konva-${i}`}>
                </div>
                  <div className="SJTUnit-container" key={i} style={{background: this.state.colours[i]}}>
                    <SJTUnit key={i} externalFunction={() => this.invertState(i)} konvaIdName={`konva-${i}`}/>
                  </div>
                </div>

              )
            }
          })
        }

        {/* This could do with being extracted out */}
        <div className="slidersDiv" >
          <div className="slider">
          <p className="sliderTitle">Tempo: {this.state.tempoValue}</p>
       <Slider
        value={this.state.tempoValue}
        orientation="horizontal"
        onChange={value => this.setBpm(value)}
        min={60}
        max={160}
        tooltip={false}
      />
        </div>
        <div className="slider">
          <p className="sliderTitle">{`Volume: `}
{parseInt(this.convertRange(this.state.volume,[minVolume,0],[0,100]), 10)} </p>
          <Slider
            orientation="horizontal"
            onChange={value => this.setVolume(value)}
            value={this.state.volume}
            min={-40}
            max={0}
            tooltip={false} />
        </div>
        </div>
        </div>
    );
  }
}

export default App;
