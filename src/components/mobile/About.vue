<template>
    <div class="container" style="height: 100%">
        <section style="color: #fd7f04; font-weight: bold">
            关于我们
        </section>
        <section class="pic-container" style="width: 100%; align-content: center;">
            <img style="border-radius: 30px 30px;" src="../../assets/new_logo.png" width="50%">
            <!--<section style="font-family: 'KaiTi_GB2312,KaiTi,Microsoft YaHei';color: orange;font-size: 40px">-->
            <section style="font-family: Georgia,Serif;color: #fd7f04;font-size: 60px">
                首善养老
            </section>
            <section style="font-size: 14px; color: gray;margin-top: 20px">
                <p>一款专注于打造智慧养老平台app,</p>
                <p>线上派单线下服务。真正做到落地,</p>
                <p>有老可养，智慧养老。</p>
            </section>
        </section>
    </div>
</template>

<script>
    export default {
        name: "About"
    }
</script>

<style scoped>
.pic-container {
    text-align: center; /*让div内部文字居中*/
    background-color: #fff;
    border-radius: 20px;
    width: 300px;
    height: 510px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>