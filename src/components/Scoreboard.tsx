import React from 'react';
import {
  ScoreboardContainer,
  PlayerScore,
  PlayerName,
  Score,
  PlayerStatus,
  GameStatus,
} from './Scoreboard.styles';

interface ScoreboardProps {
  player1Score: number;
  player2Score: number;
  player1Alive: boolean;
  player2Alive: boolean;
  twoPlayer: boolean;
  gameActive: boolean;
  gameStatus?: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  player1Score,
  player2Score,
  player1Alive,
  player2Alive,
  twoPlayer,
  gameActive,
  gameStatus,
}) => {
  const getWinner = () => {
    if (!gameActive && twoPlayer) {
      if (player1Alive && !player2Alive) return 1;
      if (!player1Alive && player2Alive) return 2;
      if (!player1Alive && !player2Alive) {
        if (player1Score > player2Score) return 1;
        if (player2Score > player1Score) return 2;
        return 0; // tie
      }
    }
    return null;
  };

  const winner = getWinner();

  return (
    <>
      <ScoreboardContainer>
        <PlayerScore $isAlive={player1Alive} $isWinner={winner === 1}>
          <PlayerName $playerColor="#32cd32" $isAlive={player1Alive}>
            Player 1
          </PlayerName>
          <Score>{player1Score}</Score>
          <PlayerStatus $isAlive={player1Alive}>
            {player1Alive ? 'ALIVE' : 'ELIMINATED'}
          </PlayerStatus>
        </PlayerScore>

        {twoPlayer && (
          <PlayerScore $isAlive={player2Alive} $isWinner={winner === 2}>
            <PlayerName $playerColor="#1e90ff" $isAlive={player2Alive}>
              Player 2
            </PlayerName>
            <Score>{player2Score}</Score>
            <PlayerStatus $isAlive={player2Alive}>
              {player2Alive ? 'ALIVE' : 'ELIMINATED'}
            </PlayerStatus>
          </PlayerScore>
        )}
      </ScoreboardContainer>

      {gameStatus && <GameStatus>{gameStatus}</GameStatus>}
    </>
  );
};

export default Scoreboard;