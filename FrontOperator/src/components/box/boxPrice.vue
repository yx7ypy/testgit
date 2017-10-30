<template>
	<div class="box-price-list">
		<!--搜索区域-->
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item display-table top-toolbar-complex">
				<div class="toolbar-function tr">
					<el-form :model="searForm" ref="searForm" :inline="true" class="tr">
						<div class="h">
							<el-form-item class="fl" label="修改盒子售价方案 : ">
								<el-select v-model="searForm.scenarioPriceId" clearable placeholder="盒子售价方案 ">
									<el-option v-for="item in scenarioPriceList" :key="item.scenarioPriceId" :label="item.scenarioName" :value="item.scenarioPriceId">
									</el-option>
								</el-select>
							</el-form-item>
							<el-button type="success" @click="searchToolbar">执行方案售价</el-button>
							<el-button type="info" @click="exportExcel">导出售价方案</el-button>
						</div>
					</el-form>
				</div>
			</el-col>
		</el-row>
		<!--信息展示区域-->
		<el-row class="mar-bottom10" style="width: 100%;">
			<el-col :span="24" class="el-item pdd-10">
				<el-table :data="moduleData.list" border :stripe="true" v-loading.body="loadingStatus">
					<el-table-column align="center" prop="productCode" label="商品编号" class="tc" width="140" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="barCode" label="国际条码" width="140" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="productName" label="商品名称" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="packDictName" label="包装" width="100" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="specification" label="规格" width="100" show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.specification}}{{scope.row.specificationName}}
						</template>
					</el-table-column>
					<el-table-column align="center" prop="inventoryCount" label="盒子库存" width="100" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="salePrice" label="目前售价" width="100" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="pricePlan" label="方案" width="100" show-overflow-tooltip></el-table-column>
				</el-table>
				<feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="currentPage"></feng-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
// 商品列表
import fengPagination from '@/components/fengModule/pagination.vue';
import { basicConfig } from '@/config/config.js';
import { mapGetters } from 'vuex'
import '@/static/style/box/list.scss'
export default {
	data() {
		return {
			id: this.$route.params.id,
			currentPage: 1,
			scenarioPriceList: [], // 售价方案list
			moduleData: {
				list: [], //列表数据
				total: 0
			},
			searForm: {
				'scenarioPriceId': '', // 售价方案
				'boxId': '',  // 盒子id
				"pageSize": 10,
				"pageNum": 1
			},
			searchBtn: false,
		}
	},
	created() {
		let param = {
			bone: '盒子管理',
			boneUrl: '/box/boxList',
			btwo: '盒子定变价管理'
		};
		this.$store.dispatch('switchBreadcrumb', param);
		this.searForm.boxId = this.id;
		this.getPriceList(this.id);
		this.getGoodsData(this.searForm);
	},
	computed: {
		...mapGetters([
			'loadingStatus',
		])
	},
	methods: {
		// 获取价格方案list   get
		getPriceList(id) {
			this.$store.dispatch('switchLoadingStatus', true);
			if (typeof id != 'object') {
				this.$api.apiCommunicationGet('/box/scenarioPrice/list/' + id, res => {
					this.$store.dispatch('switchLoadingStatus', false)
					if (res.code != 2000) {
						this.scenarioPriceList = [];
						return false;
					}
					this.scenarioPriceList = res.data.scenarioPriceList;
					if (res.data.scenarioPrice) {
						this.searForm.scenarioPriceId = res.data.scenarioPrice.scenarioPriceId;
					} else {
						this.searForm.scenarioPriceId = ''
					}
				})
			}
		},
		// 获取商品list  post
		getGoodsData(data) {
			this.$api.apiCommunication('/box/scenarioPrice/productList', data, res => {
				if (res.code != 2000) {
					this.moduleData = {
						list: [],
						total: 0
					}
					this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false
				}
				this.moduleData = res.data;
			})
		},
		// 执行售价方案
		goSave(data) {
			this.$api.apiCommunication('/box/scenarioPrice/save', data, res => {
				if (res.code != 2000) {
					this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false
				}
				// 执行售价方案成功
				this.getPriceList(this.id);
				this.getGoodsData(this.searForm);
			})
		},
		// 分页
		handleCurrentChange(val) {
			this.currentPage = val
			if (this.searchBtn) {
				this.searchToolbar(val)
				return false
			}
			this.searForm.pageNum = val;
			this.getGoodsData(this.searForm)
		},
		searchToolbar(val) {
			let param = {
				pageNum: (typeof val === "number") ? val : 1
			};
			Object.assign(param, this.searForm);
			this.searchBtn = true;
			this.goSave(param);
		},
		exportExcel() {
			// 导出excel
			if (this.moduleData.total === 0) {
				this.$notify({ title: '系统通知', message: '没有可导出的数据！', type: 'warning' })
				return false
			};
			let _data = this.searForm;
			let token = this.$store.getters.getToken,
				url = `${basicConfig.PRODUCT_HOST}/box/scenarioPrice/excelExport?token=${token}&boxId=${_data.boxId}`;

			// 售价方案ID	
			// if (_data.scenarioPriceId) {
			// 	url += `&scenarioPriceId=${_data.scenarioPriceId}`
			// };

			let _win = window.open();
			_win.location = url;
		},
		// 清空操作
		resetForm(formName) {
			this.searForm.scenarioPriceId = '';
			this.$refs[formName].resetFields();
		},
	},
	components: {
		fengPagination
	}
}
</script>