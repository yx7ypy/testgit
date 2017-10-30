/**
 * 路由各项配置
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import {
    MessageBox
} from 'element-ui'

// 全局使用路由
Vue.use(VueRouter)

/**
 * @desc 模块懒加载
 * @param {string} chunkname 编译chunk名称
 * @param {string} module 模块路径
 * @return {function} 模块
 */
// function lazyLoadModule(chunkname, modulename, require) {
//     require.ensure([], function(require) {
//         var mod = require(modulename);
//     }, chunkname);
// }

/*
 * 路由配置  & 左侧菜单
 * name  	  ->  url 名称
 * path  	  ->  url 地址
 * classname  ->  左侧菜单对应icon
 * isShow  	  ->  当前项是否在左侧菜单栏展示
 * */
export const routes = [{
        name: 'home',
        path: '/',
        redirect: '/box'
    },
    {
        name: 'login',
        path: '/login',
        component: r => require.ensure([], () => r(require('@/components/logins/login.vue')), 'login')
    },
    {
        name: 'box',
        menuName: '盒子管理',
        classname: 'icon-hezixiangzi',
        isShow: true,
        path: '/box',
        redirect: '/box/boxList',
        component: r => require.ensure([], () => r(require('@/components/box/index.vue')), 'box'),
        children: [{
                name: 'boxList',
                menuName: '盒子列表',
                path: '/box/boxList',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/box/boxList.vue')), 'box')
            },
            {
                name: 'boxGoodsInfo',
                path: 'boxGoodsInfo',
                component: r => require.ensure([], () => r(require('@/components/box/boxGoodsInfo.vue')), 'box')
            },
            {
                name: 'seeGoodsInfo',
                path: 'boxGoodsInfo/seeGoodsInfo/:id',
                component: r => require.ensure([], () => r(require('@/components/box/seeGoodsInfo.vue')), 'box')
            },
            {
                name: 'boxInfo',
                path: 'boxInfo/:id',
                component: r => require.ensure([], () => r(require('@/components/box/boxInfo.vue')), 'box')
            },
            {
                name: 'boxPrice',
                path: 'boxGoodsInfo/boxPrice/:id',
                component: r => require.ensure([], () => r(require('@/components/box/boxPrice.vue')), 'box')
            },
            {
                name: 'businessPlan',
                path: 'businessPlan/:id/:name',
                component: r => require.ensure([], () => r(require('@/components/box/businessPlan.vue')), 'box')
            }
        ]
    },
    {
        name: 'goods',
        menuName: '商品管理',
        isShow: true,
        classname: 'icon-shangpin',
        path: '/goods',
        redirect: '/goods/goodsList',
        component: r => require.ensure([], () => r(require('@/components/goodsManage/index.vue')), 'goods'),
        children: [{
                name: 'goodsList',
                path: '/goods/goodsList',
                menuName: '商品管理',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/goodsManage/goodsList.vue')), 'goods')
            },
            {
                name: 'goodsCreate',
                path: 'goodsCreate',
                component: r => require.ensure([], () => r(require('@/components/goodsManage/goodsCreate.vue')), 'goods')
            },
            {
                name: 'goodsInfo',
                path: 'goodsInfo/:id',
                component: r => require.ensure([], () => r(require('@/components/goodsManage/goodsInfo.vue')), 'goods')
            },
            {
                name: 'goodsEditor',
                path: 'goodsEditor/:id',
                component: r => require.ensure([], () => r(require('@/components/goodsManage/goodsEditor.vue')), 'goods')
            },
            {
                name: 'price',
                path: '/goods/price',
                menuName: '售价管理',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/goodsManage/goodsPrice-add.vue')), 'goods')
            }
        ]
    },
    {
        name: 'intobox',
        menuName: '商品入盒',
        isShow: true,
        classname: 'icon-iconfontruku',
        path: '/intobox',
        redirect: '/intobox/intoboxList',
        component: r => require.ensure([], () => r(require('@/components/intobox/index.vue')), 'intobox'),
        children: [{
                name: 'intoboxList',
                path: '/intobox/intoboxList',
                menuName: '盒子入盒单',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/intoBox/intoboxList.vue')), 'intobox')
            },
            {
                name: 'intoboxInfo',
                path: 'intoboxInfo/:id',
                component: r => require.ensure([], () => r(require('@/components/intoBox/intoboxInfo.vue')), 'intobox')
            }
        ]
    },
    {
        name: 'recededbox',
        menuName: '商品退盒',
        isShow: true,
        classname: 'icon-chuku',
        path: '/recededbox',
        redirect: '/recededbox/recededboxList',
        component: r => require.ensure([], () => r(require('@/components/recededbox/index.vue')), 'recededbox'),
        children: [{
                name: 'recededboxList',
                path: '/recededbox/recededboxList',
                menuName: '商品退盒单列表',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/recededbox/recededboxList.vue')), 'recededbox')
            },
            {
                name: 'recededboxInfo',
                path: 'recededboxInfo/:id',
                component: r => require.ensure([], () => r(require('@/components/recededbox/recededboxInfo.vue')), 'recededbox')
            }
        ]
    },
    {
        name: 'warehouse',
        menuName: '仓库管理',
        isShow: true,
        classname: 'icon-cangku',
        path: '/warehouse',
        redirect: '/warehouse/warehouseList',
        component: r => require.ensure([], () => r(require('@/components/warehouse/index.vue')), 'warehouse'),
        children: [{
                name: 'warehouseList',
                path: '/warehouse/warehouseList',
                menuName: '仓库管理',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/warehouse/warehouseList.vue')), 'warehouse')
            },
            {
                name: 'warehouseCreate',
                path: 'warehouseCreate',
                component: r => require.ensure([], () => r(require('@/components/warehouse/warehouseCreate.vue')), 'warehouse')
            },
            {
                name: 'warehouseInfo',
                path: 'warehouseInfo/:id',
                component: r => require.ensure([], () => r(require('@/components/warehouse/warehouseInfo.vue')), 'warehouse')
            },
            {
                name: 'warehouseBind',
                path: 'warehouseBind/:id',
                component: r => require.ensure([], () => r(require('@/components/warehouse/warehouseBind.vue')), 'warehouse')
            },
            {
                name: 'warehouseBindBox',
                path: 'warehouseBindBox/:id',
                component: r => require.ensure([], () => r(require('@/components/warehouse/warehouseBindBox.vue')), 'warehouse')
            },
            {
                name: 'warehouseEditor',
                path: 'warehouseEditor/:id',
                component: r => require.ensure([], () => r(require('@/components/warehouse/warehouseEditor.vue')), 'warehouse')
            }
        ]
    },
    {
        name: 'supplier',
        menuName: '供应商管理',
        isShow: true,
        classname: 'icon-supplier',
        path: '/supplier',
        redirect: '/supplier/supplierList',
        component: r => require.ensure([], () => r(require('@/components/supplier/index.vue')), 'supplier'),
        children: [{
                name: 'supplierAdd',
                path: '/supplier/supplierAdd',
                menuName: '新增供应商',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/supplier/supplierAdd.vue')), 'supplier')
            }, {
                name: 'supplierList',
                path: '/supplier/supplierList',
                menuName: '供应商管理',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/supplier/supplierList.vue')), 'supplier')
            },
            {
                name: 'supplierEdit',
                path: 'supplierEdit/:id',
                component: r => require.ensure([], () => r(require('@/components/supplier/supplierEdit.vue')), 'supplier')
            },
            {
                name: 'supplierDetail',
                path: 'supplierDetail/:id',
                component: r => require.ensure([], () => r(require('@/components/supplier/supplierDetail.vue')), 'supplier')
            },
            {
                name: 'supplierFinanceEdit',
                path: 'supplierFinanceEdit/:id',
                component: r => require.ensure([], () => r(require('@/components/supplier/supplierFinanceEdit.vue')), 'supplier')
            },
            {
                name: 'supplierFinanceDetail',
                path: 'supplierFinanceDetail/:id',
                component: r => require.ensure([], () => r(require('@/components/supplier/supplierFinanceDetail.vue')), 'supplier')
            },
            {
                name: 'supplierProductList',
                path: 'supplierProductList/:supplierId',
                component: r => require.ensure([], () => r(require('@/components/supplier/Product/supplierProductList.vue')), 'supplier')
            },
            {
                name: 'supplierProductAdd',
                path: 'supplierProductAdd/:supplierId',
                component: r => require.ensure([], () => r(require('@/components/supplier/Product/supplierProductAdd.vue')), 'supplier')
            }
        ]
    },
    {
        name: 'businessPlan',
        menuName: '经营模板',
        isShow: true,
        classname: 'icon-mobanguanli',
        path: '/businessPlan',
        redirect: '/businessPlan/businessPlanList',
        component: r => require.ensure([], () => r(require('@/components/businessPlan/index.vue')), 'businessPlan'),
        children: [{
                name: 'businessPlanList',
                path: '/businessPlan/businessPlanList',
                menuName: '经营模板列表',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/businessPlan/businessPlanList.vue')), 'businessPlan')
            },
            {
                name: 'businessPlanEdit',
                path: '/businessPlan/businessPlanEdit/:id',
                menuName: '编辑经营模板',
                component: r => require.ensure([], () => r(require('@/components/businessPlan/businessPlanEdit.vue')), 'businessPlan')
            },
            {
                name: 'businessPlanEdit',
                path: '/businessPlan/businessPlanCreate/:id',
                menuName: '新建经营模板',
                component: r => require.ensure([], () => r(require('@/components/businessPlan/businessPlanCreate.vue')), 'businessPlan')
            },
            {
                name: 'businessPlanCreate',
                path: '/businessPlan/businessPlanCreate/new',
                menuName: '新建经营模板',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/businessPlan/businessPlanCreate.vue')), 'businessPlan')
            }
        ]
    },
    {
        name: 'report',
        path: '/report',
        redirect: '/report/reportIntobox',
        component: r => require.ensure([], () => r(require('@/components/report/index.vue')), 'report'),
        children: [{
                name: 'reportIntobox',
                path: 'reportIntobox',
                component: r => require.ensure([], () => r(require('@/components/report/reportIntobox.vue')), 'report')
            },
            {
                name: 'reportIncome',
                path: 'reportIncome',
                component: r => require.ensure([], () => r(require('@/components/report/reportIncome.vue')), 'report')
            },
            {
                name: 'reportSales',
                path: 'reportSales',
                component: r => require.ensure([], () => r(require('@/components/report/reportSales.vue')), 'report')
            },
            {
                name: 'reportReserve',
                path: 'reportReserve',
                component: r => require.ensure([], () => r(require('@/components/report/reportReserve.vue')), 'report')
            }
        ]
    },
    {
        name: 'dashboard',
        path: '/dashboard',
        redirect: '/dashboard/account',
        component: r => require.ensure([], () => r(require('@/components/dashboard/index.vue')), 'dashboard'),
        children: [{
            name: 'setPassword',
            path: 'setPassword',
            component: r => require.ensure([], () => r(require('@/components/dashboard/setPassword.vue')), 'dashboard')
        }]
    },
    {
        name: 'account',
        menuName: '账号管理',
        isShow: true,
        classname: 'icon-shangpin',
        path: '/account',
        redirect: '/account/manager',
        component: r => require.ensure([], () => r(require('@/components/account/index.vue')), 'account'),
        children: [{
            name: 'account.manager',
            path: '/account/manager',
            menuName: '账号管理',
            isShow: true,
            component: r => require.ensure([], () => r(require('@/components/account/manager.vue')), 'account')
            },
            {
                name: 'account.list',
                path: '/account/list',
                menuName: '账号列表',
                isShow: true,
                component: r => require.ensure([], () => r(require('@/components/account/list.vue')), 'account')
            },
            {
                name: 'account.add',
                path: '/account/update',
                component: r => require.ensure([], () => r(require('@/components/account/update.vue')), 'account')
            },
            {
                name: 'account.edit',
                path: '/account/update',
                component: r => require.ensure([], () => r(require('@/components/account/update.vue')), 'account')
            },
            {
                name: 'account.show',
                path: '/account/show',
                component: r => require.ensure([], () => r(require('@/components/account/show.vue')), 'account')
            }
        ]
    },
    {
        name: 'notfound',
        path: '/404',
        component: r => require.ensure([], () => r(require('@/components/fengModule/notfound.vue')), 'notfound')
    },
    { // 404页面路由必须放最后,引导所有未知链接跳转404
        path: '*',
        redirect: '/404'
    }
]

// 路由配置
const router = new VueRouter({
    mode: 'hash', // history
    base: __dirname,
    routes: routes
})

//  注册导航全局钩子，检查是否已登录，是否有权限进入下个链接
router.beforeEach((to, from, next) => {
    let token = store.getters.getToken,
        activation = store.getters.getActivation;
    //	console.log('login='+activation);
    //	console.log(token);
    if (token != null && to.path == '/login') {
        // 已登录不能进入登录页
        next('/');
    }
    if (token === null && to.path !== '/login' && to.path !== '/404') {
        // 未登录
        next('/login')
    } else {
        next()
    }
})

export default router