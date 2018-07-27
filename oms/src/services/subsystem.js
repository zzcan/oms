import request from '../utils/request';
import { stringify } from 'qs';

// 获取页面列表
export async function querySubsystemList(params) {
  return request(`/GetSubsystemList?${stringify(params)}`);
}

// 修改子系统列表
export async function changeSubsystemInfo(params) {
  return request(`/ChangeSubsystemInfo`, {
    method: 'POST',
    body: params,
  });
}

// 删除子系统
export async function delSubsystem(params) {
  return request(`/DeleteSubsystem`, {
    method: 'POST',
    body: params,
  });
}
