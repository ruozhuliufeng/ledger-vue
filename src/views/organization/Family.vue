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
        <el-button @click="handleCreateFamily" type="primary" round>创建家庭</el-button>
        <el-tooltip class="item" effect="dark"
                    content="请注意,为了让家庭负责人确认您的信息，我们将推送您的真实姓名及手机号码以供核实。"
                    placement="bottom">
          <el-button @click="handleJoinFamily" type="success" round>加入家庭</el-button>
        </el-tooltip>
      </span>
    </el-dialog>
    <el-dialog
        :visible.sync="createFamilyVisible"
        title="编辑家庭信息"
        width="30%"
        :before-close="handleClose"
    >
      <el-form :model="editForm" ref="editForm" :rules="editFormRules">
        <el-form-item label="唯一编码" prop="tissueCode" label-width="100px" v-if="editForm.id">
          <el-input v-model="editForm.tissueCode" disabled autocomplete="off"/>
        </el-form-item>
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
    <el-dialog
        :visible.sync="familyUserFormVisible"
        title="编辑家庭成员昵称"
        width="30%"
    >
      <el-form :model="familyUserForm" ref="familyUserForm">
        <el-form-item label="姓    名" prop="realName" label-width="100px">
          <el-input v-model="familyUserForm.realName" disabled autocomplete="off"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" label-width="100px" required>
          <el-input v-model="familyUserForm.phone" disabled autocomplete="off"/>
        </el-form-item>
        <el-form-item label="昵    称" prop="nickName" label-width="100px">
          <el-input v-model="familyUserForm.nickName" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateFamilyUser">确定</el-button>
        <el-button @click="resetForm('familyUserForm')">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="joinFamilyVisible"
        title="加入家庭"
        width="30%"
        :before-close="handleCloseJoin"
    >
      <el-form ref="searchForm" :inline="true"  size="mini" :model="searchForm">
        <el-form-item label="名称" prop="name" label-width="40px">
          <el-input v-model="searchForm.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="编码" prop="code" label-width="40px">
          <el-input v-model="searchForm.code" autocomplete="off"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryFamilyList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
          ref="familyTable"
          :data="familyTable"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
        <el-table-column
            type="index"/>
        <el-table-column
            property="tissueName"
            label="家庭名称"
            width="120"/>
        <el-table-column
            property="tissueCode"
            label="家庭编码"
            width="120"/>
        <el-table-column
            property="tissueDescription"
            label="描述"/>
      </el-table>
      <el-button style="float: right; padding: 5px 0" type="success"  @click="joinFamily">申请加入</el-button>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        归属家庭：<span style="color: #3a8ee6">{{ editForm.tissueName }}</span>
        <el-button style="float: right; padding: 4px 0" mini type="text" @click="addFamilyUser">
          新增成员
        </el-button>
        <el-button style="float: right; padding: 4px 0" mini type="text" @click="deleteFamily(editForm.id)">
          解散家庭
        </el-button>
        <el-button style="float: right; padding: 4px 0" mini type="text" @click="createFamilyVisible = true">
          编辑信息
        </el-button>
        <el-table
            :data="familyUserTable"
            style="width: 100%"
            stripe
            border
            size="medium"
        >
          <el-table-column
              prop="realName"
              label="姓名"
              width="120"/>
          <el-table-column
              prop="phone"
              label="手机号"
              width="120"/>
          <el-table-column
              prop="nickName"
              label="昵称"
              width="120"/>
          <el-table-column
              label="操作">
            <template v-slot="scope">
              <el-button type="primary" size="mini" @click="editFamilyUser(scope.row)">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button type="danger" size="mini" @click="deleteFamilyUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- TODO 循环展示设定目标 -->
      </el-col>
      <el-col :span="16" :xs="24">
        <!-- TODO 家庭交易记录 -->
        <h1>{{ editForm.id }}</h1>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import router from "@/router";
import {
  createFamily,
  updateFamily,
  queryFamily,
  updateFamilyUser,
  deleteFamily,
  deleteFamilyUser,
  queryFamilyList,
  queryFamilyUser
} from "@/api/tissue";

export default {
  name: "Family",
  data() {
    return {
      infoDialogVisible: false,
      editFormVisible: false,
      createFamilyVisible: false,
      joinFamilyVisible: false,
      editForm: {
        id: '',
        tissueName: '',
        tissueDescription: '',
        tissueCode: '',
      },
      editFormRules: {
        tissueName: [
          {required: true, message: '家庭名称不能为空', trigger: 'blur'}
        ],
      },
      searchForm: {},
      familyUserTable: [],
      familyUserForm: {},
      familyTable: [],
      familyUserFormVisible: false,
      familyUserVisible:false,
      currentRow: '',
    }
  },
  created() {
    this.queryFamily()
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
    handleCreateFamily() {
      this.createFamilyVisible = true
      this.infoDialogVisible = false
    },
    handleCloseJoin(){
      this.joinFamilyVisible = false
      this.infoDialogVisible = true
      this.resetForm('searchForm')
    },
    handleJoinFamily() {
      this.joinFamilyVisible = true
      this.infoDialogVisible = false
      this.queryFamilyList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.infoDialogVisible = false
      this.editFormVisible = false
      this.joinFamilyVisible = false
      this.familyUserFormVisible = false
    },
    // 家庭信息查询
    queryFamily() {
      queryFamily().then(res => {
        this.editForm = res.data.data
        if (!this.editForm.id) {
          this.infoDialogVisible = true
        } else {
          queryFamilyUser(this.editForm.id).then(res => {
            this.familyUserTable = res.data.data
          })
        }
      })
    },
    // 解散家庭
    deleteFamily(id) {
      deleteFamily(id).then(res => {
        this.$modal.msgSuccess(res.data.data.message)
        this.queryFamily();
      })
    },
    // 家庭创建/更新
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.editForm.id) {
                updateFamily(this.editForm).then(res => {
                  this.$modal.msgSuccess(res.data.message)
                  this.queryFamily()
                })
              } else {
                createFamily(this.editForm).then(res => {
                  this.$modal.msgSuccess(res.data.message)
                  this.queryFamily()
                })
              }
              this.createFamilyVisible = false
            } else {
              return false
            }
          }
      )
    },
    // 删除家庭成员
    deleteFamilyUser(row) {
      deleteFamilyUser(row.id).then(res => {
        this.$modal.msgSuccess(res.data.data.message)
        queryFamilyUser(row.tissueId).then(res => {
          this.familyUserTable = res.data.data
        })
      })
    },
    // 编辑成员昵称窗口
    editFamilyUser(row) {
      this.familyUserForm = row
      this.familyUserFormVisible = true
    },
    // 更新成员昵称
    updateFamilyUser() {
      updateFamilyUser(this.familyUserForm).then(res => {
        this.$modal.msgSuccess(res.data.data.message)
        this.familyUserFormVisible = false
        queryFamilyUser(this.familyUserForm.tissueId).then(res => {
          this.familyUserTable = res.data.data
        })
      })
    },
    // 家庭列表选取
    queryFamilyList() {
      queryFamilyList(this.searchForm).then(res=>{
        this.familyTable = res.data.data.records
      })
    },
    // 表格选取
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 提交申请
    joinFamily(){
      if (!this.currentRow){
        this.$modal.alertWarning("未选择家庭，请重试")
      }

    },
    // 新增家庭成员
    addFamilyUser(){
      this.familyUserVisible = true

    }
  }
}
</script>

<style scoped>
.item {
  margin: 4px;
}
</style>
