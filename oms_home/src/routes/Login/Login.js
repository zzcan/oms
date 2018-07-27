import React from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Checkbox from 'antd/lib/checkbox';
const phoneReg = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/;

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className='login-form'>
        <FormItem>
          {getFieldDecorator('cellPhone', {
            validateTrigger: 'onBlur',
            rules: [{ required: true, message: '请输入正确的手机号!', pattern: phoneReg }],
          })(
            <Input suffix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入手机号" autoComplete="off" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('passWord', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input suffix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" autoComplete="off" />
          )}
        </FormItem>
        <FormItem className="login-btn-box">
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox className='checkbox'>记住密码</Checkbox>
          )}
          <Button loading={this.props.submitting} type="primary" htmlType="submit" className='login-form-button'>
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(NormalLoginForm);