<template>
    <div class="report-intobox">
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                <div class="toolbar-from">
                    <el-form :model="toolbarForm" ref="toolbarForm" :inline="true" @submit.prevent.native label-width="100px">
                        <el-form-item label="盒子编号" prop="boxno">
                            <el-input placeholder="请输入编号" v-model="toolbarForm.boxno"></el-input>
                        </el-form-item>
                        <el-form-item label="入盒单号" prop="intoBoxNum">
                            <el-input placeholder="请输入单号" v-model="toolbarForm.intoBoxNum"></el-input>
                        </el-form-item>
                        <el-form-item label="选择品类">
                            <el-select v-model="toolbarForm.levelOne" filterable clearable placeholder="一级品类" no-data-text="没有数据"></el-select>
                            <el-select v-model="toolbarForm.levelTwo" filterable clearable placeholder="二级品类" no-data-text="没有数据"> </el-select>
                            <el-select v-model="toolbarForm.levelThree" filterable clearable placeholder="三级品类" no-data-text="没有数据"> </el-select>
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
                        <el-form-item label="商品入盒日期" class="mar-bottom0">
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
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10">
                <el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus">
                    <el-table-column prop="boxno" label="盒子编号" width="110" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="intoboxNum" label="入盒单号" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="productNum" label="商品编号" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="code" label="国际条码" width="150" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="name" label="商品名称" header-align="center" align="center"></el-table-column>
                    <el-table-column label="一级品类/二级品类/三级品类" width="200" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{ `${scope.row.levelOne}/${scope.row.levelTwo}/${scope.row.levelThree}` }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="售价" width="100" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="intoboxAmount" label="入盒数量" width="100" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="date" label="入盒日期" width="160" header-align="center" align="center"></el-table-column>
    			</el-table>
                <feng-pagination :total="moduleData.count" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
    		</el-col>
    	</el-row>
    </div>
</template>

<script>
// 入盒报表
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
                        intoboxNum: '5644652307',
                        productNum: '4564321232',
                        code: '213215552',
                        name: '红牛',
                        levelOne: '酒水饮料',
                        levelTwo: '饮料',
                        levelThree: '功能饮料',
                        price: '3.00',
                        intoboxAmount: 100,
                        date: '2017-7-3 03:28:30'
                    }
                ],
                count: 1
            },
            toolbarForm: {
                boxno: '',
                intoBoxNum: '',
                levelOne: '',
                levelTwo: '',
                levelThree: '',
                productNum: '',
                productName: '',
                code: '',
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
            this.toolbarForm.startTime = ''
            this.toolbarForm.endTime = ''
            this.$refs[formName].resetFields()
        }
    },
    components: {
        fengPagination
    }
}
</script>
