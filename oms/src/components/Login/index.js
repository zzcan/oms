import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import styles from './index.less';
import { phoneReg } from '../../utils/utils';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
        <FormItem>
          {getFieldDecorator('cellPhone', {
            validateTrigger: 'onBlur',
            rules: [{ required: true, message: '请输入正确的手机号!', pattern: phoneReg }],
          })(
            <Input
              suffix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入手机号"
              autoComplete="off"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('passWord', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input
              suffix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请输入密码"
              autoComplete="off"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: false,
          })(<Checkbox className={styles.checkbox}>记住密码</Checkbox>)}
          <Button
            loading={this.props.submitting}
            type="primary"
            htmlType="submit"
            className={styles['login-form-button']}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(NormalLoginForm);
