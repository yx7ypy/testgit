<template>
    <div class="toolbar-wrap display-table" v-if="$route.name!=='login'">
        <div class="toolbar-logo"><img src="../../static/img/logo-white.png"></div>
        <div class="toolbar-nav">
    		<div class="toolbar-features">
    			<el-dropdown trigger="click" @command="handleCommand">
    				<div class="el-dropdown-link">
    					<i class="iconfont icon-user"></i><span class="features-name">{{getUsername}}</span><i class="iconfont icon-menu"></i>
    				</div>
    				<el-dropdown-menu slot="dropdown">
    					<el-dropdown-item command="setPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="outLogin">退出登录</el-dropdown-item>
    				</el-dropdown-menu>
    			</el-dropdown>
    		</div>
    	</div>
    </div>
</template>

<script>
// 顶部导航栏
import { basicConfig } from '@/config/config'
import '@/static/style/navigation/headernav.scss'

export default {
    data() {
        return {
            path: this.$route.name,
        }
    },
    computed:{
 		getUsername(){ return this.$store.getters.getUsername }
    },
    methods: {
		handleCommand(command) {
			switch(command){
                case 'setPassword':
                    // 修改密码
                    this.$router.push({ name: 'setPassword' })
                    break
				case 'outLogin':
					// 退出登录
					this.$store.dispatch('outLogin')
					break
			}
		}
    }
}
</script>
