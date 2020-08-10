<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <el-tabs v-model="activeName" @tab-click="tabSwitch">
                        <el-tab-pane label="信息列表" name="info"></el-tab-pane>
                        <el-tab-pane label="审核列表" name="approval"></el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            <el-col :span="17">
                <div class="grid-content bg-purple">
                    <el-form :inline="true" :model="search" size="mini" class="">
                        <el-form-item label="" prop="name">
                            <el-input v-model="search.name" placeholder="按标题搜索"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="createTime">
                            <el-date-picker
                                    v-model="search.createTime"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="fetchList(1)">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <el-button v-if="activeName=='info'" type="primary" v-on:click="add" size="mini" icon="el-icon-circle-plus">添加</el-button>
                </div>
            </el-col>
        </el-row>
        <template>
            <div>
                <el-table
                        :data="tableData">
                    <el-table-column type="index" label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            align="center"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            prop="nation"
                            align="center"
                            label="民族">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            align="center"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="idCardNumber"
                            align="center"
                            label="活动">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName == 'approval' ? true : false"
                            prop="relation"
                            align="center"
                            label="与老人关系">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName == 'approval' ? true : false"
                            prop="oldManName"
                            align="center"
                            label="老人姓名">
                    </el-table-column>


                    <el-table-column
                            prop="createTime"
                            align="center"
                            label="创建时间">
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            align="center"
                            label="修改时间">
                    </el-table-column>
                    <el-table-column width="250" label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="activeName=='approval'" @click="() => { edit(scope.row) }" type="info" size="mini">详情</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 1) }" type="success" size="mini">通过</el-button>
                            <el-button v-if="showOperationButton(scope.row.status)" @click="() => { operation(scope.row.id, 2) }" type="danger" size="mini">不通过</el-button>
                            <el-button v-if="activeName=='children'" @click="() => { edit(scope.row) }" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button v-if="activeName=='children'" @click="() => { remove(scope.row.id) }" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                        hide-on-single-page
                        background
                        layout="total, prev, pager, next"
                        :page-size="this.page.pageSize"
                        :total="this.page.total"
                        :current-page="this.search.pageNum"
                        @current-change="fetchList"
                >
                </el-pagination>

                <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editing" :append-to-body="true">
                    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                        <el-form-item v-show="form.id" label="ID" prop="id">
                            <el-input :disabled="true" v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name" ></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-select v-model="form.sex" placeholder="请选择">
                                <el-option
                                        v-for="item in genderOptions"
                                        :key="item.value"
                                        :disabled=!canInputEdit
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.mobile"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idCardNumber">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.idCardNumber"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="家庭住址" prop="homeAddress">
                            <el-input
                                    :disabled=!canInputEdit
                                    v-model="form.homeAddress"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="老人姓名" prop="oldManName" v-if="!canInputEdit">
                            <el-input

                                    :disabled=!canInputEdit
                                    v-model="form.oldManName"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="老人身份证号" prop="oldManIdCardNumber" v-if="!canInputEdit">
                            <el-input

                                    :disabled=!canInputEdit
                                    v-model="form.oldManIdCardNumber"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="绑定老人">
                            <section
                                    v-if="form.bindOldManList && form.bindOldManList.length > 0">
                                <el-tag v-for="oldMan in form.bindOldManList"
                                        :closable=true
                                        @close="removeOldMan(oldMan)"
                                        v-bind:key="oldMan.id">{{oldMan.name}}</el-tag>
                            </section>
                            <el-button @click="bindButton" size="small" type="primary">添加绑定</el-button>
                        </el-form-item>

                        <section
                                v-if="bindCount > 0 && activeName == 'children'"
                                v-for="item in bindCount"
                                :key="item"
                                :label="item"
                                :value="item"
                        >
                            <el-form-item label="选择老人" label-width="100px">
                                <el-select v-model="form.sex" placeholder="请选择">
                                    <el-option
                                            v-for="item in genderOptions"
                                            :key="item.value"
                                            :disabled=!canInputEdit
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="form.sex" placeholder="请选择">
                                    <el-option
                                            v-for="item in genderOptions"
                                            :key="item.value"
                                            :disabled=!canInputEdit
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="亲属关系" label-width="100px">
                                <el-input :style="{width:'20%'}" v-model="bindOldMan.relation"></el-input>
                            </el-form-item>
                        </section>
                        <el-form-item>
                            <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
                            <el-button v-if="activeName=='children'" type="primary" @click="onSubmit">确定</el-button>
                            <el-button v-if="showApprovalButton" v-on:click="operation(form.id, 1)" class="el-button--success">通过</el-button>
                            <el-button v-if="showApprovalButton" v-on:click="operation(form.id, 2)" class="el-button--danger">不通过</el-button>
                            <el-button v-on:click="cancel">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Approval",

        data () {
            return {
                activeName: 'info',
                tableData: [],
                search: {},
                page: {},
                form: {

                },
                editing: false,
                isUpdate: false,
            }
        },
    }
</script>

<style scoped>

</style>