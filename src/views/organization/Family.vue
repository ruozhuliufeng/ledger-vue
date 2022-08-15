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
    <el-dialog
      :visible.sync="createFamilyVisible"
      title="编辑家庭信息"
      width="30%"
      >
      <el-form :model="editForm" ref="editForm" >
        <el-form-item label="家庭名称" prop="tissueName" label-width="100px" required>
          <el-input v-model="editForm.tissueName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="家庭描述" prop="tissueDescription" label-width="100px">
          <el-input v-model="editForm.tissueDescription" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确定</el-button>
        <el-button @click="resetForm('editForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import router from "@/router";
import {createFamily,updateFamily,updateFamilyUser,deleteFamily,deleteFamilyUser,queryFamilyList,queryFamilyUser} from "@/api/tissue";
export default {
  name: "Family",
  data() {
    return {
      infoDialogVisible: false,
      editFormVisible: false,
      createFamilyVisible: false,
      joinFamilyVisible: false,
      editForm: {},
      editFormRules: {
        tissueName: [
          {required: true, message: '家庭名称不能为空', trigger: 'blur'}
        ],
      },
      familyData:{},
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
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.editForm.id) {
                updateFamily(this.editForm).then(res => {
                  this.$modal.msgSuccess(res.data.message)
                })
              } else {
                createFamily(this.editForm).then(res => {
                  this.$modal.msgSuccess(res.data.message)
                })
                this.createFamilyVisible = false
              }
            } else {
              return false
            }
          }
      )
    },
  }
}
</script>

<style scoped>
.item {
  margin: 4px;
}
</style>
