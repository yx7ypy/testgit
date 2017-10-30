<template>
    <section>
        <!--工具条-->
        <div>
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
                        <el-button type="warning" @click="outportTemplate">导出经营方案</el-button>
                    </el-form-item>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button type="primary" @click="getModuleData(1)" style="background:#09bb07">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="resetForm('searchForm')" style="background:#407ef5">清空</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
        </div>
        <!--列表-->
        <template>
            <el-col :span="24" style="margin:10px 0px 0px 0px;padding-right:20px;">
                <el-col :span="2" style="float:right">
                    <el-button type="warning" @click="dialogFormVisible = true" style="background:#ec6d1e">更换经营方案</el-button>
                </el-col>
                <el-col :span="2" style="width:72px;">
                     <el-button type="primary" size="small" style="background:#407ef5" @click="deleteLine()">批量删除</el-button>
                 </el-col>
                <el-col :span="2">
                    <el-upload style="display:inline-block;" class="upload-demo" :action="`${product_host}/manage/project/product/import`" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :with-credentials="true" :data="uploadData">
                        <el-button size="small" type="primary" style="background:#407ef5">批量导入更新</el-button>
                    </el-upload>
                </el-col>
                <el-button size="small" type="primary" class="ex-moban-down" @click="com.openUrl(`${product_host}/manage/project/download/template`)" style="background:inherit;border: none;color: black;text-decoration: none;">导入格式下载</el-button>

            </el-col>
            <el-table border :data="moduleData.list" highlight-current-row v-loading="loading" style="width: 100%;" @selection-change="changeFun">
                <el-table-column type="selection" width="50" align="center">
                </el-table-column>
                <el-table-column label="删除" width="70" align="center">
                    <template slot-scope="scope">
                        <el-button @click="deleteOneLine(scope.row.manageProjectProductId,scope.$index)" style="border:none">
                            <i class="el-icon-delete"></i>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="80" align="center">
                </el-table-column>
                <el-table-column prop="barCode" label="国际条码" width="200" align="center">
                    <template slot-scope="scope">
                        <el-select :disabled="scope.row.manageProjectProductId!=undefined" v-model="scope.row.barCode" filterable remote placeholder="请输入国际条码" :remote-method="remoteBarCode" @change="selectBarCode" :loading="loading">
                            <el-option v-for="item in remoteBarCodeOptions" :key="item.barCode" :label="item.barCode" :value="item.barCode">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="productId" label="商品ID" width="200" align="center">
                    <template slot-scope="scope">
                        <el-select :disabled="scope.row.manageProjectProductId!=undefined" v-model="scope.row.productId" filterable remote placeholder="请输入商品ID" :remote-method="remoteProductId" @change="selectGoodById" :loading="loading">
                            <el-option v-for="item in remoteProductIdOptions" :key="item.productId" :label="item.productId" :value="item.productId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称" width="120" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="packDictName" label="包装" min-width="100" align="center">
                </el-table-column>
                <el-table-column prop="specificationName" label="规格" min-width="100" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.specification}}{{scope.row.specificationName}}</span>	
                     </template>
                </el-table-column>
                <el-table-column prop="number" label="商品数量" min-width="180" align="center">
                    <template slot-scope="scope">
                        <el-button icon="minus" size="mini" @click="scope.row.number=(scope.row.number<=0?0:(scope.row.number-1))" style="border:none"></el-button>
                        <el-input type="text" v-model="scope.row.number" style="width:80px"></el-input>
                        <el-button icon="plus" size="mini" @click="scope.row.number++" style="border:none"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.manageProjectProductId" @click="addLine(scope.row.productId,scope.row.number,scope.row.barCode)" type="primary" style="background:#407ef5">添加</el-button>
                        <el-button v-if="scope.row.manageProjectProductId" @click="updateLine(scope.row.manageProjectProductId,scope.row.number)" type="primary" style="background:#407ef5">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="toolbar" style="margin-left:16px">
                <el-button type="primary" size="mini" v-on:click="addNewProduct" :disabled="addNewLinevalue">+</el-button>
            </el-col>
            <!--工具条-->
            <el-pagination @current-change="handleCurrentChange" :page-size="20" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="moduleData.total"></el-pagination>
            <!-- <feng-pagination :total="moduleData.total" :page-size="20" @handle="handleCurrentChange" :current-page="currentPage"></feng-pagination> -->
            <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
                <span>确认要删除此条数据吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="请选择更换的经营模板" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="" :label-width="formLabelWidth">
                        <span>请从现有的经营模板中选择一个进行替换，原有的经营模板方案将被覆盖。</span>
                    </el-form-item>

                    <el-form-item label="" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="请选择经营模板">
                            <el-option v-for="item in projectOptions" :key="item.manageTemplateId" :label="item.name" :value="item.manageTemplateId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">不应用</el-button>
                    <el-button type="primary" @click="application()">应 用</el-button>
                </div>
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
export default {
    components: {
        fengPagination
    },
    data() {
        return {
            uploadData: {
                boxId: this.$route.params.id
            },
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            updateForm: {
                code: '',
                name: '',
                setStatus: true,
                boxId: this.manageTemplateId
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
            dialogFormVisible: false,
            product_host: basicConfig.PRODUCT_HOST,
            loading: false,
            dialogVisible: false,
            currentPage:1,
            boxId: '',
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
            formLabelWidth: '120px',
            projectOptions: [],
            ids: [],
            addNewLinevalue:false
        }
    },
    created() {
        this.boxId = this.$route.params.id;
        this.getModuleData(1);
        this.getTemplateList();
        let para = {
            bone: '经营方案',
            boneUrl: '/box/boxList',
            btwo: this.$route.params.name + '经营方案'
        };
        this.$store.dispatch('switchBreadcrumb', para);
    },
    methods: {
        //状态显示转换
        formatStatus: function(row, column) {
            return row.status == 1 ? '启用' : '停用';
        },
        // POST /api/manageTemplate/getList
        getTemplateList: function() {
            let para = {
                "name": "",
                "code": "",
                "pageNum": 1,
                "pageSize": 9999,
                "status":1
            };
            this.$api.apiCommunication('/manageTemplate/getList', para, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                } else {
                    this.projectOptions = res.data.list;
                }
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getModuleData(val);
        },
        addNewProduct() {
            this.addNewLinevalue = true;
            this.searchFlag = true;
            var obj = {};
            this.moduleData.list.push(obj);
        },
        getModuleData(pageNum) {
            let param = {
                "boxId": this.boxId,
                "pageNum":pageNum,
                "pageSize":20
            }
            if (this.searchForm.productId) {
                param.productId = this.searchForm.productId
            }
            // 获取数据
            // POST /api/manage/project/product/list
            this.moduleData.list = [];
            // this.searchForm.pageNum = pageNum || 1;
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/manage/project/product/list', param, res => {
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
        updateTemplate: function() {
            if (!this.updateForm.name) {
                return;
            }
            if (this.updateForm.setStatus == true) {
                this.updateForm.status = 1;
            } else {
                this.updateForm.status = 0;
            }
            //新增模板
            if ('new' == this.boxId) {
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
                    this.boxId = res.data;
                    this.total = res.total;
                }, 'product')
            } else {
                //更新
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
                this.loading = true;
                let param = {
                    "boxId": this.boxId,
                    "barCode": query,
                    "pageSize":20
                }
                //POST /api/manage/project/product/searchProductByParam
                this.$api.apiCommunication('/manage/project/product/searchProductByParam', param, res => {
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
                }
            }
        },
        remoteProductId(query) {
            if (!this.searchFlag) {
                return;
            }
            if (query) {
                this.loading = true;
                let param = {
                    "productId": query,
                    "boxId": this.boxId,
                    "pageSize":20
                }
                this.$api.apiCommunication('/manage/project/product/searchProductByParam', param, res => {
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
                }
            }
        },
        remoteBarCodeSearch(query) {
            if (query) {
                this.loading = true;
                let param = {
                    "boxId": this.boxId,
                    "barCode": query,
                    "pageSize": 20   //搜索默认20条数据
                }
                // POST /api/manageTemplate/getProductList
                this.$api.apiCommunication('/manage/project/product/list', param, res => {
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
                this.loading = true;
                let param = {
                    "boxId": this.boxId,
                    "productId": query,
                    "pageSize":20
                }
                this.$api.apiCommunication('/manage/project/product/list', param, res => {
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
                this.loading = true;
                let param = {
                    "boxId": this.boxId,
                    "productName": query,
                    "pageSize": 20
                }
                this.$api.apiCommunication('/manage/project/product/list', param, res => {
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
        deleteLine(manageProjectProductId, index) {
            let para = {
                ids: this.ids
            };
            this.$confirm("确定要删除吗？", "系统通知", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                // POST /api/manage/project/product/delete
                this.$api.apiCommunication('/manage/project/product/delete', para, res => {
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.getModuleData();
                    this.$alert(`服务器返回信息：删除成功`, '系统通知', { confirmButtonText: '确定', type: 'success' });

                });
            })

        },
        deleteOneLine(manageProjectProductId, index) {
            if (!manageProjectProductId) {
                this.moduleData.list.splice(index, 1);
                this.addNewLinevalue = false;
                return;
            }
            let para = {
                ids: []
            };
            para.ids[0] = manageProjectProductId;
            this.$confirm("确定要删除吗？", "系统通知", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                // POST /api/manage/project/product/delete
                this.$api.apiCommunication('/manage/project/product/delete', para, res => {
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.getModuleData();
                    this.$alert(`服务器返回信息：删除成功`, '系统通知', { confirmButtonText: '确定', type: 'success' });

                });
            })
        },
        addLine(productId, purchaseNumber, barCode) {
            let para = {
                "boxId": this.boxId,
                "productId": productId,
                "number": purchaseNumber,
                "barCode": barCode,
            };
            // POST /api/manage/project/product/add
            this.$api.apiCommunication('/manage/project/product/add', para, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                this.getModuleData();
                this.$notify({ title: '系统通知', message: '新增成功！', type: 'success' });
            });
        },
        updateLine(manageProjectProductId, number) {
            let para = {
                "manageProjectProductId": manageProjectProductId,
                "number": number
            };
            // POST /api/manage/project/product/update
            this.$api.apiCommunication('/manage/project/product/update', para, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                } else {
                    this.getModuleData();
                    this.$notify({ title: '系统通知', message: '新增成功！', type: 'success' });
                }
            });
        },
        //导出经营模板
        outportTemplate() {
            let token = this.$store.getters.getToken,
                boxId = this.boxId,
                url = `${basicConfig.PRODUCT_HOST}/manage/project/product/export?boxId=${boxId}`,
                _data = this.searchForm;
            _data.boxId = this.$route.params.id;
            url += `&boxId=${_data.boxId}`

            let _win = window.open();
            _win.location = url;
            //              _win.close();
        },
        // 多行选中
        changeFun: function(val) {
            var deleteIds = [];
            for (var i = 0; i < val.length; i++) {
                if (val[i].manageProjectProductId) {
                    deleteIds.push(val[i].manageProjectProductId);
                } else {
                    continue;
                }

            }
            this.ids = deleteIds;
        },
        application: function() {
            let para = {
                "boxId": this.boxId,
                "manageTemplateId": this.form.region,
            };
            this.$api.apiCommunication('/manage/project/template/add', para, res => {
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                } else {
                    this.dialogFormVisible = false;
                    this.getModuleData(1);
                }
            });
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