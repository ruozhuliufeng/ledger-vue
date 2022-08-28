<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-plus"
            @click="dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        style="width:100%;margin-bottom: 20px"
        row-key="id"
        border
        stripe
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="name"
          label="名称"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="alias"
          label="别名"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="source"
          label="图标">
      </el-table-column>
      <el-table-column
          prop="category"
          label="类型">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.category === 1">菜单</el-tag>
          <el-tag size="small" v-else-if="scope.row.category === 2">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="path"
          label="菜单URL"></el-table-column>
      <el-table-column
          prop="component"
          label="菜单组件">
      </el-table-column>
      <el-table-column
          prop="sort"
          label="排序">
      </el-table-column>
      <el-table-column
          prop="isDeleted"
          label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.isDeleted === 0">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.isDeleted === 1">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="icon"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm title="确定要删除吗？" @confirm="delHandle(scop.row.id)">
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增编辑对话框 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClos">
      <el-form ref="editForm" :model="editForm" label-width="100px" class="demo-editForm">
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
            <template v-for="item in tableData">
              <el-option :label="item.name" :value="item.id"></el-option>
              <template v-for="child in item.children">
                <el-option :lable="child.name" :value="child.id">
                  <span>{{ "- " + child.name }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="权限编码" prop="code" label-width="100px">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单别名" prop="alias" label-width="100px">
          <el-input v-model="editForm.alias" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="source" label-width="100px">
          <el-input v-model="editForm.source" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单URL" prop="path" label-width="100px">
          <el-input v-model="editForm.path" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单组件" prop="component" label-width="100px">
          <el-input v-model="editForm.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="category" label-width="100px">
          <el-radio-group v-model="editForm.category">
            <el-radio :label=0>菜单</el-radio>
            <el-radio :label=1>按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新窗口" prop="isOpen" label-width="100px">
          <el-radio-group v-model="editForm.isOpen">
            <el-radio :label=0>否</el-radio>
            <el-radio :label=1>是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort" label-width="100px">
          <el-input v-model="editForm.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getMenuTree, saveMenu, updateMenu, queryMenuInfo, deleteMenu} from "@/api/system";

export default {
  name: "Menu",
  data() {
    return {
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        parentId: [
          {required: true, message: '请选择上级菜单', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入权限编码', trigger: 'blur'}
        ],
        category: [
          {required: true, message: '请选择菜单类型', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', trigger: 'blur'}
        ],
        isOpen: [
          {required: true, message: '请选择是否打开新页面', trigger: 'blur'}
        ],
      },
      tableData: []
    }
  },
  created() {
    this.getMenuTree()
  },
  methods: {
    getMenuTree() {
      getMenuTree().then(res => {
        this.tableData = res.data.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.editForm.id) {
                updateMenu(this.editForm).then(res => {
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
                saveMenu(this.editForm).then(res => {
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
    },
    editHandle(id) {
      queryMenuInfo(id).then(res => {
        this.editForm = res.data.data

        this.dialogVisible = true
      })
    } ,
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editForm = {}
    }
    ,
    handleClos() {
      this.resetForm('editForm')
    }
    ,
    delHandle(id) {
      deleteMenu(id).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success',
          onclose: () => {
            this.getMenuTree()
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
