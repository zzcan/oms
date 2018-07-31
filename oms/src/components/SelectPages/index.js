import { Modal, Input, Divider, Table, Icon } from 'antd';
import styles from './index.less';
const Search = Input.Search;
const SelectPage = ({
  visible,
  onPageModalCancel,
  pageClassList,
  funcPageList,
  total,
  fetchListParams,
  onSearch,
  loading,
  onClickPageClass,
  currentSelectedPageInfo,
  currentSelectedPageClass,
  onSelectPage
}) => {
  const columns = [{
    title: '页面名称',
    dataIndex: 'PageName',
  }, {
    title: '页面链接',
    dataIndex: 'PageUrl',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => <a href="#" onClick={e => {e.preventDefault();onSelectPage(record)}}>选择</a>,
  }];
  const paginationConfig = {
    showQuickJumper: true,
    showSizeChanger: true,
    total,
    current: fetchListParams.pageIndex,
    pageSize: fetchListParams.pageSize,
    showTotal: total => `共有${total}条记录`
  };
  return (
    <Modal
      width={852}
      title={'选择功能页面'}
      visible={visible}
      onCancel={onPageModalCancel}
      footer={null}
      className={styles['page-modal']}
    >
      <div className={styles['left-menu']}>
        <div className={currentSelectedPageClass.Id === -1 ? `${styles['menu-item']} ${styles.selected}` : styles['menu-item']} onClick={() => onClickPageClass({Id: -1})}>全部页面</div>
        {
          pageClassList.map(v => (
            <div className={currentSelectedPageClass.Id === v.Id ? `${styles['menu-item']} ${styles.selected}` : styles['menu-item']} key={v.Id} onClick={() => onClickPageClass(v)}>{v.ClassName}</div>
          ))
        }
      </div>
      <div className={styles['right-table']}>
        <Search
          placeholder="请输入页面名称"
          onSearch={value => onSearch(value)}
        />
        <Table
          rowKey={record => record.Id}
          className={styles['page-table']}
          columns={columns}
          dataSource={funcPageList}
          pagination={paginationConfig}
          loading={loading}
        />
      </div>
    </Modal>
  )
}
export default SelectPage;
