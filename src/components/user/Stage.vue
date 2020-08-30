<template>
    <div class="container">
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
                            prop="name"
                            align="center"
                            label="驿站">
                    </el-table-column>
                    <el-table-column align="center" prop="createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column prop="updateTime" align="center" label="修改时间">
                    </el-table-column>
                    <el-table-column width="250" align="center" label="操作">
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
                    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="驿站名称" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="地理位置" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>

                        <el-form-item label="负责人" prop="manager">
                            <el-input v-model="form.manager"></el-input>
                        </el-form-item>

                        <el-form-item label="联系电话" prop="contactNumber">
                            <el-input v-model="form.contactNumber"></el-input>
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
    import { isValidPhone } from '../../util/validate'

    export default {
        name: "Stage",
        data() {
            return {
                tableData: [],
                editing: false,
                isUpdate: false,
                rules: {
                    name: [
                        { required: true, message: '请输入驿站名称', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                    ],

                    contactNumber: [
                        { required: true, message: '请输入联系电话', trigger: 'blur' },
                        { validator: isValidPhone, trigger: 'blur' }
                    ],

                    address: {required: true, message: '请输入地理位置', trigger: 'blur'},
                    manager: {required: true, message: '请输入负责人姓名', trigger: 'blur'},
                },
                page: {},
                search: {},
                editingRow: {},

                form: {
                    id: '',
                    name: '',
                    contactNumber: '',
                    manager: '',
                    address: '',
                },
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
                this.$confirm('确定删除此驿站吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/courierStation/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.msg || '操作成功',
                            type: 'success'
                        })
                        this.fetchList()
                    })
                    this.editing = false
                    this.form = {}
                }).catch(() => {
                    // do nothing
                })
            },

            cancel () {
                this.editing = false
            },

            fetchList () {
                this.$http.get('/apis/courierStation/list', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: 1
                    }, this.search)
                }).then(res => {
                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/courierStation/addOrUpdate', this.form).then(res => {
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