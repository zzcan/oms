import { stringify } from 'qs';
import axios from './axios';

export function loginOut() {
    return axios.get('/api/Account/LoginOut');
}

export function login(params) {
    return axios.post('/api/Account/Login', params);
}

export function getSubsystemList() {
    return axios.get('/api/SubSystem/GetSubsystemList');
}