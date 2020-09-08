<template>
    <div>
        <section class="header-bar">
            <el-form :inline="true" :model="search" size="mini" class="">
                <el-form-item label="" prop="createTime">
                    <el-date-picker
                            v-model="search.createTime"
                            type="daterange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section class="header-bar">
            <el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
        </section>
        <template>
            <div>
                <el-table
                        :data="tableData">
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column
                            label="宣传图"
                            width="200">
                        <template slot-scope="scope">
                            <el-image
                                    fit="contain"
                                    :src="`/images${scope.row.cover}`"
                            >
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            align="center"
                            label="标题">
                    </el-table-column>
                    <el-table-column
                            prop="content"
                            :show-tooltip-overflow=false
                            align="center"
                            :formatter="$common.richTextContentFormatter"
                            label="详情">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            align="center"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            align="center"
                            label="修改时间">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            align="center">
                        <template slot-scope="scope">
                            <el-button @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" size="small">编辑</el-button>
                            <el-button @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" size="small">删除</el-button>
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

                <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="活动标题" prop="title">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="宣传图" prop="cover">
                            <single-image-upload
                                    v-model="form.cover"
                                    @change="picUploaded"
                                    width="400"
                                    height="200"></single-image-upload>
                        </el-form-item>
                        <el-form-item label="活动内容" prop="content">
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
        name: "Activity",
        components: {
            SingleImageUpload, Editor
        },

        data () {
            return {
                tableData: [],
                editorOption: {
                    placeholder: ''
                },
                form: {
                    id: '',
                    title: '',
                    content: '',
                    cover:'',
                },
                search: {},
                page: {
                    pageSize: 10,
                },
                editing: false,
                isUpdate: false,
                rules: {
                    title: {required: true, message: '请输入标题'},
                    cover: {required: true, message: '请上传宣传图'},
                    content: {required: true, message: '请输入活动内容'},
                },


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
                this.$confirm('确定删除此活动信息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/volunteerActivity/delete', {
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
                console.log(currentPage);
                this.search.pageNum = currentPage || this.search.pageNum
                this.search = this.$common.searchParams(this.search);
                // TODO id=1 是个接口bug
                this.$http.get('/apis/volunteerActivity/list', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: 1,
                    }, this.search)
                }, {
                    params: this.search
                }).then(res => {

                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                    if(this.search.timeStart && this.search.timeEnd) {
                        this.search.createTime = [];
                        this.search.createTime.push(this.search.timeStart);
                        this.search.createTime.push(this.search.timeEnd);
                    }
                })
            },
            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$http.post('/apis/volunteerActivity/addOrUpdate', this.form).then(res => {
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
        },

        mounted() {
            this.fetchList(1);
        }
    }
</script>

<style scoped>

</style>