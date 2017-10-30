<template>
    <div class="report-income">
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                <div class="toolbar-from">
                    <el-form :model="toolbarForm" ref="toolbarForm" :inline="true" @submit.prevent.native label-width="80px">
                        <el-form-item label="盒子编号" prop="boxno">
                            <el-input placeholder="请输入编号" v-model="toolbarForm.boxno"></el-input>
                        </el-form-item>
                        <el-form-item label="支付方式" prop="payType">
                            <el-select v-model="toolbarForm.payType" filterable clearable placeholder="支付方式" no-data-text="没有数据">
                                <el-option label="所有" value="0"></el-option>
                                <el-option label="微信" value="1"></el-option>
                                <el-option label="支付宝" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="时间范围" class="mar-bottom0">
                            <el-date-picker v-model="toolbarForm.startTime" type="date" placeholder="开始日期"></el-date-picker>
                            至
                            <el-date-picker v-model="toolbarForm.endTime" type="date" placeholder="截止日期"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="toolbar-function">
                    <p>
                        <el-button type="warning" @click="">导出EXCEL</el-button>
                    </p>
                    <p class="mar-top10">
                        <el-button type="success" @click="">查询</el-button>
                        <el-button type="primary" @click="resetForm('toolbarForm')">清空</el-button>
                    </p>
                </div>
            </el-col>
        </el-row>
        <feng-gridoverview :module="module" class="mar-bottom10"></feng-gridoverview>
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10">
                <el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus">
                    <el-table-column prop="boxno" label="盒子编号" width="110" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="orderNum" label="订单号" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="sales" label="销售额" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="money" label="实收金额" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="type" label="支付方式" width="100" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="date" label="支付时间" width="160" header-align="center" align="center"></el-table-column>
    			</el-table>
                <feng-pagination :total="moduleData.count" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
    		</el-col>
    	</el-row>
    </div>
</template>

<script>
// 销售收款报表
import fengGridoverview from '@/components/fengModule/gridOverview.vue'
import fengPagination from '@/components/fengModule/pagination.vue'
import { mapGetters } from 'vuex'
import '@/static/style/report/report.scss'

export default {
    data() {
        return {
            moduleData: {
                list: [
                    {
                        id: 22,
                        boxno: '23232',
                        orderNum: '56211344652307',
                        sales: '300.0',
                        money: '200.0',
                        type: '微信',
                        date: '2017-7-3 03:28:30'
                    }
                ],
                count: 1
            },
            toolbarForm: {
                boxno: '',
                payType: '0',
                startTime: '',
                endTime: ''
            }
        }
    },
    created() {
        this.$store.dispatch('switchBreadcrumb', { bone: '商品入盒报表' })
    },
    computed: {
        ...mapGetters([
            // 'provinceList',
            // 'cityList',
            // 'areaList',
            'loadingStatus',
            // 'currentPage'
        ]),
        module() {
            let _module = [
                    {
                        data: '10000.0',
                        text: '实收总金额'
                    },
                    {
                        data: '10000.0',
                        text: '微信金额'
                    },
                    {
                        data: '10000.0',
                        text: '支付宝金额'
                    }
                ]
            return _module
        }
    },
    methods: {
        handleCurrentChange(val) {
            // this.$store.dispatch('saveCurrentPage', { toolbarForm: this.toolbarForm, page: val, status: true, pathName: 'boxList' })
            // this.getModuleData({ page: val })
        },
        resetForm(formName) {
            this.toolbarForm.startTime = ''
            this.toolbarForm.endTime = ''
            this.$refs[formName].resetFields()
        }
    },
    components: {
        fengGridoverview,
        fengPagination
    }
}
</script>
