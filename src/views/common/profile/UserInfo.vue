<template>
  <el-form ref="editForm" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="账户名称" prop="account">
      <el-input v-model="user.account" maxlength="30" disabled />
    </el-form-item>
    <el-form-item label="昵称" prop="nickName">
      <el-input v-model="user.nickName" maxlength="30" />
    </el-form-item>
    <el-form-item label="真实姓名" prop="realName">
      <el-input v-model="user.realName" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="电子邮箱" prop="email">
      <el-input v-model="user.email" maxlength="30" />
    </el-form-item>
    <el-form-item label="初始金额" prop="initialAmount">
      <el-input v-model="user.initialAmount" maxlength="30" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
<!--      <el-button type="danger" size="mini" @click="close">关闭</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import {updateUser} from "@/api/system";
export default {
  name: "UserInfo",
  props:{
    user:{
      type:Object
    }
  },
  data(){
    return{
// 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods:{
    submit(){
      this.$refs["editForm"].validate(valid=>{
        if (valid){
          updateUser(this.user).then(res=>{
            this.$modal.msgSuccess("修改成功")
          })
        }
      })
    },
    close(){
    }
  }
}
</script>

<style scoped>

</style>
