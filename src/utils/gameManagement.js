import { random, get, cloneDeep } from 'lodash';

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
        discovered: false,
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
        // Calculate number of mines beside each square
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

  return gameState;
};

export const toggleFlag = (column, row, gameState) => {
  const newGameState = cloneDeep(gameState);

  newGameState[row][column].flag = !gameState[row][column].flag;

  return newGameState;
};

export const discoverSquare = (column, row, gameState) => {
  const newGameState = cloneDeep(gameState);

  const discoverSquareRecursive = (rColumn, rRow) => {
    // BASE CASE: If square is out of bounds, has a mine, or is discovered

    if (!get(newGameState, `[${rRow}][${rColumn}]`) || newGameState[rRow][rColumn].mine || newGameState[rRow][rColumn].discovered) return;
    if (newGameState[rRow][rColumn].number) {
      newGameState[rRow][rColumn].discovered = true;
      return;
    }

    newGameState[rRow][rColumn].discovered = true;

    discoverSquareRecursive(rColumn + 1, rRow);
    discoverSquareRecursive(rColumn - 1, rRow);
    discoverSquareRecursive(rColumn, rRow + 1);
    discoverSquareRecursive(rColumn, rRow - 1);
    discoverSquareRecursive(rColumn + 1, rRow + 1);
    discoverSquareRecursive(rColumn - 1, rRow + 1);
    discoverSquareRecursive(rColumn + 1, rRow - 1);
    discoverSquareRecursive(rColumn - 1, rRow - 1);
  };

  // If square does not have a number recursively discover...
  if (!newGameState[row][column].number) {
    // console.log(`${column} ${row}`);
    discoverSquareRecursive(column, row);
  } else {
    newGameState[row][column].discovered = true;
  }

  return newGameState;
};

export const checkIfFlag = (column, row, gameState) => gameState[row][column].flag === true;

export const checkIfMine = (column, row, gameState) => gameState[row][column].mine === true;

export const
  checkIfDiscovered = (column, row, gameState) => gameState[row][column].discovered === true;
