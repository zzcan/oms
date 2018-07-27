import { parse } from 'url';

export function getMenus(req, res) {
  let subSystemId = 0;
  const menus = [
    [
      {
        name: '工作台',
        path: '/dashboard',
        icon: 'dashboard',
      },
      {
        name: '功能页面',
        path: '/funcpage',
        icon: 'dashboard',
      },
      {
        name: '子系统',
        path: '/subsystem',
        icon: 'dashboard',
      },
      {
        name: '角色权限',
        path: '/roleauthority',
        icon: 'dashboard',
      },
      {
        name: '人员账号',
        path: '/account',
        icon: 'dashboard',
      },
      {
        name: '团队管理',
        path: '/teammanage',
        icon: 'dashboard',
      },
      {
        name: '公众号',
        path: '/officialaccounts',
        icon: 'dashboard',
      },
    ],
    [
      {
        name: '工作台',
        path: 'dashboard',
        icon: 'dashboard',
      },
      {
        name: '产品管理',
        path: 'productmanage',
        icon: 'dashboard',
      },
    ],
    [
      {
        name: '首页',
        path: 'dashboard',
        icon: 'dashboard',
      },
      {
        name: '团队管理',
        path: 'teammanage',
        icon: 'dashboard',
      },
      {
        name: '个人设置',
        path: 'setting',
        icon: 'dashboard',
      },
    ],
  ];
  res.send({
    Code: 0,
    Data: {
      Menus: menus[subSystemId],
      SubsystemId: 0,
      Token: 'sdsgffsgdghghg',
      UserInfo: {
        UserName: 'Serati Ma',
        Avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        Id: 101121251212,
      },
    },
    Msg: 'success',
  });
}
export function getFuncPageList(req, res) {
  res.send({
    Code: 0,
    Data: {
      PageData: [
        {
          Id: 0,
          ClassId: 0,
          ClassName: '未分类',
          PageName: '活跃店铺',
          PageUrl: '/active',
          ReferenceNum: 0,
          Description: '可以按条件搜索某段时间内有成交的店铺',
          CreateDate: '2018/06/19 11:12:39',
        },
        {
          Id: 1,
          ClassId: 1,
          ClassName: '店铺分类',
          PageName: '活跃店铺',
          PageUrl: '/active',
          ReferenceNum: 10,
          Description: '可以按条件搜索某段时间内有成交的店铺',
          CreateDate: '2018/06/19 11:12:39',
        },
        {
          Id: 2,
          ClassId: 1,
          ClassName: '店铺分类',
          PageName: '活跃店铺',
          PageUrl: '/active',
          ReferenceNum: 20,
          Description: '可以按条件搜索某段时间内有成交的店铺',
          CreateDate: '2018/06/19 11:12:39',
        },
      ],
      Total: 2,
    },
    Msg: 'success',
  });
}

export function getSubsystemList(req, res) {
  res.send({
    Code: 0,
    Data: {
      PageData: [
        {
          Id: 0,
          UseNum: 10,
          SystemName: '配置管理系统',
          PageName: '活跃店铺',
          HomeUrl: '/active',
          PageNum: 10,
          Summary: '可以按条件搜索某段时间内有成交的店铺',
          CreateDate: '2018/06/19 11:12:39',
        },
        {
          Id: 1,
          UseNum: 10,
          SystemName: '配置管理系统',
          PageName: '活跃店铺',
          HomeUrl: '/active',
          PageNum: 10,
          Summary: '可以按条件搜索某段时间内有成交的店铺',
          CreateDate: '2018/06/19 11:12:39',
        },
        {
          Id: 2,
          UseNum: 10,
          SystemName: '配置管理系统',
          PageName: '活跃店铺',
          HomeUrl: '/active',
          PageNum: 10,
          Summary: '可以按条件搜索某段时间内有成交的店铺',
          CreateDate: '2018/06/19 11:12:39',
        },
      ],
      Total: 3,
    },
    Msg: 'success',
  });
}
