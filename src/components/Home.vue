<template>
  <div class="home-container" body-style="{width: '100%'}">
    <el-row type="flex" style="margin-bottom: 20px">
      <el-col :span="4" v-for="o in list" :key="o.title" class="box">
        <div class="card-title">{{o.title}}</div>
        <div class="card-value"><strong>{{o.value}}</strong>{{o.unit}}</div>
      </el-col>
    </el-row>
    <el-upload
            class="avatar-uploader"
            ref="uploadContainer"
            style="border: none;"
            :action="fileUploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      fileUploadUrl: '/apis/upload/file?token=' + localStorage.getItem('auth-token'),
      imageUrl: '/images/app/2020/10/17/e118d4868c2d4d6d877e2889d18ea84a.png',
      list: [
        {
          title: '今日派单数',
          value: 50,
          unit: '单',
        },
        {
          title: '今日完成单数',
          value: 50,
          unit: '单',
        },
        {
          title: '本周派单数',
          value: 200,
          unit: '单',
        },
        {
          title: '本月派单数',
          value: 800,
          unit: '单',
        },
        {
          title: '本周SOS呼叫数',
          value: 300,
          unit: '次',
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
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = '/images'+res.data.pic;
      this.saveImage(res.data.pic)
    },

    saveImage(url) {
      this.$http.post('/apis/banner/addOrUpdate', {
        type: 4,
        link: url,
        name: '首页背景图',
        pic: url,
        text: '首页背景图'
      }).then(res => {
        console.log(res);
      })
    },

    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },

    getImage() {
      this.$http.get('/apis/banner/list', {
        params: {
          type: 4
        }
      }).then(res => {
        if(res.data.data.list.length >= 1) {
          this.imageUrl = '/images' + res.data.data.list.shift().pic;
          console.log(this.imageUrl);
        }
      });
    }
  },

  mounted() {
    this.getStatisticsData();
    this.getImage();
    this.$refs.uploadContainer.$el.children[0].style.width= '100%';
    this.$refs.uploadContainer.$el.children[0].style.height= '100%';
    this.$refs.uploadContainer.$el.children[0].style.border= 'none';

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
  margin-top: 10px;
  font-size: 32px;
  color: white;
}

.card-title {
  color: white;
  text-align: left;
  font-size: 15px;
  margin: 10px 0 0 10px
}

.box {
  height: 100px;
  background-image: url('../assets/img/index/blank_yellow.png');
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}

.box:not(:first-child) {
  margin-left: 65px;
}
.avatar {
  width: 100%;
  display: block;
}

.avatar-uploader {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-upload--text{
  border: none
}
</style>
