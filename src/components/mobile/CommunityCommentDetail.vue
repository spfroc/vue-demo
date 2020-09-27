<template>
    <div class="container" style="height: 100%">
        <el-row>
            <el-col :span="3">
                <el-avatar shape="square" :src="'/images'+commentDetail.headImg">
                    <img src="../../assets/img/default_user.png"/>
                </el-avatar>
            </el-col>
            <el-col :span="13">
                <span>{{commentDetail.userName}}</span>
            </el-col>
        </el-row>
        <el-row style="margin-top: 10px;line-height: 20px;">
            <el-col><div @click="toDetail(commentDetail.id)">{{commentDetail.content}}</div></el-col>
        </el-row>

        <el-row v-if="commentDetail.contentImg" style="margin-top: 10px;line-height: 20px;">
            <el-col :span="12"><el-image :src="'/images'+commentDetail.contentImg"></el-image></el-col>
        </el-row>
        <el-row style="margin-top: 10px;line-height: 20px;">
            <el-col :span="8">
                <span><div @click="toDetail(commentDetail.id)" style="color: gray;">{{commentDetail.createTime.substr(5, 11)}}</div></span>
            </el-col>
            <el-col :span="13">
                <!--<span><span @click="replyShow(commentDetail.id)">{{commentDetail.replyNum}}回复</span></span>-->
                <span>  &nbsp;</span>
            </el-col>
            <el-col :span="3">
                <span v-if="commentDetail.isMine"><span style="color: red;" @click="deleteComment(commentDetail.id)">删除</span></span>
            </el-col>

        </el-row>
        <section style="margin-top: 30px;">全部评论</section>
        <section v-for="(comment, index) in commentDetail.list" :key="index" :style="paddingStyle">
            <el-row>
                <el-col :span="3">
                    <el-avatar shape="square" :src="'/images'+comment.headImg">
                        <img src="../../assets/img/default_user.png"/>
                    </el-avatar>
                </el-col>
                <el-col :span="13">
                    <span>{{comment.userName}}</span>
                </el-col>
            </el-row>
            <el-row style="margin-top: 10px;line-height: 20px;">
                <el-col><div @click="toDetail(comment.id)">{{comment.content}}</div></el-col>
            </el-row>

            <el-row v-if="comment.contentImg" style="margin-top: 10px;line-height: 20px;">
                <el-col :span="12"><el-image :src="'/images'+comment.contentImg"></el-image></el-col>
            </el-row>
            <el-row style="margin-top: 10px;line-height: 20px;">
                <el-col :span="8">
                    <span><div @click="toDetail(comment.id)" style="color: gray;">{{comment.createTime.substr(5, 11)}}</div></span>
                </el-col>
                <el-col :span="13">
                    <span><span @click="replyShow(comment.id)">{{comment.replyNum || 0}}回复<i class="el-icon-arrow-right"></i></span></span>
                </el-col>
                <el-col :span="3">
                    <span v-if="comment.isMine"><span style="color:red;" @click="deleteComment(comment.id)">删除</span></span>
                    <!--<span v-if="!comment.isMine">&nbsp;</span>-->
                </el-col>

            </el-row>
        </section>
        <community-comment-detail-dialog v-if="dialogVisible"
                                         :query-params="queryParams"
                                         :evaluate-id="evaluateId"
                                         :hide-dialog="hideDialog"
        ></community-comment-detail-dialog>
        <div class="mask" @click="() => {this.dialogVisible = false;}" v-if="dialogVisible"></div>

    </div>
</template>

<script>
    import CommunityCommentDetailDialog from './CommunityCommentDetailDialog'

    export default {
        name: "CommunityCommentDetail",
        components: {
            CommunityCommentDetailDialog
        },
        data() {
            return {
                queryParams: {},
                commentDetail: {},
                paddingStyle: {
                    paddingTop: '20px'
                },
                dialogVisible: false,
                form: {
                    content: ''
                },
            }
        },

        methods: {
            replyShow(evaluateId = 0) {
                if(evaluateId != 0) {
                    this.form.evaluateId = evaluateId;
                    this.evaluateId = evaluateId;
                }
                this.dialogVisible = true;
                this.form.content = '';
                console.log(this.evaluateId);

            },

            reply() {
                this.form.token = this.queryParams.token;
                this.form.communityId = this.queryParams.communityId;
                this.$common.appTokenAxios().get('/app/community/evaluate', {
                    params: this.form
                }).then(res => {
                    this.$message({
                        message: res.data.message || '评价成功！将在审核通过后显示',
                        type: 'success'
                    })

                    this.dialogVisible = false;
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
                this.commentDetail.list.forEach((comment, index) => {
                    if(id == comment.id) {
                        this.commentDetail.list.splice(index, 1)
                        return;
                    }
                })
            },

            getDetail() {
                this.$common.appTokenAxios().get('/app/community/evaluateDetail', {
                    params: {
                        evaluateId: this.queryParams.evaluateId,
                        token: this.queryParams.token,
                    }
                }).then(res => {
                    console.log('detail:', res.data.data);
                    this.commentDetail = res.data.data;
                })
            },

            toDetail(id) {
                window.location.href = '/#/app/community-comment-detail?evaluateId='+id + '&communityId='+ this.queryParams.communityId +'&token='+this.queryParams.token;
                window.location.reload()
            },

            hideDialog() {
                this.dialogVisible = false;
            },
        },

        mounted() {
            this.queryParams = this.$route.query;
            this.getDetail();
        }
    }
</script>

<style>
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


    .comment-dialog {
        position: fixed;
        bottom: 0px;
        background-color: white;
        width: 94%;
        height: 120px;
        z-index: 3000;
    }
    .mask{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2999;
        top: 0px;
        left: 0px;
    }
</style>