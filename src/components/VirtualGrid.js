import React, { Component } from 'react';
import { GridWrapper, ItemContainer } from '../styles/VirtualGridStyles';
import { virtualGridDefaultProps, virtualGridProps } from '../types';

export class VirtualGrid extends Component {
  static propTypes = virtualGridProps;
  static propTypes = virtualGridDefaultProps;

  render() {
    const { itemRenderer, col, row, width, height } = this.props;
    return (
      <GridWrapper width={width} height={height}>
        <ItemContainer></ItemContainer>
      </GridWrapper>
    );
  }
}
