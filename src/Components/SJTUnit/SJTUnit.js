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
  //THIS NEEDS TO BE DONE DYNAMICALLY
  const loopTwo = createNotesAndSquares([12,2,4,5,9],
    [true],
    [57],
    4,
    '16n',
    'movie2').start();
//	  Tone.Transport.start();
  return (
    <div className="thisDiv">
      Thigins
    </div>
  )
}

export default SJTUnit
