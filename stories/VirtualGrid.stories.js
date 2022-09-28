import React from 'react';
import { VirtualGrid } from '../src/components/VirtualGrid';
export default {
  title: 'Virtual Grid',
  component: VirtualGrid,
};

const dataArr = Array(1000)
  .fill('')
  .map((_, idx) => ({ key: String(idx + 1), value: String(idx + 1) }));

export const normal = () => {
  return (
    <div
      style={{
        marginLeft: '40px',
        display: 'inline-block',
        // width: 'inherit',
        height: '200px',
        border: '1px solid blue',
      }}
    >
      <VirtualGrid
        itemRenderer={dt => (
          <div
            key={dt.key}
            style={{
              width: '100px',
              maxWidth: '100px',
              wordBreak: 'break-word',
              display: 'flex',
              border: '1px solid red',
              // borderTop: '1px solid red',
              // borderLeft: '1px solid red',
              margin: '2px',
            }}
            tabIndex="0"
          >
            {dt.value}
          </div>
        )}
        data={dataArr}
        rowLimitCount={10}
      />
    </div>
  );
};
