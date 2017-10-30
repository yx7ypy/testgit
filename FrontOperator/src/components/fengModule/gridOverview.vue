<template>
    <el-row v-if="module.length > 0">
        <el-col :span="24" class="el-item grid-overview">
            <ul>
                <li v-for="item in module">
                    <h2 class="theme-h2 tc" :class="item.className">{{ item.data ? item.data : 0 }}</h2>
                    <p class="theme-p tc mar-top5">{{ item.text }}</p>
                </li>
            </ul>
        </el-col>
    </el-row>
</template>

<script>
/**
 * 横向栅格数据统计概览组件
 * @module 展示数据
 */
import '@/static/style/fengModule/gridOverview.scss'

export default {
    name: 'gridoverview',
    props: {
        module: Array
    },
    data() {
        return {
        	de:0
        }
    }
}
</script>
