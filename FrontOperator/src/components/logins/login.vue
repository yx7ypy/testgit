<template>
    <div class="login-wrap">
        <div class="login-header">
            <div class="header-logo">
                <h1>
                    <a href="">
                        <img src="../../static/img/logo.png" alt="缤果盒子logo">
                    </a>
                </h1>
                <div class="header-link"><a href="http://storage.binguobox.com/" target="_blank">仓储系统</a><span>|</span><a href="http://www.binguohezi.com/" target="_blank">官方网站</a></div>
            </div>
        </div>
        <div class="login-content">
            <div class="content-wrap">
                <div class="content-title">
                    <div class="title-wrap">
                        <img src="../../static/img/login-bg-2.jpg" alt="运营商管理系统">
                    </div>
                </div>
                <div class="content-form">
                    <div class="form-wrap">
                        <h2>USER LOGIN</h2>
                        <h1>用户登录</h1>
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item prop="username" class="mar-top10">
                                <el-input placeholder="请输入账号" v-model="form.mobile" size="large">
                                    <template slot="prepend">
                                        <i class="iconfont icon-zhanghaozhongxin fs-1s2em"></i>
                                    </template>
        						</el-input>
        					</el-form-item>
        					<el-form-item prop="password">
        						<el-input type="password" placeholder="请输入密码" v-model="form.pwd" size="large" @keyup.enter.native="onLogin('form')">
        						    <template slot="prepend">
                                        <i class="iconfont icon-password fs-1s2em"></i>
                                    </template>
        						</el-input>
        					</el-form-item>
                            <!--<el-form-item prop="code">
                                <el-input placeholder="请输入验证码" v-model="form.code" size="large" @keyup.enter.native="onLogin('form')">
                                    <template slot="append">
                                        <el-button type="text" class="code-button" @click="getVerificationCode">
                                            <img :src="codeUrl" alt="验证码">
                                        </el-button>
                                    </template>
                                </el-input>
                            </el-form-item>-->
        					<el-button type="primary" @click="onLogin('form')" class="content-login">登录</el-button>
        				</el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-footer">
            <p>中山市宾哥网络科技有限公司</p>
            <p>粤ICP备16097902号-1</p>
        </div>
    </div>
</template>

<script>
// 后台登录页面
import '@/static/style/logins/login.scss'
import { basicConfig } from '@/config/config.js'
import md5 from 'js-md5';

export default {
    data() {
        return {
            codeUrl: `${basicConfig.API_HOST}/Login/codeRand`,
            WSUrl: basicConfig.WS_HOST,
            form: {
                mobile: '',
                pwd: '',
//              code: ''
            },
            rules: {
                mobile: [ { required: true, message: '请输入登录账号', trigger: 'blur' } ],
                pwd: [ { required: true, message: '请输入登录密码', trigger: 'blur' } ],
//              code: [ { required: true, message: '请输入验证码', trigger: 'blur' } ]
            }
        }
    },
    methods: {
        onLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 执行登录
//                  this.form.pwd = md5(this.form.pwd);
                    this.$store.dispatch('onLogin', this.form);
                } else {
                    this.$notify({ title: '系统通知', message: '必填的项目不能为空！', type: 'warning' })
                }
            });
        },
        getVerificationCode() {
            // 获取新的验证码
            this.codeUrl = `${basicConfig.API_HOST}/Login/codeRand?v=${Math.random()}`
        }
    },
    created(){
        this.$store.dispatch('writeSystemDomain',`operator.${basicConfig.COOKIES_DOMAIN}`)
    }
}
</script>
