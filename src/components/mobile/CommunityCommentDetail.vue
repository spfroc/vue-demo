<template>
    <div class="container">
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
        <el-row>
            <el-col><div @click="toDetail(commentDetail.id)">{{commentDetail.content}}{{commentDetail.id}}</div></el-col>
        </el-row>

        <el-row v-if="commentDetail.contentImg">
            <el-col :span="12"><el-image :src="'/images'+commentDetail.contentImg"></el-image></el-col>
        </el-row>
        <el-row>
            <el-col :span="18">
                <span><div @click="toDetail(commentDetail.id)">{{commentDetail.createTime}}</div></span>
            </el-col>
            <el-col :span="3">
                <span v-if="commentDetail.isMine"><button @click="deleteComment(commentDetail.id)">删除</button></span>
                <span v-if="!commentDetail.isMine">&nbsp;</span>

            </el-col>
            <el-col :span="3">
                <span><button @click="replyShow(commentDetail.id)">{{commentDetail.replyNum}}回复</button></span>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <section>全部评论</section>
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
            <el-row>
                <el-col><div @click="toDetail(comment.id)">{{comment.content}}{{comment.id}}</div></el-col>
            </el-row>

            <el-row v-if="comment.contentImg">
                <el-col :span="12"><el-image :src="'/images'+comment.contentImg"></el-image></el-col>
            </el-row>
            <el-row>
                <el-col :span="18">
                    <span><div @click="toDetail(comment.id)">{{comment.createTime}}</div></span>
                </el-col>
                <el-col :span="3">
                    <span v-if="comment.isMine"><button @click="deleteComment(comment.id)">删除</button></span>
                    <span v-if="!comment.isMine">&nbsp;</span>

                </el-col>
                <el-col :span="3">
                    <span><button @click="replyShow(comment.id)">{{comment.replyNum}}回复</button></span>
                </el-col>
            </el-row>
        </section>
        <el-dialog
                title="评价"
                :visible.sync="dialogVisible"
                width="100%"
                top="65vh"
                :close-on-click-modal=true
                :destroy-on-close=true
        >
            <el-input v-model="form.content"></el-input>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="reply">发 布</el-button>
                    </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "CommunityCommentDetail",

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
                this.dialogVisible = true;
                this.form.content = '';
                if(evaluateId != 0) {
                    this.form.evaluateId = evaluateId;
                }
            },

            reply() {
                this.form.token = this.queryParams.token;
                this.form.communityId = this.queryParams.communityId;
                this.$common.appTokenAxios().get('/app/community/evaluate', {
                    params: this.form
                }).then(res => {
                    console.log(res);

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
                    console.log(res);
                    this.commentDetail = res.data.data;
                })
            }
        },

        mounted() {
            this.queryParams = this.$route.query;
            this.getDetail();
        }
    }
</script>

<style scoped>

</style>