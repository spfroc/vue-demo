<template>
  <div class="home-container" body-style="{width: '100%'}">
    <el-row style="margin-bottom: 20px">
      <el-col :span="4" v-for="o in list" :key="o.title" class="box">
        <div class="card-value"><strong>{{o.value}}</strong></div>
        <div class="card-title">{{o.title}}</div>
      </el-col>
    </el-row>
    <!--<img src="https://www.arizonachristian.edu/wp-content/uploads/2017/06/logo-placeholder.png" alt="" class="logo">-->
    <img class="pic" src="http://thumb.takefoto.cn/wp-content/uploads/2019/04/201904080619552096-680x448.jpg" alt="">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: [
        {
          title: '今日派单数',
          value: 50,
        },
        {
          title: '今日完成服务数',
          value: 50,
        },
        {
          title: '本周派单数',
          value: 200,
        },
        {
          title: '本月派单数',
          value: 800,
        },
        {
          title: '本周呼叫数',
          value: 300,
        }

      ]
    }
  },

  methods: {
    getStatisticsData () {
      this.$http.get('/apis/statistic/countForIndex').then(res => {
        // {"dispNum":2,"wDispNum":134,"wCallNum":135,"mDispNum":159,"completedNum":0};
        this.list[0].value = res.data.data.dispNum;//今日派单数量
        this.list[1].value = res.data.data.completedNum;//今日完成服务数
        this.list[2].value = res.data.data.wDispNum;//本周派单数
        this.list[3].value = res.data.data.mDispNum;//本月派单数量
        this.list[4].value = res.data.data.wCallNum;//本周呼叫数

      });
    }
  },

  mounted() {
    this.getStatisticsData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pic {
  width: 100%;
}
.home-container {
  text-align: center;
}

.card-value {
  margin-top: 15px;
  font-size: 40px;
}

.card-title {
  font-size: 8px;
  color: gray;
}

.box {
  border: solid lightgray 1px;
  height: 100px;
}

.box:not(:first-child) {
  margin-left: 50px;
}

</style>
