import { createUser, findUserById, updateUser } from '../../services/UserInfo/userInfoDetail';


export default {
  namespace: 'userInfoEdit',

  state: {
    userInfo: {},
    infoLoading: false,
    submitting: false,
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

    *createUser({ payload }, { call, put }) {
      yield put({ type: 'submitting' });
      const data = yield call(createUser, payload.queryData);

      if (data) {
        yield put({
          type: 'hideSubmitting',
        });

        payload.callback(data);
      }
    },

    *updateUser({ payload }, { call, put }) {
      yield put({ type: 'submitting' });
      const data = yield call(updateUser, payload.queryData);

      if (data) {
        yield put({
          type: 'hideSubmitting',
        });

        payload.callback(data);
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

    submitting (state) {
      return { ...state, submitting: true }
    },

    hideSubmitting(state) {
      return { ...state, submitting: false }
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
        submitting: false,
      }
    }
  },
}
