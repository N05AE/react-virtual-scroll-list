import React, { Component, createRef } from 'react';
import {
  GridWrapper,
  ContentContainer,
  PreRenderWrapper,
  ItemWrapper,
} from '../styles/VirtualGridStyles';
import { virtualGridDefaultProps, virtualGridProps } from '../types';
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
    lastHitRowTop: null,
    lastHitRowBottom: null,
    lastHitColRight: null,
    lastHitColLeft: null,
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
    if (prevState.renderDatas !== renderDatas) {
      this.updateDataProps();
    }
  }

  initEvents = () => {
    this.wrapperRef.current.addEventListener('scroll', this.onScroll);
  };

  onScroll = event => {
    event.preventDefault();
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
      lastHitRowTop,
      lastHitRowBottom,
      lastHitColRight,
      lastHitColLeft,
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
      let hitRowTopIndex = Math.floor(y0 / itemHeight);
      if (hitRowTopIndex < 0) {
        hitRowTopIndex = 0;
      }
      if (
        lastHitRowTop === hitRowTopIndex ||
        renderRows === maxRows ||
        hitRowTopIndex + renderRows - 1 >= maxRows
      ) {
        return;
      }
      this.state.lastHitRowTop = hitRowTopIndex;
      const targetRowOrderIndex = hitRowTopIndex % renderRows;
      let newRowOrder = rowOrder;
      if (hitRowTopIndex > 0) {
        newRowOrder = this.rotateOrderLeft(targetRowOrderIndex, rowOrder);
      }
      for (let r = 0; r < renderRows; r++) {
        let rowIndex = hitRowTopIndex + r;
        if (hitRowTopIndex > 0) {
          rowIndex -= 1;
        }
        const renderRow = newRowOrder[r];
        for (let i = 0; i < renderCols; i++) {
          const render = renderDatas[renderRow * renderCols + i];
          const targetData = data[rowIndex * maxCols + render.col];
          if (!targetData) {
            break;
          }
          const newRender = {
            ...render,
            row: rowIndex,
            top: rowIndex * itemHeight,
            data: targetData,
          };
          renderDatas[renderRow * renderCols + i] = newRender;
        }
      }
      this.state.rowOrder = newRowOrder;
      this.forceUpdate();
    } else if (dir === 'down') {
      let hitRowBottomIndex = Math.floor(y1 / itemHeight);
      if (hitRowBottomIndex >= maxRows) {
        hitRowBottomIndex = maxRows - 1;
      }
      if (
        hitRowBottomIndex === lastHitRowBottom ||
        renderRows === maxRows ||
        hitRowBottomIndex - renderRows + 1 <= 0
      ) {
        return;
      }
      this.state.lastHitRowBottom = hitRowBottomIndex;
      const targetRowOrderIndex = hitRowBottomIndex % renderRows; // 这里是当前滚动位置对应的render row
      let newRowOrder = rowOrder;
      if (hitRowBottomIndex < maxRows - 1) {
        newRowOrder = this.rotateOrderRight(targetRowOrderIndex, rowOrder);
      }
      for (let r = 0; r < renderRows; r++) {
        let rowIndex;
        if (hitRowBottomIndex < maxRows - 1) {
          rowIndex = hitRowBottomIndex - r + 1;
        } else {
          rowIndex = hitRowBottomIndex - r;
        }
        const renderRow = newRowOrder[renderRows - r - 1];
        for (let i = 0; i < renderCols; i++) {
          const render = renderDatas[renderRow * renderCols + i];
          const targetData = data[rowIndex * maxCols + render.col];
          if (!targetData) {
            break;
          }
          const newRender = {
            ...render,
            row: rowIndex,
            top: rowIndex * itemHeight,
            data: targetData,
          };
          renderDatas[renderRow * renderCols + i] = newRender;
        }
      }
      this.state.rowOrder = newRowOrder;
      this.forceUpdate();
    } else if (dir === 'left') {
      let hitColLeftIndex = Math.floor(x0 / itemWidth);
      if (hitColLeftIndex < 0) {
        hitColLeftIndex = 0;
      }
      if (
        hitColLeftIndex === lastHitColLeft ||
        renderCols === maxCols ||
        hitColLeftIndex + renderCols - 1 >= maxCols
      ) {
        return;
      }
      this.state.lastHitColLeft = hitColLeftIndex;
      const targetColOrderIndex = hitColLeftIndex % renderCols;
      let newColOrder = colOrder;
      if (hitColLeftIndex > 0) {
        newColOrder = this.rotateOrderLeft(targetColOrderIndex, colOrder);
      }
      this.state.colOrder = newColOrder;
      for (let c = 0; c < renderCols; c++) {
        let colIndex = hitColLeftIndex + c;
        if (hitColLeftIndex > 0) {
          colIndex -= 1;
        }
        const renderCol = newColOrder[c];
        for (let i = 0; i < renderRows; i++) {
          const render = renderDatas[i * renderCols + renderCol];
          const targetData = data[render.row * maxCols + colIndex];
          if (!targetData) {
            break;
          }
          const newRender = {
            ...render,
            col: colIndex,
            left: colIndex * itemWidth,
            data: targetData,
          };
          renderDatas[i * renderCols + renderCol] = newRender;
        }
      }
      this.forceUpdate();
    } else if (dir === 'right') {
      let hitColRightIndex = Math.floor(x1 / itemWidth);
      if (hitColRightIndex >= maxCols) {
        hitColRightIndex = maxCols - 1;
      }
      if (
        hitColRightIndex === lastHitColRight ||
        renderCols === maxCols ||
        hitColRightIndex - renderCols + 1 <= 0
      ) {
        return;
      }
      this.state.lastHitColRight = hitColRightIndex;
      const targetColOrderIndex = hitColRightIndex % renderCols;
      let newColOrder = colOrder;
      if (hitColRightIndex < maxRows - 1) {
        newColOrder = this.rotateOrderRight(targetColOrderIndex, colOrder);
      }
      this.state.colOrder = newColOrder;
      for (let c = 0; c < renderCols; c++) {
        let colIndex = hitColRightIndex - c;
        if (hitColRightIndex < maxCols - 1) {
          colIndex += 1;
        }
        const renderCol = newColOrder[c];
        for (let i = 0; i < renderRows; i++) {
          const render = renderDatas[i * renderCols + renderCol];
          const targetData = data[render.row * maxCols + colIndex];
          if (!targetData) {
            break;
          }
          const newRender = {
            ...render,
            col: colIndex,
            left: colIndex * itemWidth,
            data: targetData,
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
    const { dataDirection, rowLimitCount, data } = this.props;
    const { defaultItemData, contentProps } = this.state;
    const dataLen = data.length;
    const lineNum = Math.floor(dataLen / rowLimitCount);
    const lineCount = dataLen % rowLimitCount > 0 ? lineNum + 1 : lineNum;
    contentProps.width = defaultItemData.width * rowLimitCount;
    contentProps.height = lineCount * defaultItemData.height;
    this.state.maxCols = rowLimitCount;
    this.state.maxRows = Math.ceil(dataLen / rowLimitCount);
  };

  initDefaultItemData() {
    const { clientWidth, clientHeight } = this.preRenderRef.current;
    const { defaultItemData } = this.state;
    defaultItemData.width = clientWidth;
    defaultItemData.height = clientHeight;
  }

  updateRenderDatas = () => {
    const { data, dataDirection, rowLimitCount } = this.props;
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
        const rowIndex = Math.floor(i / renderCols);
        const colIndex = i % renderCols;
        const top = rowIndex * itemHeight;
        const left = colIndex * itemWidth;
        const targetData = data[rowIndex * rowLimitCount + colIndex];
        return {
          top,
          left,
          row: rowIndex,
          col: colIndex,
          data: targetData,
          ref,
        };
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
