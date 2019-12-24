<template>
    <div class="wrapper-login"  @keyup.enter="submitForm('ruleForm')">
        <div class="login">
            <p class="title-login">用户登录</p>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="" prop="username">
                    <span class="iconfont">&#xe664;</span>
                    <el-input placeholder="请输入用户名" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="" prop="pass">
                    <span class="iconfont">&#xe65d;</span>
                    <el-input placeholder="请输入密码" type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <div class="mess-box">
                    <el-checkbox v-model="checked">记住密码</el-checkbox>
                    <p class="forget" @click="forgetPass">忘记密码？</p>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="提交审核" :visible.sync="dialogFormVisible" :width="dialogWidth">
            <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
    .wrapper-login{
        position: relative;
        width: 100%;
        height: 100%;
        background: url('../assets/img/loginBg.png') no-repeat;
        background-position: center;
        background-size: cover;
        text-align: center;
        
    }
    .wrapper-login .login{
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translate(-50%,0);
        width: 500px;
        height: 400px;
        background: #fff;
        border-radius: 8px
    }
    .wrapper-login .login .title-login{
        font-size: 15px;
        font-weight: 600;
        margin: 5vh 0 4vh;
    }
    .wrapper-login .login .mess-box{
        width: 70%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
    }
    .wrapper-login .login .mess-box .forget{
        cursor: pointer;
        user-select: none;
    }
    .wrapper-login .login .el-form-item__content .el-button{
        width: 100%;
        margin-top: 5vh
    }
    
</style>

<script>
export default {
    data(){
        var validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                username: '',
                pass: ''
            },
            rules: {
                username: [{ validator: validateUsername, trigger: 'blur' }],
                pass: [{ validator: validatePass, trigger: 'blur' }]
            },
            checked: false,
            dialogFormVisible: false,
            dialogWidth: '30vw',
            formLabelWidth: '3vw',
            form: { name: '',phone: ''}
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                const data = {
                    admin_name: this.ruleForm.username,
                    admin_pwd: this.ruleForm.pass
                }
                this.axios.post('/admin/login/adminLogin',data).then(res =>{
                   if(res.data.code == 200){
                        if(this.checked){
                            localStorage.setItem('username',res.data.data.admin_name);
                            localStorage.setItem('password',res.data.data.admin_pwd);
                        }else{
                            localStorage.removeItem('username');
                            localStorage.removeItem('password');
                        }
                        this.$router.push('/index');
                        this.$message({
                            message: '登录成功',
                            type: 'success'
                        })
                   }else{
                       this.$message({
                            message: res.data.msg,
                            type: 'error'
                        })
                   }
                }).catch(err =>{
                    console.log(err)
                })
               
            } else {
                console.log('error submit!!');
                return false; 
            }
            });
        },
        forgetPass(){
            this.dialogFormVisible = true;
        },
        // 获取用户是否保存登录信息
        _getUserMess(){
            if(localStorage.getItem("password")){
                this.ruleForm.username = localStorage.getItem("username");
                this.ruleForm.pass = localStorage.getItem("password")
            }
        },
    },
    created(){
        this._getUserMess()
    }
}
</script>