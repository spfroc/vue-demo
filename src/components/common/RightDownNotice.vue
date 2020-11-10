<template>
    <div v-if="centerDialogVisible" ref="inOutNotice" id="in-out-notice" :class="classString">
        <div class="notice-bar">
            <i class="el-icon-bell notice-bar-ring"></i>
            <span class="notice-bar-text">电子围栏</span>
            <i class="el-icon-close close-icon" @click="close()"></i>
        </div>
        <div class="date-time">{{info.dateTime}}</div>
        <div class="old-man-name-container"><span class="old-man-name">{{info.name}}</span><span class="old-man">老人</span></div>
        <div class="old-man-mobile">手机号: {{info.mobile}}</div>
        <div class="notice-text">{{text}}</div>
    </div>
</template>

<script>
    export default {
        name: "RightDownNotice",
        data() {
            return {
                centerDialogVisible: true,

                info: {
                    type: 1,
                    dateTime: '2020-11-10 17:00',
                    name: '程术凤',
                    mobile: '15119988776',
                    address: '魏庄镇伊庄村',
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
                    // this.centerDialogVisible = !this.centerDialogVisible;

                    this.$refs['inOutNotice'].classList.remove('move')
                    setTimeout(() => {
                        if(this.info.type == 1) {
                            this.info.type = 2;
                            this.classString = 'in move'
                        } else {
                            this.classString = 'out move'
                            this.info.type = 1;
                        }
                    },0);

                    // window.requestAniationFrame(function (time) {
                    //     this.classString += ' move';
                    // })

                    console.log(this.classString);
                    // this.centerDialogVisible = !this.centerDialogVisible;
                }, 4000)
            }
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