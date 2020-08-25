import { random, get } from 'lodash';

export const generateGameState = (rows, columns, mines) => {
  const gameState = [];
  let minesRemaining = mines;
  let squaresRemaining = rows * columns;

  for (let i = 0; i < rows; i += 1) {
    const row = [];

    // Generate mines
    for (let g = 0; g < columns; g += 1) {
      const element = {
        mine: false,
      };

      const calc = minesRemaining / squaresRemaining;

      if (random(0, 1, true) <= calc) {
        element.mine = true;
        minesRemaining -= 1;
      }

      row.push(element);
      squaresRemaining -= 1;
    }

    gameState.push(row);
  }

  // Calculate numbers
  for (let column = 0; column < rows; column += 1) {
    for (let row = 0; row < columns; row += 1) {
      if (!gameState[column][row].mine) {
        // Calculate number of mines beside
        let mineCount = 0;

        if (get(gameState, `[${column - 1}][${row}].mine`)) mineCount += 1;
        if (get(gameState, `[${column + 1}][${row}].mine`)) mineCount += 1;
        if (get(gameState, `[${column}][${row + 1}].mine`)) mineCount += 1;
        if (get(gameState, `[${column}][${row - 1}].mine`)) mineCount += 1;
        if (get(gameState, `[${column + 1}][${row + 1}].mine`)) mineCount += 1;
        if (get(gameState, `[${column - 1}][${row + 1}].mine`)) mineCount += 1;
        if (get(gameState, `[${column + 1}][${row - 1}].mine`)) mineCount += 1;
        if (get(gameState, `[${column - 1}][${row - 1}].mine`)) mineCount += 1;

        if (mineCount) gameState[column][row].number = mineCount;
      }
    }
  }

  console.log(JSON.stringify(gameState));

  return gameState;
};

export const debug = () => {
  console.log('ok');
};
