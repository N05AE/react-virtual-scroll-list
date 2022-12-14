import React from 'react';
import { VirtualGrid } from '../src/components/VirtualGrid';
import { Direction } from '../src/types';
export default {
  title: 'Virtual Grid',
  component: VirtualGrid,
};

const dataArr = Array(999)
  .fill('')
  .map((_, idx) => ({ key: String(idx + 1), value: String(idx + 1) }));

const grid = dir => (
  <div
    style={{
      marginLeft: '40px',
      display: 'inline-block',
      // width: '500px',
      // height: '200px',
      border: '1px solid blue',
    }}
  >
    <VirtualGrid
      itemRenderer={dt => (
        <div
          key={dt.key}
          style={{
            width: '100px',
            height: '100px',
            wordBreak: 'break-word',
            display: 'flex',
            border: '1px solid red',
            margin: '2px',
          }}
        >
          {dt.value}
        </div>
      )}
      data={dataArr}
      direction={dir}
      directionLimitCeils={20}
    />
  </div>
);

export const horizontalGrid = () => {
  return grid(Direction.HORIZONTAL);
};

export const verticalGrid = () => {
  return grid(Direction.VERTICAL);
};
