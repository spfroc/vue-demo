<template>
    <div>
        <el-card class="box-card home-container">
            <div v-for="o in list" :key="o.title" class="item">
                <div class="card-value"><strong>{{o.value}}</strong></div>
                <div class="card-title">{{o.title}}</div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Brain",
        data () {
            return {
                list: [
                    {
                        title: '最近调用时间2020-07-21 14:00',
                        value: '驿站信息',
                    },
                    {
                        title: '最近调用时间2020-07-21 14:02',
                        value: '老人信息',
                    },
                    {
                        title: '最近调用时间2020-07-21 14:03',
                        value: '社工信息',
                    },
                    {
                        title: '最近调用时间2020-07-21 14:04',
                        value: '服务数据',
                    },
                    {
                        title: '最近调用时间2020-07-21 14:05',
                        value: '老人围栏报警',
                    },

                ]
            }
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
    }

    .box-card {
        width: 100%;
        margin-bottom: 10px;
        height: 100%;
    }
</style>