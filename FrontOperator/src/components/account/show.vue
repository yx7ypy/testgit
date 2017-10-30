<template>
  <div class="account-manager-show">
    <!--<div class="crumb-box">-->
      <!--<i></i>-->
      <!--<el-breadcrumb separator=">">-->
        <!--<el-breadcrumb-item :to="{ path: '/accountManager/manager' }">账号管理</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item v-html="title" v-if="title"></el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <!--<div class="help">-->
      <!--<el-tooltip class="item help-content" popper-class="custom-popper" effect="dark" :content="help" placement="top-start">-->
        <!--<img src="../../static/img/icon_help.png" width="25"/>-->
      <!--</el-tooltip>-->
    <!--</div>-->
    <div class="show-form">
      <el-row>
        <el-col :span="2" class="left-cell">手机号码：</el-col><el-col :span="22" class="right-cell">{{userInfo.user.mobile}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="left-cell">密码：</el-col>
        <el-col :span="22" class="right-cell">{{userInfo.user.pwd}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="left-cell">姓名：</el-col><el-col :span="22" class="right-cell">{{userInfo.user.userName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="left-cell">邮箱：</el-col><el-col :span="22" class="right-cell">{{userInfo.user.email}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="left-cell">账号角色：</el-col><el-col :span="22" class="right-cell">{{getRoles}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="left-cell">分配运营商：</el-col><el-col :span="22" class="right-cell">{{getOperators}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="left-cell">分配盒子：</el-col><el-col :span="22" class="right-cell">{{getBoxs}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="left-cell">状态：</el-col><el-col :span="22" class="right-cell">{{userInfo.user.status|formatStatus}}</el-col>
      </el-row>
      <el-row>
        <el-col class="btn-cell">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title:'',
        userInfo:{
          user:{
            mobile:'',
            userName:'',
            pwd:'',
            email:'',
            status:'',
            roles:[],
            operatorNames:[],
            boxNames:[]
          }
        },
        help:'账号管理：只可修改账号的基本信息（如手机号码、姓名、状态等）。若要管理账号的数据信息（如分配盒子、分配运营商），请在账号数据管理中操作。'
      };
    },
    computed: {
      getRoles() {
        const info = this.userInfo.user.roles;
        let res = [];
        if (info.length > 0) {
          for (let item of info) {
            res.push(item.roleName);
          }
        }
        return res.join('，');
      },
      getOperators(){
        this.userInfo.user.operatorNames.toString();
      },
      getBoxs(){
        return this.userInfo.user.boxNames.toString();
      }
    },
    filters: {
      formatStatus(value) {
        return value==1?'启用':'禁用'
      }
    },
    methods: {
      back:function() {
        history.back();
      },
      initPage:function () {
        const source=this.$route.query.from;
        if(source === 'list'){
          this.title="权限列表"
        }
        this.getUserInfo();
      },
      getUserInfo(){
        const id=this.$route.query.id;

        this.$api.apiCommunicationGet('/user/headquarter/getUserById/'+id,res=>{
            if(res.code===2000){
              this.userInfo=res.data;
            }
          },'user')
      }
    },
    mounted(){
      this.initPage();
    }
  }
</script>

<style lang="scss">
  .account-manager-show {
    .help {
      position: absolute;
      top: 55px;
      right: 20px;
    }
    .show-form {
      background-color: #fff;
      border-radius: 6px;
      padding: 20px 30px;
      width: 100%;

      .left-cell {
        text-align: right;
        min-height: 45px;
        line-height: 45px;
      }

      .right-cell {
        text-align: left;
        min-height: 45px;
        line-height: 45px;
      }

      .permission-ul {
        margin: 9px 0;
        padding: 0;
        list-style: none;

        li {
          width: 100%;
          text-align: left;
          height: 30px;
          line-height: 30px;
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

      .btn-cell{
        text-align: center;
      }
    }
  }
</style>
