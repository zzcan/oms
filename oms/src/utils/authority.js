// use localStorage to store the authority info, which might be sent from server in actual project.
import { getPathname, getCookie } from './utils';
export function getAuthority() {
  const systemList = localStorage.getItem('systemList')
    ? JSON.parse(localStorage.getItem('systemList'))
    : [];
  return systemList.map(v => v.HomeUrl);
}

export function setLoginInfo(loginInfo) {
  localStorage.setItem('token', loginInfo.Token);
  localStorage.setItem('userInfo', JSON.stringify(loginInfo.UserInfo));
  localStorage.setItem('systemList', JSON.stringify(loginInfo.SubSystemList));
}

export function checkAuthority(authority) {
  return authority.includes(getPathname());
}

export function checkIsLogin() {
  const cookie = '';
  if (!cookie) {
    const { origin } = location;
    //未登录重定向到登录页面
    location.href = `${origin}/#/login`;
  }
}
