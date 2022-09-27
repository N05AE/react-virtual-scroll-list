import { arrayOf, func, number, oneOf, shape, string } from 'prop-types';

export const GridDataDirection = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

export const virtualGridProps = {
  itemRenderer: func.isRequired,
  data: arrayOf(shape({ key: string.isRequired })).isRequired,
  unit: string,
  width: string,
  height: string,
  dataDirection: string,
  limitCountOnDirection: number,
  tabIndex: string,
  className: string,
};

export const virtualGridDefaultProps = {
  unit: 'px',
  width: '100%',
  height: '100%',
  dataDirection: GridDataDirection.HORIZONTAL,
  limitCountOnDirection: 3,
};
