<template>
	<div>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item editor-form display-table">
				<div class="form-left">
					<el-form ref="searForm" :rules="rules" label-position="right" :model="searForm" label-width="110px">
						<el-form-item label="仓库编号：">
							<el-input v-model="searForm.storageCode" disabled placeholder="请填写"></el-input>
						</el-form-item>
						<el-form-item label="仓库名称：">
							<el-input v-model="searForm.storageName" placeholder="请填写"></el-input>
						</el-form-item>
						<el-form-item label="省份：" prop="province">
							<el-select v-model="searForm.provinceId" clearable placeholder="请选择" no-data-text="没有数据" @change="provinceChange" @clear="clearLinkage(1)" @visible-change="selectChange">
								<el-option v-for="item in provinceList" :key="item.cityId" :label="item.cn" :value="item.cityId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="城市：" prop="city">
							<el-select v-model="searForm.cityId" clearable placeholder="请选择" no-data-text="请先选择省份" @change="cityChange" @clear="clearLinkage(2)" @visible-change="selectChange">
								<el-option v-for="item in cityList" :key="item.cityId" :label="item.cn" :value="item.cityId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="区域：" prop="regionId">
							<el-select v-model="searForm.regionId" clearable placeholder="请选择" no-data-text="请先选择城市" @visible-change="selectChange">
								<el-option v-for="item in districtList" :key="item.cityId" :label="item.cn" :value="item.cityId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="详细地址：">
							<el-input v-model="searForm.address" placeholder="请填写"></el-input>
						</el-form-item>
						<el-form-item label="联系人：" prop="linkman">
							<el-input v-model="searForm.linkman" placeholder="请填写"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话：" prop="telephone">
							<el-input v-model="searForm.telephone" placeholder="请填写"></el-input>
						</el-form-item>
						<el-form-item label="仓库状态：" prop="isDelete">
							<el-radio v-model="searForm.isDelete" label="0">启用</el-radio>
							<el-radio v-model="searForm.isDelete" label="1">停用</el-radio>
						</el-form-item>
					</el-form>
				</div>
				<div class="form-right"></div>
			</el-col>
		</el-row>
		<el-row class="mar-bottom10">
			<el-col :span="24" class="el-item pdd-20">
				<el-button type="primary" @click="goHold">保存</el-button>
				<feng-cancel></feng-cancel>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 新建仓库
	import { mapGetters } from 'vuex'
	import fengCancel from '@/components/fengModule/cancel.vue'

	export default {
		data() {
			return {
				searForm: {
					storageCode: '', // 仓库编号
					storageName: '', // 仓库名称
					cityId: '',
					provinceId: '',
					regionId: '',
					address: '', // 地址
					isDelete: '', // 仓库状态
					linkman: '', //联系人
					telephone: '', // 联系电话
				},
				rules: {
					telephone: [{ required: true, message: '请选择正确的手机号', trigger: 'blur' }],
					linkman: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
					display_name: [{ required: true, message: '请填写盒子名', trigger: 'blur' }],
					isDelete: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
				},
				resetStatus: false,
			}
		},
		created() {
			let param = {
				bone: '仓库管理',
				boneUrl: '/warehouse/warehouseList',
				btwo: '新增仓库'
			}
			this.$store.dispatch('switchBreadcrumb', param);
			this.$store.dispatch('getCityList', { "parentId": 414, 'type': 1 });

			let _id = this.$route.params.id;
			this.$api.apiCommunicationGet('/storage/getById/' + _id, res => {
				this.$store.dispatch('switchLoadingStatus', false)
				if(res.code != 2000) {
					this.$alert(`查看失败;服务器返回信息:  ${res.msg}`, '系统通知', { confirmButtonText: '确定' })
					return false
				}
				this.searForm = res.data;
				this.searForm.isDelete = (this.searForm.isDelete).toString();
			}, 'basedata')
		},
		computed: {
			...mapGetters([
				'provinceList',
				'cityList',
				'districtList',
				'warehouse'
			])
		},
		methods: {
			goHold() {
				this.$api.apiCommunication('/storage/update', this.searForm, res => {
					if(res.code != 2000) {
						this.$alert(`创建失败，服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
						return false;
					}
					this.$notify({ title: '系统通知', message: '编辑成功！', type: 'success' });
					this.$router.go(-1);
				}, 'basedata');
			},
			provinceChange(val) {
				if(val !== '') {
					this.$store.dispatch('getCityList', { "parentId": val, 'type': 2 })
					this.$store.dispatch('resetLinkage', { type:'city_reset_three' })
					this.clearLinkage(1);
				}else{
					this.$store.dispatch('resetLinkage', { type:'city_reset_two_three' })
				}
			},
			cityChange(val) {
				if(val !== '') {
					this.$store.dispatch('getCityList', { "parentId": val, 'type': 3 })
					this.clearLinkage(2);
				}
			},
			selectChange(value) {
				// 防止一开始就清空了选项
				this.resetStatus = true;
			},
			clearLinkage(type) {
				if(this.resetStatus) {
					switch(type) {
						case 1:
							// 清除二级和三级
							this.searForm.cityId = ''
							this.searForm.regionId = ''
							break
						case 2:
							// 清除三级
							this.searForm.regionId = ''
							break
					}
				}

			},
		},
		components: {
			fengCancel
		}
	}
</script>