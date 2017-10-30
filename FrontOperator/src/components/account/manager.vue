<template>
  <div class="account-manager-manager">
    <!--<div class="crumb-box">-->
      <!--<i></i>-->
      <!--<el-breadcrumb separator=">">-->
        <!--<el-breadcrumb-item :to="{ path: '/accountManager/list' }">账号管理</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <!--<div class="help">-->
      <!--<el-tooltip class="item help-content"  popper-class="custom-popper" effect="dark" :content="help" placement="top-start">-->
        <!--<img src="../../static/img/icon_help.png" width="25"/>-->
      <!--</el-tooltip>-->
    <!--</div>-->
    <div class="account-manager-info">
      <div class="one-left clearfix">
        <ul>
          <li>
            <span>手机号码:</span>
            <el-input v-model="searchData.mobile" placeholder="请输入手机号码"></el-input>
          </li>
          <li>
            <span>姓名：</span>
            <el-input v-model="searchData.userName" placeholder="请输入姓名"></el-input>
          </li>
          <li>
            <span>账号角色:</span>
            <el-select v-model="searchData.role" placeholder="用户角色">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
              </el-option>
            </el-select>
          </li>
          <li>
            <span>状态：</span>
            <el-select v-model="searchData.status" placeholder="状态" name="isValid">
              <el-option v-for="item in optionsStates" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <div class="one-right">
        <div class="selectButton clearfix">
          <el-button type="primary" @click="search" class="search-btn">查询</el-button>
          <el-button type="primary" @click="clear" class="cancel-btn">清空</el-button>
        </div>
      </div>

    </div>
    <div class="account-manager-list">
      <!--列表区域-->
      <div class="jmslist">
        <router-link :to="{name:'account.add'}" href="javascript:void(0);" class="add-btn"><i>+新建账号</i></router-link>
        <el-table ref="multipleTable" :data="accountList" border tooltip-effect="dark" style="width: 100%"
                  v-loading="loading">
          <el-table-column align="center" prop="mobile" label="手机号码"></el-table-column>
          <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
          <el-table-column width="200" align="center" prop="email" label="邮箱"></el-table-column>
          <el-table-column width="180" align="center" prop="lastLoginTime" label="最近登录时间"></el-table-column>
          <el-table-column width="180" align="center" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column align="center" prop="roles" label="账号角色">
            <template slot-scope="scope">
              <div class="textOverCss">{{getRoleStr(scope.row.roles)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status==1">有效</span>
              <span v-else>无效</span>
              <el-button type="primary" size="small" class="change-btn"
                         @click="perModifySate(scope.row.userId,scope.row.status)">更改状态
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="small" class="change-btn"
                         @click="routerPush('account.edit',scope.row.userId)">编辑
              </el-button>
              <el-button type="primary" size="small" class="show-btn"
                         @click="routerPush('account.show',scope.row.userId)">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages">
        <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10]" :page-size="10"
                       layout="total, prev, pager, next, jumper" :total="total" ref='pagination'></el-pagination>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      size="tiny"
      top="30%">
      <span>确认将此账号从{{modifyStatus == '0' ? '禁用改为启用' : '启用改为禁用'}}状态</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeState">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        pageNum: 1,
        total: 0,
        accountList: [],
        searchData: {  //搜索的数据
          'mobile': '',
          'userName': '',
          'role': '',
          'status': '',
          'pageSize': 10
        },
        roleList: [],
        optionsStates: [
          {value: '', label: '所有'},
          {value: '1', label: '启用'},
          {value: '0', label: '禁用'}
        ],
        dialogVisible: false,
        modifyId: '',
        modifyStatus: '',
        help: '账号管理：只可修改账号的基本信息（如手机号码、姓名、状态等）。若要管理账号的数据信息（如分配盒子、分配运营商），请在账号数据管理中操作.'
      }
    },
    mounted() {
      this.getAccountList();
      this.getRoleList();
    },
    methods: {
      //分页的函数
      handleCurrentChange(val) {
        //页面发生改变的时候执行
        this.loading = true;
        let param = {
          pageNum: val
        };
        let _data = [];
        for (let i in this.searchData) {
          if (this.searchData[i] !== '') {
            _data[i] = this.searchData[i];
          }
        }
        Object.assign(param, _data);
        this.$api.apiCommunication('/user/headquarter/list', param,(res) => {
            if (res.code == 2000) {
              let resData = res.data; // 定义一个变量为data
              this.accountList = resData.list;
              this.total = resData.total;
              this.pageNum = resData.pageNum;
              this.loading = false;
            }
          })
      },
      getRoleList() {
        let params = {};
        this.$api.apiCommunicationGet('/user/dataPrivilege/showRoles',res => {
            if (res.code === 2000) {
              let tmp = [{'roleId': '', 'roleName': '全部角色'}];
              tmp = tmp.concat(res.data);
              this.roleList = tmp;
            }
          },'user')
      },
      //查询的功能
      search() {
        let params = {
          pageNum:this.pageNum
        };
        let _data = [];
        this.loading = true;
        for (var i in this.searchData) {
          if (this.searchData[i] !== '') {
            if (i === 'role') {
              _data['roleIds'] = [this.searchData[i] + '']
            } else {
              _data[i] = this.searchData[i];
            }
          }
        }
        Object.assign(params, _data);
          this.$api.apiCommunication('/user/headquarter/list', params,(res) => {
            if (res.code == 2000) {
              this.accountList = res.data.list;
              this.total = res.data.total;//查询的时候一定要将total再次重新赋值
              this.pageNum = res.data.pageNum;
            }
            this.loading = false;
          },'user')
      },
      clear() {
        this.searchData.role = "";
        this.searchData.status = "";
        this.searchData.userName = '';
        this.searchData.mobile = '';
      },
      /**
       * 获取账号列表
       */
      getAccountList() {
        let params = {
          pageNum:this.pageNum
        };
        let _data = [];
        this.loading = true;
        for (var i in this.searchData) {
          if (this.searchData[i] !== '') {
            _data[i] = this.searchData[i];
          }
        }
        Object.assign(params, _data);
        this.loading = true;
          this.$api.apiCommunication('/user/headquarter/list', params,res => {
            if (res.code === 2000) {
              this.accountList = res.data.list;
              this.total = res.data.total;
              this.pageNum = res.data.pageNum;
              this.loading = false;
            }
          },'user')
      },

      routerPush(type, id) {
        this.$router.push({'name': type, query: {'id': id, 'from': 'manager'}});
        return false
      },
      perModifySate: function (id, status) {
        this.modifyId = id;
        this.modifyStatus = status;
        this.dialogVisible = true;
      },
      changeState: function () {
        this.$api.apiCommunicationGet('/user/headquarter/changeUserState/' + this.modifyId,res => {
            if (res.code === 2000) {
              this.modifyStatus = !this.modifyStatus;
              this.accountList = this.accountList.map(item => {
                if (item.userId == this.modifyId) {
                  return Object.assign({}, item, {status: this.modifyStatus})
                } else {
                  return item;
                }
              })
            }
            else {
                this.$notify({ title: '系统通知', message: '更改失败！', type: 'warning' })
            }
            this.dialogVisible = false;
          },'user')
      },
      getRoleStr(roles) {
        const info = roles;
        let res = [];
        if (info.length > 0) {
          for (let item of info) {
            res.push(item.roleName);
          }
        }
        return res.join('，');
      }
    }
  }
