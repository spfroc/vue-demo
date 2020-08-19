<template>
    <div>
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
                            label="村庄">
                    </el-table-column>

                    <el-table-column
                            :formatter="railRadiusFormatter"
                            prop="isSetRailRadius"
                            label="电子围栏">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="修改时间">
                    </el-table-column>
                    <el-table-column width="250" label="操作">
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
                        <el-form-item label="村庄名称" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="村书记" prop="secretaryName">
                                    <el-input v-model="form.secretaryName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式" prop="secretaryMobile">
                                    <el-input v-model="form.secretaryMobile"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="村专干" prop="cadreName">
                                    <el-input v-model="form.cadreName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式" prop="cadreMobile">
                                    <el-input v-model="form.cadreMobile"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="电子围栏" prop="railRadius">
                            <el-input v-model="form.railRadius" @change="radiusChanged"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <div id="container">

                            </div>

                        </el-form-item>

                        <el-input type="hidden" v-model="form.latitude"></el-input>
                        <el-input type="hidden" v-model="form.longitude"></el-input>
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
    import Amap from 'vue-amap';
    import { lazyAMapApiLoaderInstance } from 'vue-amap';

    export default {

        name: "Village",
        components:{
            Amap, lazyAMapApiLoaderInstance
        },
        data () {
          return {
              center: [117.11, 36.67],
              tableData: [],
              map: '',
              mapData: {
                  anchor: '',
                  size: '',
                  origin: '',
                  icon: '',
              },
              markers: [],
              circle: '',
              circles: [],
              editingRow: {},
              form: {
                  id: '',
                  name: '',
                  railRadius: 10,
                  secretaryId: '',
                  secretaryName: '',
                  secretaryMobile: '',
                  cadreId: '',
                  cadreName: '',
                  cadreMobile: '',
                  lng: '',
                  lat: '',
              },
              editing: false,
              isUpdate: false,
              rules: {},
              page: {},
              search: {},
          }
        },

        methods: {

            mapInit () {
                Amap.initAMapApiLoader({
                    key: 'e026d6af144d5a75ed717f7c18f10fff',
                    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
                    v: '1.4.4'
                });

                lazyAMapApiLoaderInstance.load().then(() => {
                    // your code ...
                    this.map = new AMap.Map('container', {
                        center: new AMap.LngLat(117.11, 36.67),
                        zoom: 14,
                    });
                    this.map.on('mapmove', this.centerChanged)

                    this.addMarker();
                    this.addCircle();
                    // this.map.add(marker);
                    this.map.add(this.circle);


                });
            },
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    railRadius: 500,
                }

                this.mapInit();


            },

            centerChanged() {
                this.form.lat = this.map.getCenter().lat
                this.form.lng = this.map.getCenter().lng
                this.clearMarker();
                this.addMarker();
                this.addCircle();
                this.map.add(this.circle);
            },

            clearMarker () {
                if (this.markers) {
                    for (let i in this.markers) {
                        this.markers[i].setMap(null);
                    }
                    this.markers.length = 0;
                }
            },

            addMarker() {
                let marker = new AMap.CircleMarker({
                    map: this.map,
                    center:this.map.getCenter(),
                    radius: '5px',
                    fillColor: '#561a12',
                    fillOpacity: '0.5',
                    strokeWeight: 1
                });
                this.markers.push(marker);
            },

            radiusChanged() {
                this.circle.setRadius(parseInt(this.form.railRadius))
            },

            addCircle() {
                this.clearCircle();

                this.circle = new AMap.Circle({
                    center: new AMap.LngLat(this.map.getCenter().lng, this.map.getCenter().lat), // 圆心位置
                    radius: this.form.railRadius,  //半径
                    strokeColor: "#F33",  //线颜色
                    strokeOpacity: 1,  //线透明度
                    strokeWeight: 3,  //线粗细度
                    fillColor: "#ee2200",  //填充颜色
                    fillOpacity: 0.35 //填充透明度
                });

                this.circles.push(this.circle);
            },

            clearCircle() {
                if (this.circles) {
                    for (let i in this.circles) {
                        this.circles[i].setMap(null);
                    }
                    this.circles.length = 0;
                }
            },

            edit (row) {
                this.editing = true
                this.isUpdate = true
                this.editingRow = row
                this.$http.get('/apis/village/detail', {
                    params: {
                        id: row.id
                    }
                }).then(res => {
                    console.log(res.data.data);
                    this.form = Object.assign({}, res.data.data)
                    this.mapInit()

                })
            },

            railRadiusFormatter (row) {
                return row.isSetRailRadius == 0 ? '未划分' : '已划分';
            },

            remove (id) {
                this.$confirm('确定删除此村庄吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/userVillage/delete', {
                        id: id
                    }).then(res => {
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        })
                        this.fetchList()
                    })
                    this.editing = false
                    this.form = {
                        type: 1
                    }
                }).catch(() => {
                    // do nothing
                })
            },

            cancel () {
                this.editing = false
            },

            fetchList () {
                this.$http.get('/apis/village/list', this.search).then(res => {
                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.list;
                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/village/addOrUpdate', this.form).then(res => {
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
            this.fetchList();
        }

    }

</script>

<style scoped>
    #container{
        width:90%;
        height:500px;
    }
</style>