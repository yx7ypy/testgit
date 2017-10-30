<template>
    <div class="report-intobox">
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                <div class="toolbar-from">
                    <el-form :model="toolbarForm" ref="toolbarForm" :inline="true" @submit.prevent.native label-width="100px">
                        <el-form-item label="盒子编号" prop="boxno">
                            <el-input placeholder="请输入编号" v-model="toolbarForm.boxno"></el-input>
                        </el-form-item><br>
                        <el-form-item label="选择品类">
                            <el-select v-model="toolbarForm.levelOne" filterable clearable placeholder="一级品类" no-data-text="没有数据"></el-select>
                            <el-select v-model="toolbarForm.levelTwo" filterable clearable placeholder="二级品类" no-data-text="没有数据"></el-select>
                            <el-select v-model="toolbarForm.levelThree" filterable clearable placeholder="三级品类" no-data-text="没有数据"></el-select>
                        </el-form-item><br>
                        <el-form-item label="商品编号" prop="productNum">
                            <el-input placeholder="请输入商品编号" v-model="toolbarForm.productNum"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="productName">
                            <el-input placeholder="请输入商品名称" v-model="toolbarForm.productName"></el-input>
                        </el-form-item>
                        <el-form-item label="国际条码" prop="code">
                            <el-input placeholder="请输入国际条码" v-model="toolbarForm.code"></el-input>
                        </el-form-item>
                        <el-form-item label="临近有效期" class="mar-bottom0" prop="valid">
                            <el-radio class="radio" v-model="toolbarForm.valid" label="1">12小时</el-radio>
                            <el-radio class="radio" v-model="toolbarForm.valid" label="2">7天</el-radio>
                            <el-radio class="radio" v-model="toolbarForm.valid" label="3">30天</el-radio>
                            <el-radio class="radio" v-model="toolbarForm.valid" label="4">90天</el-radio>
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
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10">
                <el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus">
                    <el-table-column prop="productNum" label="商品编号" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="code" label="国际条码" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="name" label="商品名称" header-align="center" align="center"></el-table-column>
                    <el-table-column label="一级品类/二级品类/三级品类" width="200" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{ `${scope.row.levelOne}/${scope.row.levelTwo}/${scope.row.levelThree}` }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cost" label="成本" width="100" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="boxno" label="盒子编号" width="110" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="boxReserve" label="盒子库存" width="130" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="reservePrice" label="库存总金额" width="130" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="turnover" label="库存周转天数(7天内)" width="180" header-align="center" align="center"></el-table-column>
    			</el-table>
                <feng-pagination :total="moduleData.count" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
    		</el-col>
    	</el-row>
    </div>
</template>

<script>
// 库存报表
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
                        productNum: '4564321232',
                        code: '213215552',
                        name: '红牛',
                        levelOne: '酒水饮料',
                        levelTwo: '饮料',
                        levelThree: '功能饮料',
                        cost: '3.00',
                        boxno: '23232',
                        boxReserve: 100,
                        reservePrice: '500.00',
                        turnover: '5'
                    }
                ],
                count: 1
            },
            toolbarForm: {
                boxno: '',
                levelOne: '',
                levelTwo: '',
                levelThree: '',
                productNum: '',
                productName: '',
                code: '',
                valid: '1'
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
        ])
    },
    methods: {
        handleCurrentChange(val) {
            // this.$store.dispatch('saveCurrentPage', { toolbarForm: this.toolbarForm, page: val, status: true, pathName: 'boxList' })
            // this.getModuleData({ page: val })
        },
        resetForm(formName) {
            this.toolbarForm.levelOne = ''
            this.toolbarForm.levelTwo = ''
            this.toolbarForm.levelThree = ''
            this.$refs[formName].resetFields()
        }
    },
    components: {
        fengPagination
    }
}
</script>
