<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :xl="6" :lg="7">
      <h2>欢迎使用 Ledger 管理您的财务账单</h2>

      <el-image :src="wechatUrl" style="height:190px;width:180px"/>

      <p>公众号：若竹流风</p>
    </el-col>
    <el-col :span="1">
      <el-divider direction="vertical"></el-divider>
    </el-col>
    <el-col :xl="6" :lg="7">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username" style="width:380px">
          <el-input v-model="loginForm.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width:380px">
          <el-input type="password" v-model="loginForm.password"/>
        </el-form-item>
        <el-form-item label="验证码" prop="code" style="width:380px">
          <el-input v-model="loginForm.code" style="width: 172px;float: left" maxlength="5"/>
          <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
          <el-button type="warning" icon="el-icon-warning-outline" circle @click="helpInfo"/>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import {common, getCaptcha} from "@/api/common";
import qs from 'qs'

export default {
  name: "Login",
  data() {
    return {
      wechatUrl: 'http://media.aixuxi.cn/gongzhong.jpg',
      loginForm: {
        username: '',
        password: '',
        code: '',
        token: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 5, message: "长度为5个字符", trigger: 'blur'}
        ]
      },
      captchaImg: null
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          common(qs.stringify(this.loginForm)).then(res => {
            const jwt = res.headers['authorization']
            this.$store.commit('SET_TOKEN', jwt)
            this.$router.push("/index")
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getCaptcha() {
      getCaptcha().then(res => {
        this.loginForm.token = res.data.data.token
        this.loginForm.code = ''
        this.captchaImg = res.data.data.captchaImg
      })
    },
    helpInfo() {
      this.$modal.notifyWarning("请注意:本系统尚未接入MSOP,且不提供账号注册功能;建议通过源码构建网站,源码地址可通过公众号获取.如有疑问,可通过公众号联系.")
    }
  },
  created() {
    this.getCaptcha()
  }
}
</script>

<style scoped>
.el-row {
  background-color: #fafafa;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.el-divider {
  height: 200px;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
}

</style>
