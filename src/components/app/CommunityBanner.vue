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
                            label="图片"
                            align="center"
                            width="200">
                        <template slot-scope="scope">
                            <el-image
                                    fit="contain"
                                    :src="`/images${scope.row.pic}`"
                            >
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="link"
                            align="center"
                            label="链接">
                    </el-table-column>
                    <el-table-column
                            prop="text"
                            align="center"
                            :show-overflow-tooltip=false
                            :formatter="$common.richTextContentFormatter"
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
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item v-show="false">
                            <el-input v-model="form.type"></el-input>
                        </el-form-item>
                        <el-form-item label="图片" prop="pic">
                            <single-image-upload
                                    v-model="form.pic"
                                    width="400"
                                    @change="picUploaded"
                                    height="200"></single-image-upload>
                        </el-form-item>
                        <el-form-item label="排序" prop="sno">
                            <el-input type="number" v-model="form.sno"></el-input>
                        </el-form-item>
                        <el-form-item label="链接" prop="link">
                            <el-input v-model="form.link"></el-input>
                        </el-form-item>
                        <el-form-item label="文本" prop="text">
                            <editor ref="myTextEditor" v-model="form.text" :options="editorOption"></editor>

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
        name: "CommunityBanner",
        components: {
            SingleImageUpload, Editor
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
                editingRow: {},
                form: {
                    id: '',
                    name: '',
                    pic: '',
                    link: '',
                    text: '',
                    type: 2,
                    sno: '',
                    createTime: '',
                    updateTime: '',
                },
                editing: false,
                isUpdate: false,
                search: {},
                rules: {
                    // text: [
                    //     { required: true, message: '请输入轮播图内容描述', trigger: 'blur' },
                    //     { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
                    // ],
                    // link: [
                    //     { required: true, message: '请输入轮播图链接地址', trigger: 'blur' },
                    //     { type: 'url', message: '请输入有效的链接地址', trigger: 'blur' }
                    // ],
                    pic: [
                        { required: true, message: '请上传轮播图片' }
                    ],
                    name: [
                        { required: true, message: '请输入轮播图名称' }
                    ]
                }
            }

        },
        methods: {
            picUploaded(res, file) {
                console.log(res, file);
                this.form.pic = res.pic;
            },
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
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
                this.$confirm('确定删除此轮播图吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/banner/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.msg || '操作成功',
                            type: 'success'
                        })
                        this.fetchList(1)
                    })
                    this.editing = false
                    this.form = {
                        type: 2
                    }
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
                this.$http.get('/apis/banner/list', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: 1,
                        type: 2
                    }, this.search)
                }, {
                    params: this.search
                }).then(res => {

                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/banner/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.msg || '操作成功',
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
        },

        mounted() {
            this.fetchList(1);
        }
    }
</script>

<style scoped>

</style>