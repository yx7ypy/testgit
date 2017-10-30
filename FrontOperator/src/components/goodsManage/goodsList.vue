<template>
	<div class="goods-list-box">
		<!--搜索区域-->
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item display-table top-toolbar-complex">
				<div class="toolbar-function tr">
					<el-form :model="searForm" ref="searForm" :inline="true" class="tr">
						<div class="h">
							<el-form-item class="fl" label="商品编号：">
								<el-input placeholder="商品编号" class="function-search" v-model="searForm.productCode" icon="boxCode"></el-input>
							</el-form-item>
							<el-form-item class="fl" label="商品状态：">
								<el-select v-model="searForm.isDelete" placeholder="选择状态">
									<el-option v-for="item in isDeleteList" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<div class="sear-oper-excel-box">
								<el-button type="warning" @click="exportExcel">导出EXCEL</el-button>
							</div>
						</div>
						<div class="h">
							<el-form-item class="fl" label="商品名称：">
								<el-input placeholder="商品名称" class="function-search" v-model="searForm.productName" icon="boxCode"></el-input>
							</el-form-item>
							<el-form-item class="fl" label="选择品类：">
								<el-select v-model="searForm.firstClassificationId" clearable placeholder="请选择" no-data-text="没有数据" @change="firstChange" >
									<el-option v-for="item in firstCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
								<el-select v-model="searForm.secondClassificationId" clearable placeholder="请选择" no-data-text="请先选择一级品类" @change="secondChange">
									<el-option v-for="item in secondCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
								<el-select v-model="searForm.thirdClassificationId" clearable placeholder="请选择" no-data-text="请先选择一二级品类">
									<el-option v-for="item in thirdCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
							</el-form-item>
						</div>

						<div class="h">
							<el-form-item class="fl" label="国际条码：">
								<el-input placeholder="国际条码" class="function-search" v-model="searForm.barCode" icon="boxCode"></el-input>
							</el-form-item>
							<el-form-item class="fl max" label="创建日期：">
								<el-date-picker v-model="searForm.createStartDate" type="date" 
									:editable=false 
									placeholder="选择日期" 
									@change="fomatDateStart"
									:picker-options="pickerOptionscreate"
								>
								</el-date-picker>
								<span style="margin: 0 1%;">至</span>
								<el-date-picker v-model="searForm.createEndDate" type="date" 
									:editable=false 
									placeholder="选择日期" 
									@change="fomatDateEnd"
									:picker-options="pickerOptionsend"
								>
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
				<div class="sear-oper-excel-box">
					<el-button type="warning" @click="routerPush('create')"> + 创建新商品</el-button>
				</div>
				<el-table class="mar-top10" :data="moduleData.list" border :stripe="true" v-loading.body="loadingStatus" style="width: 100%;">
					<el-table-column prop="scope" label="图片" width="100" class="tc">
						<template slot-scope="scope">
							<!--<img :src="(scope.row.imageUrl === '' || scope.row.imageUrl === null) ? 'https://img.alicdn.com/i2/2/TB1GAvUKVXXXXa0XpXXSutbFXXX.jpg_90x90q90.jpg' : imageHost+scope.row.imageUrl" alt="" />-->
							
							<img :src="imageHost+scope.row.imageUrl" alt="商品图片" v-if="scope.row.imageUrl != null"/>
						</template>
					</el-table-column>
					<el-table-column prop="productCode" label="商品信息" width="320">
						<template slot-scope="scope">
							<ul>
								<li><span>商品编号：</span><span>{{scope.row.productCode}}</span></li>
								<li><span>国际条码：</span><span>{{scope.row.barCode}}</span></li>
								<li><span>名称：</span><span>{{scope.row.productName}}</span></li>
								<li><span>品类：</span><span>{{scope.row.firstClassificationName}}-{{scope.row.secondClassificationName}}-{{scope.row.thirdClassificationName}}</span></li>
							</ul>
						</template>
					</el-table-column>
					<el-table-column prop="" label="包装/规格" width="140">
						<template slot-scope="scope">
							<ul>
								<li><span>包装：</span><span>{{scope.row.packDict}}{{scope.row.packDictName}}</span></li>
								<li><span>规格：</span><span>{{scope.row.specification}}{{scope.row.specificationName}}</span></li>
							</ul>
						</template>
					</el-table-column>
					<el-table-column prop="scenarioPriceScope" label="售价范围（元）" width="140"></el-table-column>
					<el-table-column prop="floorPrice" label="成本（元）" width="120"></el-table-column>
					<el-table-column prop="" label="状态">
						<template slot-scope="scope">
							<span v-if="scope.row.isDelete">未启用</span>
							<span v-else style="color: #13ce66;">启用中</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="260">
						<template slot-scope="scope">
							<div class="list-oper-box">
								<el-button type="warning"  @click="routerPush('goodsEditor',scope.row.productId)">编辑</el-button>
								<el-button type="primary"  @click="routerPush('goodsInfo',scope.row.productId)">查看</el-button>
								<el-button type="primary"  @click="routerPush('price',scope.row.barCode)">售价管理</el-button>
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
	import { mapGetters } from 'vuex';
	import { basicConfig } from '@/config/config.js';
	import '@/static/style/goods/list.scss'
	export default {
		data() {
			let that = this;
			return {
				currentPage: 1,
				moduleData: {
					list: [],
					total: 0
				},
				searForm: {
					'firstClassificationId': '', // 一级分类
					'secondClassificationId': '', // 二级分类
					'thirdClassificationId': '', // 三级分类
					'productCode': '', // 商品编号
					'barCode': '', // 国际条形码
					'productName': '', // 商品名称
					'isDelete': '', // 商品状态
					'createStartDate': '', // 开始时间
					'createEndDate': '', // 结束时间
					'franchiseeId': 0, // 加盟商ID  
					"pageSize": 10,
					"pageNum": 1
				},
				//开始时间
		        pickerOptionscreate:{
		           	disabledDate(time) { 
		           		//	结束时间的范围
		             	return time.getTime() > new Date(that.searForm.createEndDate).getTime() ;
		          	}
		        },
		        //结束时间
		        pickerOptionsend: {
		          	disabledDate(time) {
			          	// 开始时间的范围
			            return time.getTime() < new Date(that.searForm.createStartDate).getTime() - 8.64e7 ;
		          	}
		        }, 
				isDeleteList: [
					{ value: '', label: '所有' },
					{ value: '0', label: '启用中' },
					{ value: '1', label: '未启用' }
				],
				imageHost: basicConfig.SHOW_IMG_HOST,
			}
		},
		created() {
			this.$store.dispatch('switchBreadcrumb', { bone: '商品管理' })
			let page = { "pageNum": 1, "pageSize": 10, 'franchiseeId': 0 };
			this.getModuleData(page);
			this.$store.dispatch('getFirstClassification', { "parentId": 0 })
		},
		computed: {
			...mapGetters([
				'loadingStatus',
				'firstCFList',
				'secondCFList',
				'thirdCFList'
			])
		},
		methods: {
			getModuleData(data) {
				this.$store.dispatch('switchLoadingStatus', true);
				if(data.pageNum === 1) {
					this.currentPage = 1;
				}
				this.$api.apiCommunication('/product/getList', data, res => {
					this.$store.dispatch('switchLoadingStatus', false)
					if(res.code != 2000) {
						this.moduleData = {
							list: [],
							total: 0
						};
						this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
						return false
					}
					this.moduleData = res.data;
				})
			},
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
			searchToolbar(val) {
				let param = {
					pageNum: (typeof val === "number") ? val : 1
				};
				Object.assign(param, this.searForm);
				this.searchBtn = true;
				this.getModuleData(param);
			},
			routerPush(type, id){
				if(type == 'goodsInfo') {
					this.$router.push({ name: 'goodsInfo', params: { id: id } });
				} else if(type == 'create') {
					this.$router.push({ name: 'goodsCreate' });
				} else if(type == 'price'){
					this.$router.push({ name: 'price', params: { id: id } });
				}else {
					this.$router.push({ name: 'goodsEditor', params: { id: id } });
				}
				return false
			},
			// 分页
			handleCurrentChange(val) {
				this.currentPage = val;
				if(this.searchBtn && (this.searForm.provinceId !== '' || this.searForm.cityId !== '' || this.searForm.districtId !== '')) {
					this.searchToolbar(val);
					return false;
				}
				this.getModuleData({ pageNum: val, 'franchiseeId': 0 })
			},
			fomatDateStart(value) {
				if(value) {
					this.searForm.createStartDate = new Date(this.searForm.createStartDate).format('yyyy-MM-dd');
				} else {
					this.searForm.createStartDate = '';
				}
			},
			fomatDateEnd(value) {
				if(value) {
					this.searForm.createEndDate = new Date(this.searForm.createEndDate).format('yyyy-MM-dd');
				} else {
					this.searForm.createEndDate = '';
				}
			},
			// 清空操作
			resetForm(formName) {
				this.searForm.firstClassificationId = '';
				this.searForm.secondClassificationId = '';
				this.searForm.thirdClassificationId = '';
				this.searForm.productCode = '';
				this.searForm.barCode = '';
				this.searForm.productName = '';
				this.searForm.isDelete = '';
				this.searForm.createStartDate = '';
				this.searForm.createEndDate = '';
				this.$refs[formName].resetFields();
			},
			exportExcel(){
				// 导出excel
				if(this.moduleData.total === 0) {
					this.$notify({ title: '系统通知', message: '没有可导出的数据！', type: 'warning' })
					return false
				};
				let token = this.$store.getters.getToken,
					url = `${basicConfig.PRODUCT_HOST}/product/getCSVOfFranchisee?token=${token}`,
					_data = this.searForm;
				// 商品编号	
				if(_data.productCode) {
					url += `&productCode=${_data.productCode}`
				};
				// 商品名称
				if(_data.productName) {
					url += `&productName=${_data.productName}`;
				};
				// // 商品产地
				// if(_data.producingArea) {
				// 	url += `&producingArea=${_data.producingArea}`;
				// };
				// 国际条码
				if(_data.barCode) {
					url += `&barCode=${_data.barCode}`;
				}
				// 商品状态
				if(_data.isDelete) {
					url += `&isDelete=${_data.isDelete}`;
				}
				// 开始时间
				if(_data.createStartDate) {
					url += `&createStartDate=${_data.createStartDate}`;
				}
				// 结束时间
				if(_data.createEndDate) {
					url += `&createEndDate=${_data.createEndDate}`;
				}
				// 一级品类
				if(_data.firstClassificationId) {
					url += `&firstClassificationId=${_data.firstClassificationId}`;
				}
				// 二级品类
				if(_data.secondClassificationId) {
					url += `&secondClassificationId=${_data.secondClassificationId}`;
				}
				// 三级品类
				if(_data.thirdClassificationId) {
					url += `&thirdClassificationId=${_data.thirdClassificationId}`;
				}
				let _win = window.open();
				_win.location = url;
				//				_win.close();

			}
		},
		components: {
			fengPagination
		}
	}
</script>