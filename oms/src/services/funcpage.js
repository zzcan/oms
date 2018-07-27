import request from '../utils/request';
import { stringify } from 'qs';

// 获取页面列表
export async function queryFuncPageList(params) {
  return request(`/api/FunctionPage/GetFuncPageList?${stringify(params)}`);
}

// 删除页面
export async function delFuncPage(params) {
  return request(`/api/FunctionPage/DeletePage`, {
    method: 'POST',
    body: params,
  });
}

// 获取页面分类列表
export async function queryPageClass(params) {
  return request(`/api/PageClass/GetPageClass?${stringify(params)}`);
}

// 批量分类
export async function batchClass(params) {
  return request(`/api/PageClass/BatchClass`, {
    method: 'POST',
    body: params,
  });
}

// 添加新页面
export async function addPage(params) {
  return request(`/api/FunctionPage/AddPage`, {
    method: 'POST',
    body: params,
  });
}

// 修改分类名称
export async function changePageClassName(params) {
  return request(`/api/FunctionPage/ChangePageClassName`, {
    method: 'POST',
    body: params,
  });
}

// 修改分类名称
export async function addClassName(params) {
  return request(`/api/PageClass/AddPageClass`, {
    method: 'POST',
    body: params,
  });
}

// 修改分类名称
export async function deletePageClass(params) {
  return request(`/api/PageClass/DeletePageClass`, {
    method: 'POST',
    body: params,
  });
}

// 修改分类名称
export async function editPageInfo(params) {
  return request(`/api/FunctionPage/EditPageInfo`, {
    method: 'POST',
    body: params,
  });
}
