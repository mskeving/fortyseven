import styled from 'styled-components';

/**
 * Row, with items spaced apart determined by the `spacing` prop
 */
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ align }) => align || 'stretch'};
  ${({ spacing }) =>
    !spacing
      ? null
      : `
	> div {
      margin-right: ${spacing}px;
    }
    > div:last-child {
      margin-right: 0;
    }
  `}
`;

/**
 * Column, with items spaced apart determined by the `spacing` prop
 */
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ align }) => align || 'stretch'};
  ${({ spacing }) =>
    !spacing
      ? null
      : `
	> div {
      margin-bottom: ${spacing}px;
    }
    > div:last-child {
      margin-bottom: 0;
    }
  `}
`;

/**
 * Row/Column element, with a size basis determined by the `basis` prop
 */
export const Cell = styled.div`
  flex: ${({ basis = 1 }) => basis};
`;
