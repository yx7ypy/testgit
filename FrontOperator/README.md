# 缤果盒子运营商系统

> 基于 vue 2.0+ 开发，用webpack打包

## 项目结构[src]

``` bash

├── api                      # 接口相关
├── components               # 全部组件
│   └── box					 # 盒子管理
│   └── fengModule           # 封装组件
│   └── dashboard            # 修改密码
│   └── logins               # 登录
│   └── goodsManage          # 商品管理
│   └── intoBox            	 # 商品入盒
│   └── recededBox           # 商品出盒
│   └── warehouse            # 仓库管理
│   └── navmenu              # 导航
│   └── operator.vue         # 主入口
├── config                   # api及相关地址配置
├── router                   # 路由配置
├── static                   # 相关资源
│   ├── img                  # 图片
│   └── style                # scss样式
└── store                    # vuex全局状态管理
    ├── index.js             # 组装模块并导出 store
    ├── actions.js           # 根级别的 action
    ├── getters.js           # 根级别的 getters
    ├── mutations.js         # 根级别的 mutation
    ├── state.js             # 根级别的 state
    ├── mutation-types.js    # 常量替代 mutation 事件类型
    └── modules              # 分割的模块
        ├── login.js         # 登录模块
        └── navmenu.js       # 导航栏模块

```

## 技术栈:
> * vue ^2.3.3
> * vue-router ^2.5.2
> * element-ui ^1.4.0
> * vuex ^2.3.1
> * axios ^0.15.3
> * react-cookie ^1.0.4
> * scss ^4.5.0

## 关键命令

``` bash
# 加载模块
npm install

# 运行测试环境，已配置热更新
npm run dev

# 打包用于生产环境
npm run build
```
