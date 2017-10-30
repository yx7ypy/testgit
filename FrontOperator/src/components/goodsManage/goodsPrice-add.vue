<template>
	<div class="goods-price-box">
		<!--内容区域-->
		<div class="con-box">
			<!--查询区域-->
			<div class="top clearfix">
				<span>选择需要变价的商品：</span>
				<el-input v-model="searData.barCode" placeholder="请输入国际条码"></el-input>
				<el-input v-model="searData.productCode" placeholder="请输入商品编号"></el-input>
				<el-input v-model="searData.productName" placeholder="请输入商品名称"></el-input>
				<el-button type="success" @click="searFn" style="background: #09bb07;border: none;">确认</el-button>
				<el-upload class="upload-demo" :action="`${product_host}/product/impProductScenarioPriceExcel`" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :with-credentials="true">
					<el-button size="small" type="primary" style="background: #ec6d1e;border: none;">批量导入EXCEL修改价格</el-button>
				</el-upload>
				<el-button type="primary" @click="com.openUrl(`${product_host}/product/downImpProductScenarioPriceTemplate`)" class="editor-coordinate" style="background: #fff;border: none;color: #407ef5;text-decoration: underline;">导入模板下载 > </el-button>
			</div>
			<!--查询得到的信息区域-->
			<div class="info" v-show="isShow">
				<div class="leftbox">
					<el-form-item label="">
						<feng-image-list :imageUrl="imageUrl"></feng-image-list>
					</el-form-item>
				</div>
				<div class="middlebox">
					<ul>
						<li class="bg-info-li1">
							<span>商品名称：</span>
							<span>{{priceInfo.productName}}</span>
						</li>
						<li class="bg-info-li1">
							<span>商品产地：</span>
							<span>{{priceInfo.producingArea}}</span>
						</li>
						<li class="bg-info-li1">
							<span>包装单位：</span>
							<span>{{priceInfo.packDictName}}</span>
						</li>
						<li class="bg-info-li1">
							<span>规格单位：</span>
							<span>{{priceInfo.specificationName}}</span>
						</li>
						<li class="bg-info-li1">
							<span>默认售价：</span>
							<span>{{priceInfo.defaultPrice}}</span>
						</li>
						<li class="bg-info-li1">
							<span>成本价：</span>
							<span>{{priceInfo.floorPrice}}</span>
						</li>
					</ul>
					<el-row class="mar-bottom10">
						<el-col :span="24" class="el-item">
							<div class="price-box">
								<div class="topbar">其他定价方案</div>
								<template v-for="(child, index) in scenarioPriceList">
									<button class="minus" v-if="index == scenarioPriceList.length-1 && child.productScenarioPrice == ''" v-on:click="shanchu($index)">&mdash;</button>
									<span slot="prepend">{{ child.scenarioPriceName }}</span>
									<input v-model="child.productScenarioPrice" placeholder="请输入该方案价格">
									</input>	
									<span slot="append">毛利率: {{ (child.productScenarioPrice - priceInfo.floorPrice) / child.productScenarioPrice*100 | toFixed }}%
									</span>
									<button class="fa">导出售价方案</button>
									<button class="gs">归属盒子</button>
									<br>
								</template>
								<!-- <template v-for="(child, index) in scenarioPriceList">
									<el-input v-model="child.productScenarioPrice" placeholder="请输入该方案价格">
										<template slot="prepend">{{ child.scenarioPriceName }}</template>
										<template slot="append">毛利率: {{ (child.productScenarioPrice - priceInfo.floorPrice) / child.productScenarioPrice*100 | toFixed }}%</template>
									</el-input>
								</template> -->
								<br>
								<i style="color: #1296db;font-size: 40px;cursor: pointer;" class="iconfont icon-16pxtianjia" @click="plueFn"></i>
								<br>
								<div class="xia">
									<el-button class="baocun" type="primary" @click="goHold" :loading="loadingStatus">保存</el-button>
									<!-- <button class="fanhui" @click="tiaozhuan">返回</button> -->
									<router-link class="fanhui" to="/goods/goodsList">返回</router-link>
								</div>
								
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import fengImageList from '@/components/fengModule/imageList_salePriceManagement.vue';
import { basicConfig } from '@/config/config.js';
import '@/static/style/goods/goodsprice.scss';
export default {
	data() {
		return {
			isShow: false,
			num: null,
			imageUrl:"",
			scenarioPriceList: {}, // 价格方案列表
			scenarioPriceListArr: [], // 价格方案列表
			productId: '', // 商品ID ; 在点击确认后会获取
			searData: {
				'barCode': '', //国际条码
				'productCode': '', // 商品编号
				'productName': '' // 商品名称
			}, // 确认传递的对象
			priceInfo: [],
			product_host: basicConfig.PRODUCT_HOST
		}
	},
	created() {
		let _barCode = this.$route.params.id;
		let param = {
			bone: '商品管理',
			boneUrl: '/goods/goodsList',
			btwo: '售价管理'
		}
		this.$store.dispatch('switchBreadcrumb', param)
		if (_barCode) {
			this.searData.barCode = _barCode;
			this.searFn(this.searData.barCode);
		}
	},
	computed: {
		loadingStatus() { return this.$store.getters.loadingStatus },
	},
	methods: {
		// 未成功，scenarioPriceList显示未定义
		shanchu(index){
			if(scenarioPriceList){
				scenarioPriceListArr = JSON.parse(JSON.stringify(scenarioPriceList).split(",")).splice(index,1);
				scenarioPriceList = JSON.parse(scenarioPriceListArr.join(","));
			}
		},
		searFn() {
			if (this.searData.barCode == '' && this.searData.productCode == '' && this.searData.productName == '') {
				this.isShow = false;
				this.$alert('查询失败;请确认有正确的查询条件', '系统通知', { confirmButtonText: '确定', type: 'error' });
				return false;
			}
			this.$api.apiCommunication('/product/queryProductScenarioPrice', this.searData, res => {
				if (res.code != 2000) {
					this.isShow = false;
					this.$alert(`查询失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
					return false;
				}
				if (res.data) {
					this.isShow = true;
					this.priceInfo = res.data; // 要展示的信息
					console.log(res.data);
					this.productId = res.data.productId;
					this.scenarioPriceList = res.data.scenarioPriceList; // 要展示的定价方案信息
					this.num = res.data.scenarioPriceList.length;
				} else {
					this.isShow = false;
					this.priceInfo = [];
				}
			})
		},
		plueFn() {
			if (this.num < 9) {
				let scenarioPriceName;
				this.num++;
				scenarioPriceName = "方案" + this.num;
				this.scenarioPriceList.push({
					productId: this.productId,
					scenarioPriceNumber: this.num,
					scenarioPriceName: scenarioPriceName,
					productScenarioPrice: '',
				});
			} else {
				this.$alert('添加失败;最多可添加9种方案', '系统通知', { confirmButtonText: '确定', type: 'error' });
				return false;
			}
		},
		goHold() {
			let numReg = /^(\-|\+)?\d+(\.\d+)?$/;
			for (let item of this.scenarioPriceList) {
				//					console.log(item.productScenarioPrice);
				if (!numReg.test(item.productScenarioPrice) || item.productScenarioPrice == '') {
					this.$alert('请保证添加的方案价格为合法不为空的数字类型', '系统通知', { confirmButtonText: '确定', type: 'error' })
					return false;
				}
			}
			let _data = {
				scenarioPriceList: this.scenarioPriceList
			}
			this.$api.apiCommunication('/product/saveProductScenarioPrice', _data, res => {
				if (res.code != 2000) {
					this.isShow = false;
					this.$alert(`添加失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
					return false;
				} else {
					this.$notify({ title: '系统通知', message: '保存成功！', type: 'success' })
				}

			})
		},
		handleAvatarSuccess(res, file, fileList) {
			if (res.code != 2000) {
				let newDatas = [];
				const h = this.$createElement;
				for (let item of res.data) {
					newDatas.push(h('p', null, item))
				}
				this.$msgbox({
					title: `${res.msg}`,
					message: h('p', null, newDatas)
				});
				// this.$alert(`导入失败，服务器返回信息：${res.data}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
				fileList = [];
				return false;
			}
			this.$alert(`导入成功`, '系统通知', { confirmButtonText: '确定', type: 'success' })
		},
		handleAvatarError(res) {
			console.log(res);
		}
	},
	components: {

	}
}
</script>