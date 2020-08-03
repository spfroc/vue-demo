<template>
    <div>
        <section class="header-bar">
            <el-form :inline="true" :model="search" size="mini" class="">
                <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker
                        v-model="search.createTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="商家名称" prop="name">
                    <el-input v-model="search.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="fetchList">搜索</el-button>
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

                            label="商家名称">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            width="110px"
                            align="center"
                            label="商家电话">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            align="center"

                            label="商家地址">
                    </el-table-column>
                    <el-table-column
                            prop="businessHours"
                            align="center"

                            label="营业时间">
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
                    <el-table-column width="120" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" circle></el-button>
                            <el-button @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" circle></el-button>
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
                    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="商家名称" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="商家电话" prop="mobile">
                            <el-input v-model="form.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="商家地址" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="营业时间" prop="businessHours">
                            <el-input v-model="form.businessHours"></el-input>
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <single-image-upload v-model="form.avatar" width="200" height="100"></single-image-upload>
                        </el-form-item>
                        <el-form-item label="优惠信息" prop="discount">
                            <el-input v-model="form.discount"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="introduction">
                            <multiple-image-upload
                                    v-model="form.introduction"
                                    :file-list="introductionFileList"
                                    :add-file="addFile"
                                    :remove-file-list="removeFileList"
                                    width="100" height="100"></multiple-image-upload>
                        </el-form-item>
                        <el-form-item label="封面图" prop="cover">
                            <single-image-upload v-model="form.cover" width="400" height="200"></single-image-upload>
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
    import SingleImageUpload from "../common/SingleImageUpload"
    import Editor from "../common/Editor"
    import MultipleImageUpload from "../common/MultipleImageUpload"

    export default {
        name: "Community",
        components: {
            SingleImageUpload,Editor,MultipleImageUpload
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
                    name: '',
                    mobile: '',
                    address: '',
                    businessHours: '',
                    avatar: '',
                    cover: '',
                    discount: '',
                    introduction: '',
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
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {}
                this.introductionFileList = [];
            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.form = Object.assign({}, row)
                this.introductionFileList = this.form.introduction

            },
            remove (id) {
                this.$confirm('确定删除此商家吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/adminApi/store/delete', {
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

            addFile(fileList) {
                console.log(fileList);
                this.introductionFileList = fileList;
            },

            removeFileList(file) {
                console.log(file);
                this.introductionFileList.pop(file);
            },

            fetchList (currentPage) {
                this.search.pageNum = currentPage || this.search.pageNum
                // TODO id=1 是个接口bug
                this.$http.get('/apis/adminApi/store/list', {
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
                    // console.log(this.introductionFileList);return;

                    // let fileInfoList = [];
                    if(this.introductionFileList && this.introductionFileList.length) {
                        this.form.introduction = '';
                        this.introductionFileList.forEach(file => {
                            console.log(file.url.toString());
                            if(this.isUpdate) {
                                this.form.introduction += file.url.toString()+',';
                            } else {
                                this.form.introduction += file.response.data.toString()+',';
                            }
                            // fileInfoList.push({
                            //     name: file.name ? file.name : '',
                            //     url: file.response.data ? file.response.data : file.url,
                            //     size: file.size ? file.size : '',
                            //     uid: file.uid ? file.uid : '',
                            // })
                        })
                    }
                    // this.form.introduction = JSON.stringify(fileInfoList);
                    // console.log(this.form.introduction);return;
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/adminApi/store/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.message,
                                type: 'success'
                            })
                            this.form = {}
                            this.fetchList(1)
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