import React from 'react';
import Spin from 'antd/lib/spin';
import { getSubsystemList } from '../../api/service';

const Wrapper = (WrappedComponent) => {
  class CommonPageLayout extends React.Component {
    state = {
      systemList: []
    }
    componentDidMount() {
      //获取子系统列表
      getSubsystemList().then(res => {
        if(res.data.Code === 0) {
          const systemList = res.data.Data;
          if(systemList.length === 1) {
            // 可访问的子系统只有一个则直接跳转子系统页面
            const { origin } = window.location;
            const { HomeUrl } = systemList[0];
            window.location.href = `${origin}${HomeUrl}`;
            return;
          }
          this.setState({systemList});
        }
      })
    }
    render() {
      const { systemList } = this.state;
      if(systemList.length > 1) {
        return <WrappedComponent systemList={systemList} />
      }else {
        return <Spin size="large" />;
      }
      
    }
  }
  return CommonPageLayout;
}

export default Wrapper;
