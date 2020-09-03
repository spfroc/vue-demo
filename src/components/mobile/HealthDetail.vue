<template>
    <div class="global">
        <h4 class="all-center">{{detail.title}}</h4>
        <div class="all-center">
            <span>2020-09-07</span>
        </div>
        <div class="text-container all-center" v-html="detail.content"></div>
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
                this.$http.get('/app/index/healthDetail', {
                    params: this.queryParams
                }).then((res) => {
                    console.log(res);
                    this.detail = res.data.data;
                });
            }
        },

        mounted() {
            this.queryParams = this.$route.query;
            console.log(this.queryParams);
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

    .all-center {
        margin: 0px auto;
        width: 96%;
    }

</style>