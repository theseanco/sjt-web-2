import React, { Component } from 'react';
import './App.css';
//old CSS imported from old project
import './stylesheet.css'
//components
import SJTUnit from "./Components/SJTUnit/SJTUnit"
import PlayPause from "./Components/PlayPause/PlayPause"
import Tone from 'tone'

/*

TODO:

- Make things not look dreadful
  - Pre-align four divs and bottom tempo/volume div
  - Sliders need to look better
  - Color scheme, nice buttons
  - Better fonts
- visuals
- errors with multiple of the same values on input
- Input formatting
- formatting input values to scales
- onChange={() => console.log(this.loop[1].iterator)} WILL log iterator, so this.loop[1] carries CURRENT information as loop is repeatedly executing a function. Create an event listener to grab information from within the loop to be displayed alongside the stop/play/delete buttons.
*/

//This works to start the transport
const stopPlaying = () => {
  Tone.Transport.stop();
  console.log("stopped")
}

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
      tempoValue: defaultTempo,
      volume: defaultVolume,
      colours: ["rgba(71, 151, 97, 0.5)",
      "rgba(206, 188, 129, 0.5)",
      "rgba(161, 110, 131, 0.5)",
      "rgba(177, 159, 158, 0.5)" ]
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
  setBpm = (e) => {
    const tempoValue = parseInt(e.target.value);
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
    //NOTE: This is done in decibels and may need tuning up.
    const volumeValue = parseFloat(e.target.value);
    if (isFinite(volumeValue)) {
    this.setState({volume: volumeValue})
    console.log(String(volumeValue));
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
              <div className="div-styling" key={i} style={{background: this.state.colours[i]}}>
              <button onClick={() => this.invertState(i)} >Create Loop</button>
            </div>
          )
            } else {
              return (
                  <div className="div-styling" key={i} style={{background: this.state.colours[i]}}>
                    <SJTUnit key={i} externalFunction={() => this.invertState(i)} />
                  </div>
              )
            }
          })
        }
        <div className="slidersDiv">
          <div className="slider">
          <p className="sliderTitle">Tempo Slider</p>
          <input type="range" min="40" max="160" value={defaultTempo} onChange={this.setBpm}></input>
          {this.state.tempoValue}
        </div>
        <div className="slider">
          <p className="sliderTitle">Volume slider</p>
          <input type="range" min={String(minVolume)} max="0" step="0.01" value={defaultVolume} onChange={this.setVolume}></input>
          {parseInt(this.convertRange(this.state.volume,[minVolume,0],[0,100]))}
        </div>
        </div>
        </div>
    );
  }
}

export default App;
