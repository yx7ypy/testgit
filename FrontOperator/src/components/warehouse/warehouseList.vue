<template>
	<div class="warehouse-list">
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
				<div class="toolbar-from">
					<el-form :model="searForm" ref="searForm" :inline="true" @submit.prevent.native label-width="90px">
						<el-form-item label="仓库编号：">
							<el-input placeholder="请输入编号" v-model="searForm.storageCode"></el-input>
						</el-form-item>
						<el-form-item label="选择区域：">
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
						</el-form-item>
						<el-form-item label="运行状态：" class="mar-bottom0">
							<el-select v-model="searForm.isDelete" filterable clearable placeholder="运行状态" no-data-text="没有数据">
								<el-option v-for="item in isDeleteList" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
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
				<el-button type="warning" @click="routerPush('created')" icon="plus">新建仓库</el-button>
				</div>
				<el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus">
					<el-table-column prop="storageCode" label="仓库编号" width="100" header-align="center" align="center"></el-table-column>
					<el-table-column prop="storageName" label="仓库名称" width="160" header-align="center" align="center"></el-table-column>
					<el-table-column label="省份/城市/区/镇" width="170" header-align="center" align="center">
						<template slot-scope="scope">
							{{ scope.row.provinceName + '-' + scope.row.cityName + '-' + scope.row.regionName }}
						</template>
					</el-table-column>
					<el-table-column prop="address" label="详细地址" header-align="center" align="center"></el-table-column>
					<el-table-column prop="isDelete" label="运行状态" width="100" header-align="center" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.isDelete === 0" style="color: #13ce66;">启用</span>
							<span v-else>未启用</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="创建日期" width="160" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{ scope.row.createTime | convertTime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="230" header-align="center" align="center">
						<template slot-scope="scope">
							<div class="list-oper-box">
							<el-button type="primary" size="small" @click="routerPush('info', scope.row.storageId)">查看</el-button>
							<el-button type="warning" size="small" @click="routerPush('editor', scope.row.storageId)">编辑</el-button>
							<el-button type="success" size="small" @click="routerPush('bind', scope.row.storageId)">绑定盒子</el-button>
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
	// 仓库列表
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
				isDeleteList: [
					{ value: '', label: '所有' },
					{ value: '0', label: '启用' },
					{ value: '1', label: '未启用' }
				],
				searForm: {
					"cityId": '',
					"provinceId": '',
					"regionId": '',
					"storageCode": '',
					'isDelete': ''
				},
				searchBtn: false,
			}
		},
		created() {
			this.$store.dispatch('switchBreadcrumb', { bone: '仓库管理' });
			this.getModuleData({ "pageNum": 1 });
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
			getModuleData(data) {
				// 获取数据
				this.$store.dispatch('switchLoadingStatus', true);
				this.$api.apiCommunication('/storage/getList', data, res => {
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
			// 清空操作
			resetForm(formName) {
				this.searForm.cityId = '';
				this.searForm.provinceId = '';
				this.searForm.regionId = '';
				this.searForm.storageCode = '';
				this.searForm.isDelete = '';
				this.$refs[formName].resetFields();
			},
			routerPush(type, id) {
				switch(type) {
					case 'created':
						// 新建
						this.$router.push({ name: 'warehouseCreate' })
						break
					case 'info':
						// 查看
						this.$router.push({ name: 'warehouseInfo', params: { id: id } })
						break
					case 'bind':
						// 绑定
						this.$router.push({ name: 'warehouseBind', params: { id: id } })
						break
					case 'editor':
						// 编辑
						this.$router.push({ name: 'warehouseEditor', params: { id: id } })
						break
				}
			}
		},
		components: {
			fengPagination
		}
	}
</script>