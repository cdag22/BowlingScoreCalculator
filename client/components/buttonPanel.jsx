import React from 'react';

const ButtonPanel = ({ resetBoard }) => {

  return (
    <div className="button-panel">
      <button
        className="btn go-back-btn"
      >
        Go Back One Turn
      </button>
      <button
        className="btn reset-btn"
        onClick={(e) => (e.preventDefault(), resetBoard())}
      >
        Reset
      </button>
    </div >
  );
};

export default ButtonPanel;