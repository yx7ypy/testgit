<template>
	<el-form class="form-left supplier-add" :model="supplierFinanceForm" ref="supplierFinanceForm" label-width="150px">
		<el-row>
			<el-col :span="24">
				<label class="title">开户信息</label>
				<el-form-item label="公司名称：" prop="companyName">
					{{supplierFinanceForm.companyName}}
				</el-form-item>
				<el-form-item label="开户银行：">
					{{supplierFinanceForm.bankName}}
				</el-form-item>
				<el-form-item label="开户地址：">
					{{supplierFinanceForm.bankAddress}}
				</el-form-item>
				<el-form-item label="银行账号：">
					{{supplierFinanceForm.bankAccount}}
				</el-form-item>
			</el-col>
		</el-row>
		<el-row  style="border-top:1px solid gray;">
			<el-col :span="24">
				<label class="title">公司信息</label>
				<el-form-item label="纳税人识别号：">
					{{supplierFinanceForm.taxpayerRegistrationNumber}}
				</el-form-item>
				<el-form-item label="工商注册号：">
					{{supplierFinanceForm.businessLicenceNumber}}
				</el-form-item>
				<el-form-item label="公司注册地址：">
					{{supplierFinanceForm.companyAddress}}
				</el-form-item>
			</el-col>
			<el-col :span="24">
				<label class="title">证件信息:  <span style="font-size:14px;font-weight: normal;">营业执照、开户许可证、开票信息</span></label>
				<el-col :span="24">
						<image-pri-list :imageUrl="imageUrl"></image-pri-list>
				</el-col>
			</el-col>
			<el-col :span="24">
			<el-row style="margin-top:30px">
					<el-form-item>
				<el-button type="primary" @click="pre()">上一步</el-button>
				<el-button type="primary" @click="cancel()">返回</el-button>
				</el-form-item>
				</el-row>
			</el-col>
		</el-row>

	</el-form>
</template>
<script>
import '@/static/style/supplier/supplierAdd.scss'
import { basicConfig } from '@/config/config.js';
import imagePriList from '@/components/fengModule/imagePriList.vue';
export default {
	components: { imagePriList },
	data() {
		return {
			imageHost: basicConfig.SHOW_PRI_IMG_HOST,
			isOk: true,
			imageUrl: '',
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
	created() {
		let para = {
            bone: '供应商管理',
			boneUrl: '/supplier/supplierList',
			btwo: '查看供应商'
        };
		this.$store.dispatch('switchBreadcrumb', para);
	},
	methods: {
		pre() {
			this.$router.push({ name: 'supplierDetail', params: { id: this.$route.params.id } })
		},
		cancel() {
			this.$router.push({ name: 'supplierList' })
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
				this.supplierFinanceForm = res.data;
				let _imageUrl = [];
				if (this.supplierFinanceForm.file == null) {
					this.supplierFinanceForm.file = [];
				}
				for (let item of res.data.file) {
					_imageUrl.push({url:item.filePath })
				}
				this.imageUrl = JSON.stringify(_imageUrl);
			}, 'basedata');
		},		
	},
	mounted() {
		this.detailSupplierFinance();
	}
}
</script>