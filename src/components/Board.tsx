import React from 'react';
import { BoardContainer, Cell } from './Board.styles';

interface BoardProps {
  grid: number[][];
}

const Board: React.FC<BoardProps> = ({ grid }) => {
  return (
    <BoardContainer>
      {grid.flat().map((cell, index) => (
        <Cell key={index} type={cell} />
      ))}
    </BoardContainer>
  );
};

export default Board;
