<template>
    <div class="elmenu-wrap">
        <template>
            <el-menu :default-active="defaultElmenu" :unique-opened="true" class="el-menu-vertical" theme="dark" :router="true" mode="vertical">
                <template v-for="item in elmenu">
        			<template v-if="item.children && item.isShow">
        				<el-submenu :index="item.path">
        					<template slot="title"><span class="elmenu-title-icon iconfont" :class="item.classname"></span><span class="elmenu-title">{{ item.menuName }}</span></template>
                            <template v-for="childitem in item.children">
                                <el-menu-item 
                                	v-if="childitem.isShow"
                                	:index="childitem.path" 
                                	class="elmenu-title-icon iconfont" 
                                	:class="childitem.classname">
                                	{{ childitem.menuName }}
                                </el-menu-item>
                            </template>
        				</el-submenu>
        			</template>
        			<!--<template v-else>
        				<el-menu-item :index="item.path">{{ item.name }}</el-menu-item>
        			</template>-->
        		</template>
        	</el-menu>
        </template>
    </div>
</template>

<script>
// 左侧导航
import { mapGetters } from 'vuex'
//import { elmenuData } from '@/config/config.js'
import { routes } from '@/router/index.js'
import '@/static/style/menu/elmenu.scss'

export default {
    props: ['type'],
    data () {
        return {
            defaultElmenu: this.$route.path,
            elmenu: routes
        }
    }
}
</script>
