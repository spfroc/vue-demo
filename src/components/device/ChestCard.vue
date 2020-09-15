<template>
    <div>
        <el-form :inline="true" :model="search" size="mini" class="">
            <el-form-item label="" prop="imei">
                <el-input v-model="search.imei" placeholder="imei号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="fetchList">搜索</el-button>
            </el-form-item>
        </el-form>
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
                            prop="imei"
                            align="center"
                            label="设置imei号">
                    </el-table-column>

                    <el-table-column
                            prop="status"
                            align="center"
                            :formatter="statusFormatter"
                            label="设备状态">
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
                    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="imei号" prop="imei">
                            <el-input v-model="form.imei"></el-input>
                        </el-form-item>
                        <el-form-item label="老人姓名" prop="oldManName">
                            <el-input v-model="form.oldManName"></el-input>
                        </el-form-item>
                        <el-form-item label="老人手机号" prop="oldManMobile">
                            <el-input v-model="form.oldManMobile"></el-input>
                        </el-form-item>

                        <el-form-item label="亲情号1" prop="phone1">
                            <el-input v-model="form.phone1"></el-input>
                        </el-form-item>

                        <el-form-item label="亲情号2" prop="phone2">
                            <el-input v-model="form.phone2"></el-input>
                        </el-form-item>

                        <el-form-item label="亲情号3" prop="phone3">
                            <el-input v-model="form.phone3"></el-input>
                        </el-form-item>

                        <el-form-item  label="电话白名单" prop="whitePhones" aria-placeholder="23432">
                            <el-input v-show="false" v-model="form.whitePhones" placeholder='多个手机号使用英文格式逗号 "," 分割'></el-input>
                            <el-row>
                                <el-col :span="12" v-if="whiteList.length > 0" >
                                    <el-tag
                                            class="el-tag-style"
                                            v-for="(tag, index) in whiteList"
                                            v-if="tag"
                                            :key="index"
                                            closable
                                            @close="removePhone(index)"
                                    >
                                        {{tag}}
                                    </el-tag>
                                </el-col>
                                <el-col :span="12">
                                    <el-button @click="addPhone()" type="primary">添加</el-button>
                                </el-col>

                            </el-row>
                        </el-form-item>
                        <!--<el-form-item label="设备统一定位上报时间" label-width="180px" prop="oldManMobile">-->
                            <!--<el-select v-model="form.oldManMobile" placeholder="请选择">-->
                                <!--<el-option-->
                                        <!--v-for="item in pushSettingOptions"-->
                                        <!--:key="item.value"-->
                                        <!--:label="item.label"-->
                                        <!--:value="item.value">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->

                        <section v-if="whiteList.length > 0">
                            <el-form-item v-for="(item, index) in whiteList" :key="index">
                                <el-input v-model="whiteList[index]" style="width: 30%"></el-input>
                                <el-button @click="removePhone(index)" type="warning">删除</el-button>
                            </el-form-item>
                        </section>

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
    export default {
        name: "ChestCard",

        data () {
            return {
                tableData: [],
                editing: false,
                isUpdate: false,
                rules: {
                    imei: {required: true, message: '请输入imei号'}
                },
                page: {},
                search: {},
                editingRow: {},

                form: {
                    id: '',
                    imei: '',
                    oldManName: '',
                    oldManMobile: '',
                    phone1: '',
                    phone2: '',
                    phone3: '',
                    whitePhones: '',

                },

                whiteList: [],
                pushSettingOptions: [
                    {
                        value: 1,
                        label: '五分钟',
                    },
                    {
                        value: 2,
                        label: '三十分钟',
                    },

                    {
                        value: 3,
                        label: '六十分钟',
                    },
                ],
            }
        },

        methods: {

            addPhone() {
                this.whiteList.push('');
            },
            removePhone(index) {
                console.log(index);
                this.whiteList.splice(index, 1)
            },

            statusFormatter (row) {
                return row.status && row.status ? '正常' : '离线';
            },
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {};
                this.whiteList = []

            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.whiteList = row.whitePhones.split(',');
                this.form = Object.assign({}, row)
            },
            remove (id) {
                this.$confirm('确定删除此胸牌吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/badge/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.msg || '操作成功',
                            type: 'success'
                        })
                        this.fetchList()
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

            fetchList () {
                this.$http.get('/apis/badge/list', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: 1
                    }, this.search)
                }).then(res => {
                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.whitePhones = '';
                        this.whiteList.forEach((item, index) => {
                            if(index > 0) {
                                this.form.whitePhones += ','
                            }
                            this.form.whitePhones += item
                        })
                        this.$http.post('/apis/badge/addOrUpdate', this.form).then(res => {
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
    .el-tag-style:not(:first-child) {
        margin-left: 5px;
    }
</style>