import { arrayOf, func, number, oneOf, shape, string } from 'prop-types';

export const GridDirection = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

export const virtualGridProps = {
  itemRenderer: func.isRequired,
  data: arrayOf(shape({ uniKey: string.isRequired })).isRequired,
  unit: string,
  width: string,
  height: string,
  direction: string,
  limitCountOnDirection: number,
  tabIndex: string,
  className: string,
};

export const virtualGridDefaultProps = {
  unit: 'px',
  width: '100%',
  height: '100%',
  direction: GridDirection.HORIZONTAL,
  limitCountOnDirection: 3,
};
