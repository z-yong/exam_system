<template>
    <div>
        <textarea :id='id' v-model='tinymceHtml'></textarea>
    </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/paste'
// import 'tinymce/plugins/powerpaste'
import '../../../public/tinymce/zh_CN.js'

export default {
    name:'',
    props:{
        id: {
            type: String,
            required: true
        },
        tinymceHtml: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            init:{
                selector: `#${this.id}`,
                language: 'zh_CN',
                skin_url: '/tinymce/skins/ui/oxide',
                height: 400,
                //插件
                plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu paste',
                //工具栏
                toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
                //隐藏tinymce的标识
                branding: false,
                // 复制图片处理
                end_container_on_empty_block: true,
                powerpaste_word_import: 'propmt',
                powerpaste_html_import: 'propmt',
                powerpaste_allow_local_images: true,
                paste_data_images: true,
                // 上传图片
                // images_upload_handler: (blobInfo, success, failure) => {
                //     const formData = new FormData();
                //     formData.append('filename', blobInfo.blob());
                //     console.log(formData)
                //     this.axios.post('/admin/issue/upload',formData).then(res =>{
                //         if(res.data['code'] == 200){
                //             success(res.data.msg)
                //         }else{
                //             failure('上传失败！')
                //         }
                //     }).catch(() => {
                //         failure('上传出错')
                //     })
                // }
            }
        };
    },
    methods:{
        // changeContent(){
        //     //content 是文本内容
        //     let content = tinymce.get(this.id).getContent()
        //     this.$emit('release',content)
        // }
        getBase64Image(img) {  
            const canvas = document.createElement("canvas");  
            canvas.width = img.width;  
            canvas.height = img.height;  
            const ctx = canvas.getContext("2d");  
            ctx.drawImage(img, 0, 0, img.width, img.height);  
            const ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
            const dataURL = canvas.toDataURL("image/"+ext);  
            return dataURL;  
        }
    },
    mounted () {
        //配置的初始化
        tinymce.init(this.init);
    },
    beforeDestroy() {
        //销毁
        tinymce.get(this.id).destroy();
    }
}
</script>