import { baseURL, defaultPageSize } from '../../utils/config'
import request from '../../utils/request';

export async function findUserPageByQuery (params) {
  const currentPage = params.currentPage ? params.currentPage - 1 : 0;
  const pageSize = params.pageSize ? params.pageSize : defaultPageSize;
  const queryData = {
    queryData: {},
    sorter: [],
  };

  if (params.sort) {
    queryData.sorter.push(params.sort)
  }

  if (params.queryData) {
    queryData.queryData = params.queryData
  }

  return request(
    `${baseURL}/user/findUserPageByQuery?pageNumber=${currentPage}&pageSize=${pageSize}`,
    {
      method: 'POST',
      body: queryData,
    },
  )
}

export async function deleteUser(params) {
  return request(
    `${baseURL}/user/deleteUser?userId=${params}`
  )
}
