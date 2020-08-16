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

            <img src="http://192.168.1.6:8080/video" alt="" width="200px">

        </el-col>
    </el-row>
</template>

<script>

    import VideoPlayer from "../common/VideoPlayer";
    export default {
        name: "Monitor",
        components: {
            VideoPlayer
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