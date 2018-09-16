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

- Tempo slider
- Make things not look dreadful
  - Pre-align four divs and bottom tempo/volume div
  - Color scheme, nice buttons
  - Better fonts
- visuals

TODO:

onChange={() => console.log(this.loop[1].iterator)} WILL log iterator, so this.loop[1] carries CURRENT information as loop is repeatedly executing a function. Create an event listener to grab information from within the loop to be displayed alongside the stop/play/delete buttons.
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

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      //Booleans control whether loops are activated or not
      arrayOfIndexes: [false , false, false, false]
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

  render() {

    startPlaying();

    return (
      <div>
      <div className="container">
        {
          this.state.arrayOfIndexes.map((data, i) => {
            if (!data) {
              return(
              <div className="div-styling" key={i}>
              <button onClick={() => this.invertState(i)}>Create Loop</button>
            </div>
          )
            } else {
              return (
                  <div className="div-styling" key={i}>
                    <SJTUnit key={i} externalFunction={() => this.invertState(i)} />
                  </div>
              )
            }
          })
        }
              </div>
        </div>
    );
  }
}

export default App;
