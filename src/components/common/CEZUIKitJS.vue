<template>
    <div class="hello-ezuikit-js">
        <div id="video-container" style="width:600px;height:600px"></div>
    </div>
</template>

<script>
    import EZUIKit from "ezuikit-js";
    let player = null;

    export default {
        name: "CEZUIKitJS",
        // data:function () {
        //     return {
        //         player: null,
        //     }
        // },
        props: {
            msg: String
        },
        mounted: () => {
            console.group("mounted 组件挂载完毕状态===============》");
            player =  new EZUIKit.EZUIKitPlayer({
                autoplay: true,
                id: "video-container",
                accessToken:"at.1ub4ksgo1puref4mdu8tzb1bbc99xr67-60skir0pat-07b4ymg-17lwnkvan",
                // url: "ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live,ezopen://open.ys7.com/E61621593/3.live",
                url: "ezopen://open.ys7.com/E61621593/3.live",
                // https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/E61621593/3.hd.live&autoplay=1&audio=1&accessToken=at.1ub4ksgo1puref4mdu8tzb1bbc99xr67-60skir0pat-07b4ymg-17lwnkvan&templete=0
                template: "standard", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
                // 视频上方头部控件
                //header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
                //plugin: ['talk'],                       // 加载插件，talk-对讲
                // 视频下方底部控件
                // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
                footer: ["fullScreen"], // 如果template参数不为simple,该字段将被覆盖
                audio: 0, // 是否默认开启声音 0 - 关闭 1 - 开启
                // openSoundCallBack: data => console.log("开启声音回调", data),
                // closeSoundCallBack: data => console.log("关闭声音回调", data),
                // startSaveCallBack: data => console.log("开始录像回调", data),
                // stopSaveCallBack: data => console.log("录像回调", data),
                // capturePictureCallBack: data => console.log("截图成功回调", data),
                fullScreenCallBack: (data) => {console.log('全屏回调',  data)},
                // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
                width: 600,
                height: 400,
                // width: 1200, // 宽度高度为容器规格，将按照窗口数均分
                // height: 800,
                splitBasis: 3 //设置窗口切割参数
            });


            console.log("player",player);
            // setTimeout(()=>{
            //   player.stop(); // 方法调用示例，10秒后关闭视频
            // },10000)
        },
        methods: {
            change() {
                console.log(321321);
            },

            fullScreen(data) {
                console.log(data);
            },

        }
    };
</script>
