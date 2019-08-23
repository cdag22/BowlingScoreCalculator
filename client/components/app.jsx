import React from 'react';
import _ from 'underscore';
import ScoreBoard from './scoreBoard.jsx';
import ButtonPanel from './buttonPanel.jsx';
import KeyPad from './keypad.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    // State
    // 
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

    // Magic Numbers
    // 
    this.OUT_OF_BOUND = 100;
    this.MAX_SUB_FRAME_LENGTH = 21;
    this.FIRST_NINE_SUB_FRAMES_LENGTH = 18;
    this.MAX_TOTALS_LENGTH = 10;
    this.DOUBLE_STRIKE = 4;
    this.SINGLE_STRIKE = 2;
    this.ONE = 1

    this.updateScore = this.updateScore.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
  }

  // Reset state click handler
  // 
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
    return isGameOver || subMappings.length === this.MAX_SUB_FRAME_LENGTH || (subMappings.length === 20 && subMappings[19] !== '/' && subMappings[18] !== 'X')
  }

  // Determines what the max lookhead index (boundIndex) should be for checking subFrames values in updateTotal
  // 
  calculateBoundIndex(subMappings, boundIndex) {
    const k = boundIndex;
    if (subMappings[k] === 'X') {
      if (subMappings.length < this.MAX_SUB_FRAME_LENGTH &&
        (!subMappings[k + this.SINGLE_STRIKE] || (!subMappings[k + this.DOUBLE_STRIKE] && subMappings[k + this.SINGLE_STRIKE] === 'X'))) {
        boundIndex += this.OUT_OF_BOUND;
      }
      if (subMappings[k + this.SINGLE_STRIKE] === 'X') {
        boundIndex += this.SINGLE_STRIKE;
        if (subMappings[k + this.DOUBLE_STRIKE] === 'X') {
          boundIndex += this.SINGLE_STRIKE;
        }
      } else {
        boundIndex += this.ONE;
      }
    } else if (subMappings[k] === '/') {
      if (subMappings[k + this.ONE] === '-') {
        boundIndex += this.SINGLE_STRIKE;
      } else {
        boundIndex += this.ONE;
      }
    }
    return boundIndex;
  }

  // Runs a while loop to add new total value for Frame and appends it to totals
  // Calls calculateBoundIndex
  // 
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
    let boundIndex = this.calculateBoundIndex(subMappings, totalIndex);

    while (subFrames[boundIndex] >= 0 && totals.length < this.MAX_TOTALS_LENGTH) {
      if ((/[\/X]/).test(subMappings[k])) {
        total += subFrames[k - 1] + subFrames[k];
        if (boundIndex === this.SINGLE_STRIKE + this.SINGLE_STRIKE + k) {
          total += subFrames[boundIndex];
          boundIndex -= this.SINGLE_STRIKE;
          total += subFrames[boundIndex];
        } else if (boundIndex === this.SINGLE_STRIKE + this.ONE + k) {
          total += subFrames[boundIndex];
          boundIndex -= this.ONE;
          total += subFrames[boundIndex];
        } else {
          total += subFrames[boundIndex];
          if (subMappings[boundIndex - 1] !== '/' && subMappings[boundIndex + 1]) {
            boundIndex += this.ONE;
            total += subFrames[boundIndex];
          }
        }
      } else {
        total += carryOverFrameScore + score;
        carryOverFrameScore = 0;
      }
      totals.push(total);
      k += this.SINGLE_STRIKE;
      boundIndex = this.calculateBoundIndex(subMappings, k, k);
    }

    this.setState({
      totals: totals,
      total: total,
      carryOverFrameScore: carryOverFrameScore,
      totalIndex: k,
    });
  }

  // Updates subFrame and subMapping values
  // Calls updateTotal after state update
  // 
  updateFrameScore(score, mapping) {
    let {
      subFrames,
      subMappings,
      carryOverFrameScore,
      currentFrameTotal,
      isEndOfFrame,
    } = this.state;

    if (mapping === 'X' && subFrames.length < this.FIRST_NINE_SUB_FRAMES_LENGTH) {
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
      isEndOfFrame: subFrames.length < this.MAX_SUB_FRAME_LENGTH && mapping !== 'X' ? !isEndOfFrame : isEndOfFrame,
    }, () => this.updateTotal(score));

  }

  // MAIN FUNCTION
  // Run each time a new value is selected from the keypad
  // Calls update updateFrameScore => updateTotal if NOT isGameOver by running determineIsGameOver
  // Only updates subFrames / totals if isGameOver is False
  // 
  updateScore(score) {
    score = +score;
    const { currentFrameTotal, isEndOfFrame, isGameOver } = this.state;
    let mapping = isEndOfFrame && currentFrameTotal + score === this.MAX_TOTALS_LENGTH ? '/' : score === this.MAX_TOTALS_LENGTH ? 'X' : score;

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
      <div className="bg-blue h-100">
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