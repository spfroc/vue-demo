<template>
    <div>
        <template>
            <section class="">
                <el-row class="el-row" :key="item.name" v-for="item in companyPoint">
                    <el-col :span="2" align="center">{{item.companyName}}</el-col>
                    <el-col :span="22">
                        <el-progress :stroke-width=20 status="success" :percentage=Math.abs(item.score) :show-text=false></el-progress>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col align="center">公司服务评分</el-col>
                </el-row>
            </section>
            <el-row>
                <el-col :span="20">
                    <el-form :inline="true" :model="search" size="mini" class="">
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
                        <el-form-item label="" prop="name">
                            <el-input v-model="search.name" style="width: 120px;" placeholder="姓名搜索"></el-input>
                        </el-form-item>

                        <el-form-item label="" prop="mobile">
                            <el-input v-model="search.mobile" style="width: 120px;" placeholder="手机号搜索"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="search.companyId" style="width: 120px;" placeholder="请选择">
                                <el-option
                                        v-for="item in companyOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4">
                    <export-excel url="/export/kpi" :params="search"></export-excel>
                </el-col>

            </el-row>
            <h4>员工评分</h4>
            <div>
                <el-table
                        :data="tableData"
                >
                    <el-table-column type="index" align="center" width="80" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            align="center"
                            label="姓名">
                    </el-table-column>
                    <el-table-column align="center" prop="workOrderNum" label="接单数量">
                    </el-table-column>
                    <el-table-column align="center" prop="_5_workOrderNum" label="五分钟接单数"></el-table-column>

                    <el-table-column align="center" prop="_10_workOrderNum" label="十分钟接单数"></el-table-column>
                    <el-table-column align="center" prop="_15_workOrderNum" label="十五分钟接单数"></el-table-column>
                    <el-table-column align="center" prop="_over_workOrderNum" label="超时未接单数"></el-table-column>
                    <el-table-column align="center" prop="score" label="总分数"></el-table-column>
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
            </div>
        </template>
    </div>
</template>

<script>
    import ExportExcel from '../common/ExportExcel'

    export default {
        name: "SocialWorkerAssessment",
        components: {
            ExportExcel
        },
        data() {
            return {
                companyPoint: [
                    {
                        companyName: '公司a',
                        score: 50,
                    },
                    {
                        companyName: '公司b',
                        score: 60,
                    },
                    {
                        companyName: '公司c',
                        score: 75,
                    }
                ],

                tableData: [],

                editingRow: {},
                form: {
                    id: '',
                    name: '',
                },
                editing: false,
                isUpdate: false,
                rules: {
                    name: { required: true, message: '请输入公司名称' }
                },
                page: {

                },
                search: {
                    timeStart: '',
                    timeEnd: '',
                    companyId: '',
                    name: '',
                    mobile: '',
                },
                companyOptions: []
            }

        },
        methods: {
            getCompanyOptions() {
                this.$http.get('/apis/serviceCompany/selectList').then((res) => {
                    this.companyOptions = res.data.data.list;
                });
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
                console.log(id);
                this.$confirm('确定删除此社工考核吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.$http.post('/apis/communityCategory/delete', {
                    this.$http.post('/apis/communityCategory/delete', {
                        id: id
                    }, {
                        params: {
                            token: localStorage.getItem('auth-token')
                        }
                    }).then(res => {
                        this.$message({
                            message: res.data.msg  || '操作成功',
                            type: 'success'
                        })
                    })
                    this.fetchList()
                    this.editing = false

                }).catch(() => {
                    // do nothing
                })
            },

            cancel () {
                this.editing = false
            },

            fetchList (currentPage) {
                this.search.pageNum = currentPage || this.search.pageNum
                this.search = this.$common.searchParams(this.search);
                this.getCompany();
                // this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/apis/user/social-worker-assessment', {
                this.$http.get('/apis/kpi/socialWorkerList', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: this.search.pageNum,
                    }, this.search)
                }).then(res => {
                    this.page.total = res.data.data.total
                    this.page.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                    if(this.search.timeStart && this.search.timeEnd) {
                        this.search.createTime = [];
                        this.search.createTime.push(this.search.timeStart);
                        this.search.createTime.push(this.search.timeEnd);
                    }
                })
            },

            getCompany() {
                this.search = this.$common.searchParams(this.search);

                this.$http.get('/apis/kpi/companyList', {

                    params: this.search
                }).then(res => {
                    console.log(res);
                    this.companyPoint = res.data.data.list;
                });
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/communityCategory/addOrUpdate', this.form, {
                            params: {
                                token: localStorage.getItem('auth-token')
                            }
                        }).then(res => {
                            this.$message({
                                message: res.data.msg || '操作成功',
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
            this.getCompanyOptions();
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
</style>