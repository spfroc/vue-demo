<template>
  <div>
    <section class="header-bar">
      <el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
    </section>
    <template>
      <div>
        <el-table
          :data="tableData">
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="帐号">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="权限">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间">
          </el-table-column>
          <el-table-column width="120" label="操作">
            <template slot-scope="scope">
              <el-button @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" circle></el-button>
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
            <el-form-item v-if="isUpdate">
              <el-switch
                v-model="form.isUpdateAdminPwd"
                active-text="修改密码"
                inactive-text="">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="!isUpdate || form.isUpdateAdminPwd" label="密码" prop="admin_pwd">
              <el-input type="password" :show-password="true" placeholder="请输入密码" v-model="form.adminPwd"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="admin_permissions">
              <el-select v-model="form.roleName" :clearable="true" placeholder="请选择">
                <el-option
                  label="超级管理员"
                  :value=0>
                </el-option>
                <el-option
                  label="子女"
                  :value=1>
                </el-option>
                <el-option
                  label="社工"
                  :value=2>
                </el-option>
                <el-option
                  label="医生"
                  :value=3>
                </el-option>
                <el-option
                  label="村干部"
                  :value=4>
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
        page: {
            pageSize: 10
        },
        editingRow: {},
        form: {
          id: '',
          userName: '',
          roleName: 0,
            roleId: 0,
          adminPwd: '',
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
        this.$http.get('/apis/adminApi/manager/list', {
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
        this.form = {}
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
          this.$http.post('/apis/admin/adminDel', {
            aid: id,
            id: this.getAuthUserId()
          }).then(res => {
            this.$message({
              message: res.data.message,
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
            // if (!this.isUpdate) {
            //   // id 添加的时候代表操作人，修改的时候代表被修改人
            //   this.form.id = this.getAuthUserId()
            // } else if (this.editingRow.userName === this.form.userName) {
            //   delete this.form.userName
            // }
            this.form.roleId = this.form.roleName
            this.$http.post('/apis/adminApi/manager/addOrUpdate', this.form).then(res => {
              this.$message({
                message: res.data.message,
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
      cancel () {
        this.editing = false
      }
    },
    computed: {
      'rules' () {
        let adminPwd = [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]

        if (!this.isUpdate || this.form.isUpdateAdminPwd) {
          adminPwd.push({ required: true, message: '请输入密码', trigger: 'blur' })
        }

        return {
          userName: [
            { required: true, message: '请输入管理员名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],

          adminPwd: adminPwd
        }
      }
    },
    mounted () {
        // console.log(12321321);return;
      this.fetchList()
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
