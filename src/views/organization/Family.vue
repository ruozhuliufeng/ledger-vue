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
        <el-form-item label="初始金额" prop="initialAmount" label-width="100px">
          <el-input v-model="editForm.initialAmount" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">确定</el-button>
        <el-button @click="resetForm('editForm')">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="familyUserFormVisible"
        title="编辑家庭成员信息"
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
        <!-- TODO 设置权限，仅有权限的人员可设置加入时间，暂时开放 -->
        <el-form-item label="加入时间" prop="joinTime" label-width="100px">
          <el-date-picker
              v-model="familyUserForm.joinTime"
              type="datetime"
              placeholder="成员加入时间">
          </el-date-picker>
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
      <el-form ref="searchForm" :inline="true" size="mini" :model="searchForm">
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
      <el-button style="float: right; padding: 5px 0" type="success" @click="joinFamily">申请加入</el-button>
    </el-dialog>
    <el-dialog
        :visible.sync="familyUserVisible"
        title="邀请人员加入"
        width="30%"
        :before-close="handleCloseInvite"
    >
      <el-form ref="searchForm" :inline="true" size="mini" :model="searchForm">
        <el-form-item label="手机号" prop="phone" label-width="60px">
          <el-input v-model="searchForm.phone" autocomplete="off"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryUserPhone">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-descriptions class="margin-top" title="人员信息" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ inviteFamilyUser.nickName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ inviteFamilyUser.phone }}
        </el-descriptions-item>
      </el-descriptions>
      <el-button style="float: right; padding: 5px 0" type="success" @click="inviteFamily">邀请加入</el-button>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="10" :xs="24">
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
            height="200"
            stripe
            border
            size="medium"
        >
          <el-table-column
              prop="realName"
              label="姓名"
              width="70"/>
          <el-table-column
              prop="phone"
              label="手机号"
              width="120"/>
          <el-table-column
              prop="nickName"
              label="昵称"
              width="90"/>
          <el-table-column
              prop="joinTime"
              label="加入时间"
              type="date"
              width="100">
            <template v-slot="scope">
              {{ formatterTime(scope.row.joinTime) }}
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作">
            <template v-slot="scope">
              <el-button type="primary" size="mini" @click="editFamilyUser(scope.row)">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button type="danger" size="mini" @click="deleteFamilyUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- TODO 循环展示设定目标 -->

        <!-- 底部展示家庭累计收入与支出，累计金额等信息 -->
        <el-descriptions class="total_bottom" :column="2" border size="small">
          <el-descriptions-item label="初始金额" :labelStyle="{'background':'#E1F3D8'}"
                                :contentStyle="{'background':'#FDE2E2'}">{{ this.editForm.initialAmount }}
          </el-descriptions-item>
          <el-descriptions-item label="累计收入金额" :labelStyle="{'background':'#E1F3D8'}"
                                :contentStyle="{'background':'#FDE2E2'}">{{ familyTotalPrice.totalIncomePrice }}
          </el-descriptions-item>
          <el-descriptions-item label="累计支出金额" :labelStyle="{'background':'#E1F3D8'}"
                                :contentStyle="{'background':'#FDE2E2'}">{{ familyTotalPrice.totalExpendPrice }}
          </el-descriptions-item>
          <el-descriptions-item label="累计金额" :labelStyle="{'background':'#E1F3D8'}"
                                :contentStyle="{'background':'#FDE2E2'}">{{ familyTotalPrice.totalPrice }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="14" :xs="24">
        <el-form :inline="true" :model="recordSearchForm" ref="recordSearchForm" size="small">
          <el-form-item label="家庭成员" prop="userIdList">
            <el-select
                v-model="recordSearchForm.userIdList"
                filterable
                allow-create
                multiple
                disabled
                style="margin-left: 20px"
                collapse-tags
                default-first-option
                placeholder="请选择家庭成员">
              <template v-for="item in categoryData">
                <el-option :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="交易分类" prop="transactionCategoryList">
            <el-select
                v-model="recordSearchForm.transactionCategoryList"
                filterable
                multiple
                style="margin-left: 20px"
                collapse-tags
                default-first-option
                placeholder="请输入或选择交易分类">
              <template v-for="item in categoryData">
                <el-option :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="交易类型" prop="transactionType">
            <el-select
                v-model="recordSearchForm.transactionType"
                filterable
                style="margin-left: 20px"
                collapse-tags
                default-first-option
                placeholder="请输选择交易类型">
              <el-option label="收入" value=0></el-option>
              <el-option label="支出" value=1></el-option>
              <el-option label="其他" value=2></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易时间" prop="selectDate">
            <div class="block">
              <el-date-picker
                  v-model="recordSearchForm.selectDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  style="width: 300px"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="queryFamilyRecordList()">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="familyRecordTable"
            tooltip-effect="dark"
            style="width:100%"
            height="400"
            border
            stripe
        >
          <el-table-column
              prop="userName"
              label="家庭成员"
              width="120"/>
          <el-table-column
              prop="transactionTime"
              type="date"
              label="交易时间">
            <template v-slot="scope">
              {{ formatterTime(scope.row.transactionTime) }}
            </template>
          </el-table-column>
          <el-table-column
              prop="productName"
              label="商品名称"/>
          <el-table-column
              prop="transactionType"
              label="交易类型">
            <template v-slot="scope">
              <el-tag size="small" v-if="scope.row.transactionType===0" type="success">收入</el-tag>
              <el-tag size="small" v-if="scope.row.transactionType===1" type="danger">支出</el-tag>
              <el-tag size="small" v-else-if="scope.row.transactionType===2" type="text">其他</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="amount"
              label="交易金额"/>
          <el-table-column
              prop="transactionCategory"
              label="交易分类"/>
          <el-table-column
              prop="remark"
              label="交易描述"/>
        </el-table>
        <el-pagination
            @size-change="handleRecordSizeChange"
            @current-change="handleRecordCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            :current-page="current"
            :page-size="size"
        />
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
  queryFamilyUser,
  queryFamilyRecord,
  applyJoinFamily,
  inviteJoinFamily,
  queryFamilyTotal
} from "@/api/tissue";
import moment from "moment";
import {queryRecordCategoryList} from "@/api/record";
import {queryUserPhone} from "@/api/system";

