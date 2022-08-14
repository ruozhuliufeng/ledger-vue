<template>
  <div>
    <el-form :inline="true" :model="searchForm" ref="searchForm" size="small" v-show="showSearch">
      <el-form-item label="交易单号" prop="name">
        <el-input v-model="searchForm.name"
                  placeholder="请输入交易单号"
                  clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getRecordList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="simpleRecord">
          简单记一笔
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="record">
          记一笔
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="uploadFormVisible = true">
          导入微信/支付宝账单
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   @click="delHandle">
          批量删除
        </el-button>
      </el-col>
<!--      <right-tool-bar :show-search.sync="showSearch" @queryTable="getRecordList"></right-tool-bar>-->
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
          prop="transactionTime"
          label="交易时间"
          width="120">
        <template v-slot="scope">
          {{ formatterTime(scope.row.transactionTime) }}
        </template>
      </el-table-column>
      <el-table-column
          prop="transactionSn"
          label="交易单号"/>
      <el-table-column
          prop="merchantOrderSn"
          label="商品单号"/>
      <el-table-column
          prop="transactionCategory"
          label="交易分类"/>
      <el-table-column
          prop="counterpartyName"
          label="交易对方"/>
      <el-table-column
          prop="counterpartyAccount"
          label="交易对方账户"/>
      <el-table-column
          prop="productName"
          label="商品名称"/>
      <el-table-column
          prop="transactionType"
          label="交易类型">
        <template v-slot="scope">
          <el-tag size="small" v-if="scope.row.transactionType===0" type="success">收入</el-tag>
          <el-tag size="small" v-else-if="scope.row.transactionType===1" type="danger">支出</el-tag>
          <el-tag size="small" v-else type="primary">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="paymentMethod"
          label="支付方式"/>
      <el-table-column
          prop="amount"
          label="交易金额"/>
      <el-table-column
          prop="currentStatus"
          label="当前状态"/>
      <el-table-column
          prop="remark"
          label="交易描述"/>
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

    <!-- 交易记录对话框 -->
    <el-dialog
        title="交易记录信息"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules">
        <el-form-item label="交易时间" prop="transactionTime" label-width="100px">
          <el-date-picker
              v-model="editForm.transactionTime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易类型" prop="transactionType" label-width="100px">
          <el-radio-group v-model="editForm.transactionType">
            <el-radio :label=0>收入</el-radio>
            <el-radio :label=1>支出</el-radio>
            <el-radio :label=2>其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="交易分类" prop="transactionCategory">
          <el-select
              v-model="editForm.transactionCategory"
              filterable
              allow-create
              default-first-option
              placeholder="请输入或选择交易分类">
            <template v-for="item in categoryData">
              <el-option :label="item" :value="item"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName" label-width="100px">
          <el-input v-model="editForm.productName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="交易金额" prop="amount" label-width="100px">
          <el-input v-model="editForm.amount" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="交易描述" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="交易对方" prop="counterpartyName" label-width="100px" v-if="isSimpleRecord === 1">
          <el-input v-model="editForm.counterpartyName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="交易对方账户" prop="counterpartyAccount" label-width="100px" v-if="isSimpleRecord === 1">
          <el-input v-model="editForm.counterpartyAccount" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="商品单号" prop="merchantOrderSn" label-width="100px" v-if="isSimpleRecord === 1">
          <el-input v-model="editForm.merchantOrderSn" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="交易单号" prop="transactionSn" label-width="100px" v-if="isSimpleRecord === 1">
          <el-input v-model="editForm.transactionSn" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确定</el-button>
        <el-button @click="resetForm('editForm')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 上传对话框 -->
    <el-dialog
        title="支付宝/微信账单文件导入"
        :visible.sync="uploadFormVisible"
        width="600px"
        :before-close="handleClose">
      <el-upload
          ref="uploadForm"
          class="upload-demo"
          :multiple="false"
          :show-file-list="true"
          :headers="uploadForm.headers"
          accept='.csv,.zip'
          :action="uploadForm.uploadUrl + '?password='+uploadForm.password"
          :disabled="uploadForm.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :file-list="fileList"
          :auto-upload="false">
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            压缩包解压密码:
            <el-input v-model="uploadForm.password" autocomplete="off"/>
          </div>
          <span>只能上传csv/zip文件，上传压缩文件请输入解压密码</span>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUploadForm()">确定</el-button>
        <el-button @click="resetForm('uploadForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryRecordList,
  queryRecord,
  saveRecord,
  updateRecord,
  deleteRecordList,
  importThirdRecordList,
  queryRecordCategoryList
} from "@/api/record";
import moment from "moment";

