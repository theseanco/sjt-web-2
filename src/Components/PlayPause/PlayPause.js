//A button to play and pause Tone.transport


import React from 'react'
import Tone from 'tone'

class PlayPause extends React.Component {

  constructor(props) {
    super(props);
    //playing defaults to true because loops are created independently of one another.
    this.state = {
      playing: true
    }
  }



  //This works to start the transport
  stopPlaying = () => {
    Tone.Transport.stop();
    console.log("stopped")
  }

  //This works to stop the transport
  startPlaying = () => {
    Tone.Transport.start("+0.1");
    console.log("started")
  }

  //This
  handleClick = (buttonInfo) => {
    console.log("handle click function")
    this.setState({playing: !this.state.playing})
    this.state.playing ? this.stopPlaying() : this.startPlaying()
  }

  render() {
    if (this.state.playing) {
      this.startPlaying()
    }
    //SETTING STATE INSIDE OF FUNCTION
  return (
    <button onClick={this.handleClick}>
      {this.state.playing ? "Stop" : "Play"}
    </button>
  )
}
}

export default PlayPause
