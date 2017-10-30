<template>
    <el-button :type="type" :icon="iconname" @click="cancel" :disabled="disabled" :size="size">{{ solttitle }}</el-button>
</template>

<script>
/**
 * 返回上一页按钮组件
 * @type 按钮类型
 * @icon 是否显示向左的图标
 * @solttitle 按钮文字
 * @disabled 是否禁用
 * @size 按钮大小
 */

export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        icon: {
            type: Boolean,
            default: false
        },
        solttitle: {
            type: String,
            default: '取消'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    },
    computed: {
        iconname() { return this.icon ? 'arrow-left' : '' }
    },
    methods: {
        cancel() {
            this.$router.go(-1)
        }
    }
}
</script>
