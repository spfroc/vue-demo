<template>
    <div>
        <el-card class="box-card home-container">
            <div v-for="(o,i) in list" :key="i" class="item">
                <div class="card-value"><strong>{{o.value}}</strong></div>
                <div class="card-title">{{o.title}}{{invokedAt}}</div>
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
                    },
                    {
                        title: '最近调用时间',
                        value: '老人信息',
                    },
                    {
                        title: '最近调用时间',
                        value: '社工信息',
                    },
                    {
                        title: '最近调用时间',
                        value: '服务数据',
                    },
                    {
                        title: '最近调用时间',
                        value: '老人围栏报警',
                    },

                ]
            }
        },

        methods:{
            getApiData() {
                this.$http.get('/apis/cityBrain/lastRequestTime').then(res => {
                    console.log(res);
                    this.invokedAt = res.data.data.lastRequestTime;
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
        margin: 20px 30px;
        float: left;
        border: solid lightgray 1px;
        height: 100px;
        width: 250px;
    }

    .card-value {
        margin-top: 15px;
        font-size: 30px;
    }

    .card-title {
        font-size: 8px;
        color: gray;
        float: left;
        margin: 30px auto auto 10px;
    }

    .box-card {
        width: 100%;
        margin-bottom: 10px;
        height: 100%;
    }
</style>