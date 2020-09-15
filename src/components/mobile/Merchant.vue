<template>
    <div>
        <div class="top">
            <div class="orange-part"></div>
            <div class="white-part"></div>
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
                                    <span>优惠:</span>
                                    <el-tag v-for="(item,i) in discountArr" :key="i" type="danger">{{item}}</el-tag>
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
                <el-tab-pane label="商家" name="merchant">
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
                            <el-image :src="detail.coverImg" :preview-src-list="previewSrcList"></el-image>
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
                <el-tab-pane label="评论" name="comment" style="height: 800px;overflow-y:auto;">
                    <section v-for="(comment, index) in comments" :key="index">
                        <el-row>
                            <el-col :span="3">
                                <el-avatar shape="square" :src="'/images'+comment.headImg"></el-avatar>
                            </el-col>
                            <el-col :span="13">
                                <span>{{comment.userName}}</span>

                            </el-col>
                            <el-col :span="8">
                                <span>{{comment.createTime}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>{{comment.content}}</el-col>
                        </el-row>
                        <el-row v-if="comment.contentImg">
                            <el-col :span="12"><el-image :src="'/images'+comment.contentImg"></el-image></el-col>
                        </el-row>
                    </section>
                </el-tab-pane>
            </el-tabs>
        </div>
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
                commentPage: {
                    pageNum: 1,
                    totalPage: 10
                },
                comments: [
                    {
                        id: '1',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
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
                        id: '7',
                        userName: "xxx",
                        headImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg",
                        createTime: "2020-09-08",
                        content: "好吃，量大",
                        replyNum: '10',
                        isMine: true,
                        contentImg: "https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg"
                    },
                ],
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
                    position: 'absolute',
                    top: '60px',
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
                        pageNo: this.commentPage.pageNum,
                        toke: this.queryParams.token,
                        pageSize: 500
                    }
                }).then(res => {

                    console.log(res);
                    // this.comments = res.data.data.list;
                });
            },

            tagClick(tab, event) {
                if(this.activeName == 'comment') {
                    this.getComments();
                }
            }
        },

        mounted() {
            this.queryParams = this.$route.query;
            // console.log(this.queryParams);
            this.getDetail();
            console.log('width:',document.documentElement.clientWidth);;

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
    width: 100%
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

.icon-wrap {
    font-size: 30px;
    border-left: 1px solid lightgrey;
    text-align: center;
    font-color: orange;
}
</style>