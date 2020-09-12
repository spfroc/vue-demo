<template>
    <div class="container" style="height: 100%; overflow-y:auto;" ref="container">
        <h4>{{detail.title}}</h4>
        <div>
            <span>{{dateTimeToDate}}</span>
        </div>
        <div class="text-container" v-html="detail.content"></div>
        <el-divider></el-divider>
        <div class="comment-container">
            <el-row style="padding-bottom: 10px">
                <el-col :span="4">
                    <div >评价</div>
                </el-col>
                <el-col :span="17">&nbsp;</el-col>
                <el-col :span="3"><button @click="replyShow">写评价</button></el-col>
            </el-row>
            <section v-for="(comment, index) in comments" :key="index" :style="index > 0 ? paddingStyle: ''">
                <el-row>
                    <el-col :span="3">
                        <el-avatar shape="square" :src="comment.headImg"></el-avatar>
                    </el-col>
                    <el-col :span="13">
                        <span>{{comment.userName}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>{{comment.content}}{{comment.id}}</el-col>
                </el-row>

                <el-row v-if="comment.contentImg">
                    <el-col :span="12"><el-image :src="'/images'+comment.contentImg"></el-image></el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <span>{{comment.createTime}}</span>
                    </el-col>
                    <el-col :span="3">
                        <span v-if="comment.isMine"><button @click="deleteComment(comment.id)">删除</button></span>
                        <span v-if="!comment.isMine">&nbsp;</span>

                    </el-col>
                    <el-col :span="3">
                        <span><button @click="replyShow(comment)">回复</button></span>
                    </el-col>
                </el-row>
                <el-row v-if="comments.length == 0">
                    <el-col>没有更多</el-col>
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
                    <el-form ref="form" :rules="rules" :model="form">
                        <el-form-item label="评价" prop="content">
                            <el-input type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item v-show=false label="" prop="communityId">
                            <el-input type="hidden"></el-input>
                        </el-form-item>
                        <el-form-item v-show=false  label="" prop="evaluateId">
                            <el-input type="hidden"></el-input>
                        </el-form-item>
                        <el-form-item v-show=false  label="" prop="subEvaluateId">
                            <el-input type="hidden"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="reply">发 布</el-button>
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
                comments: [
                    {
                        id: '1',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: false,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '2',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '3',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '4',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '5',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '6',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '7',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '8',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '9',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },

                    {
                        id: '10',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '11',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '12',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                    {
                        id: '13',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                ]
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
            replyShow() {
                this.dialogVisible = true;
            },

            reply() {
                console.log(this.form);
                this.$http.get('/app/community/evaluate', {
                    params: this.form
                }).then(res => {
                    console.log(res);
                })
            },

            deleteComment(id) {
                this.removeCommentFromCommentsList(id)
                this.$http.get('/app/mine/deleteEvaluate', {
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
                this.$http.get('/app/community/detail?id='+this.queryParams.id).then((res) => {
                    this.detail = res.data.data;
                });
            },

            getComments() {
                this.$http.get('/app/community/evaluateList', {
                    params: {
                        communityId: this.queryParams.id,
                        // merchantId: 1,
                        pageNo: this.page.pageNo,
                        pageSize: this.page.pageSize
                    }
                }).then(res => {
                    this.comments.push([
                        {
                            id: '7',
                            userName: "新",
                            headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                            createTime: "2020-09-08",
                            content: "好吃，量大",
                            replyNum: '10',
                            isMine: true,
                            contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                        },
                        {
                            id: '7',
                            userName: "新",
                            headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                            createTime: "2020-09-08",
                            content: "好吃，量大",
                            replyNum: '10',
                            isMine: true,
                            contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                        },
                    ]);
                    this.page.pageNo = parseInt(res.data.data.pageNo) + 1
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

<style scoped>
.text-container {
    padding-top: 10px;
}
</style>