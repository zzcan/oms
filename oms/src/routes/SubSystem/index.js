import { Table, Button, Popconfirm, Icon, Divider } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { EditableFormRow, EditableCell } from 'components/EditTableCell/index';
import { routerRedux } from 'dva/router';

@connect(({ subsystem, loading }) => ({
  subsystemList: subsystem.subsystemList,
  total: subsystem.total,
  fetchListParams: subsystem.fetchListParams,
  loading: loading.effects['subsystem/querySubsystemList'],
}))
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '子系统名称',
        dataIndex: 'SystemName',
        editable: true,
      },
      {
        title: '页面数量',
        dataIndex: 'PageNum',
      },
      {
        title: '职能简介',
        dataIndex: 'Summary',
        editable: true,
      },
      {
        title: '入口地址',
        dataIndex: 'HomeUrl',
        editable: true,
      },
      {
        title: '使用人数',
        dataIndex: 'UseNum',
        sorter: true,
      },
      {
        title: '创建时间',
        dataIndex: 'CreateDate',
        sorter: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <span>
              <a href="javascript:;" onClick={() => this.handleEditPage(record)}>
                配置菜单
              </a>
              {record.PageNum == 0 ? (
                <Fragment>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确定删除该子系统吗?"
                    onConfirm={() => this.handleDelete(record.Id)}
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                </Fragment>
              ) : null}
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'subsystem/querySubsystemList',
    });
  }

  handleDelete(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'subsystem/delSubsystem',
      payload: {Id: id}
    })
  };

  handleAdd = () => {
    const { dispatch } = this.state;
    dispatch(routerRedux.push('/subsystem/buildsystem'));
  };

  handleSave = ({Id, Summary, HomeUrl}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'subsystem/changeSubsystemInfo',
      payload: {
        Id,
        Summary,
        HomeUrl
      }
    })
  };

  // 列表分页、排序、筛选操作回调
  handleTableChange = ({ current, pageSize }, { ClassName }, { columnKey, order }) => {
    const { dispatch } = this.props;
    const fetchListParams = {
      pageIndex: current,
      pageSize,
      createDateSort: columnKey == 'CreateDate' ? (order == 'ascend' ? 1 : 2) : 0,
      useNumSort: columnKey == 'UseNum' ? (order == 'ascend' ? 1 : 2) : 0,
    };
    dispatch({
      type: 'subsystem/saveFetchParams',
      payload: fetchListParams
    });
    dispatch({
      type: 'subsystem/querySubsystemList',
    });
  }

  render() {
    const { loading, fetchListParams, total, subsystemList } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    const paginationConfig = {
      showQuickJumper: true,
      showSizeChanger: true,
      total,
      current: fetchListParams.pageIndex,
      pageSize: fetchListParams.pageSize,
    };
    return (
      <div className={styles.content}>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          <Icon type="plus" />
          新建子系统
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          rowKey={record => record.Id}
          dataSource={subsystemList}
          columns={columns}
          loading={loading}
          pagination={paginationConfig}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default EditableTable;
