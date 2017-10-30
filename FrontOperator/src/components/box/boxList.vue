<template>
	<div class="box-list">
		<!--搜索区域-->
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item display-table top-toolbar-complex">
				<div class="toolbar-function tr">
					<el-form :model="searForm" ref="searForm" :inline="true" class="tr">
						<div class="h">
							<el-form-item class="fl" label="盒子编号 : ">
								<el-input placeholder="盒子编号" class="function-search" v-model="searForm.boxCode" icon="boxCode"></el-input>
							</el-form-item>
							<el-form-item class="fl" label="选择区域 : ">
								<el-select v-model="searForm.provinceId" clearable placeholder="请选择" no-data-text="没有数据" @change="provinceChange" @clear="clearLinkage(1)">
									<el-option v-for="item in provinceList" :key="item.cityId" :label="item.cn" :value="item.cityId">
									</el-option>
								</el-select>
								<el-select v-model="searForm.cityId" clearable placeholder="请选择" no-data-text="请先选择省份" @change="cityChange" @clear="clearLinkage(2)">
									<el-option v-for="item in cityList" :key="item.cityId" :label="item.cn" :value="item.cityId">
									</el-option>
								</el-select>
								<el-select v-model="searForm.districtId" clearable placeholder="请选择" no-data-text="请先选择城市">
									<el-option v-for="item in districtList" :key="item.cityId" :label="item.cn" :value="item.cityId">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
						<div class="h">
							<el-form-item class="fl" label="运行状态 : ">
								<el-select v-model="searForm.runStatus" placeholder="选择盒子状态">
									<el-option v-for="item in runStatusList" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<div class="sear-oper-box">
							<el-button type="success" @click="searchToolbar">查询</el-button>
							<el-button type="info" @click="resetForm('searForm')">清空</el-button>
							</div>
						</div>
					</el-form>
				</div>
			</el-col>
		</el-row>
		<!--信息展示区域-->
		<el-row class="mar-bottom10" style="width: 100%;">
			<el-col :span="24" class="el-item pdd-10">
				<el-table :data="moduleData.list" border :stripe="true" v-loading.body="loadingStatus">
					<el-table-column align="center" prop="boxCode" label="盒子编号" class="tc" width="100"></el-table-column>
					<el-table-column align="center" prop="boxName" label="盒子名称" width="100" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="provinceName" label="省份-城市-区/镇" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{scope.row.provinceName}}-{{scope.row.cityName}}-{{scope.row.districtName}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" label="详细地址" width="100" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" prop="" label="运行状态" width="100">
						<template slot-scope="scope" width="100">
							<span :class="scope.row.runStatus === 1 ? 'f-success' : ''">{{ scope.row.runStatus | enableStatus}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="" label="运营状态" width="100">
						<template slot-scope="scope">
							<span v-if="scope.row.isBinding === 1 && scope.row.operatorIsBinding === 1">代运营</span>
							<span v-if="scope.row.isBinding === 0 && scope.row.operatorIsBinding === 1">自运营</span>
							<span v-if="scope.row.isBinding === 1 && scope.row.operatorIsBinding === 0">代运营</span>
							<span v-if="scope.row.isBinding === 0 && scope.row.operatorIsBinding === 0">未绑定</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="" label="创建日期" width="160" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{scope.row.createTime|convertTime}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="floorPrice" label="在售商品（个）" width="140">
						<template slot-scope="scope">
							<span>{{scope.row.boxInventoryCount}}</span>
							<el-button type="info" size="small" @click="routerPushTwo(scope.row.boxId,scope.row.boxCode,scope.row.boxName,'boxGoodsInfo')">查看</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="300">
						<template slot-scope="scope">
							<div class="list-oper-box">
							<el-button type="warning" @click="routerPush(scope.row.boxId,'boxPrice')">定变价</el-button>
							<el-button type="info" @click="routerPush(scope.row.boxId,'boxInfo')">查看盒子</el-button>
							<el-button type="info" @click="businessPlanBtn(scope.row.boxId,scope.row.boxName)">经营方案</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="currentPage"></feng-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 商品列表
	import fengPagination from '@/components/fengModule/pagination.vue'
	import { mapGetters } from 'vuex'
	import '@/static/style/box/list.scss'
	export default {
		data() {
			return {
				currentPage: 1,
				moduleData: {
					list: [],
					total: 0
				},
				searForm: {
					'provinceId': '', // 一
					'cityId': '', // 二
					'districtId': '', // 三
					'boxCode': '', // 盒子编号
					'runStatus': '', // 运行状态
					"pageSize": 10,
					"pageNum": 1
				},
				runStatusList: [
					{ value: '0', label: '未启用' },
					{ value: '1', label: '启用中' },
					{ value: '2', label: '生产部署中' }
				],
				searchBtn: false,
			}
		},
		created() {
			this.$store.dispatch('switchBreadcrumb', { bone: '盒子管理' })
			this.getModuleData({ "pageSize": 10, "pageNum": 1 })
			this.$store.dispatch('getCityList', { "parentId": 414, 'type': 1 })
		},
		computed: {
			...mapGetters([
				'loadingStatus',
				'provinceList',
				'cityList',
				'districtList'
			])
		},
		methods: {
			getModuleData(data) {
				this.$store.dispatch('switchLoadingStatus', true);
				this.$api.apiCommunication('/box/list', data, res => {
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
				})
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
						this.searForm.districtId = ''
						break
					case 2:
						// 清除三级
						this.searForm.districtId = ''
						break
				}
			},
			routerPush(id, type) {
				if(type == 'boxInfo') {
					this.$router.push({ name: 'boxInfo', params: { id: id } })
				} else if(type == 'boxGoodsInfo') {
					this.$router.push({ name: 'boxGoodsInfo', params: { id: id } })
				} else {
					this.$router.push({ name: 'boxPrice', params: { id: id } })
				}
				return false
			},
			routerPushTwo(id, code, name, type) {
				if(type == 'boxGoodsInfo') {
					this.$router.push({ name: 'boxGoodsInfo', query: { id: id, code: code, name: name } })
				}
			},
			businessPlanBtn(id,name) {
				this.$router.push({name:'businessPlan',params:{id:id,name:name}});
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val
				if(this.searchBtn && (this.searForm.provinceId !== '' || this.searForm.cityId !== '' || this.searForm.districtId !== '')) {
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
				this.searForm.provinceId = ''
				this.searForm.cityId = ''
				this.searForm.districtId = ''
				this.searForm.runStatus = ''
				this.searForm.boxCode = ''
				this.$refs[formName].resetFields();
			},
		},
		components: {
			fengPagination
		}
	}
</script>