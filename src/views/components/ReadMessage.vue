<template>
  <div>
    <el-card
        shadow="always"
        v-for="(item,index) in readMessageList" :key="index"
    >
      <div slot="header" style="height: 10px">
        <span style="font-size: 15px;margin-top: 2px">{{ item.title }}</span>
      </div>
      <div class="read_message">
        <div>
          <span>发送人：{{ item.sendUserName }}</span>
        </div>
        <div>
          <span>发送时间：{{ item.sendTime }}</span>
        </div>
        <div>
          <span>内容：{{ item.messageContent }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ReadMessage",
  props: {
    readMessageList: {
      type: Array,
    }
  },
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
