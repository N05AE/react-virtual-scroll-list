import styled from 'styled-components';

export const GridWrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  overflow: scroll;
  border: 1;
`;

export const ItemContainer = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
`;
