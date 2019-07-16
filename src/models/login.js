import { stringify } from 'qs';
import { getFakeCaptcha, createToken, validateToken, deleteToken, validateService } from '@/services/api';
import { setAuthority, clearAuthority } from '@/utils/authority';
import { setToken, getToken, clearToken } from '@/utils/token';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import router from 'umi/router';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ callback, payload }, { call, put }) {
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      const { systemKey, service } = params;
      if (!systemKey || !service) {
        callback({
          forbidden: true,
        })
        return;
      }

      const response = yield call(createToken, payload, systemKey);
      // Login successfully
      if (response) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            //type: 'account',
            ...response,
          },
        });
        callback({
          token: response.token,
        });
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    *validate({ callback }, { call }) {
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      const { systemKey, service } = params;
      if (!systemKey || !service) {
        callback({
          forbidden: true,
        })
        return;
      }
      //校验systemKey service
      const validateResponse = yield call(validateService, { systemKey, service });
      if (!validateResponse) {
        callback({
          forbidden: true,
        })
        return;
      }

      const token = getToken();
      if (token) {
        const response = yield call(validateToken, systemKey);
        //token有效
        if (response) {
          callback({
            token,
          });
          return;
        }
      }
      callback();
    },
    *logout({ callback }, { call, put }) {
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      const { systemKey, service } = params;
      if (!systemKey || !service) {
        callback({
          forbidden: true,
        })
      }
      //校验systemKey service
      const validateResponse = yield call(validateService, { systemKey, service });
      if (!validateResponse) {
        callback({
          forbidden: true,
        })
        return;
      }

      const token = getToken();
      //reducer同步
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          // currentAuthority: 'guest',
        },
      });
      if (token) {
        yield call(deleteToken, token, systemKey);
      }
      callback();
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      //登录
      if (payload.status) {
        setToken(payload.token);
        setAuthority(payload.permissions);
      } else {
        //登出
        clearToken();
        clearAuthority();
      }
      reloadAuthorized();
      return {
        ...state,
        // status: payload.status,
        // type: payload.type,
      };
    },
  },
};
