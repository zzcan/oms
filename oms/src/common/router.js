import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
export const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        //todo 缓存
        // routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        // routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        // routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            // routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

let keys = {};
function getFlatMenuData(menus, parentPath) {
  menus.forEach(item => {
    let formatPath = parentPath ? parentPath + item.path : item.path;
    if (item.children) {
      if (keys[item.path]) {
        keys[item.path] = { ...item, formatPath: [...keys[item.path].formatPath, formatPath] };
      } else {
        keys[item.path] = { ...item, formatPath: [formatPath] };
      }
      keys = { ...keys, ...getFlatMenuData(item.children, formatPath) };
    } else {
      if (keys[item.path]) {
        keys[item.path] = { ...item, formatPath: [...keys[item.path].formatPath, formatPath] };
      } else {
        keys[item.path] = { ...item, formatPath: [formatPath] };
      }
    }
  });
  return keys;
}

export const getRouterData = (app, menus) => {
  const routerConfig = {
    '/dashboard': {
      component: dynamicWrapper(app, ['global'], () => import('../routes/Dashboard/index')),
    },
    '/funcpage': {
      component: dynamicWrapper(app, ['funcpage'], () => import('../routes/FuncPage/index')),
    },
    '/subsystem': {
      component: dynamicWrapper(app, ['subsystem'], () => import('../routes/SubSystem/index')),
    },
    '/subsystem/buildsystem': {
      component: dynamicWrapper(app, ['subsystem', 'funcpage'], () => import('../routes/SubSystem/buildSystem/index')),
    },
    '/roleauthority': {
      component: dynamicWrapper(app, [], () => import('../routes/RoleAuthority/index')),
    },
    '/account': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/index')),
    },
    '/teammanage': {
      component: dynamicWrapper(app, [], () => import('../routes/TeamManage/index')),
    },
    '/officialaccounts': {
      component: dynamicWrapper(app, [], () => import('../routes/OfficialAccounts/index')),
    },
    '/productmanage': {
      component: dynamicWrapper(app, [], () => import('../routes/ProductManage/index')),
    },
    '/exception/400': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/400')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(menus);
  console.log(menuData);
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    // 菜单和路由的动态映射
    // let routerPath = menuKey ? menuItem.formatPath : path;
    if (menuKey) {
      menuItem.formatPath.forEach(v => {
        routerData[v] = router;
      });
    } else {
      routerData[path] = router;
    }
  });
  console.log(routerData);
  return routerData;
};
