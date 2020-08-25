import { random } from 'lodash';

export const generateGameState = (rows, columns, mines) => {
  const gameState = [];
  let minesRemaining = mines;
  let squaresRemaining = rows * columns;

  for (let i = 0; i < rows; i += 1) {
    const row = [];

    for (let g = 0; g < columns; g += 1) {
      const element = {
        mine: false,
      };

      const calc = minesRemaining / squaresRemaining;

      if (random(0, 1) <= calc) {
        element.mine = true;
        minesRemaining -= 1;
      }

      row.push(element);
      squaresRemaining -= 1;
    }

    gameState.push(row);
  }

  console.log(JSON.stringify(gameState));

  return gameState;
};
