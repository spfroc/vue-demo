<template>
    <div>
        <el-form-item label="选择老人" label-width="100px">
            <el-select @change="getOldManOptions" v-model="form.bindOldMan[index].name" :prop="'oldMan.' + index + '.villageId'" placeholder="请选择">
                <el-option
                        v-for="item in villageOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id+'_'+index">
                </el-option>
            </el-select>
            <el-select v-model="bindOldMan[index].id" :prop="'oldMan.' + index + '.id'" :placeholder="'请选择'+index">
                <el-option
                        v-for="item in oldManOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="亲属关系" label-width="100px">
            <el-input :style="{width:'20%'}" v-model="bindOldMan[index].relation" :prop="'oldMan.' + index + '.relation'"></el-input>
            <el-button @click.prevent="removeOldMan(oldMan)">删除</el-button>
        </el-form-item>
    </div>


</template>

<script>
    export default {
        name: "BindParents",

        props: ['index', 'bindOldMan', 'oldManOptions', 'villageOptions'],

        data() {
            return {
                form: {
                    bindOldMan: [],
                }
            }
        },

        methods: {
            getOldManOptions(mixedParams) {
                let _ = mixedParams.indexOf('_')
                let villageId = mixedParams.substr(0, _);
                let index = mixedParams.substr((_+1));
                this.$http.get('/apis/oldMan/selectList', {
                    params: {
                        villageId: villageId
                    },

                }).then((res) => {
                    this.oldManOptions[index] = res.data.data.list;
                    console.log('index: ' +index);
                    console.log(this.oldManOptions[index]);
                })
            },

            removeOldMan (oldMan) {
                this.bindOldMan.splice(this.bindOldMan.indexOf(oldMan), 1);
            },
        }
    }
</script>

<style scoped>

</style>