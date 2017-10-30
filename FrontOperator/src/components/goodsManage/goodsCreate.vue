<template>
	<div class="add-goods-box" v-cloak>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item editor-form display-table">
				<div class="con-box">
					<el-form ref="subData" :rules="rules" label-position="right" :model="subData" label-width="150px">
						<el-form-item label="" prop="">
							<el-button size="small" type="primary" class="ex-moban-down" @click="com.openUrl(`${product_host}/product/downImpProductTemplate`)" style="background: #fff;border: none;color: #407ef5;text-decoration: underline;">批量导入模版下载</el-button>
							<el-upload class="upload-demo" :action="`${product_host}/product/impProductExcel`" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :with-credentials="true">
								<el-button size="small" type="primary">批量导入</el-button>
							</el-upload>

							</el-upload>
						</el-form-item>
						<el-form-item label="商品编号：" prop="">
							<el-input placeholder="新建完成后自动生成" :disabled="true">
							</el-input>

						</el-form-item>
						<el-form-item label="选择品类：" class="cate-box">
							<el-form-item prop="firstClassificationId">
								<el-select v-model="subData.firstClassificationId" clearable filterable placeholder="请选择" no-data-text="没有数据" @change="firstChange">
									<el-option v-for="item in firstCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="secondClassificationId">
								<el-select v-model="subData.secondClassificationId" clearable filterable placeholder="请选择" no-data-text="请先选择一级品类" @change="secondChange">
									<el-option v-for="item in secondCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop="thirdClassificationId">
								<el-select v-model="subData.thirdClassificationId" clearable filterable placeholder="请选择" no-data-text="请先选择一二级品类">
									<el-option v-for="item in thirdCFList" :key="item.productCategoryId" :label="item.name" :value="item.productCategoryId">
									</el-option>
								</el-select>
							</el-form-item>
						</el-form-item>
						<el-form-item label="国际条形：" prop="barCode">
							<el-input v-model="subData.barCode" placeholder="请输入" @blur="barCodeAvai"></el-input>
						</el-form-item>
						<el-form-item label="商品名称：" prop="productName">
							<el-input v-model="subData.productName" placeholder="请输入" :maxlength="100"></el-input>
						</el-form-item>
						<el-form-item label="包装单位：" prop="packDictId">
							<el-select v-model="subData.packDictId" placeholder="请选择">
								<el-option v-for="item in packUnitList" :key="item.dictId" :label="item.dictName" :value="item.dictId">
								</el-option>
							</el-select>
						</el-form-item>
						<div class="max">
							<el-form-item label="规格单位：" prop="specification">
								<el-input v-model="subData.specification" placeholder="请输入"></el-input>
							</el-form-item>
							<el-form-item prop="specificationId">
								<el-radio-group v-model="subData.specificationId">
									<el-radio v-for="(v,i) in specUnitList" :key="v.dictId" :label="v.dictId" :value="v.dictId">{{v.dictName}}</el-radio>
								</el-radio-group>
							</el-form-item>
						</div>
						<div class="max">
							<el-form-item label="保质期：" prop="expiration">
								<el-input v-model="subData.expiration" placeholder="请输入"></el-input>
							</el-form-item>
							<el-form-item prop="expirationId">
								<el-radio-group v-model="subData.expirationId">
									<el-radio v-for="(v,i) in lifeUnitList" :key="v.dictId" :label="v.dictId" :value="v.dictId">{{v.dictName}}</el-radio>
								</el-radio-group>
							</el-form-item>
						</div>
						<div class="max">
							<el-form-item label="效期提醒：" prop="alarmBefore">
								<el-input v-model="subData.alarmBefore" placeholder="请输入"></el-input>
							</el-form-item>
							<el-form-item prop="alarmBeforeId">
								<el-radio-group v-model="subData.alarmBeforeId">
									<el-radio v-for="(v,i) in vilidUnitList" :key="v.dictId" :label="v.dictId" :value="v.dictId">{{v.dictName}}</el-radio>
								</el-radio-group>
							</el-form-item>
						</div>
						<!-- 增加商品产地 -->
						<el-form-item label="商品产地：" prop="producingArea">
							<el-input v-model="subData.producingArea" placeholder="请输入" :maxlength="100"></el-input>
						</el-form-item>
						<!-- 增加商品产地  -->
						<el-form-item label="默认售价：" prop="defaultPrice">
							<el-input v-model="subData.defaultPrice" placeholder="请输入" @change="changePrice">
								<template slot="append">元</template>
							</el-input>
						</el-form-item>
						<el-form-item label="预估进价：" prop="purchasePrice">
							<el-input v-model="subData.purchasePrice" auto-complete="off" placeholder="请输入" @change="changePurchasePrice">
								<template slot="append">元</template>
							</el-input>
						</el-form-item>
						<el-form-item label="毛利率：">
							<el-input v-model="subData.am" placeholder="自动生成仅供参考" :disabled="true">
								<template slot="append">%</template>
							</el-input>
						</el-form-item>
						<el-form-item label="商品状态：" prop="isDelete">
							<el-radio-group v-model="subData.isDelete">
								<el-radio label="0">启用中</el-radio>
								<el-radio label="1">未启用</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="图片：">
							<feng-imagelist-upload @increment="changeScucess"></feng-imagelist-upload>
						</el-form-item>
					</el-form>
					<!--操作-->
					<div class="oper-box">
						<el-button type="info" @click="$router.go(-1)">取消</el-button>
						<el-button type="success" @click="goHold('subData')">保存</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { basicConfig } from '@/config/config.js';
