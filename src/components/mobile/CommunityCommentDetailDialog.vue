<template>
    <div class="comment-dialog" ref="dom-to-scroll">
        <el-row >
            <el-col :span="20">
                <el-form style="padding-top: 20px;padding-bottom: 20px;" :model="form" :rules="rules" ref="form">
                    <el-form-item prop="content">
                        <el-input style="width: 100%;"
                                  type="textarea"
                                  :placeholder='"评价内容"'
                                  @focus="scrollToViewLocation"
                                  :autosize="{ minRows: 2, maxRows: 5}"
                                  v-model="form.content"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4" style="padding-top: 20px;padding-bottom: 20px;">
                <span style="color: #fd7f04;font-size: 20px;margin-left: 15px;font-weight: bold;" @click="reply">发布</span>
            </el-col>

        </el-row>
        <div class="mask"></div>
        <span slot="footer" class="dialog-footer"></span>
    </div>
</template>

<script>
    export default {
        name: "CommunityCommentDetailDialog",

        props: [
            "queryParams", "hideDialog","evaluateId","communityId"
        ],

        data() {
            return {
                rules: {
                    content: {required: true, message: '请输入评论内容', trigger: 'blur'}
                },
                form: {
                    content: ''
                },
            }
        },

        methods: {
            reply() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        this.form.token = this.queryParams.token;
                        if(this.queryParams.id) {
                            this.form.communityId = this.queryParams.id;
                        } else if(this.queryParams.communityId) {
                            this.form.communityId = this.queryParams.communityId;
                        }

                        if(this.evaluateId) {
                            this.form.evaluateId = this.evaluateId
                            this.form.subEvaluateId = this.evaluateId
                        }
                        this.$common.appTokenAxios().get('/app/community/evaluate', {
                            params: this.form
                        }).then(res => {
                            console.log(res);
                            this.$message({
                                message: res.data.message || '评价成功！将在审核通过后显示',
                                type: 'success'
                            })
                            this.hideDialog()
                        })
                    }

                })
            },

            scrollToViewLocation() {
                setTimeout(() => {
                    this.$refs['dom-to-scroll'].scrollIntoView({behavior: 'smooth', block: 'start'});
                }, 500)
            }
        },

        mounted() {
            let ua = window.navigator.userAgent.toLocaleLowerCase();

            console.log(ua);
            const originHeight = document.documentElement.clientHeight || document.body.clientHeight;
            window.addEventListener('resize', () => {
                const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
                if (resizeHeight < originHeight) {
                    // 键盘弹起所后所需的页面逻辑
                    this.debug = '1';
                    this.scrollToViewLocation();
                } else {
                    // 键盘弹起所后所需的页面逻辑
                    this.debug = '2';
                    this.scrollToViewLocation();
                }
            }, false);


        }
    }
</script>

<style scoped>
    .comment-dialog {
        position: fixed;
        top: 0px;
        background-color: white;
        width: 94%;
        height: 150px;
        z-index: 3000;
    }

    .mask {
        width: 100%;
        height: 1000px;
        z-index: 2999;
        margin-top: -20px;
        position: relative;
        background-color: white;
    }
</style>