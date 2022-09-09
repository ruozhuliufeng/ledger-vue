<template>
  <el-container>
    <el-aside width="200px">
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <strong>Ledger 财务管理系统</strong>
        <div class="header-avatar">
          <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">{{ userInfo.nickName }}<i class="el-icon-arrow-down el-icon--right">
            </i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name:'UserCenter'}">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">
                退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-link href="https:www.aixuxi.cn" target="_blank">网站</el-link>
        </div>
        <div @click="toMessage" style="float:right;">
          <div style="width:40px;height:30px;position:relative">
                <span v-show="waitMsgNum" style="position: absolute;left: 30%;top: -2px;background-color: red;color: #fff;
            line-height: 20px;
            padding:0 4px;
            border-radius: 20px;
            text-align: center;
            z-index:10;
            font-size: 12px;">{{ waitMsgNum > 99 ? '99+' : waitMsgNum }}</span>
            <i class="el-icon-bell headerIcon"></i>
            <svg-icon slot="reference" icon-class="el-icon-bell" class="headerIcon"></svg-icon>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-drawer
            title="消息列表"
            :visible.sync="showMessage"
            :with-header="false"
            size="20%">
          <el-tabs v-model="activeTab" style="margin-left: 5px">
            <el-tab-pane name="unReadMessage">
              <span slot="label"><i class="el-icon-bell"></i> 未读消息</span>
              <un-read-message></un-read-message>
            </el-tab-pane>
            <el-tab-pane name="readMessage">
              <span slot="label"><i class="el-icon-message-solid"></i> 已读消息</span>
              <read-message></read-message>
            </el-tab-pane>
          </el-tabs>
        </el-drawer>
        <Tabs></Tabs>
        <div style="margin: 0 15px">
          <router-view/>
        </div>
      </el-main>
      <el-footer>
        Copyright © 2022 若竹流风 - All rights reserved 联系我们：ruozhuliufeng@aixuxi.cn
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import SideMenu from "@/views/components/SideMenu";
import Tabs from "@/views/components/Tabs";
import {getUserInfo, logout} from "@/api/common";
import UnReadMessage from "@/views/components/UnReadMessage";
import ReadMessage from "@/views/components/ReadMessage";
import {generateFromString} from 'generate-avatar'

export default {
  name: 'Home',
  components: {
    UnReadMessage,
    ReadMessage,
    SideMenu,
    Tabs
  },
  data() {
    return {
      userInfo: {
        id: "",
        account: "",
        avatar: ""
      },
      showMessage: false,
      activeTab: 'unReadMessage',
      noReadMessage: [],
      readMessageList: []
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    waitMsgNum: {
      get() {
        return this.$store.state.waitMsgNum
      }
    }
  },
  methods: {
    getUserInfo() {
      getUserInfo().then(res => {
        this.userInfo = res.data.data
        this.userInfo.avatar = "data:image/svg+xml;utf8,"+generateFromString(this.userInfo.account)
      })
    },
    logout() {
      logout().then(res => {
        localStorage.clear()
        sessionStorage.clear()
        this.$store.commit("resetState")
        this.$router.push("/common")
      })
    },
    toMessage() {
      this.showMessage = true
    },
  }
}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-header {
  background-color: #cccccc;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-footer {
  background-color: #030409;
  color: #ebeef5;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}

a {
  text-decoration: none;
}

.headerIcon {
  font-size: 40px;
  margin-right: 10px;
  cursor: pointer;
  padding-top: 6px;
  position: absolute;
  left: -3px;
  right: 13px;
}

</style>
