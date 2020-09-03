<template>
    <section>
        <el-button @click="test">点我</el-button>
    </section>
</template>

<script>

    export default {
        name: "MobileLayout",
        methods: {
            test() {
                alert('this is a test');
            },
        }
    }
</script>

<style scoped>

</style>