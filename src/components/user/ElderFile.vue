<template>
    <el-row>

        <el-col :span="5" class="container">
            <section>
                魏善庄镇老人档案管理
            </section>
            <el-input v-model="filterText"
                      size="mini"
                      placeholder="按姓名搜索"></el-input>

            <el-tree
                    class="filter-tree"
                    :data="oldManInVillage"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    :default-expand-all="true"
                    ref="tree">
            </el-tree>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="18" class="container">
            <div>
                <el-form :inline="true" :model="search" size="mini" class="">

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
                    <el-form-item label="" prop="type">
                        <el-select v-model="search.type" placeholder="请选择">
                            <el-option
                                    v-for="item in typeMap"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
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
                            <el-table-column type="index" label="序号">
                            </el-table-column>
                            <el-table-column
                                    prop="oldManName"
                                    align="center"
                                    label="姓名">
                            </el-table-column>

                            <el-table-column
                                    prop="addUserName"
                                    align="center"
                                    label="创建人">
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    align="center"
                                    :formatter="typeFormatter"
                                    label="类型">
                            </el-table-column>
                            <el-table-column align="center" prop="createTime" label="创建时间">
                            </el-table-column>
                            <el-table-column prop="updateTime" label="修改时间">
                            </el-table-column>
                            <el-table-column
                                    width="250"
                                    align="center"
                                    label="操作">
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
                                <el-form-item label="老人姓名" prop="oldManName">
                                    <!--<el-input v-model="form.oldManId"></el-input>-->
                                    <el-autocomplete
                                            v-model="form.oldManName"
                                            value="age"
                                            :fetch-suggestions="querySearchAsync"
                                            placeholder="请输入内容"
                                            value-key="name"
                                            @select="handleSelect"
                                    ></el-autocomplete>
                                </el-form-item>


                                <el-form-item label="类型" prop="type">
                                    <el-select v-model="form.type" placeholder="请选择">
                                        <el-option
                                                v-for="item in typeMap"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <editor ref="myTextEditor" v-model="form.content" :options="editorOption"></editor>
                                </el-form-item>
                                <el-form-item label="图片" prop="imgListArr">
                                    <multiple-image-upload
                                            v-model="form.imgList"
                                            :file-list="imgListArr"
                                            :add-file="addFile"
                                            :remove-file-list="removeFileList"
                                            width="100" height="100">
                                    </multiple-image-upload>
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
        </el-col>
    </el-row>
</template>

<script>

    import Editor from "../common/Editor"
    import MultipleImageUpload from "../common/MultipleImageUpload"

    export default {
        name: "ElderFile",
        components: {
            Editor,MultipleImageUpload
        },
        data () {
            return {
                editorOption: {
                    placeholder: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                oldManInVillage: [{
                    id: 1,
                    label: '刘家场村',
                    children: [{
                        id: 4,
                        label: '老人1',
                    },{
                        id: 9,
                        label: '老人2'
                    }, {
                        id: 10,
                        label: '老人3'
                    }]
                }, {
                    id: 2,
                    label: '李家场村',
                    children: [{
                        id: 5,
                        label: '老人4'
                    }, {
                        id: 6,
                        label: '老人5'
                    }]
                }, {
                    id: 3,
                    label: '杏花村',
                    children: [{
                        id: 7,
                        label: '老人6'
                    }, {
                        id: 8,
                        label: '老人7'
                    }]
                }],
                imgListArr: [],
                tableData: [],
                editing: false,
                isUpdate: false,
                rules: {},
                page: {},
                search: {},
                editingRow: {},
                leftForm: {
                    oldManName: '',
                },

                form: {
                    id: '',
                    oldManId: '',
                    oldManName: '',
                    type: '',
                    content: '',
                    imgs: '',
                    imgListArr: [],
                    imgList: [],

                },
                oldManOptions: [],
                typeMap: [
                    {
                        value: 1,
                        label: '病例档案',
                    },
                    {
                        value: 2,
                        label: '自测数据',
                    },
                    {
                        value: 3,
                        label: '体检报告',
                    },
                    {
                        value: 4,
                        label: '吃药提醒',
                    },
                ],
                filterText: '',
                typeFormatterMap: ['未知', '病例档案', '自测数据', '体检报告', '吃药提醒'],
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            querySearchAsync(queryString, cb) {
                let restaurants = this.oldManOptions;
                let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 500);
            },

            createStateFilter(queryString) {
                return (state) => {
                    return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                this.form.oldManId = item.id;

                console.log(this.form.oldManId);
                console.log(item);
            },
            getOldManOptions () {
                this.$http.get('/apis/oldMan/list', {
                    params: Object.assign({
                        pageSize: 5000,
                        pageNum: 1,
                    }, this.search)
                }).then((res) => {
                    this.oldManOptions = res.data.data.list;
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            addFile(fileList) {
                console.log(fileList);
                this.imgListArr = fileList;
            },

            removeFileList(file) {

            },

            typeFormatter (row) {
                return this.typeFormatterMap[row.type];
            },
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    id: '',
                    oldManId: '',
                    oldManName: '',
                    type: '',
                    content: '',
                    imgs: '',
                    imgListArr: [],
                    imgList: [],
                }
            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.imgListArr = [];
                row.type = parseInt(row.type);
                // row.oldManId = row.oldManId.toString();
                this.editingRow = row
                let editImgList = [];
                row.imgList.forEach((item) => {
                    editImgList.push({
                        status: item.status,
                        uid: item.uid,
                        url: '/images'+item.url,
                    })
                })
                this.imgListArr = editImgList

                this.form = row
            },
            remove (id) {
                this.$confirm('确定删除此老人档案吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/oldManArchives/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.msg || '操作成功',
                            type: 'success'
                        })
                        this.fetchList()
                    })
                    this.editing = false
                    this.form = {
                        id: '',
                        oldManId: '',
                        imgList: [],
                        oldManName: '',
                        type: '',
                        content: '',
                        imgs: '',
                        imgListArr: [],
                    }
                }).catch((error) => {
                    // do nothing
                    console.log(error);
                })
            },

            cancel () {
                this.editing = false
            },

            fetchList () {
                if(this.search.createTime && this.search.createTime.length > 0) {
                    this.search.timeStart = this.search.createTime[0];
                    this.search.timeEnd = this.search.createTime[1];
                }
                delete this.search.createTime;
                this.$http.get('/apis/oldManArchives/list', {
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
                    console.log(this.imgList);
                    if(this.form.id == '') {
                        delete this.form.id;
                    }
                    if (valid) {
                        if(this.imgListArr && this.imgListArr.length > 0) {
                            let images = '';
                            this.imgListArr.forEach(img => {
                                console.log(img);
                                if(img.url.match('blob')) {
                                    images += img.response.data.pic +','
                                } else {
                                    images += img.url.replace('/images', '') + ','
                                }

                            })
                            // console.log(images);
                            this.form.imgs = images;
                        }
                        this.$http.post('/apis/oldManArchives/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.msg || "操作成功",
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
            this.getOldManOptions();
        }
    }
</script>

<style scoped>
    .container {
        padding-top: 20px;
    }
</style>