import { findMyDummyApplications } from '../../services/ApplicationManager/applicationList';
import { defaultPageSize } from '../../utils/config';


export default {
  namespace: 'applicationList',

  state: {
    appList: [],
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
      const data = yield call(findMyDummyApplications, payload);

      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            appList: data.result.rows,
            pagination: {
              current: typeof (payload.currentPage) === 'undefined' ? 1 : Number(payload.currentPage),
              pageSize: typeof (payload.pageSize) === 'undefined' ? defaultPageSize : Number(payload.pageSize),
              total: data.result.totalNum,
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

  },

  reducers: {
    showLoading (state) {
      return { ...state, tableLoading: true }
    },

    HideLoading (state) {
      return { ...state, tableLoading: false }
    },

    querySuccess (state, action) {
      const { appList, pagination, queryData, sort } = action.payload;
      return {
        ...state,
        appList,
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
