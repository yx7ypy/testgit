<template>
  <div class="account-manager-update">
    <!--<div class="crumb-box">-->
      <!--<i></i>-->
      <!--<el-breadcrumb separator=">">-->
        <!--<el-breadcrumb-item :to="{ path: '/permissionManager/manager' }">权限管理</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <!--<div class="help">-->
      <!--<el-tooltip class="item help-content" popper-class="custom-popper" effect="dark" :content="help" placement="top-start">-->
        <!--<img src="../../static/img/icon_help.png" width="25"/>-->
      <!--</el-tooltip>-->
    <!--</div>-->
    <div class="addBox-con">
      <el-form :model="subList" ref="subList" label-width="120px">
        <el-form-item label="手机号码：" class="form-item require">
          <el-input v-model="subList.mobile" :maxlength="25"></el-input><label class="label">请输入手机号码</label>
        </el-form-item>
        <el-form-item label="密码：" class="form-item require">
          <el-input v-model="subList.pwd"></el-input><label class="label">请设置登录密码，字母、数字或字母+数字组合</label>
        </el-form-item>
        <el-form-item label="姓名：" class="form-item require">
          <el-input v-model="subList.userName"></el-input><label class="label">请输入姓名</label>
        </el-form-item>
        <el-form-item label="邮箱：" class="form-item">
          <el-input type="text" v-model="subList.email"></el-input>
        </el-form-item>
        <el-form-item label="账号角色：" class="form-item require">
          <el-checkbox-group v-model="subList.roleIds">
            <el-checkbox :label="item.roleId" v-for="item in roleList" :key="item.roleId" :value="item.roleId">{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" class="form-item require">
          <el-radio v-model="subList.status" label="1">启用</el-radio>
          <el-radio v-model="subList.status" label="0">禁用</el-radio>
        </el-form-item>
        <div class="oper-box clearfix">
          <el-button type="primary" @click="goHold('subList')" class="save-btn">保存</el-button>
          <el-button type="primary" @click="cancle" class="cancel-btn">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import validation from '../../utils/validation';
  export default {
    data() {
      return {
        subList: {
          mobile:'',
          userName:'',
          pwd:'',
          email:'',
          status:'1',
          roleIds:[]
        },
        roleList:[],
        pageType:'add',
        isSubmiting:false,
        help:'账号管理：只可修改账号的基本信息（如手机号码、姓名、状态等）。若要管理账号的数据信息（如分配盒子、分配运营商），请在账号数据管理中操作。'
      };
    },
    methods: {
      goHold: function () {
        //开始验证
        let msg=[];
        if(validation.mobile(this.subList.mobile)===false){
          msg.push('手机号不完整或者非法手机号; ');
        }
        if(validation.password(this.subList.pwd)===false){
          msg.push('密码不符合规则; ');
        }
        if(validation.name(this.subList.userName)===false){
          msg.push('用户姓名不能为空,姓名为十个以内汉字; ');
        }
        if(this.subList.roleIds.length===0){
          msg.push('请为用户制定账号角色; ');
        }

        if(msg.length>0){
            this.$notify({ title: '系统通知', message: msg.join(''), type: 'error' })
          return;
        }

        let url='';
        let params=this.subList;
        if(this.pageType==='add'){
          url='/user/headquarter/add'
        } else{
          url='/user/headquarter/edit';
          Object.assign(params,{"userId":this.$route.query.id,"status":Number(params.status)});
        }
        this.isSubmiting=true;
        this.$api.apiCommunication(url,params,res=>{
            if(res.code===2000) {
              this.cancle();
            }
            this.isSubmiting=false;
          },'user')
      },
      cancle: function () {
        history.back();
      },
      getRoleList(){
        let params={};
          this.$api.apiCommunicationGet('/user/dataPrivilege/showRoles',res=>{
            if(res.code===2000)
            {
              let tmp=[{'roleId':'','roleName':'全部角色'}];
              tmp=tmp.concat(res.data);
              this.roleList=tmp;
            }
          },'user')
      },
      initPage:function () {
        const name=this.$route.name;
        /**
         * 如果路由是add，那么是新建，如果路由是edit，那么是编辑状态，需要配合收到的id进行更新操作
         */
        this.pageType=name.indexOf('add')>-1?'add':'edit';
        if(this.pageType=='edit'){
          this.getUserInfo();
        }
        this.getRoleList();
      },
      getUserInfo(){
        const id=this.$route.query.id;

          this.$api.apiCommunicationGet('/user/headquarter/getUserById/'+id,res=>{
            if(res.code===2000){
               let userInfo=res.data;
               this.subList.userName=userInfo.user.userName;
               this.subList.pwd=userInfo.user.pwd;
               this.subList.email=userInfo.user.email;
               this.subList.mobile=userInfo.user.mobile;
               this.subList.status=userInfo.user.status+''; //将int转换成string
               this.subList.roleIds=userInfo.user.roles.map((item)=>{ return item.roleId});
            }
          },'user')
      }
    },
    mounted(){
      this.initPage();
    }
  };
</script>


<style lang="scss">
  body{
    padding: 0!important;
  }
  .account-manager-update {
    .help {
      position: absolute;
      top: 55px;
      right: 20px;
    }
    .addBox-con {
      width: 100%;
      background-color: #fff;
      border-radius: 6px;
      padding: 20px 20px;
      .el-form {
        .form-item {
          text-align: left;
        }
        input {
          width: 320px;
        }
        .el-input {
          width: 320px;
          margin-right: 20px;
          display: inline-block;
        }
        .label {
          color: #C1C1C1;
        }

        .require > label:nth-child(1):before {
          content: '*';
          color: #ff0000;
        }

        .permission-ul {
          margin: 0;
          padding: 0;
          list-style: none;

          li {
            width: 100%;
            text-align: left;
          }
          .first-row {
            background-color: #e0e0e0;
            padding-left: 10px;
          }
          .second-row {
            margin-left: 30px;
          }
          .three-row {
            margin-left: 60px;
          }
        }

        .oper-box{
          text-align: center;
        }
        .save-btn {
          background-color: #ec6d1e;
          border: none;
          margin-right: 30px;
        }
        .cancel-btn {
          background-color: #999999;
          border: none;
        }
      }
    }
  }

</style>
