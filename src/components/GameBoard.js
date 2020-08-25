import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class GameBoard extends Component {
  renderGameSquare(square) {
    return (
      <GameSquare>
        {square.mine && 'x'}
        {square.number && square.number}
      </GameSquare>
    );
  }

  renderGamestate() {
    return (
      <div>
        {this.props.gameState.map((a) => (
          <div style={{ height: '25px' }}>
            {a.map((item) => {
              const b = 'ok';
              return this.renderGameSquare(item);
            })}
          </div>
        ))}
      </div>
    );
  }

  render() {
    console.log('rendering');
    return (
      <div>
        {this.renderGamestate()}
      </div>
    );
  }
}

GameBoard.propTypes = {
  gameState: PropTypes.instanceOf(Array).isRequired,
};

const GameSquare = styled.div`
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: #999999;
  border: 1px solid white;
  justify-content: center;
  vertical-align: middle;
`;

export default GameBoard;
