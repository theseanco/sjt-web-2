import React from 'react'

class PlayPause extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false
    }
  }

  handleClick = (buttonInfo) => {
    this.setState({playing: !this.state.playing})
  }

  render() {
    //SETTING STATE INSIDE OF FUNCTION
  return (
    <button onClick={this.handleClick}>
      BUTTON TEXT GOES HERE
    </button>
  )
}
}

export default PlayPause
