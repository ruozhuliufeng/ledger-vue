<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.dictCode"
                  placeholder="字典编码"
                  clearable/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.dictName"
                  placeholder="字典名称"
                  clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDictList(0)">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addDict">新增</el-button>
      </el-form-item>
    </el-form>
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
          prop="code"
          label="字典码"
          width="120"/>
      <el-table-column
          prop="dictValue"
          label="字典名称"
          width="150"/>
      <el-table-column
          prop="remark"
          label="字典备注"/>
      <el-table-column
          prop="isSealed"
          label="是否封存">
        <template v-slot="scope">
          <el-tag size="small" v-if="scope.row.isSealed===0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.isSealed===1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="isDeleted"
          label="是否删除">
        <template v-slot="scope">
          <el-tag size="small" v-if="scope.row.isDeleted===0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.isDeleted===1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="icon"
          width="250px"
          label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"/>
          <template>
            <el-popconfirm title="确定删除吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
          <el-divider direction="vertical"/>
          <el-button type="text" @click="viewHandle(scope.row.id)">字典配置</el-button>
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
    <!-- 新增数据字典对话框 -->
    <el-dialog
        title="字典信息"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="字典码" prop="code" label-width="100px" v-if="!editForm.code">
          <el-input v-model="editForm.code" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="字典键值" prop="dictKey" label-width="100px" v-if="editForm.parentId">
          <el-input v-model="editForm.dictKey" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictValue" label-width="100px">
          <el-input v-model="editForm.dictValue" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="字典备注" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort" label-width="100px">
          <el-input-number v-model="editForm.sort" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="是否封存" prop="isSealed" label-width="100px">
          <el-radio-group v-model="editForm.isSealed">
            <el-radio :label=0>正常</el-radio>
            <el-radio :label=1>禁用</el-radio>
          </el-radio-group>
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

    <!-- 字典配置项 -->
    <el-dialog
        title="字典项信息"
        :visible.sync="dictDialogFormVisible"
        width="600px"
        :before-close="handleDictClose">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.dictCode"
                    placeholder="字典编码"
                    clearable/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.dictName"
                    placeholder="字典名称"
                    clearable/>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDictList">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDictItem">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
          ref="multipleTable"
          :data="dictTableData"
          tooltip-effect="dark"
          style="width:100%;height: 80%"
          border
          stripe
          @selection-change="handleSelecionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column
            prop="code"
            label="字典码"
            width="120"/>
        <el-table-column
            prop="dictKey"
            label="字典键值"
            width="150"/>
        <el-table-column
            prop="dictValue"
            label="字典名称"
            width="150"/>
        <el-table-column
            prop="remark"
            label="字典备注"/>
        <el-table-column
            prop="isSealed"
            label="是否封存">
          <template v-slot="scope">
            <el-tag size="small" v-if="scope.row.isSealed===0" type="success">正常</el-tag>
            <el-tag size="small" v-else-if="scope.row.isSealed===1" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="isDeleted"
            label="是否删除">
          <template v-slot="scope">
            <el-tag size="small" v-if="scope.row.isDeleted===0" type="success">正常</el-tag>
            <el-tag size="small" v-else-if="scope.row.isDeleted===1" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="icon"
            width="250px"
            label="操作">
          <template v-slot="scope">
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
    </el-dialog>
  </div>
</template>

<script>
import {
  queryDictList, queryDict, saveDict, updateDict, deleteDict
} from "@/api/system";

export default {
  name: "Dict",
  data() {
    return {
      searchForm: {},
      delBelStatu: true,
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {
        parentId: '',
        id: '',
        code: '',
        dictKey: '',
        dictValue: '',
        remark: '',
        isSealed: 0,
        isDeleted: 0
      },
      tableData: [],
      editFormRules: {
        code: [
          {required: true, message: '请输入字典编码', trigger: 'blur'}
        ],
        dictValue: [
          {required: true, message: '请输入字典名称', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      dictDialogFormVisible: false,
      dictTableData: [],
      checkStrictly: true,
      dictParentId: 0
    }
  },
  created() {
    this.getDictList(0)
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
      this.getDictList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getDictList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
    },
    handleDictClose() {
      this.dictDialogFormVisible = false
    },
    getDictList(parentId) {
      var params = {
        dictCode: this.searchForm.dictCode,
        dictName: this.searchForm.dictName,
        current: this.current,
        size: this.size
      }
      if (parentId === null && this.dictParentId) {
        parentId = this.dictParentId
      } else if (parentId === null && !this.dictParentId) {
        parentId = 0
      }
      queryDictList(parentId, params).then(res => {
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.editForm.id) {
                updateDict(this.editForm).then(res => {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success',
                    onclose: () => {
                      this.getDictList()
                    }
                  })
                })
              } else {
                saveDict(this.editForm).then(res => {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success',
                    onclose: () => {
                      this.getDictList()
                    }
                  })
                })
              }
              this.dialogVisible = false
            } else {
              return false
            }
          }
      )
    },
    editHandle(id) {
      queryDict(id).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    viewHandle(id) {
      var params = {
        current: this.current,
        size: this.size
      }
      queryDictList(id, params).then(res => {
        this.dictTableData = res.data.data.records
        this.dictParentId = id;
        this.dictDialogFormVisible = true
      })
    },
    delHandle(id) {
      deleteDict(id).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success',
          onclose: () => {
            this.getDictList()
          }
        })
      })
    },
    addDict() {
      this.dialogVisible = true
      this.dictParentId = 0
      this.editForm.parentId = 0
      this.editForm.dictKey = -1
    },
    addDictItem() {
      queryDict(this.dictParentId).then(res => {
        this.editForm.parentId = res.data.data.id
        this.editForm.code = res.data.data.code
        this.dialogVisible = true
      })
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
