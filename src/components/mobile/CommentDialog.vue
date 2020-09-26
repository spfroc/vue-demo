<template>
    <div class="comment-dialog">
        <div class="comment-dialog-header">
            <div style="float: left;margin-left: 20px;"><strong>评价</strong></div>
            <div style="float: right;color: #C0C4CC;margin-right: 20px;" @click="hideDialog"><span>取消</span></div>
        </div>

        <div>
            <input type="text" v-model="commentContent" placeholder="请输入评价内容" id="commentContentInput">
            <input id="upload_file" type="file" style="display: none;" accept='image/*' name="file" @change="fileChange($event)"/>
            <div class="image-item space" @click="showActionSheet()">
                <div class="image-up"></div>
            </div>
            <div class="upload_warp">
                <div class="upload_warp_img">
                    <div class="upload_warp_img_div" v-if="file.src">
                        <div class="upload_warp_img_div_top" v-if="file.src">
                            <!--<img src="http://114.115.162.39/static/image/x.png" class="upload_warp_img_div_del" @click="fileDel(index)">-->
                            <i @click="fileDel()" class="el-icon-close" style="position: relative;top: -125px;left: 150px;"></i>
                            <img :src="file.src" v-if="file.src" @click="fileClick()" style="display: inline-block;width: 33%">
                        </div>
                    </div>
                    <div class="upload_warp_left" id="upload_warp_left" @click="fileClick()" v-if="!file.src">
                        <!--<img src="../assets/upload.png">-->

                        <i style="width: 100%;font-size: 70px;font-weight: bold;line-height: 120px;margin-left: 25px;" class="el-icon-plus"></i>

                    </div>
                </div>
            </div>


        </div>
        <div class="comment-dialog-footer">
            <el-button style="background-color: #fd7f04;" @click="submitComment">确认</el-button>
        </div>
        <!--<div class="upload_warp_text">-->
        <!--<span>选中{{imgList.length}}张文件，共{{bytesToSize(this.size)}}</span>-->
        <!--</div>-->
    </div>

</template>

