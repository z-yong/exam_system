<template>
     <div class="add-stu">
            <div class="add-wrapper">
                <div class="add-title">
                    <p>添加学生信息</p>
                </div>
                <div class="add-box">
                    <div class="single">
                        <p class="add-box-title">根据学生信息单个添加：</p>
                        <el-form :inline="true" :model="formInline" :rules="rules" ref="formInline" label-width="70px" class="demo-form-inline">
                            <el-form-item label="学生姓名" prop="stuName" label-width="100px">
                                <el-input v-model="formInline.stuName" placeholder="请输入试卷标题"></el-input>
                            </el-form-item>
                            <el-form-item label="学号(账号)" prop="id" label-width="100px">
                                <el-input v-model="formInline.id" placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="登录密码" prop="pass" label-width="100px">
                                <el-input v-model="formInline.pass" placeholder="请输入内容"></el-input>
                            </el-form-item>
                            <el-form-item label="班级" prop="classGrade" label-width="100px">
                                <el-select v-model="formInline.classGrade" filterable placeholder="请选择班级" @change='changeClass'>
                                    <el-option v-for="item in classGrades" :key="item.name" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit('formInline')">添加学生</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="to-lead">
                        <p class="add-box-title">批量导入：</p>
                        <!-- http://ksxt.90plus.cn/admin/user/addUserAll -->
                        <el-upload class="upload-demo" drag name='excel' show-file-list multiple :on-success='uploadSucceed'
                                   :on-preview='clickFile' action="http://127.0.0.1/admin/user/addUserAll">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
                        </el-upload>
                    </div>
                </div>
            </div>
        </div>
</template>
<style src='./addStu.css' scoped></style>
<script>
export default {
    data(){
        return {
            formInline: {classGrade: '',pass: '',id: '',stuName: ''},
            rules: {
                stuName: [
                    {required: true, message: '请输入学生姓名',trigger: 'blur'}
                ],
                id: [
                    {required: true, message: '请输入学生学号',trigger: 'blur'}
                ],
                pass: [
                    {required: true, message: '请输入登录密码',trigger: 'blur'}
                ],
                classGrade: [
                    {required: true, message: '请选择班级',trigger: 'blur'}
                ]
            },
            classGrades: [],
            classID: 0
        }
    },
    methods: {
        onSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const data = {
                        user_name: this.formInline.id,
                        real_name: this.formInline.stuName,
                        class_a: this.classID,
                        password: this.formInline.pass,
                    }
                    this.axios.post('/admin/user/addUser',data).then(res =>{
                        if(res.data.code == 200){
                            this.$message({
                                message: '添加成功！您可以继续添加学生',
                                type: 'success'
                            })
                            this.formInline = {classGrade: '',pass: '',id: '',stuName: ''}
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 批量导入学生
        leadStu(){
            this.axios.post('/admin/user/addUserAll').then(res =>{
                console.log(res)
            })
        },
        // 点击已上传的文件
        clickFile(file){
            console.log(file)
        },
        uploadSucceed(response, file, fileList){
            console.log(response,file,fileList)
        },
        changeClass(e){
            this.classID = e;
        }
    },
    created(){
        this.axios.get('/admin/user/getClassAll').then(res =>{
            this.classGrades = res.data.data;
        })
    }
}
</script>