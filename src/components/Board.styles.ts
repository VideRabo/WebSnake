import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  border: 1px solid #fff;
`;

export const Row = styled.div`
  display: flex;
`;

export const Cell = styled.div<{ type: number }>`
  width: 20px;
  height: 20px;
  background-color: ${({ type }) =>
    type === 1
      ? '#32cd32'
      : type === 2
      ? '#ff0000'
      : type === 3
      ? '#1e90ff'
      : '#f5f5f5'};
  border: 1px solid #ddd;
`;
