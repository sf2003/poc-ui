import request from '../utils/request';
import { baseURL } from '../utils/config';

export async function query() {
  return request('/api/users');
}

export async function queryCurrentUser() {
  // return request('/api/currentUser');
  return request(
    `${baseURL}/p/user`
  )
}

export async function queryCurrentUserAuth() {
  // return request('/api/currentUser');
  return request(
    `${baseURL}/extra/getUserAuth`
  )
}

export async function queryMenus() {
  return request(
    `${baseURL}/p/menus`
  )
}
