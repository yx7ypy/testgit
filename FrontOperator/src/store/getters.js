const getters = {
    boxList: state => state.boxList,
    firstCFList: state => state.firstCFList,	// 一级品类
    secondCFList: state => state.secondCFList,	// 二级品类
    thirdCFList: state => state.thirdCFList,	// 三级品类
    packUnitList: state => state.packUnitList,	// 包装单位
    specUnitList: state => state.specUnitList,	// 规格单位
    lifeUnitList: state => state.lifeUnitList,	// 保质期单位
    vilidUnitList: state => state.vilidUnitList,	// 效期单位
    provinceList: state => state.provinceList,	// 省份列表
    cityList: state => state.cityList,	// 城市列表
    districtList: state => state.districtList,	// 区域列表
    loadingStatus: state => state.loadingStatus, // 
    breadcrumb: state => state.breadcrumb, // 面包屑
    
}

export default getters
