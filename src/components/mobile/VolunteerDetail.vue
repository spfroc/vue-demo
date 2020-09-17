<template>
    <div class="container" style="height: 100%; overflow-y:auto; padding-bottom: 20px;">
        <h4>{{detail.title}}</h4>
        <div style="margin-top: 10px;color: gray;">{{detail.createTime.substr(0, 10)}}</div>
        <el-image :src="'/images' + detail.img" style="margin-top: 10px;">
            <img src="../../assets/img/default_user.png"/>
        </el-image>
        <div class="text-container" v-html="detail.content"></div>
    </div>
</template>

<script>
    export default {
        name: "VolunteerDetail",
        data() {
            return {
                detail: {
                    title: '志愿者活动详情',
                    img: '/app/2020/09/04/1b61396ddf0a49c9ae82c4ae27f01095.jpg',
                    content: '<p><br></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">红领巾防疫宣传志愿服务</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">一、活动背景</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体"><font face="宋体">新型冠状肺炎席卷了整个中国，这是一场守护健康的大战</font>“疫”！为提高学生对新型冠状病毒的认识，做好亲子相伴，更好的做好防疫工作，打赢健康保卫战，大兴九小开展“战胜病毒齐上阵，防疫自护宣传我能行”红领巾防疫宣传活动，全校学生带动家长，大家齐动手，画的画，写的写，全家齐上阵，一张张精美的手抄报，儿童画寄托了孩子们对防疫工作者的祝福和战胜疫情的决心！</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">二、活动主题：</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">“战胜病毒齐上阵，防疫自护宣传我能行”红领巾防疫志愿宣传</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">三、活动内容：</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">1.<font face="宋体">宣传手抄报（防疫宣传、为抗击疫情正能量的宣传）</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">2.<font face="宋体">画画（防疫宣传、为抗击疫情正能量的宣传）</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">3.<font face="宋体">手写感受</font><font face="Calibri">200</font><font face="宋体">字左右（防疫宣传、为抗击疫情正能量的宣传）</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">4.<font face="宋体">照片。（在家里做运动，为家庭消毒，为父母分担做家务）</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">四、活动时间：</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">1<font face="宋体">、项目参与时间：</font><font face="Calibri">2020</font><font face="宋体">年11</font><font face="宋体">月</font><font face="Calibri">3</font><font face="宋体">日至</font><font face="Calibri">2020</font><font face="宋体">年</font><font face="Calibri">12</font><font face="宋体">月</font><font face="Calibri">3</font><font face="宋体">日</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">2<font face="宋体">、统计时间：</font><font face="Calibri">2021</font><font face="宋体">年</font><font face="Calibri">1</font><font face="宋体">月</font><font face="Calibri">4</font><font face="宋体">日至</font><font face="Calibri">2021</font><font face="宋体">年</font><font face="Calibri">1</font><font face="宋体">月</font><font face="Calibri">10</font><font face="宋体">日</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">3<font face="宋体">、工时记录时间：</font><font face="Calibri">2020</font><font face="宋体">年</font><font face="Calibri">11</font><font face="宋体">月</font><font face="Calibri">3</font><font face="宋体">日至</font><font face="Calibri">2021</font><font face="宋体">年1</font><font face="宋体">月10日</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">五、招募人数：</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">3000<font face="宋体">人（大兴区第九小学全体师生）</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体"><font face="宋体"><br></font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">六、工时记录：</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">1<font face="宋体">、活动四个项目都可以参加，每参加一项记录三个时长。（每个项目每人只可参加一次不得重复参加。）</font></span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">七、</span></span><span style="font-size:10.5000pt"><span style="font-family:宋体">参与方式</span></span></p><p><span style="font-size:10.5000pt"><span style="font-family:宋体">在志愿者活动列表报名后，等待审批通过可直接参加此次活动。</span></span></p>',
                    createTime: '2020-07-11 19:28:30',
                },
                imgFail: 'http://pic.616pic.com/ys_img/00/05/66/A6XaeFUerS.jpg',
                queryParams: {}
            }
        },

        methods: {
            getDetail() {
                this.$common.appTokenAxios().get('/app/children/volunteerActivityDetail', {
                    params: this.queryParams
                }).then((res) => {
                    console.log(res);
                    this.detail = res.data.data;
                });
            }
        },

        mounted() {
            this.queryParams = this.$route.query;
            this.getDetail();
        }
    }
</script>

<style scoped>
    .text-container {
        /*padding-top: 10px;*/
        padding-bottom: 30px;
    }
</style>