import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps, Button } from 'antd';
import styles from './style.less';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { connect } from 'dva';

const { Step } = Steps;

@connect(({ subsystem, loading }) => ({
  subsystemInfo: subsystem.subsystemInfo,
  currentStep: subsystem.currentStep
}))
export default class BuildSystem extends PureComponent {

  render() {
    const { currentStep } = this.props;
    let stepContent = null;
    if(currentStep === 0) {
      stepContent = <Step1 />;
    }else if(currentStep === 1) {
      stepContent = <Step2 />;
    }else if(currentStep === 2) {
      stepContent = <Step3 />;
    }
    return (
      <div className={styles.container}>
        <Card bordered={false}>
          <Fragment>
            <Steps current={currentStep} className={styles.steps}>
              <Step title="填写基本信息" />
              <Step title="配置子系统菜单" />
              <Step title="配置页面权限" />
              <Step title="完成" />
            </Steps>
            <div className={styles.wrapper}>{stepContent}</div>
          </Fragment>
        </Card>
      </div>
    );
  }
}
