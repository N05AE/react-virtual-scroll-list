import { arrayOf, func, number, oneOf, shape, string } from 'prop-types';

export const Direction = {
  VERTICAL: 0,
  HORIZONTAL: 1,
};

export const commonProps = {
  tabIndex: string,
  unit: string,
  direction: oneOf(Object.values(Direction)),
  width: string,
  height: string,
  style: shape({}),
  className: string,
  data: arrayOf(shape({ key: string.isRequired })).isRequired,
  itemRenderer: func.isRequired,
};

export const commonDefaultProps = {
  direction: Direction.HORIZONTAL,
  tabIndex: '0',
  unit: 'px',
  style: {},
};

export const virtualGridProps = {
  ...commonProps,
  directionLimitCeils: number,
};

export const virtualGridDefaultProps = {
  ...commonDefaultProps,
  directionLimitCeils: 3,
  width: '500px',
  height: '300px',
};

export const virtualListProps = {
  ...commonProps,
};

export const virtualListDefaultProps = {
  ...commonDefaultProps,
};
