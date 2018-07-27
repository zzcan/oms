import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Divider,
  Input,
  Button,
  Icon,
  Modal,
  Popover,
  Select,
  Popconfirm,
  message,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import AddPage from './addPage';
import EditableTable from './classTable';
import { delCharacterT } from '../../utils/utils';
const Search = Input.Search;
const Option = Select.Option;

// 初始化获取页面列表请求参数
const initListParams = {
  pageName: '',
  classId: '',
  createDateSort: 0,
  referenceNumSort: 0,
  pageIndex: 1,
  pageSize: 10,
};

@connect(({ funcpage, loading }) => ({
  funcPageList: funcpage.funcPageList,
  total: funcpage.total,
  batchModalVisible: funcpage.batchModalVisible,
  loading: loading.effects['funcpage/queryFuncPageList'],
  batchModalConfirmLoading: funcpage.batchModalConfirmLoading,
  pageClassList: funcpage.pageClassList,
  pageClassTotal: funcpage.pageClassTotal,
  addModalVisible: funcpage.addModalVisible,
  classModalVisible: funcpage.classModalVisible,
}))
class FuncPage extends PureComponent {
  state = {
    data: [],
    fetchListParams: initListParams,
    fetchClassParams: {
      pageIndex: '',
      pageSize: '',
    },
    pagination: {
      showQuickJumper: true,
      showSizeChanger: true,
    },
    selectedRowKeys: [],
    batchModalConfig: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { fetchListParams, fetchClassParams } = this.state;
    dispatch({
      type: 'funcpage/queryFuncPageList',
      payload: fetchListParams,
    });
    dispatch({
      type: 'funcpage/queryPageClass',
      payload: fetchClassParams,
    });
  }

  // 搜索
  handleSearch(value) {
    const fetchListParams = {
      ...initListParams,
      pageName: value,
    };
    this.fetchList(fetchListParams);
  }

  // 列表分页、排序、筛选操作回调
  handleTableChange = ({ current, pageSize }, { ClassName }, { columnKey, order }) => {
    let { fetchListParams } = this.state;
    fetchListParams = {
      ...fetchListParams,
      pageIndex: current,
      pageSize,
      classId: ClassName ? ClassName.join() : '',
      createDateSort: columnKey == 'CreateDate' ? (order == 'ascend' ? 1 : 2) : 0,
      referenceNumSort: columnKey == 'ReferenceNum' ? (order == 'ascend' ? 1 : 2) : 0,
    };
    this.setState({
      fetchListParams,
    });
    this.fetchList(fetchListParams);
  };
  fetchList(fetchListParams) {
    const { dispatch } = this.props;
    dispatch({
      type: 'funcpage/queryFuncPageList',
      payload: fetchListParams,
    });
  }

