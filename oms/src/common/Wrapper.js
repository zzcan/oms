import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { getPathname } from '../utils/utils';
import styles from '../index.less';
const Wrapper = WrappedComponent => {
  @connect(({ global }) => ({
    currentUser: global.userInfo,
    collapsed: global.collapsed,
    routerData: global.routerData,
    menus: global.menus,
  }))
  class WrappedLayout extends Component {
    componentDidMount() {
      const { dispatch } = this.props;
      // 根据url的pathname获取子系统菜单
      let pathname = getPathname();
      dispatch({
        type: 'global/fetchMenus',
        payload: pathname,
      });
    }
    render() {
      const { menus } = this.props;
      if (!menus.length) {
        return <Spin size="large" className={styles['global_spin']} />;
      } else {
        return <WrappedComponent {...this.props} />;
      }
    }
  }

  return WrappedLayout;
};

export default Wrapper;
