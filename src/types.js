import { array, node, number } from 'prop-types';

export const virtualGridProps = {
  itemRenderer: node.isRequired,
  data: array.isRequired,
  row: number.isRequired,
  col: number.isRequired,
  width: number.isRequired,
  height: number.isRequired,
};

export const virtualGridDefaultProps = {
  width: 200,
  height: 200,
};
