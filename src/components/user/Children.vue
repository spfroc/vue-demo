<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <el-tabs v-model="activeName" @tab-click="tabSwitch">
                        <el-tab-pane label="信息列表" name="children"></el-tab-pane>
                        <el-tab-pane label="审核列表" name="approval"></el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            <el-col :span="17">
                <div class="grid-content bg-purple">
                    <el-form :inline="true" :model="search" size="mini" class="">
                        <el-form-item label="" prop="name">
                            <el-input v-model="search.name" placeholder="按标题搜索"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="createTime">
                            <el-date-picker
                                    v-model="search.createTime"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="fetchList">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <el-button v-if="activeName=='children'" type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
                </div>
            </el-col>
        </el-row>
        <template>
            <div>
                <el-table
                        :data="tableData">
                    <el-table-column type="index" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            align="center"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName=='children' ? true : false"
                            prop="gender"
                            align="center"
                            :formatter="genderFormatter"
                            :show-tooltip-when-overflow=true
                            label="性别">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            align="center"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="IDNumber"
                            align="center"
                            label="身份证号">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName == 'approval' ? true : false"
                            prop="relationShip"
                            align="center"
                            label="与老人关系">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName == 'approval' ? true : false"
                            prop="elderInfo.name"
                            align="center"
                            label="老人姓名">
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
                            <el-button v-if="activeName=='approval'" @click="() => { edit(scope.row) }" type="info" size="mini">详情</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 2) }" type="success" size="mini">通过</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 3) }" type="danger" size="mini">不通过</el-button>
                            <el-button v-if="activeName=='children'" @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button v-if="activeName=='children'" @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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

                <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name" ></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="form.gender" placeholder="请选择">
                                <el-option
                                        v-for="item in genderOptions"
                                        :key="item.value"
                                        :disabled=!canInputEdit
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.mobile"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="IDNumber">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.IDNumber"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="家庭住址" prop="address">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.address"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="老人姓名" prop="elderName" v-if="!canInputEdit">
                            <el-input

                                    :disabled=!canInputEdit
                                    v-model="form.elderInfo.name"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="老人身份证号" prop="elderIDNumber" v-if="!canInputEdit">
                            <el-input

                                    :disabled=!canInputEdit
                                    v-model="form.elderInfo.IDNumber"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
                            <el-button v-if="activeName=='children'" type="primary" @click="onSubmit">确定</el-button>

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
        name: "Children",
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
            },

            canInputEdit: function() {
                return this.activeName == 'children' ? true : false;

            },

            currentListApi: function() {
                return this.activeName == 'children' ? this.childrenListApi : this.approvalListApi
            },

            dialogTitle: function() {
                if(this.activeName == 'children') {
                    if(this.isUpdate) {
                        return '编辑';
                    } else {
                        return '添加';
                    }
                } else {
                    return '详情';
                }
            },
        },
        data() {
            return {

                genderOptions: [
                    {
                        label: '男',
                        value: 1,
                    },
                    {
                        label: '女',
                        value: 2,
                    },
                ],
                activeName: 'children',
                childrenListApi: '/apis/adminApi/user/children',
                approvalListApi: '/apis/adminApi/user/childrenApproval',
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
                    name: '',
                    address: '',
                    gender: '',
                    mobile: '',
                    // status: '',
                    createTime: '',
                    IDNumber:'',
                    updateTime: '',
                    elderInfo: {
                        id: '',
                        name: '',
                        IDNumber: '',
                    }
                    // approvedAt: '',
                    // rejectedAt: '',
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
            genderFormatter (row, col, data) {
                return row.gender == 1 ? '男' : '女';
            },
            tabSwitch(tab, event) {
                this.search = {};
                // this.form = {};
                this.fetchList(1);
                // console.log(tab, event);
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
                if(this.activeName == 'approval') {
                    return status == 1 ? true : false;
                } else {
                    return false;
                }
            },
            remove (id) {
                this.$confirm('确定删除此子女信息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/adminApi/userChildren/delete', {
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
                this.$http.get(this.currentListApi, {
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
                this.$http.post('/apis/adminApi/userChildren/approval', {
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
                // this.form = {}
            },
            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$http.post('/apis/adminApi/userChildren/addOrUpdate', this.form).then(res => {
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
            this.fetchList(1);
        }
    }
</script>

<style scoped>
</style>