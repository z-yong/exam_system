<template>
    <div class="wrapper">
        <div class="header" :style="{background: currentBgColor}">
            <div class="header-content">
                <div class="header-left" :class="isShow ? '' : 'userleft'">
                    <img v-if="isShow" :src='srcPath' alt="">
                    <div v-else class="user-photo">
                        <img :src="srcPath" alt="">
                        <p class="user-name">{{userName}}</p>
                    </div>
                </div>
                <div class="topic-title">{{title}}</div>
                <div class="header-right">
                    <ul>
                        <router-link tag="li" to="/index/content/index-in/0" @click.native='goContent(1)' :style="{color:currentFontColor}">首页</router-link><li class="span">|</li>
                        <!-- <router-link tag="li" to="/index/content/qua/1" :style="{color:currentFontColor}">问题反馈</router-link><li class="span">|</li> -->
                        <router-link tag="li" to="/index/content/personal/2" @click.native='goContent(0)' :style="{color:currentFontColor}">个人中心</router-link>
                        <li class="span">|</li>
                        <li @click='exit' :style="{color:currentFontColor}">退出</li>
                    </ul>
                </div>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>确认退出？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="exitTrue">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<style scoped>
    .wrapper .header{
        width: 100%;
        height: 7vh;
    }
    .wrapper .header .header-content{
        margin: auto;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .wrapper .header .header-content .topic-title{
        font-size: 18px;
        color: #fff
    }
    .header .header-left{
        margin-left: 7vw;
        height: 4vh;
    }
    .header .header-left img{
        height: 100%;
        width: auto;
    }
    .header .header-left.userleft{
        height: 7vh;
    }
    .header .header-left .user-photo{
        height: 6vh;
        line-height: 7vh;
        vertical-align: middle;
        color: #fff;
        text-indent: 1em
    }
    .header .header-left .user-photo img{
        width: auto;
        height: 100%;
        border-radius: 50%;
        vertical-align: middle;
    }
    .header .header-left .user-photo p{
        display: inline-block
    }
    .header .header-right{
        width: 22%;
        margin-right: 1vw
    }
    .header .header-right ul{
        display: flex;
        justify-content: space-evenly;
    }
    .header .header-right ul li{
        font-size: 15px;
        margin: 0 0.2vw;
        cursor: pointer;
    }
    .header .header-right ul .span{
        font-size: 14px;
        color: #ccc
    }
</style>
<script>
export default {
    props: {
        srcPath: {
            type: String,
            required: true
        },
        currentBgColor: {
            type: String,
            required: true
        },
        currentFontColor: {
            type: String,
            required: true
        }, 
        isShow: {
            type: Boolean,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        aloneExit: {
            default: true,
            type: Boolean
        }
    },
    data(){
        return {
            dialogVisible: false,
            title: ''
        }
    },
    methods: {
        goContent(index){
            // 点击最顶部菜单
            this.$emit('personSend',index)
        },
        // 退出
        exit(){
            if(this.aloneExit){
                if(localStorage.getItem('seconds')){
                    this.$message({
                        message: '考试未结束',
                        type: 'error'
                    })
                }else{
                    this.dialogVisible = true;
                }
            }
        },
        // 确认退出
        exitTrue(){
            this.axios.get('/index/login/outLogin').then(res =>{
                if(res.data.code == 200){
                    this.$message({
                        message: res.data.msg
                    })
                    localStorage.clear()
                    this.$router.push('/')
                }
            })
        }
    },
    created(){
        if(localStorage.getItem('title')){
            this.title = localStorage.getItem('title')
        }
    }
}
</script>