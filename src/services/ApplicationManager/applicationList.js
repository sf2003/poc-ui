import { baseURL, defaultPageSize } from '../../utils/config'
import request from '../../utils/request';

export async function findMyDummyApplications (params) {
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
    `${baseURL}/application/findMyDummyApplications?currentPage=${currentPage}&pageSize=${pageSize}`,
    {
      method: 'POST',
      body: queryData,
      withCredential: true,
    },
  )
}
