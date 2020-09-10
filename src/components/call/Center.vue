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
        <el-row v-if="activeName != 'customerService'">
            <el-form :model="searchForm" :inline="true">
                <el-input v-model="searchForm.mobile" style="width: 15%" placeholder="老人手机号"></el-input>
                <el-input v-model="searchForm.name" style="width: 15%" placeholder="老人姓名"></el-input>
                <el-date-picker
                        v-model="searchForm.createTime"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>

                <el-button type="primary" @click="searchList">搜索</el-button>
            </el-form>
        </el-row>
        <el-row v-if="activeName=='customerService'">
            <el-row>
                <el-col :span="12">
                    <el-form>
                        <el-date-picker
                                v-model="firstTab.searchDate"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="statisticsByDate"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form>
                </el-col>
                <el-col :span="12">
                    <div>
                        <el-button @click="statistics(1)" :type="buttonType(1)">本日</el-button>
                        <el-button @click="statistics(2)" :type="buttonType(2)">本周</el-button>
                        <el-button @click="statistics(3)" :type="buttonType(3)">本月</el-button>
                    </div>
                </el-col>

            </el-row>

            <el-row>
                <el-card class="box-card" body-style="padding: 20px 20px 20px 0">
                    <div v-for="o in firstTab.list" :key="o.title" class="text item">
                        <div class="card-title">{{o.text}}</div>
                        <div class="card-value"><span class="number-value">{{o.self}}</span><span class="number-unit">本人</span>/<span  class="number-value">{{o.total}}</span><span  class="number-unit">总计</span></div>
                        <div class="bottom-text" v-if="o.title == 1">接单详情</div>
                        <div class="bottom-text" v-if="o.title == 3">历史工单列表</div>
                    </div>
                </el-card>
            </el-row>
            <el-row style="height: 200px">
                <el-form class="search-form">
                    <el-input v-model="firstTab.oldManMobile" style="width: 20%" placeholder="老人手机号"></el-input>

                    <el-button @click="reception">接待</el-button>
                </el-form>
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
                            align="center"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="idCardNumber"
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
                            width="100"
                    >
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
                            label="下单时间"
                            align="center"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="endTime"
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
                            width="100"
                    >
                        <template slot-scope="scope">
                            <div style="float: left">
                                <el-button style="float: left" @click="() => { orderView(scope.row) }" size="mini">查看工单</el-button>
                                <el-button style="margin: 10px 0 0 0" @click="receptionOrderClick(scope.row)" v-if="receptionListShowOrderButton(scope.row)" type="primary" size="mini">{{receptionListOrderButtonText(scope.row)}}</el-button>
                                <el-button v-if="scope.row.status != '2' && scope.row.status != '5'" style="margin: 10px 0 0 0" @click="() => { terminateOrder(scope.row) }" type="primary" size="mini">结束工单</el-button>
                            </div>

                        </template>
                    </el-table-column>
                </el-table>
                <!--<el-pagination-->
                        <!--hide-on-single-page-->
                        <!--background-->
                        <!--layout="total, prev, pager, next"-->
                        <!--:page-size="this.firstTab.workOrderPage.pageSize"-->
                        <!--:total="this.firstTab.workOrderPage.total"-->
                        <!--:current-page="this.firstTab.workOrderPage.pageNum"-->
                        <!--@current-change="getWorkOrderList"-->
                <!--&gt;-->
                <!--</el-pagination>-->


            </el-row>
        </el-row>
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
                        align="center"
                        label="手机号">
                </el-table-column>
                <el-table-column
                        prop="idCardNumber"
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
                        width="100"
                >
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
                    @current-change="getHistoryWorkOrderList"
            >
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
                        align="center"
                        label="手机号">
                </el-table-column>
                <el-table-column
                        prop="idCardNumber"
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
                        align="center"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop=""
                        label=""
                        align="center"
                        width="100"
                >
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
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dialogTitle == '服务工单'">
                    <el-input type="hidden" v-model="commonOrder.type" value="2"></el-input>
                </el-form-item>
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
                <el-form-item v-if="dialogTitle == '查看工单'" prop="" label="历史派单">
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
                    <section v-for="(detail, index) in orderDetail.serviceDetail" :key="index">
                        <div>
                            <span>{{detail.content}}</span>
                        </div>
                        <el-image v-for="(img, index) in detail.imgs" v-if="img.url.length > 0"
                              :key="index"
                              style="width: 100px; height: 100px; margin-right: 10px;"
                              :src="'/images'+img.url"></el-image>
                    </section>
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveReception()" v-if="dialogTitle == '接待记录'" type="primary">{{dialogButtonText}}</el-button>
                    <el-button @click="orderConfirm(2)" v-if="dialogTitle == '服务工单' && commonOrder.status == undefined" type="primary">{{dialogButtonText}}-新</el-button>
                    <el-button @click="orderConfirm(1)" v-if="dialogTitle == '医生工单' && commonOrder.status == undefined" type="primary">{{dialogButtonText}}-新</el-button>
                    <el-button @click="orderReconfirm(2)" v-if="dialogTitle == '服务工单' && commonOrder.type == 2 && (commonOrder.status && commonOrder.status == '3')" type="primary">{{dialogButtonText}}-改</el-button>
                    <el-button @click="orderReconfirm(1)" v-if="dialogTitle == '医生工单' && commonOrder.type == 1 && (commonOrder.status && commonOrder.status == '3')" type="primary">{{dialogButtonText}}-改</el-button>
                    <el-button @click="hideDialog()" v-if="dialogTitle == '查看工单'" type="primary">{{dialogButtonText}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Center",

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
                    searchDate: '',
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
                            self: 15
                        },
                        {
                            title: 2,
                            text: '派单次数',
                            total: 20,
                            self: 15
                        },
                        {
                            title: 3,
                            text: '结单次数',
                            total: 20,
                            self: 15
                        },
                    ]
                },

                searchForm: {
                    name: '',
                    mobile: '',
                    createTime: '',
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
            buttonType(item) {
                console.log('~~~', this.defaultButton, item);
                if(this.defaultButton == item) {
                    return 'primary'
                }
                return 'default'
            },
            statistics(item) {
                console.log(2343242);
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

            statisticsByDate(item) {

                this.defaultButton = undefined;
                this.$http.get('/apis/callCenter/count', {
                    params: {
                        time: item
                    }
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
                    console.log(rowIndex);
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    console.log(rowIndex);
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




            orderReconfirm(userId) {
                console.log('this is 重新派单');
                let data = {
                    workOrderId: this.commonOrder.id,
                    userId: userId || 1
                }
                this.$http.post('/apis/callCenter/reConfirmDispatchWorkOrder', data).then((res) => {
                    console.log(res);
                    this.$message({
                        message: res.data.msg || '操作成功',
                        type: 'success'
                    })
                })
            },

            orderConfirm(type) {
                console.log('this is order type: ', type, this.commonOrder, this.serviceOrderDialog, this.doctorOrderDialog);
                let data = {
                    oldManId : this.commonOrder.id,
                    type : type
                };
                if(type == 1) { //1 医生工单
                    data.userId = this.doctorOrderDialog.doctor;
                } else {    //2 服务工单
                    data.userId = this.serviceOrderDialog.worker;
                }

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
                console.log(this.commonOrder);
                console.log(row);
            },

            doctorOrder(row) {
                this.showDialogController();
                this.dialogButtonText = '确认派单';
                this.commonOrder = row
                this.dialogTitle = '医生工单';

            },

            receptionRecord(row) {
                this.showDialogController();
                this.dialogButtonText = '保存';
                this.commonOrder = row
                console.log(row);
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
                    console.log(res.data.data);
                    this.commonOrder = res.data.data;
                    this.orderDetail.historyOrders = res.data.data.dispatchList;
                    this.orderDetail.mobile = res.data.data.latestUserMobile;
                    if(res.data.data.type == '1') {
                        this.doctorOrderDialog.doctor = res.data.data.latestUserId;
                    } else if(res.data.data.type == '2') {
                        this.serviceOrderDialog.worker = res.data.data.latestUserId;
                    }
                    console.log(res.data.data.serviceDetail.length);
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
                console.log(this.firstTab.oldManMobile);
                if(this.firstTab.oldManMobile) {
                    this.$http.get('/apis/callCenter/reception', {
                        params: {
                            mobile: this.firstTab.oldManMobile,
                        }
                    }).then(res => {
                        console.log(res.data.data.list);
                        this.firstTab.oldManList = [res.data.data.oldMan];
                        // console.log(res.data.data.list);
                        this.firstTab.workOrderList = res.data.data.list;
                    });
                }
            },

            tabSwitch(tab) {
                console.log(this.activeName);
                this.searchForm = {
                    name: '',
                    mobile: '',
                    createTime: '',
                };
                console.log(this.activeName);
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
                    if(this.searchForm.timeStart && this.searchForm.timeEnd) {
                        this.searchForm.createTime = [];
                        this.searchForm.createTime.push(this.searchForm.timeStart);
                        this.searchForm.createTime.push(this.searchForm.timeEnd);
                    }
                    // this.secondTab.historyWorkOrderPage.pageNum = res.data.data.pageNum;
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
                    if(this.searchForm.timeStart && this.searchForm.timeEnd) {
                        this.searchForm.createTime = [];
                        this.searchForm.createTime.push(this.searchForm.timeStart);
                        this.searchForm.createTime.push(this.searchForm.timeEnd);
                    }
                    // this.secondTab.historyWorkOrderPage.pageNum = res.data.data.pageNum;
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
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin: 0 20px 0 0;
        float: left;
        border: solid lightgray 1px;
        height: 150px;
        width: 360px;
    }

    .card-value {
        margin-top: 15px;
        font-size: 30px;
    }

    .card-title {
        font-size: 8px;
        color: gray;
        text-align: left;
        margin-left: 10px;
        margin-top: 10px;
    }

    .box-card {
        width: 100%;
        margin-bottom: 10px;
        text-align: center;
        padding: 20px 20px 20px 0;
    }

    .search-form {
        text-align: center; /*让div内部文字居中*/
        background-color: #fff;
        border-radius: 20px;
        width: 80%;
        /*height: 350px;*/
        margin: 50px auto;
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .number-unit {
        font-size: 8px;
    }

    .number-value {
        font-size: 50px;
        font-weight: bolder;
    }

    .bottom-text {
        font-size: 8px;
        text-align: left;
        color: gray;
        position: relative;
        /*margin-left: 10px;*/
        top: 20px;
        left: 10px;
        /*margin-bottom: 10px;*/
    }

    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>