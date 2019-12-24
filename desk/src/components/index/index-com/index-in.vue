<template>
    <div class="wrapper">
        <div class="exam-box">
            <div class="exam-content">
                <div class="img">
                    <img src="../../../assets/img/simulate.png" alt="">
                </div>
                <p class="title-name">模拟考试</p>
                <!-- <p class="title-desc">根据最新大纲的考察要求为你自动生成的模拟考卷</p> -->
                <div class="exam-data">
                    <p class="" style="white-space: nowrap;">技能卷开考日期：{{examData.mnjn_time || '暂无考试'}}</p>
                    <p class="" style="margin-left:2em;white-space: nowrap;">技能卷名称：{{examData.mnjn_title}}</p>
                    <p class="" style="white-space: nowrap;">理论卷开考日期：{{examData.mnll_time || '暂无考试'}}</p>
                    <p class="" style="margin-left:2em;white-space: nowrap;">理论卷名称：{{examData.mnll_title}}</p>
                </div>
                <div class="btn-box">
                    <div class="action-btn" @click="simuExam">技能测试</div>
                    <div class="action-btn" @click="theroy_mnExam">理论测试</div>
                </div>
            </div>
        </div>
        <div class="exam-box due"> 
            <div class="exam-content">
                <div class="img">
                    <img src="../../../assets/img/exam.png" alt="">
                </div>
                <p class="title-name">正式考试</p>
                <!-- <p class="title-desc">根据最新大纲的考察要求为你自动生成的正式考卷</p> -->
                <div class="exam-data">
                    <p class="" style="white-space: nowrap;">技能卷开考日期：{{examData.zsjn_time || '暂无考试'}}</p>
                    <p class="" style="margin-left:2em;white-space: nowrap;">技能卷名称：{{examData.zsjn_title}}</p>
                    <p class="" style="white-space: nowrap;">理论卷开考日期：{{examData.zsll_time || '暂无考试'}}</p>
                    <p class="" style="margin-left:2em;white-space: nowrap;">理论卷名称：{{examData.zsll_title}}</p>
                </div>
                <div class="btn-box">
                    <div class="action-btn" @click="officialExam">技能测试</div>
                    <div class="action-btn" @click="theroyExam">理论测试</div>
                </div>
            </div>
        </div>
        <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
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
        width: 35%;
        margin: auto;
        text-align: center
    }
    .exam-data{
        text-align: left;
        color: #555;
        margin-top: 1vh;
        margin-left: 1vw;
        font-size: 14px;
    }
    .exam-data p{
        margin-top: 3px;
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
            dialogVisible: false,
            examData: {}
        }
    },
    methods: {
        simuExam(){//模拟技术
            if(localStorage.getItem('exam') && localStorage.getItem('exam') !== 'simu'){
                this.$message({
                    message: `您正在进行${localStorage.getItem('title')}考试`
                })
                return
            }
            const data = { 
                zt: 2, jl: 1
            }
            this.axios.post('/index/index/shijuantimu', data).then(res =>{
                if(res.data.code == 400){
                    this.dialogVisible = true;
                }else{
                    localStorage.setItem('title',res.data.data.title);
                    localStorage.setItem('exam','simu')
                    localStorage.setItem('reportID', res.data.data.id);//成绩id
                    this.$router.push({path: '/examing/0'}); 
                }
            }) 
        },
        officialExam(){  //正式技术 
            if(localStorage.getItem('exam') && localStorage.getItem('exam') !== 'official'){
                this.$message({
                    message: `您正在进行${localStorage.getItem('title')}考试`
                })
                return
            }
            const data = {
                zt: 1, jl: 1
            }
            this.axios.post('/index/index/shijuantimu', data).then(res =>{
                if(res.data.code == 400){
                    this.dialogVisible = true;
                }else{
                    localStorage.setItem('exam','official')
                    localStorage.setItem('title',res.data.data.title);
                    localStorage.setItem('reportID', res.data.data.id);//成绩id
                    this.$router.push({path: '/examing/1'});
                }
            })
        },
        theroy_mnExam(){//模拟理论
            if(localStorage.getItem('exam') && localStorage.getItem('exam') !== 'theroy_mn'){
                this.$message({
                    message: `您正在进行${localStorage.getItem('title')}考试`
                })
                return
            }
            const data = {
                zt: 2, jl: 2
            }
            this.axios.post('/index/index/shijuantimu', data).then(res =>{
                if(res.data.code == 400){
                    this.dialogVisible = true;
                }else{
                    localStorage.setItem('title',res.data.data.issue.title);
                    localStorage.setItem('exam','theroy_mn');
                    this.$router.push({path: '/index/theory/0'});
                }
            })
        },
        theroyExam(){//正式理论
            if(localStorage.getItem('exam') && localStorage.getItem('exam') !== 'theroy'){
                this.$message({
                    message: `您正在进行${localStorage.getItem('title')}考试`
                })
                return
            }
            const data = {
                zt: 1, jl: 2
            } 
            this.axios.post('/index/index/shijuantimu', data).then(res =>{
                if(res.data.code == 400){
                    this.dialogVisible = true;
                }else{
                    localStorage.setItem('title',res.data.data.issue.title);
                    localStorage.setItem('exam','theroy');
                    this.$router.push({path: '/index/theory/1'});
                }
            })
        }
    },
    mounted(){
        this.axios.get('/index/index/index').then(res =>{
            this.examData = res.data.data;
        })
    } 
}
</script>