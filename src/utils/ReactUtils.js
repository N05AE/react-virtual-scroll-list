import { Component } from 'react';

export const updateReactState = (thisObj, data, propName = null) => {
  if (
    !data ||
    (typeof data !== 'object' && !propName) ||
    !thisObj ||
    !(thisObj instanceof Component)
  ) {
    return;
  }
  if (!propName) {
    thisObj.setState(prevState => ({ ...prevState, ...data }));
  } else {
    thisObj.setState(prevState => ({ ...prevState, [propName]: data }));
  }
};
