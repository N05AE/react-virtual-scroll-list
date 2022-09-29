import React from 'react';
import { VirtualList } from '../src/components/VirtualList';
import { Direction } from '../src/types';

export default {
  title: 'Virtual List',
  component: VirtualList,
};

const dataArr = Array(999)
  .fill('')
  .map((_, idx) => ({ key: String(idx + 1), value: String(idx + 1) }));

const list = dir => (
  <div
    style={{
      marginLeft: '40px',
      display: 'inline-block',
      width: 'auto',
      height: 'auto',
      border: '1px solid blue',
    }}
  >
    <VirtualList
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
    />
  </div>
);

export const horizontalList = () => {
  return list(Direction.HORIZONTAL);
};

export const verticalList = () => {
  return list(Direction.VERTICAL);
};
