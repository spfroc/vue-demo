<template>
    <el-row>

        <el-col :span="4" class="container">
            <section>
                魏善庄镇驿站监控
            </section>
            <el-tree
                    class="filter-tree"
                    :data="oldManInVillage"
                    :props="defaultProps"
                    @node-click="nodeSelected"
                    :default-expand-all="true"
                    ref="tree">
            </el-tree>
        </el-col>
        <el-col :span="20" class="container">

            <section><h4>{{defaultCameraList.title}}</h4></section>

            <section>
                <el-row :gutter="20">
                    <el-col v-if="defaultCameraList.list[0]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[0].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[0].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                    <el-col v-if="defaultCameraList.list[1]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[1].cameraUrl+'&template=0'"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[1].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                    <el-col v-if="defaultCameraList.list[2]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[2].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[2].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col v-if="defaultCameraList.list[3]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[3].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[3].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                    <el-col v-if="defaultCameraList.list[4]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[4].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[4].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                    <el-col v-if="defaultCameraList.list[5]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[5].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[5].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col v-if="defaultCameraList.list[6]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[6].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[6].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                    <el-col v-if="defaultCameraList.list[7]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[7].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[7].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                    <el-col v-if="defaultCameraList.list[8]" :span="8">
                        <iframe
                                :src="defaultCameraList.list[8].cameraUrl"
                                :width="width"
                                :height="height"
                                :id="'video_'+defaultCameraList.list[8].channelNo"
                                allowfullscreen></iframe>
                    </el-col>
                </el-row>
            </section>
            <el-pagination
                    hide-on-single-page
                    background
                    layout="total, prev, pager, next"
                    :page-size="defaultCameraList.pageSize"
                    :total="defaultCameraList.total"
                    :current-page="defaultCameraList.pageNum"
                    @current-change="fetchList"
            >
            </el-pagination>
            <!--<video-player :options="options"></video-player>-->
            <!--<video src="http://192.168.1.6:8080/video" controls="controls">-->
                <!--您的浏览器不支持 video 标签。-->
            <!--</video>-->

            <!--<video width="320" height="240" controls>-->
                <!--<source src="http://192.168.1.6:8080/video.mp4" type="video/mp4">-->
                <!--<source src="http://192.168.1.6:8080/video" type="video/ogg">-->
                <!--您的浏览器不支持Video标签。-->
            <!--</video>-->
            <!--<div>-->
                <!--<iframe-->
                        <!--src="https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/E61621593/3.hd.live&autoplay=1&audio=0&accessToken=at.1ub4ksgo1puref4mdu8tzb1bbc99xr67-60skir0pat-07b4ymg-17lwnkvan&templete=0"-->
                        <!--:width="width"-->
                        <!--:height="height"-->
                        <!--id="ysOpenDevice"-->
                        <!--allowfullscreen-->
                        <!--@dblclick="test"-->
                <!--&gt;-->
                <!--</iframe>-->
            <!--</div>-->
            <!--<div>-->
                <!--<CEZUIKitJS></CEZUIKitJS>-->
            <!--</div>-->
            <el-drawer
                    :title="HDTitle"
                    :visible.sync="drawer"
                    :direction="direction"
                    size="89%"
                    :before-close="handleClose">
                <iframe
                        v-if="drawer"
                        :src="HDUrl"
                        width="100%"
                        height="100%"
                        allowfullscreen></iframe>
            </el-drawer>
        </el-col>
    </el-row>
</template>

<script>

    // import VideoPlayer from "../common/VideoPlayer";
    import CustomVideo from "../common/CustomVideo"
    import CEZUIKitJS from '../common/CEZUIKitJS'
    export default {
        name: "Monitor",
        components: {
            CustomVideo, CEZUIKitJS
        },
        data () {
            return {
                HDUrl: '',
                HDTitle: '',
                drawer: false,
                direction: 'rtl',
                width: '95%',
                height: 250,
                editorOption: {
                    placeholder: ''
                },

                devices: [
                    {
                        channel: '3',
                        name: 'E61621593',
                    },

                    {
                        channel: '3',
                        name: 'E61621593',
                    },

                    {
                        channel: '5',
                        name: 'E61621593',
                    },

                    {
                        channel: '5',
                        name: 'E61621593',
                    },
                ],
                player: null,
                defaultProps: {
                    children: 'cameraList',
                    label: 'name'
                },
                defaultCameraList: {
                    list: [],
                    page: 1,
                    total: 0,
                    pageSize: 9,
                    title: '',
                    index: 0,
                },
                oldManInVillage: [],
                options: {
                    language: 'zh-CN',
                    height:300,
                    width:300,
                    autoplay: true,
                    controls: true,
                    sources: [
                        // {
                        //     src: "http://192.168.1.6:8080/video",
                        //     type: "video/mp4"
                        // }
                    ],

                    children: {
                        controlBar: {
                            // fullscreenToggle: false,

                        }
                    }
                },
            }
        },
        methods: {

            nodeSelected(data) {
                console.log(data);
                if(data.cameraHdUrl) {
                    this.HDUrl = data.cameraHdUrl;
                    this.HDTitle = data.name;
                    this.showHD();
                } else {

                }

            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.drawer = false;
                        done();
                    })
                    .catch(_ => {});
            },

            showHD() {
                this.drawer = true;
            },

            fetchList (currentPage) {
                this.defaultCameraList.page = currentPage || this.defaultCameraList.page;
                this.$http.get('/apis/courierStation/cameraAllList').then(res => {
                    this.oldManInVillage = res.data.data.list;
                    if(this.oldManInVillage.length > 0) {
                        let start = this.getStartIndex();
                        console.log('page: ', this.defaultCameraList.page);
                        console.log('start:',start);

                        this.defaultCameraList.list = this.oldManInVillage[this.defaultCameraList.index].cameraList.slice(start, start+this.defaultCameraList.pageSize);
                        this.defaultCameraList.total = this.oldManInVillage[this.defaultCameraList.index].cameraList.length;
                        this.defaultCameraList.title = this.oldManInVillage[this.defaultCameraList.index].name;
                    }
                })
            },

            getStartIndex() {
                let start = 0;
                if(this.defaultCameraList.page > 1) {
                    start = (this.defaultCameraList.page-1)*this.defaultCameraList.pageSize + 1;
                }
                return start;
            }

        },

        mounted() {
            this.fetchList();
        }
    }
</script>

<style scoped>
    .container {
        padding-top: 20px;
    }
</style>