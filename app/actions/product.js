import * as actionTypes from './actionTypes';
import axios from 'axios';

export const onLoadProduct = (id, design, callback = () => {}) => {
  return {
    type: actionTypes.FETCH_PRODUCT_DETAIL,
    id,
    design,
    callback,
  };
};

export const onLoadReview = (params, callback = () => {}) => {
  return {
    type: actionTypes.GET_COMMENT,
    params,
    callback,
  };
};

export const onFeekBack = (params, callback = () => {}) => {
  return {
    type: actionTypes.SAVE_COMMENT,
    params,
    callback,
  };
};

export const onFetchCategory = (params, callback = () => {}) => {
  return {
    type: actionTypes.GET_CATEGORY,
    params,
    callback,
  };
};

export const fetchData = () => {
  console.log('holahola')
  return async dispatch => {
    try {
      const response = await axios.get('http://localhost:1337/api/users');
      dispatch({type: 'FETCH_DATA_SUCCESS', payload: response.data});
    } catch (error) {
      dispatch({type: 'FETCH_DATA_FAILURE', payload: error.message});
    }
  };
};
