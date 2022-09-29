import React, { Component, createRef } from 'react';
import {
  GridWrapper,
  ContentContainer,
  PreRenderWrapper,
  ItemWrapper,
} from '../styles/VirtualGridStyles';
import { Direction, virtualGridDefaultProps, virtualGridProps } from '../types';
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
    renderDatas: [],
    defaultItemData: {},
    maxCols: 0,
    maxRows: 0,
    scrollTop: 0,
    scrollLeft: 0,
    rowOrder: [],
    colOrder: [],
    lastTopIndex: null,
    lastBottomIndex: null,
    lastRightIndex: null,
    lastLeftIndex: null,
  };

  componentDidMount() {
    this.initProps();
    this.initEvents();
  }

  componentWillUnmount() {
    this.wrapperRef.current.removeEventListener('scroll', this.onScroll);
  }

  componentDidUpdate(_, prevState) {
    const { isInited, renderDatas } = this.state;
    if (prevState.isInited !== isInited && isInited) {
      this.initWrapperProps();
      this.updateRenderDatas();
    }
  }

  initEvents = () => {
    this.wrapperRef.current.addEventListener('scroll', this.onScroll);
  };

  onScroll = event => {
    event.preventDefault();
    const { scrollLeft, scrollTop } = this.state;
    const newScrollLeft =
      event.target.scrollLeft > 0 ? event.target.scrollLeft : 0;
    const newScrollTop =
      event.target.scrollTop > 0 ? event.target.scrollTop : 0;
    if (scrollTop !== newScrollTop) {
      this.handleScroll(newScrollTop > scrollTop ? 'down' : 'up');
      this.state.scrollTop = newScrollTop;
    } else if (scrollLeft !== newScrollLeft) {
      this.handleScroll(newScrollLeft > scrollLeft ? 'right' : 'left');
      this.state.scrollLeft = newScrollLeft;
    }
  };

  handleScroll = dir => {
    const { data, direction, directionLimitCeils } = this.props;
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
      lastTopIndex,
      lastBottomIndex,
      lastRightIndex,
      lastLeftIndex,
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
      let topIndex = Math.floor(y0 / itemHeight);
      topIndex < 0 && (topIndex = 0);
      if (
        lastTopIndex === topIndex ||
        renderRows === maxRows ||
        topIndex + renderRows - 1 >= maxRows
      ) {
        return;
      }
      this.state.lastTopIndex = topIndex;
      const targetRowOrderIndex = topIndex % renderRows;
      let newRowOrder = rowOrder;
      topIndex > 0 &&
        (newRowOrder = this.rotateOrderLeft(targetRowOrderIndex, rowOrder));
      for (let r = 0; r < renderRows; r++) {
        let rowIndex = topIndex + r;
        if (topIndex > 0) {
          rowIndex -= 1;
        }
        const renderRow = newRowOrder[r];
        for (let i = 0; i < renderCols; i++) {
          const render = renderDatas[renderRow * renderCols + i];
          const dataIndex =
            direction === Direction.VERTICAL
              ? render.col * directionLimitCeils + rowIndex
              : rowIndex * directionLimitCeils + render.col;
          const newRender = {
            ...render,
            row: rowIndex,
            top: rowIndex * itemHeight,
            data: data[dataIndex],
          };
          renderDatas[renderRow * renderCols + i] = newRender;
        }
      }
      this.state.rowOrder = newRowOrder;
      this.forceUpdate();
    } else if (dir === 'down') {
      let bottomIndex = Math.floor(y1 / itemHeight);
      bottomIndex >= maxRows && (bottomIndex = maxRows - 1);
      if (
        bottomIndex === lastBottomIndex ||
        renderRows === maxRows ||
        bottomIndex - renderRows + 1 <= 0
      ) {
        return;
      }
      this.state.lastBottomIndex = bottomIndex;
      const targetRowOrderIndex = bottomIndex % renderRows; // 这里是当前滚动位置对应的render row
      let newRowOrder = rowOrder;
      bottomIndex < maxRows - 1 &&
        (newRowOrder = this.rotateOrderRight(targetRowOrderIndex, rowOrder));
      for (let r = 0; r < renderRows; r++) {
        let rowIndex;
        if (bottomIndex < maxRows - 1) {
          rowIndex = bottomIndex - r + 1;
        } else {
          rowIndex = bottomIndex - r;
        }
        const renderRow = newRowOrder[renderRows - r - 1];
        for (let i = 0; i < renderCols; i++) {
          const render = renderDatas[renderRow * renderCols + i];
          const dataIndex =
            direction === Direction.VERTICAL
              ? render.col * directionLimitCeils + rowIndex
              : rowIndex * directionLimitCeils + render.col;
          const newRender = {
            ...render,
            row: rowIndex,
            top: rowIndex * itemHeight,
            data: data[dataIndex],
          };
          renderDatas[renderRow * renderCols + i] = newRender;
        }
      }
      this.state.rowOrder = newRowOrder;
      this.forceUpdate();
    } else if (dir === 'left') {
      let leftIndex = Math.floor(x0 / itemWidth);
      leftIndex < 0 && (leftIndex = 0);
      if (
        leftIndex === lastLeftIndex ||
        renderCols === maxCols ||
        leftIndex + renderCols - 1 >= maxCols
      ) {
        return;
      }
      this.state.lastLeftIndex = leftIndex;
      const targetColOrderIndex = leftIndex % renderCols;
      let newColOrder = colOrder;
      leftIndex > 0 &&
        (newColOrder = this.rotateOrderLeft(targetColOrderIndex, colOrder));
      this.state.colOrder = newColOrder;
      for (let c = 0; c < renderCols; c++) {
        let colIndex = leftIndex + c;
        if (leftIndex > 0) {
          colIndex -= 1;
        }
        const renderCol = newColOrder[c];
        for (let i = 0; i < renderRows; i++) {
          const render = renderDatas[i * renderCols + renderCol];
          const dataIndex =
            direction === Direction.VERTICAL
              ? colIndex * directionLimitCeils + render.row
              : render.row * directionLimitCeils + colIndex;
          const newRender = {
            ...render,
            col: colIndex,
            left: colIndex * itemWidth,
            data: data[dataIndex],
          };
          renderDatas[i * renderCols + renderCol] = newRender;
        }
      }
      this.forceUpdate();
    } else if (dir === 'right') {
      let rightIndex = Math.floor(x1 / itemWidth);
      rightIndex >= maxCols && (rightIndex = maxCols - 1);
      if (
        rightIndex === lastRightIndex ||
        renderCols === maxCols ||
        rightIndex - renderCols + 1 <= 0
      ) {
        return;
      }
      this.state.lastRightIndex = rightIndex;
      const targetColOrderIndex = rightIndex % renderCols;
      let newColOrder = colOrder;
      rightIndex < maxRows - 1 &&
        (newColOrder = this.rotateOrderRight(targetColOrderIndex, colOrder));
      this.state.colOrder = newColOrder;
      for (let c = 0; c < renderCols; c++) {
        let colIndex = rightIndex - c;
        if (rightIndex < maxCols - 1) {
          colIndex += 1;
        }
        const renderCol = newColOrder[c];
        for (let i = 0; i < renderRows; i++) {
          const render = renderDatas[i * renderCols + renderCol];
          const dataIndex =
            direction === Direction.VERTICAL
              ? colIndex * directionLimitCeils + render.row
              : render.row * directionLimitCeils + colIndex;
          const newRender = {
            ...render,
            col: colIndex,
            left: colIndex * itemWidth,
            data: data[dataIndex],
          };
          renderDatas[i * renderCols + renderCol] = newRender;
        }
      }
      this.forceUpdate();
    }
  };

  rotateOrderLeft = (targetIndex, orderArr) => {
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

  rotateOrderRight = (targetIndex, orderArr) => {
    const newOrder = orderArr.slice();
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
    const { direction, directionLimitCeils, data } = this.props;
    const { defaultItemData, contentProps } = this.state;
    const dataLen = data.length;
    const maxLines = Math.ceil(dataLen / directionLimitCeils);
    if (direction === Direction.VERTICAL) {
      contentProps.width = defaultItemData.width * maxLines;
      contentProps.height = defaultItemData.height * directionLimitCeils;
      this.state.maxCols = maxLines;
      this.state.maxRows = directionLimitCeils;
    } else {
      contentProps.width = defaultItemData.width * directionLimitCeils;
      contentProps.height = maxLines * defaultItemData.height;
      this.state.maxCols = directionLimitCeils;
      this.state.maxRows = maxLines;
    }
  };

  initDefaultItemData() {
    const { clientWidth, clientHeight } = this.preRenderRef.current;
    const { defaultItemData } = this.state;
    defaultItemData.width = clientWidth;
    defaultItemData.height = clientHeight;
  }

  updateRenderDatas = () => {
    const { data, direction, directionLimitCeils } = this.props;
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
        const colIndex = i % renderCols;
        const rowIndex = Math.floor(i / renderCols);
        let dataIndex;
        if (direction === Direction.VERTICAL) {
          dataIndex = colIndex * directionLimitCeils + rowIndex;
        } else {
          dataIndex = rowIndex * directionLimitCeils + colIndex;
        }
        return {
          top: rowIndex * itemHeight,
          left: colIndex * itemWidth,
          row: rowIndex,
          col: colIndex,
          data: data[dataIndex],
        };
      });
    updateReactState(this, renderDatas, 'renderDatas');
  };

  render() {
    const {
      itemRenderer,
      width,
      height,
      data,
      unit,
      tabIndex,
      className,
      style,
    } = this.props;
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
        style={{ ...style }}
      >
        {!isInited && (
          <PreRenderWrapper ref={this.preRenderRef}>
            {itemRenderer(preRenderData)}
          </PreRenderWrapper>
        )}
        <ContentContainer ref={this.contentRef} unit={unit} {...contentProps}>
          {renderDatas.map(render =>
            render.data ? (
              <ItemWrapper
                style={{ top: render.top, left: render.left }}
                unit={unit}
                key={`virtual-grid-item-${render.data.key}`}
                tabIndex="-1"
              >
                {itemRenderer(render.data)}
              </ItemWrapper>
            ) : null,
          )}
        </ContentContainer>
      </GridWrapper>
    );
  }
}
