import React from 'react';
import { Form, Input, Button } from 'antd';
import styles from './style.less';
import { connect } from 'dva';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
@connect(({ subsystem, loading }) => ({
  subsystemInfo: subsystem.subsystemInfo,
  currentStep: subsystem.currentStep
}))
export default class Step1 extends React.PureComponent {
  handleValidateForm = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'subsystem/saveSubsystemInfo',
        payload: values
      });
      dispatch({
        type: 'subsystem/saveStep',
        payload: 1
      });
    });
  }
  render() {
    const { form, subsystemInfo } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="系统名称">
          {getFieldDecorator('SystemName', {
            initialValue: subsystemInfo.SystemName,
            rules: [{
              required: true,
              message: '必填，最多6个字，不能重复',
              min: 1,
              max: 6,
              whitespace: true,
            },
          ],
          validateTrigger: 'onBlur',
          })(<Input placeholder="给子系统取个名字" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="职能简介">
          {getFieldDecorator('Summary', {
            initialValue: subsystemInfo.Summary,
            rules: [{ message: '最多25个字', max: 25 }],
            validateTrigger: 'onBlur',
          })(<Input placeholder="简单介绍子系统的用途" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="入口地址">
          {getFieldDecorator('HomeUrl', {
            initialValue: subsystemInfo.HomeUrl,
            rules: [
              { required: true, message: '必填，不能重复', whitespace: true },
            ],
            validateTrigger: 'onBlur',
          })(<Input placeholder="不需要带域名，/ 开头的路由链接" />)}
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 12, offset: 5 }}
        >
          <Button type="primary" htmlType="submit" onClick={this.handleValidateForm}>下一步</Button>
        </Form.Item>
      </Form>
    );
  }
}

