<template>
	<div class="warehouse-info">
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item editor-form display-table">
				<div class="form-left">
					<el-form ref="infoData" label-position="right" :model="infoData" label-width="130px">
						<el-form-item label="仓库编号:">{{infoData.storageCode}}</el-form-item>
						<el-form-item label="仓库名称：">{{infoData.storageName}}</el-form-item>
						<el-form-item label="省份：">{{infoData.provinceName}}</el-form-item>
						<el-form-item label="城市：">{{infoData.cityName}}</el-form-item>
						<el-form-item label="区域：">{{infoData.regionName}}</el-form-item>
						<el-form-item label="详细地址：">{{infoData.address}} </el-form-item>
						<el-form-item label="联系人："> {{infoData.linkman}} </el-form-item>
						<el-form-item label="联系人电话："> {{infoData.telephone}} </el-form-item>
						<el-form-item label="仓库状态：">
							<template slot-scope="scope">
								<span v-if="infoData.isDelete">未启用</span>
								<span v-else>已启用</span>
							</template>
						</el-form-item>
						<!--<el-form-item label="绑定的盒子列表：">{{infoData.storageName}}</el-form-item>-->
						<el-form-item label=" ">
							<feng-cancel solttitle="返回" type="primary" size="small"></feng-cancel>
						</el-form-item>
					</el-form>
				</div>
				<div class="form-right"></div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 查看仓库
	import fengCancel from '@/components/fengModule/cancel.vue'
	import '@/static/style/warehouse/warehouse.scss'

	export default {
		data() {
			return {
				infoData: {}
			}
		},
		created() {
			let param = {
				bone: '仓库管理',
				boneUrl: '/warehouse/warehouseList',
				btwo: '查看仓库'
			}
			this.$store.dispatch('switchBreadcrumb', param);
			this.getModuleData();
		},
		methods: {
			getModuleData() {
				this.$store.dispatch('switchLoadingStatus', true)
				let _id = this.$route.params.id;
				this.$api.apiCommunicationGet('/storage/getById/' + _id, res => {
					console.log(res.data);
					this.$store.dispatch('switchLoadingStatus', false)
					if(res.code != 2000) {
						this.$alert(`查看失败;服务器返回信息:  ${res.msg}`, '系统通知', { confirmButtonText: '确定' })
						return false
					}
					this.infoData = res.data;
				},'basedata')
			},

		},
		components: {
			fengCancel
		}
	}
</script>