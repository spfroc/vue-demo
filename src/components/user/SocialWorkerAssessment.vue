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
                            prop="name"
                            align="center"
                            label="公司">
                    </el-table-column>
                    <el-table-column align="center" prop="createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column align="center" prop="updateTime" label="修改时间">
                    </el-table-column>
                    <el-table-column width="250" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="() => { edit(scope.row) }" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                            <el-button @click="() => { remove(scope.row.id) }" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>


                <el-dialog :close-on-click-modal="false" :title="isUpdate ? '修改' : '添加'" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="公司名称" prop="name">
                            <el-input v-model="form.name"></el-input>
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
        name: "SocialWorkerAssessment",

        data() {
            return {
                tableData: [],

                editingRow: {},
                form: {
                    id: '',
                    name: '',
                },
                editing: false,
                isUpdate: false,
                rules: {
                    name: { required: true, message: '请输入公司名称' }
                },
                page: {

                }
            }

        },
        methods: {
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
                console.log(id);
                this.$confirm('确定删除此分类吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/communityCategory/delete', {
                        id: id
                    }, {
                        params: {
                            token: localStorage.getItem('auth-token')
                        }
                    }).then(res => {
                        this.$message({
                            message: res.data.msg  || '操作成功',
                            type: 'success'
                        })
                    })
                    this.fetchList()
                    this.editing = false

                }).catch(() => {
                    // do nothing
                })
            },

            cancel () {
                this.editing = false
            },

            fetchList () {
                // this.$http.get('/apis/communityCategory/list', {
                this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/adminApi/company', {
                    params: {

                    }
                }).then(res => {
                    this.page.total = res.data.data.total
                    this.page.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/communityCategory/addOrUpdate', this.form, {
                            params: {
                                token: localStorage.getItem('auth-token')
                            }
                        }).then(res => {
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
        },

        mounted() {
            this.fetchList();
        }
    }
</script>

<style scoped>

</style>