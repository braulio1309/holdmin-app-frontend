import * as actionTypes from './actionTypes';

export const onLoad = (design, callback) => {
  return {
    type: actionTypes.FETCH_HOME,
    callback,
    design,
  };
};
