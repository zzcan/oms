import React, { PureComponent, Fragment } from 'react';
import { Modal, Form, Input, Select, Divider } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
export default Form.create()(
  class extends PureComponent {
    render() {
      const {
        visible,
        onCancel,
        onOk,
        form,
        pageClassList,
        onPageClassChange,
        onManageClass,
        isEdit,
        pageInfo = {},
        addPageSelectValue,
      } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      };
      let classInfo = pageClassList.find(v => v.Id === addPageSelectValue);
      let defaultValue = classInfo ? classInfo.ClassName : '';
      if (isEdit) {
        defaultValue = pageInfo.ClassName;
      }
      return (
        <Modal
          title={isEdit ? '编辑页面信息' : '添加新页面'}
          visible={visible}
          onOk={onOk}
          okText={isEdit ? '保存' : '确定'}
          onCancel={onCancel}
          className={styles['add-page-modal']}
        >
          <Form layout="vertical">
            <FormItem label="页面名称:" {...formItemLayout}>
              {getFieldDecorator('PageName', {
                rules: [
                  {
                    required: true,
                    message: '最多6个字，不能重复',
                    min: 1,
                    max: 6,
                    whitespace: true,
                  },
                ],
                initialValue: pageInfo.PageName,
              })(<Input placeholder="最多6个字" />)}
            </FormItem>
            <FormItem label="页面链接:" {...formItemLayout}>
              {getFieldDecorator('PageUrl', {
                rules: [
                  {
                    required: !isEdit,
                    message: '最多40个字符，/ 开头，不能重复，添加后不能修改',
                    pattern: /^\//,
                  },
                ],
              })(
                isEdit ? (
                  <span style={{ display: 'inline-block', marginTop: 4 }}>{pageInfo.PageUrl}</span>
                ) : (
                  <Input placeholder="不需要带域名，/ 开头的路由链接" />
                )
              )}
            </FormItem>
            <FormItem label="分类:" {...formItemLayout}>
              <Fragment>
                <Select
                  value={defaultValue}
                  style={{ width: 120 }}
                  placeholder="请选择分类"
                  onSelect={onPageClassChange}
                >
                  {pageClassList.map(v => <Option key={v.Id}>{v.ClassName}</Option>)}
                </Select>
                <span className={styles['class-manage']} onClick={onManageClass}>
                  管理
                </span>
              </Fragment>
            </FormItem>
            <FormItem label="功能描述:" {...formItemLayout}>
              {getFieldDecorator('Description', {
                rules: [{ message: '最多20个字', max: 20 }],
                initialValue: pageInfo.Description,
              })(<Input placeholder="最多20个字" />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);
