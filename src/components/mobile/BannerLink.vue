<template>
    <div class="container" style="height: 100%; overflow-y:auto;">
        <h4>{{detail.name}}</h4>
        <div>
            <el-image :src="'/images' + detail.pic" style="margin-top: 10px;">
                <img src="../../assets/img/default_user.png"/>
            </el-image>
        </div>
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
        overflow-y:auto;
        margin-bottom: 20px;
    }
</style>