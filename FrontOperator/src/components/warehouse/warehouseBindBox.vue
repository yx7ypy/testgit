<template>
	<div>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
				<div class="toolbar-from">
					<el-form :inline="true" @submit.prevent.native label-position="left" label-width="">
						<el-form-item label="仓库编号：">{{showForm.storageCode}}</el-form-item>
						<el-form-item label="仓库名称："> {{showForm.storageName}} </el-form-item>
						<el-form-item label="仓库详细地址："> {{showForm.address}} </el-form-item>
					</el-form>
				</div>
			</el-col>
		</el-row>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10">
				<el-form :model="searForm" :inline="true" @submit.prevent.native label-position="left" label-width="85px">
					<el-form-item label="绑定盒子：" class="mar-bottom0">
						<el-input placeholder="请输入编号" v-model="searForm.boxCode"></el-input>
					</el-form-item>
					<el-form-item class="mar-bottom0">
						<el-button type="primary" @click="plusBox" icon="plus">添加</el-button>
					</el-form-item>
				</el-form>
				<el-table class="mar-top10" :data="moduleData.list" border :stripe="true" :row-class-name="com.tableRowDisabled" v-loading.body="loadingStatus" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
					<el-table-column label="序号" width="80" header-align="center" align="center">
						<template slot-scope="scope">
							{{ scope.$index + 1 }}
						</template>
					</el-table-column>
					<el-table-column prop="boxCode" label="盒子编号" width="100" header-align="center" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="boxName" label="盒子名称" width="160" header-align="center" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column label="省份/城市/区域" width="160" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.provinceName + '-' + scope.row.cityName + '-' + scope.row.districtName}}
						</template>
					</el-table-column>
					<el-table-column prop="address" label="详细地址" header-align="center" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="status" label="状态" width="100" header-align="center" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<span :class="scope.row.runStatus === 1 ? 'f-success' : ''">{{ scope.row.runStatus | enableStatus}}</span>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-20">
				<el-button type="primary" @click="bindingBox">绑定盒子</el-button>
				<feng-cancel></feng-cancel>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 仓库绑定新盒子
	import fengCancel from '@/components/fengModule/cancel.vue'
	import { mapGetters } from 'vuex'

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
					boxCode:''
				},
				bindingBoxList: {
					storageId: this.$route.params.id,
					boxIds: []
				}
			}
		},
		created() {
			let param = {
				bone: '仓库管理',
				boneUrl: '/warehouse/warehouseList',
				btwo: '仓库绑定盒子',
				btwoUrl: `/warehouse/warehouseBind/${this.id}`,
				bthree: '绑定新盒子'
			}
			this.$store.dispatch('switchBreadcrumb', param);
			this.getDefaInfo();
		},
		computed: {
			...mapGetters([
				'loadingStatus',
				// 'currentPage'
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
				this.$api.apiCommunication('/storage/getBindingNewList', this.searForm, res => {
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
			// 添加新盒子
			plusBox() {
				this.getModuleData();
			},
			handleSelectionChange(obj) {
				this.bindingBoxList.boxIds = [];
				for(let item of obj) {
					this.bindingBoxList.boxIds.push(item.boxId);
				}
			},
			bindingBox() {
				if(this.bindingBoxList.boxIds.length === 0){
					this.$alert('请选择要绑定的盒子', '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false;
				}
				this.$api.apiCommunication('/storage/bindingBox', this.bindingBoxList, res => {
					if(res.code != 2000) {
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false;
					}
					this.$notify({title: '绑定成功',message: '绑定成功',type: 'success'});
					// 绑定成功后; 然后再获取一次列表信息
					this.getModuleData();
				}, 'basedata');
			}
		},
		components: {
			fengCancel
		}
	}
</script>