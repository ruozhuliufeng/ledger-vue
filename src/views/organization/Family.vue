<template>
  <div>
  <el-dialog
      title="提示"
      :visible.sync="infoDialogVisible"
      width="30%"
      center
      :before-close="handleClose">
    <span style="text-align: center">您尚未加入任何家庭，请选择创建或加入家庭</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleCreateFamily"  type="primary" round>创建家庭</el-button>
    <el-tooltip class="item" effect="dark" content="请注意,为了让家庭负责人确认您的信息，我们将推送您的真实姓名及手机号码以供核实。" placement="bottom">
      <el-button @click="handleJoinFamily" type="success" round>加入家庭</el-button>
    </el-tooltip>
  </span>
  </el-dialog>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "Family",
  data() {
    return {
      infoDialogVisible: false,
      editFormVisible: false,
      createFamilyVisible: false,
      joinFamilyVisible: false,
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
    handleCreateFamily(){
      this.createFamilyVisible = true
      this.infoDialogVisible = false
    },
    handleJoinFamily(){
      this.joinFamilyVisible = true
      this.infoDialogVisible = false
    }
  }
}
</script>

<style scoped>
.item {
  margin: 4px;
}
</style>
