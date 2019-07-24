import React from 'react';
import _ from 'underscore';

const ScoreBoard = ({ frames }) => {
  const range = _.range(11).concat(['-', '/', 'X']);
  return (
    <div className="score-board">
      <div className="frame-row">
        {_.range(10).map((i) => (<div key={i} className="frame">{i + 1}</div>))}
      </div>
      <div className="frame-row">
        {_.range(10).map((i) =>
          i < 9 ? (
            <div key={i} className="frame bottom-frame">
              <div className="sub-frame-box">
                <div className="sub-frame">{frames[i] && frames[i].values && range.includes(frames[i].values[0]) ? frames[i].values[0] : '-'}</div>
                <div className="sub-frame">{frames[i] && frames[i].values && range.includes(frames[i].values[1]) ? frames[i].values[1] : '-'}</div>
              </div>
              <div>{frames[i] ? frames[i].total : '-'}</div>
            </div>
          )
            :
            (
              <div key={i} className="frame bottom-frame">
                <div className="sub-frame-box">
                  <div className="sub-frame">{frames[i] && frames[i].values && range.includes(frames[i].values[0]) ? frames[i].values[0] : '-'}</div>
                  <div className="sub-frame">{frames[i] && frames[i].values && range.includes(frames[i].values[1]) ? frames[i].values[1] : '-'}</div>
                  <div className="sub-frame">{frames[i] && frames[i].values && range.includes(frames[i].values[2]) ? frames[i].values[2] : '-'}</div>
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