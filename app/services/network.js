import axios from 'axios';
import {store} from '@store';

const getToken = () => store.getState().auth?.user?.token;
const getDomain = () => store.getState().application?.domain;

/**
 * class for for network client layer
 * @counterDownload handle dispose stack limit request download
 * @counterUpload handle dispose stack limit request upload
 * @class Api
 */

class HTTP {
  constructor() {
    this.counterDownload = 0;
    this.counterUpload = 0;
    this.uniqueRequest = {};
    this.http = this.setupInterceptors();
  }

  /**
   * setup member axios
   *
   * @returns
   * @memberof Api
   */
  setupInterceptors() {
    const api = axios.create({});

    api.interceptors.request.use(
      config => {
        const token = getToken();
        if (!config.baseURL) {
          config.baseURL = `${getDomain()}/index.php/wp-json`;
        }
        console.log('Before Request >>>', config);
        // Add more config before request
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.timeout = 10000;
        return config;
      },
      error => {
        console.log('Error Request >>>', error);
        // Do something with response error
        return new Promise.reject(error);
      },
    );

    api.interceptors.response.use(
      response => {
        console.log('After Request >>>', response);
        // process more after response
        return response;
      },
      error => {
        console.log('Error Response >>>', error);
        // process more when exeption
        return new Promise.reject(error);
      },
    );
    return api;
  }

  /**
   * Cancel all request
   *
   * @memberof Api
   */
  cancelAllRequest() {
    this.uniqueRequest.forEach(item => {});
  }

  /**
   * Cancel one request
   *
   * @param {*} key
   * @memberof Api
   */
  cancelRequest(key) {
    if (this.uniqueRequest?.[key]) {
      console.log('Cancel request key', key);
      this.uniqueRequest[key]?.cancel();
    }
  }

  /**
   *
   * remove one request
   * @param {*} key
   * @memberof Api
   */
  removeTokenRequest(key) {
    if (this.uniqueRequest?.[key]) {
      console.log('Remove uniqueRequest request key', key);
      this.uniqueRequest[key] = null;
    }
  }

  /**
   * Get Mothod
   *
   * @param {*} endPoint
   * @param {*} [params={}]
   * @param {*} [headers={}]
   * @param {*} uniqueRequest
   * @param {string} [responseType='json']
   * @returns
   * @memberof Api
   */
  async get(endPoint, {params, headers, uniqueRequest, responseType}) {
    let cancelToken;
    if (uniqueRequest) {
      this.cancelRequest(uniqueRequest);
      cancelToken = axios.CancelToken.source();
      this.uniqueRequest[uniqueRequest] = cancelToken;
    }
    try {
      const response = await this.http({
        method: 'get',
        url: endPoint,
        params: params ?? {},
        headers: headers ?? {},
        responseType: responseType ?? 'json',
        cancelToken: cancelToken?.token,
      });
      this.removeTokenRequest(uniqueRequest);
      return Promise.resolve(response.data);
    } catch (error) {
      this.removeTokenRequest(uniqueRequest);
      return Promise.reject(error);
    }
  }

  /**
   * Post Method
   *
   * @param {*} endPoint
   * @param {*} [payload={}]
   * @param {*} [headers={}]
   * @param {*} uniqueRequest
   * @returns
   * @memberof Api
   */
  async post(endPoint, {params, headers, uniqueRequest}) {
    let cancelToken;
    if (uniqueRequest) {
      this.cancelRequest(uniqueRequest);
      cancelToken = axios.CancelToken.source();
      this.uniqueRequest[uniqueRequest] = cancelToken;
    }
    return this.http({
      method: 'post',
      url: endPoint,
      data: params ?? {},
      headers: headers ?? {},
      cancelToken: cancelToken?.token,
    })
      .then(response => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.resolve(response.data);
      })
      .catch(error => {
        this.removeTokenRequest(uniqueRequest);
        return Promise.reject(error);
      });
  }
}

export default new HTTP();
