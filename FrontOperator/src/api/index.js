/**
 * api集成管理
 */
import Vue from 'vue'
import axios from 'axios'
import { basicConfig } from '@/config/config'
import querystring from 'querystring'
import store from '@/store'
import { MessageBox } from 'element-ui'

export default {
    /**
      * 通用api方法
      * type === 'bingo' 表示使用缤果总部接口
      */
    apiCommunication(apiname, param, callback, type) {
        // if(apiname === '/test/test1') {
        //     callback(testjason)
        //     return false
        // }
        let params = param,
        	_apiUrl;
		if(type === 'basedata'){
			_apiUrl = basicConfig.BASEDATA_HOST;
		}else if(type === 'user'){
			_apiUrl = basicConfig.USER_HOST;
		}else{
			_apiUrl = basicConfig.PRODUCT_HOST;
		}
//      console.log(_apiUrl);
//      if(apiname !== '/Login/login') {
//          Object.assign(params, { token: store.getters.getToken })
//      }
        axios.post(_apiUrl + apiname, params)
            .then(response => {
                callback(response.data)
            })
    },
    apiCommunicationGet(apiname, callback, type) {
        // if(apiname === '/test/test1') {
        //     callback(testjason)
        //     return false
        // }
        let _apiUrl;
        if(type === 'basedata'){
			_apiUrl = basicConfig.BASEDATA_HOST;
		}else if(type === 'user'){
			_apiUrl = basicConfig.USER_HOST;
		}else{
			_apiUrl = basicConfig.PRODUCT_HOST;
		}
//		console.log(_apiUrl);
        axios.get(_apiUrl + apiname)
            .then(response => {
                callback(response.data)
            })
    }
}

// 添加接口回调拦截器
axios.interceptors.response.use(response => {
    if(response.status === 200) {
        if(response.data.code === 5004) {
            // token过期，执行退出登录
            store.dispatch('switchLoadingStatus', false)
            MessageBox.alert('登录失效，请重新登录', '系统通知', {
                confirmButtonText: '确定',
                type: 'error',
                callback: action => {
                    // 密码修改成功，退出登录
                    store.dispatch('outLogin')
                }
            })
        } else {
            return response
        }
    }else {
//      MessageBox.alert('接口通讯失败，请尝试刷新页面或者重新登录。如果还是存在问题，请联系管理员[warning]', '系统通知', { confirmButtonText: '确定', type: 'error' })
    }
})

//, error => {
//  store.dispatch('switchLoadingStatus', false)
//  MessageBox.alert(`接口通讯失败，请尝试刷新页面或者重新登录。如果还是存在问题，请联系管理员[error]: ${error}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
//  return Promise.reject(error)
//})

// let testjason = { "status": 200, "data": { "list": [ { "id": 16, "name": "盒子消费抽券活动", "start_time": "2017-06-24 00:00", "end_time": "2017-06-24 00:00", "status": 1 }, { "id": 17, "name": "盒子消费抽券活动", "start_time": "2017-06-24 00:00", "end_time": "2017-06-24 00:00", "status": 0 } ], "pageCount": 1, "count": 2 } }
