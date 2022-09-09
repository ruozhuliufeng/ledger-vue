<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item label="角色名称">
        <el-input v-model="searchForm.name"
                  placeholder="角色名称"
                  clearable/>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-search"
            @click="getRoleList">搜索
        </el-button>
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
          prop="roleName"
          label="角色名称"
          width="120"/>
      <el-table-column
          prop="roleCode"
          label="角色编码"/>
      <el-table-column
          prop="remark"
          label="备注"/>
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
          {{ formatterTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
          prop="icon"
          width="250px"
          label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="menuHandle(scope.row.id)">分配权限</el-button>
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

    <!-- 角色对话框 -->
    <el-dialog
        title="角色信息"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input v-model="editForm.roleName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="唯一编码" prop="roleCode" label-width="100px">
          <el-input v-model="editForm.roleCode" autocomplete="off"/>
        </el-form-item>
<!--        <el-form-item label="备注" prop="remark" label-width="100px">-->
<!--          <el-input v-model="editForm.remark" autocomplete="off"/>-->
<!--        </el-form-item>-->
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
        title="分配权限"
        :visible.sync="menuDialogFormVisible"
        width="600px">
      <el-form :model="menuForm">
        <el-tree
            :data="menuTreeData"
            show-checkbox
            ref="menuForm"
            :check-strictly=true
            node-key="id"
            :default-expand-all=true
            :props="defaultProps"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMenuHandle('roleName')">确定</el-button>
        <el-button @click="menuDialogFormVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryRole,
  queryRoleList,
  updateRole,
  saveRole,
  getMenuTree,
  grantRoleMenu,
  deleteRoleList
} from "@/api/system";
import moment from "moment";

export default {
  name: "Role",
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
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入唯一编码', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      menuDialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuForm: {},
      menuTreeData: [],
    }
  },
  created() {
    this.getRoleList()
    this.getMenuList()
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
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getRoleList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
      this.getRoleList()
    },
    getRoleList() {
      var params = {
        name: this.searchForm.name,
        current: this.current,
        size: this.size
      }
      queryRoleList(params).then(res => {
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    getMenuList() {
      getMenuTree().then(res => {
        this.menuTreeData = res.data.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.editForm.id) {
                updateRole(this.editForm).then(res => {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success',
                    onclose: () => {
                    }
                  })
                })
              } else {
                saveRole(this.editForm).then(res => {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success',
                    onclose: () => {
                    }
                  })
                })
              }
            } else {
              return false
            }
          }
      )
      this.dialogVisible = false
      this.getRoleList()
    },
    editHandle(id) {
      queryRole(id).then(res => {
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
      deleteRoleList(ids).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success',
          onclose: () => {
            this.getRoleList()
          }
        })
      })
    },
    menuHandle(id) {
      this.menuDialogFormVisible = true
      queryRole(id).then(res => {
        this.roleForm = res.data.data
        this.$refs.menuForm.setCheckedKeys(res.data.data.menuIds)
      })
    },
    submitMenuHandle(formName) {
      const selectIds = this.$refs.menuForm.getCheckedKeys();
      const params = {
        menuIds: selectIds
      }
      grantRoleMenu(this.roleForm.id, params).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success',
          onclose: () => {
            this.getUserList()
          }
        })
        this.menuDialogFormVisible = false
        this.resetForm(formName)
        this.getRoleList()
      })
    },
    formatterTime(value) {
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
