import * as types from '@/store/mutation-types'

const mutations = {
    [types.LOADINGSTATUS_SWITCH] (state, param) {
        // 切换loading状态
        state.loadingStatus = param
    },
    [types.BOXLIST_GET] (state, { response }) {
        state.boxList = (response.status !== 404) ? response.data.list : []
    },
    // 获取商品一级品类列表信息
    [types.FIRSTCF_GET] (state, { response }) {
        state.firstCFList = (response.code == 2000) ? response.data : []
    },
    // 获取商品二级品类列表信息
    [types.SECONDCF_GET] (state, { response }) {
        state.secondCFList = (response.code == 2000) ? response.data : []
    },
    // 获取商品三级品类列表信息
    [types.THIRDCF_GET] (state, { response }) {
        state.thirdCFList = (response.code == 2000) ? response.data : []
    },
    // 获取包装单位列表信息
    [types.PACKUNIT_GET] (state, { response }) {
        state.packUnitList = (response.code == 2000) ? response.data.childrenList : []
    },
    // 获取规格单位列表信息
    [types.SPECUNIT_GET] (state, { response }) {
        state.specUnitList = (response.code == 2000) ? response.data.childrenList : []
    },
    // 获取保质期单位列表信息
    [types.LIFEUNIT_GET] (state, { response }) {
        state.lifeUnitList = (response.code == 2000) ? response.data.childrenList : []
    },
    // 获取效期单位列表信息
    [types.VILIDUNIT_GET] (state, { response }) {
        state.vilidUnitList = (response.code == 2000) ? response.data.childrenList : []
    },
    // 获取省份列表信息
    [types.PROVINCELIST_GET] (state, { response }) {
        state.provinceList = (response.code == 2000) ? response.data : []
    },
    // 获取城市列表信息
    [types.CITYLIST_GET] (state, { response }) {
        state.cityList = (response.code == 2000) ? response.data : []
    },
    // 获取区域列表信息
    [types.DISTRICELIST_GET] (state, { response }) {
        state.districtList = (response.code == 2000) ? response.data : []
    },
    /**
     * 
     * @param { city_reset_two_three }          string  清除城市二级和三级
     * @param { city_reset_three }              string  清除城市三级 
     * @param { category_reset_two_three }      string  清除品类二级和三级 
     * @param { category_reset_three }          string  清除品类三级 
     */
    [types.LINKAGE_RESET] (state, param) {
        if(param.type == 'city_reset_two_three'){
            state.cityList = [];
            state.districtList = [];
        }else if(param.type == 'city_reset_three'){
            state.districtList = [];
        }else if(param.type == 'category_reset_two_three'){
            state.secondCFList = [];
            state.thirdCFList = [];
        }else if(param.type == 'category_reset_three'){
            state.thirdCFList = [];
        }
    },
    
    [types.BREADCRUMB_SWITCH] (state, param) {
        state.breadcrumb = param
    }
}

export default mutations
