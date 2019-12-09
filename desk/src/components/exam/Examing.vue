<template>
    <div class="wrapper-examing">
        <z-header :srcPath='path' :isShow='false' :userName='userName'
                  :currentBgColor='bgColor' :currentFontColor='color'></z-header>
        <div class="exam-state-box">
            <div class="exam-state">
                <p>正在考试</p>
            </div>
        </div>
        <div class="card">
            <ul class="card-box">
                <li @click="goToSimu" class="card-item item-left">
                    <div class="card-content">
                        <img src="../../assets/img/enclo.png" alt="">
                        <p>试卷菜单详情</p>
                    </div>
                </li>
                <li class="card-item item-right" @click="goToAnwser">
                    <div class="card-content">
                        <img src="../../assets/img/card.png" alt="">
                        <p>答题卡</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
    .wrapper-examing{
        height: 100%;
        background: #f7f7f7;
    }
    .wrapper-examing .exam-state-box{
        width: 100%;
        height: 6vh;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        background: #fff;
    }
    .wrapper-examing .exam-state{
        width: 60%;
        height: 100%;
        margin: auto;
    }
    .wrapper-examing .exam-state p{
        display: inline-block;
        height: 6vh;
        line-height: 6vh;
        box-sizing: border-box;
        border-bottom: 3px solid #0070d8;
        color: #0070d8;
        font-size: 1em;
        font-weight: 600
    }
    .wrapper-examing .card .card-box{
        width: 60%;
        margin: 6vh auto;
        background: #fff;
        text-align: center
    }
    .card .card-box li{
        position: relative;
        width: 48%;
        height: 70vh;
        background: #fff;
        cursor: pointer;
        user-select: none;
    }
    .card .card-box li p{
        margin-top: 1vh
    }
    .card .card-box .item-left{
        float: left;
    }
    .card .card-box .item-right{
        float: right;
    }
    .wrapper-examing .card .card-box::before
    .wrapper-examing .card .card-box::after{
        display: block;
        content: ''
    }
    .wrapper-examing .card .card-box::after{
        clear: both;
    }
    .wrapper-examing .card .card-box .card-item .card-content{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .wrapper-examing .card .card-box .card-item .card-content p{
        color: #111;
        font-size: 1em;
        font-weight: 600
    }
</style>
<script>
import header from '../com/header'
export default {
    components: {
        "z-header": header
    },
    data(){
        return {
            id: this.$route.params.id, //区分模拟还是正式
            path: require('../../assets/img/userPhoto.png'),
            bgColor: '#0070d8',
            color: '#fff',
            userName: localStorage.getItem('username'),
            time: ''
        }
    }, 
    methods: {
        goToSimu(){
            let enclosure = [];
            let condition = [];
            let id = 0;
            if(this.id == 0){ //模拟技术
                this.axios.get('/index/index/StartExamMn').then(res =>{
                    enclosure = res.data.data.enclosure;
                    this.time = res.data.data.kssc_time;
                    const date = this._getStartTime()
                    condition = JSON.stringify(res.data.data.condition);
                    id = res.data.data.id//{Time: date, indexPath: indexPath[0], id: index, topicID: this.id}
                    const { href } = this.$router.resolve({path: '/index/simu',query: {menuIndex: ["1"],Time: date,indexPath: 1, isMenuShow: true ,enclosure, condition, topicID:id}})
                    window.open(href, '_blank');
               }).catch(err =>{
                    console.log(err)
                }) 
            }else if(this.id == 1){ //正式技术
                this.axios.get('/index/index/StartExam').then(res =>{
                    this.time = res.data.data.kssc_time;
                    const date = this._getStartTime()
                    enclosure = res.data.data.enclosure;
                    condition = JSON.stringify(res.data.data.condition);
                    id = res.data.data.id;
                    const { href } = this.$router.resolve({path: '/index/simu',query: {menuIndex: ["1"],Time: date,indexPath: 1, isMenuShow: true ,enclosure, condition ,topicID:id}})
                    window.open(href, '_blank');
                }).catch(err =>{
                    console.log(err)
                })
            }
        },
        goToAnwser(){
            let condition = [];
            if(this.id == 0){
                this.axios.get('/index/index/StartExamMn').then(res =>{
                    console.log(res)
                    this.time = res.data.data.kssc_time;
                    const date = this._getStartTime();
                    condition = JSON.stringify(res.data.data.condition);
                    const type = 0;
                    const href  = this.$router.resolve({path: '/anwser',query: {Time: date,countDown: this.time,type,condition}});  
                    window.open(href.href, '_blank');
                }).catch(err =>{
                    console.log(err)
                })
            }else if(this.id == 1){
                this.axios.get('/index/index/StartExam').then(res =>{
                    console.log(res)
                    this.time = res.data.data.kssc_time;
                    const date = this._getStartTime();
                    condition = JSON.stringify(res.data.data.condition);
                    const type = 1;
                    const href  = this.$router.resolve({path: '/anwser',query: {Time: date,countDown: this.time,type,condition}});  
                    window.open(href.href, '_blank');
                }).catch(err =>{
                    console.log(err)
                })
            }
        },
        _getStartTime(){
            let startTime = '';
            let endTime = '';
            if(!localStorage.getItem('startTime')){
                const date = new Date();
                const endDate = new Date(date.getTime() + parseFloat(this.time)*60*1000);
                let hours = date.getHours();
                let minutes = date.getMinutes();
                let seconds = date.getSeconds();
                let endHours = endDate.getHours();
                let endMinutes = endDate.getMinutes();
                let endSeconds = endDate.getSeconds();
                if(hours < 10)  hours = '0' + hours
                if(minutes < 10) minutes = '0' + minutes
                if(seconds < 10) seconds = '0' + seconds
                if(endHours < 10) endHours = '0' + endHours
                if(endMinutes < 10) endMinutes = '0' + endMinutes
                if(endSeconds < 10) endSeconds = '0' + endSeconds
                startTime = hours + ':' + minutes + ':' + seconds;
                endTime = endHours + ':' + endMinutes + ':' + endSeconds;
            }else{
                startTime = localStorage.getItem('startTime');
                endTime = localStorage.getItem('endTime');
            }
            console.log(endTime)
            return [startTime,endTime];
        }
    },
    
    created(){
    }
}
</script>