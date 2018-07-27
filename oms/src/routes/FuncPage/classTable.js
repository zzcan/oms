import { Table, Input, Popconfirm, message } from 'antd';
import styles from './index.less';
import { EditableFormRow, EditableCell } from 'components/EditTableCell/index';
const Search = Input.Search;

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'ClassName',
        editable: true,
      },
      {
        title: '页面数量',
        dataIndex: 'PageNum',
        sorter: (a, b) => a.PageNum - b.PageNum,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Popconfirm title="确定删除该分类?" onConfirm={() => this.handleDelete(record.Id)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        ),
      },
    ];
  }

  handleDelete = id => {
    const { onDelClass } = this.props;
    onDelClass(id);
  };

  handleSave = row => {
    const { onSaveClassName } = this.props;
    onSaveClassName({ ClassId: row.Id, ClassName: row.ClassName });
  };
  addClass = value => {
    const { onAddClass } = this.props;
    if (!value) return message.error('分类名不能为空');
    if (value.length > 6) return message.error('不能超过6个字');
    onAddClass(value);
  };
  render() {
    const { dataSource } = this.props;
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
    return (
      <div className={styles['class-table-box']}>
        <Table
          components={components}
          rowKey={record => record.Id}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          columns={columns}
        />
        <div className={styles['add-input']}>
          <Search placeholder="最多6个字" onSearch={this.addClass} enterButton="添加" />
        </div>
      </div>
    );
  }
}