</script>

<style lang="scss">
  .account-manager-manager {
    .help {
      position: absolute;
      top: 55px;
      right: 20px;
    }

    .account-manager-info {
      width: 100%;
      height: 140px;
      background-color: #fff;
      border-radius: 10px;

      .one-left {
        padding: 20px 50px;
        float: left;
        width: 65%;
        .el-input {
          width: 185px;
        }

        ul {
          font-size: 14px;

          li {
            float: left;
            line-height: 50px;
            height: 50px;
            margin-right: 145px;
          }
        }
      }
      .one-right {
        width: 25%;
        float: left;
        height: 46px;
        font-size: 14px;
        margin-top: 80px;

        .selectButton {
          float: left;
          margin-left: 50px;
        }

        .search-btn {
          background-color: #3F7DF5;
          border: none;
          margin-right: 50px;
        }
        .cancel-btn {
          background-color: #09BB07;
          border: none;
        }
      }
    }

    .account-manager-list {
      background-color: #fff;
      margin: 15px 0px;
      padding-bottom: 15px;
      border-radius: 10px;

      .jmslist {
        padding: 10px;

        .add-btn {
          display: block;
          width: 120px;
          height: 32px;
          line-height: 32px;
          margin-bottom: 12px;
          border-radius: 6px;
          font-size: 14px;
          text-align: center;
          background: #ec6d1e;
          color: #fff;
          text-decoration: initial;
        }

        .change-btn {
          border: none;
          background-color: #EB6D1D;
        }
        .show-btn {
          background-color: #407EF4;
          border: none
        }
        .textOverCss {
          width: 90%;
          margin: 0 5%;
          overflow: hidden;
          float: left;
          text-overflow: ellipsis;
        }

        .el-table th > .cell {
          font-weight: 700;
        }
        .el-table .cell, .el-table th > div {
          padding: 0;
        }
      }
      .pages {
        margin-top: 15px;
      }
    }
  }

</style>
