import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  SwipeableDrawer,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import BarChartIcon from '@mui/icons-material/BarChart';

const glassCard = {
  background: 'rgba(15, 23, 42, 0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  borderRadius: '20px',
  overflow: 'hidden',
};

const numberColors = {
  1: '#60a5fa',
  2: '#34d399',
  3: '#f472b6',
  4: '#a78bfa',
  5: '#fb923c',
  6: '#22d3ee',
  7: '#e879f9',
  8: '#94a3b8',
};

const LONG_PRESS_MS = 400;

function MineIcon({ gameOver, victory, size }) {
  const isLoss = gameOver && !victory;
  const color = isLoss ? '#ef4444' : '#34d399';
  const glowColor = isLoss ? 'rgba(239,68,68,0.5)' : 'rgba(52,211,153,0.5)';
  return (
    <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `drop-shadow(0 0 4px ${glowColor})` }}>
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill={color}>
        <circle cx="12" cy="12" r="7" />
        <rect x="11" y="1" width="2" height="6" rx="1" />
        <rect x="11" y="17" width="2" height="6" rx="1" />
        <rect x="1" y="11" width="6" height="2" rx="1" />
        <rect x="17" y="11" width="6" height="2" rx="1" />
        <rect x="4.1" y="4.1" width="2" height="5" rx="1" transform="rotate(-45 5.1 6.6)" />
        <rect x="15.5" y="15.5" width="2" height="5" rx="1" transform="rotate(-45 16.5 18)" />
        <rect x="15.5" y="3.5" width="2" height="5" rx="1" transform="rotate(45 16.5 6)" />
        <rect x="4.1" y="14.9" width="2" height="5" rx="1" transform="rotate(45 5.1 17.4)" />
        <circle cx="9" cy="9" r="2.5" fill="rgba(255,255,255,0.3)" />
      </svg>
    </Box>
  );
}

function GameSquare({ square, onClick, onRightClick, gameOver, victory, debug, digLocked, tileSize }) {
  const showMine = square.mine && (debug || gameOver);
  const isVictoryMine = square.mine && victory && !debug;
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);
  const isTouchDevice = useRef(false);

  let bg;
  if (square.mine && gameOver && !victory) {
    bg = 'rgba(220, 38, 38, 0.35)';
  } else if (isVictoryMine) {
    bg = 'rgba(52, 211, 153, 0.3)';
  } else if (square.discovered) {
    bg = 'rgba(148, 163, 184, 0.08)';
  } else {
    bg = 'rgba(148, 163, 184, 0.15)';
  }

  const handleTouchStart = useCallback(() => {
    isTouchDevice.current = true;
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onRightClick();
    }, LONG_PRESS_MS);
  }, [onRightClick]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!didLongPress.current && !digLocked) {
      onClick();
    }
  }, [onClick, digLocked]);

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Icon sizes scale with tile
  const iconSize = Math.max(12, Math.round(tileSize * 0.45));

  return (
    <Box
      onMouseUp={(e) => {
        if (isTouchDevice.current) return;
        if (e.button === 0) onClick();
        else onRightClick();
      }}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      sx={{
        width: tileSize,
        height: tileSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border: '1px solid',
        borderColor: square.discovered
          ? 'rgba(148, 163, 184, 0.06)'
          : 'rgba(148, 163, 184, 0.12)',
        borderRadius: '4px',
        cursor: gameOver || victory ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        fontSize: Math.max(10, Math.round(tileSize * 0.38)),
        fontWeight: 700,
        fontFamily: '"JetBrains Mono", monospace',
        position: 'relative',
        ...(!square.discovered && !gameOver && !victory && {
          '&:hover': {
            background: 'rgba(167, 139, 250, 0.2)',
            borderColor: 'rgba(167, 139, 250, 0.3)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }),
      }}
    >
      {square.discovered && square.number && (
        <Typography
          component="span"
          sx={{
            fontSize: 'inherit',
            fontWeight: 700,
            fontFamily: '"JetBrains Mono", monospace',
            color: numberColors[square.number] || '#f1f5f9',
            lineHeight: 1,
          }}
        >
          {square.number}
        </Typography>
      )}
      {(square.flag || isVictoryMine) && !debug && (
        <FlagIcon sx={{ fontSize: iconSize, color: '#f472b6' }} />
      )}
      {showMine && (
        <MineIcon gameOver={gameOver} victory={victory} size={iconSize} />
      )}
    </Box>
  );
}

// Compute tile size: fill available width, clamped between min/max for touch targets
function useTileSize(columnCount) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 800
  );

  React.useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return useMemo(() => {
    // Available width: viewport minus container padding minus card padding minus card border
    const containerPad = windowWidth < 600 ? 32 : windowWidth < 900 ? 48 : 64;
    const cardPad = windowWidth < 600 ? 24 : windowWidth < 900 ? 32 : 48;
    const gridBorder = 4;
    const available = windowWidth - containerPad - cardPad - gridBorder;

    // Each tile also has 2px border (1px each side) accounted for in its box-sizing
    const idealSize = Math.floor(available / columnCount);

    // Clamp: 24px minimum (readable), 44px max (comfortable touch on mobile), 40px max on desktop
    const isTouch = windowWidth < 900;
    const minSize = 24;
    const maxSize = isTouch ? 44 : 40;

    return Math.max(minSize, Math.min(maxSize, idealSize));
  }, [columnCount, windowWidth]);
}

