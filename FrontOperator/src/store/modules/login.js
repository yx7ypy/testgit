/**
 * 账号登录相关
 */
import api from '@/api'
import * as types from '@/store/mutation-types'
import cookie from 'react-cookie'
import { MessageBox } from 'element-ui'
import router from '@/router'
import { basicConfig } from '@/config/config'


const login = {
	state: {
		token: cookie.load('token') || null,
		account: cookie.load('bingoboxaccount') || null,
		authority: cookie.load('bingoboxAuth') || null,
		username: cookie.load('username') || null, // 用户名
		activation: cookie.load('activation') || null, // 是否激活
		systemDomain: cookie.load('systemDomain') || null
	},
	getters: {
		getToken: state => state.token,
		getAccount: state => state.account,
		getAuthority: state => state.authority,
		getUsername: state => state.username,
		getActivation: state => state.activation,
		getSystemDomain: state => state.systemDomain
	},
	actions: {
		/* 用户登录 */
		onLogin({ commit }, param) {
			let that = this;
			api.apiCommunication('/user/login', param, response => {
				if(response.status === 404) {
					MessageBox.alert(`登录失败，请检查用户名或密码重新填写登录或者联系管理员，服务器返回信息：${response.data}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
					return false
				}
				if(response.code != 2000) {
					MessageBox.alert(`登录失败，服务器返回信息：${response.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false;
				}
				//设置cookie过期时间（3天）
				let exp = new Date()
				exp.setTime(exp.getTime() + 3 * 24 * 60 * 60 * 1000);
//				console.log(response.data);
				console.log(basicConfig);
				// 保存token
				cookie.save('token', response.data.user.token, { path: `;domain=${basicConfig.COOKIES_DOMAIN};path=/`, expires: exp })
				// 保存用户名
				cookie.save('username', response.data.user.userName, { path: `;domain=${basicConfig.COOKIES_DOMAIN};path=/`, expires: exp })
				
				// 保存权限
				cookie.save('activation', response.data.user.status, { path: `;domain=${basicConfig.COOKIES_DOMAIN};path=/`, expires: exp })
				
				
				// 保存账号
//				commit(types.USERNAME_GET, response.data.user.token);
//				cookie.save('bingoboxaccount', response.data.user.userName, { path: ';domain=bingobox.com;path=/', expires: exp })
				// 保存权限
				//              cookie.save('bingoboxAuth', response.data.auth, { path: '/', expires: exp })
				// 保存导航栏
				// cookie.save('bingoboxnav', , {
				//     path: '/',
				//     expires: exp
				// })
				// 获取成功，提交mutations处理数据
//				commit(types.LOGIN_SUCCESS, { response }, response.data.user.userName)
				// 重定向
//				if(response.data.user.status != 1) {
//					MessageBox.alert('帐号未激活;请点击确定或关闭本通知跳转修改密码继续操作', '系统通知', {
//						confirmButtonText: '确定',
//						type: 'success',
//						callback: action => {
//							// 重定向到修改密码
////							router.push({path:'setPassword'})
//							window.location.pathname = '/dashboard/setPassword';
//						}
//					})
//				} else {
//					window.location.pathname = '/';
//				}
//				window.location.pathname = '/';
				window.location = location.origin
			}, 'user');
		},
		/* 退出登录 */
		outLogin({ commit }) {
			// 移除cookie
			cookie.remove('token', { path: `;domain=${basicConfig.COOKIES_DOMAIN};path=/` });
			// 移除用户名
			cookie.remove('username', { path: `;domain=${basicConfig.COOKIES_DOMAIN};path=/` });
			cookie.remove('activation', { path: `;domain=${basicConfig.COOKIES_DOMAIN};path=/` });
//			cookie.remove('bingoboxaccount', { path: '/' })
			// 清除tonken
			commit(types.SIGNOUT_SUCCESS)
			// 重定向登录页
//			window.location.pathname = '/login'
			window.location = location.origin
		},
		//写系统标识
		writeSystemDomain({commit},value){
            let exp = new Date('9999-12-01');
            exp.setTime(exp.getTime());
           cookie.save('systemDomain', value, { path: `;domain=${basicConfig.COOKIES_DOMAIN};path=/`, expires: exp })
		}
	},
	mutations: {
		[types.LOGIN_SUCCESS](state, { response }, username) {
			state.token = response.data
			state.username = username
		},
		[types.SIGNOUT_SUCCESS](state) {
			state.token = null
			state.account = null
			state.username = null
		}
	}
}

export default login