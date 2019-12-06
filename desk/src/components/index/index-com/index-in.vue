<template>
    <div class="wrapper">
        <div class="exam-box">
            <div class="exam-content">
                <div class="img">
                    <img src="../../../assets/img/simulate.png" alt="">
                </div>
                <p class="title-name">模拟考试</p>
                <p class="title-desc">根据最新大纲的考察要求为你自动生成的模拟考卷</p>
                <div class="btn-box">
                    <div @click="simuExam" class="action-btn">技术测试</div>
                    <div class="action-btn">理论测试</div>
                </div>
            </div>
        </div>
        <div class="exam-box due">
            <div class="exam-content">
                <div class="img">
                    <img src="../../../assets/img/exam.png" alt="">
                </div>
                <p class="title-name">正式考试</p>
                <p class="title-desc">根据最新大纲的考察要求为你自动生成的正式考卷</p>
                <div class="btn-box">
                    <div @click="officialExam" class="action-btn">技术测试</div>
                    <div class="action-btn">理论测试</div>
                </div>
            </div>
        </div>
        <el-dialog
            title="温馨提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>暂无考试!</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click='dialogVisible = false'>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style scoped>
    .wrapper{
        width: 100%;
        height: 100%;
    }
    .wrapper .exam-box{
        width: 90%;
        margin-left: 2vw;
        padding: 7vh 0;
        border: 1px solid #ddd;
        background: #fff;
    }
    .wrapper .exam-box .exam-content{
        width: 50%;
        margin: auto;
        text-align: center
    }
    .exam-content .img img{
        width: 60px;
        height: 60px;
    }
    .exam-content .title-name{
        font-size: 15px;
        font-weight: 600;
        color: #444;
        margin-top: 10px;
    }
    .exam-content .title-desc{
        font-size: 11px;
        color: #888;
        margin-top: 8px;
    }
    .btn-box{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2vh auto 0
    }
    .exam-content .action-btn{
        padding: 3px 0;
        width: 6vw;
        height: 3vh;
        color: #333;
        font-size: 14px;
        text-align: center;
        line-height: 3vh;
        border: 1px solid #0070d8;
        background: #e7f1f9;
        border-radius: 20px;
        user-select: none;
        cursor: pointer;
    }
    .exam-content .action-btn:nth-child(2){
        margin-left: 2vw
    }
    .wrapper .exam-box.due{
        margin-top: 3vh;
    }.exam-box.due .exam-content .action-btn{
        border: 1px solid #ffa200;
        background: #fff8ea;
    }
</style>
<script>
export default {
    data(){
        return {
            dialogVisible: false
        }
    },
    methods: {
        simuExam(){
            this.axios.get('/index/index/shijuantimu?zt=2').then(res =>{
                if(res.data.code == 400){
                    this.dialogVisible = true;
                }else{
                    localStorage.setItem('title',res.data.msg);
                    this.$router.push({path: '/examing/0',});
                }
            })
        },
        officialExam(){    
            this.axios.get('/index/index/shijuantimu?zt=1').then(res =>{
                if(res.data.code == 400){
                    this.dialogVisible = true;
                }else{
                    localStorage.setItem('title',res.data.msg);
                    this.$router.push({path: '/examing/1'});
                }
            })
        }
    }
}
</script>