<template>
	<div class="warehouse-bind">
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
				<div class="toolbar-from">
					<el-form :model="searForm" ref="searForm" :inline="true" @submit.prevent.native label-position="right" label-width="110px">
						<el-form-item label="仓库编号：">{{showForm.storageCode}}</el-form-item>
						<el-form-item label="仓库名称："> {{showForm.storageName}} </el-form-item>
						<el-form-item label="仓库详细地址："> {{showForm.address}} </el-form-item>
						<el-form-item label="盒子所属区域：" class="mar-bottom0">
							<el-select v-model="searForm.provinceId" clearable placeholder="请选择" no-data-text="没有数据" @change="provinceChange" @clear="clearLinkage(1)">
								<el-option v-for="item in provinceList" :key="item.cityId" :label="item.cn" :value="item.cityId">
								</el-option>
							</el-select>
							<el-select v-model="searForm.cityId" clearable placeholder="请选择" no-data-text="请先选择省份" @change="cityChange" @clear="clearLinkage(2)">
								<el-option v-for="item in cityList" :key="item.cityId" :label="item.cn" :value="item.cityId">
								</el-option>
							</el-select>
							<el-select v-model="searForm.regionId" clearable placeholder="请选择" no-data-text="请先选择城市">
								<el-option v-for="item in districtList" :key="item.cityId" :label="item.cn" :value="item.cityId">
								</el-option>
							</el-select>
							<el-input v-model="searForm.boxCode" placeholder="请输入盒子编号"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div class="toolbar-function">
					<p>
						<div class="sear-oper-box">
							<el-button type="success" @click="searchToolbar">查询</el-button>
							<el-button type="primary" @click="resetForm('searForm')">清空</el-button>
						</div>
					</p>
				</div>
			</el-col>
		</el-row>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10">
				<div class="sear-oper-excel-box">
					<el-button type="warning" @click="routerPush" icon="plus">绑定新盒子</el-button>
				</div>
				<el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus">
					<el-table-column prop="boxCode" label="盒子编号" width="100" header-align="center" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="boxName" label="盒子名称" width="160" header-align="center" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="runStatus" label="盒子状态" width="100" header-align="center" align="center">
						<template slot-scope="scope">
							<span :class="scope.row.runStatus === 1 ? 'f-success' : ''">{{ scope.row.runStatus | enableStatus}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="地址" header-align="center" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="date" label="绑定日期" width="160" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{ scope.row.createTime | convertTime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="110" header-align="center" align="center">
						<template slot-scope="scope">
							<div class="list-oper-box">
								<el-button type="primary" @click="unbindBox(scope.row.storageBoxMappingId)">解除绑定</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 仓库绑定盒子
	import fengPagination from '@/components/fengModule/pagination.vue'
	import { mapGetters } from 'vuex'
	import '@/static/style/warehouse/bind.scss'

	export default {
		data() {
			return {
				id: this.$route.params.id,
				moduleData: {
					list: [],
					total: 0
				},
				showForm: [],
				searForm: {
					"cityId": '',
					"provinceId": '',
					"regionId": '',
					'boxCode':'',
					'storageId': this.$route.params.id
				},
				searchBtn: false,
			}
		},
		created() {
			let param = {
				bone: '仓库管理',
				boneUrl: '/warehouse/warehouseList',
				btwo: '仓库绑定盒子'
			}
			this.$store.dispatch('switchBreadcrumb', param);
			this.$store.dispatch('getCityList', { "parentId": 414, 'type': 1 });
			this.getDefaInfo();
			this.getModuleData();
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
			// 获取基础信息
			getDefaInfo() {
				this.$store.dispatch('switchLoadingStatus', true);
				this.$api.apiCommunicationGet('/storage/getById/' + this.id, res => {
					this.$store.dispatch('switchLoadingStatus', false);
					if(res.code != 2000) {
						this.$alert(`服务器返回信息:  ${res.msg}`, '系统通知', { confirmButtonText: '确定' })
						return false;
					}
					this.showForm = res.data;
				}, 'basedata')
			},
			// 获取列表信息
			getModuleData(data) {
				this.$store.dispatch('switchLoadingStatus', true)
				this.$api.apiCommunication('/storage/getBindingList', this.searForm, res => {
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

				}, 'basedata');
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
						this.searForm.cityId = ''
						this.searForm.regionId = ''
						break
					case 2:
						// 清除三级
						this.searForm.regionId = ''
						break
				}
			},
			handleCurrentChange(val) {
				this.currentPage = val
				if(this.searchBtn && (this.searForm.provinceId !== '' || this.searForm.cityId !== '' || this.searForm.regionId !== '')) {
					this.searchToolbar(val)
					return false
				}
				this.getModuleData({ pageNum: val })
			},
			searchToolbar(val) {
				let param = {
					pageNum: (typeof val === "number") ? val : 1
				};
				Object.assign(param, this.searForm);
				this.searchBtn = true;
				this.getModuleData(param);
			},
			// 清空操作
			resetForm(formName) {
				this.searForm.cityId = '';
				this.searForm.provinceId = '';
				this.searForm.regionId = '';
				this.searForm.boxCode = '';
				this.$refs[formName].resetFields();
			},
			routerPush() {
				this.$router.push({ name: 'warehouseBindBox', params: { id: this.id } })
			},
			// 解除绑定
			unbindBox(id) {
				this.$confirm('确定解除绑定?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api.apiCommunicationGet('/storage/unbindBox/' + id, res => {
						this.$store.dispatch('switchLoadingStatus', false);
						if(res.code != 2000) {
							this.$alert(`服务器返回信息:  ${res.msg}`, '系统通知', { confirmButtonText: '确定' })
							return false;
						}
						this.getModuleData();
					}, 'basedata')
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消绑定'
					});
				});
			}
		},
		components: {
			fengPagination
		}
	}
</script>