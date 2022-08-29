<template>
  <div>
    <el-card
        shadow="always"
        v-for="(item,index) in noReadMessage" :key="index"
    >
      <div slot="header" style="height: 10px">
        <span style="font-size: 15px">{{ item.messageTitle }}</span>
        <el-button style="float: right; padding: 5px;margin-right: 10px"
                   type="success" icon="el-icon-check"
                   @click="confirmMessage(item.id)"
                   size="mini"
                   circle/>
        <el-button style="float: right; padding: 5px;margin-right: 10px"
                   type="primary"
                   icon="el-icon-close"
                   @click="readMessage(item.id)"
                   size="mini"
                   circle/>
      </div>
      <div class="read_message">
        <div>
          <span>发送人：{{ item.sendUserName }}</span>
        </div>
        <div>
          <span>发送时间：{{ formatterTime(item.sendTime) }}</span>
        </div>
        <div>
          <span>内容：{{ item.messageContent }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {queryNoReadMessage, confirmMessage, readMessage} from "@/api/message";

export default {
  name: "UnReadMessage",
  data(){
    return{
      noReadMessage:[]
    }
  },
  mounted(){
    this.getNoMessageList()
  },
  methods: {
    // 获取未读消息列表
    getNoMessageList(){
      queryNoReadMessage().then(res=>{
        this.noReadMessage = res.data.data
      })
    },
    // 确认消息
    confirmMessage(id) {
      confirmMessage(id).then(res => {
        this.$modal.msgSuccess("已确认")
        this.getNoMessageList()
      })
    },
    // 已读消息
    readMessage(id) {
      readMessage(id).then(res => {
        this.$modal.msgSuccess("已读消息")
        this.getNoMessageList()
      })
    },
    // 时间格式化
    formatterTime(value){
      return this.$moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}
</script>

<style scoped>
.read_message {
  font-family: "Times New Roman", serif;
  font-style: italic;
  font-weight: normal;
  font-size: 1em;
}
</style>
