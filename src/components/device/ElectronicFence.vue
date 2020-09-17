<template>
    <div>
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
                <el-input v-model="search.name" placeholder="按老人姓名搜索"></el-input>
            </el-form-item>
            <el-form-item label="" prop="mobile">
                <el-input v-model="search.mobile" placeholder="按老人手机号搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
            </el-form-item>
        </el-form>
        <!--<section class="header-bar">-->
            <!--<el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>-->
        <!--</section>-->
        <template>
            <div>
                <el-table
                        :data="tableData">
                    <el-table-column type="index" align="center" width="80" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="oldManName"
                            align="center"
                            label="老人姓名">
                    </el-table-column>

                    <el-table-column
                            prop="oldManMobile"
                            align="center"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            align="center"
                            label="时间类型">
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="12" style="float: left;">
                                    <div style="float: right">{{statusFormatter(scope.row)}}</div>
                                </el-col>
                                <el-col :span="12">
                                    <div v-if="scope.row.type == '12'" style="margin-left: 20px; width: 20px; height: 20px; border: solid 1px red; background-color: red; border-radius: 10px"></div>
                                    <div v-if="scope.row.type == '10'" style="margin-left: 20px; width: 20px; height: 20px; border: solid 1px limegreen; background-color: limegreen; border-radius: 10px"></div>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createAt"
                            align="center"
                            label="报警时间">
                    </el-table-column>
                    <el-table-column align="center" width="120" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="() => { edit(scope.row) }" type="info" size="mini" >行动轨迹</el-button>
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

                <el-dialog :close-on-click-modal="false" title="行动轨迹" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
                        <el-form-item label="老人姓名" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>

                        <el-form-item label="老人手机号" prop="mobile">
                            <el-input v-model="form.mobile"></el-input>
                        </el-form-item>

                        <el-form-item label="家庭住址" prop="address">
                            <el-input v-model="form.homeAddress"></el-input>
                        </el-form-item>

                        <el-form-item label="最近位置上报时间" prop="latestPositionReportedAt">
                            <el-input v-model="form.lastestTime"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <section id="a-map-container" style="width:100%; height: 400px">

                            </section>
                        </el-form-item>
                        <el-form-item>
                            <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
                            <el-button v-on:click="cancel">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </div>
        </template>
    </div>
</template>

<script>
    import Amap from 'vue-amap';
    import { lazyAMapApiLoaderInstance } from 'vue-amap';
    export default {
        name: "ElectronicFence",
        components: {
            Amap, lazyAMapApiLoaderInstance
        },
        data () {
            return {
                mapInstance: '',
                map: {
                    lng: '117.202561',
                    lat: '36.63252',
                    width: '400px',
                    height: '200px',
                    zoom: 16,
                    markers: [

                    ]
                },
                tableData: [],
                editing: false,
                isUpdate: false,
                rules: {},
                page: {},
                search: {},
                editingRow: {},
                markers: [],
                form: {
                    name: '',
                    mobile: '',
                    lastestTime: '',
                    list: [],
                    homeAddress: '',

                },
            }
        },

        methods: {
            statusFormatter (row) {
                return row.type && row.type == '10' ? '进入围栏' : '离开围栏';
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
                this.$http.get('/apis/badge/fenceAlarmTrail', {
                    params: {
                        id: row.id
                    }
                }).then(res => {
                    console.log('track: ',res.data.data);
                    this.form = res.data.data
                    this.markers = this.form.list;
                    this.mapInit();
                });


            },

            mapInit () {
                Amap.initAMapApiLoader({
                    key: 'bf8e162c12d4797e0310c699ff45b3c2',
                    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.CircleMarker', 'AMap.Marker'],
                    v: '1.4.4'
                });

                lazyAMapApiLoaderInstance.load().then(() => {
                    this.mapInstance = new AMap.Map('a-map-container', {
                        zoom: 15,
                    });
                    if(this.markers && this.markers.length > 0) {
                        this.markersInit(AMap);

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
            cancel () {
                this.editing = false
                this.mapInstance.destroy();
            },

            fetchList (currentPage) {
                this.search.pageNum = currentPage || this.search.pageNum
                this.search = this.$common.searchParams(this.search);
                // this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/adminApi/electronic/fence', {
                this.$http.get('/apis/badge/railList', {
                    params: Object.assign({
                        pageSize: 10,
                        // pageNum: 1
                    }, this.search)
                }).then(res => {
                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    // console.log(res.data.data.list);
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
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/adminApi/badge/addOrUpdate', this.form).then(res => {
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
            this.fetchList(1);
        }
    }
</script>

<style scoped>

</style>