<template>
    <el-row class="mar-bottom10">
        <el-col :span="24" class="el-item top-toolbar">
            {{ title }}
        </el-col>
    </el-row>
</template>

<script>
/**
 * 页内顶部面包屑导航
 * @title 标题文案
 */
import '@/static/style/fengModule/topbar.scss'

export default {
    props: ['title'],
    data() {
        return {}
    }
}
</script>
