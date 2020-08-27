<template>
    <el-row>

        <el-col :span="5" class="container">
            <section>
                魏善庄镇驿站监控
            </section>
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
                        <!--width="600"-->
                        <!--height="400"-->
                        <!--id="ysOpenDevice"-->
                        <!--allowfullscreen-->
                        <!--@dblclick="test"-->
                <!--&gt;-->
                <!--</iframe>-->
            <!--</div>-->
            <div>
                <CEZUIKitJS></CEZUIKitJS>
            </div>

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
                    children: 'children',
                    label: 'label'
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

            test() {

                console.log(this.player);
            },
            // this.player.postMessage("play", "https://open.ys7.com/ezopen/h5/iframe")
            // this.player.postMessage("stop", "https://open.ys7.com/ezopen/h5/iframe")
            // this.player.postMessage("capturePicture", "https://open.ys7.com/ezopen/h5/iframe")
            // this.player.postMessage("openSound", "https://open.ys7.com/ezopen/h5/iframe")
            // this.player.postMessage("closeSound", "https://open.ys7.com/ezopen/h5/iframe")
            // this.player.postMessage("startSave", "https://open.ys7.com/ezopen/h5/iframe")
            // this.player.postMessage("stopSave", "https://open.ys7.com/ezopen/h5/iframe")

            play() {
                this.player.postMessage("play", "https://open.ys7.com/ezopen/h5/iframe")
            },

            stop() {
                this.player.postMessage("stop", "https://open.ys7.com/ezopen/h5/iframe")
            },

            capturePicture() {
                this.player.postMessage("capturePicture", "https://open.ys7.com/ezopen/h5/iframe")
            },

            showVideoZoom() {
                console.log(21321);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            fetchList () {
                this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/adminApi/stage/monitor').then(res => {
                    this.oldManInVillage = res.data.data;
                })
            },

        },

        mounted() {
            this.fetchList();

            // this.$refs['playerObj'].videoSrc = 'rtmp://192.168.1.6:8080/onvif/device_service'
            // this.$refs['playerObj'].playerOptions.sources[0].src = 'rtmp://rtmp://192.168.1.6:8080/onvif/device_service'
        }
    }
</script>

<style scoped>
    .container {
        padding-top: 20px;
    }
</style>