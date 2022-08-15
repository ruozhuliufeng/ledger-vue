<template>
  <el-form ref="editForm" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="currentPass">
      <el-input v-model="user.currentPass" placeholder="请输入旧密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="user.password" placeholder="请输入新密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input v-model="user.checkPass" placeholder="请确认新密码" type="password" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
<!--      <el-button type="danger" size="mini" @click="close">关闭</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import {updatePass} from "@/api/common";
export default {
  name: "ResetPwd",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (value === ''){
        callback(new Error('请再次输入密码'))
      }else if (this.user.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: {
        password: '',
        checkPass: '',
        currentPass: ''
      },
      // 表单校验
      rules: {
        currentPass: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        conficheckPassrmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          updatePass(this.user).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    // close() {
      // this.$tab.closePage();
    // }
  }
}
</script>

<style scoped>

</style>
