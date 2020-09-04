<template>
    <div>
        商家页面
    </div>
</template>

<script>
    export default {
        name: "Merchant",

        components: {
        },
        data() {
            return {
                detail: {},
                queryParams: {}
            }
        },
        methods: {
            getDetail() {
                this.$http.get('/app/merchant/detail', {
                    params: this.queryParams
                }).then((res) => {
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