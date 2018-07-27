import React, { Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import Login from '../routes/User/Login';

// function getLoginPathWithRedirectPath() {
//   const params = getPageQuery();
//   const { redirect } = params;
//   return getQueryPath('/user/login', {
//     redirect,
//   });
// }

class UserLayout extends React.PureComponent {
  getPageTitle() {
    return '登录';
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <Login />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
