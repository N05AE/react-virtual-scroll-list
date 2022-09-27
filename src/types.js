import { arrayOf, func, number, oneOf, shape, string } from 'prop-types';

export const virtualGridProps = {
  itemRenderer: func.isRequired,
  data: arrayOf(shape({ key: string.isRequired })).isRequired,
  unit: string,
  width: string,
  height: string,
  rowLimitCount: number,
  tabIndex: string,
  className: string,
};

export const virtualGridDefaultProps = {
  unit: 'px',
  width: '100%',
  height: '100%',
  rowLimitCount: 3,
};
