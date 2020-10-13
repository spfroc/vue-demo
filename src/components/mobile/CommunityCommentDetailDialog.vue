<template>
    <div class="comment-dialog" ref="dom-to-scroll">
        <el-row>
            <el-col :span="20">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item prop="content">
                        <el-input style="width: 100%;"
                                  type="textarea"
                                  placeholder="评价内容"
                                  @focus="scrollToViewLocation"
                                  :autosize="{ minRows: 2, maxRows: 5}"
                                  v-model="form.content"></el-input>
                    </el-form-item>
                </el-form>

            </el-col>
            <el-col :span="4">
                <span style="color: #fd7f04;font-size: 20px;margin-left: 15px;font-weight: bold;" @click="reply">发布</span>
            </el-col>
        </el-row>
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
                alert(222);
                setTimeout(() => {
                    this.$refs['dom-to-scroll'].scrollIntoView();
                }, 500)
            }
        }
    }
</script>

<style scoped>
    .comment-dialog {
        position: fixed;
        bottom: 0px;
        background-color: white;
        width: 94%;
        height: 120px;
        z-index: 3000;
    }
</style>