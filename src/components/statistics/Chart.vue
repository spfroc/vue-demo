<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card class="box-card home-container">
                    <div v-for="o in summary" :key="o.title" class="item">
                        <div class="text card-value"><strong>{{o.value}}{{o.unit}}</strong></div>
                        <div class="text card-title">{{o.title}}</div>
                    </div>
                </el-card>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span="12">
                <section id="sos" style="width: 100%;height:400px;padding:20px 0px 20px 0px" class="box-card"></section>
            </el-col>
            <el-col :span="8">
                <section class="chart-title" >自2020-07-10来累计数据</section>

                <el-row>
                    <el-col :span="12">
                        <section id="cumulative-number-of-calls-received" style="width: 100%;height:200px;">累计接听电话数</section>
                    </el-col>
                    <el-col :span="12">
                        <section id="cumulative-call-time" style="width: 100%;height:200px;">累计接听电话时长</section>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <section id="cumulative-dispatched-order-number" style="width: 100%;height:200px;">累计派单数</section>
                    </el-col>
                    <el-col :span="12">
                        <section id="cumulative-number-of-completed-work" style="width: 100%;height:200px;">累计完成工单数</section>
                    </el-col>
                </el-row>
                <!--<section id="summary" style="width: 600px;height:400px;"></section>-->

            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <section id="worker-average" style="width: 600px;height:400px;padding:20px 0px 20px 0px">驿工平均接单时间</section>
            </el-col>
            <el-col :span="12">
                <section id="doctor-average" style="width: 600px;height:400px;padding:20px 0px 20px 0px">医生平均接单时间</section>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="8">
                <section id="order-rate" style="width: 600px;height:400px;padding:20px 0px 20px 0px">医生工单 服务工单在总工单中占比</section>
            </el-col>
            <el-col :span="12">
                <section style="padding:20px 0px 20px 0px">魏善庄镇行政地图</section>
                <a-map
                        :width="100"
                        :lng="116.419461"
                        :lat="39.663952"
                        :height="200"></a-map>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <section id="monthly-total-reception" style="width: 100%;height:400px;padding:20px 0px 20px 0px">本月接待总计</section>
            </el-col>
            <el-col :span="8">
                <section id="weekly-service-summary" style="width: 100%;height:400px;padding:20px 0px 20px 0px">本周服务汇总</section>
            </el-col>
            <el-col :span="8">
                <!--<section id="data-statistics" style="width: 100%;height:400px;padding:20px 0px 20px 0px">数据统计</section>-->
                <section style="width: 100%;height:400px;padding:20px 0px 20px 0px">
                    <!--['驿工', '总接待电话数', '老人', '驿站数', '医生', '子女用户数', '总工单数'],-->
                    <!--<progress></progress>-->
                    <section style="text-align: center">数据统计</section>
                    <custom-progress
                            progress=25
                            value="25k"
                            background-color="#1E90FF"
                            text="驿工"
                            dot-color="#1E90FF"
                    ></custom-progress>

                    <custom-progress
                            progress=75
                            value="750"
                            background-color="#708090"
                            text="总接待电话数"
                            dot-color="#708090"
                    ></custom-progress>

                    <custom-progress
                            progress=80
                            value="240"
                            background-color="#32CD32"
                            text="老人"
                            dot-color="#32CD32"
                    ></custom-progress>

                    <custom-progress
                            progress=33
                            value="348"
                            background-color="#40E0D0"
                            text="驿站数"
                            dot-color="#40E0D0"
                    ></custom-progress>

                    <custom-progress
                            progress=100
                            background-color="#FF4500"
                            text="医生"
                            value="1240"
                            dot-color="#FF4500"
                    ></custom-progress>
                    <custom-progress
                            progress=80
                            value="3368"
                            background-color="#4169E1"
                            text="子女用户数"
                            dot-color="#4169E1"
                    ></custom-progress>
                    <custom-progress
                            progress=40
                            background-color="#838B8B"
                            text="总工单数"
                            dot-color="#838B8B"
                    ></custom-progress>
                </section>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    import Echart from 'echarts'
    import AMap from '../common/Map'
    import CustomProgress from '../common/progress'
    export default {
        name: "Chart",
        components: {
            Echart, AMap, CustomProgress
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
                summary: [
                    {
                        title: '老人数量',
                        value: 50,
                        unit: '人',
                    },
                    {
                        title: '医生数量',
                        value: 50,
                        unit: '人',
                    },
                    {
                        title: '驿工数量',
                        value: 200,
                        unit: '人',
                    },
                    {
                        title: '总注册子女用户数',
                        value: 800,
                        unit: '人',
                    },
                    {
                        title: '覆盖村庄数',
                        value: 300,
                        unit: '个',
                    },
                    {
                        title: '驿站数量',
                        value: 300,
                        unit: '个',
                    }
                ],

                sosData: {
                    title: {
                        text: 'SOS报警接口变化图'
                    },

                    xAxis: {
                        data: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"]
                    },

                    xAxisDay: {
                        data: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"]
                    },

                    xAxisWeek: {
                        data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
                    },

                    xAxisMonth: {
                        data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
                    },
                    series: [{
                        name: '报警数',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20, 15, 41, 33]
                    }],

                    seriesDay: [{
                        name: '报警数',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20, 15, 41, 33]
                    }],

                    seriesWeek: [{
                        name: '报警数',
                        type: 'bar',
                        data: [25, 20, 36, 10, 15, 41, 33]
                    }],

                    seriesMonth: [{
                        name: '销量',
                        type: 'bar',
                        data: [11,22,13,24,15,26,37,28,19,40,31,22,13,34,45,26,17,28,39,20,31,12,23,34,15,56,17,28,49,30]
                    }],

                },

            }
        },

        methods: {
            sos (xAxis, series) {
                this.chartSos = Echart.init(document.getElementById('sos'));
                this.chartSos.hideLoading();
                let option = {
                    title: this.sosData.title,
                    tooltip: {},
                    xAxis: xAxis,
                    yAxis: {},
                    series: series,
                    toolbox: {
                    // padding:30,
                    show : true,
                        orient: 'horizontal',
                        itemSize: 20,
                        itemGap: 20,
                        feature: {
                            myDay: {
                                show: true,
                                title: '本日',
                                icon: "image://https://image.flaticon.com/icons/svg/102/102571.svg",
                                onclick: () => {
                                    this.switchSos('day');
                                },
                            },
                            myWeek: {
                                show: true,
                                title: '本周',
                                icon: "image://https://image.flaticon.com/icons/svg/102/102571.svg",
                                // onclick: this.switchSos('week')
                                onclick: () => {
                                    this.switchSos('week');

                                }

                            },

                            myMonth: {
                                show: true,
                                title: '本月',
                                icon: "image://https://image.flaticon.com/icons/svg/102/102571.svg",
                                // onclick: this.switchSos('month')
                                onclick: () => {
                                    this.switchSos('month');
                                }
                            },

                        }
                    }
                };
                this.chartSos.setOption(option);
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
                                {value: value, name: title},
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
                this.serviceCommon(this.cumulativeNumberOfCallsReceived, '累计接听电话数', 456);
            },

            //累计接听电话时长
            cumulativeCallTimeInit() {
                this.cumulativeCallTime = Echart.init(document.getElementById('cumulative-call-time'));
                this.cumulativeCallTime.hideLoading();
                this.serviceCommon(this.cumulativeCallTime, '累计接听电话时长', 9891)
            },

            //累计派单数
            cumulativeDispatchedOrderNumberInit() {
                this.cumulativeDispatchedOrderNumber = Echart.init(document.getElementById('cumulative-dispatched-order-number'));
                this.cumulativeDispatchedOrderNumber.hideLoading();
                this.serviceCommon(this.cumulativeDispatchedOrderNumber, '累计派单数', 156)
            },

            //累计完成工单数
            cumulativeNumberOfCompletedWorkInit() {
                this.cumulativeNumberOfCompletedWork = Echart.init(document.getElementById('cumulative-number-of-completed-work'));
                this.cumulativeNumberOfCompletedWork.hideLoading();
                this.serviceCommon(this.cumulativeNumberOfCompletedWork, '累计完成工单数', 368)
            },

            //本月接待总计
            monthlyTotalReceptionInit() {
                this.monthlyTotalReception = Echart.init(document.getElementById('monthly-total-reception'));
                this.monthlyTotalReception.hideLoading();

                let option = {
                    title: {
                        text: '本月累计接待总计',
                        left: "center",
                        // top: "center",
                        subtext: '共计234人次',
                    },
                    xAxis: {
                        type: 'category',
                        data: [1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,1212,3333],
                        type: 'line'
                    }]
                };

                this.monthlyTotalReception.setOption(option);
            },

            //本周服务汇总
            weeklyServiceSummaryInit() {
            //    weekly-service-summary
                this.weeklyServiceSummary = Echart.init(document.getElementById('weekly-service-summary'));
                this.weeklyServiceSummary.hideLoading();

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
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'bar'
                    }]
                };

                this.weeklyServiceSummary.setOption(option);
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
                this.orderRate = Echart.init(document.getElementById('order-rate'));
                this.orderRate.hideLoading();

                let option = {
                    title: {
                        text: '医生工单 服务工单在总工单中占比'
                    },
                    legend: {
                        orient: 'vertical',
                        bottom: 'bottom',
                        itemGap: 30,
                        // formatter: function (name) {
                        //     return name + '  占比';
                        // },
                        formatter: {name},
                        data: [
                            {
                                name: '医生工单',
                            },
                            {
                                name: '服务工单',
                            },
                        ],
                        // itemGap: 20
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    series: [
                        {
                            name: '工单',
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
                                {value: 159, name: '医生工单'},
                                {value: 236, name: '服务工单'},
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
                this.orderRate.setOption(option);
            },

            doctorAverage() {
                let doctorAverage = Echart.init(document.getElementById('doctor-average'));
                doctorAverage.hideLoading();

                let option = {
                    title: {
                        text: '医生平均接单时间',
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line',
                            smooth: true,
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

                        {
                            data: [950, 950, 950, 950, 950, 950, 950],
                            type: 'line',
                            smooth: true,
                            symbol: 'none',
                            lineStyle: {
                                type: 'dashed',
                                color: 'red'
                            },
                        },
                    ]
                };

                doctorAverage.setOption(option);

            },

            workerAverage() {
                let workerAverage = Echart.init(document.getElementById('worker-average'));
                workerAverage.hideLoading();

                let option = {
                    title: {
                        text: '驿工平均接单时间',
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line',
                            smooth: true,
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

                        {
                            data: [950, 950, 950, 950, 950, 950, 950],
                            type: 'line',
                            smooth: true,
                            symbol: 'none',
                            lineStyle: {
                                type: 'dashed',
                                color: 'red'
                            },
                        },
                    ]
                };

                workerAverage.setOption(option);
            },

            switchSos (type) {
                console.log(type);
                if(type == 'day') {
                    this.sosData.series = this.sosData.seriesDay
                    this.sosData.xAxis = this.sosData.xAxisDay
                } else if(type == 'week') {
                    this.sosData.series = this.sosData.seriesWeek
                    this.sosData.xAxis = this.sosData.xAxisWeek

                } else if(type == 'month') {
                    this.sosData.series = this.sosData.seriesMonth
                    this.sosData.xAxis = this.sosData.xAxisMonth

                } else {
                    this.sosData.series = this.sosData.seriesDay
                    this.sosData.xAxis = this.sosData.xAxisDay
                }
                // this.sos(this.sosData.xAxisWeek, this.sosData.seriesWeek)
                this.chartSos.setOption({
                    xAxis: this.sosData.xAxis,
                    yAxis: {},
                    series: this.sosData.series,
                });

            },
        },

        mounted() {
            this.sos(this.sosData.xAxisDay, this.sosData.seriesDay);
            this.cumulativeNumberOfCallsReceivedInit();
            this.cumulativeCallTimeInit();
            this.cumulativeDispatchedOrderNumberInit();
            this.cumulativeNumberOfCompletedWorkInit();
            this.orderRateInit();
            this.monthlyTotalReceptionInit();
            this.weeklyServiceSummaryInit();
            // this.dataStatisticsInit();
            this.doctorAverage();
            this.workerAverage();

        }
    }
</script>

<style scoped>
    .home-container {
        text-align: center;
    }

    .text {
        font-size: 14px;
    }
    
    .chart-title {
        text-align: center;
    }

    .item {
        /*padding: 0 20px 0 20px;*/
        margin: 0 20px;
        float: left;
        border: solid lightgray 1px;
        height: 80px;
        width: 150px;
    }

    .card-value {
        margin-top: 15px;
        font-size: 30px;
    }

    .card-title {
        font-size: 8px;
        color: gray;
    }

    .box-card {
        width: 100%;
        /*margin-bottom: 10px;*/
        padding-bottom: 20px;
    }



</style>