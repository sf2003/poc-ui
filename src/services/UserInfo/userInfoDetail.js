import { baseURL, defaultPageSize } from '../../utils/config';
import request from '../../utils/request';

export async function findUserById(params) {
  return request(
    `${baseURL}/user/findUserById?userId=${params}`
  )
}

export async function createUser(params) {
  return request(
    `${baseURL}/user/createUser`,
    {
      method:'POST',
      body: params,
    }
  )
}

export async function updateUser(params) {
  return request(
    `${baseURL}/user/updateUser`,
    {
      method:'POST',
      body: params,
    }
  )
}