export default {
  name: "Record",
  data() {
    return {
      searchForm: {},
      delBelStatu: true,
      total: 0,
      size: 10,
      ids: [],
      current: 1,
      dialogVisible: false,
      editForm: {},
      tableData: [],
      categoryData: [],
      isSimpleRecord: 0,
      showSearch: true,
      editFormRules: {
        transactionType: [
          {required: true, message: '请选择交易类型', trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '请输入交易金额', trigger: 'blur'}
        ]
      },
      multipleSelection: [],
      uploadFormVisible: false,
      uploadForm: {
        files: [],
        uploadUrl: '/api/record/import/third/record',
        password: '',
        headers: {Authorization: localStorage.getItem("token")},
        isUploading: false
      },
      fileList: []
    }
  },
  created() {
    this.getRecordList()
    this.getRecordCategoryList()
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
      this.ids = val.map(item => item.id)
      this.delBelStatu = val.length === 0
    },
    handleSizeChange(val) {
      this.size = val
      this.getRecordList()
    },
    handleCurrentChange(val) {
      this.current = val
      console.log("当前页：" + val)
      this.getRecordList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.uploadFormVisible = false
      this.uploadForm = {}
      this.editForm = {}
    },
    handleClose() {
      this.resetForm('editForm')
      this.resetForm('uploadForm')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploadForm.isUploading = true;
    },
    resetQuery() {
      this.resetForm('searchForm')
      this.getRecordList()
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.uploadFormVisible = false;
      this.uploadForm.isUploading = false;
      this.$refs.uploadForm.clearFiles();
      this.getRecordList();
    },
    getRecordCategoryList() {
      queryRecordCategoryList().then(res => {
        this.categoryData = res.data.data
      })
    },
    getRecordList() {
      var params = {
        name: this.searchForm.name,
        current: this.current,
        size: this.size
      }
      queryRecordList(params).then(res => {
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
                updateRecord(this.editForm).then(res => {
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
                saveRecord(this.editForm).then(res => {
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
            this.getRecordList()
          }
      )
    },
    editHandle(id) {
      queryRecord(id).then(res => {
        this.editForm = res.data.data
        this.isSimpleRecord = 1
        this.dialogVisible = true
      })
    },
    delHandle(id) {
      if (id) {
        this.ids.push(id)
      }
      deleteRecordList(this.ids).then(res => {
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
    formatterTime(value) {
      return moment(value).format('YYYY-MM-DD');
    },
    simpleRecord() {
      this.dialogVisible = true
      this.isSimpleRecord = 0
    },
    record() {
      this.dialogVisible = true
      this.isSimpleRecord = 1
    },
    onChange(a, fileList) {
      this.uploadForm.files = fileList
    },
    submitUploadForm() {
      this.$refs.uploadForm.submit()
      // const params = new FormData();
      // const uploadFiles = [];
      // if (!this.uploadForm.files) {
      //   this.$message({
      //     showClose: true,
      //     message: "请先选择[浏览文件]后点击上传"
      //   })
      // }
      // this.uploadForm.files.forEach(item => {
      //   uploadFiles.push(item.raw)
      // })
      // params.append("password", this.uploadForm.password)
      // params.append("file", uploadFiles)
      // importThirdRecordList(params).then(res => {
      //   this.$message({
      //     showClose: true,
      //     message: res.data.message,
      //     type: 'success',
      //     onclose: () => {
      //       this.getRecordList()
      //     }
      //   })
      //   this.uploadFormVisible = false
      //   this.resetForm('uploadForm')
      //   this.getRecordList()
      // })
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
