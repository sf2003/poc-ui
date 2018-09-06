import { findUserById } from '../../services/UserInfo/userInfoDetail';


export default {
  namespace: 'userInfoDetail',

  state: {
    userInfo: {},
    infoLoading: false,
  },

  effects: {
    *fetchDetail({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findUserById, payload);

      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: data.row,
        })
      } else {
        throw (data)
      }
    },

  },

  reducers: {
    showLoading (state) {
      return { ...state, infoLoading: true }
    },

    HideLoading (state) {
      return { ...state, infoLoading: false }
    },

    querySuccess (state, action) {
      return {
        ...state,
        userInfo: action.payload,
        infoLoading: false,
      }
    },

    clean (state) {
      return {
        ...state,
        userInfo: {},
        infoLoading: false,
      }
    }
  },
}
