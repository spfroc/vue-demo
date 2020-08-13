<template>
    <div>
        <video ref="videoPlayer" class="video-js">
            <source src="http://192.168.1.6:8080/video" type="video/mp4">
            <!--<source src="http://vjs.zencdn.net/v/oceans.webm" type="video/webm">-->
            <!--<source src="http://vjs.zencdn.net/v/oceans.ogv" type="video/ogg">-->
            <!--<track kind="captions" src="../shared/example-captions.vtt" srclang="en" label="English">-->
            <!--<track kind="subtitles" src="../shared/example-captions.vtt" srclang="en" label="English">-->
            <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
        </video>
    </div>
</template>

<script>
    import videojs from 'video.js';

    export default {
        name: "VideoPlayer",
        props: {
            options: {
                type: Object,
                default() {
                    return {
                        // src: 'rtmp://live.hkstv.hk.lxdns.com/live/hks1',
                        // language: 'zh-CN'
                    };
                }
                // src: 'rtmp://live.hkstv.hk.lxdns.com/live/hks1',
                // language: 'zh-CN'
            }
        },
        data() {
            return {
                player: null
            }
        },
        mounted() {
            console.log(111, this.options);
            this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
                console.log(222);
                // console.log('onPlayerReady', this);
            })
        },
        beforeDestroy() {
            if (this.player) {
                this.player.dispose()
            }
        }
    }

</script>

<style scoped>

</style>