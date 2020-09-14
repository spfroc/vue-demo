<template>
    <section class="progress-container">
        <section style="width: 80%;height:300px;">
            <div class="progress-container">
                <div class="progress-text">{{value || 20}}</div>

                <div class="progress">
                    <div class="current-progress" :style="currentProgressStyle"></div>
                </div>
                <div class="progress-circle" :style="dotStyle"></div>
                <div class="progress-text">{{text || '项目'}}</div>
            </div>

        </section>

    </section>
</template>

<script>
    export default {
        name: "CustomProgress",
        data() {
            return {
                totalHeight: 240,
            }
        },
        props: [
            'backgroundColor', 'progress', 'text', 'dotColor', 'value'
        ],

        methods: {

        },
        computed: {
            currentProgressStyle () {
                return {
                    'margin-top': (this.totalHeight-this.currentProgress) + 'px',
                    height: this.currentProgress+'px',
                    backgroundColor: this.backgroundColor || 'greenyellow'
                }
            },

            currentProgress () {
                return this.totalHeight*this.progress/100;
            },

            dotStyle () {
                return {
                    backgroundColor: this.dotColor || 'gray'
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .progress {
        margin-top: 20px;
        float: left;
        width: 20px;
        margin-left: 20px;
        height: 80%;
        border-radius: 10px;
    }

    .progress-circle {
        margin-top: 10px;
        float: left;
        margin-left: 20px;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: solid 1px gray;
        background-color: gray;
    }

    .progress-text {
        text-align: center;
        margin-top: 10px;
        float: left;
        width: 100%;
        height: 20px;
    }
    .progress-container {
        float: left;
        text-align: center; /*让div内部文字居中*/
        background-color: #fff;
        border-radius: 20px;
        width: 60px;
        height: 100%;
    }
    .current-progress {
        width: 100%;
        background-color: greenyellow;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border-radius: 20px;
    }
</style>