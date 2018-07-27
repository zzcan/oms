import React from 'react';
import DocumentTitle from 'react-document-title';
import Login from './Login';
import '../../index.css';
import { loginOut, login } from '../../api/service';
import { getPageQuery } from '../../util';

class LoginLayout extends React.PureComponent {
  state = {
    submitting: false,
  }
  componentDidMount() {
    // 执行退出登录逻辑
    loginOut()
  }
  handleSubmit = (values) => {
    this.setState({ submitting: true });
    login(values).then(res => {
      this.setState({ submitting: false });
      // 登录成功
      if(res.data.Code === 0) {
        // 登录成功是否有returnUrl
        // 有就重定向
        // 没有就跳转选择子系统页面
        const params = getPageQuery();
        let { returnUrl } = params;
        if (returnUrl) {
          window.location.href = returnUrl;
        }else {
          const { history } = this.props;
          history.push('/list');
        }
      }
    }).catch(e => {
      this.setState({ submitting: false });
    })
  };
  render() {
    const { submitting } = this.state;
    return (
      <DocumentTitle title="登录">
        <div className="container">
          <div className="content">
            <div className="main">
              <div className="logo"></div>
              <div className="input-group">
                <div className="title">欢迎使用OMS</div>
                <div className="subtitle">请填写登录信息 please sign in</div>
                <Login onSubmit={this.handleSubmit} submitting={submitting} />
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default LoginLayout;
