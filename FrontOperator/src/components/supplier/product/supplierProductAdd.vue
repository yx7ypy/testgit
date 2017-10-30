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
			<el-col :span="24" class="el-item pdd-10">
				<label for="">待添加商品列表</label>
				<el-col :span="24" style="text-align:right">
					<el-button size="small" type="primary" class="ex-moban-down" @click="com.openUrl(`${product_host}/supplierProduct/downSupplierProductTemplate`)" style="background:#fff;border: none;color: #407ef5;text-decoration: underline;">导入商品模板下载</el-button>
					<el-upload style="display:inline-block" class="upload-demo" :action="`${product_host}/supplierProduct/impSupplierProductExcel`" :on-success="handleImportSuccess" :on-error="handleImportError" :with-credentials="true" :data="uploadData">
						<el-button size="small" type="primary">批量导入</el-button>
					</el-upload>
				</el-col>
				<el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading="loading">
					<!-- <el-table-column type="selection" width="100">
						</el-table-column> -->
					<el-table-column label="删除" width="80" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button @click="deleteLine(scope.row.supplierProductId,scope.$index)">
								<i class="el-icon-delete"></i>
							</el-button>
						</template>
					</el-table-column>
					<el-table-column type="index" label="序号" width="80" header-align="center" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="productCode" label="商品编号" width="200px" header-align="center" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.productCode" filterable remote placeholder="请输入商品编号" :remote-method="remoteProductCode" @change="selectProductCode" :loading="loading" :disabled="undefined!=scope.row.supplierProductId">
								<el-option v-for="item in remoteProductCodeOptions" :key="item.productCode" :label="item.productCode" :value="item.productCode">

								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="barCode" label="国际条码" width="200px" header-align="center" align="center">
						<template slot-scope="scope">
							<el-select v-model="scope.row.barCode" filterable remote placeholder="请输入国际条码" :remote-method="remoteBarCode" @change="selectBarCode" :loading="loading" :disabled="undefined!=scope.row.supplierProductId">
								<el-option v-for="item in remoteBarCodeOptions" :key="item.barCode" :label="item.barCode" :value="item.barCode">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="productName" label="商品名称" width="150" header-align="center" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="一级品类/二级品类/三级品类" width="200">
						<template slot-scope="scope">
							<span>{{scope.row.firstClassificationName}}{{scope.row.secondClassificationName?'/'+scope.row.secondClassificationName:''}}{{scope.row.thirdClassificationName?'/'+scope.row.thirdClassificationName:''}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="packDictName" label="包装单位" min-width="100" header-align="center" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="specification" label="规格" min-width="120" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{scope.row.specification}}{{scope.row.specificationName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="purchasePrice" label="商品进价" min-width="120" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-input v-model="scope.row.purchasePrice" style="width:60px"></el-input>
							<span>元</span>
						</template>
					</el-table-column>
					<el-table-column prop="purchaseNumber" label="起采量" min-width="120" header-align="center"  show-overflow-tooltip>
						<template slot-scope="scope">
							<el-input v-model="scope.row.purchaseNumber" style="width:60px"></el-input>
							<span>{{scope.row.packDictName}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="100" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button v-if="!scope.row.supplierProductId" @click="addLine(scope.row.productId,scope.row.purchasePrice,scope.row.purchaseNumber)" type="button">添加</el-button>
							<el-button v-if="scope.row.supplierProductId" @click="updateLine(scope.row.supplierProductId,scope.row.purchasePrice,scope.row.purchaseNumber)" type="button">修改</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-col :span="24" class="toolbar">
					<el-button type="primary" size="mini" v-on:click="addNewProduct" :disabled="isAdd">+</el-button>
				</el-col>
				<feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
				<!--工具条-->

			</el-col>
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
			uploadData: {
				supplierId: this.$route.params.supplierId
			},
			supplierForm: {
				supplierContact: {}
			},
			dialogVisible: false,
			moduleData: {
				list: [],
				total: 0
			},
			product_host: basicConfig.PRODUCT_HOST,
			impotForm: {
				supplierId: this.$route.params.supplierId
			},
			loading: false,
			remoteProductCodeOptions: [], //下拉选项，选中后会清空
			remoteProductCodeOptions1: [], //与下拉选项相同，但不会清空
			remoteBarCodeOptions: [],
			remoteBarCodeOptions1: [],
			searchFlag: false,
			isAdd:false,
		}
	},
	created() {
        let para = {
            bone: '供应商管理',
			boneUrl: '/supplier/supplierList',
			btwo: '新增商品'
        };
        this.$store.dispatch('switchBreadcrumb', para);
		this.getdetail();
		this.getModuleData();
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
			if (!this.searchFlag) {
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
				this.remoteProductCodeOptions1 = [];
				this.remoteProductCodeOptions = [];
				this.$api.apiCommunication('/supplierProduct/getListByCodeBar', param, res => {
					this.loading = false;
					if (res.code != 2000) {
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false;
					}
					//后端接口没限制返回数据，前端处理限制下拉框数据最大为100条，防止浏览器卡死
					this.remoteProductCodeOptions = res.data.splice(0,100);
					this.remoteProductCodeOptions1 =this.remoteProductCodeOptions;
				}, 'product')
			} else {
				this.remoteProductCodeOptions = [];
			}
		},
		selectProductCode(code) {
			let length= this.moduleData.list.length;
			for (let i = 0; i < this.remoteProductCodeOptions1.length; i++) {
				if (this.remoteProductCodeOptions1[i].productCode == code) {
					this.moduleData.list[length - 1] = this.remoteProductCodeOptions1[i];
					this.moduleData.list[length - 1].productCode = this.remoteProductCodeOptions1[i].productCode;
					this.moduleData.list[length - 1].barCode = this.remoteProductCodeOptions1[i].barCode;
					this.moduleData.list[length - 1].productName = this.remoteProductCodeOptions1[i].productName;
					this.moduleData.list[length - 1].firstClassificationName = this.remoteProductCodeOptions1[i].firstClassificationName;
					this.moduleData.list[length - 1].secondClassificationName = this.remoteProductCodeOptions1[i].secondClassificationName;
					this.moduleData.list[length - 1].thirdClassificationName = this.remoteProductCodeOptions1[i].thirdClassificationName;
					this.moduleData.list[length - 1].packDictName = this.remoteProductCodeOptions1[i].packDictName;
					return;
				}
			}
		},
		remoteBarCode(query) {
			if (!this.searchFlag) {
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
				this.remoteBarCodeOptions = [];
				this.remoteBarCodeOptions1 = [];
				this.$api.apiCommunication('/supplierProduct/getListByCodeBar', param, res => {
					this.loading = false;
					if (res.code != 2000) {
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false;
					}
					//后端接口没限制返回数据，前端处理限制下拉框数据最大为100条，防止浏览器卡死
					this.remoteBarCodeOptions = res.data.splice(0,100);
					this.remoteBarCodeOptions1 = this.remoteBarCodeOptions;
				}, 'product')
			} else {
				this.remoteBarCodeOptions = [];
			}
		},
		selectBarCode(code) {
			let length= this.moduleData.list.length;
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
		getModuleData(pageNum) {
			this.searchFlag = false;
			let param = {
				supplierId: this.$route.params.supplierId,
				pageNum: pageNum || 1
			}
			// 获取数据
			this.$store.dispatch('switchLoadingStatus', true);
			this.moduleData.list = [];
			// POST POST /api/supplierProduct/getList
			this.$api.apiCommunication('/supplierProduct/getList', param, res => {
				this.$store.dispatch('switchLoadingStatus', false)
				if (res.code != 2000) {
					this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false;
				}
				this.moduleData = res.data;
				this.isAdd=false;
			}, 'product')
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
		addNewProduct() {
			this.isAdd=true;
			this.moduleData.list.push({});
			this.searchFlag = true;
		},
		deleteLine(supplierProductId, index) {
			if (!supplierProductId) {
				this.moduleData.list.splice(index, 1);
				this.isAdd = false;
				return;
			}
			this.$confirm("确定要删除吗？", "系统通知", {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				let para = {
					"supplierId": this.$route.params.supplierId,
					"supplierProductId": supplierProductId
				};

				this.$api.apiCommunication('/supplierProduct/deleteSupplierProduct', para, res => {
					if (res.code != 2000) {
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false;
					}
					this.$notify({ title: '系统通知', message: '删除成功！', type: 'success' })
					this.getModuleData();
				});
			});
		},
		handleImportSuccess(res, file, fileList) {
			if (res.code != 2000) {
				if (res.data) {
					this.$alert(`导入失败，服务器返回信息：${res.data}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
				} else {
					this.$alert(`导入失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
				}
				fileList = [];
				return false;
			}
			this.$notify({ title: '系统通知', message: '导入成功！', type: 'success' })
			this.getModuleData();
		},
		handleImportError(res) {
			let msg = res.data.join("\n");
			this.$alert(`导入失败，服务器返回信息：${msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
		},
		handleCurrentChange(val) {
			let pageNum = (typeof val === "number") ? val : 1;
			this.currentPage = pageNum;
			this.getModuleData(pageNum);

		},
		addLine(productId, purchasePrice, purchaseNumber) {
			if ('' == purchasePrice) {
				this.$alert(`提示：价格不能为空`, '系统通知', { confirmButtonText: '确定', type: 'error' });
				return;
			}
			let para = {
				"productId": productId,
				"purchaseNumber": purchaseNumber,
				"purchasePrice": purchasePrice,
				"supplierId": this.$route.params.supplierId
			};
			this.$api.apiCommunication('/supplierProduct/save', para, res => {
				if (res.code != 2000) {
					this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false;
				}
				this.$notify({ title: '系统通知', message: '添加成功！', type: 'success' });
				this.getModuleData(1);
			});
		},
		updateLine(supplierProductId, purchasePrice, purchaseNumber) {
			if ('' == purchasePrice) {
				this.$alert(`提示：价格不能为空`, '系统通知', { confirmButtonText: '确定', type: 'error' });
				return;
			}
			if ('' == purchaseNumber) {
				this.$alert(`提示：起采量不能为空`, '系统通知', { confirmButtonText: '确定', type: 'error' });
				return;
			}
			let para = {
				"supplierProductId": supplierProductId,
				"supplierId": this.$route.params.supplierId,
				"purchasePrice": purchasePrice,
				"purchaseNumber": purchaseNumber,
				"isValid": 1
			};
			this.$api.apiCommunication('/supplierProduct/update', para, res => {
				if (res.code != 2000) {
					this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false;
				}
				this.$notify({ title: '系统通知', message: '修改成功！', type: 'success' });
				this.getModuleData();
			});
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					this.deleteLine();
				})
				.catch(_ => { });
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