<template>
	<div>
		<el-pagination @current-change="handleCurrentChange" :page-size="10" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>

	</div>
</template>

<script>
/**
 * 封装的分页组件
 * @total 总数据
 * @currentPage 当前页码
 */

export default{
    props: {
        total: Number,
        currentPage: {
			type: Number,
			default: 1
		}
    },
    data() {
        return {}
    },
    methods: {
        handleCurrentChange(val) {
            // 通知父组件更新页码
            this.$emit('handle', val)
        }
    }
}
</script>

<style>
.el-pagination {
	text-align: right;
	margin-top: 25px;
}
</style>
