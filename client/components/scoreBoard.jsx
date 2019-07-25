import React from 'react';
import _ from 'underscore';

const ScoreBoard = ({ totals, subFrames }) => {
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
                <div className="sub-frame">{range.includes(subFrames[i * 2]) ? subFrames[i * 2] : '-'}</div>
                <div className="sub-frame">{range.includes(subFrames[i * 2 + 1]) ? subFrames[i * 2 + 1] : '-'}</div>
              </div>
              <div>{(/[0-9]+/).test(totals[i]) ? totals[i] : '-'}</div>
            </div>
          )
            :
            (
              <div key={i} className="frame bottom-frame">
                <div className="sub-frame-box">
                  <div className="sub-frame">{range.includes(subFrames[i * 2]) ? subFrames[i * 2] : '-'}</div>
                  <div className="sub-frame">{range.includes(subFrames[i * 2 + 1]) ? subFrames[i * 2 + 1] : '-'}</div>
                  <div className="sub-frame">{range.includes(subFrames[i * 2 + 2]) ? subFrames[i * 2 + 2] : '-'}</div>
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