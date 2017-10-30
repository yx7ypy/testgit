<template>
	<div class="box-goods-info">
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10 top-toolbar-inline">
				<div class="toolbar-from">
					<el-form :model="searForm" ref="searForm" :inline="true" @submit.prevent.native label-width="80px">
						<div class="h">
							<el-form-item label="盒子编号 :" prop="boxCode">
								<el-input v-model="searForm.boxCode" placeholder="自动获取" :disabled="true">
								</el-input>
							</el-form-item>
							<el-form-item label="盒子名称 :" prop="boxName">
								<el-input v-model="searForm.boxName" placeholder="自动获取" :disabled="true">
								</el-input>
							</el-form-item>
						</div>
						<div class="h">
							<el-form-item label="商品编号 :" prop="productCode">
								<el-input placeholder="请输入编号" v-model="searForm.productCode"></el-input>
							</el-form-item>
							<el-form-item label="商品名称 :" prop="productName">
								<el-input placeholder="输入商品名称" v-model="searForm.productName"></el-input>
							</el-form-item>
							<el-form-item label="国际条码 :" prop="barCode">
								<el-input placeholder="输入国际条码" v-model="searForm.barCode"></el-input>
							</el-form-item>
						</div>
						<div class="h">
							<el-form-item class="fl" label="选择品类 :">
								<el-select v-model="searForm.firstClassificationId" clearable placeholder="请选择" no-data-text="没有数据" @change="firstChange" @clear="clearLinkage(1)">
									<el-option v-for="item in firstCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
								<el-select v-model="searForm.secondClassificationId" clearable placeholder="请选择" no-data-text="请先选择一级品类" @change="secondChange" @clear="clearLinkage(2)">
									<el-option v-for="item in secondCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
								<el-select v-model="searForm.thirdClassificationId" clearable placeholder="请选择" no-data-text="请先选择一二级品类">
									<el-option v-for="item in thirdCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
					</el-form>
				</div>
				<div class="toolbar-function">
					<p>
						<el-button type="warning" @click="exportExcel">导出EXCEL</el-button>
					</p>
					<p class="mar-top10">
						<el-button type="success" @click="searchToolbar">查询</el-button>
						<el-button type="primary" @click="resetForm('searForm')">清空</el-button>
					</p>
				</div>
			</el-col>
		</el-row>
		<feng-gridoverview :module="statiModule" class="mar-bottom10"></feng-gridoverview>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-10">
				<el-table class="mar-top10" :data="moduleData.list" border :stripe="true" v-loading.body="loadingStatus" style="width: 100%;">
					<el-table-column prop="" label="图片" width="100" class="tc">
						<template slot-scope="scope">
							<!--<img :src="(scope.row.imgUrl === '' || scope.row.imgUrl === null) ? 'https://img.alicdn.com/i2/2/TB1GAvUKVXXXXa0XpXXSutbFXXX.jpg_90x90q90.jpg' : imageHost+scope.row.imgUrl" alt="" />-->
							<img :src="imageHost+scope.row.imgUrl" alt="商品图片" />
						</template>
					</el-table-column>
					<el-table-column prop="productCode" label="商品信息" width="280">
						<template slot-scope="scope">
							<ul>
								<li><span>商品编号：</span><span>{{scope.row.productCode}}</span></li>
								<li><span>国际条码：</span><span>{{scope.row.barCode}}</span></li>
								<li><span>名称：</span><span>{{scope.row.productName}}</span></li>
								<li><span>品类：</span><span>{{scope.row.classification1}}-{{scope.row.classification2}}-{{scope.row.classification3}}</span></li>
							</ul>
						</template>
					</el-table-column>
					<el-table-column prop="" label="包装/规格" width="200">
						<template slot-scope="scope">
							<ul>
								<li><span>包装：</span><span>{{scope.row.packDict}}{{scope.row.packDictName}}</span></li>
								<li><span>规格：</span><span>{{scope.row.specification}}{{scope.row.specificationName}}</span></li>
							</ul>
						</template>
					</el-table-column>
					<el-table-column prop="salePrice" label="售价（元）" width="140"></el-table-column>
					<el-table-column prop="floorPrice" label="成本（元）" width="120"></el-table-column>
					<el-table-column prop="inventoryCount" label="盒子库存"></el-table-column>
					<el-table-column label="操作" width="200">
						<template slot-scope="scope">
							<el-button type="primary" size="small" @click="routerPush('seeGoodsInfo',scope.row.productId)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<feng-pagination :total="moduleData.total" @handle="handleCurrentChange" :current-page="1"></feng-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 销售收款报表
	import fengGridoverview from '@/components/fengModule/gridOverview.vue'
	import fengPagination from '@/components/fengModule/pagination.vue'
	import { mapGetters } from 'vuex'
	import { basicConfig } from '@/config/config.js'
	import '@/static/style/box/list.scss'

	export default {
		data() {
			return {
				moduleData: {
					list: [],
					total: 1
				},
				statiModule: [],
				searForm: {
					firstClassificationId: '', // 一级分类
					secondClassificationId: '', // 二级分类
					thirdClassificationId: '', // 三级分类
					barCode: '', // 条形码
					productCode: '', // 商品编号
					productName: '', // 商品名称
					boxId: '', // 盒子id（自动获取）
					boxName: '', // 盒子名称（自动获取）
					boxCode: '', // 盒子编号（自动获取）
				},
				imageHost: basicConfig.SHOW_IMG_HOST, // 显示图片url
				searchBtn: false
			}
		},
		created() {
			let param = {
				bone: '盒子管理',
				boneUrl: '/box/boxList',
				btwo: '盒子商品信息'
			}
			this.$store.dispatch('switchBreadcrumb', param);
			this.$store.dispatch('getFirstClassification', { "parentId": 0 })
			// 获取盒子编号盒子名称盒子ID
			this.searForm.boxId = this.$route.query.id,
			this.searForm.boxCode = this.$route.query.code,
			this.searForm.boxName = this.$route.query.name;
			// 获取商品统计列表
			let _data = {
				pageNum: 1,
			}
			Object.assign(_data,this.searForm);
			this.getGoodsData(_data,'all');
			// 获取统计数据
			//			this.getStatiModule(_data);
		},
		computed: {
			...mapGetters([
				'firstCFList',
				'secondCFList',
				'thirdCFList',
				'loadingStatus',
			]),

		},
		methods: {
			firstChange(val) {
				this.$store.dispatch('getSecondClassification', { "parentId": val })
				this.clearLinkage(1);
			},
			secondChange(val) {
				this.$store.dispatch('getThirdClassification', { "parentId": val })
				this.clearLinkage(2);
			},
			clearLinkage(type) {
				switch(type) {
					case 1:
						// 清除二级和三级
						this.searForm.secondClassificationId = ''
						this.searForm.thirdClassificationId = ''
						break
					case 2:
						// 清除三级
						this.searForm.thirdClassificationId = ''
						break
				}
			},
			// 查询按钮
			searchToolbar(val) {
				let param = {
					pageNum: (typeof val === 'number') ? val : 1
				};
				Object.assign(param, this.searForm);
				this.searchBtn = true;
				this.getGoodsData(param,'all');
			},
			// 分页查询
			handleCurrentChange(val) {
				// 如果查询区域有值
				if(this.searchBtn && (this.searForm.firstClassificationId !== '' || this.searForm.secondClassificationId !== '' ||
						this.searForm.thirdClassificationId !== '' || this.searForm.barCode !== '' || this.searForm.productCode !== '' ||
						this.searForm.productName !== '')) {
					this.searchToolbar(val);
					return false;
				}
				// 查询区域没有值
				let _data = {
					pageNum: val
				}
				Object.assign(_data,this.searForm);
				this.getGoodsData(_data);
			},
			// 清空操作
			resetForm(formName) {
				this.searForm.firstClassificationId = '';
				this.searForm.secondClassificationId = '';
				this.searForm.thirdClassificationId = '';
				this.searForm.barCode = '';
				this.searForm.productCode = '';
				this.searForm.productName = '';
				this.$refs[formName].resetFields();
			},

			// 获取商品数据
			getGoodsData(data, type) {
				this.$store.dispatch('switchLoadingStatus', true);
				if(data.pageNum === 1) {
					this.currentPage = 1;
				}
				this.$api.apiCommunication('/box/listProduct', data, res => {
					this.$store.dispatch('switchLoadingStatus', false)
					if(res.code != 2000) {
						this.moduleData = {
							list: [],
							total: 0
						}
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false
					}
					this.moduleData = res.data;
				});
				if(type == 'all') {
					this.$api.apiCommunication('/box/countProduct', data, res => {
						if(res.code != 2000) {
							this.staticModule = []
							return false
						}
						this.statiModule = res.data;
					});
				}
			},
			// 操作跳转
			routerPush(type, id) {
				if(type == 'seeGoodsInfo') {
					this.$router.push({ name: 'seeGoodsInfo', params: { id: id } });
				}
				return false;
			},
			exportExcel() {
				// 导出excel
				if(this.moduleData.total === 0) {
					this.$notify({ title: '系统通知', message: '没有可导出的数据！', type: 'warning' })
					return false
				};
				let token = this.$store.getters.getToken,
					url = `${basicConfig.PRODUCT_HOST}/box/listProduct/excelExport?token=${token}`,
					_data = this.searForm;
					
				// 拼接必带参数	
				url += `&boxId=${_data.boxId}&boxName=${_data.boxName}&boxCode=${_data.boxCode}`;
				// 条形码
				if(_data.barCode){
					url += `&barCode=${_data.barCode}`
				};
				// 商品编码
				if(_data.productCode) {
                    url +=`&productCode=${_data.productCode}`;
                };
				// 商品名称
				if(_data.productName) {
                    url +=`&productName=${_data.productName}`;
                }
				// 一级品类
				if(_data.firstClassificationId) {
                    url +=`&firstClassificationId=${_data.firstClassificationId}`;
                }
				// 二级品类
				if(_data.secondClassificationId) {
                    url +=`&secondClassificationId=${_data.secondClassificationId}`;
                }
				// 三级品类
				if(_data.thirdClassificationId) {
                    url +=`&thirdClassificationId=${_data.thirdClassificationId}`;
                }
				let _win = window.open();
				_win.location = url;
//				_win.close();

			}
		},
		components: {
			fengGridoverview,
			fengPagination
		}
	}
</script>