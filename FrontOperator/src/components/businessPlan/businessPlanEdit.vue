<template>
    <section>
        <!--工具条-->
        <div>
            <el-col :span="24" class="businessPlanBorder">
                <el-form :inline="true" :model="updateForm">
                    <el-form-item>
                        <span class="demonstration">模板编号：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="系统自动生成，不可修改" v-model="updateForm.code" :disabled="true">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <span class="demonstration">模板名称：</span>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="updateForm.name" placeholder="请输入模板名称" @blur="updateTemplate"></el-input>
                    </el-form-item>
                    <el-col :span="24">
                        <el-form-item label="启用开关">
                            <el-switch v-model="updateForm.status" on-value="1" off-value="0" on-color="#407ef5" off-color="#ff4949" @change="changeStatus">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="24" class="businessPlanBorder">
                <el-form :inline="true" :model="searchForm">
                    <el-form-item>
                        <span class="demonstration">国际条码</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="searchForm.barCode" filterable remote placeholder="请输入国际条码" :remote-method="remoteBarCodeSearch" @change="selectBarCodeSearch" :loading="loading">
                            <el-option v-for="item in remoteBarCodeSearchOptions1" :key="item.barCode" :label="item.barCode" :value="item.barCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <span class="demonstration">商品名称</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="searchForm.productName" filterable remote placeholder="请输入商品名称" :remote-method="remoteProductNameSearch" @change="selectProductNameSearech" :loading="loading">
                            <el-option v-for="item in remoteProductNameSearchOptions1" :key="item.productId" :label="item.productName" :value="item.productName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <span class="demonstration">商品ID</span>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="searchForm.productId" filterable remote placeholder="请输入商品ID" :remote-method="remoteProductIdSearch" @change="selectProductIdSearch" :loading="loading">
                            <el-option v-for="item in remoteProductIdSearchOptions1" :key="item.productId" :label="item.productId" :value="item.productId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="warning" @click="outportTemplate" style="background:#ec6d1e;border-color:#ec6d1e">导出经营模板</el-button>
                    </el-form-item>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button type="success" @click="getModuleData(1)" style="background:#09bb07">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="resetForm('searchForm')" style="background:#407ef5">清空</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
        </div>
        <!--列表-->
        <!-- class="el-item pdd-10" -->
        <template>
            <el-col class="el-item pdd-10">
                <el-col :span="24" style="margin:10px 0;">
                    <!-- GET /api/manageTemplate/downManageTemplateExcel -->
                    <el-upload :disabled="manageTemplateId =='new'" style="display:inline-block" class="upload-demo" :action="`${product_host}/manageTemplate/impManageTemplateExcel`" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :with-credentials="true" :data="uploadData">
                        <el-button size="small" type="primary" style="background:#407ef5">批量导入更新</el-button>
                    </el-upload>
                    <el-button size="small" type="primary" class="ex-moban-down" @click="com.openUrl(`${product_host}/manageTemplate/downManageTemplateExcel`)" style="background: #fff;border: none;color: #407ef5;text-decoration: underline;">导入格式下载</el-button>
                </el-col>
                <el-table border :data="moduleData.list" highlight-current-row v-loading="loading" style="width: 100%;">
                    <el-table-column type="selection" width="60" align="center">
                    </el-table-column>
                    <el-table-column label="删除" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button @click="deleteLine(scope.row.manageTemplateProductId,scope.$index)" style="border:none">
                                <i class="el-icon-delete"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="barCode" label="国际条码" width="200" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-select :disabled="scope.row.manageTemplateProductId!=undefined" v-model="scope.row.barCode" filterable remote placeholder="请输入国际条码" :remote-method="remoteBarCode" @change="selectBarCode" :loading="loading">
                                <el-option v-for="item in remoteBarCodeOptions" :key="item.barCode" :label="item.barCode" :value="item.barCode">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productId" label="商品ID" width="200" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- :disabled="scope.row.manageTemplateProductId != ''" -->
                            <el-select :disabled="scope.row.manageTemplateProductId!=undefined" v-model="scope.row.productId" filterable remote placeholder="请输入商品ID" :remote-method="remoteProductId" @change="selectGoodById" :loading="loading">
                                <el-option v-for="item in remoteProductIdOptions" :key="item.productId" :label="item.productId" :value="item.productId">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productName" label="商品名称" width="120" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="packDictName" label="包装" min-width="100" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="specificationName" label="规格" min-width="100" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.specificationName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" label="商品数量" min-width="180" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button icon="minus" size="mini" @click="scope.row.number=(scope.row.number<=0?0:(scope.row.number-1))" style="border:none"></el-button>
                            <el-input type="text" v-model="scope.row.number" style="width:80px"></el-input>
                            <el-button icon="plus" size="mini" @click="scope.row.number++" style="border:none"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="100" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.manageTemplateProductId" @click="addLine(scope.row.productId,scope.row.number)" type="primary" style="background:#407ef5">添加</el-button>
                            <el-button v-if="scope.row.manageTemplateProductId" @click="updateLine(scope.row.manageTemplateProductId,scope.row.number,scope.row.productId)" type="primary" style="background:#407ef5">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-col :span="24" class="toolbar">
                    <el-button type="primary" size="mini" v-on:click="addNewProduct" :disabled="addNewLinevalue">+</el-button>
                </el-col>
                <el-pagination @current-change="handleCurrentChange" :page-size="20" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="moduleData.total"></el-pagination>
                <!-- <feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="1"></feng-pagination> -->
            </el-col>
            <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
                <span>确认要删除此条数据吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </template>

    </section>
