<template>
    <div>
        <el-row class="">

            <el-col :span="20">
                <el-form :inline="true" :model="search" size="mini" class="">
                    <el-form-item label="" prop="name">
                        <el-input v-model="search.name" style="width: 120px;" placeholder="姓名搜索"></el-input>
                    </el-form-item>

                    <el-form-item label="" prop="mobile">
                        <el-input v-model="search.mobile" style="width: 120px;" placeholder="手机号搜索"></el-input>
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
                <div class="grid-content bg-purple" style="float: left;">
                    <export-excel url="/export/oldMan" :params="search"></export-excel>
                    <el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
                </div>
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

                    <el-table-column
                            prop="age"
                            width=50
                            align="center"
                            label="年龄">
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
                        <el-form-item label="" prop="" v-if="isUpdate">
                            <el-button @click="getTrack(form.id)">老人行动轨迹</el-button>
                        </el-form-item>

                        <el-form-item v-if="showTrack && isUpdate">
                            <section id="a-map-container" style="width:100%; height: 400px">

                            </section>
                        </el-form-item>
                        <el-form-item label="已绑定子女" prop="">
                            <section
                                    v-if="bindChildren && bindChildren.length > 0 && bindChildren[0].name">
                                <el-tag v-for="(child,i) in bindChildren"
                                        :closable=true
                                        v-if="child.name"
                                        @close="removeChild(child)"
                                        v-bind:key="i">{{child.name}}</el-tag>
                            </section>
                            <el-button @click="bindButton" size="small" type="primary">添加绑定</el-button>
                        </el-form-item>

                        <section
                                v-if="bindChildren.length > 0"
                                v-for="(item, index) in bindChildren"
                                :key="item.index"
                                :label="item.name"
                                :value="item.id">
                            <el-form-item label="子女" label-width="100px">
                                <!--<el-autocomplete-->
                                        <!--v-model="form.children[index].id"-->
                                        <!--:fetch-suggestions="searchChildren"-->
                                        <!--placeholder="选择子女"-->
                                        <!--@select="childSelected"-->
                                        <!--value-key="mobile"-->
                                        <!--value="id"-->
                                        <!--key="id"-->
                                        <!--:style="{width:'20%'}"-->
                                <!--&gt;</el-autocomplete>-->
                                <el-select v-model="bindChildren[index].id" placeholder="请选择">
                                    <el-option
                                            v-for="(item,i) in childrenOptions"
                                            :key="i"
                                            :label="item.mobile"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关系">
                                <el-input :style="{width:'20%'}" v-model="bindChildren[index].relation"></el-input>
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
    import Amap from 'vue-amap';
    import { lazyAMapApiLoaderInstance } from 'vue-amap';
    import { isValidPhone } from '../../util/validate'
    import { checkNumber } from '../../util/validate'
    import ExportExcel from '../common/ExportExcel'

    export default {
        name: "Elders",
        components: {
            Editor, SingleImageUpload, Amap, lazyAMapApiLoaderInstance, ExportExcel
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

                bindChildren: [],
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
                    homeAddress: '',
                    children: [],
                },
                editing: false,
                isUpdate: false,
                search: {
                    name: '',
                    createTime: '',
                    mobile: '',
                    timeStart: '',
                    timeEnd: '',
                },
                rules: {
                    name: {required: true, message: '请输入老人姓名' , trigger: 'blur'},
                    sex: {required: true, message: '请选择性别', trigger: 'blur'},
                    mobile: [
                        {required: true, message: '请输入老人手机号', trigger: 'blur'},
                        { validator: isValidPhone, trigger: 'blur' }
                    ],
                    idCardNumber: {required: true, message: '请输入身份证号', trigger: 'blur'},
                    nation: {required: true, message: '请输入民族', trigger: 'blur'},
                    age: [
                        {required: true, message: '请输入年龄', trigger: 'blur'},
                        { validator: checkNumber, trigger: 'blur' }
                    ],
                    villageId: {required: true, message: '请选择村庄', trigger: 'blur'},
                    homeAddress: {required: true, message: '请输入家庭住址', trigger: 'blur'}
                },
                markers: [
                    {
                        lng: 116.8,
                        lat: 37.87816
                    },
                    {
                        lng: 115.907,
                        lat: 36.4542
                    },
                    {
                        lng: 117.58448,
                        lat: 36.96
                    },
                    {
                        lng: 115.3,
                        lat: 36.4453
                    },
                    {
                        lng: 116.9,
                        lat: 37.4269
                    },
                    {
                        lng: 116.1588,
                        lat: 36.5
                    }
                ],
                villageOptions: [],
                showTrack: false
            }

        },
        methods: {
            mapInit () {
                Amap.initAMapApiLoader({
                    key: 'bf8e162c12d4797e0310c699ff45b3c2',
                    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.CircleMarker', 'AMap.Marker'],
                    v: '1.4.4'
                });

                lazyAMapApiLoaderInstance.load().then(() => {
                    this.mapInstance = new AMap.Map('a-map-container', {
                        // center: new AMap.LngLat(this.map.lng, this.map.lat),
                        zoom: 14,
                    });
                    if(this.markers && this.markers.length > 0) {
                        this.markersInit(AMap);
                        // console.log(newCenter);
                    }
                });

            },

            markersInit(AMap) {
                let path = []
                this.mapInstance.clearMap();
                this.markers.forEach(marker => {
                    AMap.convertFrom([marker.lng, marker.lat], 'gps', (status, result) => {
                        path.push(new AMap.LngLat(result.locations[0].R, result.locations[0].Q))
                        new AMap.CircleMarker({
                            map: this.mapInstance,
                            center: new AMap.LngLat(result.locations[0].R, result.locations[0].Q),
                            radius: 10,
                            strokeColor: '#4169E1',
                            fillColor: '#4169E1',
                            zIndex: 55,
                        })
                    });
                });

                setTimeout(() => {
                    let polyline = new AMap.Polyline({
                        path: path,
                        strokeColor: '#EEC900',
                        fillColor: '#EEC900',
                        lineCap: 'round',
                        lineJoin: 'round',
                        showDir: true,
                        strokeWeight: 5
                    });
                    this.mapInstance.add([polyline]);
                    this.mapInstance.setFitView();
                }, 500)

            },

            getMarkers(oldManId) {
                this.$http.get('/apis/badge/oldManTrail', {
                    params: {
                        oldManId: oldManId
                    }
                }).then((res) => {
                    this.markers = res.data.data.list
                    console.log(res.data.data.list);
                    this.showTrack = !this.showTrack;
                    if(this.showTrack == true) {
                        this.mapInit()
                    }
                });
            },

            getTrack(oldManId) {
                this.getMarkers(oldManId)
            },
            picUploaded(res, file) {
                this.form.headImg = res.pic
            },
            searchChildren (queryString, cb) {
                let childrenOptions = this.childrenOptions;
                let results = queryString ? childrenOptions.filter(this.createStateFilter(queryString)) : childrenOptions;
                cb(results);
            },

            createStateFilter(queryString) {
                return (state) => {
                    console.log(state, queryString);
                    return (state.mobile.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            childSelected (item) {
                // let bindChild = this.form.children.filter(this.bindChildrenFilter(item))

                console.log('selected', item);
                // this.form.children[index] = {
                //     id: item.id,
                //     name: item.name,
                //     relation: this.childRelation ? this.childRelation : '母子',
                // }
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
                this.showTrack = false
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
                this.showTrack = false;
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.$http.get('/apis/oldMan/detail', {
                    params: {
                        id: row.id,
                    }
                }).then(res => {
                    this.form = Object.assign({}, res.data.data)
                    this.bindChildren = this.form.children;
                });

            },

            bindButton () {
                this.bindChildren.push({
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
                })
            },
            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    this.form.children = JSON.stringify(this.bindChildren);
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
                        }).catch(error => {
                            //this.form.children = JSON.parse(this.form.children);
                            console.log(error);
                        })
                    } else {
                        console.log('error submit!!')
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