<template>
    <div>
        <el-row>
            <el-col :span="4" v-for="o in summary" :key="o.title" :class="'item '+ o.bg">
                <div class="card-title">{{o.title}}</div>
                <div class="text card-value">
                    <strong>{{o.value}}</strong><span style="font-size: 22px;">{{o.unit}}</span>
                </div>
            </el-col>

        </el-row>
        <el-row style="margin-top:20px;">
            <el-col :span="14" style="border: 1px solid lightgrey">
                <section id="sos" style="width: 100%;height:300px;" class="box-card"></section>
            </el-col>
            <el-col :span="8" style="border: 1px solid lightgrey;height: 302px;margin-left: 20px">
                <section class="chart-title" style="font-size: 18px; font-weight: bold; color: #3a3a3a;">自2020-09-26来累计数据</section>

                <el-row>
                    <el-col :span="12">
                        <!--<section id="cumulative-number-of-calls-received" style="width: 100%;height:200px;">累计接听电话数</section>-->
                        <section style="width: 100%;height:150px;">
                            <div class="changed">
                                <div style="color: #fda047;font-size: 25px;font-weight: bold;">{{callNumbers.phoneTime || 191}}</div>
                                <div style="font-size: 12px;color: gray;">累计接听电话数</div>
                            </div>
                        </section>
                    </el-col>
                    <el-col :span="12">
                        <!--<section id="cumulative-call-time" style="width: 100%;height:200px;">累计接听电话时长</section>-->
                        <section style="width: 100%;height:150px;">
                            <div class="changed">
                                <div style="color: #fc56b8;font-size: 25px;font-weight: bold;">{{callNumbers.dispatchNum || 191}}</div>
                                <div style="font-size: 12px;color: gray;">累计派单数</div>
                            </div>

                        </section>

                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <!--<section id="cumulative-dispatched-order-number" style="width: 100%;height:200px;">累计派单数</section>-->
                        <section style="width: 100%;height:150px;">
                            <div class="changed">
                                <div style="color: #46b7ff;font-size: 25px;font-weight: bold;">{{callNumbers.workOrderNum || 191}}</div>
                                <div style="font-size: 12px;color: gray;">累计完成工单数</div>
                            </div>

                        </section>

                    </el-col>
                    <el-col :span="12">
                        <!--<section id="cumulative-number-of-completed-work" style="width: 100%;height:200px;">累计完成工单数</section>-->
                        <section style="width: 100%;height:150px;">
                            <div class="changed">
                                <div style="color: #c447ff;font-size: 25px;font-weight: bold;">{{callNumbers.pickUpPhoneNum || 191}}</div>
                                <div style="font-size: 12px;color: gray;">累计接待数</div>
                            </div>

                        </section>

                    </el-col>
                </el-row>
                <!--<section id="summary" style="width: 600px;height:400px;"></section>-->

            </el-col>
        </el-row>

        <el-row style="margin-top: 20px;">
            <el-col :span="11" style="border: 1px solid lightgrey">
                <section id="worker-average" style="width: 100%;height:400px;padding:20px 0px 20px 0px">驿工平均接单时间</section>
            </el-col>
            <el-col :span="11" style="border: 1px solid lightgrey;margin-left: 20px">
                <section id="doctor-average" style="width: 100%;height:400px;padding:20px 0px 20px 0px">医生平均接单时间</section>
            </el-col>
        </el-row>

        <el-row style="margin-top: 20px;">
            <el-col :span="7" style="border: 1px solid lightgrey">
                <section id="order-rate" style="width: 100%;height:300px;padding:20px 0px 20px 0px">工单占比</section>
            </el-col>
            <el-col :span="8" style="border: 1px solid lightgrey;margin-left: 10px">
                <section id="monthly-total-reception" style="width: 100%;height:300px;padding:20px 0px 20px 0px">本月接待总计</section>
            </el-col>
            <el-col :span="7" style="border: 1px solid lightgrey;margin-left: 10px">
                <section id="weekly-service-summary" style="width: 100%;height:300px;padding:20px 0px 20px 0px">本周服务汇总</section>
            </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
            <el-col :span="14" style="border: 1px solid lightgrey">
                <section style="padding:20px 0px 20px 0px; font-size: 18px; font-weight: bold; color: #3a3a3a;">魏善庄镇行政地图</section>
                <a-map
                        :width="100"
                        :lng="116.419461"
                        :lat="39.663952"
                        :height="376"></a-map>
            </el-col>
            <el-col :span="8" style="border: 1px solid lightgrey;margin-left: 20px;">
                <!--<section id="data-statistics" style="width: 100%;height:400px;padding:20px 0px 20px 0px">数据统计</section>-->
                <section style="width: 100%;height:400px;padding:20px 0px 20px 0px;" id="statistic-container">
                    <!--['驿工', '总接待电话数', '老人', '驿站数', '医生', '子女用户数', '总工单数'],-->
                    <!--<progress></progress>-->
                        <div style="text-align: center; font-size: 18px; font-weight: bold; color: #3a3a3a;">数据统计</div>
                        <el-row :style="dataStatistic">
                            <el-col :span="3">
                                <custom-progress
                                        progress=25
                                        :value="processData.socialWorkerNum"
                                        background-color="#ff5f3f"
                                        text="社工"
                                        dot-color="#ff5f3f"
                                ></custom-progress>
                            </el-col>
                            <el-col :span="3">
                                <custom-progress
                                        progress=75
                                        :value="processData.totalReceptionCallNum"
                                        background-color="#ff9e3f"
                                        text="总接待电话数"
                                        dot-color="#ff9e3f"
                                ></custom-progress>
                            </el-col>
                            <el-col :span="3">
                                <custom-progress
                                        progress=80
                                        :value="processData.oldManNum"
                                        background-color="#4ecd6a"
                                        text="老人"
                                        dot-color="#4ecd6a"
                                ></custom-progress>
                            </el-col>
                            <el-col :span="3">
                                <custom-progress
                                        progress=33
                                        :value="processData.stationNum"
                                        background-color="#3fb4ff"
                                        text="驿站"
                                        dot-color="#3fb4ff"
                                ></custom-progress>
                            </el-col>
                            <el-col :span="3">
                                <custom-progress
                                        progress=100
                                        background-color="#c43aff"
                                        text="医生"
                                        :value="processData.doctorNum"
                                        dot-color="#c43aff"
                                ></custom-progress>
                            </el-col>
                            <el-col :span="3">
                                <custom-progress
                                        progress=80
                                        :value="processData.childrenNum"
                                        background-color="#fc54b7"
                                        text="子女"
                                        dot-color="#fc54b7"
                                ></custom-progress>
                            </el-col>
                            <el-col :span="3">
                                <custom-progress
                                        progress=40
                                        :value="processData.orderNum"
                                        background-color="#3f4dff"
                                        text="总工单"
                                        dot-color="#3f4dff"
                                ></custom-progress>
                            </el-col>
                        </el-row>


                </section>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    import Echart from 'echarts'
    import AMap from '../common/Map'
    import CustomProgress from '../common/CustomProgress'
    import HighCharts from 'highcharts'
    export default {
        name: "Chart",
        components: {
            Echart, AMap, CustomProgress, HighCharts
        },
        data() {
            return {
                chartSos: '',
                cumulativeNumberOfCallsReceived: '',
                cumulativeCallTime: '',
                cumulativeDispatchedOrderNumber: '',
                cumulativeNumberOfCompletedWork: '',
                orderRate: '',
                monthlyTotalReception: '',
                weeklyServiceSummary: '',
                dataStatistics: '',
                dataStatistic: {
                    marginLeft: '20px',
                    width: '100%'
                },
                callNumbers: {
                    pickUpPhoneNum: 123,
                    dispatchNum: 345,
                    workOrderNum: 456,
                    phoneTime: 789
                },

                processData: {
                    socialWorkerNum: 10,
                    totalReceptionCallNum: 20,
                    oldManNum: 30,
                    stationNum: 40,
                    doctorNum: 50,
                    childrenNum: 60,
                    orderNum: 70,

                },
                summary: [
                    {
                        title: '老人数量',
                        value: 0,
                        unit: '人',
                        bg: 'orange'
                    },
                    {
                        title: '医生人数',
                        value: 0,
                        unit: '人',
                        bg: 'yellow'

                    },
                    {
                        title: '社工人数',
                        value: 0,
                        unit: '人',
                        bg: 'green'

                    },
                    {
                        title: '已注册子女数',
                        value: 0,
                        unit: '人',
                        bg: 'blue'

                    },
                    {
                        title: '覆盖村庄数',
                        value: 0,
                        unit: '个',
                        bg: 'purple'

                    },
                    {
                        title: '驿站数量',
                        value: 0,
                        unit: '个',
                        bg: 'pink'

                    }
                ],

                sosData: {
                    title: {
                        text: 'SOS报警接听数变化图'
                    },

                    xAxis: {
                        data: ["00", "01", "02", "03", "04", "05", "06", "07", "08", '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
                    },

                    xAxisDay: {
                        data: ["00", "01", "02", "03", "04", "05", "06", "07", "08", '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
                    },

                    xAxisWeek: {
                        data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
                    },

                    xAxisMonth: {
                        data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
                    },
                    series: [{
                        name: '报警数',
                        type: 'line',
                        smooth: 'true',
                        color: '#fd850f',
                        data: [5, 20, 36, 10, 10, 20, 15, 41, 33]
                    }],

                    seriesDay: [{
                        name: '报警数',
                        type: 'line',
                        smooth: 'true',
                        color: '#fd850f',
                        data: [5, 20, 36, 10, 10, 20, 15, 41, 33]
                    }],

                    seriesWeek: [{
                        name: '报警数',
                        type: 'line',
                        smooth: 'true',
                        color: '#fd850f',
                        data: [25, 20, 36, 10, 15, 41, 33]
                    }],

                    seriesMonth: [{
                        name: '销量',
                        type: 'line',
                        smooth: 'true',
                        color: '#fd850f',
                        data: [11,22,13,24,15,26,37,28,19,40,31,22,13,34,45,26,17,28,39,20,31,12,23,34,15,56,17,28,49,30]
                    }],

                },

            }
        },

        methods: {
            sos (xAxis, series) {
                this.chartSos = Echart.init(document.getElementById('sos'));
                this.chartSos.hideLoading();

                this.$http.get('/apis/statistic/countSos', {
                    params: {
                        type: 1
                    }
                }).then(res => {
                    this.sosData.series[0].data = res.data.data.value;
                    let option = {
                        title: this.sosData.title,
                        tooltip: {},
                        xAxis: xAxis,
                        yAxis: {},
                        series: this.sosData.series,
                        // series: [],
                        toolbox: {
                            // padding:30,
                            show : true,
                            orient: 'horizontal',
                            itemSize: 25,
                            itemGap: 20,
                            width: 300,
                            feature: {
                                myDay: {
                                    show: true,
                                    title: '本日',
                                    icon: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAABXCAMAAABlYbrOAAAABGdBTUEAALGPC/xhBQAAACBjSFJN" +
                                        "AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAnFBMVEX///9/f3//27a2tra2" +
                                        "2//bkDoAAAA6kNv/tmZmtv8AADo6ZmZmZmZmZjo6AAAAAGa2/////7ZmAAD//9vb29u2kDo6kLbb" +
                                        "//+2ZgAAZrbb27aQZjq229sAOpD/25CQkDo6kJCQ2/+QOgAAOjo6Ojo6OgBmtts6ZrbbtmaQttu2" +
                                        "Zjo6ZpAAOmZmOgBmkLY6OpCQtra2tpBmZpCQZmZzfPo2AAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAO" +
                                        "xAAADsQBlSsOGwAAAAd0SU1FB+QIFAA5BkntULIAAALtSURBVHja7ZrZVtswEEBtghzjtgRwSlwK" +
                                        "6Q6FQtf//7fGkqwt2lJzOjM+nqcsTnRv7BlLoxTFtKJEH7Tpow7QWGMVoJnGKkADjTSImCGLACkV" +
                                        "/BAsJXwfLzV+l5gev8M8jv9osYtjIINn4C9YtYvlfxcwsKch8O9fBCWguMdmMKxAOfoEHCRQVwfE" +
                                        "SZbBLDAL0BNoXrxMxKtT1AKrs9Rh5xfPLtCug/G6H+wy/P4GhUB3yMVrx5tZYBaYgsDVIhBvB87L" +
                                        "0BHXKATiQ/Vxs8k4HJ8A05dKcjyMAttTLZBzCtAJWLmdcTfGJtDzrN71g73fDdl8oCbAx1mKuRBz" +
                                        "CiYJgY7TCAE+ZnJIXAK1GEXORlkOGioBPsqu9EiB9mPGRYRJgAP3eTusB+qMSoRJQK1j1IOuSlYi" +
                                        "RAIaRQnwu1qcTqyJP31OxJe8W/sYga1eteolJatSaYBmUS/OsWDVAjwtommARUCQysmPsajfproJ" +
                                        "WAT4FGjIV7Mrwcw38AqIOfTSfDY86eIGOKqQ+BlVsloCYujVceyj0AKCX8/+7caWeDfEiEFAJKpx" +
                                        "lTidORYzQCAg12DGl7utRbHI8V9F8AKS36z1roCosf5MBheQ/Nbddq+5KzsVPgNogdrD7+lOH8le" +
                                        "yy02AcnvtB887fWhWXHnNipgBb5WPn7v/sBgcOOkMqiA7GHtDe/d4BgMmnssAu1DgD+wQ6NaXnc4" +
                                        "NjhkbeTlvbZXH+LGZr30bWMYPBrVCE7gSfNnTCl5mgy1qDFA4ATkj3mmKNICxfmTyw8o8KD5swWK" +
                                        "tnMxAJOY6fq5tTd1+e/8aL30faM+Zd/MIMso+xFon0f3idf2U+ipxOECTkxDoPm5SMQv3H81yI1Z" +
                                        "YBaYqsDqep2IK9xViHwZnQUABfg06ndyS7/90x+X3HY2BUYYAP173QAfewqgQnFPQ4CegYFN0sCE" +
                                        "Lgka2Mz0DFxiagZ7vGVJScEHW9JRCKGW1CJiRiKi5wZ/JC8v5GFC/wUisGlCS1mpjwAAACV0RVh0" +
                                        "ZGF0ZTpjcmVhdGUAMjAyMC0wOC0xOVQxNjo1NzowNiswODowMFflKq8AAAAldEVYdGRhdGU6bW9k" +
                                        "aWZ5ADIwMjAtMDgtMTlUMTY6NTc6MDYrMDg6MDAmuJITAAAAIHRFWHRzb2Z0d2FyZQBodHRwczov" +
                                        "L2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8A" +
                                        "AAAXdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADg3u2rVsAAAABd0RVh0VGh1bWI6OkltYWdlOjpX" +
                                        "aWR0aAAxOTLTrCEIAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0" +
                                        "VGh1bWI6Ok1UaW1lADE1OTc4Mjc0MjY2cuDcAAAAEnRFWHRUaHVtYjo6U2l6ZQAxNzU5QkJbBd7g" +
                                        "AAAARXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTU5" +
                                        "NjU0ODQ2MDEyNTQwODdfNl9bMF2hHQjUAAAAAElFTkSuQmCC",
                                    onclick: () => {
                                        this.switchSos(1);
                                    },
                                },
                                myWeek: {
                                    show: true,
                                    title: '本周',
                                    // icon: "image://http://localhost:9090/images/app/2020/08/19/f386368441174732a7c88f6489c00e13.svg",
                                    icon: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAABXCAMAAABhlGrzAAAABGdBTUEAALGPC/xhBQAAACBjSFJN" +
                                        "AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAnFBMVEX///9/f3//27a2tra2" +
                                        "2//bkDoAAAA6kNv/25BmZmZmkLbb////tmYAOpD//7ZmAAD//9u229s6AAAAZrbb29u2kDo6kLa2" +
                                        "ZgDb27aQZjpmtv/btpDb2/8AAGaQkDo6kJAAADqQ2/+2//+QOgD/29u2kGa2tts6Ojo6ZpBmtts6" +
                                        "ZrbbtmaQttu2ZjoAOmZmOgA6OpCQtra2tpDbtrbhtsv4AAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAO" +
                                        "wwAADsMBx2+oZAAAAAd0SU1FB+QIExc4AD0rSYoAAAOuSURBVHja7Zt9X9sgEMeTKrHbUo3W2U3t" +
                                        "rE636ba6h/f/3pZwQA4CCUsNcH56f/lpk/D7Fu6BC2bZ67M8eaOuf4AitrDdIWKr2h0itqSdGXrp" +
                                        "kjKnUioAbrGUAOx6qRF0FdMj6GgmSGCIJkmgyx6LMDuo7TAdhBHPYEVtR9EQkO7R6ygJhFyHmQph" +
                                        "/maEvX3nxxAGoSxG2GKPsEd4pQgekqQdn5BBqJrceEoaYX5Wf76cHKE6d9r7RtmF+3ulITLCaowr" +
                                        "gilxe4Q9wksjDKQIuOiFET4cOOyjHPbCdYUKl5ERXMaHQcP2WaIIrB33kiYC90TfacDujBPHFXdn" +
                                        "/Ml1Fg5B8/KhDB05IrlFrT81ym7q4Ta39BD4GEdQIzG7jNQRmmW0vgMEPl6/RyeIUEIcEpUq4zy0" +
                                        "EOQIAqH6PLSUJMK9kfseGoSF8eGXAAhccuPBcr9QDkWlUpQbXhvQWvrkCGqno/5YFf1RKTUEroOv" +
                                        "fYXA13SPOySGAGn5UpsO+MvtDgrhq4d9mxoBqjtQ2yJw93C7Q9lPaB9kKgTQKp6Otv9oblJH4KWR" +
                                        "9FzcwWD4i5QRmFbVaU2YVQ9DQggQUZQWDQGcZH3ovC8JhNLYHeitMPjWGlo1BLzTMExeMhkCjI3W" +
                                        "itHNY04GLX1HRBBDo6hjNiRhG2RZSywNBDEyjv0mAkRci0+ngSAG1nyy0xYWXY0OQxdhafZfr86m" +
                                        "RigtBJbO9kx0Zh71u1d4Bdo3CfOpEQSB8VRLc16ukiftygQQvhc2Auv7BcmwQE6tNhjxEETXqxMu" +
                                        "ra9IJMPmRzoI1U8HgeMtj4o4ajFxRer28AgiUvJwb9T7kOrMYr9l2N4ieUpRcITZc0vgsevi48q4" +
                                        "tBEerJdIoRHkHGzvlJZhhOz4GRNAQFILbm5rW0AzY5pZAE8AAm+ErFqhKAo/gypMImRn1j7NONHC" +
                                        "f+ut/fgKa9Mb19xm7BgFBvvleFjve+dz/bJWUMxi+/8QlEHh1F5GEIE7EKr8XI1UkzodBK3n4Ymg" +
                                        "J5LoCBDF0FUeCL4nZ8IgwCTg4mQYYXZSDFIGRGCFl8NUD3VE/s2T3B/xQtvjiE0QBAg//S9QECoy" +
                                        "j3vCIJgR1WmdxO9zzinMQmqmwedIm5ktlj7H4HSEyU4Llx6nAzJ8HoKnkUePW7DwSREy9uT1sL+o" +
                                        "bL32Gx/pHosQ+eR8B4H2/y/QZNBF5wQZTM30GLqKqTFY9OY5JQi72JwOhFtqTs166UjYwAylbx7L" +
                                        "LHHDov8ByWiBDKpBO64AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDgtMTlUMTU6NTY6MDArMDg6" +
                                        "MDBmPRhlAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA4LTE5VDE1OjU2OjAwKzA4OjAwF2Cg2QAA" +
                                        "ACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6" +
                                        "RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA4N7tq1bAA" +
                                        "AAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMTk0Os+EPQAAABl0RVh0VGh1bWI6Ok1pbWV0eXBl" +
                                        "AGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTk3ODIzNzYwNlmp4wAAABJ0RVh0" +
                                        "VGh1bWI6OlNpemUAMTc1MEJCVNTlbwAAAEZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2FwcC90bXAv" +
                                        "aW1hZ2VsYy9pbWd2aWV3Ml85XzE1OTI1NTg1NDQwNDcxMTk3XzEwX1swXUxNw/IAAAAASUVORK5C" +
                                        "YII=",
                                    onclick: () => {
                                        this.switchSos(2);
                                    }

                                },

                                myMonth: {
                                    show: true,
                                    title: '本月',
                                    icon: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMEAAABbCAMAAAD9YRGLAAAABGdBTUEAALGPC/xhBQAAACBjSFJN" +
                                        "AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAk1BMVEX///9/f3//27a2tra2" +
                                        "2//bkDoAAAA6kNuQZmZmZmZmkNv/25A6AAAAZrYAAGa229vb29u2kDq2/////9s6kLbb//+2ZgDb" +
                                        "27aQZjr//7ZmAAAAOpBmtv//tmaQkDo6kJAAADqQ2/86ZmZmOgCQOgA6ZpBmtts6ZrbbtmaQttu2" +
                                        "Zjo6OjoAOmZmkLY6OpA6OgDb2/+KKFEkAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAOwwAADsMBx2+o" +
                                        "ZAAAAAd0SU1FB+QIExc4AUoseRwAAAODSURBVHja7ZrZdpswEIbBjnDa7HFMkya0tG6Wtk7b93+6" +
                                        "Yo0ASWiZY47QyIe5SoyN/g9pFo3IsmOznLwlLt8NEVvXaIbYokYzxFY0FsHFRstsSlPRbxWbkn6j" +
                                        "3tQABorTA9A1Jwigik4SQJF9JASx9RyKoLEcZItlYyexCPJs/BSworFVBIJsJjiMYHH6AWkfiRKc" +
                                        "nRdIu5gJZoLjJri8unbaDX2CW8QtZwLN1p4pv7Nf39AgKLH+5/PImWAmSJjg09Ji963QO9s3rmgQ" +
                                        "2Ozhc0vwuEH9gBwB61fLU5IEcpWDmwRqBIqDo/Iyscqu2j/PL/vhvjb+UH9LjoC78QrqIoYakxpB" +
                                        "yZc0EHAahDOTIqggAonalCE8tCWov7s3+dtpCPhTbwKQIFj/QI1KKBZxxXvnbfcHFSoeESLoNjbd" +
                                        "H2WBiEd0CPgT50o6ApQ4MgQQUp664VbYgakQQEF30Q/HCbhreFyBE/gKkPAEIFXokHb60swQJ+Dl" +
                                        "UOu0cq+CFT5vrjBFYHACphRySrel9CFUGHGhCSo16SsE4CCXJ+4fRyYAgH4hqB0vuGoPNihxYQnA" +
                                        "W6WFovXsmBuBX35euu0+JIGoLaV4o3cdy8K1kEpsaRqKQADIMV8ngFBrcWdxMR6BAFBuPuj8iv6F" +
                                        "ESE2QWUAMPSuF6IF8zK8Q9+diUIgALR8ZOi+txux10HmQh2ABDsBeStMAMbzgxbhUfdnVEoOFU1F" +
                                        "c2sQJ40nIC1C/fMQbUEI1r8sAJYznG5Hr6wkTPUaiKCNIfswX/1WDDKc8tHzRkLYSTEJHNnb0ghA" +
                                        "sNj2AKJwcBlf6G1EqiXB/c5uagIxA7vbToafIHvY6gCQkf0N1gAE4AUAgCbI1qW2ZGAR+furQTyZ" +
                                        "9c/uzNCe2ikfvW+6X71oN0G1V8NEU/bHMvnO8+Rr+R9lczo9gXs4VOcdlh/iq1QJYAoQvVWyBAxZ" +
                                        "sGHz3uQEEIgwxySQDOkRlNgpEKnQfxgxMYF7/8yaWkSE4r9FgfSXaQkM21PZhlkSMasKwQgEFIHY" +
                                        "m1lzweBwCjsF/WvLgQnezt1urO8+d4jXoHvdUxDAQ7Z/S+0A1O+Y03WN4HAEpCc3laqrnpBfPfmH" +
                                        "GleWPQ4B++77+hSRjfGmiM7HOnME0zSnhzBQnBrCUG+ep8RgFJunw2CVmqdmLrYkzD099M2/xIgb" +
                                        "zk+oWuxIMtsx2n/EN2tXjljI5wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wOC0xOVQxNTo1Njow" +
                                        "MSswODowMMBKE9EAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDgtMTlUMTU6NTY6MDErMDg6MDCx" +
                                        "F6ttAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAAAYdEVYdFRo" +
                                        "dW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAXdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADkx" +
                                        "SxJBxAAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTOkqxGeAAAAGXRFWHRUaHVtYjo6TWlt" +
                                        "ZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE1OTc4MjM3NjFBXpl1AAAA" +
                                        "EnRFWHRUaHVtYjo6U2l6ZQAxNjk1QkIlqbGMAAAARnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBw" +
                                        "L3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTU5NTQxMTQxMzgwNzI4NDJfOTRfWzBdATOGWQAAAABJ" +
                                        "RU5ErkJggg==",
                                    // onclick: this.switchSos('month')
                                    onclick: () => {
                                        this.switchSos(3);
                                    }
                                },

                            }
                        }
                    };
                    this.chartSos.setOption(option);
                });

            },

            serviceCommon (chart, title, value) {
                // this.cumulativeNumberOfCallsReceived = Echart.init(document.getElementById('cumulative-number-of-calls-received'));
                // this.cumulativeNumberOfCallsReceived.hideLoading();
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    series: [
                        {
                            name: title,
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '50%'],
                            label: {
                                position: 'inner',
                                verticalAlign: 'top',
                                offset: [40, 50],
                                fontSize: 10,
                                padding: [-60, 0, 0, 0]
                            },
                            data: [
                                {
                                    value: value,
                                    name: title+value,
                                    label: {
                                        // show: true,
                                        // position: 'center'
                                    }
                                },
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                chart.setOption(option);
            },
            //累计接听电话数
            cumulativeNumberOfCallsReceivedInit() {
                this.cumulativeNumberOfCallsReceived = Echart.init(document.getElementById('cumulative-number-of-calls-received'));
                this.cumulativeNumberOfCallsReceived.hideLoading();
                this.serviceCommon(this.cumulativeNumberOfCallsReceived, '累计接听电话数', this.callNumbers.pickUpPhoneNum);
            },

            getCallNumber() {
                this.$http.get('/apis/statistic/countCallCenter').then((res) => {
                    this.callNumbers = res.data.data
                    // this.cumulativeNumberOfCallsReceivedInit();
                    // this.cumulativeCallTimeInit();
                    // this.cumulativeDispatchedOrderNumberInit();
                    // this.cumulativeNumberOfCompletedWorkInit();
                });
            },

            //累计接听电话时长
            cumulativeCallTimeInit() {
                this.cumulativeCallTime = Echart.init(document.getElementById('cumulative-call-time'));
                this.cumulativeCallTime.hideLoading();
                this.serviceCommon(this.cumulativeCallTime, '累计接听电话时长', this.callNumbers.phoneTime || 100)
            },

            //累计派单数
            cumulativeDispatchedOrderNumberInit() {
                this.cumulativeDispatchedOrderNumber = Echart.init(document.getElementById('cumulative-dispatched-order-number'));
                this.cumulativeDispatchedOrderNumber.hideLoading();
                this.serviceCommon(this.cumulativeDispatchedOrderNumber, '累计派单数', this.callNumbers.dispatchNum)
            },

            //累计完成工单数
            cumulativeNumberOfCompletedWorkInit() {
                this.cumulativeNumberOfCompletedWork = Echart.init(document.getElementById('cumulative-number-of-completed-work'));
                this.cumulativeNumberOfCompletedWork.hideLoading();
                this.serviceCommon(this.cumulativeNumberOfCompletedWork, '累计完成工单数', this.callNumbers.workOrderNum)
            },

            //本月接待总计
            monthlyTotalReceptionInit() {
                this.monthlyTotalReception = Echart.init(document.getElementById('monthly-total-reception'));
                this.monthlyTotalReception.hideLoading();
                let total = 234;
                // let data = [1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
                let data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                let value = [2,5,3,9,4,7,11]
                this.$http.get('/apis/statistic/countReception').then(res => {
                    total = res.data.data.totalNum;
                    data = res.data.data.date;
                    value = res.data.data.value;
                    let option = {
                        title: {
                            text: '本周累计接待总计',
                            left: "center",
                            // top: "center",
                            // subtext: '共计'+total+'人次',
                        },
                        xAxis: {
                            type: 'category',
                            data: data
                        },
                        yAxis: {
                            type: 'value',
                            name: '接待次数(人次)',

                        },
                        series: [{
                            data: value,
                            type: 'bar',
                            color: '#fd7f04',
                            label: {
                                show: true,
                                position: 'outside',
                                color: 'purple'
                            },
                        }]
                    };

                    this.monthlyTotalReception.setOption(option);
                });

            },

            //本周服务汇总
            weeklyServiceSummaryInit() {
            //    weekly-service-summary
                this.weeklyServiceSummary = Echart.init(document.getElementById('weekly-service-summary'));
                this.weeklyServiceSummary.hideLoading();
                let totalNum = 332;
                let value = [820, 932, 901, 934, 1290, 1330, 1320];
                this.$http.get('/apis/statistic/countWorkOrderForWeek').then(res => {
                    totalNum = res.data.data.totalNum;
                    value = res.data.data.value;
                    let option = {
                        title: {
                            text: '本周服务汇总',
                            left: "center",

                        },
                        xAxis: {
                            type: 'category',
                            data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
                        },
                        yAxis: {
                            type: 'value',
                            name: '服务次数(人次)',
                        },
                        series: [
                            // {
                            //     data: value,
                            //     type: 'bar'
                            // },
                            {
                                data: value,
                                type: 'line',
                                smooth: true,
                                color: '#fd7f04'
                            },
                        ]
                    };

                    this.weeklyServiceSummary.setOption(option);
                });

            },

            //数据统计
            dataStatisticsInit() {
                this.dataStatistics = Echart.init(document.getElementById('data-statistics'));
                this.dataStatistics.hideLoading();


                let option = {
                    title: {
                        text: '数据统计',
                        left: 'center',
                        // backgroundColor: '#255788',

                        textStyle: {
                            width: '100%'
                        },
                        rich: {
                            width: '100%',
                            textBorderWidth: '100%',
                        }
                    },
                    backgroundColor: '#244566',
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        left: 'center',
                        top: 'bottom',
                        data: ['驿工', '总接待电话数', '老人', '驿站数', '医生', '子女用户数', '总工单数'],
                        itemGap: 20,
                        textStyle: {
                            color: 'white'
                        }
                    },
                    toolbox: {
                        // show: true,
                        // feature: {
                        //     mark: {show: true},
                        //     dataView: {show: true, readOnly: false},
                        //     magicType: {
                        //         show: true,
                        //         type: ['pie', 'funnel']
                        //     },
                        //     restore: {show: true},
                        //     saveAsImage: {show: true}
                        // }
                    },
                    series: [
                        {
                            name: '面积模式',
                            type: 'pie',
                            radius: [30, 110],
                            center: ['50%', '50%'],
                            roseType: 'area',
                            data: [
                                {value: 10, name: '驿工', itemStyle: {
                                    color: '#1E90FF'
                                    }},
                                {value: 5, name: '总接待电话数', itemStyle: {
                                    color: '#708090'
                                    }},
                                {value: 15, name: '老人', itemStyle: {
                                    color: '#32CD32'
                                    }},
                                {value: 25, name: '驿站数', itemStyle: {
                                    color: '#40E0D0'
                                }},
                                {value: 20, name: '医生', itemStyle: {
                                    color: '#FF4500'
                                    }},
                                {value: 35, name: '子女用户数', itemStyle: {
                                        color: '#4169E1'
                                    }},
                                {value: 30, name: '总工单数', itemStyle: {
                                        color: '#838B8B'
                                    }},
                            ]
                        }
                    ]
                };

                this.dataStatistics.setOption(option);

            },



            orderRateInit() {

                let doctorOrderNum = 124;
                let serviceOrderNum = 987;
                this.$http.get('/apis/statistic/countWorkOrder').then(res => {
                    serviceOrderNum = res.data.data.serviceOrderNum;
                    doctorOrderNum = res.data.data.doctorOrderNum;
                    let chart = HighCharts.chart({
                        chart: {
                            renderTo: 'order-rate',
                            title: 'test',
                            type: 'pie',
                            options3d: {
                                enabled: true,
                                alpha: 15,
                                beta: 15,
                                depth: 50,
                                viewDistance: 25
                            }
                        },
                        title: {
                            text: '工单占比',
                            align: 'center',
                            style: { color: "#333333", fontSize: "18px",  fontWeight: 'bold'},
                        },
                        credits: {
                            enabled: false//不显示LOGO
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: false,
                                // cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                depth: 35,
                                showInLegend: true,

                                animation: false,
                            }
                        },

                        legend: {
                            enabled: true,
                            itemDistance: 30,
                            align: 'left',
                            layout: 'vertical',
                            itemMarginBottom: 20,
                            symbolRadius: 30,
                            symbolWidth: 50,
                            verticalAlign: 'middle',
                            y: 30,
                            symbolPadding: 1,
                            labelFormatter: function () {
                                return '<p style="margin-bottom: 10px">' + this.name + '</P>' + '<br />' + '数量: ' + this.y + '<br />' + '占比: ' + this.percentage.toFixed(1) + '%';

                            }
                        },

                        series: [{
                            name: '工单占比',
                            colorByPoint: true,
                            borderWidth: 0,
                            center: [110,100],
                            data: [
                                {
                                    name: '社工工单',
                                    color: '#fda047',
                                    y: serviceOrderNum,
                                },
                                {
                                    name: '医生工单',
                                    y: doctorOrderNum,
                                    color: '#c43aff',
                                }
                            ],

                        }]
                    })
                });


            },

            doctorAverage() {
                let doctorAverage = Echart.init(document.getElementById('doctor-average'));
                doctorAverage.hideLoading();
                let data = [];
                let average = 0;
                this.$http.get('/apis/statistic/countAvgWorkOrderTime', {
                    params: {
                        type: 1
                    }
                }).then((res) => {
                    data = res.data.data.value;
                    average = res.data.data.avg;
                    let option = {
                        title: {
                            text: '医生平均接单时间',
                        },
                        xAxis: {
                            type: 'category',
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        },
                        yAxis: {
                            type: 'value',
                            name: '接单时间(分)',
                        },
                        series: [
                            {
                                data: data,
                                type: 'line',
                                smooth: false,
                                color: '#c23fe8',
                                markPoint: {
                                    data: [
                                        {
                                            name: '最大值',
                                            type: 'max'
                                        },

                                        {
                                            name: '最小值',
                                            type: 'min'
                                        },
                                    ]
                                },
                            },

                            // {
                            //     data: [average, average, average, average, average, average, average],
                            //     type: 'line',
                            //     smooth: true,
                            //     symbol: 'none',
                            //     lineStyle: {
                            //         type: 'dashed',
                            //         color: 'red'
                            //     },
                            // },
                        ]
                    };

                    doctorAverage.setOption(option);
                });


            },

            workerAverage() {
                let workerAverage = Echart.init(document.getElementById('worker-average'));
                workerAverage.hideLoading();
                let data = [];
                let average = 0;
                this.$http.get('/apis/statistic/countAvgWorkOrderTime', {
                    params: {
                        type: 2
                    }
                }).then((res) => {
                    data = res.data.data.value;
                    average = res.data.data.avg;
                    let option = {
                        title: {
                            text: '驿工平均接单时间',
                        },
                        xAxis: {
                            type: 'category',
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        },
                        yAxis: {
                            type: 'value',
                            name: '接单时间(分)',
                        },
                        series: [
                            {
                                data: data,
                                type: 'line',
                                smooth: false,
                                color: '#fea44d',
                                markPoint: {
                                    data: [
                                        {
                                            name: '最大值',
                                            type: 'max'
                                        },

                                        {
                                            name: '最小值',
                                            type: 'min'
                                        },
                                    ]
                                },
                            },

                            // {
                            //     data: [average,average,average,average,average,average,average],
                            //     type: 'line',
                            //     smooth: true,
                            //     symbol: 'none',
                            //     lineStyle: {
                            //         type: 'dashed',
                            //         color: 'red'
                            //     },
                            // },
                        ]
                    };

                    workerAverage.setOption(option);
                });

            },

            switchSos (type) {
                this.$http.get('/apis/statistic/countSos', {
                    params: {
                        type: type
                    }
                }).then((res) => {
                    // console.log(res.data.data.value);
                    this.sosData.series[0].data = res.data.data.value;
                    if(type == 1) {
                        // this.sosData.series = this.sosData.seriesDay
                        this.sosData.xAxis = this.sosData.xAxisDay
                    } else if(type == 2) {
                        // this.sosData.series = this.sosData.seriesWeek
                        this.sosData.xAxis = this.sosData.xAxisWeek

                    } else if(type == 3) {
                        // this.sosData.series = this.sosData.seriesMonth
                        this.sosData.xAxis = this.sosData.xAxisMonth

                    } else {
                        // this.sosData.series = this.sosData.seriesDay
                        this.sosData.xAxis = this.sosData.xAxisDay
                    }
                    this.chartSos.setOption({
                        xAxis: this.sosData.xAxis,
                        yAxis: {
                            name: '报警接听数(次)',
                        },
                        series: this.sosData.series,
                    });
                });


            },

            getSummary() {
                this.$http.get('/apis/statistic/countNum').then((res) => {
                // this.$http.get('http://rap2.taobao.org:38080/app/mock/261698/adminApi/statistic/countNum').then((res) => {
                    this.summary[0].value = res.data.data.oldManNum;
                    this.summary[1].value = res.data.data.doctorNum;
                    this.summary[2].value = res.data.data.socialWorkerNum;
                    this.summary[3].value = res.data.data.childNum;
                    this.summary[4].value = res.data.data.villageNum;
                    this.summary[5].value = res.data.data.courierStationNum;
                    this.processData.doctorNum = res.data.data.doctorNum;
                    this.processData.socialWorkerNum = res.data.data.socialWorkerNum;
                    this.processData.childrenNum = res.data.data.childNum;
                    this.processData.stationNum = res.data.data.courierStationNum;
                    this.processData.oldManNum = res.data.data.oldManNum;
                });
            }
        },

        mounted() {
            this.getCallNumber();
            this.sos(this.sosData.xAxisDay, this.sosData.seriesDay);
            this.switchSos(1);
            this.orderRateInit();
            this.monthlyTotalReceptionInit();
            this.weeklyServiceSummaryInit();
            // this.dataStatisticsInit();
            this.doctorAverage();
            this.workerAverage();
            this.getSummary();
        }
    }
</script>

<style scoped>
    .home-container {
        text-align: center;
    }

    .text {
        font-size: 14px;
        border: none;
    }
    
    .chart-title {
        text-align: center;
    }
    .item:not(:first-child) {
        margin: 0 10px;
    }
    .item {
        color: white;
        width: 155px;
        height: 70px;
    }

    .orange {
        background-image: url("../../assets/img/statistics/statistic_oriange.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        border-radius: 10px;
    }

    .green {
        background-image: url("../../assets/img/statistics/statistic_green.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        border-radius: 10px;
    }

    .blue {
        background-image: url("../../assets/img/statistics/statistic_blue.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        border-radius: 10px;
    }

    .yellow {
        background-image: url("../../assets/img/statistics/statistic_yellow.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        border-radius: 10px;
    }

    .pink {
        background-image: url("../../assets/img/statistics/statistic_pink.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        border-radius: 10px;
    }

    .purple {
        background-image: url("../../assets/img/statistics/statistic_purple.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        border-radius: 10px;
    }

    .card-value {
        font-size: 22px;
        text-align: center;
        margin-top: 10px;
    }

    .card-title {
        position: relative;
        font-size: 10px;
        color: white;
        top: 5px;
        left: 8px;
    }

    .box-card {
        width: 100%;
        /*margin-bottom: 10px;*/
        /*padding-bottom: 20px;*/
    }

    .changed {
        position: relative;
        top: 50%;
        left: 50%;
        width:50%;
        height: 50%;
        -webkit-transform: translateX(-50%) translateY(-50%);text-align: center;
    }

</style>