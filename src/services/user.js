import {
  LOGIN,
  ROUTES,
  REGISTER,
  CODE,
  PASSWROD,
  LOGOUT,
  ACCOUNTLIST,
  CHANGEUSER,
  ADDUSER,
  SEARCH,
  SEARCHLIST,
  USERINFO,
  DELETESEARCH,
} from '@/services/api'
import {
  request,
  METHOD,
  removeAuthorization
} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(type, account, code, password) {
  return request(LOGIN, METHOD.POST,
    type, account, code, password
  )
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

export async function registerUser(account, password, mobile, code, company, industry) {
  return request(REGISTER, METHOD.POST,
    account, password, mobile, code, company, industry
  )
}

export async function getCode(mobile, type) {
  return request(CODE, METHOD.GET, {
    mobile,
    type
  })
}

export async function changePwd(mobile, code, newPwd) {
  return request(PASSWROD, METHOD.POST,
    mobile, code, newPwd
  )
}
export async function toLoggout(accessToken) {
  return request(LOGOUT, METHOD.GET, {
    accessToken
  })
}
export async function getAccountList(pageIndex, pageSize, account, mobile, company, verify, status) {
  return request(ACCOUNTLIST, METHOD.GET,
    pageIndex, pageSize, account, mobile, company, verify, status
  )
}
export async function changeUser(id, status, verify, textNumber, imgNumber, isDelete) {
  return request(CHANGEUSER, METHOD.POST,
    id, status, verify, textNumber, imgNumber, isDelete
  )
}
export async function addUser(account, password, mobile, company, industry) {
  return request(ADDUSER, METHOD.POST,
    account, password, mobile, company, industry
  )
}
export async function search(type, accessToken, businessIds, content) {
  return request(SEARCH, METHOD.POST,
    type, accessToken, businessIds, content
  )
}

export async function getSearchList(accessToken, type, account, pageIndex, pageSize) {
  return request(SEARCHLIST, METHOD.GET,
    accessToken, type, account, pageIndex, pageSize
  )
}

export async function getUserInfo(accessToken) {
  return request(USERINFO, METHOD.POST, {
    accessToken
  })
}

export async function deleteSearch(accessToken, ids) {
  return request(DELETESEARCH, METHOD.POST,
    accessToken, ids
  )
}


/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig,
  registerUser,
  getCode,
  changePwd,
  toLoggout,
  getAccountList,
  changeUser,
  addUser,
  search,
  getSearchList,
  getUserInfo,
  deleteSearch,
}