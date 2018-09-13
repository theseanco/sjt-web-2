/*

This component returns a div that has:

- A loop, determined by the props provided
- A button, which stops and starts the loop
- Some sets of text which display information about the loop.

*/


import React from 'react';
//import './require.js'
//import bonsai from 'bonsai'
// import './bonsai_square_events.js';
//class to generate loop of notes
import createNotesAndSquares from "./createSquaresNotes.js";
//Steinhaus Johnson Trotter permutation algorithm
import './SJT.js';
import Tone from 'tone';

const SJTUnit = () => {

  /*
  loopStop = (loop) => {
    loop.stop(0)
  }

  loopStart = (loop) => {
    loop.start("+0.1")
  }
  */

  //THIS NEEDS TO BE DONE DYNAMICALLY
  const loopTwo = createNotesAndSquares([12,2,4,5,9],
    [true],
    [57],
    4,
    '16n',
    'movie2');

    loopTwo[0].start();
//	  Tone.Transport.start();
  return (
    <div className="thisDiv" onClick={loopTwo[0].stop}>
      Thigins
    </div>
  )
}

export default SJTUnit
