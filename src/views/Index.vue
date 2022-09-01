<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div class="grid-num">{{ userTotalAmout.initialAmount }}</div>
              <div>初始金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div class="grid-num">{{ userTotalAmout.totalIncomePrice }}</div>
              <div>累计记录收入金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div class="grid-num">{{ userTotalAmout.totalExpendPrice }}</div>
              <div>累计记录支出金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div class="grid-num">{{ userTotalAmout.totalPrice }}</div>
              <div>累计金额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <dv-border-box-8>
          <dv-charts :option="incomeRatio" style="width:100%;height:300px"/>
        </dv-border-box-8>
      </el-col>
      <el-col :span="12">
        <dv-border-box-8>
          <dv-charts :option="expenseRatio" style="width:100%;height:300px"/>
        </dv-border-box-8>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <dv-border-box-5>
          <label style="text-align: center">最新记录数据</label>
          <dv-scroll-ranking-board :config="recentTrade" style="width:100%;height:300px;color: black"/>
        </dv-border-box-5>
      </el-col>
      <el-col :span="12">
        <dv-border-box-11 title="累计金额趋势">
          <dv-charts :option="trend" style="width:100%;height:300px" />
        </dv-border-box-11>

      </el-col>
    </el-row>
  </div>

</template>

<script>
import {queryUserTotal, queryReport, queryTradeReport} from "@/api/common";

export default {
  name: "Index",
  data() {
    return {
      userTotalAmout: {},
      incomeRatio: {
        title: {
          text: '累计记录收入占比'
        },
        series: [
          {
            type: 'pie',
            data: [],
            insideLabel: {
              show: true
            }
          }
        ]
      },
      expenseRatio: {
        title: {
          text: '累计记录支出占比'
        },
        series: [
          {
            type: 'pie',
            data: [],
            insideLabel: {
              show: true
            }
          }
        ]
      },
      recentTrade: {
        unit: '元',
        data: []
      },
      trend: {
        xAxis: {
          name: '年月',
          data: []
        },
        yAxis: {
          name: '累计金额',
          data: 'value'
        },
        series: [
          {
            data: [],
            type: 'line',
            label: {
              show: true,
              formatter: '{value} 元'
            }
          }
        ]
      }
    }
  },
  created() {
    this.queryUserTotalAmount()
    this.queryUserReport()
    this.queryTradeReportList()
  },
  methods: {
    queryUserTotalAmount() {
      queryUserTotal().then(res => {
        this.userTotalAmout = res.data.data
      })
    },
    queryUserReport() {
      queryReport().then(res => {
        this.incomeRatio.series[0].data = res.data.data.incomeRatioList
        this.incomeRatio = {...this.incomeRatio}
        this.expenseRatio.series[0].data = res.data.data.expenseRatioList
        this.expenseRatio = {...this.expenseRatio}
        this.recentTrade.data = res.data.data.recentTradeList
        this.recentTrade = {...this.recentTrade}
      })
    },
    queryTradeReportList() {
      queryTradeReport().then(res => {
        const tradeReportList = res.data.data
        const xAxisData = []
        const seriesData = []
        for (let item of tradeReportList){
          xAxisData.push(item.name)
          seriesData.push(item.value)
        }
        // TODO 折线图待处理
        this.trend.xAxis.data = xAxisData
        this.trend.series[0].data = seriesData
        this.trend = {...this.trend}
      })
    }
  }
}
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 50px;
}

.grid-cont-center {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: darkgray;
}

.mgb20 {
  height: 50%;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}
</style>
