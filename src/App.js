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

Extract out PlayPause into a general-purpose button for use in both the root document as well as SJTUnit
x Make a "Create Loop" button in SJTUnit, which will reveal "play loop" and "stop loop" buttons.
x Create offset input field
- Make offset field a slider
Make things temposync

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

  render() {
    return (
      <div>
      <div className="container">
        <div className="div-styling" >
          <SJTUnit />
        </div>
        <div className="div-styling" >
          <SJTUnit />
        </div>
      </div>
      <div>
        <PlayPause />
      </div>
    </div>
    );
  }
}

export default App;
