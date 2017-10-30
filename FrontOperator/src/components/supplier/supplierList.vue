<template>
    <div class="warehouse-list">
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
                    <el-form :model="searchForm" ref="searchForm" :inline="true" @submit.prevent.native label-width="100px">
                        <el-form-item label="选择区域：">
                            <el-select v-model="searchForm.provinceId" clearable placeholder="请选择" no-data-text="没有数据" @change="provinceChange" @clear="clearLinkage(1)">
                                <el-option v-for="item in provinceList" :key="item.cityId" :label="item.cn" :value="item.cityId">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchForm.cityId" clearable placeholder="请选择" no-data-text="请先选择省份" @change="cityChange" @clear="clearLinkage(2)">
                                <el-option v-for="item in cityList" :key="item.cityId" :label="item.cn" :value="item.cityId">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchForm.districtId" clearable placeholder="请选择" no-data-text="请先选择城市">
                                <el-option v-for="item in districtList" :key="item.cityId" :label="item.cn" :value="item.cityId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态：" >
                            <el-select v-model="searchForm.isValid" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                            <el-form-item label="供应商编号：">
                                <!-- <el-input placeholder="请填写供应商编号" v-model="searchForm.supplierCode">
                                </el-input> -->
                                <el-select v-model="searchForm.supplierCode" filterable remote placeholder="请填写供应商编号" :remote-method="remoteSupplierCode" @change="selectSupplierCode" :loading="loading">
                                    <el-option v-for="item in remoteSupplierCodeOptions" :key="item.supplierId" :label="item.supplierCode" :value="item.supplierCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="供应商名称：">
                                <!-- <el-input placeholder="请填写供应商名称" v-model="searchForm.supplierName">
                                </el-input> -->
                                <el-select v-model="searchForm.supplierName" filterable remote placeholder="请填写供应商名称" :remote-method="remoteSupplierName" @change="selectSupplierName" :loading="loading">
                                    <el-option v-for="item in remoteSupplierNameOptions" :key="item.supplierId" :label="item.supplierName" :value="item.supplierName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                            <el-button type="success" @click="getModuleData(1)">查询</el-button>
                            <el-button type="primary" @click="resetForm('searchForm')">清空</el-button>
                            </el-form-item>
                        </el-form>
            </el-col>
        </el-row>
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-10">
                <div class="sear-oper-excel-box">
                <el-button type="warning" @click="routerPush('add')" icon="plus">新建供应商</el-button>
                </div>
                <el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus"  >
                    <el-table-column prop="supplierCode" label="供应商编号" width="140" header-align="center"align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="supplierName" label="供应商名称" width="160" header-align="center"align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column  label="省/市/区"  width="160" header-align="center"align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                    {{scope.row.provinceName}}-{{scope.row.cityName}}-{{scope.row.districtName}}
                    </template>
                    </el-table-column>
                    <el-table-column prop="supplierContact.contactName" label="联系人" width="120" header-align="center"align="center" show-overflow-tooltip>
                   </el-table-column>
                   <el-table-column prop="supplierContact.contactPhone" label="电话" min-width="100"  header-align="center"align="center" show-overflow-tooltip>
                   </el-table-column>
                   <el-table-column prop="isValid" label="状态" min-width="100" header-align="center"align="center" show-overflow-tooltip>
                       <template slot-scope="scope">
							<span v-if="scope.row.isValid==0">未启用</span>
							<span v-if="scope.row.isValid==1" style="color: #13ce66;">启用中</span>
						</template>
                   </el-table-column>
                   <el-table-column prop="productCatgoryCount" label="供应商品" min-width="140"  header-align="center"align="center" show-overflow-tooltip>
                       <template slot-scope="scope">
                           <span :value="scope.row.productCatgoryCount">{{scope.row.productCatgoryCount||0}}种</span>
                           <el-button type="primary" size="small" @click="routerPush('supplierProductList',scope.row.supplierId)">商品管理</el-button>
                       </template>
                   </el-table-column>
                   <el-table-column label="操作" min-width="180"  header-align="center"align="center" show-overflow-tooltip>
                       <template slot-scope="scope">
                           <el-button type="warning" size="small" @click="routerPush('edit',scope.row.supplierId)" style="background:#ec6d1e">编辑</el-button>
                           <el-button type="primary" size="small" @click="routerPush('detail',scope.row.supplierId)">查看</el-button>
                       </template>
                   </el-table-column>
                </el-table>
                <feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    // 供应商列表
    import fengPagination from '@/components/fengModule/pagination.vue'
    import { mapGetters } from 'vuex'
    import '@/static/style/warehouse/list.scss'

    export default {
        data() {
            return {
                currentPage: 1,
                moduleData: {
                    list: [],
                    total: 0
                },
                searchForm: {
                "supplierId":this.$route.params.supplierId,
                "cityId":"",
                "provinceId":"",
                "districtId":"",
                "storageCode":"",
                "isDelete":"",
                "isValid":"",
                "supplierName":"",
                "supplierCode":""
                },
                searchBtn: false,
                options: [{
                    value: '',
                    label: '全部'
                },{
                    value: '1',
                    label: '启用'
                }, {
                    value: '0',
                    label: '停用'
                }],
                loading:false,
                remoteSupplierCodeOptions:[],
                remoteSupplierCodeOptions1:[],
                remoteSupplierNameOptions:[],
                remoteSupplierNameOptions1:[],
                selectCode:null,
                selectName:null,
            }
        },
        created() {
            this.$store.dispatch('switchBreadcrumb', { bone: '供应商管理' });
            this.getModuleData();
            this.$store.dispatch('getCityList', { "parentId": 414, 'type': 1 });
        },
        computed: {
            ...mapGetters([
                'provinceList',
                'cityList',
                'districtList',
                'loadingStatus',
            ])
        },
        methods: {
            remoteSupplierCode(query) {
                if(this.selectCode&&this.selectCode==query){
                    //当前选中不进行查询，
                    this.remoteSupplierCodeOptions=this.remoteSupplierCodeOptions1;
                    return;
                }
                if (query) {
                    this.loading = true;
                    let param = {
                        "supplierCode": query,
                        "pageNum":1,
                        "pageSize":20
                    }
                    this.$api.apiCommunication('/supplier/list', param, res => {
                        this.loading = false;
                        if(res.code != 2000) {
                            this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                            return false;
                        }
                        //前端处理限制下拉框数据最大为100条，防止浏览器卡死
                        this.remoteSupplierCodeOptions = res.data.list.splice(0,100);
                        this.remoteSupplierCodeOptions1 =this.remoteSupplierCodeOptions;
                        // this.remoteSupplierCodeOptions1 = res.data.list;
                        // this.remoteSupplierCodeOptions = res.data.list;
                        
                    }, 'basedata')
                } else {
                    this.remoteSupplierCodeOptions = [];
                }
            },
            selectSupplierCode(code) {
                this.selectCode=code;
                for (let i = 0; i < this.remoteSupplierCodeOptions1.length; i++) {
                    if (this.remoteSupplierCodeOptions1[i].supplierCode == code) {
                       this.searchForm.supplierName = this.remoteSupplierCodeOptions1[i].supplierName;
                       return;
                   }
                }
            },
            remoteSupplierName(query) {
                if(this.selectName&&this.selectName==query){
                   //当前选中不进行查询，
                   this.remoteSupplierNameOptions= this.remoteSupplierNameOptions1;
                   return;
               }
                if (query) {
                    this.loading = true;
                    let param = {
                        "supplierName": query,
                        "pageNum":1,
                        "pageSize":20
                    }
                   this.$api.apiCommunication('/supplier/list', param, res => {
                        this.loading = false;
                       if(res.code != 2000) {
                           this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                           return false;
                       }
                       //前端处理限制下拉框数据最大为100条，防止浏览器卡死
                       this.remoteSupplierNameOptions = res.data.list.splice(0,100);
                       this.remoteSupplierNameOptions1 =this.remoteSupplierNameOptions;
                       // this.remoteSupplierNameOptions1 = res.data.list;
                       // this.remoteSupplierNameOptions = res.data.list;
                   }, 'basedata')
                } else {
                    this.remoteSupplierNameOptions = [];
                }
            },
            selectSupplierName(name) {
                this.selectName=name;
                for (let i = 0; i < this.remoteSupplierNameOptions1.length; i++) {
                    if (this.remoteSupplierNameOptions1[i].supplierName == name) {
                       this.searchForm.supplierCode = this.remoteSupplierNameOptions1[i].supplierCode;
                       return;
                   }
                }
            },
            getModuleData(pageNum) {
                // 获取数据
                this.searchForm.pageNum=pageNum||1;
                this.$store.dispatch('switchLoadingStatus', true);
                this.$api.apiCommunication('/supplier/list', this.searchForm, res => {
                    this.$store.dispatch('switchLoadingStatus', false)
                    if(res.code != 2000) {
                        this.moduleData = {
                            list: [],
                            total: 0
                        };
                        this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
                        return false;
                    }
                    this.moduleData = res.data;
                }, 'basedata')
            },
            handleCurrentChange(val) {
                this.currentPage =  (typeof val === "number") ? val : 1;
                this.getModuleData(this.currentPage);
            },
            provinceChange(val) {
                if(val !== '') {
                    this.$store.dispatch('getCityList', { "parentId": val, 'type': 2 })
                    this.$store.dispatch('resetLinkage', { type:'city_reset_three' })
                    this.clearLinkage(1);
                }else{
                    this.$store.dispatch('resetLinkage', { type:'city_reset_two_three' })
                }
            },
            cityChange(val) {
                if(val !== '') {
                    this.$store.dispatch('getCityList', { "parentId": val, 'type': 3 })
                    this.clearLinkage(2);
                }
            },
            clearLinkage(type) {
                switch(type) {
                    case 1:
                        // 清除二级和三级
                        this.searchForm.cityId = ''
                        this.searchForm.districtId = ''
                        break
                    case 2:
                        // 清除三级
                        this.searchForm.districtId = ''
                        break
                }
            },
            // 清空操作
            resetForm(formName) {
                this.searchForm.cityId = '';
                this.searchForm.provinceId = '';
                this.searchForm.districtId = '';
                this.searchForm.storageCode = '';
                this.searchForm.isValid = '';
                this.searchForm.supplierName='';
                this.searchForm.supplierCode='';
            },
            routerPush(type, id) {
                switch(type) {
                    case 'add':
                        // 新建
                        this.$router.push({ name: 'supplierAdd' })
                        break
                    case 'detail':
                        // 查看
                        this.$router.push({ name: 'supplierDetail', params: { id: id } })
                        break
                    case 'edit':
                        // 编辑
                        this.$router.push({ name: 'supplierEdit', params: { id: id } })
                        break
                    case 'supplierProductList':
                        // 查看供应商商品
                        this.$router.push({ name: 'supplierProductList', params: { supplierId: id } })
                        break
                }
            }
        },
        components: {
            fengPagination
        }
    }
</script>