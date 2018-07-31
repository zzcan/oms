import React, { Fragment, PureComponent } from 'react';
import {  Icon, Tag, Button, Table } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SelectPages from '../../../components/SelectPages/index';

const initParams = {
  classId: '',
  createDateSort: 0,
  pageIndex: 1,
  pageName: '',
  pageSize: 10,
  referenceNumSort: 0
}

function getFormatterMenus(menus) {
  let formatterMenus = [];
  menus.forEach(v => {
    if(v.children && v.children.length) {
      let subMenus = v.children.filter(val => !val.hideInMenu);
      formatterMenus = [...formatterMenus, ...subMenus];
    }else {
      formatterMenus.push(v);
    }
  })
  return formatterMenus;
}

@connect(({ subsystem, funcpage, loading }) => ({
  menus: subsystem.menus,
  pageClassList: funcpage.pageClassList,
  funcPageList: funcpage.funcPageList,
  total: funcpage.total,
  funcpageLoading: loading.effects['funcpage/queryFuncPageList']
}))
export default class Step2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageModalVisible: false,
      fetchListParams: initParams,
    }
  }
  showModal(type) {
    this.setState({
      [`${type}`]: true
    })
  }
  hideModal(type) {
    this.setState({
      [`${type}`]: false
    })
  }
  render() {
    const {
      menus,
      pageClassList,
      funcPageList,
      total,
      funcpageLoading
    } = this.props;
    const { pageModalVisible, fetchListParams } = this.state;
    const columns = [{
      title: '菜单页',
      dataIndex: 'name',
      width: '40%',
      className: styles['table-col'],
      render: (text, record) => {
        return (
          <div className={styles['menu-page-tag']}>
            <span>{text}</span>
            {/* <Tag color="#03A9F4">首页</Tag> */}
          </div>
        )
      }
    }, {
      title: '内页',
      dataIndex: 'action',
      width: '60%',
      render: (text, record) => {
        record.children = record.children && record.children.length ? record.children : [];
        return (
          <div className={styles['select-page-box']}>
          {
            record.children.filter(v => v).map(v => (
              <Tag closable onClose={e => console.log(e)}>客户详情</Tag>
            ))
          }
            <Tag className={styles['plus-icon']}><Icon type="plus" /></Tag>
          </div>
        )
      }
    }];
    let Menus = [
      {
        name: '新的菜单',
        icon: 'icon-tongji',
        pageId: 7,
        path: '/officialaccounts',
        pageName: '公众号',
        children: [
          {
            name: '菜单1',
            icon: '',
            path: '/officialaccounts',
            pageId: 7,
            pageName: '公众号',
            classId: 5
          }
        ]
      },
      {
        name: '新的菜单啊',
        icon: 'icon-gengduoneirong',
        pageId: 4,
        path: '/roleauthority',
        pageName: '角色权限'
      }
    ];
    const data = getFormatterMenus(Menus);
    return (
      <Fragment>
        <Table
          bordered
          rowKey={record => record.name}
          pagination={false}
          columns={columns}
          dataSource={data}
          size="middle"
        />
        <div className={styles['step2-btns']}>
          <Button>上一步</Button>
          <Button type="primary">提交</Button>
        </div>
        {/* <SelectPages
          visible={pageModalVisible}
          pageClassList={pageClassList}
          funcPageList={funcPageList}
          total={total}
          fetchListParams={fetchListParams}
          onSearch={this.handleSearch}
          onClickPageClass={this.handleClickPageClass}
          currentSelectedPageInfo={currentSelectedPageInfo}
          currentSelectedPageClass={currentSelectedPageClass}
          onPageModalCancel={this.handlePageModalCancel}
          onSelectPage={this.handleSelectPage}
          loading={funcpageLoading}
        /> */}
      </Fragment>
    )
  }
}
