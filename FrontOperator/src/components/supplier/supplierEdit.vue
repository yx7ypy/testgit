
<template>
	<el-form :model="supplierForm" ref="supplierForm" label-width="120px" class="form-left supplier-add">
		<section>
			<div style="position: absolute;top: 75px;right: 80px;">
				<div>
					<span style="display:inline-block;width:20px;height:20px;background:green;border-radius:50%;"></span>
					<span style="display:inline-block;width:150px;height:2px;background:#e0e0e0;position:relative;top:-9px;"></span>
					<span style="display:inline-block;width:20px;height:20px;border:1px solid #e0e0e0;border-radius:50%;background:#ccc;"></span>
				</div>
				<div>
					<span style="position: relative;left: -17px;">基本信息</span>
					<span style="position: relative;right: -90px;">财务信息</span>
				</div>
			</div>
		</section>
		<el-row>
			<el-col :span="24">
				<label class="title">基本资料</label>
				<el-form-item label="供应商编号">
					<el-col>
						<el-input v-model="supplierForm.supplierCode" placeholder="系统自动生成唯一编号，非填写项" disabled></el-input>
					</el-col>
					<el-col>
					</el-col>
				</el-form-item>
				<el-form-item label="供应商名称" prop="supplierName" :rules="[{ required: true, message: '供应商名称不能为空'}]">
					<el-col>
						<el-input v-model="supplierForm.supplierName" placeholder="填写供应商名称"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item class="area-con" label="区域" required>
					<el-form-item prop="provinceId" :rules="[{ required: true, message: '省份不能为空'}]">
						<el-select v-model="supplierForm.provinceId" clearable placeholder="请选择" no-data-text="没有数据" @change="provinceChange" @clear="clearLinkage(1)" @visible-change="selectChange">
							<el-option v-for="item in provinceList" :key="item.cityId" :label="item.cn" :value="item.cityId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="cityId" :rules="[{ required: true, message: '城市不能为空'}]"> 
						<el-select v-model="supplierForm.cityId" clearable placeholder="请选择" no-data-text="请先选择省份" @change="cityChange" @clear="clearLinkage(2)" @visible-change="selectChange">
							<el-option v-for="item in cityList" :key="item.cityId" :label="item.cn" :value="item.cityId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="districtId" :rules="[{ required: true, message: '区域不能为空'}]"> 
						<el-select v-model="supplierForm.districtId" clearable placeholder="请选择" no-data-text="请先选择城市">
							<el-option v-for="item in districtList" :key="item.cityId" :label="item.cn" :value="item.cityId">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form-item>
				<el-form-item label="生产地址">
					<el-col>
						<el-input v-model="supplierForm.productionAddress" placeholder="填写生产地址"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="经营地址">
					<el-col>
						<el-input v-model="supplierForm.businessAddress" placeholder="填写经营地址"></el-input>
					</el-col>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row style="border-top:1px solid gray;">
			<el-col :span="24">
				<label class="title">联系信息</label>
				<el-form-item label="联系人" prop="supplierContact.contactName" :rules="[{ required: true, message: '联系人不能为空'}]">
					<el-col>
						<el-input v-model="supplierForm.supplierContact.contactName" placeholder="填写供应商联系人"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="联系电话" prop="supplierContact.contactPhone" :rules="[{ required: true, message: '联系电话不能为空'}]">
					<el-col>
						<el-input v-model="supplierForm.supplierContact.contactPhone"  placeholder="填写电话"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-col>
						<el-input v-model="supplierForm.supplierContact.contactEmail"  placeholder="填写邮箱"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="传真">
					<el-col>
						<el-input v-model="supplierForm.supplierContact.fax" placeholder="填写传真"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="状态" prop="isValid" :rules="[{ required: true}]">
					<el-radio-group  v-model="supplierForm.isValid">
						<el-radio class="radio" :label="1" >启用</el-radio>
						<el-radio class="radio" :label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注">
					<el-col>
						<el-input type="textarea" autosize v-model="supplierForm.supplierContact.remarks"></el-input>
					</el-col>
				</el-form-item>

				<el-form-item>
					<el-button @click="cancel">取消</el-button>
					<el-button type="primary" @click="submitForm('supplierForm')">下一步</el-button>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>
