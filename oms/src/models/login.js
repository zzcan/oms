import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login, loginOut } from '../services/api';
import { setLoginInfo } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    systemList: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginInfo',
        payload: response.Data,
      });
      yield put(routerRedux.push(`/selectsubsystem`));
      // const urlParams = new URL(window.location.href);
      // const params = getPageQuery();
      // let { redirect } = params;
      // if (redirect) {
      //   const redirectUrlParams = new URL(redirect);
      //   if (redirectUrlParams.origin === urlParams.origin) {
      //     redirect = redirect.substr(urlParams.origin.length);
      //     if (redirect.startsWith('/#')) {
      //       redirect = redirect.substr(2);
      //     }
      //   } else {
      //     window.location.href = redirect;
      //     return;
      //   }
      // }
    },
    *logout(_, { call, put }) {
      const response = call(loginOut);
      yield put({
        type: 'changeLoginInfo',
        payload: {
          Token: '',
          UserInfo: {},
          SystemList: [],
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
  },

  reducers: {
    changeLoginInfo(state, { payload }) {
      setLoginInfo(payload);
      reloadAuthorized();
      return {
        ...state,
        systemList: payload.SystemList,
      };
    },
  },
};
