<template>
    <div>
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
                    <el-input v-model="search.name"></el-input>
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
                    <el-table-column type="index" align="center" width="80" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            align="center"
                            :show-overflow-tooltip="false"
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
                    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="商家名称" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="分类" prop="categoryId">-->
                            <!--<el-input v-model="form.categoryId"></el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="分类" prop="categoryId">
                            <el-select v-model="form.categoryId" placeholder="请选择">
                                <el-option
                                        v-for="item in this.categoryOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商家电话" prop="mobile">
                            <el-input v-model="form.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="商家地址" prop="address">
                            <el-input id="address" @change="addressSearch" v-model="form.address"></el-input>
                            <div id="results" style="display:none;position:absolute;z-index: 3000;background-color: white"></div>
                        </el-form-item>
                        <el-form-item>
                            <div id="container">

                            </div>

                        </el-form-item>
                        <el-form-item label="营业时间" prop="businessHours">
                            <el-input v-model="form.businessHours"></el-input>
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <single-image-upload
                                    v-model="form.avatar"
                                    width="200"
                                    @change="avatarUploaded"
                                    height="100"></single-image-upload>
                        </el-form-item>
                        <el-form-item label="优惠信息" prop="discount">
                            <el-input v-model="form.discount"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="introduction">
                            <multiple-image-upload
                                    v-model="form.introduction"
                                    :file-list="fileListContainer"
                                    :file-list-container="fileListContainer"
                                    width="100" height="100"></multiple-image-upload>
                        </el-form-item>
                        <el-form-item label="封面图" prop="cover">
                            <single-image-upload
                                    v-model="form.cover"
                                    width="400"
                                    @change="coverUploaded"
                                    height="200"></single-image-upload>
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
    import { isValidPhone } from '../../util/validate'
    import VueAMap from 'vue-amap'
    import { lazyAMapApiLoaderInstance } from 'vue-amap'

    export default {
        name: "Community",
        components: {
            SingleImageUpload,Editor,MultipleImageUpload,VueAMap,lazyAMapApiLoaderInstance
        },
        data() {
            return {
                fileListContainer: [],
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
                    categoryId: '',
                    lng: 117.11,
                    lat: 36.67,
                },
                editing: false,
                isUpdate: false,
                search: {
                    name: '',
                    createTime: ''
                },
                rules: {
                    name: { required: true, message: '请输入商家名称', trigger: 'blur' },
                    mobile: [
                        { required: true, message: '请输入商家电话', trigger: 'blur' },
                        { validator: isValidPhone, trigger: 'blur' }
                    ],
                    address: { required: true, message: '请输入商家地址', trigger: 'blur' },
                    businessHours: { required: true, message: '请输入商家营业时间', trigger: 'blur' },
                    avatar: { required: true, message: '请上传商家头像', trigger: 'blur' },
                    // discount: { required: true, message: '请输入商家优惠信息', trigger: 'blur' },
                    introduction: { required: true, message: '请上传商家简介图片', trigger: 'blur' },

                },

                map: null,
                searchPlace: null
            }

        },
        methods: {
            coverUploaded(res, file) {
                this.form.cover = res.pic;
            },

            avatarUploaded(res, file) {
                this.form.avatar = res.pic

            },
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    lng: 117.11,
                    lat: 36.67,
                }
                this.introductionFileList = [];
                this.fileListContainer = [];
                this.mapInit();

            },
            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.$http.get('/apis/store/detail', {
                    params: {
                        id: row.id
                    }
                }).then((res) => {
                    this.fileListContainer = [];
                    this.form = Object.assign({}, res.data.data)
                    this.introductionFileList = this.form.introduction
                    this.form.introduction.forEach((file, index) => {
                        this.fileListContainer.push({
                            name: file.url,
                            path: file.url,
                            url: '/images'+ file.url
                        })
                    })
                });
            },

            getCategoryOptions () {
                this.$http.get('/apis/storeCategory/list', {
                    params: Object.assign({
                        pageSize: 1000,
                        pageNum: 1,
                    })
                }).then(res => {

                    this.categoryOptions = res.data.data.list;
                })
            },
            remove (id) {
                this.$confirm('确定删除此商家吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/store/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.msg  || '操作成功',
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

            fetchList (currentPage) {
                this.search.pageNum = currentPage || this.search.pageNum
                this.search = this.$common.searchParams(this.search);
                // TODO id=1 是个接口bug
                this.$http.get('/apis/store/list', {
                    params: Object.assign({
                        pageSize: 10,
                        pageNum: this.search.pageNum,
                    }, this.search)
                }, {
                    params: this.search
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
                if(this.fileListContainer && this.fileListContainer.length) {
                    this.form.introduction = '';
                    this.fileListContainer.forEach(file => {
                        this.form.introduction += file.path.toString()+',';
                    })
                }
                // console.log('form.introduction:', this.form.introduction);return;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$http.post('/apis/store/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.msg  || '操作成功',
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

            mapInit() {

                VueAMap.initAMapApiLoader({
                    key: 'bf8e162c12d4797e0310c699ff45b3c2',
                    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
                    v: '1.4.4'
                });
                lazyAMapApiLoaderInstance.load().then(() => {
                    this.map = new AMap.Map('container', {
                        center: new AMap.LngLat(this.form.lng, this.form.lat),
                        zoom: 15,
                        resizeEnable: true,
                    });

                    let marker = new AMap.Marker({
                        position:[this.form.lng, this.form.lat]//位置
                    })
                    console.log('marker', marker);
                    this.map.add(marker);//添加到地图
                    // 输入提示
                    let autoOptions = {
                        input: "address",
                        output: 'results'
                    };
                    let auto = new AMap.Autocomplete(autoOptions);
                    this.placeSearch = new AMap.PlaceSearch({
                        map: this.map,
                        pageSize: 2
                    });
                    AMap.event.addListener(auto, "select", (e) => {
                        console.log('e~~', e);
                        this.form.lng = e.poi.location.R;
                        this.form.lat = e.poi.location.Q;
                        this.placeSearch.setCity(e.poi.adcode);
                        this.placeSearch.search(e.poi.name);  //关键字查询查询
                    });//注册监听，当选中某条记录时会触发
                });
                // let results = document.getElementsByClassName('amap-sug-result')
                // console.log(results[1].setAttribute('style', 'z-index: 3000 !important'));

            },

            select(e) {
                console.log('e', e);
                this.form.lng = e.poi.location.R;
                this.form.lat = e.poi.location.Q;
                this.placeSearch.setCity(e.poi.adcode);
                this.placeSearch.search(e.poi.name);  //关键字查询查询
                this.placeSearch.clear();
                let markers = VueAMap.Marker({
                    position: [this.form.lng, this.form.lat]
                })
                this.map.add(markers);
            },

            addressSearch() {
                // let results = document.getElementsByClassName('amap-sug-result')
                // console.log(results);
                // results[1].setAttribute('style', 'z-index: 4000 !important');
            },
        },

        mounted() {
            this.fetchList(1);
            this.getCategoryOptions();

        }
    }
</script>

<style scoped>
    #container{
        width:90%;
        height:300px;
    }
</style>