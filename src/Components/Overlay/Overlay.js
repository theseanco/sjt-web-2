import React from 'react'
import './Overlay.css'


const componentClasses = ['overlay-styling'];

class Overlay extends React.Component {

  constructor(props) {
    super(props)
    this.state = {hide: false}
  }

  //Setting up CSS transitions for the overlay, using the class show to push an opacity level to overlay-styling


  render() {

  if (this.state.hide) {componentClasses.push('hide')};

  return (
    <div className={componentClasses.join(' ')}>
        <div className="overlayText">
       <h1>Steinhaus-Johnson-Trotter Web</h1>

       <p>This is a four-channel change-ringing simulator, built using <a href="https://reactjs.org/">Reactjs</a>, <a href="https://konvajs.github.io/">Konva</a> <a href="https://tonejs.github.io/">Tonejs</a> and the <a href="https://github.com/danigb/tonal">Tonal</a> library.</p>

       This is best viewed on a laptop/desktop computer

       <h3>How to use</h3>

       <ol>
         <li>On one of the fields click 'Initialise Loop'</li>
         <li>Enter the degrees of the scale you wish to use as a pattern (with 0 being the root note of the scale), separated by spaces (e.g. 0 4 7) - Up to ten values are permitted. This process requires exponentially more computation for each value, be aware of this when entering long sequences.</li>
         <li>Choose a scale root, octave, key and note duration (optional)</li>
         <li>Click 'Create Loop', which applies Steinhaus-Johnson-Trotter permutations to your sequence</li>
         <li>Click 'Play Loop' to hear the playback of the permuted sequence, and see visualisation of that sequence </li>
      </ol>


      <ul>
      <li>Loops can be removed with the 'Clear Loop' button</li>
      <li>Tempo and Volume can be changed using the sliders below the loop fields</li>
      <li>Any negative numbers, text, numbers over 30 and any more than 10 values will be silently rejected from input. This is to prevent errors, notes that are too high/low, and large permutation calculations crashing the browser</li>
    </ul>

       <h3>Known Issues</h3>

       <ul>
       <li>Tempo changes can cause playback of loops to stop working</li>
       <li>Changing the dimensions of the browser will not change the dimensions of visuals</li>
     </ul>


     <h3>About the Steinhaus-Johnson-Trotter Algorithm</h3>

       <p>The Steinhaus–Johnson–Trotter algorithm or Johnson–Trotter algorithm, also called plain changes, is an algorithm named after Hugo Steinhaus, Selmer M. Johnson and Hale F. Trotter that generates all of the permutations of n elements. Each permutation in the sequence that it generates differs from the previous permutation by swapping two adjacent elements of the sequence.</p>

       <p>Outside of mathematics, the same method was known for much longer as a method for change ringing of church bells: it gives a procedure by which a set of bells can be rung through all possible permutations, changing the order of only two bells per change. These so-called "plain changes" were recorded as early as 1621 for four bells, and a 1677 book by Fabian Stedman lists the solutions for up to six bells.</p>

       Information CC BY-SA from <a href="https://en.wikipedia.org/wiki/Steinhaus%E2%80%93Johnson%E2%80%93Trotter_algorithm">Wikipedia</a>

       <div className="bottom-alignment">
       <button className="closeButton" onClick={() => {this.setState({hide: true})}}>Start</button>
     </div>
     </div>
     </div>
  )
}
}

export default Overlay
