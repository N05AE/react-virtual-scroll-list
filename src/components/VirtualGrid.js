import React, { Component, createRef } from 'react';
import {
  GridWrapper,
  ContentContainer,
  PreRenderWrapper,
  ItemWrapper,
} from '../styles/VirtualGridStyles';
import {
  GridDirection,
  virtualGridDefaultProps,
  virtualGridProps,
} from '../types';
import { updateReactState } from '../utils/ReactUtils';

export class VirtualGrid extends Component {
  static propTypes = virtualGridProps;
  static defaultProps = virtualGridDefaultProps;

  constructor() {
    super();
    this.wrapperRef = createRef();
    this.contentRef = createRef();
    this.preRenderRef = createRef();
  }

  state = {
    isInited: false,
    wrapperProps: {},
    contentProps: {},
    dataProps: {},
    renderDatas: [],
    defaultItemData: {},
    maxCols: 0,
    maxRows: 0,
    scrollTop: 0,
    scrollLeft: 0,
    rowOrder: [],
    colOrder: [],
  };

  componentDidMount() {
    this.initProps();
    this.initEvents();
    console.log(this.state);
  }

  getSnapshotBeforeUpdate(prevProps) {
    return null;
  }

  componentDidUpdate(_, prevState) {
    const { isInited, renderDatas } = this.state;
    if (prevState.isInited !== isInited && isInited) {
      this.initWrapperProps();
      this.updateRenderDatas();
    }
    if (prevState.renderDatas !== renderDatas) {
      this.updateDataProps();
    }
    // console.log(this.state);
  }

  initEvents = () => {
    this.wrapperRef.current.addEventListener('scroll', event => {
      const { scrollLeft, scrollTop } = this.state;
      const newScrollLeft = event.target.scrollLeft;
      const newScrollTop = event.target.scrollTop;
      if (scrollTop !== newScrollTop) {
        this.handleScroll(newScrollTop > scrollTop ? 'down' : 'up');
        this.state.scrollTop = newScrollTop;
      } else if (scrollLeft !== newScrollLeft) {
        this.handleScroll(newScrollLeft > scrollLeft ? 'right' : 'left');
        this.state.scrollLeft = newScrollLeft;
      }
    });
  };

