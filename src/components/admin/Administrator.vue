<template>
  <div>
    <section class="header-bar">
      <el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
    </section>
    <template>
      <div>
        <el-table
          :data="tableData">
          <el-table-column type="index" align="center" width="80" label="序号">
          </el-table-column>
          <el-table-column
            prop="userName"
            align="center"
            label="帐号">
          </el-table-column>
          <el-table-column
            prop="roleName"
            align="center"
            label="权限">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column align="center" prop="updateTime" label="修改时间">
          </el-table-column>
          <el-table-column align="center" width="250" label="操作">
            <template slot-scope="scope">
              <el-button @click="() => { edit(scope.row) }" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button @click="() => { remove(scope.row.id) }" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          hide-on-single-page
          background
          layout="total, prev, pager, next"
          :page-size="this.page.pageSize"
          :total="this.page.total"
          :current-page="this.search.pageNum"
          @current-change="fetchList"
        >
        </el-pagination>

        <el-dialog :close-on-click-modal="false" :title="isUpdate ? '修改' : '添加'" :visible.sync="editing" :append-to-body="true">
          <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item v-show="form.id" label="ID" prop="id">
              <el-input :disabled="true" v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item v-if="!isUpdate" label="密码" prop="password">
              <el-input type="password" :show-password="false" placeholder="请输入密码" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item v-if="isUpdate">
              <el-switch
                v-model="form.isUpdateAdminPwd"
                active-text="修改密码"
                inactive-text="">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="isUpdate && form.isUpdateAdminPwd" label="密码" prop="newPassword">
              <el-input type="password" :show-password="false" placeholder="请输入旧密码" v-model="form.newPassword"></el-input>
            </el-form-item>

            <el-form-item v-if="isUpdate && form.isUpdateAdminPwd" label="确认密码" prop="confirmPassword">
              <el-input type="password" :show-password="false" placeholder="请输入新密码" v-model="form.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="form.roleId" :clearable="true" placeholder="请选择">
                <el-option
                v-for="item in this.roleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
              <el-button v-on:click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'Administrator',
    data () {
      return {
        tableData: [],
        roleOptions: [],
        page: {
            pageSize: 10
        },
        editingRow: {},
        form: {
          id: '',
          userName: '',
          roleId: 1,
          password: '',
          newPassword: '',
          confirmPassword: '',
          isUpdateAdminPwd: null
        },
        search: {},
        fileList: [],
        editing: false,
        isUpdate: false
      }
    },
    methods: {
      // roleFormatter (row, col, data) {
      //   return ['超级管理员', '子女', '社工', '医生', '村干部'][data] || '未知'
      // },
      getAuthUserId () {
        return JSON.parse(localStorage.getItem('auth-user-info')).id
      },
      fetchList (currentPage) {
        this.search.pageNum = currentPage || this.search.pageNum
        // TODO id=1 是个接口bug
        this.$http.get('/apis/manager/list', {
          params: Object.assign({
            id: this.getAuthUserId(),
            pageSize: 10,
            pageNum: 1
          }, this.search)
        }, {
          params: this.search
        }).then(res => {
          this.tableData = res.data.data.list.map(d => {
            d.admin_permissions = parseInt(d.admin_permissions)
            return d
          })
          this.page.total = res.data.data.total
          this.search.pageNum = parseInt(res.data.data.pageNum)
        })
      },
      add () {
        this.editing = true
        this.isUpdate = false
        this.form = {
          type: 1,
          roleId: 1
        }
      },
      edit (row) {
        this.editing = true
        this.isUpdate = true
        this.editingRow = row
        this.form = Object.assign({}, row)
      },
      remove (id) {
        this.$confirm('确定删除此用户吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('/apis/manager/delete', {
            id: id,
          }).then(res => {
            this.$message({
              message: res.data.msg || '操作成功',
              type: 'success'
            })
            this.fetchList(1)
          })
          this.editing = false
          this.form = {}
        }).catch(() => {
          // do nothing
        })
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if(this.form.newPassword) {
              this.form.password = this.form.newPassword;
            }
            this.$http.post('/apis/manager/addOrUpdate', this.form).then(res => {
              this.$message({
                message: res.data.msg || '操作成功',
                type: 'success'
              })
              this.form = {}
              this.fetchList()
              this.editing = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      passwordSameValidate(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      getRoleList() {
        this.$http.get('/apis/manager/roleList').then(res => {
          this.roleOptions = res.data.data.list;
        });
      },
      cancel () {
        this.editing = false
      }
    },
    computed: {
      'rules' () {

        let ruleObjects = {
          userName: [
            { required: true, message: '请输入管理员名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
        };
        let adminPwd = [];
        if(this.isUpdate) {

          if(this.form.isUpdateAdminPwd) {
            ruleObjects.newPassword = [
              { min: 6, message: '密码最少6位', trigger: 'blur' },
              { required: true, message: '请输入密码', trigger: 'blur' }
            ];

            ruleObjects.confirmPassword = [
              { min: 6, message: '密码最少6位', trigger: 'blur' },
              { required: true, validator: this.passwordSameValidate, trigger: 'blur' }
            ];
          }

        } else {
          adminPwd = [
            { min: 6, message: '密码最少6位', trigger: 'blur' },
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]

          ruleObjects.password = adminPwd;
        }
        console.log(ruleObjects);
        return ruleObjects;
      }
    },
    mounted () {
        // console.log(12321321);return;
      this.fetchList();
      this.getRoleList();
    },
    watch: {
      editing () {
        this.$refs['form'] && this.$refs['form'].clearValidate()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .banner-image {
    height: 50px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
