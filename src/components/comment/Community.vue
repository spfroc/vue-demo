<template>
    <div>
        <section class="">
            <el-form :inline="true" :model="search" size="mini" class="">
                <el-form-item label="" prop="name">
                    <el-input v-model="search.name" style="width: 120px;" placeholder="按标题搜索"></el-input>
                </el-form-item>
                <el-form-item label="" prop="timeStart">
                    <el-date-picker
                            v-model="search.timeStart"
                            align="left"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            style="width: 100%;"
                            placeholder="开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>至</el-form-item>
                <el-form-item label="" prop="timeEnd">
                    <el-date-picker
                            v-model="search.timeEnd"
                            align="left"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width: 100%;"
                            type="date"
                            placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                </el-form-item>
            </el-form>
        </section>
        <!--<section class="header-bar">-->
        <!--<el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>-->
        <!--</section>-->
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
                            prop="status"
                            align="center"
                            :formatter="statusFormatter"
                            label="状态">
                        <template slot-scope="scope">
                            <span :style="statusStyle(scope.row.status)">{{statusText(scope.row.status)}}</span>
                    　　 </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            align="center"
                            min-width="150"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            align="center"
                            min-width="150"
                            label="修改时间">
                    </el-table-column>
                    <el-table-column width="250" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="() => { edit(scope.row) }" type="" size="mini">详情</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 1) }" type="success" size="mini">通过</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 2) }" type="danger" size="mini">不通过</el-button>

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

                <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="评价用户" prop="userName">
                            <el-input v-model="form.userName" :disabled=true></el-input>
                        </el-form-item>
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title" :disabled=true></el-input>
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
                            <el-button v-if="showApprovalButton" v-on:click="operation(form.id, 1)" class="el-button--success">通过</el-button>
                            <el-button v-if="showApprovalButton" v-on:click="operation(form.id, 2)" class="el-button--danger">不通过</el-button>
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
        name: "Community",
        components: {
            Editor
        },

        computed : {
            showApprovalButton: function() {
                if(this.editingRow.status == '0') {
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
                    title: '',
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
                    createTime: '',
                    timeStart: '',
                    timeEnd: '',
                },
                rules: {

                }
            }

        },
        methods: {

            statusStyle(status) {
                let color = 'blue';
                if(status == 0) {
                    color = 'blue'
                } else if(status == 1) {
                    color = 'green'
                } else if(status == 2) {
                    color = 'red'
                };
                let style = {
                    color: color,
                    textAlign: 'center'
                }

                return style;
            },
            statusText(status) {
                let text = '待审核';
                if(status == 0) {
                    text = '待审核'
                } else if(status == 1) {
                    text = '通过'
                } else if(status == 2) {
                    text = '不通过'
                };

                return text;
            },
            statusFormatter(row) {
                console.log(row);
                if(row.status == '0') {
                    return '待审核'
                } else if(row.status == '1') {
                    return '通过'
                } else {
                    return '不通过'
                }
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

            showOperationButton(status) {
                return status == '0' ? true : false;
            },
            remove (id) {
                this.$confirm('确定删除此评论吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/communityComment/delete', {
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

                console.log(this.search.pageNum);
                this.search = this.$common.searchParams(this.search);
                // TODO id=1 是个接口bug
                this.$http.get('/apis/communityComment/list', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: this.search.pageNum,
                    }, this.search)
                }, {
                    params: this.search
                }).then(res => {

                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                })
            },

            operation(id, status) {
                //暂时没有社区评论审核接口，使用商家评论接口代替
                this.$http.post('/apis/communityComment/audit', {
                // this.$http.post('/apis/storeComment/audit', {
                    id: id,
                    status: status,
                }).then(res => {
                    this.$message({
                        message: res.data.msg || '操作成功',
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