import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { querySubsystemList, changeSubsystemInfo } from '../services/subsystem';

export default {
  namespace: 'subsystem',

  state: {
    subsystemList: [],
    total: 0,
    fetchListParams: {
      createDateSort: 0,
      useNumSort: 0,
      pageIndex: 1,
      pageSize: 10,
    },
  },

  effects: {
    *querySubsystemList(_, { select, call, put }) {
      const subsystem = yield select(state => state.subsystem);
      const response = yield call(querySubsystemList, subsystem.fetchListParams);
      if(response.Code === 0) {
        yield put({
          type: 'saveSubsystem',
          payload: response.Data,
        });
      }
    },
    *changeSubsystemInfo({ payload }, { call, put }) {
      const response = yield call(changeSubsystemInfo, payload);
      if(response.Code === 0) {
        yield put({
          type: 'querySubsystemList',
        });
      }
    },
    *delSubsystem({ payload }, { call, put }) {
      const response = yield call(delSubsystem, payload);
      if(response.Code === 0) {
        yield put({
          type: 'querySubsystemList',
        });
      }
    },
  },

  reducers: {
    saveSubsystem(state, { payload }) {
      return {
        ...state,
        subsystemList: payload.PageData,
        total: payload.Total,
      };
    },
    saveFetchParams(state, { payload }) {
      return {
        ...state,
        fetchListParams: payload
      };
    },
  },
};
