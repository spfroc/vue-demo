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
                            prop="name"
                            align="center"
                            label="名称">
                    </el-table-column>

                    <el-table-column
                            prop="content"
                            align="center"
                            label="文本">
                    </el-table-column>
                    <el-table-column align="center" min-width="150" prop="createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column align="center" min-width="150" prop="updateTime" label="修改时间">
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
                        :page-size="page.pageSize"
                        :total="page.total"
                        :current-page="search.pageNum"
                        @current-change="fetchList"
                >
                </el-pagination>

                <el-dialog :close-on-click-modal="false" :title="isUpdate ? '修改' : '添加'" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="名称" prop="name">-->
                            <!--<el-input v-model="form.name"></el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="祝福内容" prop="content">
                            <el-input v-model="form.content"></el-input>
                        </el-form-item>
                        <el-form-item label="推送设置" prop="pushSet">
                            <el-select v-model="form.pushSet" placeholder="请选择">
                                <el-option
                                        v-for="item in pushSettingOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
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
        name: "Template",

        data() {
            return {
                tableData: [],
                pushSettingOptions: [
                    {
                        value: "1",
                        label: '当天',
                    },
                    {
                        value: "2",
                        label: '提前三天',
                    },
                ],
                editingRow: {},
                form: {
                    id: '',
                    name: '生日祝福',
                    content: '',
                    pushSet: 1,
                    careDate: '',
                    type: 2
                },
                editing: false,
                isUpdate: false,
                rules: {
                    name: { required: true, message: '请输入关怀', trigger: 'blur' },
                    content: { required: true, message: '请输入关怀内容', trigger: 'blur' },
                    // careDate: { required: true, message: '请选择日期', trigger: 'blur' },
                    pushSet: { required: true, message: '请选择推送设置', trigger: 'blur' },
                },
                page: {},
                search: {}
            }

        },
        methods: {
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    name: '生日祝福',
                    content: '',
                    pushSet: 1,
                    careDate: '',
                    type: 2
                }
            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.form = Object.assign({}, row)
            },
            remove (id) {
                this.$confirm('确定删除此模板吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/lovingCare/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        })
                        this.fetchList()
                    })
                    this.editing = false
                    this.form = {
                        type: 1
                    }
                }).catch(() => {
                    // do nothing
                })
            },

            cancel () {
                this.editing = false
            },

            fetchList () {
                this.$http.get('/apis/lovingCare/list', {
                    params: {
                        type: 2
                    }
                }).then(res => {
                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/lovingCare/addOrUpdateForBirthday', this.form).then(res => {
                            this.$message({
                                message: res.data.message,
                                type: 'success'
                            })
                            this.form = {
                                name: '生日祝福',
                                content: '',
                                pushSet: 1,
                                careDate: '',
                                type: 2
                            }
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