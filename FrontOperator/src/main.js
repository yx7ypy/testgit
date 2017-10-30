/**
 * 程序入口
 */
import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import router from '@/router'
import store from '@/store'
import plugin from '@/utils/plugin.js'
import api from '@/api'
import operator from '@/components/operator.vue'
import Moment from 'moment';
import 'element-ui/lib/theme-default/index.css'


// 使用 ElementUI \ vue插件
Vue.use(ElementUI)
Vue.use(plugin)

Vue.filter('convertTime', function(value) {
	return Moment(value).format('YYYY-MM-DD HH:mm:ss ');
})
// 全局注入api入口
Vue.prototype.$api = api;
import axios from 'axios';
axios.defaults.withCredentials=true;

new Vue({
    el: '#operator',
    router,
    store,
    render: h => h(operator)
})
 
// 为Date原型添加时间格式化方法
Date.prototype.format = function(fmt) {
    let o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    }
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length))
    }
    for(let k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))
        }
     }
    return fmt
}
