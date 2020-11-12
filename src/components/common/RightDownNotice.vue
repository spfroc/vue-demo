<template>
    <div v-show="centerDialogVisible" ref="inOutNotice" id="in-out-notice" :class="classString">
        <div class="notice-bar">
            <i class="el-icon-bell notice-bar-ring"></i>
            <span class="notice-bar-text">电子围栏</span>
            <i class="el-icon-close close-icon" @click="close()"></i>
        </div>
        <div class="date-time">{{info.createTime && info.createTime.substring(0, 16)}}</div>
        <div class="old-man-name-container"><span class="old-man-name">{{info.oldManName}}</span><span class="old-man">老人</span></div>
        <div class="old-man-mobile">手机号: {{info.oldManMobile}}</div>
        <div class="notice-text">{{info.content || text}}</div>
    </div>
</template>

<script>
    export default {
        name: "RightDownNotice",
        data() {
            return {
                centerDialogVisible: false,
                info: {
                    type: 1,
                    createTime: '2020-11-10 17:00:00',
                    oldManName: '程术凤',
                    oldManMobile: '15119988776',
                    address: '魏庄镇伊庄村',
                    content: '',
                },

                classString: 'in'
            }
        },

        computed: {
            text() {
                let textString = '';
                let suffix = '';
                if (this.info.type == 1) {   //
                    textString += '进入';
                } else {    //出
                    textString += '离开';
                    suffix = '请尽快核实具体情况!';
                }
                textString += this.info.address + '电子围栏范围。' + suffix;
                return textString;
            },
        },

        methods: {
            close() {
                this.centerDialogVisible = !this.centerDialogVisible;
            },

            getInfo() {
                setInterval(() => {
                    // console.log(this.$refs['inOutNotice'].classList);
                    // if(this.$refs['inOutNotice'].classList) {

                    // }
                    //this.$refs['inOutNotice'].classList.remove('move')

                    setTimeout(() => {
                        this.$http.get('/apis/badge/oldManInOutForAdmin').then(res => {
                        // this.$http.get('http://rap2api.taobao.org/app/mock/261698/adminApi/badge/oldManInOutForAdmin').then(res => {
                            if(this.info != res.data.data) {
                                this.info = res.data.data;
                                if(this.info.type && this.info.createTime && this.info.oldManMobile && this.info.oldManName) {


                                    this.centerDialogVisible = false;
                                    if(this.info.type == 10) {
                                        console.log(10);
                                        this.classString = 'in move'
                                    } else {
                                        console.log(12);
                                        this.classString = 'out move'
                                    }

                                    setTimeout(() => {
                                        this.centerDialogVisible = true;
                                    }, 1000)
                                }
                            }


                        });
                    },0);
                }, 4000)
            },
        },

        mounted() {
            this.getInfo();
        }


    }
</script>

<style scoped>
#in-out-notice {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 400px;
    height: 200px;
    background-color: antiquewhite;
    z-index: 2500
}

.move {
    -moz-animation:myfirst 1s ease; /* Firefox */
    -webkit-animation:myfirst 1s ease; /* Safari and Chrome */
    -o-animation:myfirst 1s ease; /* Opera */
}
.in {
    color: limegreen;
}

.out {
    color: darkorange;
}
.close-icon {
    float: right;
    color: dimgray;
    margin-right: 10px;
    margin-top: 3px;
}

.reset {
    bottom: -200px
}

.notice-bar {
    font-size: 15px;
}
    
.notice-bar-ring {
    color: darkorange;
}

.notice-bar-text {
    color: dimgray;
}

.date-time {
    margin-left: 20px;
    margin-top: 20px;
}

.old-man-name {
    font-size: 30px;
    color: black;
    font-weight: bold;
}

.old-man {
    color: dimgray;
}

.old-man-mobile {
    margin-left: 20px;
    margin-top: 10px;
    color: dimgray;
}

.old-man-name-container {
    margin-left: 20px;
}

.notice-text {
    margin-left: 20px;
    margin-top: 20px
}

@keyframes myfirst
{
    from {bottom:-200px;}
    to {bottom:0;}
}

@-moz-keyframes myfirst /* Firefox */
{
    from {bottom:-200px;}
    to {bottom:0;}
}

@-webkit-keyframes myfirst /* Safari and Chrome */
{
    from {bottom:-200px;}
    to {bottom:0;}
}

@-o-keyframes myfirst /* Opera */
{
    from {bottom:-200px;}
    to {bottom:0;}
}
</style>