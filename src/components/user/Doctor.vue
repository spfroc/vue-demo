<template>
    <div class="container">
        <el-row>
            <el-col :span="20">
                <el-form :inline="true" :model="search" size="mini" class="">
                    <el-form-item label="" prop="name">
                        <el-input v-model="search.name" style="width: 120px;" placeholder="按姓名搜索"></el-input>
                    </el-form-item>

                    <el-form-item label="" prop="mobile">
                        <el-input v-model="search.mobile" style="width: 120px;" placeholder="按手机号搜索"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="timeStart">
                        <el-date-picker
                                v-model="search.timeStart"
                                align="left"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
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
                                type="date"
                                placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4">
                <export-excel url="/export/doctor" :params="search"></export-excel>

                <el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>

            </el-col>
        </el-row>

        <template>
            <div>
                <el-table
                        :data="tableData">
                    <el-table-column type="index" align="center" width="80" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            align="center"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            prop="gender"
                            align="center"
                            :formatter="genderFormatter"
                            :show-tooltip-when-overflow=true
                            label="性别">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            min-width="110"
                            align="center"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="idCardNumber"
                            min-width="165"
                            align="center"
                            label="身份证号">
                    </el-table-column>

                    <!--医生所属字段-->
                    <el-table-column
                            prop="hospital"
                            min-width="165"
                            align="center"
                            label="医院">
                    </el-table-column>
                    <el-table-column
                            prop="department"
                            min-width="80"
                            align="center"
                            label="科室">
                    </el-table-column>
                    <el-table-column
                            prop="ocupation"
                            min-width="80"
                            align="center"
                            label="职务">
                    </el-table-column>
                    <el-table-column
                            prop="serviceContent"
                            min-width="80"
                            align="center"
                            label="服务项目">
                    </el-table-column>
                    <!--医生所属字段-->


                    <el-table-column
                            prop="createTime"
                            min-width="150"
                            align="center"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            min-width="150"
                            align="center"
                            label="修改时间">
                    </el-table-column>
                    <el-table-column width="250" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
                    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                        <el-row>
                            <el-col :span="16">
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
                                <el-form-item label="手机号" prop="mobile">
                                    <el-input v-model="form.mobile"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="" prop="headImg">
                                    <single-image-upload
                                            v-model="form.headImg"
                                            width="150"
                                            @change="picUploaded"
                                            height="200"></single-image-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item label="年龄" prop="age">
                            <el-input v-model="form.age"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idCardNumber">
                            <el-input v-model="form.idCardNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭住址" prop="homeAddress">
                            <el-input v-model="form.homeAddress"></el-input>
                        </el-form-item>
                        <!--医生所属字段-->
                        <el-form-item label="医院" prop="hospital">
                            <el-input v-model="form.hospital"></el-input>
                        </el-form-item>
                        <el-form-item label="科室" prop="department">
                            <el-input v-model="form.department"></el-input>
                        </el-form-item>
                        <el-form-item label="职务" prop="ocupation">
                            <el-input v-model="form.ocupation"></el-input>
                        </el-form-item>
                        <el-form-item label="服务项目" prop="serviceContent">
                            <el-input v-model="form.serviceContent"></el-input>
                        </el-form-item>
                        <!--医生所属字段-->
                        <el-form-item label="权限是否开启登录权限" prop="homeAddress">
                            <el-radio v-model="form.canLogin" label=1>是</el-radio>
                            <el-radio v-model="form.canLogin" label=0>否</el-radio>
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
    import { checkNumber } from '../../util/validate'
    import ExportExcel from '../common/ExportExcel'
    import SingleImageUpload from "../common/SingleImageUpload"

    export default {
        name: "Doctor",
        components: {
            ExportExcel, SingleImageUpload
        },
        data () {
            return {
                search: {
                    name: '',
                    mobile: '',
                    createTime: '',
                    timeStart: '',
                    timeEnd: '',
                },
                form: {
                    id: '',
                    name: '',
                    mobile: '',
                    idCardNumber: '',
                    sex: '',
                    homeAddress: '',
                    age: '',
                    canLogin: '',
                    userType: 2,
                    headImg: '',
                    hospital: '',
                    department: '',
                    ocupation: '',
                    serviceContent: '',
                },
                page: {
                    pageSize: 10
                },
                tableData: [],
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
                editingRow: {},
                editing: false,
                isUpdate: false,
                rules: {
                    name: { required: true, message: '请输子女姓名', trigger: 'blur' },
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: isValidPhone, trigger: 'blur' }
                    ],
                    age: [
                        // { required: true, message: '请输入年龄', trigger: 'blur' },
                        { validator: checkNumber, trigger: 'blur' }
                    ],
                    // sex: { required: true, message: '请选择性别', trigger: 'blur' },
                    // homeAddress: { required: true, message: '请输入家庭住址', trigger: 'blur' },
                    // idCardNumber: { required: true, message: '请输入身份证号', trigger: 'blur' },
                }

            };
        },

        methods: {
            picUploaded(res, file) {
                this.form.headImg = res.pic
            },

            genderFormatter (row, col, data) {
                return row.sex == 1 ? '男' : '女';
            },
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    userType: 2,
                }
            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.$http.get('/apis/user/detail', {
                    params: {
                        id: row.id
                    }
                }).then(res => {
                    console.log(res.data.data.bindOldManList);
                    this.form = Object.assign({}, res.data.data)

                });
                // this.form = Object.assign({}, row)
                this.form.userType = 3;
            },

            remove (id) {
                this.$confirm('确定删除此医生信息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/user/delete', {
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
                        userType: 2,
                    }

                }).catch(() => {
                    // do nothing
                })
            },

            cancel () {
                this.editing = false
            },


            fetchList (currentPage) {
                this.search.pageNum = currentPage || 1
                this.search = this.$common.searchParams(this.search);
                this.$http.get('/apis/user/list', {
                    params: Object.assign({
                        pageSize: 10,
                        userType: 2
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
                        this.$http.post('/apis/user/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.msg || '操作成功',
                                type: 'success'
                            })
                            this.form = {
                                userType: 2,
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
            this.fetchList(1);
        }
    }
</script>

<style scoped>

</style>