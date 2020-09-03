<template>
    <div>志愿者详情</div>
</template>

<script>
    export default {
        name: "VolunteerDetail",
        data() {
            return {
                detail: {},
                queryParams: {}
            }
        },

        methods: {
            getDetail() {
                this.$http.get('/app/children/volunteerActivityDetail?id='+this.queryParams.id + '&token='+ 'ewrewr').then((res) => {
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

</style>