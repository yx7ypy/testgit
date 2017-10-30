<template>
    <div class="warehouse-list">
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10">
                <el-form :model="supplierForm" ref="supplierForm" :inline="true" @submit.prevent.native label-width="100px">
                    <el-form-item label="供应商编号：">
                        <span>{{supplierForm.supplierCode}}</span>
                    </el-form-item>
                    <el-form-item label="供应商名称：">
                        <span>{{supplierForm.supplierName}}</span>
                    </el-form-item>
                    <el-form-item label="区域：">
                        <span>{{supplierForm.provinceName}}/{{supplierForm.cityName}}/{{supplierForm.districtName}}</span>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <span>{{supplierForm.supplierContact.contactName}}</span>
                    </el-form-item>
                    <el-form-item label="电话：">
                        <span>{{supplierForm.supplierContact.contactPhone}}</span>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                <el-form :model="searchForm" ref="searchForm" :inline="true" label-width="100px">
                    <el-form-item class="fl" label="品类：">
                        <el-select v-model="searchForm.firstClassificationId" clearable placeholder="请选择" no-data-text="没有数据" @change="firstChange">
                            <el-option v-for="item in firstCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchForm.secondClassificationId" clearable placeholder="请选择" no-data-text="请先选择一级品类" @change="secondChange">
                            <el-option v-for="item in secondCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchForm.thirdClassificationId" clearable placeholder="请选择" no-data-text="请先选择一二级品类">
                            <el-option v-for="item in thirdCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                <el-form>
                    <el-form-item class="fl" label="商品编号：" label-width="100px">
                        <el-select v-model="searchForm.productCode" filterable remote placeholder="请输入商品编号" :remote-method="remoteProductCode" @change="selectProductCode" :loading="loading">
                            <el-option v-for="item in remoteProductCodeOptions" :key="item.productCode" :label="item.productCode" :value="item.productCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fl" label="商品名称：" label-width="100px">
                        <el-select v-model="searchForm.productName" filterable remote placeholder="请输入商品名称" :remote-method="remoteProductName" @change="selectProductName" :loading="loading">
                            <el-option v-for="item in remoteProductNameOptions" :key="item.productCode" :label="item.productName" :value="item.productName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fl" label="国际条码：" label-width="100px">
                        <el-select v-model="searchForm.barCode" filterable remote placeholder="请输入国际条码" :remote-method="remoteBarCode" @change="selectBarCode" :loading="loading">
                            <el-option v-for="item in remoteBarCodeOptions" :key="item.barCode" :label="item.barCode" :value="item.barCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                <el-form>
                    <el-form-item class="fl" label="状态：" label-width="100px">
                        <el-select v-model="searchForm.isValid" placeholder="选择状态">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fl" style="margin-left:20px;">
                        <el-button type="success" @click="getModuleData(1)">查询</el-button>
                        <el-button type="info" @click="resetForm('searchForm')">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10">
                <div class="sear-oper-excel-box">
                    <el-button type="warning" @click="productAdd()" icon="plus">新增商品</el-button>
                    <el-button type="primary" @click="exportExcel" style="float: right;">导出商品</el-button>
                </div>
                <el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus">
                    <el-table-column prop="productCode" label="商品编号" width="120" header-align="center" align="center" >
                    </el-table-column>
                    <el-table-column prop="barCode" label="国际条码" width="150" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column prop="productName" label="商品名称" width="150" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column label="一级品类/二级品类/三级品类" width="200" header-align="center" align="center" show-overflow-tooltip>
                        <template slot-scope="scope" >
                            <span>{{scope.row.firstClassificationName}}/{{scope.row.secondClassificationName}}/{{scope.row.thirdClassificationName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="packDictName" label="包装单位" min-width="100" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column prop="specification" label="规格" min-width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.specification}}{{scope.row.specificationName}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column prop="purchasePrice" label="商品进价" min-width="140" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.purchasePrice | toFixed}}</span>
                            <el-button type="text" @click="dialogShow(scope.row)">更改进价</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaseNumber" label="起采量" min-width="140" header-align="center" align="center" >
                        <template slot-scope="scope">
                            <span>{{scope.row.purchaseNumber}}{{scope.row.packDictName}}</span>
                            <span style="text-align:right"><el-button type="text" @click="dialogPurchaseNumber(scope.row)">更改起采量</el-button></span>
                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="isValid" label="状态" min-width="120" :formatter="formatValid" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :formatValid="formatValid" style="width:40px;">{{scope.row.isValid==1?'启用':'停用'}}</span>
                            <el-button type="text" @click="dialogIsValid(scope.row)">更改状态</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
            </el-col>
            <el-dialog title="更改进价" :visible.sync="dialogFormVisible" size="tiny">
                <el-col :span="4" style="line-height:174px;">
                 <i class="el-icon-warning" style="font-size:40px;color:#FF9230"></i>
                </el-col>
                <el-col :span="20">
                <el-form :model="formPrice" label-width="100px"  >
                    <el-form-item label="商品：">
                        <span >{{formPrice.productName}}</span>
                    </el-form-item>
                    <el-form-item label="目前进价：">
                        <span>{{formPrice.purchasePrice}}</span>
                    </el-form-item>
                    <el-form-item label="更改进价：">
                        <el-input style="width:100px;" type="number" icon="el-icon-warning" v-model="formPrice.newPrice" auto-complete="off"></el-input>元
                    </el-form-item>
                </el-form>
                </el-col>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="updatePrice()">确 定</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </div>
            </el-dialog>

            <el-dialog title="更改起采量" :visible.sync="dialogPurchase" size="tiny">
            <el-col :span="4" style="line-height:174px;">
             <i class="el-icon-warning" style="font-size:40px;color:#FF9230"></i>
            </el-col>
            <el-col :span="20">
                <el-form :model="formNumber" label-width="100px">
                    <el-form-item label="商品：">
                        <span>{{formNumber.productName}}</span>
                    </el-form-item>
                    <el-form-item label="目前起采量：">
                        <span>{{formNumber.purchaseNumber}}{{formNumber.packDictName}}</span>
                    </el-form-item>
                    <el-form-item label="更改起采量：">
                        <el-input style="width:100px;" type="number" v-model="formNumber.newPurchaseNumber" auto-complete="off"></el-input>{{formNumber.packDictName}}
                    </el-form-item>
                </el-form>
                </el-col>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="updateNumber()">确 定</el-button>
                    <el-button @click="dialogPurchase = false">取 消</el-button>
                </div>
            </el-dialog>

            <el-dialog title="更改状态" :visible.sync="dialogValid" size="tiny">
            <el-col :span="4" style="line-height:174px;">
             <i class="el-icon-warning" style="font-size:40px;color:#FF9230"></i>
            </el-col>
            <el-col :span="20">
                <el-form :model="formValid" label-width="100px">
                    <el-form-item label="商品：">
                        <span>{{formValid.productName}}</span>
                    </el-form-item>
                    <el-form-item label="目前状态：">
                        <span>{{formValid.isValid ==1?'启用':'停用'}}</span>
                    </el-form-item>
                    <el-form-item label="更改状态：">
                        <span style="color:red">{{formValid.newValid==1?'启用':'停用'}}</span>
                    </el-form-item>
                </el-form>
                </el-col>
                <div slot="footer" class="dialog-footer">                    
                    <el-button type="primary" @click="updateValid()">确 定</el-button>
                    <el-button @click="dialogValid = false">取 消</el-button>
                </div>
            </el-dialog>
        </el-row>
    </div>