import fengImagelistUpload from '@/components/fengModule/imageListUpload.vue'
import '@/static/style/goods/add.scss'
import { mapGetters } from 'vuex'
export default {
	data() {
		// 不含小数点
		let checkNum = (rule, value, callback) => {
			let val = Number(value);
			let numReg = /^\d+$/;
			if (numReg.test(val)) {
				callback();
			} else {
				return callback(new Error());
			}
		};
		// 含小数点
		let checkNumTwo = (rule, value, callback) => {
			let val = Number(value);
			let numReg = /^\d+(\.\d+)?$/;
			if (numReg.test(val)) {
				callback();
			} else {
				return callback(new Error());
			}
		};
		return {
			subData: {
				'firstClassificationId': '', // 一级分类
				'secondClassificationId': '', // 二级分类
				'thirdClassificationId': '', // 三级分类
				'barCode': '', // 国际条形码
				'productName': '', // 商品名称
				'producingArea': '', // 商品产地
				'packDictId': '', // 包装单位Id
				'specification': '', // 规格
				'specificationId': '', // 规格Id
				'expiration': '', // 保质期
				'expirationId': '', // 保质期类型Id
				'alarmBefore': '', // 效期提醒
				'alarmBeforeId': '', // 效期提醒类型Id
				'defaultPrice': '', // 默认价
				'purchasePrice': '', // 预估进价
				'am': '', // 毛利率
				'isDelete': '', // 商品状态
				'productImages': []
			},
			rules: {
				firstClassificationId: [{ type: 'number', required: true, message: '请选择一级品类', trigger: 'change' }],
				secondClassificationId: [{ type: 'number', required: true, message: '请选择二级品类', trigger: 'change' }],
				thirdClassificationId: [{ type: 'number', required: true, message: '请选择三级品类', trigger: 'change' }],
				barCode: [{ required: true, message: '国际条形码不能为空', trigger: 'blur' }],
				productName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
				producingArea: [{ required: true, message: '原产地不能为空', trigger: 'blur' }],
				packDictId: [{ type: 'number', required: true, message: '包装单位', trigger: 'change' }],
				specification: [
					{ required: true, message: '规格不能为空', trigger: 'blur' },
					{ validator: checkNumTwo, message: '规格输入必须为正数字', trigger: 'blur' }
				],
				specificationId: [{ type: 'number', required: true, message: '请选择规格单位', trigger: 'change' }],
				expiration: [
					{ required: true, message: '保质期不能为空', trigger: 'blur' },
					{ validator: checkNum, message: '保质期输入必须为正数字', trigger: 'blur' }
				],
				expirationId: [{ type: 'number', required: true, message: '请选择保质期单位', trigger: 'change' }],
				alarmBefore: [
					{ required: true, message: '效期提醒', trigger: 'blur' },
					{ validator: checkNum, message: '效期提醒输入必须为正数字', trigger: 'blur' }
				],
				alarmBeforeId: [{ type: 'number', required: true, message: '请选择效期提醒单位', trigger: 'change' }],
				defaultPrice: [
					{ required: true, message: '默认售价不能为空', trigger: 'blur' },
					{ validator: checkNumTwo, message: '默认售价输入必须为正数字', trigger: 'blur' }
				],
				purchasePrice: [
					{ required: true, message: '预估进价', trigger: 'blur' },
					{ validator: checkNumTwo, message: '预估进价输入必须为正数字', trigger: 'blur' }
				],
				isDelete: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
			},
			dialogImageUrl: '',
			dialogVisible: false,
			product_host: basicConfig.PRODUCT_HOST,
			isOk: true
		}
	},
	created() {
		let param = {
			bone: '商品管理',
			boneUrl: '/goods/goodsList',
			btwo: '创建新商品'
		}
		this.$store.dispatch('switchBreadcrumb', param)
		// 获取品类
		this.$store.dispatch('getFirstClassification', { "parentId": 0 })
		// 获取各种单位
		this.$store.dispatch('getUnitList', { "code": 'package', 'type': 1, 'dictStatus': '1' });
		this.$store.dispatch('getUnitList', { "code": 'standard', 'type': 2, 'dictStatus': '1' });
		this.$store.dispatch('getUnitList', { "code": 'shelf_life', 'type': 3, 'dictStatus': '1' });
		this.$store.dispatch('getUnitList', { "code": 'expiration', 'type': 4, 'dictStatus': '1' });
	},
	computed: {
		...mapGetters([
			'packUnitList',
			'firstCFList',
			'secondCFList',
			'thirdCFList',
			'specUnitList',
			'lifeUnitList',
			'vilidUnitList'
		])
	},
	methods: {
		// 一级品类select框发生改变的时候触发
		firstChange(val) {
			this.$store.dispatch('getSecondClassification', { "parentId": val });
			this.clearLinkage(1);
		},
		secondChange(val) {
			this.$store.dispatch('getThirdClassification', { "parentId": val });
			this.clearLinkage(2);
		},
		clearLinkage(type) {
			switch (type) {
				case 1:
					// 清除二级和三级
					this.subData.secondClassificationId = '';
					this.subData.thirdClassificationId = '';
					break
				case 2:
					// 清除三级
					this.subData.thirdClassificationId = '';
					break
			}
		},
		barCodeAvai() {
			this.$api.apiCommunicationGet(`/product/checkBarCode/${this.subData.barCode}`, res => {
				if (res.code != 2000) {
					this.$alert(`创建失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
					return false;
				}
			})
		},
		changePrice(val) {
			// 改变销售价
			if (val !== '') {
				this.calculationGrossMargin();
			}
		},
		changePurchasePrice(val) {
			// 改变进货价
			if (val !== '') {
				this.calculationGrossMargin();
			}
		},
		calculationGrossMargin() {
			// 计算毛利率
			let _grossMargin = (this.subData.defaultPrice - this.subData.purchasePrice) / this.subData.defaultPrice * 100;
			this.subData.am = _grossMargin.toFixed(2);
		},
		changeScucess(row) {
			// 图片更新，接收子组件数据
			let imgObj = [];
			for (let i = 0, l = row.length; i < l; i++) {
				imgObj.push({ url: row[i] });
			}
			this.subData.productImages = imgObj;
		},
		// 保存
		goHold(subData) {
			this.$refs[subData].validate((valid) => {
				if (valid) {
					if (this.isOk) {
						this.isOk = false;
						this.$api.apiCommunication('/product/save', this.subData, res => {
							if (res.code != 2000) {
								this.isOk = true;
								this.$alert(`创建失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
								return false;
							}
							this.$notify({ title: '系统通知', message: '新建成功！', type: 'success' });
							this.$router.go(-1);
						})
					} else {
						this.$alert('请勿重复提交 ; 等待返回信息', '系统通知', { confirmButtonText: '确定', type: 'error' })
					}
				} else {
					return false;
				}
			});
		},
		handleAvatarSuccess(res, file, fileList) {
			if (res.code != 2000) {
				let newDatas = [];
				const h = this.$createElement;
				for(let item of res.data){
					newDatas.push(h('p',null,item))
				}
				this.$msgbox({
					title:`${res.msg}`,
					message:h('p',null,newDatas)
				});
				// this.$alert(`导入失败，服务器返回信息：${res.data}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
				fileList = [];
				return false;
			}
			this.$alert(`导入成功`, '系统通知', { confirmButtonText: '确定', type: 'success' })
		},
		handleAvatarError(res) {
			console.dir('失败' + res);
		}
	},
	components: {
		fengImagelistUpload
	},

}
</script>