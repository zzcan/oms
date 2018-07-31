import mockjs from 'mockjs';
import { getMenus, getFuncPageList, getSubsystemList } from './mock/api';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/(.*)': 'http://oms-deploy.yunmof.com/api/',
  'POST /api/(.*)': 'http://oms-deploy.yunmof.com/api/',
  // 'GET /GetFuncPageList': getFuncPageList,
  'GET /GetSubsystemList': getSubsystemList,
  'POST /ChangeSubsystemInfo': (req, res) => {
    res.send({
      Code: 0,
      Data: {},
      Msg: '',
    });
  },
  // 'POST /DeletePage': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {},
  //     Msg: '',
  //   });
  // },
  // 'POST /BatchClass': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {},
  //     Msg: '',
  //   });
  // },
  // 'POST /AddPage': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {},
  //     Msg: '',
  //   });
  // },
  // 'POST /ChangePageClassName': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {},
  //     Msg: '',
  //   });
  // },
  // 'POST /AddPageClass': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {},
  //     Msg: '',
  //   });
  // },
  // 'POST /EditPageInfo': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {},
  //     Msg: '',
  //   });
  // },
  // 'POST /DeletePageClass': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {},
  //     Msg: '',
  //   });
  // },
  // 'GET /GetPageClass': (req, res) => {
  //   res.send({
  //     Code: 0,
  //     Data: {
  //       PageClassList: [
  //         {
  //           ClassName: '未分类',
  //           Id: 0,
  //           PageNum: 20,
  //         },
  //         {
  //           ClassName: '店铺管理类',
  //           Id: 1,
  //           PageNum: 10,
  //         },
  //         {
  //           ClassName: '基础管理类',
  //           Id: 2,
  //           PageNum: 10,
  //         },
  //         {
  //           ClassName: 'gg',
  //           Id: 3,
  //           PageNum: 20,
  //         },
  //         {
  //           ClassName: 'gfhgfj',
  //           Id: 4,
  //           PageNum: 10,
  //         },
  //         {
  //           ClassName: 'sfghfgh',
  //           Id: 5,
  //           PageNum: 10,
  //         },
  //         {
  //           ClassName: '的闪光点',
  //           Id: 6,
  //           PageNum: 20,
  //         },
  //         {
  //           ClassName: '阿三哥电话费',
  //           Id: 7,
  //           PageNum: 10,
  //         },
  //         {
  //           ClassName: '的返回房间',
  //           Id: 8,
  //           PageNum: 10,
  //         },
  //       ],
  //       Total: 9,
  //     },
  //     Msg: '',
  //   });
  // },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default (noProxy ? {} : delay(proxy, 1000));
