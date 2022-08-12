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
      incomeRatio: {},
      recentIncome: {
        unit: '元',
      },
      expenseRatio: {},
      recentExpense: {
        unit: '元'
      },
      otherRatio: {},
      recentOther: {
        unit: '元',
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
        this.expenseRatio.data = res.data.data.expenseRatioList
        this.otherRatio.data = res.data.data.otherRatioList
        this.recentIncome.data = res.data.data.recentIncomeList
        this.recentExpense.data = res.data.data.recentExpenseList
        this.recentOther.data = res.data.data.recentOtherList
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
