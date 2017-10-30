<template>
	<el-form :model="supplierFinanceForm" ref="supplierFinanceForm" label-width="150px"  class="form-left supplier-add">
		<section>
			<div style="position: absolute;top: 75px;right: 80px;">
				<div>
					<span style="display:inline-block;width:20px;height:20px;background:#ccc;border-radius:50%;"></span>
					<span style="display:inline-block;width:150px;height:2px;background:#e0e0e0;position:relative;top:-9px;"></span>
					<span style="display:inline-block;width:20px;height:20px;border:1px solid #e0e0e0;border-radius:50%;background:green;"></span>
				</div>
				<div>
					<span style="position: relative;left: -17px;">基本信息</span>
					<span style="position: relative;right: -90px;">财务信息</span>
				</div>
			</div>
		</section>
		<el-row>
			<el-col :span="24">
				<label class="title">开户信息</label>
				<el-form-item label="公司名称" prop="companyName" :rules="[{ required: true, message: '公司名称不能为空'}]">
					<el-col>
						<el-input v-model="supplierFinanceForm.companyName" placeholder="请填写公司名称"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="开户银行" prop="bankName" :rules="[{ required: true, message: '开户银行不能为空'}]">
					<el-col>
						<el-input v-model="supplierFinanceForm.bankName" placeholder="请填写开户银行"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="开户地址" prop="bankAddress" :rules="[{ required: true, message: '开户地址不能为空'}]">
					<el-col>
						<el-input v-model="supplierFinanceForm.bankAddress" placeholder="请填写开户地址"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="银行账号" prop="bankAccount" :rules="[{ required: true, message: '银行账号不能为空'}]">
					<el-col>
						<el-input v-model="supplierFinanceForm.bankAccount" placeholder="请填写银行账号"></el-input>
					</el-col>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row  style="border-top:1px solid gray;">
			<el-col :span="24">
				<label class="title">公司信息</label>
				<el-form-item label="纳税人识别号" prop="taxpayerRegistrationNumber" :rules="[{ required: true, message: '纳税人识别号不能为空'}]">
					<el-col>
						<el-input v-model="supplierFinanceForm.taxpayerRegistrationNumber" placeholder="请填写纳税人识别号"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="工商注册号" prop="businessLicenceNumber" :rules="[{ required: true, message: '工商注册号不能为空'}]">
					<el-col>
						<el-input v-model="supplierFinanceForm.businessLicenceNumber" placeholder="请填写工商注册号"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="公司注册地址">
					<el-col>
						<el-input v-model="supplierFinanceForm.companyAddress" placeholder="公司注册地址"></el-input>
					</el-col>
				</el-form-item>
				
			</el-col>
			<el-col :span="24">
				<label class="title">证件信息:  <span style="font-size:14px;font-weight: normal;">营业执照、开户许可证、开票信息</span></label>
				<el-col>
					<el-form-item>
						<image-list-upload-pri-editor :imageUrl="imageUrl" name @increment="changeScucess"></image-list-upload-pri-editor>
					</el-form-item>
				</el-col>
			</el-col>
		</el-row>
		<el-row style="margin-top:30px">
				<el-form-item>
				<el-button @click="cancel">取消</el-button>
				<el-button type="primary" @click="pre()">上一步</el-button>
				<el-button type="primary" @click="submitForm('supplierFinanceForm')">保存</el-button>
				</el-form-item>
		</el-row>	
	</el-form>
</template>
<script>
import { basicConfig } from '@/config/config.js';
import imageListUploadPriEditor from '@/components/fengModule/imageListUploadPriEditor.vue';
import '@/static/style/supplier/supplierAdd.scss'
export default {
	components: { imageListUploadPriEditor },
	data() {
		return {
			imageHost: basicConfig.SHOW_PRI_IMG_HOST,
			isOk: true,
			imageUrl: [],
			supplierFinanceForm: {
				"supplierId": "",
				"companyName": "",
				"bankName": "",
				"bankAddress": "",
				"bankAccount": "",
				"taxpayerRegistrationNumber": "",
				"businessLicenceNumber": "",
				"companyAddress": "",
				"file": [
				]
			}
		}
	},
	methods: {
		pre() {
			this.$router.push({ name: 'supplierEdit', params: { id: this.$route.params.id } })
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (this.isOk) {
						this.isOk = false;
						this.supplierFinanceForm.supplierId = this.$route.params.id;
						this.$api.apiCommunication('/supplier/finance/update', this.supplierFinanceForm, res => {
							this.isOk = true;
							if (res.code != 2000) {
								this.$alert(`创建失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
								return false;
							}
							this.$notify({ title: '系统通知', message: '更新成功！', type: 'success' });
							this.$router.push({ path: '/supplier/supplierList' });
						}, 'basedata');
					} else {
						this.$alert('请勿重复提交 ; 等待返回信息', '系统通知', { confirmButtonText: '确定', type: 'error' })
					}
				} else {
					return false;
				}
			});
		},
		detailSupplierFinance() {
			let detailParam = {
				"supplierId": this.$route.params.id
			}
			this.$api.apiCommunication('/supplier/finance/detail', detailParam, res => {
				this.isOk = true;
				if (res.code != 2000) {
					this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
					return false;
				}
				if(null!=res.data&&null!=res.data.companyName){
					this.supplierFinanceForm = res.data;
					let _imageUrl = [];
					for(let item of res.data.file) {
						_imageUrl.push({ name: item.filePath, url: this.imageHost + item.filePath })
					}
					this.imageUrl = _imageUrl;
				}
				
			}, 'basedata');
		},
		changeScucess(row) {
			// 图片更新，接收子组件数据
			let imgObj = [];
			for (let i = 0, l = row.length; i < l; i++) {
				imgObj.push({ url: row[i] ,filePath:row[i],fileType:1});
			}
			this.supplierFinanceForm.file = imgObj;
		},
		cancel() {
			this.$router.push({ name: 'supplierList' })
		},
	},
	mounted() {
		this.detailSupplierFinance();
	}
}
</script>