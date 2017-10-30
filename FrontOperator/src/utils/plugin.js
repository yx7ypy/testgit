/**
 * 配置一些公用的方法
 */

 exports.install = (Vue, options) => {
    // 状态过滤器
    Vue.filter('enableStatus', value => {
        let _val = ''
        switch (value) {
            case 0:
                _val = '未启用'
                break
            case 1:
                _val = '启用中'
                break
            case 2:
	            _val = '生成部署中'
	            break
            default:
                _val = '启用'
        }
        return _val
    })
    // 隐藏手机号码中间四位过滤器
    Vue.filter('hidePhone', value => {
        let _left = '', _right = ''
        if (typeof value === 'number') {
            value = value.toString()
        }
        if(typeof value === 'string') {
            _left = value.slice(0,3)
            _right = value.substr(value.length - 4)
        }
        return `${_left}****${_right}`
    })
    // 订单支付状态过滤器
    Vue.filter('payStatus', value => value === 1 ? '已支付' : '未支付')
    // 性别过滤器
    Vue.filter('setsex', value => {
        let _val = ''
        switch (value) {
            case '0':
                _val = '未知'
                break;
            case 1:
                _val = '男'
                break;
            case 2:
                _val = '女'
                break;
            default:
                _val = '未知'
        }
        return _val
    })
    // 支付类型过滤器
    Vue.filter('payType', value => {
        let type = ''
        switch(value){
            case 1:
                type = '微信'
                break;
            case 2:
                type = '支付宝'
                break;
            case 3:
                type = '翼支付'
                break;
        }
        return type
    })
    // 商品数量过滤器
    Vue.filter('setProductNum', value => {
        let _num = 0
        for (let i in value) {
            _num += Number(value[i].num)
        }
        return _num
    })
    // 保留两位小数过滤器
    Vue.filter('toFixed', value => {
        if(value === -Infinity) {
            return 0
        }
        return value.toFixed(2)
    })
    // 转字符串
    Vue.filter('toString', value => value.toString())

    // 添加常用的实例方法
    Vue.prototype.com = (() => {
        /**
         * 跳转Url
         * @param {String} url 跳转地址
         * @param {String} target 跳转类型
         * @return {Boolen}
         */
        const openUrl = (url, target) => {
            if(target) {
                window.location.href = url
            } else {
                window.open(url)
            }
            return true
        }
        /**
         * 获取当前时间
         * @param {String} format 时间格式
         * @return {String}
         */
        const getNowTime = format => {
            let d = new Date(),
                year = d.getFullYear(),
                month = d.getMonth() + 1,
                date = d.getDate(),
                hours = d.getHours(),
                minutes = d.getMinutes(),
                seconds = d.getSeconds()
            if(format !== 'yyyy-mm-dd hh-mm-ss'){
                return `${year}-${month}-${date}`
            }
            return `${year}-${month}-${date}-${hours}-${minutes}-${seconds}`
        }
        /**
         * 返回表格禁用行样式
         * @param  {Object} row   表格行数据
         * @param  {Number} index 表格行标
         * @return {String}
         */
        const tableRowDisabled = (row, index) => {
            if(row.status === 0) {
                return 'row-disabled'
            }
        }
        /**
         * 返回表格禁用行样式 / 活动
         * @type {[type]}
         */
        const tableRowDisabledActive = (row, index) => {
            if(row.status !== 1) {
                return 'row-disabled'
            }
        }
        return {
            openUrl: openUrl,
            getNowTime: getNowTime,
            tableRowDisabled: tableRowDisabled,
            tableRowDisabledActive: tableRowDisabledActive
        }
     })()
 }
