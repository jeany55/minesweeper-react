import React, { createRef, Component } from 'react';
import { InputNumber, Button } from 'antd';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import 'antd/dist/antd.css';
import './App.css';
import { generateGameState } from './utils/gameManagement';
import GameBoard from './components/GameBoard';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameState: [],
      columns: 10,
      rows: 10,
      mines: 40,
    };
  }

  startGame() {
    const gameState = generateGameState(this.state.rows, this.state.columns, this.state.mines);

    this.setState(() => ({ gameState }));
  }

  renderGameSettings() {
    return (
      <>
        <Seperator>
          <Label>Rows</Label>
          <InputNumber min="1" max="250" defaultValue={this.state.rows} onChange={(value) => this.setState({ rows: value })} />
        </Seperator>
        <Seperator>
          <Label>Columns</Label>
          <InputNumber min="1" max="250" defaultValue={this.state.columns} onChange={(value) => this.setState({ columns: value })} />
        </Seperator>
        <Seperator>
          <Label>Mines</Label>
          <InputNumber min="1" max="250" defaultValue={this.state.mines} onChange={(value) => this.setState({ mines: value })} />
        </Seperator>
        <Seperator>
          <Button type="primary" id="startGame" onClick={() => this.startGame()}>Start Game</Button>
        </Seperator>
      </>
    );
  }

  render() {
    return (
      <div className="App">
        <h1>
          Minesweeper
        </h1>

        {console.log(this.state.gameState)}

        {isEmpty(this.state.gameState) ? this.renderGameSettings() : <GameBoard gameState={this.state.gameState} />}
      </div>
    );
  }
}

const Label = styled.div`
  display: inline-block;
  width: 5em;
  text-align: right;
  padding-right: 1em
`;

const Seperator = styled.div`
  padding-top: 0.25em;
  padding-bottom: 0.25em
`;

export default App;
