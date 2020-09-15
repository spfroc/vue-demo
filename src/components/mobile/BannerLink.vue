<template>
    <div class="container">
        <h4>{{detail.name}}</h4>

        <div class="text-container" v-html="detail.text"></div>
    </div>
</template>

<script>
    export default {
        name: "BannerLink",
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
                this.$http.get('/app/banner/detail', {
                    params: this.queryParams
                }).then((res) => {
                    this.detail = res.data.data.banner;
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
        overflow-y:auto
    }
</style>