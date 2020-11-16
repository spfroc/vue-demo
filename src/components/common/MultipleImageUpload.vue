<template>
    <section>
        <el-upload
                class="multiple-image-uploader"
                action="/apis/upload/file"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :data="data"
                :headers="headers"
                :on-success="handleSuccess"
                :limit="3"
                :on-exceed="hideButton"
                list-type="picture-card">
            <el-button ref="btnContainer" size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>

        </el-upload>
        <el-dialog @close="hidePicPreview" :modal="false" :visible.sync="dialogVisible">
            <img width="100%"  :src="dialogImageUrl" alt="">
        </el-dialog>
    </section>
</template>

<script>
    export default {
        name: 'MultipleImageUpload',
        props: ['fileList', 'fileListContainer'],

        data() {
            // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                data: {
                    token: localStorage.getItem('auth-token')
                },
                headers: {
                    token: localStorage.getItem('auth-token')
                },
            };
        },

        methods: {

            hideButton(file, fileList) {
                console.log(file, fileList);
            },
            handleRemove(file, fileList) {
                // console.log('remove file and fileList and container', file, fileList, this.fileListContainer);
                this.fileListContainer.forEach((f,index) => {
                    // console.log('file', file);
                    // console.log('f and index', index, f);
                    if(file.name == f.name) {
                        this.fileListContainer.splice(index, 1);
                    }
                })
                this.checkButton();
                // console.log('fileListContainer:', this.fileListContainer);
            },

            hidePicPreview() {
                this.dialogVisible = false;
                return;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            handleSuccess(response, file, list) {
                this.fileListContainer.push({
                    name: file.response.data.pic,
                    url: '/images'+file.response.data.pic,
                    path: file.response.data.pic,
                })
                this.checkButton()
            },

            checkButton() {
                if (this.fileList.length >= 3) {
                    this.$refs['btnContainer'].$parent.$el.style.display= 'none'
                } else {
                    this.$refs['btnContainer'].$parent.$el.style.display= 'inline-block'
                }
            }
        },

        mounted() {
            this.checkButton();
        }
    }
</script>