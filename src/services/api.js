import { stringify } from 'qs';
import request from '@/utils/request';

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}


export async function createToken(params, systemKey) {
  return request(`/api/auth/user/token`, {
    method: 'POST',
    data: params,
    headers: {
      'System-Key': systemKey,
    },
  });
}

export async function deleteToken(token, systemKey) {
  return request(`/api/auth/token`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
      'System-Key': systemKey,
    },
    getResponse: true,
    errorHandler: () => {
      //
    }
  });
}

export async function validateService(params) {
  return request(`/api/sso/validateService?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'System-Key': params.systemKey,
    },
    getResponse: true,
    errorHandler: () => {
      //
    }
  });
}

export async function validateToken(systemKey) {
  return request(`/api/sso/validateToken`, {
    method: 'GET',
    headers: {
      'System-Key': systemKey,
    },
  });
}