</template>

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
            exportForm: {},
            supplierForm: {
                supplierContact: {}
            },
            searchForm: {
                "pageNum": 1,
                "firstClassificationId": null,
                "secondClassificationId": null,
                "thirdClassificationId": null,
                "isValid": "1",
                "productCode": null,
                "productName": null,
                "barCode": null
            },
            moduleData: {
                list: [],
                total: 0
            },
            options: [
                { value: '1', label: '启用' },
                { value: '0', label: '停用' },
                { value: '', label: '所有' }],
            dialogFormVisible: false,
            dialogPurchase: false,
            dialogValid: false,
            formPrice: {
                supplierProductId: '',
                productName: '',
                purchasePrice: '',
                formPurchaseNumber: '',
                newPrice: ''
            },
            formNumber: {
                supplierProductId: '',
                productName: '',
                formPurchaseNumber: '',
                newPurchaseNumber: ''
            },
            formValid: {
                supplierProductId: '',
                productName: '',
                isValid: '',
                newValid: ''
            },
            loading:false,
            remoteProductCodeOptions: [], //下拉选项，选中后会清空
            remoteProductCodeOptions1: [], //与下拉选项相同，但不会清空
            remoteProductNameOptions:[],
            remoteProductNameOptions1:[],
            remoteBarCodeOptions: [],
            remoteBarCodeOptions1: [],
            selectProductCodeValue:null, 
            selectProductNameValue:null,
            selectBarCodeValue:null,
        }
    },
    created() {
        let para = {
            bone: '供应商管理',
			boneUrl: '/supplier/supplierList',
			btwo: '供应商商品管理'
        };
        this.$store.dispatch('switchBreadcrumb', para);
        this.getModuleData(1);
        this.$store.dispatch('getFirstClassification', { "parentId": 0 })
        this.getdetail();
    },
    computed: {
        ...mapGetters([
            'loadingStatus',
            'firstCFList',
            'secondCFList',
            'thirdCFList'
        ])
    },
    methods: {
        remoteProductCode(query) {
            if(this.selectProductCodeValue&&this.selectProductCodeValue==query){
                //当前选中不进行查询，
                this.remoteProductCodeOptions=this.remoteProductCodeOptions1;
                return;
            }
            if (query) {
                this.loading = true;
                let param = {
                    "supplierId": this.$route.params.supplierId,
                    "productCode": query,
                    "pageNum":1,
                    "pageSize":20,
                }
                this.$api.apiCommunication('/supplierProduct/serachProductByParam', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.remoteProductCodeOptions1 = res.data;
                    this.remoteProductCodeOptions = res.data;
                }, 'product')
            } else {
                this.remoteProductCodeOptions = [];
            }
        },
        selectProductCode(code) {
            this.selectProductCodeValue=code;
            for (let i = 0; i < this.remoteProductCodeOptions1.length; i++) {
                if (this.remoteProductCodeOptions1[i].productCode == code) {
                   this.searchForm.barCode = this.remoteProductCodeOptions1[i].barCode;
                   //this.searchForm.productCode = this.remoteProductCodeOptions1[i].productCode;
                   this.searchForm.productName = this.remoteProductCodeOptions1[i].productName;
               }
            }
        },
        remoteProductName(query) {
            if(this.selectProductNameValue&&this.selectProductNameValue==query){
                //当前选中不进行查询，
                this.remoteProductNameOptions=this.remoteProductNameOptions1;
                return;
            }
            if (query) {
                this.loading = true;
                let param = {
                    "supplierId": this.$route.params.supplierId,
                    "productName": query,
                    "pageNum":1,
                    "pageSize":20,
                }
                this.$api.apiCommunication('/supplierProduct/serachProductByParam', param, res => {
                    this.loading = false;
                    if (res.code != 2000) {
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.remoteProductNameOptions1 = res.data;
                    this.remoteProductNameOptions = res.data;
                }, 'product')
            } else {
                this.remoteProductNameOptions = [];
            }
        },
        selectProductName(name) {
            this.selectProductNameValue=name;
            for (let i = 0; i < this.remoteProductNameOptions1.length; i++) {
                if (this.remoteProductNameOptions1[i].productName == name) {
                   this.searchForm.barCode = this.remoteProductNameOptions1[i].barCode;
                   this.searchForm.productCode = this.remoteProductNameOptions1[i].productCode;
                   //this.searchForm.productName = this.remoteProductCodeOptions1[i].productName;
               }
            }
        },
        remoteBarCode(query) {
            if(this.selectBarCodeValue&&this.selectBarCodeValue==query){
                //当前选中不进行查询，
                this.remoteBarCodeOptions=this.remoteBarCodeOptions1;
                return;
            }
            if (query) {
                this.loading = true;
                let param = {
                    "supplierId": this.$route.params.supplierId,
                    "barCode": query,
                    "pageNum":1,
                    "pageSize":20,
                }
                this.$api.apiCommunication('/supplierProduct/serachProductByParam', param, res => {
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
            this.selectBarCodeValue=code;
            for (let i = 0; i < this.remoteBarCodeOptions1.length; i++) {
                if (this.remoteBarCodeOptions1[i].barCode == code) {
                    //this.searchForm.barCode = this.remoteBarCodeOptions1[i].barCode;
                    this.searchForm.productCode = this.remoteBarCodeOptions1[i].productCode;
                    this.searchForm.productName = this.remoteBarCodeOptions1[i].productName;
                }
            }
        },
        resetForm(formName) {
            // this.$refs[formName].resetFields();
            //不生效，手动处理
            this.searchForm = {
                "pageNum": 1,
                "firstClassificationId": null,
                "secondClassificationId": null,
                "thirdClassificationId": null,
                "isValid": "1", //测试要求，默认到启用
                "productCode": null,
                "productName": null,
                "barCode": null
            }
        },
        getModuleData(pageNum) {
            // 获取数据
            this.searchForm.supplierId = this.$route.params.supplierId;
            this.searchForm.pageNum = pageNum || 1;
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/supplierProduct/getList', this.searchForm, res => {
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
            }, 'product')
        },
        firstChange(val) {
            this.$store.dispatch('getSecondClassification', { "parentId": val })
            this.clearLinkage(1);
        },
        secondChange(val) {
            this.$store.dispatch('getThirdClassification', { "parentId": val })
            this.clearLinkage(2);
        },
        clearLinkage(type) {
            switch (type) {
                case 1:
                    // 清除二级和三级
                    this.searchForm.secondClassificationId = '';
                    this.searchForm.thirdClassificationId = '';
                    break;
                case 2:
                    // 清除三级
                    this.searchForm.thirdClassificationId = ''
                    break
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getModuleData(val);
        },
        //性别显示转换
        formatValid: function(row, column) {
            return row.isValid == 1 ? '启用' : row.isValid == 0 ? '停用' : '';
        },
        getdetail() {
            // 获取数据
            let _id = this.$route.params.supplierId;
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/supplier/detail', { "supplierId": _id }, res => {
                this.$store.dispatch('switchLoadingStatus', false)
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                if (null != res.data) {
                    this.supplierForm = res.data;
                }

            }, 'basedata');
        },
        dialogShow(item) {
            this.formPrice.supplierProductId = item.supplierProductId;
            this.formPrice.productName = item.productName;
            this.formPrice.purchasePrice = item.purchasePrice;
            this.formPrice.newPrice='';
            this.dialogFormVisible = true;
        },
        dialogPurchaseNumber(item) {
            this.formNumber.supplierProductId = item.supplierProductId;
            this.formNumber.productName = item.productName;
            this.formNumber.purchaseNumber = item.purchaseNumber;
            this.formNumber.packDictName= item.packDictName;
            this.formNumber.newPurchaseNumber='';
            this.dialogPurchase = true;
        },
        dialogIsValid(item) {
            this.formValid.supplierProductId = item.supplierProductId;
            this.formValid.productName = item.productName;
            if (item.isValid == 1) {
                this.formValid.isValid = 1;
                this.formValid.newValid = 0;
            } else {
                this.formValid.isValid = 0;
                this.formValid.newValid = 1;
            }
            this.dialogValid = true;
        },
        updatePrice() {
            if(''==this.formPrice.newPrice){
                this.$alert(`提示：进价不能为空`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                return ;
            }
            let param = {
                "supplierProductId": this.formPrice.supplierProductId,
                "supplierId":this.$route.params.supplierId,
                "purchasePrice": this.formPrice.newPrice,
            }
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/supplierProduct/update', param, res => {
                this.$store.dispatch('switchLoadingStatus', false)
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                this.dialogFormVisible = false;
                this.getModuleData(this.searchForm.pageNum);
                this.$notify({ title: '系统通知', message: '更改成功！', type: 'success' })

            }, 'product');
        },
        updateNumber() {
            if(''==this.formNumber.newPurchaseNumber){
                this.$alert(`提示：起采量不能为空`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                return ;
            }
            let param = {
                "supplierProductId": this.formNumber.supplierProductId,
                "supplierId":this.$route.params.supplierId,
                "purchaseNumber": this.formNumber.newPurchaseNumber,
            }
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/supplierProduct/update', param, res => {
                this.$store.dispatch('switchLoadingStatus', false)
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                this.dialogPurchase = false;
                this.getModuleData(this.searchForm.pageNum);
                this.$notify({ title: '系统通知', message: '更改成功！', type: 'success' })

            }, 'product');
        },
        updateValid() {
            let param = {
                "supplierProductId": this.formValid.supplierProductId,
                "supplierId":this.$route.params.supplierId,
                "isValid": this.formValid.newValid,
            }
            this.$store.dispatch('switchLoadingStatus', true);
            this.$api.apiCommunication('/supplierProduct/update', param, res => {
                this.$store.dispatch('switchLoadingStatus', false)
                if (res.code != 2000) {
                    this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                    return false;
                }
                this.dialogValid = false;
                this.getModuleData(this.searchForm.pageNum);
                this.$notify({ title: '系统通知', message: '更改成功！', type: 'success' })

            }, 'product');
        },
        productAdd: function() {
            this.$router.push({ name: 'supplierProductAdd', params: { supplierId: this.$route.params.supplierId } });
        },
        exportExcel() {
            // 导出excel
            if (this.moduleData.total === 0) {
                this.$notify({ title: '系统通知', message: '没有可导出的数据！', type: 'warning' })
                return false
            };
            let token = this.$store.getters.getToken,
                url = `${basicConfig.PRODUCT_HOST}/supplierProduct/getSupplierProductExcel?token=${token}`,
                _data = this.searchForm;
            _data.supplierId = this.$route.params.supplierId;
            url += `&supplierId=${_data.supplierId}`
            // 商品编号 
            if (_data.productCode) {
                url += `&productCode=${_data.productCode}`
            };
            // 商品名称
            if (_data.productName) {
                url += `&productName=${_data.productName}`;
            };
            // 国际条码
            if (_data.barCode) {
                url += `&barCode=${_data.barCode}`;
            }
            // 商品状态
            if (_data.isValid) {
                url += `&isDelete=${_data.isValid}`;
            }
            // 一级品类
            if (_data.firstClassificationId) {
                url += `&firstClassificationId=${_data.firstClassificationId}`;
            }
            // 二级品类
            if (_data.secondClassificationId) {
                url += `&secondClassificationId=${_data.secondClassificationId}`;
            }
            // 三级品类
            if (_data.thirdClassificationId) {
                url += `&thirdClassificationId=${_data.thirdClassificationId}`;
            }
            let _win = window.open();
            _win.location = url;
            //              _win.close();

        }
    }
}
</script>

<style scoped>
.panelOne {
    height: 60px;
    line-height: 60px;
}
</style>