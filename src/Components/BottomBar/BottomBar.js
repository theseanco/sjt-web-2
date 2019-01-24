import React from 'react';
import './BottomBarStyling.css'

const BottomBar = () => {
  return (
    <div className="bottomBar-Container">
    <div className="bottom-bar">
      <a title="View on GitHub" href="https://github.com/theseanco/SJT-Web-2" className="fab fa-github"><span>View on GitHub</span></a>
      <a href="https://angel.co/sean-cotterill" className="fab fa-angellist"><span>My angellist</span></a>
      <a href="https://www.linkedin.com/in/seancotterill/" className="fab fa-linkedin"><span>My Linkedin</span></a>
      <a href="https://twitter.com/theseanco" className="fab fa-twitter"><span>My Twitter</span></a>
    </div>
    </div>
  )
}

export default BottomBar;
