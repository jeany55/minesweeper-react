import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import flag from '../img/flag.png';

class GameBoard extends Component {
  constructor() {
    super();
    this.state = {
      debug: false,
    };
  }

  renderGameSquare(square, column, row) {
    return (
      <GameSquare
        onMouseUp={(event) => {
          if (event.button === 0) {
            this.props.onSquareClick(column, row);
          } else {
            this.props.onSquareRightClick(column, row);
          }
        }}
        onContextMenu={(event) => { event.preventDefault(); }}
        discovered={square.discovered}
      >
        {square.discovered && square.number }
        {square.flag && !this.state.debug && <img src={flag} alt="Flag" />}
        {square.mine && this.state.debug && 'M'}
      </GameSquare>
    );
  }

  renderGamestate() {
    return (
      <div>
        {this.props.gameState.map((a, column) => (
          <div style={{ height: '25px', verticalAlign: 'middle', justifyContent: 'center' }}>
            {a.map((item, row) => this.renderGameSquare(item, column, row))}
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div style={{ paddingBottom: '0.5em' }}>
          <span style={{ fontWeight: 'bold' }}>Flags Remaining: </span>
          <span>{this.props.mineCount - this.props.flags}</span>
        </div>
        <div style={{ paddingBottom: '2em' }}>
          <Button type="secondary" id="debug" onClick={() => this.setState((prevState) => ({ debug: !prevState.debug }))}>
            {this.state.debug ? 'Hide ' : 'Show '}
            Debug
          </Button>
        </div>
        {this.renderGamestate()}
      </div>
    );
  }
}

GameBoard.propTypes = {
  gameState: PropTypes.instanceOf(Array).isRequired,
  mineCount: PropTypes.number.isRequired,
  flags: PropTypes.number.isRequired,
  onSquareClick: PropTypes.func.isRequired,
  onSquareRightClick: PropTypes.func.isRequired,
};

const GameSquare = styled.div`
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: ${(props) => (props.discovered ? '#CCDFDB' : '#B5B5B5')};
  border: 1px solid white;
  justify-content: center;
  vertical-align: middle;
`;

export default GameBoard;
