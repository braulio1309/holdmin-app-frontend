import network from '@services/network';
import * as local from './response';

const endPoints = {
  login: 'index.php/wp-json/jwt-auth/v1/token',
};

export const fetchLogin = params => {
  return local.login({params});
};

export const fetchValid = params => {
  return local.validToken({params});
};

export const getSetting = params => {
  return local.getSetting({params});
};

export const signUp = params => {
  return local.signUp({params});
};

export const updateProfile = params => {
  return local.user({params});
};

export const getUserInfo = params => {
  return local.user({params});
};

export const changePassword = params => {
  return local.user({params});
};

export const getWishList = params => {
  return local.getWishList({params});
};

export const getWishListRealEstate = params => {
  return local.getWishListRealEstate({params});
};

export const getWishListEvent = params => {
  return local.getWishListEvent({params});
};

export const getWishListFood = params => {
  return local.getWishListFood({params});
};

export const getHome = params => {
  return local.getHome({params});
};

export const getHomeRealEstate = params => {
  return local.getHomeRealEstate({params});
};

export const getHomeEvent = params => {
  return local.getHomeEvent({params});
};

export const getHomeFood = params => {
  return local.getHomeFood({params});
};

export const getProductDetail = params => {
  return local.getProductDetail({params});
};

export const getProductDetailRealEstate = params => {
  return local.getProductDetailRealEstate({params});
};

export const getProductDetailEvent = params => {
  return local.getProductDetailEvent({params});
};

export const getProductDetailFood = params => {
  return local.getProductDetailFood({params});
};

export const getReview = params => {
  return local.getReview({params});
};

export const saveReview = params => {
  return local.getReview({params});
};

export const getCategory = params => {
  return local.getCategory({params});
};

export const getListProduct = params => {
  return local.getList({params});
};

export const getListProductEvent = params => {
  return local.getListEvent({params});
};

export const getListProductRealEstate = params => {
  return local.getListRealEstate({params});
};

export const getListProductFood = params => {
  return local.getListFood({params});
};

export const getMessage = params => {
  return local.getMessage({params});
};

export const getNotification = params => {
  return local.getNotification({params});
};
