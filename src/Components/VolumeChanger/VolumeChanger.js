import React from 'react'
import Slider from 'react-rangeslider'
import Tone from 'tone'
import './VolumeChanger.css'

//TODO: set default voume within component

class VolumeChanger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: 80,
      minVolume: -40,
      defaultVolume: -3
    }
  }

  componentDidMount() {
    //set default tempo and volume values
    Tone.Master.volume.value = this.state.defaultVolume
    //set the default volume to the default volume state. 
    this.setState({volume:this.state.defaultVolume})
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
        if (parseInt(volumeValue, 10) === this.state.minVolume) {
          Tone.Master.mute = true
          this.setState({muted: true})
        } else if (parseInt(volumeValue, 10) !== this.state.minVolume && this.state.muted === true) {
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

  render() {
    return (
      <div className="volumeSlider">
          <p className="volumeSliderTitle">{`Volume: `}
{parseInt(this.convertRange(this.state.volume,[this.state.minVolume,0],[0,100]), 10)} </p>
          <Slider
            orientation="horizontal"
            onChange={value => this.setVolume(value)}
            value={this.state.volume}
            min={-40}
            max={0}
            tooltip={false} />
        </div>
    )
  }
}

export default VolumeChanger
