<template>
  <div class="home-container" body-style="{width: '100%'}">
    <el-card class="box-card">
      <div v-for="o in list" :key="o.title" class="text item">
        <div class="card-value"><strong>{{o.value}}</strong></div>
        <div class="card-title">{{o.title}}</div>
      </div>
    </el-card>
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

.text {
  font-size: 14px;
}

.item {
  /*padding: 0 20px 0 20px;*/
  margin: 0 20px;
  float: left;
  border: solid lightgray 1px;
  height: 80px;
  width: 150px;
}

.card-value {
  margin-top: 15px;
  font-size: 30px;
}

.card-title {
  font-size: 8px;
  color: gray;
}

.box-card {
  width: 100%;
  margin-bottom: 10px;
}
</style>
