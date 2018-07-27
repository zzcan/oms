import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import './index.css';
import Login from './routes/Login/LoginLayout';
import SelectSubsystem from './routes/SelectSubsystem/index';
import Exception403 from './routes/Exception/403';
import Exception404 from './routes/Exception/404';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/list" component={SelectSubsystem} />
                <Route path="/403" component={Exception403} />
                <Route path="/404" component={Exception404} />
                <Route path="/" component={SelectSubsystem} />
            </Switch>
        </HashRouter>
    </LocaleProvider>, 
    document.getElementById('root')
);
registerServiceWorker();
