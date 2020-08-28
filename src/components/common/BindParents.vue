<template>
    <div>
        <el-form-item :label="label" label-width="100px">
            <el-select @change="getOldManOptions" v-model="bindOldMan[index].villageId" :prop="'oldMan.' + index + '.villageId'" placeholder="请选择">
                <el-option
                        v-for="item in villageOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="bindOldMan[index].id" :prop="'oldMan.' + index + '.id'" :placeholder="'请选择'+index">
                <el-option
                        v-if="oldManOptions"
                        v-for="item in oldManOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="亲属关系" label-width="100px">
            <el-input :style="{width:'20%'}" v-model="bindOldMan[index].relation" :prop="'oldMan.' + index + '.relation'"></el-input>
            <el-button @click.prevent="removeOldMan(index)">删除</el-button>
        </el-form-item>

    </div>
</template>

<script>
    export default {
        name: "BindParents",
        props: ['bindOldMan', 'index', 'villageOptions'],
        data() {
            return {
                oldManOptions: [],
            }
        },

        computed: {
            label() {
                return '选择老人'
            }
        },
        methods: {
            getOldManOptions(villageId) {
                this.$http.get('/apis/oldMan/selectList', {
                    params: {
                        villageId: villageId,
                        time: Math.random()
                    },

                }).then((res) => {
                    this.oldManOptions = res.data.data.list;

                })
            },

            removeOldMan (index) {
                this.bindOldMan.splice(index, 1);
            },
        },

        mounted() {
            if(this.bindOldMan[this.index].villageId) {
                console.log('villageId', this.bindOldMan[this.index].villageId);
                this.getOldManOptions(this.bindOldMan[this.index].villageId)
            }

        }
    }
</script>

<style scoped>

</style>