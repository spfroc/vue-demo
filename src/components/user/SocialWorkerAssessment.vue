<template>
    <div>
        <template>
            <section class="header-bar">
                <el-row class="el-row" v-for="item in companyPoint">
                    <el-col :span="1" align="center">{{item.name}}</el-col>
                    <el-col :span="23">
                        <el-progress stroke-width="20" status="success" :percentage=item.point :show-text=false></el-progress>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col align="center">公司服务评分</el-col>
                </el-row>
            </section>
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
                    <el-form-item label="" prop="name">
                        <el-input v-model="search.name" placeholder="姓名搜索"></el-input>
                    </el-form-item>

                    <el-form-item label="" prop="mobile">
                        <el-input v-model="search.mobile" placeholder="手机号搜索"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="search.companyId" placeholder="请选择">
                            <el-option
                                    v-for="item in companyOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                    </el-form-item>
                </el-form>
            </section>
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
                    <el-table-column align="center" prop="orderNum" label="接单数量">
                    </el-table-column>
                    <el-table-column align="center" prop="five" label="五分钟接单数"></el-table-column>

                    <el-table-column align="center" prop="ten" label="十分钟接单数"></el-table-column>
                    <el-table-column align="center" prop="fifteen" label="十五分钟接单数"></el-table-column>
                    <el-table-column align="center" prop="timeOut" label="超时未接单数"></el-table-column>
                    <el-table-column align="center" prop="total" label="总分数"></el-table-column>
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
    export default {
        name: "SocialWorkerAssessment",

        data() {
            return {
                companyPoint: [
                    {
                        name: '公司a',
                        point: 50,
                    },
                    {
                        name: '公司b',
                        point: 60,
                    },
                    {
                        name: '公司c',
                        point: 75,
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
                search: {}
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
                this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/apis/user/social-worker-assessment', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: this.search.pageNum,
                    }, this.search)
                }).then(res => {
                    this.page.total = res.data.data.total
                    this.page.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                })
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
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }
</style>