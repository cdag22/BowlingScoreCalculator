import React from 'react';
import _ from 'underscore';

const KeyPad = ({ updateScore }) => {

  return (
    <div className="keypad">
      {_.range(11).map((i) => (
        <div
          key={i}
          data-value={i}
          className="pad-box"
          onClick={(e) => (e.preventDefault(), updateScore(e.target.dataset.value))}
        >
          {i}
        </div>
      ))}
    </div>
  );
};

export default KeyPad;