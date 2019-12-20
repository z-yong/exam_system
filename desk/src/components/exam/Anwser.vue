<template>
    <div class="answer-wrapper">
        <z-header :srcPath='path' :isShow='false' :userName='userName' :aloneExit='false'
                  :currentBgColor='bgColor' :currentFontColor='color'></z-header>
        <div class="answer-header" id="head" :class="fixed ? 'fixed' : ''">
            <div class="answer-header-box">
                <div class="accessory">
                    答题卡
                </div>
                <span class="count-down">倒计时:{{countDown}}</span>
                <div class="current-state">
                    <div class="start">
                        <p class="start-desc">开始时间</p>
                        <p class="time">{{startTime}}</p>
                    </div>
                    <div class="state">
                        <p class="state-text">状态</p>
                        <p class="state-desc">正在考试</p>
                    </div>
                    <div class="end">
                        <p class="end-desc">结束时间</p>
                        <p class="time">{{endTime}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="topic-box">
            <div class="topic">
                <!-- 题目分类 -->
                <div v-for="(item, index) in topicData" :key="index">
                    <div v-if="item.type == 1" class="topic-item">
                        <div class="topic-content-wrapper">
                            <ul class="topic-content-ul">
                                <li>
                                    <div class="item-mess"><p style="margin-right:1vh;font-weight:600;min-width:1.5vw">{{item.serial}}({{answerData[index].fraction}}分)</p>
                                        <!-- <div v-html="item.title">{{item.title}} </div><span class="span">({{answerData[index].fraction}}分)</span> -->
                                    </div>
                                    <el-radio-group v-model="answerData[index]['user_answer']" @change="changeRadio(answerData[index])">
                                        <el-radio label="A">A</el-radio>
                                        <el-radio label="B">B</el-radio>
                                        <el-radio label="C">C</el-radio>
                                        <el-radio label="D">D</el-radio>
                                    </el-radio-group>
                                    <p class="item-desc" @click="goToSimu(item.id,item.serial)">作业条件{{item.serial}}</p>
                                </li>
                            </ul>
                            <div class="item-line">
                                <img src='../../assets/img/line2.png' alt="">
                            </div>
                        </div>
                    </div>
                    <div v-if="item.type == 2" class="topic-item">
                        <div class="topic-content-wrapper">
                            <ul class="topic-content-ul">
                                <li>
                                    <div class="item-mess"><p style="margin-right:1vh;font-weight:600">{{item.serial}}({{answerData[index].fraction}}分)</p>
                                        <!-- <div v-html="item.title">{{item.title}}</div><span class="span"></span> -->
                                    </div>
                                    <el-checkbox-group v-model="answerData[index]['user_answer']" @change="changeCheck(answerData[index])">
                                        <el-checkbox label="A">A</el-checkbox>
                                        <el-checkbox label="B">B</el-checkbox>
                                        <el-checkbox label="C">C</el-checkbox>
                                        <el-checkbox label="D">D</el-checkbox>
                                        <el-checkbox v-if="topicData[index].e" label="E">E</el-checkbox>
                                        <el-checkbox v-if="topicData[index].f" label="F">F</el-checkbox>
                                        <el-checkbox v-if="topicData[index].g" label="G">G</el-checkbox>
                                        <el-checkbox v-if="topicData[index].h" label="H">H</el-checkbox>
                                    </el-checkbox-group>
                                    <!-- <p class="item-desc" @click="goToSimu(item.id,item.serial)">作业条件{{item.serial}}</p> -->
                                </li>
                            </ul>
                            <div class="item-line">
                                <img src='../../assets/img/line2.png' alt="">
                            </div>
                        </div>
                    </div>
                    <div v-if="item.type == 3" class="topic-item">
                        <div class="topic-content-wrapper">
                            <ul class="topic-content-ul">
                                <li>
                                    <div class="item-mess"><p><p style="margin-right:1vh;font-weight:600">{{item.serial}}({{answerData[index].fraction}}分)</p>
                                        <!-- <div v-html="item.title">{{item.title}}</div><span class="span"></span> -->
                                    </div>
                                    <div v-for="(inp, ii) in topicData[index].answer" :key='ii'>
                                        <input class="gap-anw" type='' placeholder="请输入答案" 
                                           v-model="answerData[index].user_answer[ii]" @input="changeGap(index)"/>
                                    </div>
                                    <p class="item-desc tian" @click="goToSimu(item.id,item.serial)">作业条件{{item.serial}}</p>
                                </li>
                            </ul>
                            <div class="item-line">
                                <img src='../../assets/img/line2.png' alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="submit" @click="submitAnswer">提交答卷</div>
            </div>
        </div>
        <div class="warm" v-if="isShow">
            <el-row>
                <el-col :span="24">
                    <el-card :body-style="{ padding: '20px 0px' }">
                    <img src="../../assets/img/clock.png" class="image">
                    <div style="padding: 14px;">
                        <div class="warm-desc">
                            <p class="time">考试剩余时间<span>10</span>分钟</p>
                            <p class="please">请尽快提交试卷</p>
                            <p class="desc">倒计时为0后系统将自动提交，结束考试</p>
                        </div>
                    </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 对话框 -->
        <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>{{hint}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="cancelShow" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click='leaveTrue'>确 定</el-button>
            </span>
        </el-dialog>
        <!-- 地图 -->
        <z-map></z-map>
    </div>
</template>
<style src='./Anwser.css' scoped>
    
</style>
<script>
import header from '../com/header'
import map from './map'
import { setTimeout } from 'timers'
export default {
    components: {
        "z-header": header,
        "z-map": map
    },
    data(){
        return{
            id: 0,
            path: require('../../assets/img/userPhoto.png'),
            bgColor: '#0070d8',
            fixed: false,
            color: '#fff',
            userName: '',
            countDown: '',
            isShow: false,
            dialogVisible: false,
            cancelShow: true,
            timer: '',
            timer1: '',//定时获取学生答案
            hint: '是否确认提交？',
            allow: false,
            isLeave: false,
            radioTopics: [],
            checkTopics: [],
            gapTopics: [],
            radioData: [],//单选答案
            checkData: [],//多选答案
            gapData: [],//填空答案
            formData: [],//总的答案,
            condition: [],
            anwserMess: {},
            answerData: [],
            topicData: []
        }
    },
    methods: {
        changeRadio(e){
            const data = {t_id: e.t_id, user_answer: e.user_answer};
            this.axios.post('/index/index/post_answer',data).then(res =>{
                console.log(res)
            })  
        },
        changeCheck(e){
            const data = {t_id: e.t_id, user_answer: e.user_answer.join(',')};
            this.axios.post('/index/index/post_answer',data).then(res =>{
                console.log(res)
            })
        },
        changeGap(index){
            const arr = [];
            for(let i = 0; i < this.topicData[index].answer; i++){
                if(this.answerData[index].user_answer[i]){
                     arr[i] = this.answerData[index].user_answer[i];
                }else{
                    arr[i] = '';
                }
            }
            const data = {t_id: this.answerData[index].t_id, user_answer: arr};
            this.axios.post('/index/index/post_answer',data).then(res =>{
                console.log(res)
            })
        },
        submitAnswer(){
            if(!JSON.parse(localStorage.getItem('leave'))){
                const minute = localStorage.getItem('minute');
                const seconds = localStorage.getItem('seconds');
                this.hint = `距离考试结束还有${minute}分钟${seconds}秒，确认提交答卷吗？`;
                this.cancelShow = true;
                this.allow = true;
                this.dialogVisible = true
            }
        },
        goToSimu(id){
            console.log(id)
            let indexi, ii;
            let i = 0;
            for (const item of this.condition) {
                let j = 0;
                for (const el of item.subject) {
                    if(el.id == id){
                        indexi = i;
                        ii = j;
                        break;
                    }
                    j++
                }
                i++
            }
            this._getStartTime()
            const condition = JSON.stringify(this.condition)
            localStorage.setItem('condition',condition)
            const { href } = this.$router.resolve({path: '/index/simu'})
            window.open(href, '_blank');
            localStorage.setItem('i',indexi);
            localStorage.setItem('j',ii);
        },
        leaveTrue(){
           if(this.allow){
                const minute = localStorage.getItem('minute');
                const seconds = localStorage.getItem('seconds');
                let time = 0;
                if(seconds > 0){
                    const min = parseInt(this.anwserMess.countDown) - minute - 1;
                    time = min*60 + (60 - seconds);
                }else{
                    const min = parseInt(this.anwserMess.countDown) - minute;
                    time = min*60
                }
                const data = {
                    s_id: this.id,
                    time,
                }
                this.axios.post('/index/index/post_issue_answer',data).then(res =>{
                    clearInterval(this.timer)
                    clearInterval(this.timer1)
                    localStorage.clear()
                    localStorage.setItem('leave',true)
                    this.isLeave = true;
                    this.dialogVisible = false;
                    this.$router.push({path: '/examend', query: {data: res}})
                    // this.$router.back()
                    // location.href = 'http://localhost:8080/index'
                })
           }else{
               this.dialogVisible = false;
           }
        },
        handleClose(done){
            done()
        },
        _changeCountDown(minute,seconds){
                minute = parseInt(minute);
                seconds = parseInt(seconds);
                this.timer = setInterval(() =>{
                    if(!JSON.parse(localStorage.getItem('leave'))){
                        if(minute == 10 && seconds == 0){
                                this.isShow = true;
                                setTimeout(() =>{
                                    this.isShow = false
                                },20000)
                        }
                        if(seconds == 0){
                            seconds = 60;
                            minute -= 1;
                        }
                        seconds = seconds - 1;
                        let stringSeconds = seconds;
                        let stringMinute = minute
                        if(stringSeconds < 10){
                            stringSeconds = '0' + stringSeconds
                        }
                        if(stringSeconds == 60){
                            stringSeconds = '00'
                        }
                        if(stringMinute < 10){
                            stringMinute = '0' + stringMinute
                        }
                        this.countDown = stringMinute + ':' + stringSeconds;
                        // 每次都要进行存储
                        localStorage.setItem('minute',minute);
                        localStorage.setItem('seconds',seconds);
                        
                        if(minute == 0 && seconds == 0){
                            clearInterval(this.timer);
                            localStorage.clear();
                            this.hint = '时间已到,点击确认提交答卷';
                            this.allow = true;
                            this.cancelShow = false;
                            this.dialogVisible = true;
                        }
                    }else{
                        clearInterval(this.timer)
                    }
                },1000)
        },
        _getStartTime(){
            let startTime = '';
            let endTime = '';
            if(!localStorage.getItem('startTime')){
                const date = new Date();
                const endDate = new Date(date.getTime() + this.countDowmTime*60*1000);
                let hours = date.getHours();
                let minutes = date.getMinutes();
                let seconds = date.getSeconds();
                let endHours = endDate.getHours();
                let endMinutes = endDate.getMinutes();
                let endSeconds = endDate.getSeconds();
                if(hours < 10)  hours = '0' + hours;
                if(minutes < 10) minutes = '0' + minutes;
                if(seconds < 10) seconds = '0' + seconds;
                if(endHours < 10) endHours = '0' + endHours;
                if(endMinutes < 10) endMinutes = '0' + endMinutes;
                if(endSeconds < 10) endSeconds = '0' + endSeconds;
                startTime = hours + ':' + minutes + ':' + seconds;
                endTime = endHours + ':' + endMinutes + ':' + endSeconds;
            }else{
                startTime = localStorage.getItem('startTime');
                endTime = localStorage.getItem('endTime');
            }
            return [startTime,endTime];
        },
        _getInfoData(){
            this.answerData = [];
            const type = this.anwserMess.type;
            const reportID = localStorage.getItem('reportID');
            if(type == 0){//模拟
                this.axios.get('/index/index/datika?id='+reportID).then(res =>{
                    res.data.data.forEach((ele) =>{
                        if(ele.type == 1){
                            this.radioTopics.push(ele)
                        }else if(ele.type == 2){
                            this.checkTopics.push(ele)
                        }else{
                            this.gapTopics.push(ele)
                        }
                    })
                    this.id = res.data.msg;
                    this.radioTopics.forEach((ele) =>{
                        this.radioData.push({t_id: ele.id, user_answer: '', fraction: ele.fraction})
                    })
                    this.checkTopics.forEach((ele) =>{
                        this.checkData.push({t_id: ele.id, user_answer: [], fraction: ele.fraction})
                    })
                    this.gapTopics.forEach((ele) =>{
                        this.gapData.push({t_id: ele.id, user_answer: [], fraction: ele.fraction})
                    })
                    // 不分离
                    this.topicData = res.data.data;
                    this.topicData.forEach((ele) =>{
                        if(ele.type == 1){
                            this.answerData.push({t_id: ele.id, user_answer: '', fraction: ele.fraction})
                        }else if(ele.type == 2){
                            this.answerData.push({t_id: ele.id, user_answer: [], fraction: ele.fraction})
                        }else{
                            this.answerData.push({t_id: ele.id, user_answer: [], fraction: ele.fraction})
                        }
                    })
                })
            }else if(type == 1){//正式
                this.axios.get('/index/index/zsdatika?id='+reportID).then(res =>{
                    res.data.data.forEach((ele) =>{
                        if(ele.type == 1){
                            this.radioTopics.push(ele)
                        }else if(ele.type == 2){
                            this.checkTopics.push(ele)
                        }else{
                            this.gapTopics.push(ele)
                        }
                    })
                    this.id = res.data.msg;
                    this.radioTopics.forEach((ele) =>{
                        this.radioData.push({t_id: ele.id, user_answer: '', fraction: ele.fraction})
                    })
                    this.checkTopics.forEach((ele) =>{
                        this.checkData.push({t_id: ele.id, user_answer: [], fraction: ele.fraction})
                    })
                    this.gapTopics.forEach((ele) =>{
                        this.gapData.push({t_id: ele.id, user_answer: '', fraction: ele.fraction})
                    })
                    // 不分离
                    this.topicData = res.data.data;
                    console.log(this.topicData)
                    this.topicData.forEach((ele) =>{
                        if(ele.type == 1){
                            this.answerData.push({t_id: ele.id, user_answer: '', fraction: ele.fraction})
                        }else if(ele.type == 2){
                            this.answerData.push({t_id: ele.id, user_answer: [], fraction: ele.fraction})
                        }else{
                            this.answerData.push({t_id: ele.id, user_answer: [], fraction: ele.fraction})
                        }
                    })
                     // 获取学生所填答案
                    // this.timer1 = setInterval(() =>{
                    //     this._getAnswer()
                    // },3000)
                })
            }
        },
         _getAnswer(){
            this.axios.post('/index/index/get_answer_cart',{s_id: this.id}).then(res =>{
                const data = res.data.data;
                for (const item of data) {
                    if(item.type == 1){
                        for (const ans1 of this.radioData) {
                            if(ans1.t_id == item.t_id){
                                ans1.user_answer = item.user_answer;
                            }
                        }
                    }else if(item.type == 2){
                        for (const ans2 of this.checkData) {
                            if(ans2.t_id == item.t_id){
                                ans2.user_answer = item.user_answer.split(',')
                            }
                        }
                    }else if(item.type == 3){
                        console.log(item.user_answer)
                        for (const ans3 of this.gapData) {
                            if(ans3.t_id == item.t_id){
                                ans3.user_answer = item.user_answer;
                            }
                        }
                    }
                }
            })
        },
        _getUserName(){
            this.axios.get('/index/index/index').then(res =>{
                this.userName = res.data.data.real_name;
                localStorage.setItem('username',this.userName)
            })
        }
    }, 
    computed: {
        startTime(){
            if(!localStorage.getItem('startTime')){
                localStorage.setItem('startTime',this.anwserMess.Time[0])
            }
            return localStorage.getItem('startTime')
        },
        endTime(){
             if(!localStorage.getItem('endTime')){
                localStorage.setItem('endTime',this.anwserMess.Time[1])
            }
            return localStorage.getItem('endTime')
        }
    },
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        // alert(to.path)
       if(!this.isLeave){
            this.allow = false;
            this.cancelShow = false;
            this.dialogVisible = true;
            this.hint = '考试未结束,无法查看其他页面'
            next(false)
       }
       else{
           next()
       }
    },
    created(){
        localStorage.setItem('leave',false);
        this.anwserMess = JSON.parse(localStorage.getItem('anwserMess'));
        this.countDown = this.anwserMess.countDown;
        this._getInfoData();
        this.condition = JSON.parse(this.anwserMess.condition)
        this.$nextTick(()=>{
            const head = document.getElementById('head');
            const top = head.offsetTop;
            window.addEventListener('scroll',()=>{
                const scrollTop = document.documentElement.scrollTop ||  document.body.scrollTop;
                if(scrollTop >= top){
                    this.fixed = true;
                }else{
                    this.fixed = false
                }
            })
        })
        this._getUserName()
    },
    mounted(){
        let cardMinute;
        let cardSeconds ;
        if(localStorage.getItem('seconds')){
            cardMinute = localStorage.getItem('minute');
            cardSeconds = localStorage.getItem('seconds');
        }else{
            cardMinute = parseInt(this.countDown);
            cardSeconds = 0;
            localStorage.setItem('minute',cardMinute)
            localStorage.setItem('seconds',cardSeconds)
        }
        this._changeCountDown(cardMinute,cardSeconds);

        
    }
}
/**
 * <div v-if="radioTopics.length" class="topic-item">
                    <!-- <div class="item-name">单选题</div> -->
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-for="(dan,di) in radioTopics" :key="di">
                                <div class="item-mess"><p style="margin-right:1vh;font-weight:600;min-width:1.5vw">{{dan.serial}}</p><div v-html="dan.title">{{dan.title}} </div><span class="span">({{radioData[di].fraction}}分)</span></div>
                                <el-radio-group v-model="radioData[di]['user_answer']" @change="changeRadio(radioData[di])">
                                    <el-radio label="A">A</el-radio>
                                    <el-radio label="B">B</el-radio>
                                    <el-radio label="C">C</el-radio>
                                    <el-radio label="D">D</el-radio>
                                </el-radio-group>
                                <p class="item-desc" @click="goToSimu(dan.id,dan.serial)">作业条件{{dan.serial}}</p>
                            </li>
                        </ul>
                        <div class="item-line">
                            <img src='../../assets/img/line2.png' alt="">
                        </div>
                    </div>
                </div>
                <div v-if="checkTopics.length" class="topic-item">
                    <!-- <div class="item-name">多选题</div> -->
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-for="(duo,ui) in checkTopics" :key="ui">
                                <div class="item-mess"><p style="margin-right:1vh;font-weight:600">{{duo.serial}}</p><div v-html="duo.title">{{duo.title}}</div><span class="span">({{checkData[ui].fraction}}分)</span></div>
                                <el-checkbox-group v-model="checkData[ui]['user_answer']" @change="changeCheck(checkData[ui])">
                                    <el-checkbox label="A">A</el-checkbox>
                                    <el-checkbox label="B">B</el-checkbox>
                                    <el-checkbox label="C">C</el-checkbox>
                                    <el-checkbox label="D">D</el-checkbox>
                                    <el-checkbox label="E">E</el-checkbox>
                                    <el-checkbox label="F">F</el-checkbox>
                                </el-checkbox-group>
                                <p class="item-desc" @click="goToSimu(duo.id,duo.serial)">作业条件{{duo.serial}}</p>
                            </li>
                        </ul>
                        <div class="item-line">
                            <img src='../../assets/img/line2.png' alt="">
                        </div>
                    </div>
                </div>
                <div v-if="gapTopics.length" class="topic-item">
                    <!-- <div class="item-name">填空题</div> -->
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-for="(tian,ti) in gapTopics" :key="ti">
                                <div class="item-mess"><p><p style="margin-right:1vh;font-weight:600">{{tian.serial}}</p><div v-html="tian.title">{{tian.title}}</div><span class="span">({{gapData[ti].fraction}}分)</span></div>
                                <textarea class="gap-anw" type='number' placeholder="请输入答案" v-model="gapData[ti]['user_answer']" @input="changeGap(gapData[ti])"></textarea>
                                <p class="item-desc tian" @click="goToSimu(tian.id,tian.serial)">作业条件{{tian.serial}}</p>
                            </li>
                        </ul>
                        <div class="item-line">
                            <img src='../../assets/img/line2.png' alt="">
                        </div>
                    </div>
                </div>
 */
</script>