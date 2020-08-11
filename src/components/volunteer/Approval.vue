<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <el-tabs v-model="activeName" @tab-click="tabSwitch">
                        <el-tab-pane label="信息列表" name="info"></el-tab-pane>
                        <el-tab-pane label="审核列表" name="approval"></el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            <el-col :span="17">
                <div class="grid-content bg-purple">
                    <el-form :inline="true" :model="search" size="mini" class="">
                        <el-form-item label="" prop="name">
                            <el-input v-model="search.name" placeholder="按姓名搜索"></el-input>
                        </el-form-item>

                        <el-form-item label="" prop="mobile">
                            <el-input v-model="search.mobile" placeholder="按手机号搜索"></el-input>
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
                        <el-form-item label="" prop="activeTitle">
                            <el-input v-model="search.activeTitle" placeholder="按活动搜索"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <el-button v-if="activeName=='info'" type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
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
                            prop="nation"
                            align="center"
                            label="民族">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            align="center"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="activityTitle"
                            align="center"
                            label="活动">
                    </el-table-column>
                    <el-table-column
                            prop="politicalStatus"
                            align="center"
                            label="政治面貌">
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
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 1) }" type="success" size="mini">通过</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 2) }" type="danger" size="mini">不通过</el-button>
                            <el-button v-if="activeName=='info'" @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button v-if="activeName=='info'" @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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

                        <el-row>
                            <el-col :span="18">
                                <el-form-item v-show="form.id" label="ID" prop="id">
                                    <el-input :disabled="true" v-model="form.id"></el-input>
                                </el-form-item>
                                <el-form-item label="姓名" prop="name">
                                    <el-input v-model="form.name" ></el-input>
                                </el-form-item>
                                <el-form-item label="性别" prop="sex">
                                    <el-select v-model="form.sex" placeholder="请选择">
                                        <el-option
                                                v-for="item in genderOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="民族" prop="nation">
                                    <el-input v-model="form.nation" ></el-input>
                                </el-form-item>
                                <el-form-item label="出生年月" prop="birthdate">
                                    <el-date-picker
                                            v-model="form.birthdate"
                                            type="date"
                                            placeholder="出生年月">
                                    </el-date-picker>
                                </el-form-item>

                                <el-form-item label="手机号" prop="mobile">
                                    <el-input v-model="form.mobile"></el-input>
                                </el-form-item>
                                <el-form-item label="活动" prop="activeTitle">
                                    <el-input v-model="form.activityTitle"></el-input>
                                </el-form-item>
                                <el-form-item label="身份证号" prop="idCardNumber">
                                    <el-input v-model="form.idCardNumber"></el-input>
                                </el-form-item>
                                <el-form-item label="籍贯" prop="nativePlace">
                                    <el-input v-model="form.nativePlace"></el-input>
                                </el-form-item>
                                <el-form-item label="政治面貌" prop="politicalStatus">
                                    <el-input v-model="form.politicalStatus"></el-input>
                                </el-form-item>
                                <el-form-item label="职业" prop="career">
                                    <el-input v-model="form.career"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="" prop="photo" label-width="20px">
                                    <single-image-upload v-model="form.photo" width="150" height="250"></single-image-upload>
                                    <section>个人一寸照片</section>
                                </el-form-item>
                            </el-col>
                        </el-row>



                        <el-form-item>
                            <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
                            <el-button v-if="activeName=='info'" type="primary" @click="onSubmit">确定</el-button>
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
    import Editor from '../common/Editor'
    import SingleImageUpload from '../common/SingleImageUpload'

    export default {
        name: "Approval",
        components: {
            Editor,SingleImageUpload
        },
        data () {
            return {
                activeName: 'info',
                tableData: [],
                search: {},
                page: {},
                infoListApi: '/apis/adminApi/volunteer/list',
                approvalListApi: '/apis/adminApi/volunteer/auditList',

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
                form: {
                    id: '',
                    name: '',
                    sex: '',
                    nation: '',
                    birthdate: '',
                    mobile: '',
                    idCardNumber: '',
                    nativePlace: '',
                    politicalStatus: '',
                    career: '',
                    description: '',
                    photo: '',
                    activityTitle: '',
                    status: ''
                },
                editing: false,
                isUpdate: false,
                editingRow: {},
                rules: {},
            }
        },
        computed: {
            currentListApi: function() {
                return this.activeName == 'info' ? this.infoListApi : this.approvalListApi
            },

            showApprovalButton: function() {
                if(this.editingRow.status == 1) {
                    return true;
                } else {
                    return false;
                }
            },

            dialogTitle: function() {
                if(this.activeName == 'info') {
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
        methods: {
            tabSwitch(tab, event) {
                this.search = {};
                this.fetchList(1);
            },

            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    userType: 1,
                }
            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.form = Object.assign({}, row)

            },

            remove (id) {
                this.$confirm('确定删除此志愿者吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/adminApi/volunteer/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        })
                        this.fetchList(1)
                    })
                    this.editing = false
                    this.form = {
                        userType: 1,
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
                    this.tableData = res.data.data.list;
                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$http.post('/apis/adminApi/user/addOrUpdateForChild', this.form).then(res => {
                            this.$message({
                                message: res.data.message,
                                type: 'success'
                            })
                            this.form = {
                                userType: 1,
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
            operation(id, status) {
                this.$http.post('/apis/adminApi/volunteer/audit', {
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

            showOperationButton(status) {
                if(this.activeName == 'approval') {
                    return status == 1 ? true : false;
                } else {
                    return false;
                }
            },
        },

        mounted() {
            this.fetchList(1);
        }
    }
</script>

<style scoped>

</style>