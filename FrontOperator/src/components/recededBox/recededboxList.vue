<template>
	<div class="goods-list-box">
		<!--搜索区域-->
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item display-table top-toolbar-complex">
				<div class="toolbar-function tr">
					<el-form :model="searForm" ref="searForm" :inline="true" class="tr">
						<div class="h">
							<el-form-item class="fl" label="盒子编号：">
								<el-input placeholder="请输入编号" class="function-search" v-model="searForm.boxCode" icon="boxCode"></el-input>
							</el-form-item>
							<el-form-item class="fl" label="退盒类型：">
								<el-select v-model="searForm.returnedType" placeholder="请选择">
									<el-option v-for="item in returnedTypeList" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
						<div class="h">
							<el-form-item class="fl" label="退盒单号：">
								<el-input placeholder="退盒单号" class="function-search" v-model="searForm.transferCode" icon="boxCode"></el-input>
							</el-form-item>
							<el-form-item class="fl max" label="创建日期：">
								<el-date-picker v-model="searForm.startDate" type="date" :editable=false placeholder="开始日期">
								</el-date-picker>
								<span style="margin: 0 1%;">至</span>
								<el-date-picker v-model="searForm.endDate" type="date" :editable=false placeholder="开始日期">
								</el-date-picker>
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
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10">
				<el-table :data="moduleData.list" border :stripe="true" v-loading.body="loadingStatus" style="width: 100%;">
					<el-table-column align="center" prop="" label="序号" class="tc" width="100">
						<template slot-scope="scope">
							<span>{{scope.$index+1}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="goodsTransferCode" label="退盒单号" width="100"></el-table-column>
					<el-table-column align="center" prop="returnedType" label="退盒类型" width="160">
						<template slot-scope="scope">
							<span v-if="scope.row.returnedType === 1">正常退</span>
							<span v-if="scope.row.returnedType === 2">报损退</span>
							<span v-if="scope.row.returnedType === 3">效期退</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="boxCode" label="盒子编号" width="160"></el-table-column>
					<el-table-column align="center" prop="categoryNum" label="退盒商品种类" width="160"></el-table-column>
					<el-table-column align="center" prop="totalCount" label="退盒商品数量" width="200"></el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<div class="list-oper-box">
							<el-button type="info" @click="routerPush(scope.row.goodsTransferSnapshotId)">查看</el-button>
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
	// 退盒列表
	import fengPagination from '@/components/fengModule/pagination.vue'
	import { mapGetters } from 'vuex'
	import '@/static/style/goods/list.scss'
	export default {
		data() {
			return {
				currentPage: 1,
				moduleData: {
					list: [],
					total: 0
				},
				searForm: {
					'boxCode': '', // 盒子编号
					'transferCode': '', // 单号
					'returnedType': '', // 退盒类型
					'startDate': '', // 开始时间
					'endDate': '', // 结束时间
					"pageSize": 10,
					"pageNum": 1
				},
				returnedTypeList: [
					{ value: '', label: '所有' },
					{ value: '1', label: '正常退' },
					{ value: '2', label: '报损退' },
					{ value: '3', label: '效期退' }
				],
			}
		},
		created() {
			this.$store.dispatch('switchBreadcrumb', { bone: '退盒单列表' });
			this.getModuleData({ "franchiseeId": 1 });
		},
		computed: {
			...mapGetters([
				'loadingStatus'
			])
		},
		methods: {
			getModuleData(data) {
				this.$store.dispatch('switchLoadingStatus', true);
				this.$api.apiCommunication('/goodsTransfer/getReturnedGoodsTransferSnapshot', data, res => {
					this.$store.dispatch('switchLoadingStatus', false);
					if(res.code != 2000) {
						this.moduleData = {
							list: [],
							total: 0
						}
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false;
					}
					if(res.data) {
						this.moduleData = res.data;
					} else {
						this.moduleData = {
							list: [],
							total: 0
						}
					}
				})
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val
				if(this.searchBtn && (this.searForm.boxCode !== '' || this.searForm.startDate !== '' || this.searForm.endDate !== '')) {
					this.searchToolbar(val)
					return false
				}
				this.getModuleData({ pageNum: val })
			},
			searchToolbar(val) {
				let param = {
					pageNum: (typeof val === "number") ? val : 1
				}
				Object.assign(param, this.searForm);
				this.searchBtn = true
				this.getModuleData(param)
			},
			routerPush(id, type) {
				this.$router.push({ name: 'recededboxInfo', params: { id: id } })
				return false

			},
			fomatDateStart(value) {
				if(value) {
					this.searForm.startDate = new Date(this.searForm.startDate).format('yyyy-MM-dd');
				} else {
					this.searForm.startDate = '';
				}
			},
			fomatDateEnd(value) {
				if(value) {
					this.searForm.endDate = new Date(this.searForm.endDate).format('yyyy-MM-dd');
				} else {
					this.searForm.endDate = '';
				}
			},
			// 清空操作
			resetForm(formName) {
				this.searForm.boxCode = '';
				this.searForm.transferCode = '';
				this.searForm.returnedType = '';
				this.searForm.startDate = '';
				this.searForm.endDate = '';
				this.$refs[formName].resetFields();
			},
		},
		components: {
			fengPagination
		}
	}
</script>