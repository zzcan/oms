import React from 'react';
import { checkIsLogin } from '../utils/authority';
import { Link } from 'dva/router';

const CommonPageLayoutWrapper = (WrappedComponent, type) => {
  class CommonPageLayout extends React.Component {
    state = {
      systemList: [],
    };
    componentDidMount() {
      // 检测是否登录
      checkIsLogin();
      const systemList = JSON.parse(localStorage.getItem('systemList'));
      this.setState({ systemList });
    }
    render() {
      const { systemList } = this.state;
      const props = type
        ? {
            type,
            style: { minHeight: 500, height: '80%' },
            linkElement: Link,
            img: require('../assets/error-403.png'),
          }
        : {};
      return (
        <div className="common-page-layout">
          <WrappedComponent systemList={systemList} {...props} />
        </div>
      );
    }
  }
  return CommonPageLayout;
};

export default CommonPageLayoutWrapper;
