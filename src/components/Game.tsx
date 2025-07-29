import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Scoreboard from './Scoreboard';
import { GameContainer, GameButton } from './Game.styles';

const GRID_SIZE = 20;

const getRandomCoordinate = () => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
};

const getSafeFood = (snake1: {x: number, y: number}[], snake2: {x: number, y: number}[]) => {
  let food: {x: number, y: number};
  let attempts = 0;
  do {
    food = getRandomCoordinate();
    attempts++;
  } while (
    attempts < 100 && (
      snake1.some(segment => segment.x === food.x && segment.y === food.y) ||
      snake2.some(segment => segment.x === food.x && segment.y === food.y)
    )
  );
  return food;
};

const Game: React.FC = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomCoordinate());
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [twoPlayer, setTwoPlayer] = useState(false);
  const [snake2, setSnake2] = useState<{ x: number; y: number }[]>([]);
  const [direction2, setDirection2] = useState({ x: 0, y: 0 });
  
  // New state for individual player tracking
  const [player1Alive, setPlayer1Alive] = useState(true);
  const [player2Alive, setPlayer2Alive] = useState(true);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameStatus, setGameStatus] = useState<string>('');

  const startGame = () => {
    const initialSnake1 = [{ x: 8, y: 10 }];
    const initialSnake2 = twoPlayer ? [{ x: 12, y: 10 }] : [];
    
    setSnake(initialSnake1);
    if (twoPlayer) {
      setSnake2(initialSnake2);
      setDirection2({ x: 0, y: 0 }); // Start with no movement
    } else {
      setSnake2([]);
      setDirection2({ x: 0, y: 0 });
    }
    setFood(getSafeFood(initialSnake1, initialSnake2));
    setDirection({ x: 0, y: 0 }); // Start with no movement
    setGameOver(false);
    setIsGameActive(true);
    
    // Reset player states and scores
    setPlayer1Alive(true);
    setPlayer2Alive(true);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameStatus('');
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isGameActive) return;
      // Player 1 controls (arrow keys) - only if player 1 is alive
      if (player1Alive) {
        switch (e.key) {
          case 'ArrowUp':
            if (direction.y === 0) setDirection({ x: 0, y: -1 });
            break;
          case 'ArrowDown':
            if (direction.y === 0) setDirection({ x: 0, y: 1 });
            break;
          case 'ArrowLeft':
            if (direction.x === 0) setDirection({ x: -1, y: 0 });
            break;
          case 'ArrowRight':
            if (direction.x === 0) setDirection({ x: 1, y: 0 });
            break;
        }
      }
      // Player 2 controls (WASD) - only if player 2 is alive
      if (twoPlayer && player2Alive) {
        const k = e.key.toLowerCase();
        switch (k) {
          case 'w':
            if (direction2.y === 0) setDirection2({ x: 0, y: -1 });
            break;
          case 's':
            if (direction2.y === 0) setDirection2({ x: 0, y: 1 });
            break;
          case 'a':
            if (direction2.x === 0) setDirection2({ x: -1, y: 0 });
            break;
          case 'd':
            if (direction2.x === 0) setDirection2({ x: 1, y: 0 });
            break;
        }
      }
    },
    [isGameActive, direction, twoPlayer, direction2, player1Alive, player2Alive]
  );

  const moveSnake = useCallback(() => {
  if (!isGameActive || gameOver) return;

  const newSnake1 = [...snake];
  const newSnake2 = [...snake2];
  let eaten = false;
  let player1Crashed = false;
  let player2Crashed = false;

  // Move player 1 if alive and has direction
  if (player1Alive && (direction.x !== 0 || direction.y !== 0)) {
    const head1 = { x: newSnake1[0].x + direction.x, y: newSnake1[0].y + direction.y };
    
    // Check wall collision for player 1
    if (
      head1.x < 0 ||
      head1.x >= GRID_SIZE ||
      head1.y < 0 ||
      head1.y >= GRID_SIZE
    ) {
      player1Crashed = true;
    }
    
    // Check self-collision for player 1
    if (!player1Crashed) {
      for (const segment of newSnake1) {
        if (head1.x === segment.x && head1.y === segment.y) {
          player1Crashed = true;
          break;
        }
      }
    }
    
    // Check collision with player 2 if player 2 is alive
    if (!player1Crashed && twoPlayer && player2Alive) {
      for (const segment of newSnake2) {
        if (head1.x === segment.x && head1.y === segment.y) {
          player1Crashed = true;
          break;
        }
      }
    }
    
    if (!player1Crashed) {
      newSnake1.unshift(head1);
      if (head1.x === food.x && head1.y === food.y) {
        eaten = true;
        setPlayer1Score(prev => prev + 1);
      } else {
        newSnake1.pop();
      }
    }
  }

  // Move player 2 if alive and has direction
  if (twoPlayer && player2Alive && newSnake2.length > 0 && (direction2.x !== 0 || direction2.y !== 0)) {
    const head2 = { x: newSnake2[0].x + direction2.x, y: newSnake2[0].y + direction2.y };
    
    // Check wall collision for player 2
    if (
      head2.x < 0 ||
      head2.x >= GRID_SIZE ||
      head2.y < 0 ||
      head2.y >= GRID_SIZE
    ) {
      player2Crashed = true;
    }
    
    // Check self-collision for player 2
    if (!player2Crashed) {
      for (const segment of newSnake2) {
        if (head2.x === segment.x && head2.y === segment.y) {
          player2Crashed = true;
          break;
        }
      }
    }
    
    // Check collision with player 1 if player 1 is alive
    if (!player2Crashed && player1Alive) {
      for (const segment of newSnake1) {
        if (head2.x === segment.x && head2.y === segment.y) {
          player2Crashed = true;
          break;
        }
      }
    }
    
    if (!player2Crashed) {
      newSnake2.unshift(head2);
      if (!eaten && head2.x === food.x && head2.y === food.y) {
        eaten = true;
        setPlayer2Score(prev => prev + 1);
      } else {
        newSnake2.pop();
      }
    }
  }

  // Handle player eliminations
  if (player1Crashed && player1Alive) {
    setPlayer1Alive(false);
    setGameStatus('Player 1 Eliminated!');
    setTimeout(() => setGameStatus(''), 2000);
  }
  
  if (player2Crashed && player2Alive) {
    setPlayer2Alive(false);
    setGameStatus('Player 2 Eliminated!');
    setTimeout(() => setGameStatus(''), 2000);
  }

  // Update snake positions
  if (player1Alive && !player1Crashed) {
    setSnake(newSnake1);
  }
  if (twoPlayer && player2Alive && !player2Crashed) {
    setSnake2(newSnake2);
  }

  // Generate new food if eaten
  if (eaten) {
    setFood(getSafeFood(newSnake1, newSnake2));
  }

  // Check if game should end (all players eliminated)
  const remainingPlayers = (player1Alive && !player1Crashed ? 1 : 0) + 
                          (twoPlayer && player2Alive && !player2Crashed ? 1 : 0);
  
  if (remainingPlayers === 0) {
    setGameOver(true);
    setIsGameActive(false);
    
    if (twoPlayer) {
      if (player1Score > player2Score) {
        setGameStatus('Player 1 Wins!');
      } else if (player2Score > player1Score) {
        setGameStatus('Player 2 Wins!');
      } else {
        setGameStatus('Tie Game!');
      }
    } else {
      setGameStatus(`Game Over! Final Score: ${player1Score}`);
    }
  } else if (twoPlayer && remainingPlayers === 1) {
    // One player remaining in two-player mode
    if (player1Alive && !player1Crashed && (!player2Alive || player2Crashed)) {
      setGameStatus('Player 1 is the last survivor!');
    } else if (player2Alive && !player2Crashed && (!player1Alive || player1Crashed)) {
      setGameStatus('Player 2 is the last survivor!');
    }
    setTimeout(() => setGameStatus(''), 3000);
  }
}, [snake, snake2, direction, direction2, food, gameOver, isGameActive, twoPlayer, player1Alive, player2Alive, player1Score, player2Score]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isGameActive) return;
    const gameInterval = setInterval(moveSnake, 200);
    return () => clearInterval(gameInterval);
  }, [moveSnake, isGameActive]);

  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  if (isGameActive) {
    // Only render player 1 if alive
    if (player1Alive) {
      snake.forEach((segment) => {
        if (
          segment.y >= 0 &&
          segment.y < GRID_SIZE &&
          segment.x >= 0 &&
          segment.x < GRID_SIZE
        ) {
          grid[segment.y][segment.x] = 1;
        }
      });
    }
    // Only render player 2 if alive
    if (twoPlayer && player2Alive) {
      snake2.forEach((segment) => {
        if (
          segment.y >= 0 &&
          segment.y < GRID_SIZE &&
          segment.x >= 0 &&
          segment.x < GRID_SIZE
        ) {
          grid[segment.y][segment.x] = 3;
        }
      });
    }
    if (food.y >= 0 && food.y < GRID_SIZE && food.x >= 0 && food.x < GRID_SIZE) {
      grid[food.y][food.x] = 2;
    }
  }

  return (
    <GameContainer>
      <h1>Snake Game</h1>
      {!isGameActive && !gameOver && (
        <>
          <GameButton onClick={() => setTwoPlayer(!twoPlayer)}>
            {twoPlayer ? 'Single Player' : 'Two Player'}
          </GameButton>
          {twoPlayer && (
            <p style={{ marginBottom: '10px', textAlign: 'center', fontSize: '14px' }}>
              Player 1: Arrow Keys | Player 2: WASD
            </p>
          )}
          <GameButton onClick={startGame}>Start Game</GameButton>
        </>
      )}
      {(isGameActive || gameOver) && (
        <Scoreboard
          player1Score={player1Score}
          player2Score={player2Score}
          player1Alive={player1Alive}
          player2Alive={player2Alive}
          twoPlayer={twoPlayer}
          gameActive={isGameActive}
          gameStatus={gameStatus}
        />
      )}
      {gameOver && <h2>Game Over</h2>}
      {gameOver && <GameButton onClick={startGame}>Play Again</GameButton>}
      <Board grid={grid} />
    </GameContainer>
  );
};

export default Game;
