import api from '@/api'
import * as types from '@/store/mutation-types'
import cookie from 'react-cookie'

/* 切换loading状态 */
export const switchLoadingStatus = ({ commit }, param) => {
    commit(types.LOADINGSTATUS_SWITCH, param)
}

/* 获取盒子列表 */
export const getBoxList = ({ commit }, param = {}) => {
    return new Promise((resolve, reject) => {
        api.apiCommunication('/Box/BoxList', param, response => {
            commit(types.BOXLIST_GET, { response })
            resolve()
        })
    })
}

/* 获取商品一级品类列表 */
export const getFirstClassification = ({ commit }, param = {}) => {
    return new Promise((resolve, reject) => {
        api.apiCommunication('/product/dic/getProductCategoryList', param, response => {
            commit(types.FIRSTCF_GET, { response })
            resolve()
        })
    })
}

/* 获取商品二级品类列表 */
export const getSecondClassification = ({ commit }, param = {}) => {
    return new Promise((resolve, reject) => {
        api.apiCommunication('/product/dic/getProductCategoryList', param, response => {
            commit(types.SECONDCF_GET, { response })
            resolve()
        })
    })
}
/* 获取商品三级品类列表 */
export const getThirdClassification = ({ commit }, param = {}) => {
    return new Promise((resolve, reject) => {
        api.apiCommunication('/product/dic/getProductCategoryList', param, response => {
            commit(types.THIRDCF_GET, { response })
            resolve()
        })
    })
}
/* 获取包装单位列表 */
export const getUnitList = ({ commit }, param = {}) => {
    return new Promise((resolve, reject) => {
        api.apiCommunication('/product/dic/getProductDicList', param, response => {
            if(param.type == 1){
            	commit(types.PACKUNIT_GET, { response })
            }else if(param.type == 2){
            	commit(types.SPECUNIT_GET, { response })
            }else if(param.type == 3){
            	commit(types.LIFEUNIT_GET, { response })
            }else if(param.type == 4){
            	commit(types.VILIDUNIT_GET, { response })
            }
            resolve()
        })
    })
}

/* 获取城市列表  */
export const getCityList = ({ commit }, param = {}) => {
    return new Promise((resolve, reject) => {
        api.apiCommunication('/city/list', param, response => {
            if(param.type == 1){
            	commit(types.PROVINCELIST_GET, { response })
            }else if(param.type == 2){
            	commit(types.CITYLIST_GET, { response })
            }else if(param.type == 3){
            	commit(types.DISTRICELIST_GET, { response })
            }
            resolve()
        },'basedata');
    })
}

/* 清空三级联动(城市&品类) */
export const resetLinkage = ({ commit }, param) => {
    commit(types.LINKAGE_RESET,param);
}




/* 切换面包屑数据 */
export const switchBreadcrumb = ({ commit }, param = {}) => {
    commit(types.BREADCRUMB_SWITCH, param)
}
