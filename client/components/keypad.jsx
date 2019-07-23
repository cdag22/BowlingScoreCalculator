import React from 'react';
import _ from 'underscore';

const KeyPad = ({ }) => {

  return (
    <div className="keypad">
      {_.range(11).map((i) => (<div key={i} className="pad-box">{i}</div>))}
    </div>
  );
};

export default KeyPad;