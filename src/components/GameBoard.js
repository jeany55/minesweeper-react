import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import flag from '../img/flag.png';
import mine from '../img/mine.png';

class GameBoard extends Component {
  constructor() {
    super();
    this.state = {
      debug: false,
    };
  }

  renderGameSquare(square, column, row) {
    const showMine = square.mine && (this.state.debug || this.props.gameOver);
    let backgroundColour;

    if (square.mine && this.props.gameOver) {
      backgroundColour = '#6b0000';
    } else if (square.mine && this.props.victory) {
      backgroundColour = '#3DFF31';
    } else if (square.discovered) {
      backgroundColour = '#CCDFDB';
    } else {
      backgroundColour = '#B5B5B5';
    }

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
        backgroundColor={backgroundColour}
      >
        {square.discovered && square.number }
        {(square.flag || (square.mine && this.props.victory)) && !this.state.debug && <img src={flag} alt="Flag" />}
        {showMine && <img src={mine} alt="Flag" />}
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
        <div style={{ paddingTop: '0.5em' }}>
          {this.props.gameOver || this.props.victory ? (
            <>
              <div style={{ paddingBottom: '0.5em' }}>
                Game Over!
              </div>
              <Button type="primary" id="reStart" onClick={() => this.props.resetGame()}>
                Reset
              </Button>
            </>
          ) : ' '}
        </div>
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
  gameOver: PropTypes.bool.isRequired,
  resetGame: PropTypes.func.isRequired,
  victory: PropTypes.bool.isRequired,
};

const GameSquare = styled.div`
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: ${(props) => props.backgroundColor};
  border: 1px solid white;
  justify-content: center;
  vertical-align: middle;
`;

export default GameBoard;
