<template>
    <div>
        this is download page

        userAgent: {{userAgent}}

    </div>
</template>

<script>
    export default {
        name: "Download",
        data() {
            return {
                userAgent: 'PC',

                androidDownloadLink: 'https://www.pgyer.com/Le5S',

                IOSDownloadLink: ''
            }
        },

        methods: {

        },

        mounted() {

            console.log(navigator.userAgent);
            console.log(process.env.ANDROID_PACKAGE_URL)
            //https://www.pgyer.com/Le5S   //安卓
            //
            //     IOS下载地址: https://www.pgyer.com/a0ti  com.yz.ainursing
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
                this.userAgent = 'IOS'
                window.location.href = 'https://apps.apple.com/cn/app/%E9%AD%8F%E6%B0%91%E5%85%BB%E8%80%81/id1530116256';
            } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
                // window.location.href ="Android.html";
                this.userAgent = 'Android'
                window.location.href = process.env.ANDROID_PACKAGE_URL;      //生产环境
            } else { //pc
                this.userAgent = 'PC'
                window.close();
            };
        }
    }
</script>

<style scoped>

</style>