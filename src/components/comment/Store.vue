<template>
    <div>
        <!--<section class="header-bar">-->
            <!--<el-form-item label="" prop="name">-->
                <!--<el-input v-model="search.name" aria-placeholder="按标题搜索"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form :inline="true" :model="search" size="mini" class="">-->
                <!--<el-form-item label="创建时间" prop="createTime">-->
                    <!--<el-date-picker-->
                            <!--v-model="search.createTime"-->
                            <!--type="daterange"-->
                            <!--value-format="yyyy-MM-dd"-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始日期"-->
                            <!--end-placeholder="结束日期">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->


                <!--<el-form-item>-->
                    <!--<el-button type="primary" icon="el-icon-search" @click="fetchList">搜索</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        <!--</section>-->
        <!--<section class="header-bar">-->
            <!--<el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>-->
        <!--</section>-->
        <template>
            <div>
                <el-table
                        :data="tableData">
                    <el-table-column type="index" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="storeName"
                            align="center"
                            label="商家名称">
                    </el-table-column>
                    <el-table-column
                            prop="content"
                            align="center"
                            :show-tooltip-when-overflow=true
                            label="评论内容">
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            align="center"
                            label="评论用户">
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
                    <el-table-column width="250" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="() => { edit(scope.row) }" type="info" size="mini">详情</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 2) }" type="success" size="mini">通过</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 3) }" type="danger" size="mini">不通过</el-button>
                            <!--<el-button @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" circle></el-button>-->
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
                    <el-form ref="form" :rules="rules" :model="form">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="评价用户" prop="userName">
                            <el-input v-model="form.userName" :disabled=true></el-input>
                        </el-form-item>
                        <el-form-item label="商家名称" prop="storeName">
                            <el-input v-model="form.storeName" :disabled=true></el-input>
                        </el-form-item>
                        <el-form-item label="评论内容" prop="content">
                            <el-input
                                    type="textarea"
                                    :disabled=true
                                    v-model="form.content"
                            ></el-input>
                        </el-form-item>

                        <el-form-item>
                            <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
                            <el-button v-if="showApprovalButton" v-on:click="operation(form.id, 2)" class="el-button--success">通过</el-button>
                            <el-button v-if="showApprovalButton" v-on:click="operation(form.id, 3)" class="el-button--danger">不通过</el-button>
                            <el-button v-on:click="cancel">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </div>
        </template>
    </div>
</template>

<script>
    import Editor from "../common/Editor"

    export default {
        name: "Store",
        components: {
            Editor
        },

        computed : {
            showApprovalButton: function() {
                if(this.editingRow.status == 1) {
                    return true;
                } else {
                    return false;
                }
            }
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
                introductionFileList: [],
                form: {
                    id: '',
                    userName: '',
                    storeName: '',
                    content: '',
                    status: '',
                    createTime: '',
                    updateTime: '',
                    approvedAt: '',
                    rejectedAt: '',
                },
                editing: false,
                isUpdate: false,
                search: {
                    name: '',
                    createTime: ''
                },
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

            showOperationButton(status) {
                return status == 1 ? true : false;
            },
            remove (id) {
                this.$confirm('确定删除此评论吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/adminApi/storeComment/delete', {
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
                this.$http.get('/apis/adminApi/store/comment', {
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

            operation(id, status) {
                this.$http.post('/apis/adminApi/comment/approval', {
                    id: id,
                    status: status,
                }).then(res => {
                    this.$message({
                        message: res.data.message,
                        type: 'success'
                    })
                    this.fetchList(1)
                });
                this.editing = false
                this.form = {}
            }
        },

        mounted() {
            this.fetchList(1);
        }
    }
</script>

<style scoped>
</style>