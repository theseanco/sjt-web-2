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
- Dynamically generate SJT divs, with buttons to add them.

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
      arrayOfIndexes: [true, false, false, false]
    }
  }

  addSJT = () => {
    this.setState((state, props) => {
      return {arrayOfIndexes: state.arrayOfIndexes.push(true)}
    })
  }

  render() {

    startPlaying();

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


      <button onClick={this.addSJT}>Addd SJTUnit</button>
      {/*
      <div>
        <PlayPause />
      </div>
      */}

    </div>
    );
  }
}

export default App;
