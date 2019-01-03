import React from 'react';
import Tone from 'tone';
import './TempoChanger.css'

class TempoChange extends React.Component {

  constructor(props) {
    super(props);
    //playing defaults to true because loops are created independently of one another.
    this.state = {
      tempoValue: 60,
      defaultTempo: 60
    }
  }

  componentDidMount() {
    //set default tempo and volume values
    Tone.Transport.bpm.value = this.state.tempoValue
    //set the default tempo
    this.setState({tempoValue:this.state.defaultTempo})
  }

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
    //Check the differenc e in the values. If it's more than 2, it's a good idea to ramp it.
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

  render() {
  return (
    <div className="tempoChanger">
      <span className="tempoChangerTitle">Tempo:</span>
      <select
        value={this.state.tempoValue}
        orientation="horizontal"
        onChange={value => this.setBpm(value)}
        tooltip="false"
         >
         <option value={50}>50</option>
         <option value={60}>60</option>
         <option value={75}>75</option>
         <option value={100}>100</option>
         <option value={110}>110</option>
        </select>
        </div>
    )
}
}

export default TempoChange