<script>
    import JA from 'jquery-ajax'
    import $ from 'jquery'

    export default {
        name: "CommentDialog",
        props: ['form', 'hideDialog', 'submit', 'token', 'url'],
        data() {
            return {
                imgList: [],
                files:[],
                size:0,
                commentContent: '',
                centerDialogVisible: false,
                file: {
                    src: ''
                },
                test: ''
            }
        },

        methods: {
            submitComment() {
                if(this.commentContent == '') {
                    this.$message.error('请输入评价内容');
                    return;
                }
                this.hideDialog();

                this.form.content = this.commentContent
                this.submit();
            },

            //js调用手机相册与相机
            fileClick() {
                $('#upload_file').click();
            },
            //调用手机摄像头并拍照
            getImage() {
                let cmr = plus.camera.getCamera();
                cmr.captureImage(function(p) {
                    plus.io.resolveLocalFileSystemURL(p, function(entry) {
                        compressImage(entry.toLocalURL(),entry.name);
                    }, function(e) {
                        plus.nativeUI.toast("读取拍照文件错误：" + e.message);
                    });
                }, function(e) {
                }, {
                    filter: 'image'
                });
            },
            //从相册选择照片
            galleryImgs() {
                plus.gallery.pick(function(e) {
                    let name = e.substr(e.lastIndexOf('/') + 1);
                    this.test = name;
                    compressImage(e,name);
                }, function(e) {
                }, {
                    filter: "image"
                });
            },
            //点击事件，弹出选择摄像头和相册的选项
            showActionSheet() {
                let bts = [{
                    title: "拍照"
                }, {
                    title: "从相册选择"
                }];
                plus.nativeUI.actionSheet({
                        cancel: "取消",
                        buttons: bts
                    },
                    function(e) {
                        if (e.index == 1) {
                            this.getImage();
                        } else if (e.index == 2) {
                            this.galleryImgs();
                        }
                    }
                );
            },
            fileChange(el) {
                this.files=$("#upload_file").get(0).files;
                // for(let i=0;i<this.files.length;i++){
                // }
                if (!el.target.files[0].size) return;
                this.fileList(el.target);
                el.target.value = ''
            },
            fileList(fileList) {
                let files = fileList.files;
                for (let i = 0; i < files.length; i++) {
                    //判断是否为文件夹
                    if (files[i].type != '') {
                        this.fileAdd(files[i]);
                    } else {
                        //文件夹处理
                        this.folders(fileList.items[i]);
                    }
                }
            },
            //文件夹处理
            folders(files) {
                let _this = this;
                //判断是否为原生file
                if (files.kind) {
                    files = files.webkitGetAsEntry();
                }
                files.createReader().readEntries(function (file) {
                    this.test = file;
                    for (let i = 0; i < file.length; i++) {
                        if (file[i].isFile) {
                            _this.foldersAdd(file[i]);
                        } else {
                            _this.folders(file[i]);
                        }
                    }
                })
            },
            fileAdd(file) {
                //总大小
                console.log('fileAdd', file);
                let fileForm = new FormData();
                fileForm.append('files', file);
                JA.ajax({
                    // url: process.env.APP_HOST + '/appApi/upload/files',
                    url: '/app/upload/files?token='+this.token,
                    type: 'post',
                    data: fileForm,
                    async: true,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: {
                        token: this.token
                    },
                    dataType: "json",
                    params: {token: this.token, test: '12121'},
                    success: (data, textStatus, jqXHR) => {
                        this.form.contentImg = data.data.filesName;
                        this.file.src = '/images' + data.data.filesName;
                        console.log(this.file.src);
                        console.log('formData: ', this.form);

                    },
                })

                //判断是否为图片文件
                if (file.type.indexOf('image') == -1) {
                    file.src = 'wenjian.png';
                    this.imgList.push({
                        file
                    });
                } else {
                    let reader = new FileReader();
                    reader.vue = this;
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        file.src = this.result;
                        this.vue.imgList.push({
                            file
                        });
                    }
                }
            },
            fileDel() {
                // this.size = this.size - this.imgList[index].file.size;//总大小
                // this.imgList.splice(index, 1);
                this.file = {
                    src: ''
                };
            },
            bytesToSize(bytes) {
                if (bytes === 0){
                    return '0 B';
                }
                let k = 1000, // or 1024
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            },
            dragenter(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            dragover(el) {
                el.stopPropagation();
                el.preventDefault();
            },
            drop(el) {
                el.stopPropagation();
                el.preventDefault();
                this.fileList(el.dataTransfer);
            },
            shows(et,tx){
                this.strut=et;
                this.txt=tx;
            },
            handleClick(){
                this.$store.commit('add')
            },
        },
        mounted() {
            console.log('token in store: ', this.$store.getters.token);
            console.log('local storage: ', localStorage);
            console.log(process.env.APP_HOST);
        }
    }
</script>

<style scoped>
    .comment-dialog {
        position: fixed;
        bottom: 0px;
        background-color: white;
        width: 100%;
        height: 300px;
        z-index: 3000;
    }

    #commentContentInput{
        -webkit-appearance: none;
        background-color: #FFF;
        background-image: none;
        border-radius: 4px;
        /*border: 1px solid #DCDFE6;*/
        border: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        -webkit-rtl-ordering: logical;
        cursor: text;
        text-rendering: auto;
        color: initial;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        margin: 0em;
        font: 400 13.3333px Arial;
        -webkit-writing-mode: horizontal-tb !important;
        margin-left: 20px;
    }
    #commentContentInput::-webkit-input-placeholder {
        color: #C0C4CC;
    }
    #commentContentInput:-moz-placeholder {
        color: #C0C4CC;
    }
    #commentContentInput:-ms-input-placeholder {
        color: #C0C4CC;
    }

    .comment-dialog-header{
        margin-top: 20px;
        margin-bottom: 30px;
    }

    .upload_warp_left {
        margin-left: 30px;
        background-color: #C0C4CC;
        width: 120px;
        height: 120px;
        color: white;
        margin-top: 20px;
    }
    .comment-dialog-footer {
        position: relative;
        float: right;
        top: 40px;
    }
</style>