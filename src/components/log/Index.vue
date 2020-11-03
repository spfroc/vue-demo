<template>
    <div class="container">
        <el-row class="">
            <el-col :span="20">
                <el-form :inline="true" :model="search" size="mini" class="">
                    <!--<el-form-item label="" prop="name">-->
                        <!--<el-input v-model="search.name" style="width: 120px;" placeholder="按姓名搜索"></el-input>-->
                    <!--</el-form-item>-->

                    <!--<el-form-item label="" prop="mobile">-->
                        <!--<el-input v-model="search.mobile" style="width: 120px;" placeholder="按手机号搜索"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="工作状态" prop="opType">-->
                        <!--<el-select v-model="search.opType" placeholder="请选择类型">-->
                            <!--<el-option-->
                                    <!--v-for="item in typeOptions"-->
                                    <!--:key="item.opType"-->
                                    <!--:label="item.opTypeDesc"-->
                                    <!--:value="item.opType">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                    <el-form-item label="" prop="timeStart">
                        <el-date-picker
                                v-model="search.timeStart"
                                align="left"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="开始日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>至</el-form-item>
                    <el-form-item label="" prop="timeEnd">
                        <el-date-picker
                                v-model="search.timeEnd"
                                align="left"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4">
                <!--<export-excel url="/export/socialWorker" :params="search"></export-excel>-->
                <!--<el-button type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>-->
            </el-col>
        </el-row>

        <template>
            <div>
                <el-table :data="tableData">
                    <el-table-column type="index" align="center" width="80" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            align="center"
                            label="发生时间">
                    </el-table-column>

                    <el-table-column
                            prop="opTypeDesc"
                            min-width="110"
                            align="center"
                            label="类型">
                    </el-table-column>
                    <el-table-column
                            prop="opContent"
                            min-width="165"
                            align="center"
                            label="变更内容">
                    </el-table-column>

                    <el-table-column
                            prop="opUserName"
                            min-width="150"
                            align="center"
                            label="操作者">
                    </el-table-column>
                    <!--<el-table-column width="250" label="操作">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-button @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>-->
                            <!--<el-button @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" size="mini">删除</el-button>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                </el-table>

                <el-pagination
                    hide-on-single-page
                    background
                    layout="total, prev, pager, next"
                    :page-size="page.pageSize"
                    :total="page.total"
                    :current-page="page.pageNum"
                    @current-change="fetchList"
                >
                </el-pagination>
            </div>
        </template>
    </div>

</template>

<script>
    export default {
        name: "Index",
        props: ['type'],
        data() {
            return {
                typeOptions: [],
                search: {},
                tableData: [],
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                },


            }
        },
        watch: {
            type: function (newType, oldType) {
                this.fetchList(1)
            }
        },
        methods: {
            fetchList(currentPage) {
                currentPage = currentPage || this.page.pageNum;
                this.search.pageNum = currentPage;
                this.$http.get('/apis/opLog/list', {
                    params: this.search
                }).then(res => {
                    this.tableData = res.data.data.list
                    this.page.total = res.data.data.total
                    this.page.pageNum = res.data.data.pageNum;
                })
            },

            getTypeOption() {
                this.$http.get('/apis/opLog/opTypeList').then(res => {
                    this.typeOptions = res.data.data.list;
                });
            }
        },

        mounted() {
            this.fetchList()
            this.getTypeOption();

        },
    }
</script>

<style scoped>

</style>