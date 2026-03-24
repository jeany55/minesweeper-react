import React, { useState, useCallback } from 'react';
import { isEmpty } from 'lodash';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Slider,
} from '@mui/material';
import {
  generateGameState,
  checkIfFlag,
  toggleFlag,
  discoverSquare,
  checkIfDiscovered,
  checkIfMine,
  checkVictory,
} from './utils/gameManagement';
import GameBoard from './components/GameBoard';

const glassCard = {
  background: 'rgba(15, 23, 42, 0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  borderRadius: '20px',
  overflow: 'hidden',
};

function App() {
  const [gameState, setGameState] = useState([]);
  const [columns, setColumns] = useState(10);
  const [rows, setRows] = useState(10);
  const [mines, setMines] = useState(20);
  const [flags, setFlags] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [timerRef, setTimerRef] = useState(null);

  const maxMines = Math.max(1, Math.floor(rows * columns * 0.8));

  const startGame = useCallback(() => {
    const clampedMines = Math.min(mines, Math.floor(rows * columns * 0.8));
    const state = generateGameState(rows, columns, clampedMines);
    setGameState(state);
    setFlags(0);
    setGameOver(false);
    setTime(0);
    if (timerRef) clearInterval(timerRef);
    const ref = setInterval(() => setTime((t) => t + 1), 1000);
    setTimerRef(ref);
  }, [rows, columns, mines, timerRef]);

  const resetGame = useCallback(() => {
    setGameState([]);
    setGameOver(false);
    setFlags(0);
    setTime(0);
    if (timerRef) clearInterval(timerRef);
    setTimerRef(null);
  }, [timerRef]);

  const victory = !isEmpty(gameState) && checkVictory(gameState, mines);

  if (victory && timerRef) {
    clearInterval(timerRef);
    setTimerRef(null);
  }
  if (gameOver && timerRef) {
    clearInterval(timerRef);
    setTimerRef(null);
  }

  const onSquareRightClick = useCallback((y, x) => {
    if (gameOver) return;
    setGameState((prev) => {
      if (checkIfDiscovered(x, y, prev)) return prev;
      const squareHasFlag = checkIfFlag(x, y, prev);
      if (flags === mines && !squareHasFlag) return prev;
      setFlags((f) => (squareHasFlag ? f - 1 : f + 1));
      return toggleFlag(x, y, prev);
    });
  }, [gameOver, flags, mines]);

  const onSquareLeftClick = useCallback((y, x) => {
    if (gameOver) return;
    setGameState((prev) => {
      if (checkIfFlag(x, y, prev)) return prev;
      if (checkIfMine(x, y, prev)) {
        setGameOver(true);
        return prev;
      }
      return discoverSquare(x, y, prev);
    });
  }, [gameOver]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Ambient glow orbs */}
      <Box sx={{
        position: 'fixed', top: '-10%', left: '-10%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
        animation: 'breathe 7s ease-in-out infinite', pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'fixed', bottom: '-15%', right: '-10%', width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)',
        animation: 'breathe2 9s ease-in-out infinite', pointerEvents: 'none', zIndex: 0,
      }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }} className="fade-in-up">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #818cf8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              mb: 1,
            }}
          >
            Minesweeper
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
            react + material ui
          </Typography>
        </Box>

        {isEmpty(gameState) ? (
          /* Startup / Settings Card */
          <Box sx={{ maxWidth: 460, mx: 'auto' }} className="rise">
            {/* Hero mine illustration */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{
                display: 'inline-flex',
                position: 'relative',
                width: 120,
                height: 120,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Pulsing ring */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid rgba(167,139,250,0.15)',
                  animation: 'pulse 3s ease-in-out infinite',
                }} />
                <Box sx={{
                  position: 'absolute',
                  inset: 10,
                  borderRadius: '50%',
                  border: '1px solid rgba(244,114,182,0.1)',
                  animation: 'pulse 3s ease-in-out 1s infinite',
                }} />
                {/* Mine SVG */}
                <svg viewBox="0 0 24 24" width="56" height="56">
                  <defs>
                    <linearGradient id="mineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="7" fill="url(#mineGrad)" />
                  <rect x="11" y="1" width="2" height="6" rx="1" fill="url(#mineGrad)" />
                  <rect x="11" y="17" width="2" height="6" rx="1" fill="url(#mineGrad)" />
                  <rect x="1" y="11" width="6" height="2" rx="1" fill="url(#mineGrad)" />
                  <rect x="17" y="11" width="6" height="2" rx="1" fill="url(#mineGrad)" />
                  <rect x="4.1" y="4.1" width="2" height="5" rx="1" fill="url(#mineGrad)" transform="rotate(-45 5.1 6.6)" />
                  <rect x="15.5" y="15.5" width="2" height="5" rx="1" fill="url(#mineGrad)" transform="rotate(-45 16.5 18)" />
                  <rect x="15.5" y="3.5" width="2" height="5" rx="1" fill="url(#mineGrad)" transform="rotate(45 16.5 6)" />
                  <rect x="4.1" y="14.9" width="2" height="5" rx="1" fill="url(#mineGrad)" transform="rotate(45 5.1 17.4)" />
                  <circle cx="9" cy="9" r="2.5" fill="rgba(255,255,255,0.25)" />
                </svg>
              </Box>
            </Box>

            {/* Mini grid decoration */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '3px', mb: 3 }}>
              {[
                [0,1,0,1,0],
                [1,0,0,0,1],
                [0,0,1,0,0],
                [1,0,0,0,1],
                [0,1,0,1,0],
              ].map((row, ri) => (
                <Box key={ri} sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {row.map((cell, ci) => (
                    <Box
                      key={ci}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '2px',
                        background: cell
                          ? 'rgba(167,139,250,0.35)'
                          : 'rgba(148,163,184,0.08)',
                        animation: cell ? `pulse ${2 + (ri + ci) * 0.3}s ease-in-out ${(ri * 0.2 + ci * 0.1)}s infinite` : 'none',
                      }}
                    />
                  ))}
                </Box>
              ))}
            </Box>

            <Box sx={{ ...glassCard, p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
                New Game
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                Configure your minefield
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Rows: {rows}
                  </Typography>
                  <Slider
                    value={rows}
                    onChange={(_, v) => setRows(v)}
                    min={5}
                    max={30}
                    valueLabelDisplay="auto"
                    sx={{
                      color: '#a78bfa',
                      '& .MuiSlider-thumb': {
                        boxShadow: '0 0 10px rgba(167,139,250,0.4)',
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Columns: {columns}
                  </Typography>
                  <Slider
                    value={columns}
                    onChange={(_, v) => setColumns(v)}
                    min={5}
                    max={30}
                    valueLabelDisplay="auto"
                    sx={{
                      color: '#a78bfa',
                      '& .MuiSlider-thumb': {
                        boxShadow: '0 0 10px rgba(167,139,250,0.4)',
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Mines: {mines}
                  </Typography>
                  <Slider
                    value={Math.min(mines, maxMines)}
                    onChange={(_, v) => setMines(v)}
                    min={1}
                    max={maxMines}
                    valueLabelDisplay="auto"
                    sx={{
                      color: '#f472b6',
                      '& .MuiSlider-thumb': {
                        boxShadow: '0 0 10px rgba(244,114,182,0.4)',
                      },
                    }}
                  />
                </Box>

                <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  {rows} x {columns} grid with {Math.min(mines, maxMines)} mines ({Math.round((Math.min(mines, maxMines) / (rows * columns)) * 100)}% density)
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={startGame}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)',
                    boxShadow: '0 4px 20px rgba(167,139,250,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      boxShadow: '0 6px 30px rgba(167,139,250,0.4)',
                    },
                  }}
                >
                  Start Game
                </Button>

                {/* Quick presets */}
                <Stack direction="row" spacing={1} justifyContent="center">
                  {[
                    { label: 'Easy', r: 9, c: 9, m: 10 },
                    { label: 'Medium', r: 16, c: 16, m: 40 },
                    { label: 'Hard', r: 16, c: 30, m: 99 },
                  ].map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outlined"
                      size="small"
                      onClick={() => { setRows(preset.r); setColumns(preset.c); setMines(preset.m); }}
                      sx={{
                        borderColor: 'rgba(148,163,184,0.2)',
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        '&:hover': {
                          borderColor: '#a78bfa',
                          color: '#a78bfa',
                          background: 'rgba(167,139,250,0.08)',
                        },
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Box>
        ) : (
          /* Game Board */
          <GameBoard
            gameState={gameState}
            mineCount={mines}
            flags={flags}
            onSquareClick={onSquareLeftClick}
            onSquareRightClick={onSquareRightClick}
            gameOver={gameOver}
            resetGame={resetGame}
            victory={victory}
            time={formatTime(time)}
          />
        )}
      </Container>
    </Box>
  );
}

export default App;
