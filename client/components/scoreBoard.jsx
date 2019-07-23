import React from 'react';
import _ from 'underscore';

const ScoreBoard = ({ frames }) => {

  return (
    <div className="score-board">
      <div className="frame-row">
        {_.range(10).map((i) => (<div key={i} className="frame">{i + 1}</div>))}
      </div>
      <div className="frame-row">
        {frames.map((frame, i) =>
          i < 9 ? (
            <div key={i} className="frame bottom-frame">
              <div className="sub-frame-box">
                <div className="sub-frame">{frame.value && frame.value[0] ? frame.value[0] : '-'}</div>
                <div className="sub-frame">{frame.value && frame.value[1] ? frame.value[1] : '-'}</div>
              </div>
              <div>{'-'}</div>
            </div>
          )
            :
            (
              <div key={i} className="frame bottom-frame">
                <div className="sub-frame-box">
                  <div className="sub-frame">{frame.value && frame.value[0] ? frame.value[0] : '-'}</div>
                  <div className="sub-frame">{frame.value && frame.value[1] ? frame.value[1] : '-'}</div>
                  <div className="sub-frame">{frame.value && frame.value[2] ? frame.value[2] : '-'}</div>
                </div>
                <div>{'-'}</div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;