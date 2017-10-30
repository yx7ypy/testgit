<template>
    <div>
        <feng-topbar title="修改密码"></feng-topbar>
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item editor-form display-table">
                <div class="form-left">
                    <el-form ref="form" :rules="rules" label-position="right" :model="form" label-width="150px">
                        <el-form-item label="输入旧密码" prop="oldPassword">
                            <el-input v-model="form.oldPassword" placeholder="请输入旧密码" type="password" :maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item label="输入新密码" prop="newPassword">
                            <el-input v-model="form.newPassword" placeholder="请输入新密码" type="password" :minlength="6" :maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item label="重复新密码" prop="confirmPassword">
                            <el-input v-model="form.confirmPassword" placeholder="请重复新密码" type="password" :maxlength="16"></el-input>
                        </el-form-item>
                        <el-form-item label="密码规则">
                            <p>6～16位，字母加数字，可以使用$#@^&</p>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="form-right"></div>
            </el-col>
        </el-row>
        <el-row class="mar-bottom10">
            <el-col :span="24" class="el-item pdd-20">
                <p class="theme-p mar-bottom10">是否保存</p>
                <el-button type="primary" @click="submit('form')">确定修改</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// 修改密码
import fengTopbar from '@/components/fengModule/topbar.vue'

export default {
    data() {
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                 callback(new Error('请输入新密码'))
            } else {
                let reg = /^([0-9a-zA-Z$#@^&]){6,16}$/
                if(!reg.test(value)){
                    callback(new Error('密码不符合规则，请重新输入'))
                }
                if (this.form.confirmPassword !== '') {
                    this.$refs.form.validateField('confirmPassword')
                }
                callback()
           }
        }
        let confirmPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            form: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
                confirmPassword: [{ required: true, validator: confirmPass, trigger: 'blur' }]
            }
        }
    },
    created() {
        this.$store.dispatch('switchBreadcrumb', { bone: '修改密码' });
//      this.$alert('帐号未激活;请先修改密码继续操作', '系统通知', { confirmButtonText: '确定', type: 'error' })
    },
    methods: {
        submit(formName) {
            let that = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 修改密码
                    let param = {
//                      nickname: this.$store.getters.getAccount,
                        oldPwd: this.form.oldPassword,
                        newPwd: this.form.newPassword,
//                      new_password2: this.form.confirmPassword
                    }
                    this.$api.apiCommunication('/user/modifyPwd', param, response => {
                        if (response.code === 2000) {
                            that.$alert('修改密码成功，请点击确定或关闭本通知跳转重新登录', '系统通知', {
                                confirmButtonText: '确定',
                                type: 'success',
                                callback: action => {
                                    // 密码修改成功，退出登录
                                    that.$store.dispatch('outLogin')
                                }
                            })
                        } else {
                            that.$alert(`修改失败，服务器返回错误：${response.msg}`, '系统通知', { confirmButtonText: '确定', type: 'error' })
                        }
                    },'user');
                } else {
                    this.$notify({ title: '系统通知', message: '密码不符合规则，请重新输入', type: 'error' })
                }
            })
        }
    },
    components: {
        fengTopbar
    }
}
</script>
