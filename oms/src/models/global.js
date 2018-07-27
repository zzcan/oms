import { queryMenus } from '../services/api';
import { getRouterData } from '../common/router';
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    token: undefined,
    userInfo: {},
    systemId: undefined,
    menus: [],
    routerData: {},
  },

  effects: {
    *fetchMenus({ payload }, { call, put }) {
      const data = yield call(queryMenus, payload);
      let { Menus, UserInfo, Token, SubsystemId } = data.Data;
      yield put({
        type: 'saveUserInfo',
        payload: {
          Token,
          UserInfo,
          SubsystemId,
        },
      });
      //动态配置菜单和路由
      const routerData = getRouterData(require('../index').default, Menus);
      yield put({
        type: 'saveRouterData',
        payload: routerData,
      });
      yield put({
        type: 'saveMenus',
        payload: Menus,
      });
    },
  },

  reducers: {
    saveUserInfo(state, { payload }) {
      return {
        ...state,
        token: payload.Token,
        userInfo: payload.UserInfo,
        systemId: payload.SubsystemId,
      };
    },
    saveRouterData(state, { payload }) {
      return {
        ...state,
        routerData: payload,
      };
    },
    saveMenus(state, { payload }) {
      return {
        ...state,
        menus: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
