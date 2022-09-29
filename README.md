# React virtual scroll list
 
## Description:
A scroll grid/list can render a large number of datas.
 
- - -

## Install
` npm install @easonviip/react-virtual-scroll-list `

- - -

## Story book

` npm run storybook `

- - -

## Components
<br>

### Virtual Grid: 

| prop | type | description | mandatory |
| :-: | :-: | :-: | :-:|
| itemRenderer | func | renderer to render the items in grid. | Y |
| data | array | the data array to renderer, an array of objects and the objects inside must contain a key property. | Y |
|  unit | string | the unit use in the component, default is px. | N |
| tabIndex | string | html property tabindex. | N |
| direction | Direction | the data direction list in the grid, default is Direction.HORIZONTAL. | N |
| directionLimitCeils | number | the limit count of ceils on the data list direction, default is 3. | N |
| width | string | the width of the grid, default is 500px. | N |
| height | string | the height of the grid, default is 300px. | N |
| className | string | html property class. | N |
| style | string | html property style. | N |
- - -
<br>

### Virtual List:
| prop | type | description | mandatory |
| :-: | :-: | :-: | :-:|
| itemRenderer | func | renderer to render the items in grid. | Y |
| data | array | the data array to renderer, an array of objects and the objects inside must contain a key property. | Y |
|  unit | string | the unit use in the component, default is px. | N |
| tabIndex | string | html property tabindex. | N |
| direction | Direction | the list scroll driection, default is Direction.HORIZONTAL. | N |
| width | string | the width of the grid. If the direction is HORIZONTAL, width default is 500px. If the direction is VERTICAL, width default is auto. | N |
| height | string | the height of the grid. If the direction is VERTICAL, height default is 300px. If the direction is HORIZONTAL, height default is auto. | N |
| className | string | html property class. | N |
| style | string | html property style. | N |

- - -
