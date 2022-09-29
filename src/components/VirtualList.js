import { Component } from 'react';
import { Direction, virtualListDefaultProps, virtualListProps } from '../types';
import { VirtualGrid } from './VirtualGrid';

export class VirtualList extends Component {
  static propTypes = virtualListProps;
  static defaultProps = virtualListDefaultProps;

  render() {
    const { direction, width, height } = this.props;
    const widthProp = !direction && !width ? 'auto' : width;
    const heightProp = direction && !height ? 'auto' : height;
    return (
      <VirtualGrid
        {...this.props}
        direction={direction ? Direction.VERTICAL : Direction.HORIZONTAL}
        directionLimitCeils={1}
        width={widthProp}
        height={heightProp}
      />
    );
  }
}
