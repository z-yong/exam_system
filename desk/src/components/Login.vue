<template>
    <div class="wrapper" @keyup.enter="userLogin">
        <div class="container">
            <div class="header">
                <img src="../assets/img/LOGO.png" alt="">
            </div>
            <div class="content">
                <div class="content-left">
                </div>
                <div class="content-right">
                    <div class="light">
                        <img src="../assets/img/light.png" alt="">
                    </div>
                    <div class="login-content">
                        <p class="welcome">欢 迎 登 陆</p>
                        <p class="please">请使用您本人的账号密码登陆</p>
                        <input type="text" placeholder="输入您的账号" v-model="userID">
                        <input type="password" placeholder="输入您的密码" v-model="password">
                        <!-- <p class="isforget">忘记密码？</p> -->
                        <div class="login-btn" @click="userLogin">登 陆</div>
                        <!-- <p class="isno-id">没有账号？</p> -->
                    </div>
                </div>
            </div>
        </div>
        <!-- <div id="pie" style="width: 600px;height:400px;"></div> -->
    </div>
</template>

<style scoped>
    .wrapper{
        width: 100%;
        height: 100%;
    }
    .wrapper .container{
        width: 60%;
        height: 100%;
        margin: auto;
    }
    .wrapper .header{
        padding: 30px 0;
    }
    .wrapper .content{
        position: relative;
        width: 100%;
        height: 70vh;
        background: #fff;
        box-shadow: 0px 3px 10px #ddd;
        margin-top: 6vh;
        font-size: 0
    }
    .wrapper .container .content-left,
    .wrapper .container .content-right{
        width: 50%;
        height: 100%;
    }
    .container .content .content-left{
        background: url('../assets/img/loginimg.png') no-repeat;
        background-position: center;
        background-size: cover;
        float: left;
    }
    .container .content .content-right{
        float: right;
        font-size: 16px;
    }
    .container .content .content-right .login-content{
        margin: 16vh auto;
        width: 75%;
    }
    .content .content-right .welcome{
        color: #3263ca;
        font-size: 20px;
        word-spacing: 1px;
        font-weight: 600
    }
    .content .content-right .please{
        color: #888;
        font-size: 14px;
        padding: 5px 0;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
    }
    .content .content-right input{
        height: 36px;
        width: 100%;
        text-indent: 0.5em;
        border: 1px solid #ccc;
        margin: 8px 0
    }
    .content .content-right .isforget{
        font-size: 14px;
        color: #3263ca;
        cursor: pointer;
    }
    .content .content-right .login-btn{
        width: 100%;
        height: 36px;
        background: #3263ca;
        color: #fff;
        font-size: 15px;
        text-align: center;
        line-height: 36px;
        border-radius: 20px;
        margin-top: 20px;
        cursor: pointer;
    }
    .content .content-right .isno-id{
        font-size: 15px;
        color: #777;
        margin-top: 20px;
        text-align: center;
        cursor: pointer;
    }
    .wrapper .content::before
    .wrapper .content::after{
        content: "";
        display: block;
    }
    .wrapper .content::after{
        clear: both;
    }
    .content .content-right .light{
        position: absolute;
        top: 0;
        right: 3vw;
    }
</style>
<script>
export default {
    data(){
        return {
            userID: '',
            password:''
            // charts: '',
            // option: {
            //     series : [
            //         {
            //             name: '访问来源',
            //             type: 'pie',
            //             radius: '55%',
            //             data:[
            //                 {value:235, name:'视频广告',itemStyle: {
            //                     color: 'black'
            //                 }},
            //                 {value:274, name:'联盟广告'},
            //                 {value:310, name:'邮件营销'},
            //                 {value:335, name:'直接访问'},
            //                 {value:400, name:'搜索引擎'}
            //             ]
            //         }
            //     ]
            // }
        }
    },
    methods: {
        userLogin(){
            const data = {
                user_name: this.userID,
                password: this.password
            }
            this.axios.post('/index/login/login_do',data).then(res =>{
                if(res.data.code == 200){
                    this.$message({
                        message: '登陆成功',
                        type: 'success'
                    })
                    localStorage.clear()
                    this.$router.push('/index')
                }else if(res.data.code == 400){
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    })
                }
                // this.$router.push('/index')
            }).catch(err =>[
                console.log(err)
            ])
            
        }
    },
    created(){
        // this.$nextTick(() =>{
        //     this.charts = echarts.init(document.getElementById('pie'))
        //     this.charts.setOption(this.option);
        // })
    }
}
</script>