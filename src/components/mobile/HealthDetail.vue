<template>
    <div class="container" style="height: 100%; overflow-y:auto;">
        <h4 class="all-center">{{detail.title}}</h4>
        <div class="all-center" style="margin-top: 10px;color: gray;">
            <span>2020-09-07</span>
        </div>
        <div class="all-center" style="margin-top: 10px;color: gray;">
            <el-image :src="'/images'+detail.img"></el-image>
        </div>
        <div class="text-container all-center" style="padding-bottom: 20px;" v-html="detail.content"></div>
    </div>
</template>

<script>
    export default {
        name: "HealthDetail",

        data() {
            return {
                detail: {},
                queryParams: {}
            }
        },

        computed:{
            dateTimeToDate() {
                if(this.detail.createTime) {
                    return this.detail.createTime.substr(0,10)
                } else {
                    return ''
                }
            }
        },

        methods: {
            getDetail() {
                this.$common.appTokenAxios().get('/app/index/healthDetail', {
                    params: this.queryParams
                }).then((res) => {
                    console.log(res);
                    this.detail = res.data.data;
                });
            }
        },

        mounted() {
            this.queryParams = this.$route.query;
            this.getDetail();
        }
    }
</script>

<style scoped>
    .text-container {
        padding-top: 10px;
        height: 800px;
        overflow-y:auto;
        /*margin：0 auto;*/


    }

</style>