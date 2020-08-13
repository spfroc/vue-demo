<template>
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
            <el-form-item label="" prop="name">
                <el-input v-model="search.name" placeholder="按老人姓名搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="fetchList">搜索</el-button>
            </el-form-item>
        </el-form>
        <!--<section class="header-bar">-->
            <!--<el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>-->
        <!--</section>-->
        <template>
            <div>
                <el-table
                        :data="tableData">
                    <el-table-column type="index" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            align="center"
                            label="老人姓名">
                    </el-table-column>

                    <el-table-column
                            prop="mobile"
                            align="center"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            align="center"
                            label="时间类型">
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="12" style="float: left;">
                                    <div style="float: right">{{statusFormatter(scope.row)}}</div>
                                </el-col>
                                <el-col :span="12">
                                    <div v-if="scope.row.status == 2" style="margin-left: 20px; width: 20px; height: 20px; border: solid 1px red; background-color: red; border-radius: 10px"></div>
                                    <div v-if="scope.row.status == 1" style="margin-left: 20px; width: 20px; height: 20px; border: solid 1px limegreen; background-color: limegreen; border-radius: 10px"></div>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="alarmingTime"
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
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="老人姓名" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>

                        <el-form-item label="老人手机号" prop="mobile">
                            <el-input v-model="form.mobile"></el-input>
                        </el-form-item>

                        <el-form-item label="家庭住址" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>

                        <el-form-item label="最近位置上报时间" prop="latestPositionReportedAt">
                            <el-input v-model="form.latestPositionReportedAt"></el-input>
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

                form: {
                    id: '',
                    name: '',
                    mobile: '',
                    latestPositionReportedAt: '',
                    movement: '',
                    address: '',

                },
            }
        },

        methods: {
            statusFormatter (row) {
                return row.status && row.status == 1 ? '进入围栏' : '离开围栏';
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
                this.form = Object.assign({}, row)
                this.markers = row.movement;
                this.mapInit();
                // this.mapInit();
                // console.log(this.markers);
                // console.log(this.map);
            },

            mapInit () {
                Amap.initAMapApiLoader({
                    key: 'e026d6af144d5a75ed717f7c18f10fff',
                    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.CircleMarker', 'AMap.Marker'],
                    v: '1.4.4'
                });

                lazyAMapApiLoaderInstance.load().then(() => {
                    this.mapInstance = new AMap.Map('a-map-container', {
                        center: new AMap.LngLat(this.map.lng, this.map.lat),
                        zoom: 14,
                    });
                    this.mapInstance.on('mapmove', this.centerChanged)
                    if(this.markers && this.markers.length > 0) {
                        this.markersInit(AMap);
                        // console.log(newCenter);
                    }
                });

            },

            markersInit(AMap) {
                let path = []
                this.markers.forEach(marker => {
                    // console.log(marker);
                    path.push(new AMap.LngLat(marker.lng, marker.lat));
                    new AMap.CircleMarker({
                        map: this.mapInstance,
                        center: new AMap.LngLat(marker.lng, marker.lat),
                        radius: 10,
                        strokeColor: '#4169E1',
                        fillColor: '#4169E1',
                        zIndex: 55,
                    })
                });
                let newCenter = this.mapInstance.setFitView();
                // console.log(newCenter);
                let polyline = new AMap.Polyline({
                    path: path,
                    strokeColor: '#EEC900',
                    fillColor: '#EEC900',
                    lineCap: 'round',
                    lineJoin: 'round',
                    showDir: true,
                    strokeWeight: 5
                });
                // console.log(polyline);
                this.mapInstance.add([polyline]);
            },
            cancel () {
                this.editing = false
                console.log(this.mapInstance);
                this.mapInstance.destroy();
            },

            fetchList () {
                this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/adminApi/electronic/fence', {
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
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/adminApi/badge/addOrUpdate', this.form).then(res => {
                            this.$message({
                                message: res.data.message,
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