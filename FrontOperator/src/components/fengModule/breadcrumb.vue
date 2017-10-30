<template>
    <div class="breadcrumb" v-if="breadcrumb">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: breadcrumb.boneUrl }">{{ breadcrumb.bone }}</el-breadcrumb-item>
            <template v-if="breadcrumb.btwo">
                <el-breadcrumb-item v-if="breadcrumb.bthree" :to="{ path: breadcrumb.btwoUrl }">{{ breadcrumb.btwo }}</el-breadcrumb-item>
                <el-breadcrumb-item v-else>{{ breadcrumb.btwo }}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="breadcrumb.bthree">{{ breadcrumb.bthree }}</el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>
</template>

<script>
/**
 * 页内顶部面包屑导航组件
 * ps: 暂时只支持3级，因为在实际应用中超过3级是很蠢的行为
 * @bone 一级标题
 * @boneUrl 一级路由
 * @btwo 二级标题
 * @btwoUrl 二级路由
 * @bthree 三级标题
 */
import '@/static/style/fengModule/breadcrumb.scss'

export default {
    name: 'breadcrumb',
    data() {
        return {

        }
    },
    computed: {
        breadcrumb() { return this.$store.getters.breadcrumb }
    }
}
</script>
