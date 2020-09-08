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
                            prop="title"
                            align="center"
                            label="标题">
                    </el-table-column>
                    <el-table-column
                            label="封面图"
                            align="center"
                            width="200">
                        <template slot-scope="scope">
                            <el-image
                                fit="contain"
                                align="center"
                                :src="`/images${scope.row.cover}`"
                            >
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="content"
                            align="center"
                            :formatter="$common.richTextContentFormatter"
                            :show-tooltip-overflow=false
                            label="文本">
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
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="封面" prop="cover">
                            <single-image-upload
                                    v-model="form.cover"
                                    @change="picUploaded"
                                    width="400"
                                    height="200"></single-image-upload>
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
        name: "CommonSense",
        components: {
            SingleImageUpload,Editor
        },
        data() {
            return {
                editorOption: {
                    placeholder: ''
                },
                tableData: [],
                page: {
                    pageSize: 10
                },
                search: {},

                editingRow: {},
                form: {
                    id: '',
                    name: '',
                    content: '',
                    pushSetting: 1,
                    date: ''
                },
                editing: false,
                isUpdate: false,
                rules: {
                    title: { required: true, message: '请输入标题', trigger: 'blur' },
                    cover: { required: true, message: '请上传封面', trigger: 'blur' },
                }
            }

        },
        methods: {
            picUploaded(res, file) {
                this.form.cover = res.pic
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
                this.$confirm('确定删除此健康知识吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/healthyKnowledge/delete', {
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
                this.$http.get('/apis/healthyKnowledge/list',).then(res => {
                    // this.tableData = res.data.data;
                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$http.post('/apis/healthyKnowledge/addOrUpdate', this.form).then(res => {
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
        },

        mounted() {
            this.fetchList();
        }
    }
</script>

<style scoped>

</style>