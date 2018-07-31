import React, { Fragment, PureComponent } from 'react';
import { Divider, List, Icon, Tag, Button, Row, Col, Input, Modal, message, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import iconStyles from '../../../assets/fonts/iconfonts.less';
import SelectIcon from '../../../components/SelectIcon/index';
import SelectPages from '../../../components/SelectPages/index';


const initParams = {
  classId: '',
  createDateSort: 0,
  pageIndex: 1,
  pageName: '',
  pageSize: 10,
  referenceNumSort: 0
}

@connect(({ subsystem, funcpage, loading }) => ({
  menus: subsystem.menus,
  pageClassList: funcpage.pageClassList,
  funcPageList: funcpage.funcPageList,
  total: funcpage.total,
  iconList: subsystem.iconList,
  funcpageLoading: loading.effects['funcpage/queryFuncPageList']
}))
export default class Step2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      iconModalVisible: false,
      addMainMenuModalVisible: false,
      currentSelectedIconInfo: {},
      currentSelectedPageInfo: {},
      currentSelectedPageClass: {Id: -1},

      currentSubSelectedPageInfo: {},
      currentSubSelectedPageClass: {Id: -1},

      pageModalVisible: false,
      fetchListParams: initParams,

      currentEditMenu: {}
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'subsystem/queryIcons'
    })
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

  handleIconModalCancel = () => {
    this.hideModal('iconModalVisible');
  }

  handlePageModalCancel = () => {
    if(this.state.pageModalType) {
      this.setState({
        currentSubSelectedPageClass: {Id: -1},
        currentSubSelectedPageInfo: {},
        fetchListParams: initParams,
        pageModalType: '',
        currentItem: ''
      });
    }
    this.hideModal('pageModalVisible');
  }

  handleAddModalCancel = () => {
    // 取消则重置参数
    this.menuNameInput.input.value = '';
    this.setState({
      currentSelectedIconInfo: {},
      currentSelectedPageClass: {Id: -1},
      currentSelectedPageInfo: {},
      fetchListParams: initParams,
      isEditMenu: false,
      currentEditMenu: {}
    });
    this.hideModal('addMainMenuModalVisible');
  }

  handleAddModalOk = () => {
    const menuName = this.menuNameInput.input.value;
    const { currentSelectedIconInfo, currentSelectedPageInfo } = this.state;
    let { menus, dispatch } = this.props;
    let { isEditMenu, currentEditMenu } = this.state;
    // 校验菜单名称
    if(!this.validateInput(0)) return;
    if(!currentSelectedIconInfo.Url) return message.error('请选择菜单图标！');
    if(!currentSelectedPageInfo.PageUrl) return message.error('请选择菜单页面！');
    if(isEditMenu) {
      menus = menus.map(v => {
        if(v.name == currentEditMenu.name) {
          return {
            ...v,
            name: menuName,
            icon: currentSelectedIconInfo.Url,
            pageId: currentSelectedPageInfo.Id,
            path: currentSelectedPageInfo.PageUrl,
            pageName: currentSelectedPageInfo.PageName
          }
        }
        return v;
      })
    }else {
      menus.push({
        name: menuName,
        icon: currentSelectedIconInfo.Url,
        pageId: currentSelectedPageInfo.Id,
        path: currentSelectedPageInfo.PageUrl,
        pageName: currentSelectedPageInfo.PageName
      });
    }
    dispatch({
      type: 'subsystem/saveMenus',
      payload: menus
    });
    this.handleAddModalCancel();
  }

  validateInput(type) {
    let value = '';
    if(type == 0) {
      value = this.menuNameInput.input.value;
    }else if(type == 1) {
      value = this.subMenuInput.input.value;
    }
    if(value === '') {
      message.error('菜单名称不能为空！');
      return false;
    }
    if(value.length > 6) {
      message.error('菜单名称不能超过6个字！');
      return false;
    }
    return true;
  }

  handleSelectIcon = (iconInfo) => {
    this.setState({
      currentSelectedIconInfo: iconInfo
    });
    this.hideModal('iconModalVisible');
  }

  handleSelectPage = (pageInfo) => {
    const { pageModalType, currentItem } = this.state;
    if(pageModalType) {
      if(currentItem) {
        //子菜单修改页面 非添加子菜单时的修改
        const { menus, dispatch } = this.props;
        const newMenus = [...menus];
        newMenus.forEach(v => {
          if(v.name == currentItem.menuName) {
            v.children.forEach(val => {
              if(val.name == currentItem.subMenuName) {
                val.pageName = pageInfo.PageName;
                val.pageId = pageInfo.Id;
                val.classId = pageInfo.ClassId;
                val.path = pageInfo.PageUrl;
              }
            })
          }
        })
        dispatch({
          type: 'subsystem/saveMenus',
          payload: newMenus
        });
      }else {
        this.setState({
          currentSubSelectedPageInfo: pageInfo
        });
      }
    }else {
      this.setState({
        currentSelectedPageInfo: pageInfo
      });
    }
    this.hideModal('pageModalVisible');
  }

  showPageModal(type = '', currentItem = '') {
    this.setState({
      pageModalType: type,
      currentItem
    });
    const { dispatch } = this.props;
    const { fetchListParams, currentSelectedPageClass } = this.state;
    // currentSelectedPageClass 根据当前选择的页面得到当前选中的分类
    dispatch({
      type: 'funcpage/queryFuncPageList',
      payload: fetchListParams
    });
    dispatch({
      type: 'funcpage/queryPageClass',
      payload: {
        pageIndex: 0,
        pageSize: 0
      }
    });
    this.showModal('pageModalVisible');
  }

  handleSearch = (value) => {
    const { dispatch } = this.props;
    const fetchListParams = {
      classId: '',
      createDateSort: 0,
      pageIndex: 1,
      pageName: value,
      pageSize: 10,
      referenceNumSort: 0
    };
    this.setState({
      fetchListParams,
    });
    dispatch({
      type: 'funcpage/queryFuncPageList',
      payload: fetchListParams
    })
  }

  handleClickPageClass = (classInfo) => {
    const { dispatch } = this.props;
    const { pageModalType } = this.props;
    const fetchListParams = {
      classId: classInfo.Id === -1 ? '' : `${classInfo.Id}`,
      createDateSort: 0,
      pageIndex: 1,
      pageName: '',
      pageSize: 10,
      referenceNumSort: 0
    };
    if(pageModalType) {
      this.setState({
        fetchListParams,
        currentSelectedPageClass: classInfo,
      });
    }else {
      this.setState({
        fetchListParams,
        currentSubSelectedPageClass: classInfo,
      });
    }
    dispatch({
      type: 'funcpage/queryFuncPageList',
      payload: fetchListParams
    })
  }

  // 添加子菜单操作
  handleAddSubMenu(menuName) {
    let { menus, dispatch } = this.props;
    let flag = false;
    menus.forEach(v => {
      if(v.children) {
        v.children.forEach(val => {
          if(val.isAdd) flag = true;
        })
      }
    });
    if(flag) return message.error('请完成添加操作后再继续添加！');

    menus = menus.map(v => {
      if(v.name == menuName) {
        const menuItem = {
          name: '',
          isAdd: true,
        }
        return {
          ...v,
          children: v.children ? [...v.children, menuItem] : [menuItem],
        }
      }
      return v;
    });
    dispatch({
      type: 'subsystem/saveMenus',
      payload: menus
    });
  }

  // 确认添加子菜单
  comfirmAddSubMenu(menuName) {
    let { menus, dispatch } = this.props;
    const { currentSubSelectedPageInfo  } = this.state;
    const subMenuName = this.subMenuInput.input.value;
    if(!this.validateInput(1)) return;
    if(!currentSubSelectedPageInfo.PageUrl) return message.error('请选择页面！');
    if(menuName == subMenuName) return message.error('主菜单和子菜单名称不能相同！');
    let menu = menus.find(v => v.name == menuName);
    if(menu.children && menu.children.find(v => v.name == subMenuName)) return message.error('子菜单名称不能重复！');
    const children = menu.children.map(v => {
      if(v.isAdd) {
        return {
          name: subMenuName,
          icon: '',
          path: currentSubSelectedPageInfo.PageUrl,
          pageId: currentSubSelectedPageInfo.Id,
          pageName: currentSubSelectedPageInfo.PageName,
          classId: currentSubSelectedPageInfo.ClassId
        };
      }
      return v;
    });
    menus = menus.map(v => {
      if(v.name == menuName) {
        return {
          ...v,
          children
        };
      }
      return v;
    });
    this.setState({
      currentSubSelectedPageClass: {Id: -1},
      currentSubSelectedPageInfo: {}
    })
    dispatch({
      type: 'subsystem/saveMenus',
      payload: menus
    });
  }

  // 子菜单显示内容
  listItem = (item, currentSubSelectedPageInfo, currentItem) => {
    if(item.isAdd) {
      if(currentSubSelectedPageInfo.PageUrl) {
        return (
          <Fragment>
            <Tag color="#03A9F4">{currentSubSelectedPageInfo.PageName}</Tag>
            <Divider type="vertical" />
            <span className={styles['change']} onClick={() => this.showPageModal('subMenu')}>修改</span>
          </Fragment>
        )
      }
      return <span className={styles['change']} onClick={() => this.showPageModal('subMenu')}>选择页面</span>
    }else {
      return (
        <Fragment>
          <Tag color="#03A9F4">{item.pageName}</Tag>
          <Divider type="vertical" />
          <span className={styles['change']} onClick={() => this.showPageModal('subMenu', currentItem)}>修改</span>
        </Fragment>
      )
    }
  }

  // 删除子菜单
  delSubMenu(menuName, subMenuName) {
    const { menus, dispatch } = this.props;
    const newMenus = [...menus];
    newMenus.forEach(v => {
      if(v.name == menuName) {
        let index = v.children.findIndex(val => val.name == subMenuName);
        if(index > -1) {
          v.children.splice(index, 1);
        }
      }
    });
    dispatch({
      type: 'subsystem/saveMenus',
      payload: newMenus
    });
  }

  // 取消添加子菜单
  cancelAddSubMenu(menuName) {
    const { menus, dispatch } = this.props;
    const newMenus = [...menus];
    newMenus.forEach(v => {
      if(v.name == menuName) {
        let index = v.children.findIndex(val => val.isAdd);
        if(index > -1) {
          v.children.splice(index, 1);
        }
      }
    });
    this.setState({
      currentSubSelectedPageClass: {Id: -1},
      currentSubSelectedPageInfo: {}
    })
    dispatch({
      type: 'subsystem/saveMenus',
      payload: newMenus
    });
  }

  // 删除一级菜单
  handleDelMenu(menuName) {
    let { menus, dispatch } = this.props;
    menus = menus.filter(v => v.name != menuName);
    dispatch({
      type: 'subsystem/saveMenus',
      payload: menus
    });
  }

  // 编辑主菜单
  handleEditMenu(menuInfo) {
    const { iconList } = this.props;
    let iconInfo = iconList.find(v => v.Url == menuInfo.icon);
    this.menuNameInput.input.value = menuInfo.name;
    this.setState({
      isEditMenu: true,
      currentEditMenu: menuInfo,
      currentSelectedIconInfo: { Id: iconInfo ? iconInfo.Id : -1, Url: menuInfo.icon },
      currentSelectedPageInfo: { PageName: menuInfo.pageName, Id: menuInfo.pageId, PageUrl: menuInfo.path }
    });
    this.showModal('addMainMenuModalVisible')
  }

  // 下一步
  handleNextStep = () => {
    const { menus, dispatch } = this.props;
    if(!menus.length)  return message.error('请配置菜单！')
    let flag = false;
    menus.forEach(v => {
      if(v.children) {
        v.children.forEach(val => {
          if(val.isAdd) flag = true;
        })
      }
    });
    if(flag) return message.error('请完成添加子菜单操作后再继续！');

    dispatch({
      type: 'subsystem/saveStep',
      payload: 2
    });
  }

  render() {
    const {
      addMainMenuModalVisible,
      iconModalVisible,
      currentSelectedIconInfo,
      currentSelectedPageInfo,
      currentSelectedPageClass,

      currentSubSelectedPageInfo,
      currentSubSelectedPageClass,

      pageModalVisible,
      fetchListParams,
      pageModalType,

      isEditMenu,
      currentEditMenu
    } = this.state;
    const {
      menus,
      iconList,
      pageClassList,
      funcPageList,
      total,
      funcpageLoading
    } = this.props;
    const addMenuModal = (
      <Modal
          title={isEditMenu ? '编辑主菜单' : '添加主菜单'}
          visible={addMainMenuModalVisible}
          onOk={this.handleAddModalOk}
          okText={'确定'}
          onCancel={this.handleAddModalCancel}
          className={styles['add-menu-modal']}
        >
          <Row>
            <Col span={5}><span className={styles['required']}>菜单名称:</span></Col>
            <Col span={12}>
              <Input placeholder="最多6个字" ref={ref => this.menuNameInput=ref} onBlur={() => this.validateInput(0)} />
            </Col>
          </Row>
          <Row>
            <Col span={5}><span className={styles['required']}>图标:</span></Col>
            <Col span={12}>
              {
                currentSelectedIconInfo.Url ?
                <i className={`${iconStyles.iconfont} ${iconStyles[currentSelectedIconInfo.Url]}`} onClick={() => this.showModal('iconModalVisible')} style={{ cursor: 'pointer'}}></i>
                :
                <Icon type="question-circle" onClick={() => this.showModal('iconModalVisible')} style={{ fontSize: 16, cursor: 'pointer'}}/>
              }

            </Col>
          </Row>
          <Row>
            <Col span={5}><span>菜单链接:</span></Col>
            <Col span={12}>
            {
              currentSelectedPageInfo.PageName != undefined  ?
              <Fragment>
                <Tag color="#03A9F4">{currentSelectedPageInfo.PageName}</Tag>
                <Divider type="vertical" />
                <span className={styles['select-page-btn']} onClick={() => this.showPageModal()}>修改</span>
              </Fragment>
              :
              <span className={styles['select-page-btn']} onClick={() => this.showPageModal()}>选择页面</span>
            }
            </Col>
          </Row>
          <Row>
            <Col span={5}></Col>
            <Col span={16} style={{color: '#bdbdbd'}}>如果主菜单下面没有子菜单，则需要为主菜单指定一个链接；在主菜单下增加子菜单后，主菜单链接会自动生效</Col>
          </Row>
        </Modal>
    )

    return (
      <Fragment>
        {
          menus.map(v => (
            <div className={styles['item']} key={v.name}>
              <div className={styles['item-header']}>
                <div className={styles['left']}>
                  <i className={`${iconStyles.iconfont} ${iconStyles[v.icon]}`}></i>
                  <span>{v.name}</span>
                </div>
                <div className={styles['right']}>
                  <Tooltip title="添加子菜单">
                    <Icon type="plus" onClick={() => this.handleAddSubMenu(v.name)} />
                  </Tooltip>
                  <Tooltip title="编辑">
                    <Icon type="edit" onClick={() => this.handleEditMenu(v)} />
                  </Tooltip>
                  <Tooltip title="删除">
                    <Icon type="delete" onClick={() => this.handleDelMenu(v.name)} />
                  </Tooltip>
                </div>
              </div>
              <Divider type="horizontal"/>
              {
                v.children && v.children.length ?
                <List
                  className={styles['list-item']}
                  size="small"
                  bordered
                  dataSource={v.children}
                  renderItem={item => (
                    <List.Item>
                      <div className={styles['list-item-name']}>
                        {
                          item.isAdd ?
                          <Input ref={ref=>this.subMenuInput=ref} style={{width: '80%', height: 22}} onBlur={() => this.validateInput(1)} />
                          :
                          <span className={styles['name-wrapper']}>{item.name}</span>
                        }
                      </div>
                      <div className={styles['list-item-page']}>
                        {this.listItem(item, currentSubSelectedPageInfo, {menuName: v.name, subMenuName: item.name})}
                      </div>
                      <div className={styles['action']}>
                        {
                          item.isAdd ?
                            <Fragment>
                              <span className={styles['change']} onClick={() => this.comfirmAddSubMenu(v.name)}>添加</span>
                              <span className={styles['change']} onClick={() => this.cancelAddSubMenu(v.name)}>取消</span>
                            </Fragment>
                            :
                            <Tooltip title="删除">
                              <Icon className={styles['delete-icon']} onClick={() => this.delSubMenu(v.name, item.name)} type="delete" />
                            </Tooltip>
                        }
                      </div>
                    </List.Item>
                  )}
                />
                :
                null
              }
            </div>
          ))
        }

        <div className={styles['step2-btns']}>
          <Button type="primary" onClick={() => this.showModal('addMainMenuModalVisible')}>
            <Icon type="plus" />
            添加主菜单
          </Button>
          <Button type="primary" onClick={this.handleNextStep}>下一步</Button>
        </div>
        {addMenuModal}
        <SelectIcon
          visible={iconModalVisible}
          iconList={iconList}
          onIconModalCancel={this.handleIconModalCancel}
          onSelectIcon={this.handleSelectIcon}
          currentSelectedIconId={currentSelectedIconInfo.Id}
        />
        <SelectPages
          visible={pageModalVisible}
          pageClassList={pageClassList}
          funcPageList={funcPageList}
          total={total}
          fetchListParams={fetchListParams}
          onSearch={this.handleSearch}
          onClickPageClass={this.handleClickPageClass}
          currentSelectedPageInfo={pageModalType ? currentSubSelectedPageInfo : currentSelectedPageInfo}
          currentSelectedPageClass={pageModalType ? currentSubSelectedPageClass : currentSelectedPageClass}
          onPageModalCancel={this.handlePageModalCancel}
          onSelectPage={this.handleSelectPage}
          loading={funcpageLoading}
        />
      </Fragment>
    )
  }
}
