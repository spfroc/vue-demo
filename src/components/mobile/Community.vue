<template>
    <div>
        <h4>{{detail.title}}</h4>
        <div>
            <span>{{dateTimeToDate}}</span>
        </div>
        <div class="text-container" v-html="detail.content"></div>
    </div>
</template>

<script>

    export default {
        name: "Community",
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
                this.$http.get('/app/community/detail?id='+this.queryParams.id).then((res) => {
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
    overflow-y:auto

}
</style>