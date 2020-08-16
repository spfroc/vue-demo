<template>
  <el-upload
    class="single-image-uploader"
    action="/apis/fileUpload"
    :show-file-list="false"
    :headers="headers"
    accept="image/*"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
    :before-upload="beforeAvatarUpload">
    <section v-bind:style="size">
      <el-image fit="contain" v-if="imageUrl" :src="imageData || `/images/${imageUrl}`" class="avatar"></el-image>
      <i v-else class="el-icon-plus single-image-uploader-icon"></i>
    </section>
    <div class="upload-tips" slot="tip">{{tips || '只能上传jpg/jpeg/png/gif文件，且不超过1M。'}}</div>
  </el-upload>
</template>

<script>

export default {
  name: 'SingleImageUpload',
  model: {
    prop: 'imageUrl',
    event: 'change'
  },
  data () {
    return {
      headers: {
        token: localStorage.getItem('auth-token')
      },
      imageData: ''
    }
  },
  computed: {
    size () {
      return {
        width: (this.width || 178) + 'px',
        height: (this.height || 178) + 'px'
      }
    }
  },
  props: ['imageUrl', 'width', 'height', 'tips'],
  watch: {
    imageUrl () {
      this.imageData = null
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = res.data
      this.$emit('change', res.data)
    },
    handleAvatarError (res, file) {
        this.$message.error(`图片上传失败，服务端返回码：${res.status}`)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isToLarge = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        // this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isToLarge) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isToLarge
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .single-image-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .single-image-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .single-image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }

  .upload-tips {
    font-size: 12px;
    color: #606266;
    margin-top: -12px;
  }
</style>
