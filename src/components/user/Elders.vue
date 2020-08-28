<template>
    <div>
        <section class="header-bar">
            <el-form :inline="true" :model="search" size="mini" class="">
                <el-form-item label="" prop="name">
                    <el-input v-model="search.name" placeholder="姓名搜索"></el-input>
                </el-form-item>

                <el-form-item label="" prop="mobile">
                    <el-input v-model="search.mobile" placeholder="手机号搜索"></el-input>
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
        </section>
        <section class="header-bar">
        <el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
        </section>
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
                            width=80
                            label="民族">
                    </el-table-column>
                    <el-table-column
                            prop="sex"
                            width=50
                            :formatter="genderFormatter"
                            align="center"
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
                            prop="age"
                            width=50
                            align="center"
                            label="年龄">
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
                    <el-table-column
                            width="250"
                            label="操作"
                            align="center"
                    >
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

                <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                        <el-row>
                            <el-col :span="16">
                                <el-form-item v-show="form.id" label="ID" prop="id">
                                    <el-input :disabled="true" v-model="form.id"></el-input>
                                </el-form-item>
                                <el-form-item label="姓名" prop="name">
                                    <el-input v-model="form.name"></el-input>
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
                                    <el-input v-model="form.nation"></el-input>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="一寸照片" prop="headImg">
                                    <single-image-upload
                                            v-model="form.headImg"
                                            width="150"
                                            @change="picUploaded"
                                            height="200"></single-image-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>


                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="form.mobile"></el-input>
                        </el-form-item>

                        <el-form-item label="身份证号" prop="idCardNumber">
                            <el-input v-model="form.idCardNumber"></el-input>
                        </el-form-item>

                        <el-form-item label="年龄" prop="age">
                            <el-input v-model="form.age"></el-input>
                        </el-form-item>
                        <el-form-item label="所在村庄" prop="villageId">
                            <el-select v-model="form.villageId" placeholder="请选择">
                                <el-option
                                        v-for="item in villageOptions"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="家庭住址" prop="homeAddress">
                            <el-input v-model="form.homeAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="">
                            <el-button>老人行动轨迹</el-button>
                        </el-form-item>
                        <el-form-item label="已绑定子女" prop="">
                            <section
                                    v-if="form.children && form.children.length > 0 && form.children[0].name">
                                <el-tag v-for="child in form.children"
                                        :closable=true
                                        @close="removeChild(child)"
                                        v-bind:key="child.id">{{child.name}}</el-tag>
                            </section>
                            <el-button @click="bindButton" size="small" type="primary">添加绑定</el-button>
                        </el-form-item>

                        <section
                                v-if="form.children.length > 0"
                                v-for="(item, index) in form.children"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            <el-form-item label="子女" label-width="100px">
                                <el-autocomplete
                                        v-model="form.children[index].id"
                                        :fetch-suggestions="searchChildren"
                                        placeholder="选择子女"
                                        @select="childSelected(item, index)"
                                        value-key="mobile"
                                        value="id"
                                        key="id"
                                        :style="{width:'20%'}"
                                ></el-autocomplete>

                            </el-form-item>
                            <el-form-item label="关系">
                                <el-input :style="{width:'20%'}" v-model="form.children[index].relation"></el-input>
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
    import Editor from "../common/Editor"
    import SingleImageUpload from "../common/SingleImageUpload"

    export default {
        name: "Elders",
        components: {
            Editor, SingleImageUpload
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
                childrenOptions: [],
                genderOptions: [
                    {
                        label: '男',
                        value: "1",
                    },
                    {
                        label: '女',
                        value: "2",
                    },
                ],
                childMobile: '',
                childRelation: '父子',
                bindCount: 0,
                tableData: [],
                page: {
                    pageSize: 10
                },
                editingRow: {},
                form: {
                    id: '',
                    name: '',
                    age: '',
                    sex: '',
                    mobile: '',
                    idCardNumber: '',
                    nation: '',
                    villageId: '',
                    children: [],
                },
                editing: false,
                isUpdate: false,
                search: {
                    name: '',
                    createTime: '',
                    mobile: '',
                },
                rules: {

                },
                villageOptions: [],
            }

        },
        methods: {
            picUploaded(res, file) {
                this.form.headImg = res.pic
            },
            searchChildren (queryString, cb) {
                let childrenOptions = this.childrenOptions;
                console.log('children', this.childrenOptions);
                let results = queryString ? childrenOptions.filter(this.createStateFilter(queryString)) : childrenOptions;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500);
            },

            createStateFilter(queryString) {
                return (state) => {
                    return (state.mobile.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            childSelected (item, index) {
                console.log('item',item);
                console.log('index',index);
                // let bindChild = this.form.children.filter(this.bindChildrenFilter(item))
                this.form.children[index] = {
                    id: item.id,
                    name: item.name,
                    relation: this.childRelation ? this.childRelation : '母子',
                }
                console.log(this.form.children);

            },

            bindChildrenFilter (item) {
              return (state) => {
                  return state.id == item.id;
              }
            },

            removeChild (child) {
                console.log(this.form.children.indexOf(child));
                this.form.children.splice(this.form.children.indexOf(child), 1);
            },
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    id: '',
                    name: '',
                    age: '',
                    sex: '',
                    mobile: '',
                    idCardNumber: '',
                    nation: '',
                    villageId: '',
                    children: [],
                }
            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.$http.get('/apis/oldMan/detail', {
                    params: {
                        id: row.id,
                    }
                }).then(res => {
                    this.form = Object.assign({}, res.data.data)
                });

            },

            bindButton () {
                this.form.children.push({
                    id: '',
                    name: '',
                    relation: ''
                });
            },

            genderFormatter (row, col, data) {
                return row.sex == 1 ? '男' : '女';
            },
            remove (id) {
                this.$confirm('确定删除此老人信息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/oldMan/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.msg || '操作成功',
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
            getVillageOptions () {
                this.$http.get('/apis/village/list', {
                    params: {
                        pageSize: 100,
                    }
                }).then(res => {
                    this.villageOptions = res.data.data.list;
                });
            },

            fetchList (currentPage) {
                this.search.pageNum = currentPage || this.search.pageNum
                this.search = this.$common.searchParams(this.search);

                // TODO id=1 是个接口bug
                this.$http.get('/apis/oldMan/list', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: 1,
                    }, this.search)
                }).then(res => {

                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                    if(this.search.timeStart && this.search.timeEnd) {
                        this.search.createTime = [];
                        this.search.createTime.push(this.search.timeStart);
                        this.search.createTime.push(this.search.timeEnd);
                    }
                })
            },
            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    this.form.children = JSON.stringify(this.form.children);
                    if(this.form.id == '') {
                        delete this.form.id;
                    }
                    if (valid) {
                        this.$http.post('/apis/oldMan/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.msg || '操作成功',
                                type: 'success'
                            })
                            this.form = {}
                            this.fetchList(1)
                            this.editing = false
                        })
                    } else {
                        console.log('error submit!!')
                        if(this.isUpdate) {
                            this.$http.get('/apis/oldMan/detail', {
                                params: {
                                    id: this.form.id
                                }
                            }).then(res => {
                                console.log(res.data.data);
                                this.form.children = res.data.data.children || [];
                            });
                        } else {
                            this.form.children = [];
                        }
                        return false
                    }
                })
            },

            getChildrenOptions() {
                this.$http.get('/apis/user/list', {
                    params: {
                        userType: 1,
                        pageSize: 5000,
                    }
                }).then(res => {
                    console.log('children', res);
                    this.childrenOptions = res.data.data.list
                });
            }
        },

        mounted() {
            this.fetchList(1);
            this.getVillageOptions();
            this.getChildrenOptions();
        }
    }
</script>

<style scoped>
</style>