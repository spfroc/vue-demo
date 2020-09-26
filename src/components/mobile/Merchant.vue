<template>
    <div style="height: 100%;overflow-y:auto;" ref="container">
        <div class="top-part" style="height: 200px;">
            <div class="orange-part">
                <div :style="floatDivStyle">
                    <el-row>
                        <el-col :span="16">
                            <el-row style="margin-top: 20px;">
                                <el-col :span="24">
                                    <span style="font-size: 25px;margin: 20px 20px;font-weight: bold">{{detail.name}}</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <div class="coupon">
                                        <span>优惠:</span>
                                        <el-tag class="tags" v-for="(item,i) in discountArr" :key="i" type="danger">{{item}}</el-tag>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="6">
                            <el-image
                                    style="margin-right: 10px; margin-top: 20px;"
                                    fit="contain"
                                    width="50px"
                                    :src="'/images'+detail.headImg"
                            ></el-image>
                        </el-col>
                    </el-row>

                </div>
            </div>


        </div>
        <div class="tab-container">
            <div class="tabs">
                <div class="tab active-tab" ref="detail" id="detail" @click="switchTab('detail')">
                    <span>商家</span>
                    <div v-if="activeName == 'detail'" class="tab-bar"></div>
                </div>
                <div class="tab" id="comment" ref="comment" @click="switchTab('comment')">
                    <span>评价</span>
                    <div v-if="activeName == 'comment'" class="tab-bar"></div>

                </div>
            </div>

            <div class="detail-tab tab-content" v-if="activeName == 'detail'">
                <el-row style="margin-top: 20px;">
                    <el-col :span="20">
                        <div><b>{{detail.name}}</b></div>
                        <div style="font-size: 14px;color: gray;">{{detail.address}}</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="icon-wrap">
                            <a :href="phone"><i class="el-icon-phone" style="color: #fd7f04;"></i></a>
                        </div>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 30px;">
                    <el-col>
                        <el-image style="width: 40%" :src="'/images'+detail.coverImg" :preview-src-list="previewSrcList"></el-image>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-col>
                        <b>商家信息</b>
                    </el-col>
                </el-row>
                <el-row style="line-height: 40px;color: gray">
                    <el-col :span="5">商家分类:</el-col>
                    <el-col :span="5">{{detail.categoryName}}</el-col>

                </el-row>
                <el-row style="line-height: 40px;color: gray">
                    <el-col :span="5">营业时间:</el-col>

                    <el-col :span="10">{{detail.businessHours}}</el-col>
                </el-row>
            </div>
            <div class="comment-tab tab-content" v-infinite-scroll="getComments" infinite-scroll-distance=50 infinite-scroll-delay=200 style="overflow:auto" v-if="activeName == 'comment'">
                <section v-for="(comment, index) in comments" :key="index" class="comment-container">
                    <el-row>
                        <el-col :span="3">
                            <el-avatar shape="square" :src="'/images'+comment.headImg"><img src="../../assets/img/default_user.png" alt=""></el-avatar>
                        </el-col>
                        <el-col :span="16">
                            <span>{{comment.userName || 'null'}}</span>

                        </el-col>
                        <el-col :span="5">
                            <span style="font-size: 14px;line-height: 27px;">{{comment.createTime.substr(0,10)}}</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 10px; font-size: 14px;">
                        <el-col>{{comment.content}}</el-col>
                    </el-row>
                    <el-row style="margin-top: 10px" v-if="comment.contentImg">
                        <el-col :span="12"><el-image :src="'/images'+comment.contentImg"></el-image></el-col>
                    </el-row>
                </section>
                <section style="color: gray;text-align: center;" v-if="showNoMoreText"><span>没有更多</span></section>
            </div>

        </div>


        <el-button v-if="activeName=='comment'" style="position: absolute;bottom: 0px; right: 0px;background-color: #fd7f04" @click="replyShow(0)">评价</el-button>

        <comment-dialog v-if="showCommentDialog" :form="form" :hide-dialog="hideDialog" url="/app/upload/files" :submit="reply" :token="queryParams.token"></comment-dialog>
        <div class="mask" @click="() => {this.showCommentDialog = false;}" v-if="showCommentDialog"></div>
    </div>
</template>

