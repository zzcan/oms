import { Modal } from 'antd';
import styles from './index.less';
import iconStyles from '../../assets/fonts/iconfonts.less';
const SelectIcon = ({visible, onIconModalCancel, iconList, onSelectIcon, currentSelectedIconId}) => {
  return (
    <Modal
      width={600}
      title={'选择图标'}
      visible={visible}
      onCancel={onIconModalCancel}
      footer={null}
      className={styles['icon-modal']}
    >
      <div className={styles['icon-list']}>
      {
        iconList.map(v => (
          <div className={currentSelectedIconId === v.Id ? `${styles['icon-item']} ${styles.selected}` : styles['icon-item']} key={v.Id} onClick={() => onSelectIcon(v)}>
            <i className={`${iconStyles.iconfont} ${iconStyles[v.Url]}`}></i>
          </div>
        ))
      }
      </div>
    </Modal>
  )
}
export default SelectIcon;
