<template>
    <div>
        <el-form :inline="true" :model="search" size="mini" class="">
            <el-form-item label="" prop="imei">
                <el-input v-model="search.imei" style="width: 120px;" placeholder="imei号"></el-input>
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
                            label="设备imei号">
                    </el-table-column>

                    <el-table-column
                            prop="status"
                            align="center"
                            :formatter="statusFormatter"
                            label="设备状态">
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

                <el-dialog :close-on-click-modal="false" :title="(isUpdate ? '修改' : '添加') + '胸牌'" :visible.sync="editing" :append-to-body="true">

                    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                        <el-form-item>
                            <section style="color: red; font-size: 18px;"><strong>温馨提示:</strong>绑定胸卡必须保证胸卡中已放置移动卡并处于开机状态</section>
                        </el-form-item>
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="imei号" prop="imei">
                            <el-input v-model="form.imei" style="width: 70%;" @focus="clearCheckUsableError"></el-input>

                            <el-button @click="clickValidateUsability" type="primary" style="margin-left: 20px">检测</el-button>
                        </el-form-item>
                        <el-form-item label="老人姓名" prop="oldManName">
                            <el-input v-model="form.oldManName" style="width: 70%;"></el-input>
                        </el-form-item>
                        <el-form-item label="老人手机号" prop="oldManMobile">
                            <el-input v-model="form.oldManMobile" style="width: 70%;"></el-input>
                        </el-form-item>

                        <el-form-item label="亲情号1" prop="phone1">
                            <el-input v-model="form.phone1" style="width: 70%;"></el-input>
                        </el-form-item>

                        <el-form-item label="亲情号2" prop="phone2">
                            <el-input v-model="form.phone2" style="width: 70%;"></el-input>
                        </el-form-item>

                        <el-form-item label="亲情号3" prop="phone3">
                            <el-input v-model="form.phone3" style="width: 70%;"></el-input>
                        </el-form-item>

                        <el-form-item  label="电话白名单" prop="whitePhones" aria-placeholder="">
                            <el-row v-if="whiteList.length > 0" style="margin-bottom: 20px;">
                                <el-col :span="20" v-if="whiteList.length > 0" >
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
                            </el-row>
                            <el-input v-show="false" v-model="form.whitePhones" placeholder='多个手机号使用英文格式逗号 "," 分割'></el-input>
                            <el-form-item prop="phoneNumber">
                                <el-input @focus="clearError" v-model="form.phoneNumber" placeholder="单行输入" style="width:20%;"></el-input>
                                <span v-if="showError" style="color: red">{{errorText}}</span>
                            </el-form-item>

                            <el-row style="margin-top: 20px">
                                <el-col :span="12">
                                    <el-button @click="addPhone()" type="">添加</el-button>
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
                        <el-form-item>
                            <el-button type="primary" :disabled="usability" @click="onSubmit">确定</el-button>
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

    export default {
        name: "ChestCard",

        data () {
            return {
                tableData: [],
                editing: false,
                isUpdate: false,
                rules: {
                    imei: [

                        {validator: this.usabilityValidator, trigger: 'blur'},
                        {required: true , trigger: 'blur'},
                    ],
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
                    phoneNumber: '',

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
                showError: false,
                errorText: '',
                usability: false,
                showUsabilityError: false,
            }
        },

        methods: {
            clickValidateUsability() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            usabilityValidator(rule, value, callback) {
                if(!value) {
                    return callback(new Error('请输入imei号'))
                }

                this.$http.get('/apis/badge/activatable', {
                    params: {
                        imei: this.form.imei
                    },

                }).then(res => {
                    if(res.data.data.result == false) {
                        callback(new Error('未在服务器中查询到此胸卡，请将胸卡重新开机，等待五分钟后重新检测'));
                    } else {
                        callback();
                    }
                });

            },

            clearCheckUsableError() {
                this.showUsabilityError = false;
            },
            //检测可用性
            checkUsability() {
                this.$http.get('/apis/badge/list').then(res => {
                    console.log(res);
                    // if(true) {
                    //     this.available();
                    // } else {
                        this.notAvailable();
                    // }
                });
            },

            available() {
                this.showUsabilityError = false;
                this.usability = true;
            },

            notAvailable() {
                this.showUsabilityError = true;
                this.usability = false;
            },

            clearError() {
                this.showError = false;
            },
            addPhone() {
                let reg = /1[0-9]{10}|\(?\d{0,4}\)?-?\s?\d{8}/
                if(this.whiteList.length == 15) {
                    this.showError = true;
                    this.errorText = '白名单不超过15个';

                    return;
                }
                if(this.form.phoneNumber && reg.test(this.form.phoneNumber)) {
                    this.whiteList.push(this.form.phoneNumber);
                    this.form.phoneNumber = '';

                } else {
                    this.showError = true;
                    this.errorText = '手机号格式不正确';
                    return;
                }
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
                this.clearError();

            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.whiteList = row.whitePhones.split(',');
                this.form = Object.assign({}, row)
                this.clearError()
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
                    console.log(valid);
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