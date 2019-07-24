import React from 'react';
import _ from 'underscore';
import ScoreBoard from './scoreBoard.jsx';
import ButtonPanel from './buttonPanel.jsx';
import KeyPad from './keypad.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frames: [],
      subFrames: [],
      waitTimes: [],
      waitTimesStatic: [],
      total: 0,
      currentFrameTotal: 0,
      frameIndex: 0,
      subFrameIndex: 0,
      totalIndex: 0,
      isGameOver: false,
    };

    this.updateScore = this.updateScore.bind(this);
  }

  componentDidMount() {
    this.createNewFrame();
  }

  determineIsGameOver(score) {
    const { isGameOver, subFrameIndex, frameIndex } = this.state;
    return isGameOver || subFrameIndex > 2 || (frameIndex === 9 && subFrameIndex > 1 && (score !== '/' || score !== 'X'))
  }

  createNewFrame() {
    let { frames, frameIndex } = this.state;

    frames[frameIndex++] = {
      values: [],
      total: '-',
    };

    this.setState({
      frames: frames,
      frameIndex: frameIndex,
    });
  }

  updateTotal(score) {
    let { frames, subFrames, waitTimes, waitTimesStatic, total, totalIndex, subFrameIndex } = this.state;
    total += score;

    while (waitTimes[totalIndex] === 0) {
      let isNotStrikeSpareAfterStrikeSpare = false;
      for (let waitIndex = 1; waitIndex <= waitTimesStatic[totalIndex]; waitIndex++) {
        isNotStrikeSpareAfterStrikeSpare = true;
        total += subFrames[totalIndex * 2 - 1 + waitIndex];
      }
      frames[totalIndex].total = total;
      totalIndex = totalIndex + 1;
      console.log('total Index loop', totalIndex);
      if (isNotStrikeSpareAfterStrikeSpare && subFrameIndex > 0) {
        for (let frameIndex = 1; frameIndex <= 2; frameIndex++) {
          total += subFrames[(totalIndex) * 2 - 1 + frameIndex];
          console.log('value', subFrames[(totalIndex) * 2 - 1 + frameIndex]);
        }
        console.log('total Index second loop', totalIndex);
        frames[totalIndex++].total = total;
      }
    }

    if (waitTimes[totalIndex] > 0) {
      waitTimes[totalIndex] -= 1;
      this.setState({
        waitTimes: waitTimes,
        total: total,
      });
    } else {
      this.setState({
        frames: frames,
        totalIndex: totalIndex,
        total: total,
      });
    }

  }

  updateFrameScore(score, mapping) {
    let {
      frames,
      subFrames,
      waitTimes,
      waitTimesStatic,
      currentFrameTotal,
      frameIndex,
      subFrameIndex
    } = this.state;
    let waitCount = mapping === '/' ? 1 : mapping === 'X' ? 2 : 0;
    let mappingArr;

    if (frameIndex < 10) {
      mappingArr = mapping === 'X' ? ['-', 'X'] : [mapping];
    } else {
      mappingArr = [mapping];
    }
    frames[frameIndex - 1].values.push(...mappingArr);

    mappingArr.length === 2 ? subFrames.push(0) : null;
    subFrames.push(score);


    if ((subFrameIndex === 1 || mapping === 'X') && frameIndex < 10) {
      waitTimes.push(waitCount);
      waitTimesStatic.push(waitCount);
      currentFrameTotal = 0;
      subFrameIndex = 0;
      this.createNewFrame();
    } else if (subFrameIndex === 0 || mapping === '/' || mapping === 'X') {
      subFrameIndex += 1;
      currentFrameTotal += score;
      this.setState({
        frames: frames,
      });
    } else {
      this.setState({
        isGameOver: true,
      });
    }

    this.setState({
      subFrames: subFrames,
      waitTimes: waitTimes,
      waitTimesStatic: waitTimesStatic,
      currentFrameTotal: currentFrameTotal,
      subFrameIndex: subFrameIndex,
    }, () => this.updateTotal(score));

  }

  updateScore(score) {
    score = +score;
    const { currentFrameTotal, subFrameIndex, isGameOver } = this.state;
    let mapping = subFrameIndex === 1 && currentFrameTotal + score === 10 ? '/' : score === 10 ? 'X' : score;
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
            frames={this.state.frames}
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