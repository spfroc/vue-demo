<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>

  const defaultContent = `<h2 style="text-align: center;">请在这里输入标题</h2><p>&nbsp; &nbsp; &nbsp; 这是第一个自然段。请替换为您的内容。可以设置<span style="font-weight: bold;">黑体</span>、<span style="font-style: italic;">斜体</span>、<span style="text-decoration-line: underline;">下划线</span>及<span style="text-decoration-line: line-through;">删除线</span>。您还可以设置<span style="color: rgb(249, 150, 59);">字体颜色</span>、<span style="background-color: rgb(249, 150, 59);">背景色</span>等。支持插入emoji表情😄😄。</p><p><br></p><p>可以插入有序列表：</p><ol><li>有序列表项目</li><li>有序列表项目</li><li>有序列表项目</li></ol><p>可以插入无序列表：</p><ul><li>无序列表项目</li><li>无序列表项目</li><li>无序列表项目</li></ul><p>您可以在任何地方<a href="http://bing.com/" target="_blank">插入链接</a>。</p><p><br></p><p></p><p>还可以插入图片：</p><p style="text-align: center;"><img src="http://thumb.takefoto.cn/wp-content/uploads/2019/04/201904080619552096-680x448.jpg"></p>`

  import E from 'wangeditor'
  export default {
    name: 'editor',
    data () {
      return {
        editor: null,
        info_: null,
        valued: false
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      isClear: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isClear (val) {
        // 触发清除文本域内容
        if (val) {
          this.editor.txt.clear()
          this.info_ = null
        }
      },
      value (val) {
        console.log(val);
        if (val != this.info_) {
          const isEmpty = !(val || '').replace(/<(\/)?[\w\s]+>/g, '')
          this.editor.txt.html(isEmpty ? defaultContent : this.removeWordXml(val))
        }
        this.valued = true
      }
    },
    mounted () {
      this.setEditor()
      this.editor.txt.html(this.value)

      setTimeout(() => {
        const isEmpty = !(this.value || '').replace(/<(\/)?[\w\s]+>/g, '')

        if (!this.valued && isEmpty) {
          this.editor.txt.html(defaultContent)
          this.valued = true
        }
      }, 1000)
    },
    methods: {

      getHtml() {
        console.log(this.editor.txt.html());

      },

      removeWordXml(text){
        let html = text;
        html = html.replace(/<\/?SPANYES[^>]*>/gi, "");//  Remove  all  SPAN  tags
        html = html.replace(/<(\w[^>]*)  class=([^|>]*)([^>]*)/gi, "<$1$3");  //  Remove  Class  attributes
        html = html.replace(/<(\w[^>]*)  style="([^"]*)"([^>]*)/gi, "<$1$3");  //  Remove  Style  attributes
        html = html.replace(/<(\w[^>]*)  lang=([^|>]*)([^>]*)/gi, "<$1$3");//  Remove  Lang  attributes
        html = html.replace(/<\\?\?xml[^>]*>/gi, "");//  Remove  XML  elements  and  declarations
        html = html.replace(/<\/?\w+:[^>]*>/gi, "");//  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
        html = html.replace(/&nbsp;/, "");//  Replace  the  &nbsp;
        html = html.replace(/\n(\n)*( )*(\n)*\n/gi, '\n');
         // Transform  <P>  to  <DIV>
        // let  re  =  new  RegExp("(<P)([^>]*>.*?)(<//P>)","gi")  ;            //  Different  because  of  a  IE  5.0  error
        //    html = html.replace(re, "<div$2</div>");
        this.editor.txt.html(html);
      },
      setEditor () {
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)

        this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
        this.editor.customConfig.uploadImgServer = '/apis/upload/file?token='+localStorage.getItem('auth-token')// 配置服务器端地址
        this.editor.customConfig.uploadImgHeaders = {
        }// 自定义 header
        this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024 // 将图片大小限制为 5M
        this.editor.customConfig.uploadImgMaxLength = 10 // 限制一次最多上传 10 张图片
        this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        this.editor.customConfig.pasteFilterStyle = false;
        this.editor.customConfig.fontNames = [
          '黑体',
          '宋体',
          '仿宋_GB2312',
          '楷体',
          '隶书',
        ]
        // 配置菜单
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          'table', // 表格
          'video', // 插入视频
          'code', // 插入代码
          'undo', // 撤销
          'redo' // 重复
        ]

        this.editor.customConfig.uploadImgHooks = {
          fail: (xhr, editor, result) => {
            // 插入图片失败回调
          },
          success: (xhr, editor, result) => {
            // 图片上传成功回调
          },
          timeout: (xhr, editor) => {
            // 网络超时的回调
          },
          error: (xhr, editor) => {
            // 图片上传错误的回调
          },
          customInsert: (insertImg, result, editor) => {
            // 图片上传成功，插入图片的回调
            insertImg('/images'+result.data.pic);
          }
        }
        this.editor.customConfig.onchange = (html) => {
          this.info_ = html // 绑定当前逐渐地值
          this.$emit('change', this.info_) // 将内容同步到父组件中
        }

        // 创建富文本编辑器
        this.editor.create()
      }
    }
  }
</script>

<style lang="css">
  .editor {
    width: 100%;
    margin: 0 auto;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    height: 500px;
  }

  .w-e-toolbar {
    flex-wrap: wrap !important;
  }


  /*.w-e-menu:hover {*/
    /*z-index: 10002 !important;*/
  /*}*/

  .w-e-menu{
    z-index: 2 !important;
  }
  .w-e-text-container{
    z-index: 1 !important;
  }
</style>