  // 列表选择的回调
  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys: selectedRowKeys.length > 0 ? selectedRowKeys : [],
    });
  };

  // 批量删除
  handleBatchDel = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    const batchModalConfig = {
      batchModalTitle: '批量删除',
      batchModalType: 'del',
      batchModalText: `确定要删除选定的${selectedRowKeys.length}个页面吗？`,
    };
    this.setState({
      batchModalConfig,
    });
    dispatch({
      type: 'funcpage/changeModalVisible',
      payload: {
        type: 'batchModalVisible',
        flag: true,
      },
    });
  };

  // 批量修改分类
  handleBatchClass = (className, id) => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    const batchModalConfig = {
      batchModalTitle: '批量修改分类',
      batchModalType: 'class',
      batchModalText: `确定要将选中的${
        selectedRowKeys.length
      }个页面移到分类：${className} 下面吗？`,
    };
    this.setState({
      batchModalConfig,
      selectClassId: Number(id),
    });
    dispatch({
      type: 'funcpage/changeModalVisible',
      payload: {
        type: 'batchModalVisible',
        flag: true,
      },
    });
  };

  // 批量弹窗点击确定的回调
  handleBatchOk = () => {
    const {
      batchModalConfig: { batchModalType },
    } = this.state;
    this.setState({ selectedRowKeys: [] });
    if (batchModalType == 'del') {
      // 批量删除
      this.comfirmBatchDel();
    } else {
      //批量分类
      this.comfirmBatchClass();
    }
  };

  // 批量弹窗点击取消的回调
  handleModalCancel(type) {
    const { dispatch } = this.props;
    dispatch({
      type: 'funcpage/changeModalVisible',
      payload: {
        type,
        flag: false,
      },
    });
  }

  // 确定删除
  comfirmBatchDel(type, id) {
    const { dispatch } = this.props;
    const { selectedRowKeys, fetchListParams } = this.state;
    dispatch({
      type: 'funcpage/delFuncPage',
      payload: { Id: type ? id : selectedRowKeys.join(), fetchListParams },
    });
  }

  // 确定批量修改分类
  comfirmBatchClass() {
    const { dispatch } = this.props;
    const { selectedRowKeys, selectClassId } = this.state;
    dispatch({
      type: 'funcpage/batchClass',
      payload: {
        Id: selectedRowKeys.join(),
        ClassId: Number(selectClassId),
        fetchListParams: initListParams,
      },
    });
  }

  // 批量修改分类下拉选择
  handlePageClassChange = (value, option) => {
    //选择分类后显示弹窗
    this.handleBatchClass(value, option.key);
  };

  handleAddPage = () => {
    this.showModal('addModalVisible');
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleComfirmAddPage = () => {
    const { dispatch } = this.props;
    const { addPageSelectValue, isEdit, currentPageInfo } = this.state;
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (isEdit) {
        dispatch({
          type: 'funcpage/editPageInfo',
          payload: {
            fetchListParams: initListParams,
            pageInfo: {
              Id: currentPageInfo.Id,
              Description: values.Description,
              ClassId: addPageSelectValue,
            },
          },
        });
      } else {
        dispatch({
          type: 'funcpage/addPage',
          payload: {
            fetchListParams: initListParams,
            ...values,
            ClassId: addPageSelectValue,
          },
        });
      }
      this.setState({ addPageSelectValue: '' });
      form.resetFields();
      this.handleModalCancel('addModalVisible');
    });
  };

  manageClass = () => {
    this.showModal('classModalVisible');
  };
  showModal = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'funcpage/changeModalVisible',
      payload: {
        type,
        flag: true,
      },
    });
  };
  handleSave = pageClassItem => {
    const { dispatch } = this.props;
    dispatch({
      type: 'funcpage/changePageClassName',
      payload: {
        pageClassItem,
        fetchClassParams: this.state.fetchClassParams,
      },
    });
  };

  handleAddClass = className => {
    const { dispatch } = this.props;
    dispatch({
      type: 'funcpage/addClass',
      payload: {
        className,
        fetchClassParams: this.state.fetchClassParams,
      },
    });
  };

  handleDelClass = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'funcpage/delClass',
      payload: {
        id,
        fetchClassParams: this.state.fetchClassParams,
      },
    });
  };
  handleEditPage(pageInfo) {
    this.showModal('addModalVisible');
    this.setState({
      currentPageInfo: pageInfo,
      isEdit: true,
    });
  }

  handleAddPageChange = key => {
    const { isEdit, currentPageInfo } = this.state;
    const { pageClassList } = this.props;
    if (isEdit) {
      let ClassName = pageClassList.find(v => v.Id === Number(key))
        ? pageClassList.find(v => v.Id === Number(key)).ClassName
        : '';
      this.setState({
        currentPageInfo: {
          ...currentPageInfo,
          ClassId: Number(key),
          ClassName,
        },
      });
    }
    this.setState({ addPageSelectValue: Number(key) });
  };
  render() {
    const {
      funcPageList,
      total,
      loading,
      batchModalVisible,
      batchModalConfirmLoading,
      pageClassList,
      addModalVisible,
      classModalVisible,
    } = this.props;
    const {
      fetchListParams,
      pagination,
      selectedRowKeys,
      batchModalConfig,
      currentPageInfo,
      isEdit,
    } = this.state;

    const filters = pageClassList.map(v => {
      return {
        text: v.ClassName,
        value: v.ClassId
      }
    })
    const columns = [
      {
        title: '页面名称',
        dataIndex: 'PageName',
      },
      {
        title: '分类',
        dataIndex: 'ClassName',
        render: (text, record) => record.ClassId === 0 ? '-' : record.ClassName,
        filters,
      },
      {
        title: '功能描述',
        dataIndex: 'Description',
        render: Description => Description || '-'
      },
      {
        title: '页面链接',
        dataIndex: 'PageUrl',
      },
      {
        title: '引用次数',
        dataIndex: 'ReferenceNum',
        sorter: true,
      },
      {
        title: '添加时间',
        dataIndex: 'CreateDate',
        render: CreateDate => delCharacterT(CreateDate),
        sorter: true,
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.handleEditPage(record)}>
              编辑
            </a>
            {record.ReferenceNum == 0 ? (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定删除该页面?"
                  onConfirm={() => this.comfirmBatchDel('sigle', `${record.Id}`)}
                >
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              </Fragment>
            ) : null}
          </span>
        ),
      },
    ];

    const paginationConfig = {
      ...pagination,
      total,
      current: fetchListParams.pageIndex,
      pageSize: fetchListParams.pageSize,
    };

    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.ReferenceNum > 0,
      }),
    };

    // 批量删除弹窗
    const batchModalContent = (
      <Modal
        title={batchModalConfig.batchModalTitle}
        visible={batchModalVisible}
        onOk={this.handleBatchOk}
        confirmLoading={batchModalConfirmLoading}
        onCancel={() => this.handleModalCancel('batchModalVisible')}
      >
        <p>{batchModalConfig.batchModalText}</p>
      </Modal>
    );

    const classManageContent = (
      <Modal
        className={styles['class-modal']}
        title="页面分类管理"
        footer={null}
        visible={classModalVisible}
        onCancel={() => this.handleModalCancel('classModalVisible')}
      >
        <EditableTable
          dataSource={pageClassList}
          onSaveClassName={this.handleSave}
          onAddClass={this.handleAddClass}
          onDelClass={this.handleDelClass}
        />
      </Modal>
    );

    // 批量修改分类popover
    const content = (
      <Select style={{ width: 120 }} placeholder="请选择分类" onSelect={this.handlePageClassChange}>
        {pageClassList.map(v => (
          <Option value={v.ClassName} key={v.Id}>
            {v.ClassName}
          </Option>
        ))}
      </Select>
    );

    return (
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <Button type="primary" onClick={this.handleAddPage}>
              <Icon type="plus" />添加新页面
            </Button>
            {selectedRowKeys.length ? (
              <Fragment>
                <Button style={{ marginLeft: 10 }} onClick={this.handleBatchDel}>
                  批量删除
                </Button>
                <Popover content={content} trigger="click" placement="bottom">
                  <Button style={{ marginLeft: 10 }}>批量修改分类</Button>
                </Popover>
              </Fragment>
            ) : null}
          </div>
          <Search
            placeholder="请输入页面名称"
            onSearch={value => this.handleSearch(value)}
            style={{ width: 200 }}
          />
        </div>
        <Table
          columns={columns}
          rowKey={record => record.Id}
          rowSelection={rowSelection}
          dataSource={funcPageList}
          pagination={paginationConfig}
          loading={loading}
          onChange={this.handleTableChange}
        />
        <AddPage
          wrappedComponentRef={this.saveFormRef}
          isEdit={isEdit}
          visible={addModalVisible}
          onCancel={() => this.handleModalCancel('addModalVisible')}
          onOk={this.handleComfirmAddPage}
          pageClassList={pageClassList}
          onManageClass={this.manageClass}
          pageInfo={currentPageInfo}
          onPageClassChange={this.handleAddPageChange}
          addPageSelectValue={this.state.addPageSelectValue}
        />
        {batchModalContent}
        {classManageContent}
      </div>
    );
  }
}

export default FuncPage;
