<template>
    <div>
        <el-row>
            <el-col>
                <div class="grid-content bg-purple">
                    <el-tabs v-model="activeName" @tab-click="tabSwitch">
                        <el-tab-pane label="服务坐席工作台" name="customerService"></el-tab-pane>
                        <el-tab-pane label="历史工单列表" name="historyWorkOrder"></el-tab-pane>
                        <el-tab-pane label="历史接待列表" name="historyReception"></el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
        <el-row class="" v-if="activeName != 'customerService'">
            <el-col :span="22">
                <el-form :model="searchForm" size="mini" :inline="true">
                    <el-input v-model="searchForm.mobile" style="width: 120px" size="mini" placeholder="老人手机号"></el-input>
                    <el-input v-model="searchForm.name" style="width: 120px" size="mini" placeholder="老人姓名"></el-input>
                    <el-form-item label="" prop="timeStart">
                        <el-date-picker
                                v-model="searchForm.timeStart"
                                align="left"
                                size="mini"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="开始日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>至</el-form-item>
                    <el-form-item label="" prop="timeEnd">
                        <el-date-picker
                                v-model="searchForm.timeEnd"
                                align="left"
                                size="mini"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-button type="primary" @click="searchList" size="mini">搜索</el-button>
                </el-form>
            </el-col>
            <el-col :span="2">
                <export-excel v-if="activeName=='historyReception'" url="/export/receptionList" :params="searchForm"></export-excel>
                <export-excel v-if="activeName=='historyWorkOrder'" url="/export/workOrder" :params="searchForm"></export-excel>
            </el-col>
        </el-row>
        <section class="" v-if="activeName=='customerService'">
            <el-row type="flex" justify="center">
                    <el-col :span="6" v-for="o in firstTab.list" :key="o.title" :class="o.bg + ' item-col'">
                        <div class="card-title">{{o.text}}</div>
                        <div class="self-number-text"><span class="">{{o.self}}次&nbsp;</span><span class="after-self-number-text">本人</span></div>
                        <div><span  class="total-text">总计{{o.total}}次</span></div>
                    </el-col>
                    <el-col :span="6" style="margin-left: 10px;">
                        <el-form style="width: 200px;margin: 0 auto">
                            <el-date-picker
                                v-model="firstTab.searchDateStart"
                                type="date"
                                size="mini"
                                id="datePicker"
                                style="margin-left: 25px;width: 155px;"
                                align="center"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="statisticsByDate"
                                placeholder="时间选择器(开始)">
                            </el-date-picker>
                            <div style="margin: 15px auto 15px auto;color: #c0c4cc;width: 200px;text-align: center;"><span>至</span></div>
                            <el-date-picker
                                v-model="firstTab.searchDateEnd"
                                type="date"
                                size="mini"
                                align="center"
                                style="margin-left: 25px;width: 155px;"
                                id="datePicker"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="statisticsByDate"
                                placeholder="时间选择器(结束)">
                            </el-date-picker>
                        </el-form>

                        <div style="margin:15px auto 0 auto;width: 200px;">
                            <el-button @click="statistics(1)" size="mini" :type="buttonType(1)">本日</el-button>
                            <el-button @click="statistics(2)" size="mini" :type="buttonType(2)">本周</el-button>
                            <el-button @click="statistics(3)" size="mini" :type="buttonType(3)">本月</el-button>
                        </div>

                    </el-col>

            </el-row>
            <el-row style="height: 200px;margin-top: 30px;" type="flex">
                <el-col :span="7">&nbsp;</el-col>
                <el-col :span="3">
                    <div>
                        <img width="150px" src="../../assets/img/index/male.png" alt="">
                    </div>
                </el-col>
                <el-col :span="10">
                    <div>
                        <section style="font-size: 25px;font-weight: bold;color: #000000de;margin-left: 60px;margin-top: 30px;">接待中心</section>
                        <el-form class="search-form">
                            <el-input v-model="firstTab.oldManMobile" style="width: 40% !important;" placeholder="请输入老人手机号"></el-input>
                            <el-button @click="reception" type="primary">接待</el-button>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="4">&nbsp;</el-col>

            </el-row>

            <el-row>
                <el-table
                        :data="firstTab.oldManList"
                        style="width: 100%">
                    <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="nation"
                        label="民族"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="sex"
                        align="center"
                        :formatter="sexFormatter"
                        label="性别">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        min-width="110"
                        align="center"
                        label="手机号">
                    </el-table-column>
                    <el-table-column
                        prop="idCardNumber"
                        min-width="165"
                        align="center"
                        label="身份证号">
                    </el-table-column>
                    <el-table-column
                        prop="age"
                        align="center"
                        label="年龄">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        label=""
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <div style="float: left">
                                <el-button style="float: left" @click="() => { serviceOrder(scope.row) }" type="primary" size="mini">服务工单</el-button>
                                <el-button style="margin: 10px 0 0 0" @click="() => { doctorOrder(scope.row) }" type="primary" size="mini">医生工单</el-button>
                                <el-button style="margin: 10px 0 0 0" @click="() => { receptionRecord(scope.row) }" type="primary" size="mini">接待记录</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <section><h3>工单列表</h3></section>
                <el-table
                        :data="firstTab.workOrderList"
                        :stripe=true
                        :highlight-current-row=true
                        :row-style="rowStyle"
                        :row-class-name="tableRowClassName"
                        style="width: 100%">
                    <el-table-column type="index" width="150"  label="工单号"></el-table-column>
                    <el-table-column
                        prop="createTime"
                        min-width="150"
                        label="下单时间"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="endTime"
                        min-width="150"
                        label="结单时间"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        align="center"
                        :formatter="statusFormatter"
                        label="工单状态">
                    </el-table-column>

                    <el-table-column
                        prop=""
                        label=""
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <div style="float: left">
                                <el-button style="float: left" @click="() => { orderView(scope.row) }" size="mini">查看工单</el-button>
                                <el-button style="margin: 10px 0 0 0" @click="receptionOrderClick(scope.row)" v-if="receptionListShowOrderButton(scope.row)" type="primary" size="mini">{{receptionListOrderButtonText(scope.row)}}</el-button>
                                <el-button v-if="scope.row.status != '2' && scope.row.status != '5'" style="margin: 10px 0 0 0" @click="() => { terminateOrder(scope.row) }" type="primary" size="mini">结束工单</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </section>
        <el-row v-if="activeName=='historyWorkOrder'">
            <el-table
                    :data="secondTab.historyWorkOrderList"
                    :highlight-current-row=true
                    :row-style="rowStyle"
                    :stripe=true
                    style="width: 100%">
                <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="nation"
                    label="民族"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="sex"
                    align="center"
                    :formatter="sexFormatter"
                    label="性别">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    min-width="110"
                    align="center"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="idCardNumber"
                    min-width="165"
                    align="center"
                    label="身份证号">
                </el-table-column>
                <el-table-column
                    prop="age"
                    align="center"
                    label="年龄">
                </el-table-column>

                <el-table-column
                    prop="createTime"
                    min-width="150"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop="status"
                    align="center"
                    :formatter="statusFormatter"
                    label="状态">
                </el-table-column>
                <el-table-column
                    prop=""
                    label=""
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <div style="float: left">
                            <el-button v-if="scope.row.status != '3'" style="float: left" @click="() => { orderView(scope.row) }" size="mini">查看工单</el-button>
                            <el-button v-if="scope.row.status == '3'" style="margin: 10px 0 0 0" @click="() => { receptionRecord(scope.row) }" type="primary" size="mini">接待记录</el-button>
                            <el-button style="margin: 10px 0 0 0" @click="orderOperation(scope.row)" v-if="receptionListShowOrderButton(scope.row)" type="primary" size="mini">{{receptionListOrderButtonText(scope.row)}}</el-button>
                            <el-button v-if="scope.row.status != '5'" style="margin: 10px 0 0 0" @click="() => { terminateOrder(scope.row) }" type="primary" size="mini">结束工单</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                hide-on-single-page
                background
                layout="total, prev, pager, next"
                :page-size="this.secondTab.historyWorkOrderPage.pageSize"
                :total="this.secondTab.historyWorkOrderPage.total"
                :current-page="this.secondTab.historyWorkOrderPage.pageNum"
                @current-change="getHistoryWorkOrderList">
            </el-pagination>
        </el-row>
        <el-row v-if="activeName=='historyReception'">
            <el-table
                    :data="thirdTab.historyReceptionList"
                    :highlight-current-row=true
                    :row-style="rowStyle"
                    style="width: 100%">
                <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="nation"
                    label="民族"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="sex"
                    align="center"
                    :formatter="sexFormatter"
                    label="性别">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    min-width="110"
                    align="center"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="idCardNumber"
                    min-width="165"
                    align="center"
                    label="身份证号">
                </el-table-column>
                <el-table-column
                    prop="age"
                    align="center"
                    label="年龄">
                </el-table-column>

                <el-table-column
                    prop="createTime"
                    min-width="150"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop=""
                    label=""
                    align="center"
                    width="100">
                    <template slot-scope="scope" v-if="activeName == 'historyReception'">
                        <div style="float: left">
                            <el-button style="float: left" @click="() => { receptionRecord(scope.row) }" size="mini">查看详情</el-button>
                        </div>

                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    hide-on-single-page
                    background
                    layout="total, prev, pager, next"
                    :page-size="this.thirdTab.historyReceptionPage.pageSize"
                    :total="this.thirdTab.historyReceptionPage.total"
                    :current-page="this.thirdTab.historyReceptionPage.pageNum"
                    @current-change="getHistoryReceptionList"
            >
            </el-pagination>
        </el-row>

        <el-dialog :close-on-click-modal="false" :title="dialogTitle" style="height: auto" :visible.sync="showDialog" :append-to-body="true">
            <el-form :model="commonOrder" label-width="100px">
                <el-form-item v-show="commonOrder.id" label="ID" prop="id">
                    <el-input :disabled="true" v-model="commonOrder.id"></el-input>
                </el-form-item>
                <el-form-item label="老人姓名" prop="name">
                    <el-input :disabled="true" v-model="commonOrder.name"></el-input>
                </el-form-item>

                <el-form-item label="性别" prop="sex">
                    <el-input :disabled="true" v-model="genderFormatter"></el-input>
                </el-form-item>

                <el-form-item label="手机号" prop="mobile">
                    <el-input :disabled="true" v-model="commonOrder.mobile"></el-input>
                </el-form-item>

                <el-form-item label="所在村庄" prop="villageName">
                    <el-input :disabled="true" v-model="commonOrder.villageName"></el-input>
                </el-form-item>

                <el-form-item label="详细家庭住址" prop="homeAddress">
                    <el-input :disabled="true" v-model="commonOrder.homeAddress"></el-input>
                </el-form-item>

                <el-form-item v-if="dialogTitle == '服务工单'" prop="worker" label="选择社工">
                    <el-select v-model="serviceOrderDialog.worker" placeholder="请选择">
                        <el-option
                            v-for="item in serviceWorkers"
                            :key="item.id"
                            :label="getLabel(item)"
                            :value="item.id">
                            <template v-if="item.offDay == 1">
                                {{item.name}}    <span style="color: red">休假中</span>
                            </template>
                            <template v-if="item.offDay == 0">
                                {{item.name}}    <span style="color: blue">工作中</span>
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-input v-if="dialogTitle == '服务工单'" type="hidden" v-model="commonOrder.type" value="2"></el-input>
                <!--接待记录详情是否有社工选项待定-->
                <!--<el-form-item v-if="dialogTitle == '接待记录'" prop="worker" label="选择社工">-->
                    <!--<el-select v-model="receptionDialog.worker" placeholder="请选择">-->
                        <!--<el-option-->
                                <!--v-for="item in serviceWorkers"-->
                                <!--:key="item.id"-->
                                <!--:label="item.name"-->
                                <!--:value="item.id">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->


                <el-form-item v-if="dialogTitle == '接待记录'" prop="content" label="接待详情">
                    <!--<el-input v-model="receptionDialog.detail"></el-input>-->
                    <el-input type="textarea" v-model="receptionDialog.detail"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogTitle == '医生工单'" prop="doctor" label="选择医生">
                    <el-select v-model="doctorOrderDialog.doctor" placeholder="请选择">
                        <el-option
                                v-for="item in doctorOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dialogTitle == '医生工单'">
                    <el-input type="hidden" v-model="commonOrder.type" value="1"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogTitle == '查看工单'" prop="" label="查看工单">
                    <el-table
                            :show-header=false
                            :data="orderDetail.historyOrders">
                        <el-table-column
                            prop="name"
                            label="姓名"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="mobile"
                            min-width="110"
                            label="手机号"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            align="center"
                            :formatter="statusFormatter"
                            label="状态">
                        </el-table-column>
                        <el-table-column
                            prop="orderTime"
                            align="center"
                            label="下单时间">
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item v-if="dialogTitle == '查看工单'" prop="mobile" label="驿工手机号">
                    <el-input v-model="orderDetail.mobile"></el-input>
                </el-form-item>
                <el-form-item v-if="dialogTitle == '查看工单'" prop="content" label="服务内容">
                    <el-input v-model="orderDetail.content" :disabled=true></el-input>
                    <section v-for="(detail, index) in orderDetail.serviceDetail" :key="index">
                        <div>
                            <span>{{detail.sno || index}}、{{detail.createTime || '-'}}</span>
                        </div>
                        <div>
                            <span>{{detail.content || '服务内容'}}</span>
                        </div>
                        <el-image v-for="(img, index) in detail.imgs" v-if="img.url.length > 0"
                              :key="index"
                              style="width: 100px; height: 100px; margin-right: 10px;"
                              :src="'/images'+img.url"></el-image>
                    </section>
                </el-form-item>
                <el-form-item v-if="dialogTitle == '服务工单' || dialogTitle == '医生工单'" prop="content" label="服务内容">
                    <el-input v-model="orderDetail.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveReception()" v-if="dialogTitle == '接待记录'" type="primary">{{dialogButtonText}}</el-button>
                    <el-button @click="orderConfirm(2)" v-if="dialogTitle == '服务工单' && commonOrder.status == undefined" type="primary">{{dialogButtonText}}</el-button>
                    <el-button @click="orderConfirm(1)" v-if="dialogTitle == '医生工单' && commonOrder.status == undefined" type="primary">{{dialogButtonText}}</el-button>
                    <el-button @click="orderReconfirm(2)" v-if="dialogTitle == '服务工单' && commonOrder.type == 2 && (commonOrder.status && commonOrder.status == '3')" type="primary">{{dialogButtonText}}</el-button>
                    <el-button @click="orderReconfirm(1)" v-if="dialogTitle == '医生工单' && commonOrder.type == 1 && (commonOrder.status && commonOrder.status == '3')" type="primary">{{dialogButtonText}}</el-button>
                    <el-button @click="hideDialog()" v-if="dialogTitle == '查看工单'" type="primary">{{dialogButtonText}}</el-button>
                    <el-button @click="hideDialog()" type="default">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import ExportExcel from '../common/ExportExcel'

    export default {
        name: "Center",
        components: {
            ExportExcel
        },
        computed: {
            genderFormatter() {
                return this.commonOrder.sex == 1 ? '男': '女';
            },

        },
        data() {
            return {
                dialogButtonText: '确认派单',
                defaultButton: 1,
                orderDetail: {
                    mobile: '',
                    name: 'xxx',
                    content: '',
                    historyOrders: [
                        {
                            name: '111',
                            status: '1',
                            orderTime: '2020-07-11',
                            mobile: '123123123123',
                        },

                        {
                            name: '111',
                            status: '1',
                            orderTime: '2020-07-11',
                            mobile: '123123123123',
                        },

                        {
                            name: '111',
                            status: '1',
                            orderTime: '2020-07-11',
                            mobile: '123123123123',
                        }
                    ],

                },
                doctorOrderDialog: {
                    doctor: '',
                },
                doctorOptions: [],
                receptionDialog: {
                    worker: '',
                    detail: '',
                },
                serviceWorkers: [],
                serviceOrderDialog: {
                    worker: '',
                },
                commonOrder: {
                    id: '',
                    name: '',
                    mobile: '',
                    villageName: '',
                    homeAddress: '',
                    sex: 1,
                    type: '',
                },
                activeName: 'customerService',
                showDialog: false,
                dialogTitle: '服务工单',
                firstTab: {
                    oldManMobile: '',
                    searchDateStart: '',
                    searchDateEnd: '',
                    oldManInfo: {},
                    orderList: [],
                    oldManList: [],
                    workOrderList: [],
                    workOrderPage: {
                        pageNum: 1,
                        pageSize: 10,
                        total: 0
                    },
                    list: [
                        {
                            title: 1,
                            text: '接待次数',
                            total: 20,
                            self: 15,
                            bg: 'blue',
                        },
                        {
                            title: 2,
                            text: '派单次数',
                            total: 20,
                            self: 15,
                            bg: 'pink'

                        },
                        {
                            title: 3,
                            text: '结单次数',
                            total: 20,
                            self: 15,
                            bg: 'red'
                        },
                    ]
                },

                searchForm: {
                    name: '',
                    mobile: '',
                    createTime: '',
                    timeStart: '',
                    timeEnd: '',
                },
                secondTab: {
                    historyWorkOrderList: [],
                    historyWorkOrderPage: {
                        pageNum: 1,
                        pageSize: 10,
                        total: 0
                    },

                },

                thirdTab: {
                    historyReceptionList: [],
                    historyReceptionPage: {
                        pageNum: 1,
                        pageSize: 10,
                        total: 0
                    },
                },
                // 1待接单,2服务中,3已超时,4服务完成,5已结单
                statusMap: ['', '已派单', '服务中', '已超时', '服务完成', '已结单'],
            }

        },


        methods: {
            getLabel(item) {
                if(item.id % 2 == 0) {
                    return item.name + "  休假中"
                } else {
                    return item.name + "  工作中"
                }
            },

            buttonType(item) {
                if(this.defaultButton == item) {
                    return 'primary'
                }
                return 'default'
            },
            statistics(item) {
                let params = {};

                if(item == undefined) {
                    params.type = 1
                } else {
                    if(isNaN(item)) {
                        params.time = item;

                    } else {
                        params.type = item;

                    }
                }
                this.defaultButton = params.type;
                this.$http.get('/apis/callCenter/count', {
                    params: params
                }).then((res) => {
                    this.firstTab.list[0].self = res.data.data.receptionNum
                    this.firstTab.list[0].total = res.data.data.totalReceptionNum
                    this.firstTab.list[1].self = res.data.data.dispatchNum
                    this.firstTab.list[1].total = res.data.data.totalDispatchNum
                    this.firstTab.list[2].self = res.data.data.finishWorkOrderNum
                    this.firstTab.list[2].total = res.data.data.totalFinishWorkOrderNum
                });
            },

            statisticsByDate() {
                let searchParams = {}
                if(this.firstTab.searchDateStart) {
                    searchParams.timeStart = this.firstTab.searchDateStart
                }

                if(this.firstTab.searchDateEnd) {
                    searchParams.timeEnd = this.firstTab.searchDateEnd
                }

                if(!this.firstTab.searchDateEnd && !this.firstTab.searchDateStart) {
                    searchParams.type = 1;
                }
                this.defaultButton = undefined;
                this.$http.get('/apis/callCenter/count', {
                    params: searchParams
                }).then((res) => {
                    this.firstTab.list[0].self = res.data.data.receptionNum
                    this.firstTab.list[0].total = res.data.data.totalReceptionNum
                    this.firstTab.list[1].self = res.data.data.dispatchNum
                    this.firstTab.list[1].total = res.data.data.totalDispatchNum
                    this.firstTab.list[2].self = res.data.data.finishWorkOrderNum
                    this.firstTab.list[2].total = res.data.data.totalFinishWorkOrderNum
                });
            },
            tableRowClassName({row, rowIndex}) {

                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            },


            receptionListShowOrderButton(row) {
                if(row.type && row.status == '3') {
                    return true;
                }
                return false;
            },

            receptionListOrderButtonText(row) {
                return row.type == '1' ? '医生工单' : '服务工单';
            },




            orderReconfirm(type) {
                let data = {
                    workOrderId: this.commonOrder.id,
                    content: this.orderDetail.content,
                }
                if(type == 1) { //1 医生工单
                    data.userId = this.doctorOrderDialog.doctor;
                } else {    //2 服务工单
                    data.userId = this.serviceOrderDialog.worker;
                }
                this.$http.post('/apis/callCenter/reConfirmDispatchWorkOrder', data).then((res) => {
                    this.$message({
                        message: res.data.msg || '操作成功',
                        type: 'success'
                    })
                })
            },

            orderConfirm(type) {
                let data = {
                    oldManId : this.commonOrder.id,
                    type : type,
                    content: this.orderDetail.content
                };
                if(type == 1) { //1 医生工单
                    data.userId = this.doctorOrderDialog.doctor;
                } else {    //2 服务工单
                    data.userId = this.serviceOrderDialog.worker;
                }
                console.log(data);
                this.$http.post('/apis/callCenter/confirmDispatchWorkOrder', data).then((res) => {
                    this.$message({
                        message: res.data.msg || '操作成功',
                        type: 'success'
                    })
                    if(this.activeName == 'customerService') {
                        this.reception();
                    } else if(this.activeName == 'historyWorkOrder') {
                        this.getHistoryWorkOrderList();
                    }
                    this.hideDialog();
                });
            },

            saveReception() {
                let data = {
                    oldManId: this.commonOrder.id,
                    workerId: this.receptionDialog.worker,
                    content: this.receptionDialog.detail,
                }
                this.$http.post('/apis/callCenter/receptionSave', data).then((res) => {
                    this.$message({
                        message: res.data.msg || '操作成功',
                        type: 'success'
                    });
                    this.hideDialog();
                });
            },

            sexFormatter(row) {
                return row.sex == 1 ? '男' : '女';
            },
            getServiceWorkers() {
                // this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/adminApi/service/workers').then(res => {
                this.$http.get('/apis/user/selectList', {
                    params: {
                        userType: 3
                    }
                }).then(res => {
                    this.serviceWorkers = res.data.data.list;
                });
            },

            getDoctorOptions() {
                // this.$http.get('http://rap2.taobao.org:38080/app/mock/262326/adminApi/service/doctors').then(res => {
                this.$http.get('/apis/user/selectList', {
                    params: {
                        userType: 2
                    }
                }).then(res => {
                    this.doctorOptions = res.data.data.list;
                });
            },

            statusFormatter(row) {
                return this.statusMap[row.status];
            },

            terminateOrder(row) {

                this.$confirm('确认结束工单吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/apis/callCenter/finishWorkOrder', {
                        id: row.id
                    }).then((res) => {
                        this.$message({
                            message: res.data.msg || '操作成功',
                            type: 'success'
                        })
                        row.status = 5;
                    })
                }).catch(() => {
                    // do nothing
                })


            },
            receptionOrderClick(row) {
                this.showDialog = true;

                if(row.type == 1) {
                    this.doctorOrder(row)
                } else if(row.type == 2) {
                    this.serviceOrder(row)
                }
                this.getOrderDetail(row.id);

            },
            serviceOrder(row) {
                this.showDialogController();
                this.dialogTitle = '服务工单';
                this.dialogButtonText = '确认派单';
                // this.getServiceWorkers();
                this.commonOrder = row
                this.orderDetail.content = '';
            },

            doctorOrder(row) {
                this.showDialogController();
                this.dialogButtonText = '确认派单';
                this.commonOrder = row
                this.dialogTitle = '医生工单';
                this.orderDetail.content = '';
            },

            receptionRecord(row) {
                this.showDialogController();
                this.dialogButtonText = '保存';
                this.commonOrder = row
                this.receptionDialog.detail = row.content;
                this.dialogTitle = '接待记录';

            },

            orderOperation(row) {
                this.getOrderDetail(row.id);
                if(row.type == 1) {
                    this.doctorOrder(row);
                } else if(row.type == 2) {
                    this.serviceOrder(row);
                }
            },

            orderView(row) {
                this.showDialogController();
                this.getOrderDetail(row.id)
                //this.commonOrder = row;
                this.dialogTitle = '查看工单';
                this.dialogButtonText = '确认';
            },

            getOrderDetail(id) {
                this.$http.get('/apis/callCenter/workOrderDetail', {
                    params: {
                        id: id
                    }
                }).then((res) => {
                    this.commonOrder = res.data.data;
                    this.orderDetail.historyOrders = res.data.data.dispatchList;
                    this.orderDetail.mobile = res.data.data.latestUserMobile;
                    if(res.data.data.type == '1') {
                        this.doctorOrderDialog.doctor = res.data.data.latestUserId;
                    } else if(res.data.data.type == '2') {
                        this.serviceOrderDialog.worker = res.data.data.latestUserId;
                    }
                    this.orderDetail.content = res.data.data.content || '无';
                    this.orderDetail.serviceDetail = res.data.data.serviceDetail.length > 0 ? res.data.data.serviceDetail : [
                        // {
                        //     content: '~~~',
                        //     imgs: [
                        //         'https://static.vecteezy.com/system/resources/previews/000/259/710/original/charts-ui-kit-mobile-element-set-vector.jpg',
                        //         'https://static.vecteezy.com/system/resources/previews/000/259/710/original/charts-ui-kit-mobile-element-set-vector.jpg'
                        //     ]
                        // },
                        //
                        // {
                        //     content: '~~~',
                        //     imgs: [
                        //         'https://static.vecteezy.com/system/resources/previews/000/259/710/original/charts-ui-kit-mobile-element-set-vector.jpg',
                        //         'https://static.vecteezy.com/system/resources/previews/000/259/710/original/charts-ui-kit-mobile-element-set-vector.jpg'
                        //     ]
                        // }
                    ];
                });
            },

            showDialogController() {
                this.showDialog = true;
            },

            hideDialog() {
                this.showDialog = false;
            },
            rowStyle() {
                return {
                    border: 'solid 1px black',
                }
            },
            reception() {
                if(this.firstTab.oldManMobile) {
                    this.$http.get('/apis/callCenter/reception', {
                        params: {
                            mobile: this.firstTab.oldManMobile,
                        }
                    }).then(res => {
                        this.firstTab.oldManList = [res.data.data.oldMan];
                        this.firstTab.workOrderList = res.data.data.list;
                    });
                }
            },

            tabSwitch(tab) {
                this.searchForm = {
                    name: '',
                    mobile: '',
                    createTime: '',
                    timeStart: '',
                    timeEnd: '',
                };
                if(this.activeName == 'customerService') {

                } else if(this.activeName == 'historyWorkOrder') {
                    this.getHistoryWorkOrderList(1);
                } else if(this.activeName == 'historyReception') {
                    this.getHistoryReceptionList(1);
                }
            },



            getHistoryWorkOrderList(currentPage) {
                this.searchForm = this.$common.searchParams(this.searchForm);
                this.$http.get('/apis/callCenter/workerOrderList', {
                    params: Object.assign({
                        pageSize: this.secondTab.historyWorkOrderPage.pageSize,
                        pageNum: currentPage || 1,
                    }, this.searchForm),
                }).then(res => {
                    this.secondTab.historyWorkOrderList = res.data.data.list;
                    this.secondTab.historyWorkOrderPage.total = res.data.data.total;
                    this.secondTab.historyWorkOrderPage.pageSize = res.data.data.pageSize;
                });
            },


            getHistoryReceptionList(currentPage) {
                this.searchForm = this.$common.searchParams(this.searchForm);
                this.$http.get('/apis/callCenter/receptionList', {
                    params: Object.assign({
                        pageSize: this.thirdTab.historyReceptionPage.pageSize,
                        pageNum: currentPage || 1,
                    }, this.searchForm),
                }).then(res => {
                    this.thirdTab.historyReceptionList = res.data.data.list;
                    this.thirdTab.historyReceptionPage.total = res.data.data.total;
                    this.thirdTab.historyReceptionPage.pageSize = res.data.data.pageSize;
                });
            },

            searchList() {
                if(this.activeName == 'historyWorkOrder') {
                    this.getHistoryWorkOrderList(1);
                } else if(this.activeName == 'historyReception') {
                    this.getHistoryReceptionList(1);
                }
            }
        },

        mounted() {
            this.statistics();
            this.getServiceWorkers();
            this.getDoctorOptions();
            // document.getElementById('datePicker').style.width='180px'
            // console.log();
        }
    }
</script>

<style scoped>

    .card-title {
        color: white;
        text-align: left;
        margin-left: 30px;
        margin-top: 20px;
    }

    .self-number-text {
        color: white;
        text-align: left;
        margin-left: 30px;
        margin-top: 10px;
        font-size: 40px;
        font-weight: bold;
    }

    .after-self-number-text{
        font-size: 18px;
    }

    .total-text {
        color: white;
        text-align: left;
        margin-left: 30px;
        margin-top: 20px;
        font-size: 18px;
    }

    .search-form {
        text-align: left; /*让div内部文字居中*/
        background-color: #fff;
        border-radius: 20px;
        margin-top: 20px;
    }


    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .item-col:not(:first-child) {
        margin-left: 10px;
    }

    .blue {
        border-radius: 10px;
        background-image: url("../../assets/img/index/index_item_blue.png");
        /*background-image: url("../../assets/img/index/center_purple.png");*/
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
    }

    .pink {
        background-image: url("../../assets/img/index/center_purple.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        /*background-attachment:fixed;*/
        border-radius: 10px;

    }

    .red {
        background-image: url("../../assets/img/index/index_item_wtf.png");
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center;
        border-radius: 10px;
    }
</style>