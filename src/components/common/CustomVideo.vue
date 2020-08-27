<template>
    <div style="width: 400px; height: 200px;">

        <!--<iframe-->
                <!--style="width: 100%;height: 100%;"-->

                <!--:id="device"-->
                <!--:src="src"-->
                <!--frameborder="0"-->
                <!--allowfullscreen-->
                <!--allowtransparency="true"></iframe>-->
        <!--<div :id="device+'_cover'"-->
             <!--@click="fullScreen"-->
             <!--style="width: 400px; height: 200px; position: relative; z-index: 20; top: -205px"-->
        <!--&gt;</div>-->


        <!--<el-dialog :visible="showFullScreen" :append-to-body="destroyOnClose" :fullscreen="fullscreen" :title="device+'_'+channel" :destroy-on-close="destroyOnClose">-->
            <!--<iframe-->
                    <!--style="width: 100%; height: 1080px"-->
                    <!--:src="src"-->
                    <!--frameborder="0"-->
                    <!--allowfullscreen-->
                    <!--@close="closeDialog"-->
                    <!--allowtransparency="true"></iframe>-->
        <!--</el-dialog>-->

        <video
                id="myplayer"
                src="http://hls01open.ys7.com/openlive/f01018a141094b7fa138b9d0b856507b.hd.m3u8"
                width="400"
                height="300"
                autoplay
                controls
                playsInline
        >
        </video>
    </div>
</template>

<script>

    import EZUIKit from 'ezuikit-js';
    export default {
        name: "CustomVideo",
        components: {
            EZUIKit
        },
        props: [
            'id',
            'accessToken',
            'device',
            'audio',
            'autoplay',
            'channel',
            'mode',
        ],

        data() {
            return {
                fullscreen: true,
                destroyOnClose: true,
                player: null,
                showFullScreen: false,
                baseUrl: 'https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/',
                //        https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/E61621593/5.live&autoplay=1&audio=1&accessToken=at.1ub4ksgo1puref4mdu8tzb1bbc99xr67-60skir0pat-07b4ymg-17lwnkvan&templete=0
            }
        },
        computed: {
            src () {
                if(this.mode != undefined) {
                    return this.baseUrl + this.device+ '/' + this.channel + '.' + this.mode +'.' + 'live' + '&autoplay=' + this.autoplay + '&audio='+ this.audio + '&accessToken=' + this.accessToken + '&template=0';

                } else {
                    return this.baseUrl + this.device+ '/' + this.channel + '.' + 'live' + '&autoplay=' + this.autoplay + '&audio='+ this.audio + '&accessToken=' + this.accessToken + '&template=0';
                }
            }
        },

        methods: {
            fullScreen() {
                this.showFullScreen = !this.showFullScreen;
            },

            closeDialog() {
                console.log(21312);
                this.fullScreen();
            }
        },

        mounted() {

            // this.player = document.getElementById(this.device)
            // console.log(this.player);
            let player = new EZUIKit.EZUIKitPlayer({
                id: 'myPlayer',
                url: 'ezopen://open.ys7.com/E61621593/3.live',
                autoplay: true,
                accessToken: "at.1ub4ksgo1puref4mdu8tzb1bbc99xr67-60skir0pat-07b4ymg-17lwnkvan",
                // decoderPath: '{{location path}}',
                width: 600,
                height: 400,
            });
            console.log('~~~', player);
            player.play();
        }


    }
</script>

<style scoped>

</style>