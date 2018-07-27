import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  queryFuncPageList,
  delFuncPage,
  queryPageClass,
  batchClass,
  addPage,
  changePageClassName,
  addClassName,
  deletePageClass,
  editPageInfo,
} from '../services/funcpage';

export default {
  namespace: 'funcpage',

  state: {
    funcPageList: [],
    total: 0,
    batchModalVisible: false,
    addModalVisible: false,
    pageClassList: [],
    pageClassTotal: 0,
    batchModalConfirmLoading: false,
    classModalVisible: false,
  },

  effects: {
    *queryFuncPageList({ payload }, { call, put }) {
      const response = yield call(queryFuncPageList, payload);
      if(response.Code === 0) {
        yield put({
          type: 'saveFuncPage',
          payload: response.Data,
        });
      }
    },
    *queryPageClass({ payload }, { call, put }) {
      const response = yield call(queryPageClass, payload);
      if(response.Code === 0) {
        yield put({
          type: 'savePageClass',
          payload: response.Data,
        });
      }
    },
    *delFuncPage({ payload }, { select, call, put }) {
      yield put({
        type: 'changeModalConfirmLoading',
        payload: {
          type: 'batchModalConfirmLoading',
          flag: true,
        },
      });
      const response = yield call(delFuncPage, {Id: payload.Id});
      if(response.Code === 0) {
        yield put({
          type: 'queryFuncPageList',
          payload: payload.fetchListParams,
        });
        message.success('删除页面成功！');
      }
      yield put({
        type: 'changeModalConfirmLoading',
        payload: {
          type: 'batchModalConfirmLoading',
          flag: false,
        },
      });
      yield put({
        type: 'changeModalVisible',
        payload: {
          type: 'batchModalVisible',
          flag: false,
        },
      });
    },
    *batchClass({ payload }, { call, put }) {
      yield put({
        type: 'changeModalConfirmLoading',
        payload: {
          type: 'batchModalConfirmLoading',
          flag: true,
        },
      });
      const response = yield call(batchClass, { Id: payload.Id, ClassId: payload.ClassId });
      if(response.Code === 0) {
        yield put({
          type: 'queryFuncPageList',
          payload: payload.fetchListParams,
        });
        message.success('批量修改分类成功！');
      }
      yield put({
        type: 'changeModalConfirmLoading',
        payload: {
          type: 'batchModalConfirmLoading',
          flag: false,
        },
      });
      yield put({
        type: 'changeModalVisible',
        payload: {
          type: 'batchModalVisible',
          flag: false,
        },
      });
    },
    *addPage({ payload }, { call, put }) {
      const { fetchListParams, ...params } = payload;
      const response = yield call(addPage, params);
      if(response.Code === 0) {
        yield put({
          type: 'queryFuncPageList',
          payload: payload.fetchListParams,
        });
        message.success('添加页面成功！');
      }
      yield put({
        type: 'changeAddModalConfirmLoading',
        payload: false,
      });
      yield put({
        type: 'changeAddModalVisible',
        payload: false,
      });
    },
    *changePageClassName({ payload }, { call, put }) {
      const response = yield call(changePageClassName, payload.pageClassItem);
      yield put({
        type: 'queryPageClass',
        payload: payload.fetchClassParams,
      });
    },
    *addClass({ payload }, { call, put }) {
      const response = yield call(addClassName, { ClassName: payload.className });
      if(response.Code === 0) {
        message.success('添加分类成功！');
        yield put({
          type: 'queryPageClass',
          payload: payload.fetchClassParams,
        });
      }
    },
    *delClass({ payload }, { call, put }) {
      const response = yield call(deletePageClass, { ClassId: payload.id });
      if(response.Code === 0) {
        message.success('删除分类成功！');
        yield put({
          type: 'queryPageClass',
          payload: payload.fetchClassParams,
        });
      }
    },
    *editPageInfo({ payload }, { call, put }) {
      const response = yield call(editPageInfo, payload.pageInfo);
      if(response.Code === 0) {
        message.success('修改页面信息成功！');
        yield put({
          type: 'queryFuncPageList',
          payload: payload.fetchListParams,
        });
      }
    },
  },

  reducers: {
    saveFuncPage(state, { payload }) {
      return {
        ...state,
        funcPageList: payload.PageData,
        total: payload.Total,
      };
    },
    savePageClass(state, { payload }) {
      return {
        ...state,
        pageClassList: payload.PageData,
        pageClassTotal: payload.Total,
      };
    },
    changeModalVisible(state, { payload }) {
      return {
        ...state,
        [`${payload.type}`]: payload.flag,
      };
    },
    changeModalConfirmLoading(state, { payload }) {
      return {
        ...state,
        [`${payload.type}`]: payload.flag,
      };
    },
  },
};
