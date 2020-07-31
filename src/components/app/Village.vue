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
                            prop="electronicFence"
                            label="电子围栏">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="修改时间">
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
                                <el-form-item label="村专干" prop="assistantName">
                                    <el-input v-model="form.assistantName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式" prop="assistantMobile">
                                    <el-input v-model="form.assistantMobile"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="电子围栏" prop="electronicFence">
                            <el-input v-model="form.electronicFence" @change="radiusChanged"></el-input>
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
    import {TMap} from "../common/map-import";

    export default {
        name: "Village",
        components:{
            TMap
        },
        data () {
          return {
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
                  electronicFence: 10,
                  secretaryId: '',
                  secretaryName: '',
                  secretaryMobile: '',
                  assistantId: '',
                  assistantName: '',
                  assistantMobile: '',
                  latitude: '',
                  longitude: '',
              },
              editing: false,
              isUpdate: false,
              rules: {},
              page: {},
              search: {}
          }
        },

        methods: {
            add () {
                this.editing = true
                this.isUpdate = false
                this.form = {
                    electronicFence: 500,
                }

                TMap('HFTBZ-3IO66-I4MSE-M57DC-7TEF5-2WF4Y').then(qq => {
                    this.map = new qq.maps.Map(document.getElementById("container"),{
                        //地图的中心地理坐标
                        center:new qq.maps.LatLng(36.67,117.11),
                        zoom:14,
                        disableDoubleClickZoom: false,
                        zoomControl: false,
                        panControl: false
                    });
                    this.mapData.anchor = new qq.maps.Point(0, 0);
                    this.mapData.size = new qq.maps.Size(10, 10);
                    this.mapData.origin = new qq.maps.Point(0, 0);
                    this.mapData.icon = new qq.maps.MarkerImage('http://www.geocodezip.com/mapIcons/small_red_dot.png', this.mapData.size, this.mapData.origin, this.mapData.anchor);

                    this.addMarker();
                    this.addCircle();
                    qq.maps.event.addListener(this.map, 'center_changed', this.centerChanged);

                    // let container = document.getElementById('container')


                });

                setTimeout(() => {
                    let img = document.getElementsByTagName('img');
                    img.item(1).parentNode.parentNode.parentNode.nextSibling.remove();
                    img.item(1).parentNode.parentNode.parentNode.remove();

                }, 1500)
            },

            centerChanged() {
                console.log(this.map.getCenter());
                this.clearMarker();
                this.addMarker();
                this.addCircle();
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
                let marker = new qq.maps.Marker({
                    icon: this.mapData.icon,
                    map: this.map,
                    position:this.map.getCenter()});
                this.markers.push(marker);
            },

            radiusChanged() {
                this.circle.setRadius(parseInt(this.form.electronicFence))
            },

            addCircle() {
                this.clearCircle();
                this.circle=new qq.maps.Circle({
                    map:this.map,
                    center:this.map.getCenter(),
                    radius:parseInt(this.form.electronicFence),
                    // fillColor:"#0f0",
                    strokeWeight:2
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
                this.form = Object.assign({}, row)
            },
            remove (id) {
                this.$confirm('确定删除此村庄吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/adminApi/userVillage/delete', {
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
                this.$http.get('/apis/adminApi/user/village', this.search).then(res => {
                    this.page.total = res.data.data.total
                    this.search.pageNum = parseInt(res.data.data.pageNum)
                    this.tableData = res.data.data.data;
                })
            },

            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.roleId = this.form.roleName
                        this.$http.post('/apis/adminApi/careBirthday/addOrUpdate', this.form).then(res => {
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