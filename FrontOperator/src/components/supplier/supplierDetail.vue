<template>
  <el-form :model="supplierForm" ref="supplierForm" label-width="120px" class="form-left supplier-add">
    <el-row>
      <el-col :span="24">
        <label class="title">基本资料</label>
        <el-form-item label="供应商编号：">
          {{supplierForm.supplierCode}}
        </el-form-item>
        <el-form-item label="供应商名称：">
          {{supplierForm.supplierName}}
        </el-form-item>
        <el-form-item label="区域：">
          {{supplierForm.provinceName}}/{{supplierForm.cityName}}/{{supplierForm.districtName}}
        </el-form-item>
        <el-form-item label="生产地址：">
          {{supplierForm.productionAddress}}
        </el-form-item>
        <el-form-item label="经营地址：">
          {{supplierForm.businessAddress}}
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="border-top:1px solid gray;">
      <el-col :span="24">
        <label class="title">联系信息</label>
        <el-form-item label="联系人：">
          {{supplierForm.supplierContact.contactName}}
        </el-form-item>
        <el-form-item label="联系电话：">
          {{supplierForm.supplierContact.contactPhone}}
        </el-form-item>
        <el-form-item label="邮箱：">
          {{supplierForm.supplierContact.contactEmail}}
        </el-form-item>
        <el-form-item label="传真：">
          {{supplierForm.supplierContact.fax}}
        </el-form-item>
        <el-form-item label="状态：">
          {{supplierForm.isValid=='1'?'启用':'停用'}}
        </el-form-item>
        <el-form-item label="备注：">
          {{supplierForm.supplierContact.remarks}}
        </el-form-item>

        <el-form-item>
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="next()">下一步</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import '@/static/style/supplier/supplierAdd.scss'
export default {
  data() {
    return {
      supplierForm: {
        supplierContact:{},
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
    cancel() {
      this.$router.push({ name: 'supplierList' });
    },
    next() {
      this.$router.push({ name: 'supplierFinanceDetail', params: { id: this.$route.params.id } });
    },
    getdetail() {
      // 获取数据
      let _id = this.$route.params.id;
      this.$store.dispatch('switchLoadingStatus', true);
      this.$api.apiCommunication('/supplier/detail', { "supplierId": _id }, res => {
        this.$store.dispatch('switchLoadingStatus', false)
        if (res.code != 2000) {
          this.$alert(`服务器返回信息：${res.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' });
          return false;
        }
        this.supplierForm = res.data;
        //处理异常数据，防止出错
        if (null == this.supplierForm) {
          this.supplierForm = {};
        }
        if (undefined == this.supplierForm.supplierContact || null == this.supplierForm.supplierContact) {
          this.supplierForm.supplierContact = {}
        }
      }, 'basedata');
    },
  },
  mounted() {
    this.getdetail();
  }
}
</script>