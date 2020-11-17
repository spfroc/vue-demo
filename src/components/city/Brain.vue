<template>
    <div>
        <el-card class="box-card home-container">
            <div v-for="(o,i) in list" :key="i" class="item">
                <div class="card-value"><strong>{{o.value}}</strong></div>
                <div class="card-title">{{o.title}}{{o.invokedAt.substr(0,16)}}</div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Brain",
        data () {
            return {
                invokedAt: '',
                list: [
                    {
                        title: '最近调用时间',
                        value: '驿站信息',
                        invokedAt: '',
                    },
                    {
                        title: '最近调用时间',
                        value: '老人信息',
                        invokedAt: '',
                    },
                    {
                        title: '最近调用时间',
                        value: '社工信息',
                        invokedAt: '',
                    },
                    {
                        title: '最近调用时间',
                        value: '服务数据',
                        invokedAt: '',
                    },
                    {
                        title: '最近调用时间',
                        value: '老人围栏报警',
                        invokedAt: '',
                    },

                ]
            }
        },

        methods:{
            getApiData() {
                this.$http.get('/apis/cityBrain/lastRequestTime', {
                    params: {
                        type: 'countOldManNum'
                    }
                }).then(res => {
                    this.list[1].invokedAt = res.data.data.lastRequestTime;
                });

                this.$http.get('/apis/cityBrain/lastRequestTime', {
                    params: {
                        type: 'countSocialWorkerNum '
                    }
                }).then(res => {
                    this.list[2].invokedAt = res.data.data.lastRequestTime;
                });

                this.$http.get('/apis/cityBrain/lastRequestTime', {
                    params: {
                        type: 'countCourierStationNum '
                    }
                }).then(res => {
                    this.list[0].invokedAt = res.data.data.lastRequestTime;
                });

                this.$http.get('/apis/cityBrain/lastRequestTime', {
                    params: {
                        type: 'countWorkOrderNum '
                    }
                }).then(res => {
                    this.list[3].invokedAt = res.data.data.lastRequestTime;
                });

                this.$http.get('/apis/cityBrain/lastRequestTime', {
                    params: {
                        type: 'railDataList '
                    }
                }).then(res => {
                    this.list[4].invokedAt = res.data.data.lastRequestTime;
                });
            }
        },

        mounted() {
            this.getApiData();
        }
    }
</script>

<style scoped>
    .home-container {
        text-align: center;
    }

    .item {
        float: left;
        border: solid lightgray 1px;
        height: 150px;
        width: 250px;
    }

    .item:not(:first-child) {
        margin-left: 50px;
    }

    .card-value {
        margin-top: 45px;
        font-size: 30px;
    }

    .card-title {
        font-size: 8px;
        color: gray;
        float: left;
        margin-left:10px;
        margin-top: 40px;
    }

    .box-card {
        width: 100%;
        margin-bottom: 10px;
        height: 100%;
    }
</style>