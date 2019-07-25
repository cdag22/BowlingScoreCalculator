import React from 'react';
import _ from 'underscore';
import ScoreBoard from './scoreBoard.jsx';
import ButtonPanel from './buttonPanel.jsx';
import KeyPad from './keypad.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      totals: [],
      subFrames: [],
      subMappings: [],
      total: 0,
      carryOverFrameScore: 0,
      currentFrameTotal: 0,
      totalIndex: 1,
      isEndOfFrame: false,
      isGameOver: false,
    };

    this.OUT_OF_BOUND = 100;
    this.STRIKE = 2;
    this.ONE = 1

    this.updateScore = this.updateScore.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
  }

  resetBoard() {
    this.setState({
      totals: [],
      subFrames: [],
      subMappings: [],
      total: 0,
      carryOverFrameScore: 0,
      currentFrameTotal: 0,
      totalIndex: 1,
      isEndOfFrame: false,
      isGameOver: false,
    });
  }

  determineIsGameOver() {
    const { isGameOver, subMappings } = this.state;
    return isGameOver || subMappings.length === 21 || (subMappings.length === 20 && subMappings[19] !== '/' && subMappings[18] !== 'X')
  }

  calculateBoundIndex(subMappings, k, boundIndex) {
    if (subMappings[k] === 'X') {
      if (subMappings.length < 21 && (!subMappings[k + 2] || (!subMappings[k + 4] && subMappings[k + 2] === 'X'))) {
        boundIndex += this.OUT_OF_BOUND;
      }
      if (subMappings[k + 2] === 'X') {
        boundIndex += this.STRIKE;
        if (subMappings[k + 4] === 'X') {
          boundIndex += this.STRIKE;
        }
      } else {
        boundIndex += 1;
      }
    } else if (subMappings[k] === '/') {
      if (subMappings[k + 1] === '-') {
        boundIndex += this.STRIKE;
      } else {
        boundIndex += this.ONE;
      }
    }
    return boundIndex;
  }

  updateTotal(score) {
    let {
      totals,
      subFrames,
      subMappings,
      total,
      carryOverFrameScore,
      totalIndex
    } = this.state;
    let k = totalIndex;
    let boundIndex = this.calculateBoundIndex(subMappings, k, totalIndex);

    while (subFrames[boundIndex] >= 0 && totals.length < 10) {
      if ((/[\/X]/).test(subMappings[k])) {
        total += subFrames[k - 1] + subFrames[k];
        if (boundIndex === this.STRIKE + this.STRIKE + k) {
          total += subFrames[boundIndex];
          boundIndex -= 2;
          total += subFrames[boundIndex];
        } else if (boundIndex === this.STRIKE + this.ONE + k) {
          total += subFrames[boundIndex];
          boundIndex -= 1;
          total += subFrames[boundIndex];
        } else {
          total += subFrames[boundIndex];
          if (subMappings[boundIndex - 1] !== '/' && subMappings[boundIndex + 1]) {
            boundIndex += 1;
            total += subFrames[boundIndex];
          }
        }
      } else {
        total += carryOverFrameScore + score;
        carryOverFrameScore = 0;
      }
      totals.push(total);
      k += 2;
      boundIndex = this.calculateBoundIndex(subMappings, k, k);
    }

    this.setState({
      totals: totals,
      total: total,
      carryOverFrameScore: carryOverFrameScore,
      totalIndex: k,
    });
  }

  updateFrameScore(score, mapping) {
    let {
      subFrames,
      subMappings,
      carryOverFrameScore,
      currentFrameTotal,
      isEndOfFrame,
    } = this.state;

    if (mapping === 'X' && subFrames.length < 18) {
      subFrames.push(0);
      subMappings.push('-');
    }
    subFrames.push(score);
    subMappings.push(mapping);

    if (!isEndOfFrame || mapping === 'X') {
      carryOverFrameScore = mapping === 'X' ? 0 : score;
      currentFrameTotal = carryOverFrameScore;
    } else {
      currentFrameTotal = 0;
    }

    this.setState({
      subFrames: subFrames,
      subMappings: subMappings,
      currentFrameTotal: currentFrameTotal,
      carryOverFrameScore: carryOverFrameScore,
      isEndOfFrame: subFrames.length < 21 && mapping !== 'X' ? !isEndOfFrame : isEndOfFrame,
    }, () => this.updateTotal(score));

  }

  updateScore(score) {
    score = +score;
    const { currentFrameTotal, isEndOfFrame, isGameOver } = this.state;
    let mapping = isEndOfFrame && currentFrameTotal + score === 10 ? '/' : score === 10 ? 'X' : score;

    if (!this.determineIsGameOver()) {
      this.updateFrameScore(score, mapping);
    } else if (!isGameOver) {
      this.setState({
        isGameOver: true
      });
    }
  }

  render() {

    return (
      <div className="bg-blue shadow h-100">
        <header className="h-30 header">
          <h1 className="font-regular page-title">Bowling Score</h1>
        </header>
        <div className="">
          <ScoreBoard
            subFrames={this.state.subMappings}
            totals={this.state.totals}
          />
          <div className="m-auto d-flex justify-content-between col-6">
            <KeyPad
              updateScore={this.updateScore}
              currentFrameTotal={this.state.currentFrameTotal}
            />
            <ButtonPanel
              resetBoard={this.resetBoard}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;