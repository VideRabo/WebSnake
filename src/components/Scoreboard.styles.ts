import styled from 'styled-components';

export const ScoreboardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const PlayerScore = styled.div<{ $isAlive: boolean; $isWinner?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ $isAlive }) => ($isAlive ? 1 : 0.5)};
  transform: ${({ $isWinner }) => ($isWinner ? 'scale(1.1)' : 'scale(1)')};
  transition: all 0.3s ease;
`;

export const PlayerName = styled.h3<{ $playerColor: string; $isAlive: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $playerColor, $isAlive }) => ($isAlive ? $playerColor : '#888')};
  text-decoration: ${({ $isAlive }) => ($isAlive ? 'none' : 'line-through')};
`;

export const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-top: 4px;
`;

export const PlayerStatus = styled.div<{ $isAlive: boolean }>`
  font-size: 12px;
  color: ${({ $isAlive }) => ($isAlive ? '#4ade80' : '#ef4444')};
  margin-top: 2px;
  font-weight: 500;
`;

export const GameStatus = styled.div`
  text-align: center;
  margin: 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #fbbf24;
`;