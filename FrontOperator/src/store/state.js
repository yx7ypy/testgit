import cookie from 'react-cookie'

const state = {
    boxList: [],
    firstCFList: [],	// 一级品类
    secondCFList: [],	// 二级品类
    thirdCFList: [],	// 三级品类
    packUnitList: [],	// 包装单位
    specUnitList: [],	// 规格单位
    lifeUnitList: [],	// 保质期单位
    vilidUnitList: [],	// 效期单位
    provinceList: [],	// 省份列表
    cityList: [],	// 城市列表
    districtList: [],	// 区域列表
    communityList: [],
    productBigclassList: [],
    productMediumclassList: [],
    productSmallclassList: [],
    dictionarySearchList: [],
    productSupplier: [],
    superAuthority: cookie.load('bingoboxSuper') || false,
    loadingStatus: false,
    breadcrumb: {
        bone: '',
        boneUrl: '',
        btwo: '',
        btwoUrl: '',
        bthree: ''
    },
    warehouse: [],
    doornumberList: {},
    nbigclass: [],
    nmediumclass: [],
    nsmallclass: [],
    dictionaryTypeList: {},
}

export default state
