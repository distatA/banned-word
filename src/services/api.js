//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX 
// console.log(process.env.VUE_APP_API_BASE_URL);
// http://47.97.254.4:8888/api
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/home/login`,//登录
  REGISTER:`${BASE_URL}/home/register`, //注册
  CODE:`${BASE_URL}/home/mobileVerifiCode` ,//验证码
  PASSWROD:`${BASE_URL}/home/edit_pwd`, //修改密码
  LOGOUT:`${BASE_URL}/home/logout`, //退出登录
  ACCOUNTLIST:`${BASE_URL}/user/user_list`,  //子账户列表
  CHANGEUSER:`${BASE_URL}/user/edit_user`,  //修改子账户
  ADDUSER:`${BASE_URL}/user/add_user` , //添加账户
  SEARCH:`${BASE_URL}/search/search`,  //违禁词查询
  SEARCHLIST:`${BASE_URL}/user/search_list`, //查询记录列表
  USERINFO:`${BASE_URL}/user/user_info` ,//当前用户信息
  DELETESEARCH:`${BASE_URL}/user/del_record`, //删除查询列表,
  UPLOAD:`${BASE_URL}/upload/uploadFile`,
  
}
