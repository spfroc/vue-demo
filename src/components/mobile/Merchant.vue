<template>
    <div style="height: 100%;overflow-y:auto;" ref="container">
        <div class="top">
            <div class="orange-part">
                <div class="white-part"></div>
            </div>

            <div :style="floatDivStyle">
                <el-row>
                    <el-col :span="16">
                        <el-row>
                            <el-col :span="24">
                                <h3>{{detail.name}}</h3>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="coupon">
                                    <span>优惠信息</span>
                                    <el-tag class="tags" v-for="(item,i) in discountArr" :key="i" type="danger">{{item}}</el-tag>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        <el-image
                                fit="contain"
                                width="100px"
                                :src="'/images'+detail.headImg"
                        ></el-image>
                    </el-col>
                </el-row>

            </div>
        </div>
        <div class="bottom">
            <el-tabs :style="tabStyle" v-model="activeName" @tab-click="tagClick">
                <el-tab-pane label="商家简介" name="merchant">
                    <el-row>
                        <el-col :span="20">
                            <div><b>{{detail.name}}</b></div>
                            <div style="font-size: 14px;">{{detail.address}}</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="icon-wrap">
                                <a :href="phone"><i class="el-icon-phone" style="color: orange;"></i></a>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-image style="width: 100%" :src="'/images'+detail.coverImg" :preview-src-list="previewSrcList"></el-image>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <b>商家信息</b>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">商家分类:</el-col>
                        <el-col :span="5">{{detail.categoryName}}</el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="5">营业时间:</el-col>

                        <el-col :span="10">{{detail.businessHours}}</el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="评论" name="comment" style="padding-bottom: 20px">
                    <section v-for="(comment, index) in comments" :key="index" class="comment-container">
                        <el-row>
                            <el-col :span="3">
                                <el-avatar shape="square" :src="'/images'+comment.headImg"></el-avatar>
                            </el-col>
                            <el-col :span="13">
                                <span>{{comment.userName}}</span>

                            </el-col>
                            <el-col :span="8">
                                <span>{{comment.createTime.substr(0,10)}}</span>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 10px;">
                            <el-col>{{comment.content}}</el-col>
                        </el-row>
                        <el-row style="margin-top: 10px" v-if="comment.contentImg">
                            <el-col :span="12"><el-image :src="'/images'+comment.contentImg"></el-image></el-col>
                        </el-row>
                    </section>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-button v-if="activeName=='comment'" style="position: absolute;bottom: 20px; right: 10px;background-color: orange" @click="replyShow(0)">写评价</el-button>
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
        name: "Merchant",

        components: {
        },
        data() {
            return {
                previewSrcList: ['https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg'],
                page: {
                    pageNo: 1,
                },
                comments: [],
                activeName: 'merchant',
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
                queryParams: {},
                dialogVisible:false,
                form: {
                    content: '',
                }

            }
        },

        computed: {

            phone() {
                return 'tel:'+this.detail.phone;
            },
            floatDivStyle () {
                return {
                    height: '120px',
                    width: '90%',
                    backgroundColor: 'white',
                    position: 'relative',
                    top: '-70px',
                    borderRadius: '10px',
                    boxShadow: '#666 0px 0px 10px',

                    left: document.documentElement.clientWidth*0.1/2 + 'px',

                }
            },

            tabStyle() {

                return {
                    width: '90%',

                    paddingLeft: document.documentElement.clientWidth*0.1/2 + 'px',
                };
            },
            discountArr() {
                console.log(this.detail.discountInfo);
                return this.detail.discountInfo.split(',');
            },
        },
        methods: {
            reply() {
                this.form.token = this.queryParams.token;
                this.form.merchantId = this.queryParams.id;
                this.$common.appTokenAxios().get('/app/merchant/evaluate', {
                    params: this.form
                }).then(res => {
                    console.log(res);
                    this.$message({
                        message: res.data.message || '评价成功！将在审核通过后显示',
                        type: 'success'
                    })
                    this.dialogVisible = false;
                })
            },
            replyShow(evaluateId = 0) {
                this.dialogVisible = true;
                this.form.content = '';
                if(evaluateId != 0) {
                    this.form.evaluateId = evaluateId;
                }
            },
            getDetail() {
                this.$common.appTokenAxios().get('/app/merchant/detail', {
                    params: this.queryParams
                }).then((res) => {
                    this.detail = res.data.data;
                });
            },

            getComments() {
                this.$common.appTokenAxios().get('/app/merchant/evaluateList', {
                    params: {
                        merchantId: this.queryParams.id,
                        pageNo: this.page.pageNo,
                        token: this.queryParams.token,
                        pageSize: 500
                    }
                }).then(res => {
                    if(res.data.data.list.length > 0) {
                        this.comments = this.comments.concat(res.data.data.list);
                    }
                    console.log('page',this.page.pageNo, 'page response:', res.data.data.pageNo);
                    if(res.data.data.pageNo) {
                        this.page.pageNo = parseInt(res.data.data.pageNo) + 1
                    }
                    console.log('page',this.page.pageNo);
                });
            },

            tagClick(tab, event) {
                if(this.activeName == 'comment') {
                    this.getComments();
                }
            },
            handleScroll() {
                let container = this.$refs.container;
                if(container) {
                    // console.log('scrollTop:',container.scrollHeight, 'scrollHeight:',container.scrollTop, 'scrollTop-scrollHeight:', container.scrollHeight - container.scrollTop);
                    if (container.scrollHeight - container.scrollTop < 800) {
                        this.getComments();
                    }
                }

            }
        },

        mounted() {
            this.queryParams = this.$route.query;
            // console.log(this.queryParams);
            this.getDetail();
            window.addEventListener('scroll', this.handleScroll, true)

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
    height: 120px;
    width: 80%;
    position: relative !important;
    top: 60px;
}

h3 {
    margin: 10px 10px;
}

.coupon {
    margin: 10px 10px;
}

.el-tabs__item.is-active {
    color: black;
    font-weight: 600;
}

.tags:not(:first-child) {
    margin-left: 5px;
}

.icon-wrap {
    font-size: 30px;
    border-left: 1px solid lightgrey;
    text-align: center;
}

.comment-container:not(:first-child) {
    margin-top: 10px;
}
</style>