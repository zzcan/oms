import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button, Divider } from 'antd';
import config from './typeConfig';
import styles from './index.less';

function handleGoSubsystem(url) {
  let { origin } = location;
  location.href = `${origin}${url}`;
}

const Exception = ({
  className,
  linkElement = 'a',
  type,
  title,
  desc,
  img,
  actions,
  systemList,
  ...rest
}) => {
  // systemList 403访问列表
  if (type == 403) {
    actions = (
      <div>
        <div style={{ color: '#595959', marginBottom: 10 }}>您现在可以使用的系统有：</div>
        <div>
          {systemList.map((v, i) => (
            <span key={v.Id}>
              <span
                onClick={() => handleGoSubsystem(v.HomeUrl)}
                style={{ color: '#03A9F4', cursor: 'pointer' }}
              >
                {v.SystemName}
              </span>
              {i == systemList.length - 1 ? null : <Divider type="vertical" />}
            </span>
          ))}
        </div>
      </div>
    );
  }
  const pageType = type in config ? type : '404';
  const clsString = classNames(styles.exception, className);
  return (
    <div className={clsString} {...rest}>
      <div className={styles.imgBlock}>
        <div
          className={styles.imgEle}
          style={{
            backgroundImage: `url(${img || config[pageType].img})`,
            backgroundSize: type == 403 ? 'cover' : 'contain',
            width: type == 403 ? '200px' : '100%',
          }}
        />
      </div>
      <div className={styles.content}>
        <h1>{title || config[pageType].title}</h1>
        <div className={styles.desc}>{desc || config[pageType].desc}</div>
        <div className={styles.actions}>
          {actions ||
            createElement(
              linkElement,
              {
                to: '/',
                href: '/',
              },
              type == 400 ? null : <Button type="primary">返回首页</Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Exception;
