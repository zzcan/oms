import React, { createElement } from 'react';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import './index.css';

const config = {
    400: {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
      title: '400',
      desc: '无效的页面请求，请从左侧菜单发起有效操作！',
    },
    403: {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
      title: '403',
      desc: '抱歉，您没有当前系统的访问权限！',
    },
    404: {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
      title: '404',
      desc: '抱歉，你访问的页面不存在',
    },
    500: {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
      title: '500',
      desc: '抱歉，服务器出错了',
    },
};

function handleGoSubsystem(url) {
  let { origin } = window.location;
  window.location.href = `${origin}${url}`;
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
  if (type == 403 && systemList.length) {
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
              {i === systemList.length - 1 ? null : <Divider type="vertical" />}
            </span>
          ))}
        </div>
      </div>
    );
  }
  const pageType = type in config ? type : '404';
  return (
    <div className="exception" {...rest}>
      <div className="imgBlock">
        <div
          className="imgEle"
          style={{
            backgroundImage: `url(${img || config[pageType].img})`,
            backgroundSize: type == 403 ? 'cover' : 'contain',
            width: type == 403 ? '200px' : '100%',
          }}
        />
      </div>
      <div className="wrapper">
        <h1>{title || config[pageType].title}</h1>
        <div className="desc">{desc || config[pageType].desc}</div>
        <div className="actions">
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