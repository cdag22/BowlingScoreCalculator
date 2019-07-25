import React from 'react';
import _ from 'underscore';

const KeyPad = ({ updateScore, currentFrameTotal }) => {

  return (
    <div className="keypad">
      {_.range(11).map((i) => (
        <div
          key={i}
          data-value={i}
          className={10 - currentFrameTotal < i ? 'pad-box disabled' : 'pad-box'}
          onClick={(e) => (e.preventDefault(), updateScore(e.target.dataset.value))}
        >
          {i}
        </div>
      ))}
    </div>
  );
};

export default KeyPad;