import React from 'react';
import styled from 'styled-components';

const directionToRotation = ({direction}) => {
  switch(direction) {
    case 'up':
      return 'rotate(90deg)';
    case 'down':
      return 'rotate(270deg)';
    case 'right':
      return 'rotate(180deg)';
    case 'left':
    default:
      return 'rotate(0deg)';
  }
}

const Arrow = styled.div`
  border: ${({ size = 5 }) => `${size}px solid transparent`};
  border-right: 5px solid black;
  width: 0;
  height: 0;
  transform: ${directionToRotation};
  -webkit-transform: ${directionToRotation};
`;

export default ({ direction, size }) => (<Arrow direction={direction} size={size} />);
