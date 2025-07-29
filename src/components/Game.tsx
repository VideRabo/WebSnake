import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import { GameContainer, GameButton } from './Game.styles';

const GRID_SIZE = 20;

const getRandomCoordinate = () => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
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

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    if (twoPlayer) {
      setSnake2([{ x: 10, y: 11 }]);
      setDirection2({ x: 0, y: 1 });
    } else {
      setSnake2([]);
      setDirection2({ x: 0, y: 0 });
    }
    setFood(getRandomCoordinate());
    setDirection({ x: 0, y: -1 });
    setGameOver(false);
    setIsGameActive(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isGameActive) return;
      // Player 1 controls (arrow keys)
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
      // Player 2 controls (WASD)
      if (twoPlayer) {
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
    [isGameActive, direction, twoPlayer, direction2]
  );

  const moveSnake = useCallback(() => {
  if (!isGameActive || gameOver) return;

  const newSnake1 = [...snake];
  const newSnake2 = [...snake2];
  let eaten = false;

  // Move player 1
  const head1 = { x: newSnake1[0].x + direction.x, y: newSnake1[0].y + direction.y };
  if (
    head1.x < 0 ||
    head1.x >= GRID_SIZE ||
    head1.y < 0 ||
    head1.y >= GRID_SIZE
  ) {
    setGameOver(true);
    setIsGameActive(false);
    return;
  }
  // Self-collision player 1
  for (const segment of newSnake1) {
    if (head1.x === segment.x && head1.y === segment.y) {
      setGameOver(true);
      setIsGameActive(false);
      return;
    }
  }
  // Collision with player 2
  if (twoPlayer) {
    for (const segment of newSnake2) {
      if (head1.x === segment.x && head1.y === segment.y) {
        setGameOver(true);
        setIsGameActive(false);
        return;
      }
    }
  }
  newSnake1.unshift(head1);
  if (head1.x === food.x && head1.y === food.y) {
    eaten = true;
  } else {
    newSnake1.pop();
  }

  // Move player 2
  if (twoPlayer && newSnake2.length > 0) {
    const head2 = { x: newSnake2[0].x + direction2.x, y: newSnake2[0].y + direction2.y };
    if (
      head2.x < 0 ||
      head2.x >= GRID_SIZE ||
      head2.y < 0 ||
      head2.y >= GRID_SIZE
    ) {
      setGameOver(true);
      setIsGameActive(false);
      return;
    }
    // Self-collision player 2
    for (const segment of newSnake2) {
      if (head2.x === segment.x && head2.y === segment.y) {
        setGameOver(true);
        setIsGameActive(false);
        return;
      }
    }
    // Collision with player 1
    for (const segment of newSnake1) {
      if (head2.x === segment.x && head2.y === segment.y) {
        setGameOver(true);
        setIsGameActive(false);
        return;
      }
    }
    newSnake2.unshift(head2);
    if (!eaten && head2.x === food.x && head2.y === food.y) {
      eaten = true;
    } else {
      newSnake2.pop();
    }
  }

  setSnake(newSnake1);
  if (twoPlayer) {
    setSnake2(newSnake2);
  }
  if (eaten) {
    setFood(getRandomCoordinate());
  }
}, [snake, snake2, direction, direction2, food, gameOver, isGameActive, twoPlayer]);

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
    if (twoPlayer) {
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
      {gameOver && <h2>Game Over</h2>}
      {gameOver && <GameButton onClick={startGame}>Play Again</GameButton>}
      <Board grid={grid} />
    </GameContainer>
  );
};

export default Game;
