<template>
    <el-upload
            class="single-image-uploader"
            action="/apis/adminApi/fileUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="handleSuccess"
            list-type="picture-card">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
    </el-upload>
</template>

<script>
    export default {
        name: 'MultipleImageUpload',
        props: ['fileList', 'addFile', 'removeFileList'],

        data() {
            // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            return {};
        },
        methods: {
            handleRemove(file, fileList) {
                this.removeFileList(file)
            },
            handlePreview(file) {
                console.log(file);
                this.addFile(file)
            },

            handleSuccess(response, file, list) {

                console.log(111);
                this.addFile(list)
            }
        }
    }
</script>