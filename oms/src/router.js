import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Exception from './routes/Exception/403';
import Exception404 from './routes/Exception/404';
import BasicLayout from './layouts/BasicLayout';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/403" component={Exception} />
          <Route path="/404" component={Exception404} />
          <Route path="/" render={props => <BasicLayout {...props} />} />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
