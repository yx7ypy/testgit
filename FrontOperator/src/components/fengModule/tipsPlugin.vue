<template>
    <el-row class="mar-bottom10">
        <el-col :span="24" class="el-item pdd-10">
            <div class="tips-plugin">
                <img src="../../static/img/gray-logo.png" alt="logo">
                <p class="tips-text">{{ tips }}</p>
            </div>
        </el-col>
    </el-row>
</template>

<script>
/**
 * 提示框
 * @tips 提示文本
 */
import '@/static/style/fengModule/tipsPlugin.scss'

export default {
    name: 'tipsplugin',
    props: {
        tips: String
    },
    data() {
        return {}
    }
}
</script>
