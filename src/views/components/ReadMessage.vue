<template>
  <div>
    <el-card
        shadow="always"
        v-for="(item,index) in readMessageList" :key="index"
    >
      <div slot="header" style="height: 10px">
        <span style="font-size: 15px;margin-top: 2px">{{ item.messageTitle }}</span>
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
import {queryReadMessage} from "@/api/message";

export default {
  name: "ReadMessage",
  data(){
    return{
      readMessageList: []
    }
  },
  mounted(){
    this.getMessageList()
  },
  methods:{
    // 获取已读消息列表
    getMessageList(){
      queryReadMessage().then(res=>{
        this.readMessageList = res.data.data
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
