<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">欢迎登录</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="name">
          <el-input tabindex="1" autofocus="autofocus" v-model="param.admin_name" placeholder="请输入帐号">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            tabindex="2"
            placeholder="请输入密码"
            v-model="param.admin_pwd"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="remenber">
          <el-checkbox v-model="param.remenber">记住密码</el-checkbox>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>
    <div class="blue-mask"></div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        param: {
          admin_name: '',
          admin_pwd: '',
          remenber: false,
        },
        rules: {
          admin_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          admin_pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
      };
    },
    methods: {
      submitForm() {
        this.$refs.login.validate(valid => {
          console.log(this.param);
          if (valid) {
            this.$http.post('/apis/manager/login', {
                userName: this.param.admin_name,
                password: this.param.admin_pwd
            }).then(res => {
              this.$message.success('登录成功');
              localStorage.setItem('auth-user-info', JSON.stringify(res.data));
              localStorage.setItem('auth-token', res.data.data.token);
              localStorage.setItem('auth-username', res.data.data.userName)
              localStorage.setItem('roleId', res.data.data.roleId)
              this.$store.commit('setToken', res.data.data.token)
              console.log(res.data.data);
              this.$router.push('/');
            }).catch(reason => {
              console.log(reason);
            });
          } else {
            this.$message.error('请输入账号和密码');
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
  };
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('../assets/img/index/v2_q6vz7g.jpg');
    background-size: 100%;
    z-index: 1000;
  }

  .blue-mask {
    position: absolute;
    background-color: lightskyblue;
    width: 100%;
    height: 100%;
    z-index: 1001;
    opacity: 0.3
  }
  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    z-index: 1002;
  }
  .ms-content {
    padding: 30px 30px;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

</style>
