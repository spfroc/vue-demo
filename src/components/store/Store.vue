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
                            prop="title"
                            label="标题">
                    </el-table-column>
                    <el-table-column
                            label="封面"
                            width="200">
                        <template slot-scope="scope">
                            <el-image
                                    fit="contain"
                                    :src="`/images/${scope.row.cover}`"
                            >
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :show-tooltip-when-overflow=true
                            prop="content"
                            label="内容">
                    </el-table-column>
                    <el-table-column
                            class="content"
                            prop="category"
                            :formatter="getCategoryName"
                            width="100"
                            label="分类">
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
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="分类" prop="title">
                            <el-select v-model="form.category" placeholder="请选择">
                                <el-option
                                        v-for="item in this.categoryOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item label="封面" prop="pic">
                            <single-image-upload v-model="form.cover" width="400" height="200"></single-image-upload>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <editor ref="myTextEditor" v-model="form.content" :options="editorOption"></editor>
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
    import SingleImageUpload from "../common/SingleImageUpload"
    import Editor from "../common/Editor"

    export default {
        name: "Community",
        components: {
            SingleImageUpload,Editor
        },
        data() {
            return {
                editorOption: {
                    placeholder: ''
                },
                tableData: [],
                categoryOptions: [],
                page: {
                    pageSize: 10
                },
                editingRow: {},
                form: {
                    id: '',
                    title: '',
                    category: '',
                    content: '',
                    cover: '',
                },
                editing: false,
                isUpdate: false,
                search: {},
                rules: {

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
                this.$confirm('确定删除此信息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/adminApi/communityInfo/delete', {
                        id: id
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

            cancel () {
                this.editing = false
            },

            fetchList (currentPage) {
                this.search.pageNum = currentPage || this.search.pageNum
                // TODO id=1 是个接口bug
                this.$http.get('/apis/adminApi/communityInfo', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: 1,
                    }, this.search)
                }, {
                    params: this.search
                }).then(res => {

                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.data;
                })
            },

            getCategoryOptions () {
                this.$http.get('/apis/adminApi/communityCategory',).then(res => {
                    this.categoryOptions = res.data.data;
                    console.log(res.data);
                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/adminApi/communityInfo/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.message,
                                type: 'success'
                            })
                            this.form = {}
                            this.fetchList(1)
                            this.editing = false
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },

            getCategoryName(row, col, data) {
                let categoryObj = (this.categoryOptions.filter((item) => {
                    // console.log(item.id + '=' + data);
                    if(data == item.id) {
                        return true;
                    }
                }));
                return categoryObj[0].name;
                // return this.categoryOptions[data] || '未知'
            }
        },

        mounted() {
            this.fetchList(1);
            this.getCategoryOptions();
        }
    }
</script>

<style scoped>
</style>