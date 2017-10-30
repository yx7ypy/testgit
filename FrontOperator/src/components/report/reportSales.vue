<template>
    <div class="report-sales">
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                <div class="toolbar-from">
                    <el-form :model="toolbarForm" ref="toolbarForm" :inline="true" @submit.prevent.native label-width="80px">
                        <el-form-item label="盒子编号" prop="boxno">
                            <el-input placeholder="请输入盒子编号" v-model="toolbarForm.boxno"></el-input>
                        </el-form-item><br>
                        <el-form-item label="商品编号" prop="productNum">
                            <el-input placeholder="请输入商品编号" v-model="toolbarForm.productNum"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="productName">
                            <el-input placeholder="请输入商品名称" v-model="toolbarForm.productName"></el-input>
                        </el-form-item>
                        <el-form-item label="商品条码" prop="code">
                            <el-input placeholder="请输入商品条码" v-model="toolbarForm.code"></el-input>
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
                    <el-table-column prop="code" label="国际条码" width="130" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="productNum" label="商品编号" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="productName" label="商品名称" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="salesAmount" label="销量" width="120" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="sales" label="销售额" width="160" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="rate" label="毛利率%" width="100" header-align="center" align="center"></el-table-column>
    			</el-table>
                <feng-pagination :total="moduleData.count" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
    		</el-col>
    	</el-row>
    </div>
</template>

<script>
// 销售明细报表
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
                        code: '232321516556',
                        productNum: '56211344652307',
                        productName: '红牛',
                        salesAmount: 100,
                        sales: '300.0',
                        rate: '20%'
                    }
                ],
                count: 1
            },
            toolbarForm: {
                boxno: '',
                productNum: '',
                productName: '',
                code: '',
                startTime: '',
                endTime: ''
            }
        }
    },
    created() {
        this.$store.dispatch('switchBreadcrumb', { bone: '销售明细报表' })
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
                        data: 10000,
                        text: '销量'
                    },
                    {
                        data: '165200.14',
                        text: '销售额'
                    },
                    {
                        data: '165000.00',
                        text: '成本'
                    },
                    {
                        data: '20%',
                        text: '毛利率'
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