</template>

<style>
.businessPlanBorder {
    padding: 10px 10px 0 10px;
    margin: 10px 0;
    border: 1px solid #e0e0e0;
    background: #fff;
}
</style>

<script>
import fengPagination from '@/components/fengModule/pagination.vue'
import { mapGetters } from 'vuex'
import { basicConfig } from '@/config/config.js';
import '@/static/style/warehouse/list.scss'
//import NProgress from 'nprogress'
export default {
    components: {
        fengPagination
    },
    data() {
        return {
            uploadData: {
                manageTemplateId: ''
            },
            updateForm: {
                code: '',
                name: '',
                status: '1',
                manageTemplateId: this.manageTemplateId
            },
            searchForm: {
                barCode: '',
                productName: '',
                productId: '',
            },
            moduleData: {
                list: [],
                total: 0
            },
            product_host: basicConfig.PRODUCT_HOST,
            loading: false,
            dialogVisible: false,
            total: 0,
            page: 1,
            pageSize: 20,
            currentPage: 1,
            manageTemplateId: '',
            remoteBarCodeOptions: [],
            remoteBarCodeOptions1: [],
            remoteProductCodeOptions: [],
            remoteProductCodeOptions1: [],
            remoteBarCodeSearchOptions: [],
            remoteBarCodeSearchOptions1: [],
            remoteProductIdOptions: [],
            remoteProductIdOptions1: [],
            remoteProductIdSearchOptions: [],
            remoteProductIdSearchOptions1: [],
            remoteProductNameSearchOptions: [],
            remoteProductNameSearchOptions1: [],
            searchFlag: false,
            addNewLinevalue: false
        }
    },
    created() {
        this.manageTemplateId = this.$route.params.id;

        let param = {
            bone: '经营模板',
            boneUrl: '/businessPlan/businessPlanList',
            btwo: '编辑经营模板'
        };
        this.$store.dispatch('switchBreadcrumb', param);
        this.uploadData.manageTemplateId = this.manageTemplateId;
        this.getModuleData(1);
        this.getTemplateDetail();
    },
    methods: {
        //状态显示转换
        formatStatus: function(row, column) {
            return row.status == 1 ? '启用' : '停用';
        },
        disabledValue: function(row, column) {
            return row.manageTemplateProductId == null ? false : true;
        },
        getTemplateDetail() {
            // GET /api/manageTemplate/getById/{manageTemplateId}
            this.$api.apiCommunicationGet('/manageTemplate/getById/' + this.manageTemplateId, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                }
                this.updateForm = res.data;
                this.uploadData.manageTemplateId = res.data.manageTemplateId;
                this.updateForm.status = res.data.status + '';
            }, 'product');
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getModuleData(val);
        },
        addNewProduct() {
            if (this.manageTemplateId == 'new') {
                this.$alert(`提示：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                return;
            }
            this.addNewLinevalue = true;
            this.searchFlag = true;
            var obj = {};
            this.moduleData.list.push(obj);
        },
        getModuleData(pageNum) {
            if ('new' == this.manageTemplateId) {
                return;
            }
            let param = {
                "manageTemplateId": this.manageTemplateId,
                "pageNum": pageNum,
                "pageSize": 20

            }
            if (this.searchForm.productId) {
                param.productId = this.searchForm.productId
            }
            // 获取数据
            this.moduleData.list = [];
            // this.param.pageNum = pageNum || 1;
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/manageTemplate/getProductList', param, res => {
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
                this.addNewLinevalue = false;
            }, 'product')
        },
        resetForm(formName) {
            this.searchForm.barCode = '';
            this.searchForm.productName = '';
            this.searchForm.productId = '';
        },
        changeStatus() {
            if (this.manageTemplateId == 'new') {
                this.$alert(`提示：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                return;
            }
            this.updateTemplate();
        },
        updateTemplate: function() {
            if (!this.updateForm.name) {
                return;
            }
            //新增模板
            if ('new' == this.manageTemplateId) {
                this.$store.dispatch('switchLoadingStatus', true);
                this.$api.apiCommunication('/manageTemplate/save', this.updateForm, res => {
                    this.$store.dispatch('switchLoadingStatus', false)
                    if (res.code != 2000) {
                        this.moduleData = {
                            list: [],
                            total: 0
                        };
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.manageTemplateId = res.data;
                    this.uploadData.manageTemplateId = this.manageTemplateId;
                    this.total = res.total;
                    this.getTemplateDetail();
                    this.$notify({ title: '系统通知', message: '新增成功！', type: 'success' });
                }, 'product')
            } else {
                //更新
                this.updateForm.manageTemplateId = this.manageTemplateId;
                this.$store.dispatch('switchLoadingStatus', true);
                this.$api.apiCommunication('/manageTemplate/update', this.updateForm, res => {
                    this.$store.dispatch('switchLoadingStatus', false)
                    if (res.code != 2000) {
                        this.moduleData = {
                            list: [],
                            total: 0
                        };
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    // this.getTemplateDetail();
                    this.$notify({ title: '系统通知', message: '修改成功！', type: 'success' });
                }, 'product')
            }
        },
        handleAvatarSuccess(res, file, fileList) {
            if (res.code != 2000) {
                if (res.data != null) {
                    this.$alert(`导入失败，服务器返回信息：${res.data}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
                } else {
                    this.$alert(`导入失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
                    fileList = [];
                    return false;
                }
            } else {
                this.$alert(`导入成功`, '系统通知', { confirmButtonText: '确定', type: 'success' })
                this.getModuleData();
            }
        },
        handleAvatarError(res) {
            this.$alert(`导入失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
        },
        remoteBarCode(query) {
            if (!this.searchFlag) {
                return;
            }
            if (query) {
                if (this.manageTemplateId == 'new') {
                    this.$alert(`提示：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return;
                }
                this.loading = true;
                let param = {
                    "manageTemplateId": this.manageTemplateId,
                    "barCode": query
                }
                this.$api.apiCommunication('/manageTemplate/getProductListByCodeOrId', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.remoteBarCodeOptions = res.data;
                    this.remoteBarCodeOptions1 = res.data;
                }, 'product')
            } else {
                this.remoteBarCodeOptions = [];
            }
        },
        selectBarCode(code) {
            var length = this.moduleData.list.length;
            for (let i = 0; i < this.remoteBarCodeOptions1.length; i++) {
                if (this.remoteBarCodeOptions1[i].barCode == code) {
                    this.moduleData.list[length - 1] = this.remoteBarCodeOptions1[i];
                    this.moduleData.list[length - 1].productCode = this.remoteBarCodeOptions1[i].productCode;
                    this.moduleData.list[length - 1].barCode = this.remoteBarCodeOptions1[i].barCode;
                    this.moduleData.list[length - 1].productName = this.remoteBarCodeOptions1[i].productName;
                    this.moduleData.list[length - 1].firstClassificationName = this.remoteBarCodeOptions1[i].firstClassificationName;
                    this.moduleData.list[length - 1].secondClassificationName = this.remoteBarCodeOptions1[i].secondClassificationName;
                    this.moduleData.list[length - 1].thirdClassificationName = this.remoteBarCodeOptions1[i].thirdClassificationName;
                    this.moduleData.list[length - 1].packDictName = this.remoteBarCodeOptions1[i].packDictName;
                    return;
                }
            }
        },
        remoteProductId(query) {
            if (!this.searchFlag) {
                return;
            }
            if (query) {
                if (this.manageTemplateId == 'new') {
                    this.$alert(`服务器返回信息：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return;
                }
                this.loading = true;
                let param = {
                    "productId": query,
                    "manageTemplateId": this.manageTemplateId,
                    "pageSize": 20,
                }
                this.$api.apiCommunication('/manageTemplate/getProductListByCodeOrId', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.remoteProductIdOptions1 = res.data;
                    this.remoteProductIdOptions = res.data;
                }, 'product')
            } else {
                this.remoteProductIdOptions = [];
            }
        },
        selectGoodById(code) {
            var length = this.moduleData.list.length;
            for (let i = 0; i < this.remoteProductIdOptions1.length; i++) {
                if (this.remoteProductIdOptions1[i].productId == code) {
                    this.moduleData.list[length - 1] = this.remoteProductIdOptions1[i];
                    this.moduleData.list[length - 1].productCode = this.remoteProductIdOptions1[i].productCode;
                    this.moduleData.list[length - 1].barCode = this.remoteProductIdOptions1[i].barCode;
                    this.moduleData.list[length - 1].productName = this.remoteProductIdOptions1[i].productName;
                    this.moduleData.list[length - 1].firstClassificationName = this.remoteProductIdOptions1[i].firstClassificationName;
                    this.moduleData.list[length - 1].secondClassificationName = this.remoteProductIdOptions1[i].secondClassificationName;
                    this.moduleData.list[length - 1].thirdClassificationName = this.remoteProductIdOptions1[i].thirdClassificationName;
                    this.moduleData.list[length - 1].packDictName = this.remoteProductIdOptions1[i].packDictName;
                    return;
                }
            }
        },
        remoteBarCodeSearch(query) {

            if (query) {
                if (this.manageTemplateId == 'new') {
                    this.$alert(`提示：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return;
                }
                this.loading = true;
                let param = {
                    "manageTemplateId": this.manageTemplateId,
                    "barCode": query,
                    "pageSize": 20   //搜索默认20条数据
                }
                // POST /api/manageTemplate/getProductList
                this.$api.apiCommunication('/manageTemplate/getProductList', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.remoteBarCodeSearchOptions1 = res.data.list;
                    this.remoteBarCodeSearchOptions = res.data.list;
                }, 'product')
            } else {
                this.remoteBarCodeSearchOptions = [];
            }
        },
        selectBarCodeSearch(code) {
            for (let i = 0; i < this.remoteBarCodeSearchOptions1.length; i++) {
                if (code == this.remoteBarCodeSearchOptions1[i].barCode) {
                    this.searchForm.productName = this.remoteBarCodeSearchOptions1[i].productName;
                    this.searchForm.productId = this.remoteBarCodeSearchOptions1[i].productId;
                    break;
                }
            }
        },
        remoteProductIdSearch(query) {
            if (query) {
                if (this.manageTemplateId == 'new') {
                    this.$alert(`服务器返回信息：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return;
                }
                this.loading = true;
                let param = {
                    "manageTemplateId": this.manageTemplateId,
                    "productId": query,
                    "pageSize": 20
                }
                this.$api.apiCommunication('/manageTemplate/getProductList', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.remoteProductIdSearchOptions1 = res.data.list;
                    this.remoteProductIdSearchOptions = res.data.list;
                }, 'product')
            } else {
                this.remoteProductIdSearchOptions = [];
            }
        },
        selectProductIdSearch(id) {
            for (let i = 0; i < this.remoteProductIdSearchOptions1.length; i++) {
                if (id == this.remoteProductIdSearchOptions1[i].productId) {
                    this.searchForm.barCode = this.remoteProductIdSearchOptions1[i].barCode;
                    this.searchForm.productName = this.remoteProductIdSearchOptions1[i].productName;
                    break;
                }
            }
        },
        remoteProductNameSearch(query) {
            if (query) {
                if (this.manageTemplateId == 'new') {
                    this.$alert(`提示：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return;
                }
                this.loading = true;
                let param = {
                    "manageTemplateId": this.manageTemplateId,
                    "productName": query,
                    "pageSize": 20
                }
                this.$api.apiCommunication('/manageTemplate/getProductList', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.remoteProductNameSearchOptions1 = res.data.list;
                    this.remoteProductNameSearchOptions = res.data.list;
                }, 'product')
            } else {
                this.remoteProductNameSearchOptions = [];
            }
        },
        selectProductNameSearech(name) {
            for (let i = 0; i < this.remoteProductNameSearchOptions1.length; i++) {
                if (name == this.remoteProductNameSearchOptions1[i].productName) {
                    this.searchForm.barCode = this.remoteProductNameSearchOptions1[i].barCode;
                    this.searchForm.productId = this.remoteProductNameSearchOptions1[i].productId;
                    break;
                }
            }
        },
        deleteLine(manageTemplateProductId, aaa) {
            if (!manageTemplateProductId) {
                this.moduleData.list.splice(aaa, 1);
                this.addNewLinevalue = false;
                return;
            }
            this.$confirm("确定要删除吗？", "系统通知", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$api.apiCommunicationGet('/manageTemplate/delByTemplateProudctId/' + manageTemplateProductId + '/' + this.manageTemplateId, res => {
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.getModuleData();
                });
            })

        },
        addLine(productId, purchaseNumber) {
            let para = {
                "manageTemplateId": this.manageTemplateId,
                "productId": productId,
                "number": purchaseNumber
            };
            // POST /api/supplierProduct/save
            this.$api.apiCommunication('/manageTemplate/saveProduct', para, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                this.getModuleData();
                this.$notify({ title: '系统通知', message: '新增成功！', type: 'success' });
            });
        },
        updateLine(id, number, productId) {
            let para = {
                "manageTemplateProductId": id,
                "number": number,
                "manageTemplateId": this.manageTemplateId,
                "productId": productId,
            };
            // POST POST /api/manageTemplate/updateProduct
            this.$api.apiCommunication('/manageTemplate/updateProduct', para, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                this.getModuleData();
                this.$notify({ title: '系统通知', message: '新增成功！', type: 'success' });
            });
        },
        //导出经营模板
        outportTemplate() {
            if (this.manageTemplateId == 'new') {
                this.$alert(`提示：没有模板,请添加模板`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                return;
            }
            let token = this.$store.getters.getToken,
                manageTemplateId = this.manageTemplateId,
                url = `${basicConfig.PRODUCT_HOST}/manageTemplate/product/export?manageTemplateId=${manageTemplateId}`,
                _data = this.searchForm;
            _data.manageTemplateId = this.$route.params.id;
            url += `&manageTemplateId=${_data.manageTemplateId}`

            let _win = window.open();
            _win.location = url;
            //              _win.close();
        },
        handleClose: function(id) {
            this.$confirm('确认关闭？').then(_ => {
                done();
            }).catch(_ => { });
        },
    }
};

</script>

<style scoped>

</style>