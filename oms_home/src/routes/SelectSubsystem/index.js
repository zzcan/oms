import React from 'react';
import Wrapper from './Wrapper';
import Card from 'antd/lib/card';
import '../../index.css';
import DocumentTitle from 'react-document-title';

class SelectSubsystem extends React.PureComponent {
  handleGoSubsystem(url) {
    let { origin } = window.location;
    window.location.href = (`${origin}${url}`);
  }
  render() {
    const { systemList } = this.props;
    return (
      <DocumentTitle title="选择子系统">
        <div className="common-page-layout">
          <div className="list-content">
            <div className="title">选择一个子系统</div>
            <div className="list">
            {
              systemList.map(v => (
                <a key={v.Id} href={`${v.HomeUrl}`} className="link">
                  <Card>
                    <div className="name">{v.SystemName}</div>
                    <div className="desc">{v.Summary}</div>
                  </Card>
                </a>
              ))
            }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
export default Wrapper(SelectSubsystem);
