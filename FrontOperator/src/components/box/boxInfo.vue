<template>
	<div class="detail">
		<el-form label-position="right" label-width="130px">
			<el-form-item label="盒子编号：">{{goodsInfo.boxCode}}</el-form-item>
			<el-form-item label="盒子名称：">{{goodsInfo.boxName}}</el-form-item>
			<el-form-item label="省份：">{{goodsInfo.provinceName}}</el-form-item>
			<el-form-item label="城市：">{{goodsInfo.cityName}}</el-form-item>
			<el-form-item label="区域：">{{goodsInfo.districtName}}</el-form-item>
			<el-form-item label="详细地址：">{{goodsInfo.address}}</el-form-item>
			<el-form-item label="开门方式：">
				<template slot-scope="scope">
					<span v-if="goodsInfo.boxDoorType == 1">自动门</span>
					<span v-else>手拉门</span>
				</template>
			</el-form-item>
			<el-form-item label="盒子状态：">
				<template slot-scope="scope">
					<span v-if="goodsInfo.isBinding === 1 && goodsInfo.operatorIsBinding === 1">绑定</span>
					<span v-if="goodsInfo.isBinding === 0 && goodsInfo.operatorIsBinding === 1">绑定</span>
					<span v-if="goodsInfo.isBinding === 1 && goodsInfo.operatorIsBinding === 0">绑定</span>
					<span v-if="goodsInfo.isBinding === 0 && goodsInfo.operatorIsBinding === 0">未绑定</span>
				</template>
			</el-form-item>
			<el-form-item label="运行状态：">
				<template slot-scope="scope">
					<span :class="goodsInfo.runStatus === 1 ? 'f-success' : ''">{{ goodsInfo.runStatus | enableStatus}}</span>
				</template>
			</el-form-item>
			<el-form-item label="运营状态：">
				<template slot-scope="scope">
					<span v-if="goodsInfo.isBinding === 1 && goodsInfo.operatorIsBinding === 1">代运营</span>
					<span v-if="goodsInfo.isBinding === 0 && goodsInfo.operatorIsBinding === 1">自运营</span>
					<span v-if="goodsInfo.isBinding === 1 && goodsInfo.operatorIsBinding === 0">代运营</span>
					<span v-if="goodsInfo.isBinding === 0 && goodsInfo.operatorIsBinding === 0">未绑定</span>
				</template>
			</el-form-item>
			<el-form-item label="盒子4G经纬度：">{{goodsInfo.latitude}},{{goodsInfo.longitude}}</el-form-item>
			<el-form-item label="盒子WIFI经纬度：">{{goodsInfo.wifiLatitude}},{{goodsInfo.wifiLongitude}}</el-form-item>
			<el-form-item label=" ">
				<feng-cancel solttitle="返回" type="primary" size="small"></feng-cancel>
			</el-form-item>
		</el-form>
	</div>

</template>

<script>
	import fengCancel from '@/components/fengModule/cancel.vue'
	import '@/static/style/box/see.scss'

	export default {
		data() {
			return {
				goodsInfo: [],
			}
		},
		created() {
			let param = {
				bone: '盒子管理',
				boneUrl: '/box/boxList',
				btwo: '查看盒子'
			};
			this.$store.dispatch('switchBreadcrumb', param);
			this.getGoodsData();
		},
		methods: {
			getGoodsData() {
				this.$store.dispatch('switchLoadingStatus', true)
				let _id = this.$route.params.id;
				this.$api.apiCommunicationGet('/box/detail/' + _id, res => {
					this.$store.dispatch('switchLoadingStatus', false)
					if(res.code != 2000) {
						this.$alert(`查看失败;服务器返回信息:  ${res.msg}`, '系统通知', { confirmButtonText: '确定' })
						return false
					}
					this.goodsInfo = res.data;
				})
			}
		},
		components: {
			fengCancel
		}
	}
</script>