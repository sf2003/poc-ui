import { query as queryUsers, queryCurrentUser, queryCurrentUserAuth, queryMenus } from '../services/user';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    menus: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const userResponse = yield call(queryCurrentUser);

      if (userResponse.success) {
        const currentAuthority = userResponse.result.authorities.split(',');

        setAuthority(currentAuthority);
        reloadAuthorized();

        yield put({
          type: 'saveCurrentUser',
          payload: {
            name: userResponse.result.userName,
            avatar: userResponse.result.avatar,
            userid: userResponse.result.userId,
          },
        });
      }
    },
    *fetchMenus(_, { call, put }) {
      const response = yield call(queryMenus);
      if (response.success) {
        const menus = [];
        response.result.forEach(item => {
          const menuItem = {
            name: item.title,
            icon: item.icon === '' ? 'appstore-o' : item.icon,
            path: item.key,
          };

          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            menuItem.children = [];
            item.children.forEach(child => {
              menuItem.children.push({
                name: child.title,
                path: child.link,
                systemMenu: true,
              })
            });
          }

          menus.push(menuItem);
        });

        yield put({
          type: 'saveMenus',
          payload: menus,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveMenus(state, action) {
      return {
        ...state,
        menus: action.payload,
      };
    },
  },
};
