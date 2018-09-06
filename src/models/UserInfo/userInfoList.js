
import { defaultPageSize } from '../../utils/config';
import { deleteUser, findUserPageByQuery } from '../../services/UserInfo/userInfoList';


export default {
  namespace: 'userInfoList',

  state: {
    userList: [],
    tableLoading: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    queryData: {
      spaceId: undefined,
      appTypeId: undefined,
      dummyAppName: null,
    },
    sort: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findUserPageByQuery, payload);

      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            userList: data.rows,
            pagination: {
              current: typeof (payload.currentPage) === 'undefined' ? 1 : Number(payload.currentPage),
              pageSize: typeof (payload.pageSize) === 'undefined' ? defaultPageSize : Number(payload.pageSize),
              total: data.rowsTotal,
            },
            loading: false,
            queryData: payload.queryData,
            sort: payload.sort,
          },
        })
      } else {
        yield put({ type: 'HideLoading' });
        throw (data)
      }
    },

    *deleteUser({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload.userId);
      payload.callback(response);
    }
  },

  reducers: {
    showLoading (state) {
      return { ...state, tableLoading: true }
    },

    HideLoading (state) {
      return { ...state, tableLoading: false }
    },

    querySuccess (state, action) {
      const { userList, pagination, queryData, sort } = action.payload;
      return {
        ...state,
        userList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        tableLoading: false,
        queryData,
        sort,
      }
    },
  },
}
