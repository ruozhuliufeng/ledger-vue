<template>
  <div>
    <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" v-show="showSearch">
      <el-form-item>
        <el-input v-model="searchForm.username"
                  placeholder="账号"
                  clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="getUserList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="dialogVisible=true">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="delHandle">
          批量删除
        </el-button>
      </el-col>
    </el-row>
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%"
        border
        stripe
        @selection-change="handleSelecionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column
          label="头像"
          width="50"
      >
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"/>
        </template>
      </el-table-column>
      <el-table-column
          prop="account"
          label="账户名"
          width="120"/>
      <el-table-column
          prop="code"
          label="角色名称">
        <template slot-scope="scope">
          <el-tag size="small" type="info" v-for="(item,index) in scope.row.roles" :key="index">
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"/>
      <el-table-column
          prop="phone"
          label="手机号"/>
      <el-table-column
          prop="isDeleted"
          label="状态">
        <template v-slot="scope">
          <el-tag size="small" v-if="scope.row.isDeleted===0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.isDeleted===1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="createTime"
          type="date"
          label="创建时间">
        <template v-slot="scope">
          {{formatterTime(scope.row.createTime)}}
        </template>
      </el-table-column>
      <el-table-column
          prop="icon"
          width="250px"
          label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="roleHandle(scope.row.id)">分配角色</el-button>
          <el-divider direction="vertical"/>
          <el-button type="text" @click="repassHandle(scope.row.id)">重置密码</el-button>
          <el-divider direction="vertical"/>
          <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"/>
          <template>
            <el-popconfirm title="确定删除吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        :current-page="current"
        :page-size="size"
    />

    <!-- 新增用户对话框 -->
    <el-dialog
        title="用户信息"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="用户名" prop="account" label-width="100px">
          <el-input v-model="editForm.account" autocomplete="off"/>
          <el-alert
              title="初始密码为123654"
              :closable="false"
              type="info"
              style="line-height: 12px;"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName" label-width="100px">
          <el-input v-model="editForm.nickName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" label-width="100px">
          <el-input v-model="editForm.phone" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="状态" prop="isDeleted" label-width="100px">
          <el-radio-group v-model="editForm.isDeleted">
            <el-radio :label=0>正常</el-radio>
            <el-radio :label=1>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确定</el-button>
        <el-button @click="resetForm('editForm')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
        title="分配角色"
        :visible.sync="roleDialogFormVisible"
        width="600px">
      <el-form :model="roleForm">
        <el-tree
            :data="roleTreeData"
            show-checkbox
            ref="roleTree"
            :check-strictly=true
            node-key="id"
            :default-expand-all=true
            :props="defaultProps"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRoleHandle('roleName')">确定</el-button>
        <el-button @click="roleDialogFormVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryUserList,
  queryRoleList,
  queryUser,
  saveUser,
  updateUser,
  repassUser,
  deleteUserList,
  grantUserRole
} from "@/api/system";
import moment from "moment";

export default {
  name: "User",
  data() {
    return {
      searchForm: {},
      delBelStatu: true,
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {},
      tableData: [],
      editFormRules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      roleDialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'roleName'
      },
      showSearch:false,
      roleForm: {},
      roleTreeData: [],
      treeCheckedKeys: [],
      checkStrictly: true
    }
  },
  created() {
    this.getUserList()
    this.getRoleList()
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelecionChange(val) {
      this.multipleSelection = val
      this.delBelStatu = val.length === 0
    },
    handleSizeChange(val) {
      this.size = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getUserList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
    },
    getUserList() {
      var params = {
        username: this.searchForm.username,
        current: this.current,
        size: this.size
      }
      queryUserList(params).then(res => {
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    getRoleList() {
      queryRoleList().then(res => {
        this.roleTreeData = res.data.data.records
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.editForm.id) {
                updateUser(this.editForm).then(res => {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success',
                    onclose: () => {
                      this.getMenuTree()
                    }
                  })
                })
              } else {
                saveUser(this.editForm).then(res => {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success',
                    onclose: () => {
                      this.getMenuTree()
                    }
                  })
                })
                this.dialogVisible = false
              }
            } else {
              return false
            }
          }
      )
      this.getUserList()
    },
    editHandle(id) {
      queryUser(id).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    delHandle(id) {
      var ids = []
      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
        })
      }
      deleteUserList(ids).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success',
          onclose: () => {
            this.getUserList()
          }
        })
      })
    },
    roleHandle(id) {
      this.roleDialogFormVisible = true
      queryUser(id).then(res => {
        this.roleForm = res.data.data
        let roleIds = []
        this.data.data.roles.forEach(row => {
          roleIds.push(row.id)
        })
        this.$refs.roleTree.setCheckedKeys(roleIds)
      })
    },
    submitRoleHandle(formName) {
      const selectIds = this.$refs.roleTree.getCheckedKeys()
      const params = {
        roleIds: selectIds
      };
      grantUserRole(this.roleForm.id, params).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success',
          onclose: () => {
            this.getUserList()
          }
        })
        this.roleDialogFormVisible = false
      })
      this.getUserList()
    },
    repassHandle(id, account) {
      this.$confirm('将重置用户【' + account + '】的密码，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        repassUser(id).then(res => {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success',
            onclose: () => {
              this.getUserList()
            }
          })
        })
      })
      this.getUserList()
    },
    formatterTime(value){
      return moment(value).format('YYYY-MM-DD');
    }
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>
