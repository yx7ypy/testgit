<template>
	<div class="intoBox-deta-box">
		<!--入盒详情-->
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item display-table top-toolbar-complex">
				<div class="toolbar-function">
					<ul class="info">
						<li><span>入盒单单号：</span><span>{{moduleData.gt.goodsTransferCode}}</span></li>
						<li><span>盒子编号：</span><span>{{moduleData.gt.boxCode}}</span></li>
						<li><span>商品种类：</span><span>{{moduleData.gt.categoryNum}}</span></li>
						<li><span>商品总数量：</span><span>{{moduleData.gt.totalCount}}</span></li>
						<li><span>入盒时间：</span><span>{{moduleData.gt.operateTime|convertTime}}</span></li>
					</ul>
				</div>
			</el-col>
		</el-row>
		<!--信息展示区域-->
		<el-row class="mar-bottom10" style="width: 100%;">
			<el-col :span="24" class="el-item pdd-10">
				<el-table :data="moduleData.page.list" border :stripe="true" v-loading.body="loadingStatus">
					<el-table-column align="center" prop="" label="序号" class="tc" width="100">
						<template slot-scope="scope">
							<span>{{scope.$index+1}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="productBarCode" label="国际条码"></el-table-column>
					<el-table-column align="center" prop="productCode" label="商品编号" width="160"></el-table-column>
					<el-table-column align="center" prop="productName" label="商品名称" width="160"></el-table-column>
					<el-table-column align="center" prop="productPackName" label="包装" width="160"></el-table-column>
					<el-table-column align="center" prop="specificationName" label="规格" width="160"></el-table-column>
					<el-table-column align="center" prop="count" label="实际入盒数量" width="160"></el-table-column>
				</el-table>
				<feng-pagination :total="moduleData.page.total" @handle="handleCurrentChange" :current-page="currentPage"></feng-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 商品列表
	import fengPagination from '@/components/fengModule/pagination.vue'
	import { mapGetters } from 'vuex'
	import '@/static/style/intoBox/deta.scss'
	export default {
		data() {
			return {
				currentPage: 1,
				moduleData: {
					page: {
						list: [],
						total: 0
					},
					gt: []
				},
				id: this.$route.params.id
			}
		},
		created() {
			let param = {
				bone: '商品入盒',
				boneUrl: '/intobox/intoboxList',
				btwo: '入盒单详情'
			};
			this.$store.dispatch('switchBreadcrumb', param);
			let _data = { "goodsTransferSnapshotId":this.id };
			this.getModuleData(_data);
		},
		computed: {
			...mapGetters([
				'loadingStatus',
			])
		},
		methods: {
			getModuleData(data) {
				this.$store.dispatch('switchLoadingStatus', true);
				this.$api.apiCommunication('/goodsTransfer/getGoodsTransferDetailSnapshots', data, res => {
					this.$store.dispatch('switchLoadingStatus', false)
					if(res.code != 2000) {
						this.moduleData = {
								page: {
									list: [],
									total: 0
								},
								gt: []
							}
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false;
					}
					this.moduleData = res.data;
				})
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val
				this.getModuleData({ pageNum: val , goodsTransferSnapshotId : this.id })
			},
		},
		components: {
			fengPagination
		}
	}
</script>