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
      frameIndex: 0,
      subFrameIndex: 0,
      totalIndex: 0,
      isGameOver: false,
    };
  }

  componentDidMount() {
    this.setState({
      frames: _.range(10),
    })
  }

  render() {

    return (
      <div className="bg-blue-lin-grad h-100">
        <header className="h-30 header">
          <h1 className="font-regular page-title">Bowling Score</h1>
        </header>
        <div className="">
          <ScoreBoard
            frames={this.state.frames}
          />
          <div className="m-auto d-flex justify-content-between col-6">
            <KeyPad
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