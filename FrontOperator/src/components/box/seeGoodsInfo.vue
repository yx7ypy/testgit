<template>
	<div class="see-goods-info">
		<ul v-loading.body="" style="overflow: hidden">
			<li class="bg-info-li1">
				<span>商品编号: </span><span>{{boxInfo.productCode}}</span>
			</li>
			<li class="bg-info-li1">
				<span>品类: </span>
				<span>一级品类：{{boxInfo.classification1}}    二级品类：{{boxInfo.classification2}}   三级品类：{{boxInfo.classification3}}</span>
			</li>
			<li class="bg-info-li1">
				<span>国际条码:</span><span>{{boxInfo.barCode}}</span>
			</li>
			<li class="bg-info-li1">
				<span>商品名称:</span><span>{{boxInfo.productName}}</span>
			</li>
			<li class="bg-info-li1">
				<span>包装单位:</span><span>{{boxInfo.packDictName}}</span>
			</li>
			<li class="bg-info-li1">
				<span>规格单位:</span><span>{{boxInfo.specification}}{{boxInfo.specificationName}}</span>
			</li>
			<li class="bg-info-li1">
				<span>保质期:</span><span>{{boxInfo.expiration}}</span>
			</li>
			<li class="bg-info-li1">
				<span>效期提醒:</span><span>{{boxInfo.alarmBefore}}{{boxInfo.alarmBeforeName}}</span>
			</li>
			<li class="bg-info-li1">
				<span>默认售价:</span><span>{{boxInfo.defaultPrice}}</span>
			</li>
			<li class="bg-info-li1">
				<span>预估进价:</span><span>{{boxInfo.floorPrice}}</span>
			</li>
			<li class="bg-info-li1">
				<span>毛利率:</span><span>{{(boxInfo.defaultPrice - boxInfo.floorPrice) / boxInfo.defaultPrice * 100}} %</span>
			</li>
			<li class="bg-info-li1">
				<span>商品状态:</span>
				<span v-if="boxInfo.isDelete">无效</span>
				<span v-else>有效</span>
			</li>
			<li class="bg-info-li1">
				<span>图片:</span>
				<feng-image-list :imageUrl="imageUrl"></feng-image-list>
			</li>
		</ul>
		<el-button type="info" @click="$router.go(-1)">返回</el-button>
	</div>

</template>

<script>
	import '@/static/style/box/seeGoodsInfo.scss';
	import fengImageList from '@/components/fengModule/imageList.vue'
	
	export default {
		data() {
			return {
				boxInfo: [],
				imageUrl:''
			}
		},
		created() {
			let param = {
				bone:'盒子管理',
				boneUrl:'/box/boxList',
				btwo:'商品信息',
				btwoUrl:'/box/boxGoodsInfo',
				bthree:'查看商品详情'
			};
			this.$store.dispatch('switchBreadcrumb', param);
			this.getGoodsData();
		},
		methods: {
			getGoodsData() {
				this.$store.dispatch('switchLoadingStatus', true)
				let _id = this.$route.params.id;
				this.$api.apiCommunicationGet('/box/productDetail/' + _id, res => {
					this.$store.dispatch('switchLoadingStatus', false)
					if(res.code != 2000) {
						this.$alert(`查看失败;服务器返回信息:  ${res.msg}`,'系统通知',{confirmButtonText:'确定'})
						return false
					}
					this.boxInfo = res.data;
					this.imageUrl = JSON.stringify(res.data.imgUrls);
				})
			},
			
		},
		components:{
			fengImageList	
		},
		
	}
</script>