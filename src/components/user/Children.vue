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
                            prop="idCardNumber"
                            align="center"
                            label="身份证号">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName == 'approval' ? true : false"
                            prop="relation"
                            align="center"
                            label="与老人关系">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName == 'approval' ? true : false"
                            prop="oldManName"
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
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 1) }" type="success" size="mini">通过</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 2) }" type="danger" size="mini">不通过</el-button>
                            <el-button v-if="activeName=='children'" @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <!--<el-button v-if="activeName=='children'" @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" size="mini">删除</el-button>-->
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
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="form.sex" placeholder="请选择">
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
                        <el-form-item label="身份证号" prop="idCardNumber">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.idCardNumber"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="家庭住址" prop="homeAddress">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.homeAddress"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="老人姓名" prop="oldManName" v-if="!canInputEdit">
                            <el-input

                                    :disabled=!canInputEdit
                                    v-model="form.oldManName"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="老人身份证号" prop="oldManIdCardNumber" v-if="!canInputEdit">
                            <el-input

                                    :disabled=!canInputEdit
                                    v-model="form.oldManIdCardNumber"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="绑定老人">
                            <section
                                v-if="form.bindOldMan && form.bindOldMan.length && form.bindOldMan[0].oldManId > 0">
                                <el-tag v-for="oldMan in form.bindOldMan"
                                        :closable=true
                                        @close="removeOldMan(oldMan)"
                                        v-bind:key="oldMan.oldManId">{{oldMan.oldManId}}
                                </el-tag>
                            </section>
                            <el-button @click="bindButton" size="small" type="primary">添加绑定</el-button>
                        </el-form-item>

                        <section
                            v-if="form.bindOldMan.length > 0 && activeName == 'children'"
                            v-for="(oldMan, index) in form.bindOldMan"
                            :key="index"
                            :label="index"
                            :value="oldMan.oldManId"
                        >
                            <el-form-item label="选择老人" label-width="100px">
                                <el-select @change="getOldManOptions" v-model="form.bindOldMan[index].name" :prop="'oldMan.' + index + '.villageId'" placeholder="请选择">
                                    <el-option
                                            v-for="item in villageOptions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id+'_'+index">
                                    </el-option>
                                </el-select>
                                <el-select v-model="form.bindOldMan[index].id" :prop="'oldMan.' + index + '.id'" :placeholder="'请选择'+index">
                                    <el-option
                                            v-for="item in oldManOptions[index]"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="亲属关系" label-width="100px">
                                <el-input :style="{width:'20%'}" v-model="form.bindOldMan[index].relation" :prop="'oldMan.' + index + '.relation'"></el-input>
                                <el-button @click.prevent="removeOldMan(oldMan)">删除</el-button>
                            </el-form-item>
                            <!--<bind-parents :index="index" :bind-old-man="form.bindOldMan" :old-man-options="oldManOptions[index]"></bind-parents>-->

                        </section>
                        <el-form-item>
                            <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
                            <el-button v-if="activeName=='children'" type="primary" @click="onSubmit">确定</el-button>
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
    import { isValidPhone } from '../../util/validate'
    import BindParents from '../common/BindParents'
    export default {
        name: "Children",
        components: {
            Editor, BindParents
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
                bindOldMan: {
                    id: '',
                    relation: '',
                },
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
                villageOptions: [
                    {
                        label: '1村',
                        value: 1,
                    },
                    {
                        label: '2村',
                        value: 2,
                    },
                ],

                oldManOptions: [],
                activeName: 'children',
                childrenListApi: '/apis/user/list?userType=1',
                approvalListApi: '/apis/childApply/list',
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
                    homeAddress: '',
                    sex: '',
                    userType: 1,
                    mobile: '',
                    idCardNumber:'',
                    bindOldMan: [],
                },
                editing: false,
                isUpdate: false,
                search: {
                    name: '',
                    createTime: ''
                },
                rules: {
                    name: { required: true, message: '请输子女姓名', trigger: 'blur' },
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: isValidPhone, trigger: 'blur' }
                    ],
                    sex: { required: true, message: '请选择性别', trigger: 'blur' },
                    homeAddress: { required: true, message: '请输入家庭住址', trigger: 'blur' },
                    idCardNumber: { required: true, message: '请输入身份证号', trigger: 'blur' },
                }
            }

        },
        methods: {
            getVillageOptions () {
                this.$http.get('/apis/village/selectList').then((res) => {
                    // console.log(res.data.data);
                    this.villageOptions = res.data.data.list
                })
            },

            getOldManOptions(mixedParams) {
                let _ = mixedParams.indexOf('_')
                let villageId = mixedParams.substr(0, _);
                let index = mixedParams.substr((_+1));
                this.$http.get('/apis/oldMan/selectList', {
                    params: {
                        villageId: villageId
                    },

                }).then((res) => {
                    this.oldManOptions[index] = res.data.data.list;
                    console.log('index: ' +index);
                    console.log(this.oldManOptions[index]);
                })
            },
            removeOldMan (oldMan) {
                this.form.bindOldMan.splice(this.form.bindOldMan.indexOf(oldMan), 1);
            },
            bindButton () {
                this.form.bindOldMan.push({
                    id:'',
                    name:'',
                    relation: '',
                });
                this.getVillageOptions();
            },

            genderFormatter (row, col, data) {
                return row.sex == 1 ? '男' : '女';
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
                this.form = {
                    id: '',
                    name: '',
                    homeAddress: '',
                    sex: '',
                    userType: 1,
                    mobile: '',
                    idCardNumber:'',
                    bindOldMan: [],
                }
                this.oldManOptions = [];
            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.$http.get('/apis/user/detailForChild', {
                    params: {
                        id: row.id
                    }
                }).then(res => {

                    this.form = Object.assign({}, res.data.data)
                    this.form.bindOldMan = res.data.data.bindOldManList;
                    console.log(this.form.bindOldMan);

                });
                // this.form = Object.assign({}, row)
                this.form.userType = 1;
            },

            showOperationButton(status) {
                if(this.activeName == 'approval') {
                    return status == "0" ? true : false;
                } else {
                    return false;
                }
            },
            remove (id) {
                this.$confirm('确定删除此子女信息吗？', '提示', {
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
                        userType: 1,
                    }

                }).catch(() => {
                    // do nothing
                })
            },

            cancel () {
                this.editing = false
                this.form = {
                    id: '',
                    name: '',
                    homeAddress: '',
                    sex: '',
                    userType: 1,
                    mobile: '',
                    idCardNumber:'',
                    bindOldMan: [],
                }
            },


            fetchList (currentPage) {
                this.search.pageNum = currentPage || this.search.pageNum
                this.search = this.$common.searchParams(this.search);
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

            operation(id, status) {
                this.$http.post('/apis/childApply/audit', {
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
                // this.form = {}
            },
            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    console.log(this.form.bindOldMan);
                    this.form.bindOldManListStr = JSON.stringify(this.form.bindOldMan);
                    this.form.bindOldMan = this.form.bindOldManListStr;
                    if(this.form.id == '') {
                        delete this.form.id;
                        delete this.form.bindOldManListStr;
                    }
                    if (valid) {
                        this.$http.post('/apis/user/addOrUpdateForChild', this.form).then(res => {
                        // this.$http.post('http://127.0.0.1:8000/api/test', this.form).then(res => {
                            this.$message({
                                message: res.data.msg || '操作成功',
                                type: 'success'
                            })
                            this.fetchList()
                            this.editing = false
                            // console.log(this.form);
                        })
                    } else {
                        console.log('error submit!!')
                        console.log(this.form.bindOldMan);
                        if(this.isUpdate) {
                            this.$http.get('/apis/user/detailForChild', {
                                params: {
                                    id: this.form.id
                                }
                            }).then(res => {
                                console.log(res.data.data);
                                this.form.bindOldMan = res.data.data.bindOldMan || [];
                            });
                        } else {
                            this.form.bindOldMan = [];
                        }
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
    ul li {

    }
</style>