  handleScroll = dir => {
    const { data } = this.props;
    const {
      wrapperProps,
      defaultItemData,
      renderDatas,
      rowOrder,
      colOrder,
      renderCols,
      renderRows,
      maxCols,
      maxRows,
    } = this.state;
    const { width, height } = wrapperProps;
    const itemWidth = defaultItemData.width;
    const itemHeight = defaultItemData.height;
    const wrapperRect = this.wrapperRef.current.getBoundingClientRect();
    const contentRect = this.contentRef.current.getBoundingClientRect();
    const x0 = wrapperRect.left - contentRect.left;
    const y0 = wrapperRect.top - contentRect.top;
    const x1 = x0 + width;
    const y1 = y0 + height;
    if (dir === 'up') {
      const hitRowTop = Math.floor(y0 / itemHeight);
      if (hitRowTop === 0 || renderRows === maxRows) {
        return;
      }
      const targetRowOrderIndex = hitRowTop % renderRows; // 这里是当前滚动位置对应的render row
      const newRowOrder = this.rebuildRowOrder(targetRowOrderIndex, rowOrder);
      // const newRow = Math.floor(y0 / itemHeight) - 1;
      // const half = Math.round((y0 % itemHeight) / itemHeight);
      // const firstRow = rowOrder[0];
      // const firstRowData = renderDatas[firstRow * renderCols];
      for (let r = 0; r < renderRows; r++) {
        const row = hitRowTop + r - 1;
        const renderRow = rowOrder[r];
        for (let i = 0; i < renderCols; i++) {
          const render = renderDatas[renderRow * renderCols + i];
          const targetData = data[row * maxCols + render.col];
          if (!targetData) {
            break;
          }
          const newRender = {
            ...render,
            row,
            top: row * itemHeight,
            data: targetData,
          };
          renderDatas[row * renderCols + i] = newRender;
        }
      }
      this.state.rowOrder = newRowOrder;
      this.forceUpdate();
    } else if (dir === 'down') {
      const hitRowBottom = Math.floor(y1 / itemHeight);
      if (hitRowBottom === maxRows - 1 || renderRows === maxRows) {
        return;
      }
      const targetRowOrderIndex = hitRowBottom % renderRows; // 这里是当前滚动位置对应的render row
      const newRowOrder = this.rebuildRowOrder2(targetRowOrderIndex, rowOrder);
      for (let r = 0; r < renderRows; r++) {
        const row = hitRowBottom - r + 1;
        const renderRow = rowOrder[renderRows - r - 1];
        for (let i = 0; i < renderCols; i++) {
          const render = renderDatas[renderRow * renderCols + i];
          const targetData = data[row * maxCols + render.col];
          if (!targetData) {
            break;
          }
          const newRender = {
            ...render,
            row,
            top: row * itemHeight,
            data: targetData,
          };
          renderDatas[row * renderCols + i] = newRender;
        }
      }
      this.state.rowOrder = newRowOrder;

      // const newRow = Math.floor(y1 / itemHeight) + 1;
      // const half = Math.round((y1 % itemHeight) / itemHeight);
      // const lastRow = rowOrder[renderRows - 1];
      // const lastRowData = renderDatas[lastRow * renderCols];
      // if (half === 1 && newRow < maxRows && newRow > lastRowData.row) {
      //   const firstRow = rowOrder.shift();
      //   rowOrder.push(firstRow);
      //   for (let i = 0; i < renderCols; i++) {
      //     const render = renderDatas[firstRow * renderCols + i];
      //     const targetData = data[newRow * maxCols + render.col];
      //     const newRender = {
      //       ...render,
      //       top: newRow * itemHeight,
      //       row: newRow,
      //       data: targetData,
      //     };
      //     renderDatas[firstRow * renderCols + i] = newRender;
      //   }
      // }
      this.forceUpdate();
    } else if (dir === 'left') {
      const newCol = Math.floor(x0 / itemWidth) - 1;

      this.forceUpdate();
    } else if (dir === 'right') {
      const newCol = Math.floor(x1 / itemWidth) + 1;

      this.forceUpdate();
    }
  };

  rebuildRowOrder = (targetIndex, orderArr) => {
    const newOrder = orderArr.slice();
    if (targetIndex > 1) {
      for (let i = 0; i < targetIndex; i++) {
        const firstElm = newOrder.shift();
        newOrder.push(firstElm);
      }
    } else if (targetIndex === 0) {
      const lastElm = newOrder.pop();
      newOrder.unshift(lastElm);
    }
    return newOrder;
  };

  rebuildRowOrder2 = (targetIndex, orderArr) => {
    const newOrder = orderArr.slice();
    345612;
    if (targetIndex < newOrder.length - 2) {
      for (let i = newOrder.length - 1; i > targetIndex + 1; i--) {
        const lastElm = newOrder.pop();
        newOrder.unshift(lastElm);
      }
    } else if (targetIndex === newOrder.length - 1) {
      const firstElm = newOrder.shift();
      newOrder.push(firstElm);
    }
    return newOrder;
  };

  initProps = () => {
    this.initDefaultItemData();
    this.initContentProps();
    updateReactState(this, true, 'isInited');
  };

  initWrapperProps = () => {
    const { clientWidth, clientHeight } = this.wrapperRef.current;
    const { wrapperProps } = this.state;
    wrapperProps.width = clientWidth;
    wrapperProps.height = clientHeight;
  };

  initContentProps = () => {
    const { direction, limitCountOnDirection, data } = this.props;
    const { defaultItemData, contentProps } = this.state;
    const dataLen = data.length;
    const lineNum = Math.floor(dataLen / limitCountOnDirection);
    const lineCount =
      dataLen % limitCountOnDirection > 0 ? lineNum + 1 : lineNum;
    if (direction === GridDirection.HORIZONTAL) {
      contentProps.width = defaultItemData.width * limitCountOnDirection;
      contentProps.height = lineCount * defaultItemData.height;
      this.state.maxCols = limitCountOnDirection;
      this.state.maxRows = Math.ceil(dataLen / limitCountOnDirection);
    } else {
      contentProps.width = lineCount * defaultItemData.width;
      contentProps.height = defaultItemData.height * limitCountOnDirection;
      this.state.maxCols = Math.ceil(dataLen / limitCountOnDirection);
      this.state.maxRows = limitCountOnDirection;
    }
  };

