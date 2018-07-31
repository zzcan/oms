import { stringify } from 'qs';
import request from '../utils/request';

export const login = '';
export const loginOut = '';

export async function queryMenus(subSystemName) {
  return request(`/api/Menu/GetMenus?subSystemName=${subSystemName}`);
}

export async function queryIcons() {
  return request(`/api/MenuIco/GetMenuIcoList`);
}
