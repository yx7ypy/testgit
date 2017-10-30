<template>
	<div class="detail">
		<el-form label-position="right" label-width="130px">
			<el-form-item label="商品编号：">{{boxInfo.productCode}}</el-form-item>
			<el-form-item label="品类：">一级品类：{{boxInfo.firstClassificationName}}    二级品类：{{boxInfo.secondClassificationName}}   三级品类：{{boxInfo.thirdClassificationName}}</el-form-item>
			<el-form-item label="国际条码：">{{boxInfo.barCode}}</el-form-item>
			<el-form-item label="商品名称：">{{boxInfo.productName}}</el-form-item>
			<el-form-item label="包装单位：">{{boxInfo.packDictName}}</el-form-item>
			<el-form-item label="规格单位：">{{boxInfo.specification}}{{boxInfo.specificationName}}</el-form-item>
			<el-form-item label="保质期：">{{boxInfo.expiration}}{{boxInfo.expirationName}}</el-form-item>
			<el-form-item label="效期提醒：">{{boxInfo.alarmBefore}}{{boxInfo.alarmBeforeName}}</el-form-item>
			<el-form-item label="商品产地：">{{boxInfo.producingArea}}</el-form-item>
			<el-form-item label="默认售价：">{{boxInfo.defaultPrice}}</el-form-item>
			<el-form-item label="预估进价：">{{boxInfo.purchasePrice}}</el-form-item>
			<el-form-item label="毛利率：">{{(boxInfo.defaultPrice - boxInfo.purchasePrice) / boxInfo.defaultPrice * 100 | toFixed}} %</el-form-item>
			<el-form-item label="图片：">
				<feng-image-list :imageUrl="imageUrl"></feng-image-list>
			</el-form-item>
			<el-form-item label="商品状态：">
				<template slot-scope="scope">
					<span v-if="boxInfo.isDelete">未启用</span>
					<span v-else>启用中</span>
				</template>
			</el-form-item>
			<el-form-item label="">
				<feng-cancel solttitle="返回" type="primary" size="small"></feng-cancel>
			</el-form-item>
		</el-form>
	</div>

</template>

<script>
	import fengCancel from '@/components/fengModule/cancel.vue'
	import fengImageList from '@/components/fengModule/imageList.vue'
	import '@/static/style/goods/see.scss';
	export default {
		data() {
			return {
				boxInfo: [],
				imageUrl:''
			}
		},
		created() {
			let param = {
				bone: '商品管理',
				boneUrl: '/goods/goodsList',
				btwo: '查看商品'
			};
			this.$store.dispatch('switchBreadcrumb', param);
			this.getGoodsData();
		},
		methods: {
			getGoodsData() {
				this.$store.dispatch('switchLoadingStatus', true)
				let _id = this.$route.params.id;
				this.$api.apiCommunicationGet('/product/getById/' + _id, res => {
					this.$store.dispatch('switchLoadingStatus', false)
					if(res.code != 2000) {
						this.$alert(`查看失败;服务器返回信息:  ${res.msg}`,'系统通知',{confirmButtonText:'确定'})
						return false
					}
					this.boxInfo = res.data;
					this.imageUrl = JSON.stringify(res.data.productImages);
				})
			},
			
		},
		components:{
			fengImageList,
			fengCancel
		},
		
	}
</script>