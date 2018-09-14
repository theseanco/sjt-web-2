//TODO: Make loops independently start and stop-able. Currently they are side effects.

import createNotesAndSquares from "./createSquaresNotes.js"


const loopOne = createNotesAndSquares([0,2,4,5,7]);
//loopOne.start(0);
const loopTwo = createNotesAndSquares([12,2,4,5,9],
  [true],
  [57],
  4,
  '16n',
  'movie2');
//UNCOMMENT TO START

loopOne.start(0);
loopTwo.start(0);
//Tone.Transport.start();
