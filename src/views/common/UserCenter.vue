<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div class="text-center">
            <user-avatar :user="userInfo"/>
          </div>
          <ul class="list-group list-group-striped">
            <li class="list-group-item">
              <svg-icon icon-class="user"/>
              账户名称
              <div class="pull-right">{{ userInfo.account }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="user"/>
              昵称
              <div class="pull-right">{{ userInfo.nickName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="user"/>
              真实姓名
              <div class="pull-right">{{ userInfo.realName }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="phone"/>
              手机号码
              <div class="pull-right">{{ userInfo.phone }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="email"/>
              邮箱地址
              <div class="pull-right">{{ userInfo.email }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="peoples"/>
              所属角色
              <div class="pull-right">{{ userInfo.roles }}</div>
            </li>
            <li class="list-group-item">
              <svg-icon icon-class="date"/>
              创建日期
              <div class="pull-right">
                {{formatterTime(userInfo.createTime)}}</div>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userInfo">
              <user-info :user="userInfo"/>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPws">
              <reset-pwd :user="userInfo"/>
            </el-tab-pane>
            <el-tab-pane label="第三方系统关联" name="userOauth">
              <user-oauth :user="userInfo"/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getUserInfo, updatePass} from "@/api/common";
import UserAvatar from "@/views/common/profile/UserAvatar";
import UserInfo from "@/views/common/profile/UserInfo";
import ResetPwd from "@/views/common/profile/ResetPwd";
import UserOauth from "@/views/common/profile/UserOauth";

export default {
  name: "UserCenter",
  components: {UserOauth, ResetPwd, UserInfo, UserAvatar},
  data() {
    return {
      userInfo: {},
      activeTab: "userInfo"
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getUserInfo().then(res => {
        this.userInfo = res.data.data
      })
    },
    formatterTime(value){
      return this.$moment(value).format('YYYY-MM-DD');
    }
  }
}
</script>

<style scoped>
.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;
}
.pull-right {
  float: right !important;
}
.text-center {
  text-align: center
}
</style>