function GameBoard({ gameState, mineCount, flags, columnCount, onSquareClick, onSquareRightClick, gameOver, resetGame, victory, time, rows, columns, stats, resetStats, progress, formatTime }) {
  const [debug, setDebug] = useState(false);
  const [digLocked, setDigLocked] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const tileSize = useTileSize(columnCount);

  const statusColor = victory ? '#34d399' : gameOver ? '#ef4444' : '#a78bfa';
  const statusText = victory ? 'Victory!' : gameOver ? 'Game Over' : 'Playing';

  const handleNewGame = () => {
    if (gameOver || victory) {
      resetGame();
    } else {
      setConfirmOpen(true);
    }
  };

  const instructionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: 2,
    py: 1,
    borderRadius: '10px',
    background: 'rgba(148,163,184,0.06)',
    border: '1px solid rgba(148,163,184,0.08)',
  };

  return (
    <Box className="rise">
      {/* Status Bar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
      >
        <Chip
          icon={<FlagIcon sx={{ fontSize: 16 }} />}
          label={`${mineCount - flags} remaining`}
          sx={{
            background: 'rgba(244, 114, 182, 0.12)',
            border: '1px solid rgba(244, 114, 182, 0.2)',
            color: '#f472b6',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 500,
          }}
        />
        <Chip
          icon={<TimerIcon sx={{ fontSize: 16 }} />}
          label={time}
          sx={{
            background: 'rgba(167, 139, 250, 0.12)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            color: '#a78bfa',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 500,
          }}
        />
        {(gameOver || victory) && (
          <Chip
            icon={victory
              ? <EmojiEventsIcon sx={{ fontSize: 16 }} />
              : <SentimentVeryDissatisfiedIcon sx={{ fontSize: 16 }} />
            }
            label={statusText}
            sx={{
              background: victory ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${victory ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: statusColor,
              fontWeight: 600,
            }}
          />
        )}
      </Stack>

      {/* Instructions - Desktop */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={1.5}
        sx={{ mb: 2, display: { xs: 'none', md: 'flex' } }}
      >
        <Box sx={instructionStyle}>
          <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
            Left click
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            to dig
          </Typography>
        </Box>
        <Box sx={instructionStyle}>
          <Typography sx={{ color: '#f472b6', fontSize: '0.8rem', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
            Right click
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            to flag
          </Typography>
        </Box>
      </Stack>

      {/* Instructions - Mobile/Tablet */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={1.5}
        sx={{ mb: 2, display: { xs: 'flex', md: 'none' } }}
      >
        <Box sx={instructionStyle}>
          <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
            Tap
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            to dig
          </Typography>
        </Box>
        <Box sx={instructionStyle}>
          <Typography sx={{ color: '#f472b6', fontSize: '0.8rem', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
            Long press
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            to flag
          </Typography>
        </Box>
      </Stack>

      {/* Game Board Card */}
      <Box sx={{
        ...glassCard,
        p: { xs: 1.5, sm: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'auto',
      }}>
        {/* Board Grid */}
        <Box sx={{
          display: 'inline-block',
          lineHeight: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.08)',
        }}>
          {gameState.map((row, column) => (
            <Box key={column} sx={{ display: 'flex', lineHeight: 0 }}>
              {row.map((square, rowIdx) => (
                <GameSquare
                  key={`${column}-${rowIdx}`}
                  square={square}
                  onClick={() => onSquareClick(column, rowIdx)}
                  onRightClick={() => onSquareRightClick(column, rowIdx)}
                  gameOver={gameOver}
                  victory={victory}
                  debug={debug}
                  digLocked={digLocked}
                  tileSize={tileSize}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Controls */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1.5}
        sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}
      >
        {/* Dig lock switch - mobile/tablet only */}
        <Box
          onClick={() => setDigLocked((d) => !d)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            px: 2,
            py: 1.2,
            borderRadius: '14px',
            border: '1px solid',
            borderColor: digLocked ? 'rgba(251,191,36,0.35)' : 'rgba(148,163,184,0.15)',
            background: digLocked ? 'rgba(251,191,36,0.06)' : 'rgba(148,163,184,0.04)',
            transition: 'all 0.2s ease',
            userSelect: 'none',
          }}
        >
          {digLocked
            ? <LockIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
            : <LockOpenIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
          }
          <Typography sx={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: digLocked ? '#fbbf24' : '#94a3b8',
            fontFamily: '"JetBrains Mono", monospace',
          }}>
            Dig lock
          </Typography>
          {/* Custom switch track */}
          <Box sx={{
            width: 44,
            height: 26,
            borderRadius: '13px',
            background: digLocked
              ? 'rgba(251,191,36,0.3)'
              : 'rgba(148,163,184,0.2)',
            position: 'relative',
            transition: 'background 0.2s ease',
            flexShrink: 0,
          }}>
            {/* Switch thumb */}
            <Box sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: digLocked ? '#fbbf24' : '#94a3b8',
              position: 'absolute',
              top: 3,
              left: digLocked ? 21 : 3,
              transition: 'all 0.2s ease',
              boxShadow: digLocked
                ? '0 0 8px rgba(251,191,36,0.4)'
                : '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </Box>
        </Box>

        <Tooltip title={debug ? 'Hide mines (cheating!)' : 'Reveal mines (cheating!)'}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setDebug((d) => !d)}
            startIcon={debug ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderColor: debug ? 'rgba(251,191,36,0.4)' : 'rgba(148,163,184,0.12)',
              borderRadius: '12px',
              color: debug ? '#fbbf24' : 'rgba(148,163,184,0.35)',
              background: debug ? 'rgba(251,191,36,0.08)' : 'transparent',
              fontSize: '0.65rem',
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: debug ? 1 : 0.5,
              '&:hover': {
                background: 'rgba(251,191,36,0.08)',
                borderColor: 'rgba(251,191,36,0.3)',
                color: '#fbbf24',
                opacity: 1,
              },
            }}
          >
            cheat
          </Button>
        </Tooltip>

        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleNewGame}
          sx={{
            borderColor: 'rgba(148,163,184,0.2)',
            color: 'text.secondary',
            '&:hover': {
              borderColor: '#f472b6',
              color: '#f472b6',
              background: 'rgba(244,114,182,0.08)',
            },
          }}
        >
          New Game
        </Button>

        {/* Stats button - mobile/tablet only (panels visible on lg+) */}
        <Tooltip title="View stats">
          <Button
            variant="outlined"
            onClick={() => setStatsOpen(true)}
            sx={{
              display: { xs: 'inline-flex', lg: 'none' },
              minWidth: 0,
              px: 1.5,
              borderColor: 'rgba(148,163,184,0.2)',
              color: 'text.secondary',
              '&:hover': {
                borderColor: '#a78bfa',
                color: '#a78bfa',
                background: 'rgba(167,139,250,0.08)',
              },
            }}
          >
            <BarChartIcon sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      </Stack>

      {/* Stats Drawer - mobile/tablet */}
      <SwipeableDrawer
        anchor="bottom"
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        onOpen={() => setStatsOpen(true)}
        disableSwipeToOpen
        swipeAreaWidth={0}
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.97)',
            backdropFilter: 'blur(24px)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderBottom: 'none',
            maxHeight: '70vh',
            px: 3,
            pt: 1.5,
            pb: 4,
          },
        }}
      >
        {/* Drag handle - clickable to close */}
        <Box
          onClick={() => setStatsOpen(false)}
          sx={{ display: 'flex', justifyContent: 'center', mb: 2, py: 1, cursor: 'pointer' }}
        >
          <Box sx={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(148,163,184,0.25)' }} />
        </Box>

        <Stack spacing={3}>
          {/* Game Info */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontFamily: '"JetBrains Mono", monospace', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>
              Game Info
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              {[
                { label: 'Grid', value: `${rows} x ${columns}` },
                { label: 'Mines', value: mineCount },
                { label: 'Density', value: `${Math.round((mineCount / (rows * columns)) * 100)}%` },
                { label: 'Progress', value: `${progress}%` },
              ].map((item) => (
                <Box key={item.label} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: '#f1f5f9' }}>
                    {item.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Stats */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontFamily: '"JetBrains Mono", monospace', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Stats
              </Typography>
              <Typography
                component="button"
                onClick={resetStats}
                sx={{
                  fontSize: '0.6rem',
                  fontFamily: '"JetBrains Mono", monospace',
                  color: 'rgba(148,163,184,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: 'none',
                  border: '1px solid rgba(148,163,184,0.1)',
                  borderRadius: '6px',
                  px: 1,
                  py: 0.3,
                  cursor: 'pointer',
                  '&:hover': { color: '#f472b6', borderColor: 'rgba(244,114,182,0.3)' },
                }}
              >
                Reset
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="center">
              {[
                { label: 'Played', value: stats.gamesPlayed },
                { label: 'Won', value: stats.gamesWon },
                { label: 'Win Rate', value: stats.gamesPlayed > 0 ? `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%` : '--' },
                { label: 'Best', value: stats.bestTime !== null ? formatTime(stats.bestTime) : '--' },
              ].map((item) => (
                <Box key={item.label} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: '#f1f5f9' }}>
                    {item.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </SwipeableDrawer>

      {/* Confirm New Game Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', fontWeight: 600 }}>
          Abandon current game?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#94a3b8' }}>
            Your progress will be lost. Are you sure you want to start a new game?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{ color: '#94a3b8' }}
          >
            Keep Playing
          </Button>
          <Button
            onClick={() => { setConfirmOpen(false); resetGame(); }}
            sx={{
              color: '#f472b6',
              '&:hover': { background: 'rgba(244,114,182,0.08)' },
            }}
          >
            New Game
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GameBoard;
