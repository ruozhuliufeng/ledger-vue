<template>
  <dv-border-box-3>
    <el-row id="report" :gutter="20">
      <el-col :span="8">
        <dv-border-box-8>
          <label style="text-align: center">支出占比</label>
          <dv-active-ring-chart :config="expenseRatio" style="width:400px;height:300px"/>
        </dv-border-box-8>
      </el-col>
      <el-col :span="8">
        <dv-border-box-3>
          <label style="text-align: center">最近收入</label>
          <dv-scroll-ranking-board :config="recentIncome" style="width:400px;height:300px"/>
        </dv-border-box-3>
      </el-col>
      <el-col :span="8">
        <dv-border-box-4>
          <label style="text-align: center">最近支出</label>
          <dv-scroll-ranking-board :config="recentExpense" style="width:400px;height:300px"/>
        </dv-border-box-4>
      </el-col>
    </el-row>
    <el-row id="report" :gutter="20">
      <el-col :span="8">
        <dv-border-box-8>
          <label style="text-align: center">收入占比</label>
          <dv-active-ring-chart :config="incomeRatio" style="width:400px;height:300px"/>
        </dv-border-box-8>
      </el-col>
      <el-col :span="8">
        <dv-border-box-8>
          <label style="text-align: center">其他占比</label>
          <dv-capsule-chart :config="otherRatio" style="width:400px;height:300px"/>
        </dv-border-box-8>
      </el-col>
      <el-col :span="8">
        <dv-border-box-5>
          <label style="text-align: center">最近其他交易</label>
          <dv-scroll-ranking-board :config="recentOther" style="width:400px;height:300px"/>
        </dv-border-box-5>
      </el-col>
    </el-row>

  </dv-border-box-3>

</template>

<script>
import {queryReport} from "@/api/common";

export default {
  name: "Index",
  data() {
    return {
      incomeRatio: {
        data: []
      },
      recentIncome: {
        data: [],
        unit: '元',
      },
      expenseRatio: {
        data: []
      },
      recentExpense: {
        unit: '元',
        data: []
      },
      otherRatio: {
        data: []
      },
      recentOther: {
        unit: '元',
        data: []
      },
    }
  },
  created() {
    this.queryReportList()
  },
  methods: {
    queryReportList() {
      queryReport().then(res => {
        this.incomeRatio.data = res.data.data.incomeRatioList
        this.incomeRatio = {...this.incomeRatio}
        this.expenseRatio.data = res.data.data.expenseRatioList
        this.expenseRatio = {...this.expenseRatio}
        this.otherRatio.data = res.data.data.otherRatioList
        this.otherRatio = {...this.otherRatio}
        this.recentIncome.data = res.data.data.recentIncomeList
        this.recentIncome = {...this.recentIncome}
        this.recentExpense.data = res.data.data.recentExpenseList
        this.recentExpense = {...this.recentExpense}
        this.recentOther.data = res.data.data.recentOtherList
        this.recentOther = {...this.recentOther}
      })
    }
  }
}
</script>

<style scoped>
#report {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;
}
</style>
