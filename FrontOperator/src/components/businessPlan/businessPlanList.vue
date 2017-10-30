<template>
    <section>
        <!--工具条-->
        <div>
            <el-col :span="24" class="suppliersbar">
                <el-form :inline="true" :model="searchForm" ref="aaa">
                    <el-form-item>
                        <span class="demonstration">模板编号：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="searchForm.code" filterable remote placeholder="请输入模板编号" :remote-method="remoteCode" @change="selectCode" :loading="loading">
                            <el-option v-for="item in codeOptions" :key="item.code" :label="item.code" :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <span class="demonstration">模板名称：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="searchForm.name" filterable remote placeholder="请输入模板名称" :remote-method="remoteName" @change="selectName" :loading="loading">
                            <el-option v-for="item in nameOptions" :key="item.name" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="getModuleData(1)" style="background:#09bb07">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="resetForm('filters')" style="background:#407ef5">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>

        <!--列表-->
        <template>
            <el-col :span="24" class="el-item pdd-10">
                <el-button type="warning" @click="addTemplate()" style="background:#ec6d1e">新增经营模板</el-button>
                <el-table border :data="moduleData.list" highlight-current-row v-loading="loading" style="width: 100%;">
                    <el-table-column prop="code" label="模板编号" width="140" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="模板名称" width="140" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="productBreedCount" align="center" label="商品品种" width="120">
                    </el-table-column>
                    <el-table-column prop="productCount" align="center" label="商品数量" width="120">
                    </el-table-column>
                    <el-table-column prop="lastUpdateTime" align="center" label="模板更新时间" min-width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.lastUpdateTime|convertTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" align="center" label="模板状态" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status==0">未启用</span>
                            <span v-if="scope.row.status==1" style="color: #13ce66;">启用中</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" min-width="180">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small" @click="editTemplate(scope.row.manageTemplateId)" style="background:#ec6d1e;border-color:#ec6d1e;">编辑经营模板</el-button>
                            <el-button type="primary" size="small" @click="deleteTemplate(scope.row.manageTemplateId)" style="background:#407ef5;border-color:#407ef5;">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
            </el-col>
        </template>

    </section>
</template>

<style>
.suppliersbar {
    padding: 20px 10px 0 10px;
    margin: 10px 0;
    border: 1px solid #e0e0e0;
    background: #fff;
}
</style>

<script>
import fengPagination from '@/components/fengModule/pagination.vue'
import { mapGetters } from 'vuex'
import '@/static/style/warehouse/list.scss'
//import NProgress from 'nprogress'
export default {
    components: { fengPagination },
    data() {
        return {
            searchForm: {
                name: '',
                code: ''
            },
            moduleData: {
                list: [],
                total: 0
            },
            total: 0,
            page: 1,
            pageSize: 5,
            loading: false,
            codeOptions: [],
            codeOptions1: [],
            nameOptions: [],
            nameOptions1: []
        }
    },
    created() {
        this.$store.dispatch('switchBreadcrumb', { bone: '经营模板管理' });
        this.getModuleData();
    },
    methods: {
        // formatStatus: function(row, column) {
        //     return row.status == 1 ? '启用' : '停用';
        // },
        getModuleData(pageNum) {
            // 获取数据
            this.searchForm.pageNum = pageNum || 1;
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/manageTemplate/getList', this.searchForm, res => {
                this.$store.dispatch('switchLoadingStatus', false)
                if (res.code != 2000) {
                    this.moduleData = {
                        list: [],
                        total: 0
                    };
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                this.moduleData = res.data;
                this.total = res.data.total;
            }, 'product')
        },
        selectCode: function(code) {
            var length = this.moduleData.list.length;
            for (let i = 0; i < this.codeOptions1.length; i++) {
                if (this.codeOptions1[i].code == code) {
                    this.searchForm.name = this.codeOptions1[i].name;
                    break;
                }
            }
        },
        selectName: function(name) {
            var length = this.moduleData.list.length;
            for (let i = 0; i < this.nameOptions1.length; i++) {
                if (this.nameOptions1[i].name == name) {
                    this.searchForm.code = this.nameOptions1[i].code;
                    break;
                }
            }
        },
        remoteCode: function(query) {
            if (query) {
                // this.loading = true;
                let param = {
                    "code": query
                }
                this.$api.apiCommunication('/manageTemplate/getListByCodeOrName', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.codeOptions = res.data;
                    this.codeOptions1 = res.data;
                }, 'product')
            } else {
                this.codeOptions = [];
            }
        },
        remoteName: function(query) {
            if (query) {
                // this.loading = true;
                let param = {
                    "name": query
                }
                this.$api.apiCommunication('/manageTemplate/getListByCodeOrName', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.nameOptions = res.data;
                    this.nameOptions1 = res.data;
                }, 'product')
            } else {
                this.nameOptions = [];
            }
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getModuleData(val);
        },

        resetForm(formName) {
            this.searchForm = {
                name: '',
                code: ''
            };
        },
        addTemplate: function() {
            this.$router.push({ name: 'businessPlanCreate', params: { id: 'new' } })
        },
        editTemplate: function(id) {
            this.$router.push({ name: 'businessPlanEdit', params: { id: id } })
        },
        deleteTemplate: function(id) {
            this.$api.apiCommunicationGet('/manageTemplate/delById/' + id, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                } else {
                    this.$notify({ title: '系统通知', message: '删除成功！', type: 'success' });
                    this.getModuleData();
                }
            });
        }
    },
    mounted() {

    }
};

</script>

<style scoped>

</style>