export default {
  name: "Family",
  data() {
    return {
      infoDialogVisible: false,
      editFormVisible: false,
      createFamilyVisible: false,
      joinFamilyVisible: false,
      total: 0,
      size: 10,
      current: 1,
      editForm: {
        id: '',
        tissueName: '',
        tissueDescription: '',
        tissueCode: '',
        initialAmount: '',
      },
      editFormRules: {
        tissueName: [
          {required: true, message: '家庭名称不能为空', trigger: 'blur'}
        ],
      },
      searchForm: {},
      recordSearchForm: {},
      familyRecordTable: [],
      categoryData: [],
      familyUserTable: [],
      inviteFamilyUser: {},
      familyUserForm: {},
      familyTable: [],
      familyUserFormVisible: false,
      familyUserVisible: false,
      currentRow: {},
      familyTotalPrice:{},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    this.queryFamily()
    this.getRecordCategoryList()
    this.showMessage()
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
    handleCloseJoin() {
      this.joinFamilyVisible = false
      this.infoDialogVisible = true
      this.resetForm('searchForm')
    },
    handleCloseInvite() {
      this.familyUserVisible = false
      this.inviteFamilyUser = {}
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
    handleRecordSizeChange(val) {
      this.size = val
      this.queryFamilyRecordList(this.editForm.id)
    },
    handleRecordCurrentChange(val) {
      this.current = val
      this.queryFamilyRecordList(this.editForm.id)
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
          this.queryFamilyRecordList()
          this.queryFamilyTotalAmount()
        }
      })
    },
    // 查询家庭汇总数据
    queryFamilyTotalAmount(){
      queryFamilyTotal(this.editForm.id).then(res=>{
        this.familyTotalPrice = res.data.data
      })
    },
    // 解散家庭
    deleteFamily(id) {
      deleteFamily(id).then(res => {
        this.$modal.msgSuccess(res.data.data.message)
        this.queryFamily();
      })
      this.queryFamilyTotalAmount()
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
        this.queryFamilyTotalAmount()
      })
    },
    // 家庭列表选取
    queryFamilyList() {
      queryFamilyList(this.searchForm).then(res => {
        this.familyTable = res.data.data.records
      })
    },
    // 表格选取
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 提交申请
    joinFamily() {
      if (!this.currentRow.id) {
        this.$modal.alertWarning("未选择家庭，请重试")
      } else {
        applyJoinFamily(this.currentRow.id).then(res => {
          this.$modal.msgSuccess(res.data.message)
        })
      }
    },
    // 新增家庭成员
    addFamilyUser() {
      this.familyUserVisible = true
      this.$modal.notifyWarning("注意:请核实人员昵称与手机号码是否一致后再邀请")
    },
    // 家庭收支记录
    queryFamilyRecordList() {
      if (this.recordSearchForm.selectDate) {
        this.recordSearchForm.transactionStartTime = this.recordSearchForm.selectDate[0]
        this.recordSearchForm.transactionEndTime = this.recordSearchForm.selectDate[1]
      }
      const queryParams = {
        ...this.recordSearchForm,
        tissueId: this.editForm.id,
        current: this.current,
        size: this.size
      }
      queryFamilyRecord(queryParams).then(res => {
        this.familyRecordTable = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    formatterTime(value) {
      return moment(value).format('YYYY-MM-DD');
    },
    // 交易分类记录
    getRecordCategoryList() {
      queryRecordCategoryList().then(res => {
        this.categoryData = res.data.data
      })
    },
    // 根据手机号查询人员
    queryUserPhone() {
      const queryParams = {
        phone: this.searchForm.phone
      }
      queryUserPhone(queryParams).then(res => {
        this.inviteFamilyUser = res.data.data
      })
    },
    // 邀请人员
    inviteFamily() {
      if (!this.inviteFamilyUser.id) {
        this.$modal.msgError("请先查询人员信息")
      } else {
        inviteJoinFamily(this.inviteFamilyUser.id).then(res => {
          this.$modal.msgSuccess(res.data.message)
        })
      }
    },
    // 提示信息
    showMessage() {
      this.$modal.notify("悉知:成员交易记录仅展示加入家庭后的记录")
    }
  }
}
</script>

<style scoped>
.item {
  margin: 4px;
}

.total_bottom {
  position: fixed;
  bottom: 70px;
}

.my-label {
  background: #E1F3D8;
}

.my-content {
  background: #FDE2E2;
}
</style>
