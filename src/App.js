import React, { Component } from 'react';
import './App.css';
//old CSS imported from old project
import './stylesheet.css'
//components
import SJTUnit from "./Components/SJTUnit/SJTUnit"
import PlayPause from "./Components/PlayPause/PlayPause"
import Tone from 'tone'

// Tone.Transport.start()

class App extends Component {

  render() {
    return (
      <div>
      <div className="container">
        <div className="div-styling">
          <SJTUnit />
        </div>
        <div className="div-styling">
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
