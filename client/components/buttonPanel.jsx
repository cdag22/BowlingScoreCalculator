import React from 'react';

const ButtonPanel = ({ resetBoard }) => {

  return (
    <div className="button-panel">
      <button
        className="btn reset-btn"
        onClick={(e) => (e.preventDefault(), resetBoard())}
      >
        Reset Frames
      </button>
    </div >
  );
};

export default ButtonPanel;