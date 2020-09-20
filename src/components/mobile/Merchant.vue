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
        <!--<div class="bottom">-->
            <el-tabs :style="tabStyle" v-model="activeName" @tab-click="tagClick" ref="merchant-tabs">
                <el-tab-pane class="tab-pane-custom" label="商家" name="merchant">
                    <el-row style="margin-top: 30px;">
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
                </el-tab-pane>
                <el-tab-pane class="tab-pane-custom" label="评价" name="comment" style="padding-bottom: 20px;color: gray;">
                    <section v-for="(comment, index) in comments" :key="index" class="comment-container">
                        <el-row>
                            <el-col :span="3">
                                <el-avatar shape="square" :src="'/images'+comment.headImg"><img src="../../assets/img/default_user.png" alt=""></el-avatar>
                            </el-col>
                            <el-col :span="13">
                                <span>{{comment.userName || 'null'}}</span>

                            </el-col>
                            <el-col :span="8">
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
                </el-tab-pane>
            </el-tabs>
        <!--</div>-->
        <el-button v-if="activeName=='comment'" style="position: absolute;bottom: 0px; right: 0px;background-color: #fd7f04" @click="replyShow(0)">评价</el-button>
        <el-dialog
                title="评价"
                :visible.sync="dialogVisible"
                width="100%"
                top="49vh"
                :modal="false"
                :close-on-click-modal=true
                :destroy-on-close=true
        >
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="content">
                    <el-input v-model="form.content" placeholder="请输入评价内容"></el-input>
                </el-form-item>
                <el-upload
                        class="avatar-uploader"
                        :action="fileUploadUrl"
                        :show-file-list="false"
                        v-model="form.contentImg"
                        name="file"
                        id="mobileUpload"
                        ref="mobileUpload"
                        :on-success="handleAvatarSuccess">
                    <img v-if="form.contentImg" :src="'/images'+form.contentImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="background-color: #fd7f04" type="primary" @click="reply">发 布</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import MultipleImageUpload from "../common/MultipleImageUpload"

    export default {
        name: "Merchant",

        components: {
            MultipleImageUpload
        },
        data() {
            return {
                previewSrcList: ['https://img.php.cn/upload/article/000/000/006/5d8993ab63a1b491.jpg'],
                page: {
                    pageNo: 1,
                },
                rules: {
                    content: {required: true, message: '请输入评论内容', trigger: 'blur'}
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
                images: [],
                queryParams: {},
                dialogVisible:false,
                form: {
                    content: '',
                    contentImg: '',
                },

                fileUploadUrl: '/apis/upload/file?token='+localStorage.getItem('auth-token')

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
            handleAvatarSuccess(res, file) {
                this.form.contentImg = res.data.pic;
            },
            reply() {
                this.$refs['form'].validate((valid) => {
                    console.log(valid);
                    if(valid) {
                        this.form.token = this.queryParams.token;
                        this.form.merchantId = this.queryParams.id;
                        this.$common.appTokenAxios().get('/app/merchant/evaluate', {
                            params: this.form
                        }).then(res => {
                            this.$message({
                                message: res.data.message || '评价成功！将在审核通过后显示',
                                type: 'success'
                            })
                            this.dialogVisible = false;
                        })
                    }

                })

            },
            replyShow(evaluateId = 0) {
                this.dialogVisible = true;
                setTimeout(() => {
                    this.$refs.mobileUpload.$children[0].$el.style.height= '130px'
                }, 200)
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
                    if(res.data.data.pageNo) {
                        this.page.pageNo = parseInt(res.data.data.pageNo) + 1
                    }
                });
            },

            tagClick(tab, event) {
                this.tabSwitchStyle();
                let currentTab = window.document.getElementById('tab-'+this.activeName);
                let otherTabName = 'tab-'+(this.activeName == 'comment' ? 'comment' : 'merchant')
                console.log('current tab name: ', this.activeName, 'other tab name: ', otherTabName);
                let otherTab = window.document.getElementById(otherTabName)
                currentTab.style.fontWeight = 'bold'
                otherTab.style.fontWeight = 'normal';
                if(this.activeName == 'comment') {
                    this.getComments();
                } else {

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

            },

            tabBarStyle() {
                console.log(111);
                this.$refs['merchant-tabs'].$children[0].$children[0].$el.style.width='25px';
                this.$refs['merchant-tabs'].$children[0].$children[0].$el.style.backgroundColor='#fd7f04';
                this.$refs['merchant-tabs'].$children[0].$children[0].$el.style.height='10px';
                this.$refs['merchant-tabs'].$children[0].$children[0].$el.style.left='17px';
                this.$refs['merchant-tabs'].$children[0].$children[0].$el.style.bottom='5px';
                this.$refs['merchant-tabs'].$children[0].$children[0].$el.style.opacity='0.7';
                console.log(222);
            },
            initTabStyle() {
                this.tabBarStyle();
                setTimeout(() => {
                    let merchantTab = window.document.getElementById('tab-merchant');
                    let commentTab = window.document.getElementById('tab-comment');
                    merchantTab.style.fontSize = '18px'
                    merchantTab.style.width = '80px'
                    merchantTab.style.textAlign = 'center'
                    merchantTab.style.color = 'black'
                    merchantTab.style.fontWeight = 'bold'
                    commentTab.style.fontSize = '18px'
                    commentTab.style.width = '80px'
                    commentTab.style.textAlign = 'center'
                    commentTab.style.color = 'black'

                }, 300)
            },

            tabSwitchStyle() {
                this.tabBarStyle()
            }
        },

        created() {

        },

        mounted() {
            this.queryParams = this.$route.query;
            // console.log(this.queryParams);
            this.getDetail();
            window.addEventListener('scroll', this.handleScroll, true)
            this.initTabStyle();
            setTimeout(() => {
                console.log(this.$refs.mobileUpload);
            }, 1000)

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

.el-tabs .el-tabs__item {
    font-size: 18px !important;
    /*padding: 10px 0 50px !important;*/
    width: 80px !important;
    text-align: center;
}

.el-tabs .el-tabs__active-bar {
    width: 25px !important;
    background-color: #fd7f04;
    height: 10px;
    left: 17px;
    bottom: 5px;
    opacity: 0.7;
}

.active-bar-custom {

}

.el-tabs .is-active {
    width: 80px !important;
    font-weight: bold;
    color: black !important;
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

.el-tabs__nav-wrap::after {
    background-color: white !important;
}
.el-dialog__wrapper {
    overflow: visible;
}

.avatar-uploader .el-upload {
    /*border: 1px dashed #d9d9d9;*/
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 130px !important;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: white;
    background-color: lightgrey;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
}
.avatar {
    width: 130px;
    height: 130px;
    display: block;
}
/*.top-part {*/
    /*height: 160px;*/
/*}*/
</style>