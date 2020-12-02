<template>
    <div class="container">
        <!--<h4>{{detail.name}}</h4>-->
        <div v-html="detail.text" :style="localStyle" class="text-container" >
            <!--<el-image fit="cover" :src="'/images' + detail.pic" style="margin-top: 10px;">-->
                <!--<img src="../../assets/img/default_user.png"/>-->
            <!--</el-image>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "BannerLink",
        components: {
        },
        data() {
            return {
                localStyle: {
                    height: "800px",
                    marginBottom: '20px'
                },
                // height: 800,
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
            this.localStyle.height = (document.body.clientHeight - 60) + 'px';
        }
    }
</script>

<style scoped>
    .text-container {

        overflow-y: auto;

    }

    ::-webkit-scrollbar {
        width: 0 !important;
    }
    ::-webkit-scrollbar {
        width: 0 !important;height: 0;
    }
</style>