  initDefaultItemData() {
    const { clientWidth, clientHeight } = this.preRenderRef.current;
    const { defaultItemData } = this.state;
    defaultItemData.width = clientWidth;
    defaultItemData.height = clientHeight;
  }

  updateRenderDatas = () => {
    const { data, direction, limitCountOnDirection } = this.props;
    const { wrapperProps, defaultItemData, maxCols, maxRows } = this.state;
    const wrapperWidth = wrapperProps.width;
    const wrapperHeight = wrapperProps.height;
    const itemWidth = defaultItemData.width;
    const itemHeight = defaultItemData.height;
    const showCols = Math.ceil(wrapperWidth / itemWidth);
    const showRows = Math.ceil(wrapperHeight / itemHeight);
    const renderCols = Math.min(showCols + 2, maxCols);
    const renderRows = Math.min(showRows + 2, maxRows);
    const renderNum = renderCols * renderRows;
    this.state.showCols = showCols;
    this.state.showRows = showRows;
    this.state.renderCols = renderCols;
    this.state.renderRows = renderRows;
    this.state.rowOrder = Array(renderRows)
      .fill(0)
      .map((_, i) => i);
    this.state.colOrder = Array(renderCols)
      .fill(0)
      .map((_, i) => i);
    const renderDatas = Array(renderNum)
      .fill(null)
      .map((_, i) => {
        const ref = createRef();
        if (direction === GridDirection.HORIZONTAL) {
          const rowIndex = Math.floor(i / renderCols);
          const colIndex = i % renderCols;
          const top = rowIndex * itemHeight;
          const left = colIndex * itemWidth;
          const targetData = data[rowIndex * limitCountOnDirection + colIndex];
          return {
            top,
            left,
            row: rowIndex,
            col: colIndex,
            data: targetData,
            ref,
          };
        } else {
          const colIndex = Math.floor(i / renderRows);
          const rowIndex = i % renderRows;
          const top = rowIndex * itemHeight;
          const left = colIndex * itemWidth;
          const targetData = data[colIndex * limitCountOnDirection + rowIndex];
          return {
            top,
            left,
            row: rowIndex,
            col: colIndex,
            data: targetData,
            ref,
          };
        }
      });
    updateReactState(this, renderDatas, 'renderDatas');
  };

  updateDataProps = () => {
    const { renderDatas, dataProps } = this.state;
    renderDatas.forEach(renderData => {
      const { data, ref } = renderData;
      const { offsetWidth, offsetHeight } = ref.current;
      const dataProp = dataProps[data.key];
      dataProps[data.key] = {
        ...dataProp,
        width: offsetWidth,
        height: offsetHeight,
      };
    });
  };

  render() {
    const { itemRenderer, width, height, data, unit, tabIndex, className } =
      this.props;
    const { isInited, contentProps, renderDatas } = this.state;
    const preRenderData = data[0];
    return (
      <GridWrapper
        ref={this.wrapperRef}
        width={width}
        height={height}
        unit={unit}
        tabIndex={tabIndex}
        className={className}
      >
        {!isInited && (
          <PreRenderWrapper ref={this.preRenderRef}>
            {itemRenderer(preRenderData)}
          </PreRenderWrapper>
        )}
        <ContentContainer ref={this.contentRef} unit={unit} {...contentProps}>
          {renderDatas.map(render => (
            <ItemWrapper
              style={{ top: render.top, left: render.left }}
              unit={unit}
              key={`virtual-grid-item-${render.data.key}`}
              ref={render.ref}
            >
              {itemRenderer(render.data)}
            </ItemWrapper>
          ))}
        </ContentContainer>
      </GridWrapper>
    );
  }
}
