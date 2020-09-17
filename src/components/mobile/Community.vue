<template>
    <div class="container" style="height: 100%; overflow-y:auto;" ref="container">
        <h4>{{detail.title}}</h4>
        <div style="margin-top: 10px;color: gray;">
            <span>{{dateTimeToDate}}</span>
        </div>
        <div class="text-container" v-html="detail.content"></div>
        <div class="comment-container" style="margin-top: 20px">
            <el-row style="padding-bottom: 10px">
                <el-col :span="4">
                    <div style="font-weight: bold;">评论</div>
                </el-col>
                <el-col :span="16">&nbsp;</el-col>
                <el-col :span="4"><span @click="replyShow(0)" style="color: #fd7f04;">写评价</span></el-col>
            </el-row>
            <section v-for="(comment, index) in comments" :key="index" :style="index > 0 ? paddingStyle: ''">
                <el-row>
                    <el-col :span="3">
                        <el-avatar shape="square" :src="'/images'+comment.headImg">
                            <img src="../../assets/img/default_user.png"/>
                        </el-avatar>
                    </el-col>
                    <el-col :span="13">
                        <span style="font-weight: bold;">{{comment.userName || 'null'}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col><div @click="toDetail(comment.id)">{{comment.content}}</div></el-col>
                </el-row>

                <el-row v-if="comment.contentImg">
                    <el-col :span="12"><el-image :src="'/images'+comment.contentImg"></el-image></el-col>
                </el-row>
                <el-row style="margin-top: 10px;line-height: 20px;">
                    <el-col :span="8">
                        <span><div @click="toDetail(comment.id)" style="color: gray;">{{comment.createTime.substr(5, 11)}}</div></span>
                    </el-col>

                    <el-col :span="13">
                        <span><span @click="replyShow(comment.id)">{{comment.replyNum}}回复<i class="el-icon-arrow-right"></i></span></span>
                    </el-col>
                    <el-col :span="3">
                        <span v-if="comment.isMine"><span style="color: red;" @click="deleteComment(comment.id)">删除</span></span>
                    </el-col>

                </el-row>
                <el-row v-if="comments.length == 0">
                    <el-col>没有更多</el-col>
                </el-row>
            </section>
            <el-dialog
                    :visible.sync="dialogVisible"
                    width="100%"
                    top="82vh"
                    :modal="false"
                    :show-close="false"
                    :close-on-click-modal=true
                    :destroy-on-close=true
                    >
                    <el-row>
                        <el-col :span="20">
                            <el-form :model="form" :rules="rules" ref="form">
                                <el-form-item prop="content">
                                    <el-input style="width: 100%;"
                                              type="textarea"
                                              placeholder="评价内容"
                                              :autosize="{ minRows: 2, maxRows: 5}"
                                              v-model="form.content"></el-input>
                                </el-form-item>
                            </el-form>

                        </el-col>
                        <el-col :span="4">
                            <span style="color: #fd7f04;font-size: 20px;margin-left: 15px;" @click="reply">发布</span>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                    </span>

            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Community",
        data() {
            return {
                rules: {
                    content: {required: true, message: '请输入评论内容', trigger: 'blur'}
                },
                form: {
                    content: ''
                },

                dialogVisible: false,
                detail: {},
                queryParams: {},
                paddingStyle: {
                  paddingTop: '20px'
                },
                page:{
                    pageNo: 1,
                    pageSize: 20
                },
                comments: []
            }
        },

        computed:{
            dateTimeToDate() {
                if(this.detail.createTime) {
                    if(isNaN(this.detail.createTime)) {
                        return this.detail.createTime.substr(0,10)

                    } else {
                        let date = new Date(this.detail.createTime)
                        return date.getFullYear() + '-' + (parseInt(date.getMonth())+1) + '-' + date.getDate()
                    }
                } else {
                    return ''
                }
            }
        },

        methods: {

            toDetail(id) {
                console.log(id);

                window.location.href = '/#/app/community-comment-detail?evaluateId='+id + '&communityId='+ this.queryParams.id +'&token='+this.queryParams.token;
            },
            replyShow(evaluateId = 0) {
                this.dialogVisible = true;
                this.form.content = '';
                if(evaluateId != 0) {
                    this.form.evaluateId = evaluateId;
                }
            },

            reply() {
                this.$refs['form'].validate((valid) => {
                    if(valid) {
                        this.form.token = this.queryParams.token;
                        this.form.communityId = this.queryParams.id;
                        this.$common.appTokenAxios().get('/app/community/evaluate', {
                            params: this.form
                        }).then(res => {
                            console.log(res);
                            this.$message({
                                message: res.data.message || '评价成功！将在审核通过后显示',
                                type: 'success'
                            })
                            this.dialogVisible = false;
                        })
                    }

                })
            },

            deleteComment(id) {
                this.removeCommentFromCommentsList(id)
                this.$common.appTokenAxios().get('/app/mine/deleteEvaluate', {
                    params: {
                        id: id,
                        type: 2,
                        token: this.queryParams.token,
                    }
                }).then(res => {
                    this.$message({
                        message: res.data.message || '操作成功',
                        type: 'success'
                    })
                })

            },

            removeCommentFromCommentsList(id) {
                this.comments.forEach((comment, index) => {
                    if(id == comment.id) {
                        this.comments.splice(index, 1)
                        return;
                    }
                })
            },

            getDetail() {
                this.$common.appTokenAxios().get('/app/community/detail?id='+this.queryParams.id, {
                    params: {
                        token: this.queryParams.token,
                    }
                }).then((res) => {
                    this.detail = res.data.data;
                });
            },

            getComments() {
                this.$common.appTokenAxios().get('/app/community/evaluateList', {
                    params: {
                        token: this.queryParams.token,
                        communityId: this.queryParams.id,
                        // merchantId: 1,
                        pageNo: this.page.pageNo,
                        pageSize: this.page.pageSize
                    }
                }).then(res => {
                    if(res.data.data.list.length > 0) {
                        this.comments = this.comments.concat(res.data.data.list);
                    }
                    if(res.data.data.pageNo) {
                        this.page.pageNo = parseInt(res.data.data.pageNo) + 1
                    }

                });
            },

            handleScroll() {
                let container = this.$refs.container;
                if(container) {
                    console.log('scrollTop:',container.scrollHeight, 'scrollHeight:',container.scrollTop, 'scrollTop-scrollHeight:', container.scrollHeight - container.scrollTop);
                    if (container.scrollHeight - container.scrollTop < 800) {
                        this.getComments();
                    }
                }

            }
        },

        mounted() {
            this.queryParams = this.$route.query;
            this.getDetail();
            this.getComments();

            window.addEventListener('scroll', this.handleScroll, true)
        }
    }
</script>

<style>
.text-container {
    /*padding-top: 10px;*/
}
.el-dialog__header {
    display: none;
}
.el-dialog__footer {
    display: none;
}
.el-dialog__body {
    padding: 0 0;
}

textarea {
    min-height: 54px;
    height: 148px;
}
.el-textarea__inner {
    padding: 0px 0px 0px 20px;
}
.el-dialog__wrapper {
    overflow: visible;
}
</style>