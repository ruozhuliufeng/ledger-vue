<template>
  <div>
    <el-dialog
        title="提示"
        :visible.sync="infoDialogVisible"
        width="30%"
        center
        :before-close="handleClose">
      <span style="text-align: center">您尚未加入任何团队，请选择创建或加入团队</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCreateTeam"  type="primary" round>创建团队</el-button>
          <el-tooltip class="item" effect="dark"
                content="请注意,为了让团队负责人确认您的信息，我们将推送您的真实姓名及手机号码以供核实。"
                placement="bottom">
            <el-button @click="handleJoinTeam" type="success" round>加入团队</el-button>
          </el-tooltip>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import router from "@/router";

export default {
  name: "Team",
  data() {
    return {
      infoDialogVisible: false,
      editFormVisible: false,
      createTeamVisible: false,
      joinTeamVisible: false,
      editForm: {},
    }
  },
  created() {
    this.infoDialogVisible = true
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            router.push("/index")
          })
          .catch(_ => {
          });
    },
    handleCreateTeam(){
      this.createTeamVisible = true
      this.infoDialogVisible = false
      this.$modal.msgWarning("团队功能正在开发中")
      router.push("/index")
    },
    handleJoinTeam(){
      this.joinTeamVisible = true
      this.infoDialogVisible = false
      this.$modal.msgWarning("团队功能正在开发中")
      router.push("/index")
    }
  }
}
</script>

<style scoped>
.item {
  margin: 4px;
}
</style>
