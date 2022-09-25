import styled from 'styled-components';

export const GridWrapper = styled.div`
  width: ${props =>
    isNaN(props.width) ? props.width : props.width + props.unit};
  height: ${props =>
    isNaN(props.height) ? props.height : props.height + props.unit};
  overflow: auto;
`;

export const ContentContainer = styled.div`
  width: ${props =>
    isNaN(props.width) ? props.width : props.width + props.unit};
  height: ${props =>
    isNaN(props.height) ? props.height : props.height + props.unit};
  display: inline-block;
  position: relative;
`;

export const ItemWrapper = styled.div`
  display: inline-block;
  position: absolute;
  z-index: auto;
  top: ${props => (props.top ? props.top + props.unit : 0)};
  left: ${props => (props.left ? props.left + props.unit : 0)};
`;

export const PreRenderWrapper = styled.div`
  opacity: 0;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
`;