<script>
import { mapGetters } from 'vuex'
import '@/static/style/supplier/supplierAdd.scss'
export default {
	data() {
		return {
			isOk: true,
			resetStatus: false,
			supplierForm: {
				"supplierCode": "",
				"supplierName": "",
				"provinceId": '',
				"cityId": '',
				"districtId": '',
				"provinceName": "",
				"cityName": "",
				"districtName": "",
				"productionAddress": "",
				"businessAddress": "",
				"isValid": "1",
				"supplierContact": {
					"contactName": "",
					"contactPhone": "",
					"contactEmail": null,
					"fax": null,
					"isDelete": 0,
					"remarks": null
				}
			},
			rules: {
				provinceId: [{ type: 'number', required: true, message: '请选择省份', trigger: 'change' }],
				cityId: [{ type: 'number', required: true, message: '请选择城市', trigger: 'change' }],
				districtId: [{ type: 'number', required: true, message: '请选择区域', trigger: 'change' }],
			}
		}
	},
	created() {
		let para = {
			bone: '供应商管理',
			boneUrl: '/supplier/supplierList',
			btwo: '编辑供应商'
		};
		this.$store.dispatch('switchBreadcrumb', para);
		this.$store.dispatch('getCityList', { "parentId": 414, 'type': 1 });
		this.getSupllier();
	},
	computed: {
		...mapGetters([
			'provinceList',
			'cityList',
			'districtList',
			'loadingStatus',
		])
	},
	methods: {
		provinceChange(val) {
			if (val !== '') {
				this.$store.dispatch('getCityList', { "parentId": val, 'type': 2 })
				this.$store.dispatch('resetLinkage', { type: 'city_reset_three' })
				this.clearLinkage(1);
			} else {
				this.$store.dispatch('resetLinkage', { type: 'city_reset_two_three' })
			}
		},
		cityChange(val) {
			if (val !== '') {
				this.$store.dispatch('getCityList', { "parentId": val, 'type': 3 })
				this.clearLinkage(2);
			}
		},
		selectChange(value) {
			// 防止一开始就清空了选项
			this.resetStatus = true;
		},
		clearLinkage(type) {
			if (this.resetStatus) {
				switch (type) {
					case 1:
						// 清除二级和三级
						this.supplierForm.cityId = ''
						this.supplierForm.districtId = ''
						break
					case 2:
						// 清除三级
						this.supplierForm.districtId = ''
						break
				}
			}
		},
		getSupllier() {
			// 获取数据
			let _id = this.$route.params.id;
			this.$store.dispatch('switchLoadingStatus', true);
			this.$api.apiCommunication('/supplier/detail', { "supplierId": _id }, res => {
				this.$store.dispatch('switchLoadingStatus', false)
				if (res.code != 2000) {
					this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false;
				}

				//处理异常数据，防止出错
				if (null != res.data) {
					this.supplierForm = res.data;
				}
				if (undefined == this.supplierForm.supplierContact || null == this.supplierForm.supplierContact) {
					this.supplierForm.supplierContact = {}
				}
			}, 'basedata');
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.isOk) {
						this.supplierForm.supplierId = this.$route.params.id;
						this.isOk = false;
						this.$store.dispatch('switchLoadingStatus', true);
						this.$api.apiCommunication('/supplier/update', this.supplierForm, res => {
							this.isOk = true;
							this.$store.dispatch('switchLoadingStatus', false)
							if (res.code != 2000) {
								this.$alert(`创建失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
								return false;
							}
							this.$router.push({ path: '/supplier/supplierFinanceEdit/' + this.supplierForm.supplierId });
						}, 'basedata');
					} else {
						this.$alert('请勿重复提交 ; 等待返回信息', '系统通知', { confirmButtonText: '确定', type: 'error' })
					}
				} else {
					return false;
				}
			});
		},
		cancel() {
			this.$router.push({ path: '/supplier/supplierList' });
		}
	}
}
</script>

