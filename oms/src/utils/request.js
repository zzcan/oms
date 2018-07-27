import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import store from '../index';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  let [token, uid, systemid] = ['', '', ''];
  if (store) {
    const { global } = store._store.getState();
    token = global.token;
    uid = global.userInfo.Id;
    systemid = global.systemId;
  }
  newOptions.headers = {
    token,
    uid,
    systemid,
    ...newOptions.headers,
  };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(response => response.json())
    .then(response => {
      const { origin, href } = location;
      if (response.Code === 40003) {
        //当前子系统不存在
        // 跳转404页面
        location.href = `${origin}/#404`;
      }
      if (response.Code === 403001 || response.Code === 403002) {
        // 重新登录
        location.href = `${origin}/#login?returnUrl=${href}`;
      }
      if (response.Code === 403003) {
        // 刷新页面
        location.reload();
      }
      if(response.Code === 403004) {
        // 跳转403页面
        location.href = `${origin}/#403`;
      }
      if(response.Code !== 0) {
        message.error(response.Msg);
      }
      return response;
    })
}
