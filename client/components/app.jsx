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
      waitTimes: [],
      total: 0,
      currentFrameTotal: 0,
      totalIndex: 1,
      isEndOfFrame: false,
      isGameOver: false,
    };

    this.updateScore = this.updateScore.bind(this);
  }

  determineIsGameOver(score) {
    const { isGameOver, totalIndex } = this.state;
    return isGameOver || (Math.floor(totalIndex / 2) === 10 && isEndOfFrame && (score !== '/' || score !== 'X'))
  }

  calculateBoundIndex(subMappings, k, boundIndex) {
    let OUT_OF_BOUND = 100;
    let STRIKE = 2;
    let ONE = 1
    // console.log('INSIDE --- k==>', k);

    if (subMappings[k] === 'X') {
      if (!subMappings[k + 2] || (!subMappings[k + 4] && subMappings[k + 2] === 'X')) {
        boundIndex += OUT_OF_BOUND;
      }
      if (subMappings[k + 2] === 'X') {
        // console.log('STRIKE')
        boundIndex += STRIKE;
        if (subMappings[k + 4] === 'X') {
          // console.log('DOUBLE STRIKE');
          boundIndex += STRIKE;
        }
      } else {
        console.log('NOTHING');
        boundIndex += 1;
        // console.log(boundIndex, 'NOTHING AFTER');
      }
    } else if (subMappings[k] === '/') {
      if (subMappings[k + 1] === '-') {
        console.log("STRIKE")
        boundIndex += STRIKE;
      } else {
        // console.log("NOT STRIKE");
        boundIndex += ONE;
        // console.log('boundIndex', boundIndex);
      }
    }
    return boundIndex;
  }

  updateTotal(score) {
    let { totals, subFrames, subMappings, waitTimes, total, currentFrameTotal, totalIndex } = this.state;
    let k = totalIndex;
    let waitTime = waitTimes[Math.floor(k / 2)];
    let boundIndex = this.calculateBoundIndex(subMappings, k, totalIndex);
    let STRIKE = 2;
    let ONE = 1;
    let lastBoundIndex = boundIndex;

    while (waitTime >= 0 && subFrames[boundIndex] >= 0) {
      console.log(boundIndex, 'bound index');
      console.log(subFrames[boundIndex], 'item');
      console.log(k, 'k');
      console.log('top')
      console.log('-----------------');
      if ((/[\/X]/).test(subMappings[k])) {
        total += subFrames[k - 1] + subFrames[k];
        if (boundIndex === STRIKE + STRIKE + k) {
          console.log('-----IF-----')
          total += subFrames[boundIndex];
          boundIndex -= 2;
          total += subFrames[boundIndex];
        } else if (boundIndex === STRIKE + ONE + k) {
          console.log('-----ELSE IF-----')
          // debugger;
          // console.log(subFrames[boundIndex], 'item', boundIndex, 'bound index');
          total += subFrames[boundIndex];
          boundIndex -= 1;
          // console.log(subFrames[boundIndex], 'item', boundIndex, 'bound index');
          total += subFrames[boundIndex];
        } else {
          console.log('-----ELSE-----')
          console.log(boundIndex, subFrames);
          total += subFrames[boundIndex];
          console.log(total);
          if (subMappings[boundIndex - 1] !== '/' && subMappings[boundIndex + 1]) {
            console.log('YES');
            boundIndex += 1;
            total += subFrames[boundIndex];
          }
        }
        // console.log(boundIndex, 'bound index');
        // console.log(k, 'k');
        // console.log('-----------------');
      } else {
        console.log('----END----')
        total += currentFrameTotal + score;
        currentFrameTotal = 0;
      }
      totals.push(total);
      k += 2;
      waitTime = waitTimes[Math.floor(k / 2)];
      boundIndex = this.calculateBoundIndex(subMappings, k, k);
      lastBoundIndex = boundIndex;
      // console.log(boundIndex, 'bound index');
      // console.log(subFrames[boundIndex], 'item');
      // console.log(k, 'k');
      // console.log('-----------------');
      // console.log('***************');
      // console.log(total);
      // console.log('***************');

    }

    this.setState({
      totals: totals,
      total: total,
      totalIndex: k,
    });
  }

  updateFrameScore(score, mapping) {
    let {
      subFrames,
      subMappings,
      waitTimes,
      currentFrameTotal,
      isEndOfFrame,
    } = this.state;

    let waitCount = mapping === '/' ? 1 : mapping === 'X' ? 2 : 0;

    if (mapping === 'X') {
      subFrames.push(0);
      subMappings.push('-');
    }
    subFrames.push(score);
    subMappings.push(mapping);

    // add waitTime for Frame and reset currentFrameTotal if end of frame
    if ((isEndOfFrame || mapping === 'X') && subFrames.length < 20) {
      waitTimes.push(waitCount);

      // if not end of frame increment currentFrameTotal by score
    }
    if (!isEndOfFrame || mapping === 'X') {
      currentFrameTotal = mapping === 'X' ? 0 : score;
    }

    this.setState({
      subFrames: subFrames,
      subMappings: subMappings,
      waitTimes: waitTimes,
      currentFrameTotal: currentFrameTotal,
      isEndOfFrame: subFrames.length < 21 && mapping !== 'X' ? !isEndOfFrame : isEndOfFrame,
    }, () => this.updateTotal(score));

  }

  updateScore(score) {
    score = +score;
    const { currentFrameTotal, isEndOfFrame, isGameOver } = this.state;
    let mapping = isEndOfFrame && currentFrameTotal + score === 10 ? '/' : score === 10 ? 'X' : score;

    if (!this.determineIsGameOver(mapping)) {
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
            subFrames={this.state.subFrames}
            totals={this.state.totals}
          />
          <div className="m-auto d-flex justify-content-between col-6">
            <KeyPad
              updateScore={this.updateScore}
            />
            <ButtonPanel
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;