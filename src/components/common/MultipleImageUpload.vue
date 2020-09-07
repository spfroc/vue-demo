<template>
    <el-upload
            class="single-image-uploader"
            action="/apis/upload/file"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :data="data"
            :headers="headers"
            :on-success="handleSuccess"
            list-type="picture-card">
        <el-button size="small" type="primary">点击上传~</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
    </el-upload>
</template>

<script>
    export default {
        name: 'MultipleImageUpload',
        props: ['fileList', 'fileListContainer'],

        data() {
            // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            return {
                data: {
                    token: localStorage.getItem('auth-token')
                },
                headers: {
                    token: localStorage.getItem('auth-token')
                },
            };
        },
        methods: {
            handleRemove(file, fileList) {
                // console.log('remove file and fileList and container', file, fileList, this.fileListContainer);
                this.fileListContainer.forEach((f,index) => {
                    console.log('file', file);
                    console.log('f and index', index, f);
                    if(file.name == f.name) {
                        this.fileListContainer.splice(index, 1);
                    }
                })
                console.log('fileListContainer:', this.fileListContainer);
            },
            handlePreview(file) {

            },

            handleSuccess(response, file, list) {
                console.log('response:', response);
                console.log('file:', file);
                console.log('list', list);
                this.fileListContainer.push({
                    name: file.response.data.pic,
                    url: '/images'+file.response.data.pic,
                    path: file.response.data.pic,
                })
                console.log('fileListContainer:' ,this.fileListContainer);
            }
        }
    }
</script>