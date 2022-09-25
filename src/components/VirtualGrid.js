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
    console.log(this.state);
  }

  initEvents = () => {
    this.wrapperRef.current.addEventListener('scroll', event => {
      const { scrollLeft, scrollTop } = this.state;
      const newScrollLeft = event.target.scrollLeft;
      const newScrollTop = event.target.scrollTop;
      if (scrollTop !== newScrollTop) {
        this.handleScroll(
          'top',
          scrollTop,
          newScrollTop,
          event.target.scrollHeight,
        );
        this.state.scrollTop = newScrollTop;
      } else if (scrollLeft !== newScrollLeft) {
        this.handleScroll(
          'left',
          scrollLeft,
          newScrollLeft,
          event.target.scrollHeight,
        );
        this.state.scrollLeft = newScrollLeft;
      }
    });
  };

  handleScroll = (dir, prevScroll, curScroll, scrollMax) => {
    const { wrapperProps, defaultItemData } = this.state;
    const { width, height } = wrapperProps;
    const wrapperRect = this.wrapperRef.current.getBoundingClientRect();
    const contentRect = this.contentRef.current.getBoundingClientRect();
    const x0 = wrapperRect.top - contentRect.top;
    const y0 = wrapperRect.left - contentRect.left;
    const colStart = Math.floor(x0 / defaultItemData.width);
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
              top={render.top}
              left={render.left}
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
