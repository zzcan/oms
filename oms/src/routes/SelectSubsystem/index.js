import React from 'react';
import CommonPageLayoutWrapper from '../../layouts/CommonPageLayout';
import { Card } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';

class SelectSubsystem extends React.PureComponent {
  handleGoSubsystem(url) {
    let { origin } = location;
    location.href = `${origin}${url}`;
  }
  render() {
    const { systemList } = this.props;
    let { origin } = location;
    return (
      <div className={styles.content}>
        <div className={styles.title}>选择一个子系统</div>
        <div className={styles.list}>
          {systemList.map(v => (
            <a key={v.Id} href={`${origin}${v.HomeUrl}`} className={styles.link}>
              <Card>
                <div className={styles.name}>{v.SystemName}</div>
                <div className={styles.desc}>{v.Remark}</div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    );
  }
}
export default CommonPageLayoutWrapper(SelectSubsystem);