<script>
    import MultipleImageUpload from "../common/MultipleImageUpload"
    import JA from 'jquery-ajax'
    import $ from 'jquery'
    import CommentDialog from './CommentDialog'
    export default {
        name: "Merchant",

        components: {
            MultipleImageUpload,JA, CommentDialog
        },
        data() {
            return {
                previewSrcList: ['https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg'],
                page: {
                    pageNo: 1,
                    totalPage: 10,
                },
                showNoMoreText: false,
                rules: {
                    content: {required: true, message: '请输入评论内容', trigger: 'blur'}
                },
                comments: [],
                activeName: 'detail',
                detail: {
                    name: '东鑫小吃',
                    phone: '13366667777',
                    address: '北京市大兴区魏善庄镇刘家场村某某街三号',
                    headImg: 'https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg',
                    coverImg: 'https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg',
                    discountInfo: '满30减5,满50减10',
                    businessHours: '8:30~21:30',
                    categoryName: '餐饮',
                },
                images: [],
                queryParams: {},
                dialogVisible:false,


                fileUploadUrl: '/apis/upload/file?token='+localStorage.getItem('auth-token'),

                showCommentDialog: false,
                form: {},


            }
        },

        computed: {

            phone() {
                return 'tel:'+this.detail.phone;
            },
            floatDivStyle () {
                return {
                    height: '160px',
                    width: '90%',
                    backgroundColor: 'white',
                    position: 'relative',
                    top: '20px',
                    borderRadius: '10px',
                    boxShadow: '#666 0px 0px 10px',
                    left: document.documentElement.clientWidth*0.1/2 + 'px',

                }
            },

            discountArr() {
                return this.detail.discountInfo.split(',');
            },
        },
        methods: {
            hideDialog() {
                this.showCommentDialog = false;
            },

            switchTab(name) {
                let currentTab = document.getElementById(this.activeName);
                $(currentTab).removeClass('active-tab')
                this.activeName = name;
                let tab = document.getElementById(name);
                console.log(tab);
                $(tab).addClass('active-tab')
                if(name == 'comment') {
                    this.getComments();
                }
            },

            reply() {
                this.form.merchantId = this.queryParams.id;
                this.$common.appTokenAxios().post('/app/merchant/evaluate', this.form, {
                    params: {
                        token: this.queryParams.token
                    }
                }).then(res => {
                    this.$message({
                        message: res.data.message || '评价成功！将在审核通过后显示',
                        type: 'success'
                    })
                    this.dialogVisible = false;
                })


            },
            replyShow(evaluateId = 0) {
                this.showCommentDialog = true;
                if(evaluateId != 0) {
                    this.form.evaluateId = evaluateId;
                }
            },
            getDetail() {

                JA.ajax({
                    url: '/app/merchant/detail',
                    type: 'get',
                    data: this.queryParams,
                    success: (res) => {
                        console.log('in ajax: ', res);
                    }
                })
                this.$common.appTokenAxios().get('/app/merchant/detail', {
                    params: this.queryParams
                }).then((res) => {
                    this.detail = res.data.data;
                });
            },

            getComments() {
                console.log(this.page.pageNo, this.page.totalPage);
                if(this.page.pageNo < this.page.totalPage) {
                    this.$common.appTokenAxios().get('/app/merchant/evaluateList', {
                        params: {
                            merchantId: this.queryParams.id,
                            pageNo: this.page.pageNo,
                            token: this.queryParams.token,
                            pageSize: 20
                        }
                    }).then(res => {
                        if(res.data.data.list.length > 0) {
                            this.comments = this.comments.concat(res.data.data.list);
                            this.page.totalPage = res.data.data.totalPage;
                            this.page.pageNo ++;
                        }
                    });
                }

            },

        },

        created() {

        },

        mounted() {
            this.queryParams = this.$route.query;
            // console.log(this.queryParams);
            this.getDetail();


        }
    }
</script>

<style scoped>
.orange-part {
    background-color: darkorange;
    height: 120px;
    width: 100%
}

.white-part {
    height: 180px;
    width: 80%;
    position: relative !important;
    top: 90px;
}

h3 {
    margin: 10px 10px;
}

.coupon {
    margin: 20px 20px;
}



.icon-wrap {
    font-size: 30px;
    border-left: 1px solid lightgrey;
    text-align: center;
}

.comment-container:not(:first-child) {
    margin-top: 10px;
}
.mask{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2999;
    top: 0px;
    left: 0px;
}
    
.tabs {
    /*float: left;*/
    margin-left: 30px;
    height: 18px;
}
    
.tab {
    float: left;
    font-size: 18px;
    display: block;
}

.tab-content {
    width: 86%;
    margin-left:auto;
    margin-right:auto;
    margin-top: 20px;
}
#comment {
    margin-left: 40px;
}

.tab-bar {
    width:25px;
    background-color:#fd7f04;
    height:10px;
    opacity:0.7;
    left: 5px;
    top: -8px;
    position: relative;
}

.active-tab {
    font-weight: bold;
}
</style>