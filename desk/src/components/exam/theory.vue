<template>
    <div class="simu-wrapper">
        <div class="simu-header" id="head" :class="fixed ? 'fixed' : ''">
            <div class="simu-header-box">
                <div>{{title}}</div>
                <div class="count-down">倒计时: {{countDown}}</div>
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
                <div v-if="topicShow && topics.length" class="topic-item">
                    <div class="topic-content-box">
                        <div style="display: flex">
                            <div class="" v-html="topics[currentIndex].title">
                                {{topics[currentIndex].title}}
                            </div>
                            <div style="margin-left:6px">({{topics[currentIndex].fraction}}分)</div>
                        </div>
                        <div class="topic-sub">
                            <div v-if="topics[currentIndex].type == '1'" class="selects">
                                <p class="select-item"><el-radio label="A" v-model="answer[currentIndex].radio" @change="changeRadio(answer[currentIndex].radio)">A</el-radio><span>{{topics[currentIndex].a}}</span></p>
                                <p class="select-item"><el-radio label="B" v-model="answer[currentIndex].radio" @change="changeRadio(answer[currentIndex].radio)">B</el-radio><span>{{topics[currentIndex].b}}</span></p>
                                <p class="select-item"><el-radio label="C" v-model="answer[currentIndex].radio" @change="changeRadio(answer[currentIndex].radio)">C</el-radio><span>{{topics[currentIndex].c}}</span></p>
                                <p class="select-item"><el-radio label="D" v-model="answer[currentIndex].radio" @change="changeRadio(answer[currentIndex].radio)">D</el-radio><span>{{topics[currentIndex].d}}</span></p>
                            </div>
                            <div v-if="topics[currentIndex].type == '2'" class="selects">
                                <el-checkbox-group v-model="answer[currentIndex].check" @change="changeCheck(answer[currentIndex].check)">
                                    <p class="select-item"><el-checkbox label="A"></el-checkbox><span>{{topics[currentIndex].a}}</span></p>
                                    <p class="select-item"><el-checkbox label="B"></el-checkbox><span>{{topics[currentIndex].b}}</span></p>
                                    <p class="select-item"><el-checkbox label="C"></el-checkbox><span>{{topics[currentIndex].c}}</span></p>
                                    <p class="select-item"><el-checkbox label="D"></el-checkbox><span>{{topics[currentIndex].d}}</span></p>
                                    <p v-if="topics[currentIndex].e" class="select-item"><el-checkbox label="E"></el-checkbox><span>{{topics[currentIndex].e}}</span></p>
                                    <p v-if="topics[currentIndex].f" class="select-item"><el-checkbox label="F"></el-checkbox><span>{{topics[currentIndex].f}}</span></p>
                                    <p v-if="topics[currentIndex].g" class="select-item"><el-checkbox label="F"></el-checkbox><span>{{topics[currentIndex].g}}</span></p>
                                    <p v-if="topics[currentIndex].h" class="select-item"><el-checkbox label="F"></el-checkbox><span>{{topics[currentIndex].h}}</span></p>
                                </el-checkbox-group>
                            </div>
                            <div v-if="topics[currentIndex].type == '3'" class="selects">
                                <div v-for="(t) in topics[currentIndex].answer" :key="t" style="margin-top:2vh;width:80%">
                                    <el-input @input="changeGap" type="" placeholder="请输入答案" v-model="answer[currentIndex].gap[t-1]"></el-input>
                                </div>
                            </div>
                            <div v-if="topics[currentIndex].type == '4'" class="selects">
                                <el-input @input="changeJianda" type="textarea" :rows="5" placeholder="请输入答案"
                                          v-model="answer[currentIndex].jianda">
                                </el-input>
                            </div>
                            <p class="difficulty">题型：<span>{{type}}</span></p>
                            <p class="difficulty">难度：<span>{{topics[currentIndex].difficulty}}</span></p>
                        </div>
                    </div>
                </div>
                <div class="shangxia">
                    <div v-if="currentIndex > 0" @click="lastTopic">上一题</div>
                    <div v-if="currentIndex < (len-1)" @click="nextTopic">下一题</div>
                </div>
                <div class="num-box">
                    <div v-for="(num,i) in topics.length" :key="i" @click="selectTopic(i)"
                         :class="currentIndex == i ? 'select' : ''">{{i+1}}</div>
                </div>
                <div class="submit" @click="submitAnswer">提交答卷</div>
            </div>
        </div>
        <!-- 对话框 -->
        <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>{{hint}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="cancelShow" @click="quxiao">取 消</el-button>
                <el-button type="primary" @click='leaveTrue'>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            id: this.$route.params.id, //区分模拟还是正式
            s_id: '',
            dialogVisible: false,
            hint: '考试未结束，无法查看其他页面!',
            timer: '',
            startTime: '',
            endTime: '',
            countDown: '',
            examTime: '',
            fixed: false,
            cancelShow: false,
            topicShow: '',
            title: localStorage.getItem('title'),
            topics: [],
            currentIndex: 0,
            answer: [],
            type: '',
            len: 0,
            isLeave: false,
            allow: false
        }
    },
    methods: {
        quxiao(){
            this.dialogVisible = false;
            setTimeout(() =>{
                this.hint = '考试未结束，无法查看其他页面!'
            },500)
        },
        changeRadio(e){
            this.$forceUpdate();
            const t_id = this.topics[this.currentIndex].id;
            this.axios.post('/index/index/post_answer_a',{user_answer: e,t_id}).then(res =>{
                console.log(res)
            })
        },
        changeCheck(e){
            this.$forceUpdate();
            const t_id = this.topics[this.currentIndex].id;
            this.axios.post('/index/index/post_answer_a',{user_answer: e,t_id}).then(res =>{
                console.log(res)
            })
        },
        changeGap(){
            this.$forceUpdate()
            const t_id = this.topics[this.currentIndex].id;
            const arr = [];
            for(let i = 0; i < this.topics[this.currentIndex].answer; i++){
                if(this.answer[this.currentIndex].gap[i]){
                     arr[i] = this.answer[this.currentIndex].gap[i];
                }else{
                    arr[i] = '';
                }
            }
            this.axios.post('/index/index/post_answer_a',{user_answer: arr,t_id}).then(res =>{
                console.log(res)
            })
        },
        changeJianda(){
            this.$forceUpdate();
            const t_id = this.topics[this.currentIndex].id;
            this.axios.post('/index/index/post_answer_a',{user_answer: this.answer[this.currentIndex].jianda,t_id}).then(res =>{
                console.log(res)
            })
        },
        lastTopic(){
            this.currentIndex --;
            this._changType();
        },
        nextTopic(){
            this.currentIndex ++;
            this._changType();
        },
        selectTopic(index){
            this.currentIndex = index;
            this._changType();
        },
        submitAnswer(){
            if(!JSON.parse(localStorage.getItem('leave'))){
                const minute = localStorage.getItem('minute');
                const seconds = localStorage.getItem('seconds');
                this.hint = `距离考试结束还有${minute}分钟${seconds}秒，确认提交答卷吗？`;
                this.cancelShow = true;
                this.allow = true;
                this.dialogVisible = true;
            }
        },
        leaveTrue(){
            if(this.allow){
                const minute = localStorage.getItem('minute');
                const seconds = localStorage.getItem('seconds');
                let time = 0;
                const examTime = parseInt(this.examTime);
                if(seconds > 0){
                    const min = examTime - minute - 1;
                    time = min*60 + (60 - seconds);
                }else{
                    const min = examTime - minute;
                    time = min*60;
                }
                const data = {
                    s_id:  this.s_id,
                    time
                }
               this.axios.post('/index/index/post_issue_answer_a',data).then(res =>{
                    clearInterval(this.timer);
                    localStorage.clear();
                    localStorage.setItem('leave',true);
                    this.dialogVisible = false;
                    this.isLeave = true;
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this.$router.push({name: 'Index'});
               })
            }else{
                this.dialogVisible = false;
            }
        },
        setInterTime(){
            //判断取值 防止用户刷新
            let minute;
            let seconds ;
            if(localStorage.getItem('seconds')){
                minute = localStorage.getItem('minute');
                seconds = localStorage.getItem('seconds');
            }else{
                minute = parseInt(this.countDown);
                seconds = 0;
                localStorage.setItem('minute',minute);
                localStorage.setItem('seconds',seconds);
            }
            this._changeCountDown(minute,seconds);
        },
        handleClose(){},
        _changType(){
            if(this.topics[this.currentIndex].type == 1){
                this.type = '单选题';
            }else if(this.topics[this.currentIndex].type == 2){
                this.type = '多选题';
            }else if(this.topics[this.currentIndex].type == 3){
                this.type = '填空题';
            }else{
                this.type = '简答题';
            }
        },
        // 设置倒计时
        _changeCountDown(minute,seconds){
            minute = parseInt(minute);
            seconds = parseInt(seconds);
            if(this.timer == ''){
                 this.timer = setInterval(() =>{
                    if(!JSON.parse(localStorage.getItem('leave'))){
                        if(seconds == 0){
                            seconds = 60;
                            minute -= 1;
                        }
                        seconds = seconds - 1;
                        let stringSeconds = seconds;
                        let stringMinute = minute;
                        if(stringSeconds < 10){
                            stringSeconds = '0' + stringSeconds;
                        }
                        if(stringSeconds == 60){
                            stringSeconds = '00';
                        }
                        if(stringMinute < 10){
                            stringMinute = '0' + stringMinute;
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
                            this.dialogVisible = true;
                        }
                    }else{
                        clearInterval(this.timer);
                    }
                },1000)
            }
        },
          _getStartTime(){
            if(!localStorage.getItem('startTime')){
                const date = new Date();
                const endDate = new Date(date.getTime() + parseFloat(this.countDown)*60*1000);
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
                this.startTime = hours + ':' + minutes + ':' + seconds;
                this.endTime = endHours + ':' + endMinutes + ':' + endSeconds;
            }else{
                this.startTime = localStorage.getItem('startTime');
                this.endTime = localStorage.getItem('endTime');
            }
        }
    },
    created(){
        if(this.id == 0){
            const data = {
                zt: 2, jl: 2
            } 
            this.axios.post('/index/index/shijuantimu', data).then(res =>{
                const data = res.data.data;
                this.s_id = data.id;
                this.countDown = data.kssc_time;
                this.examTime = data.kssc_time;
                this.topics = data.condition;
                this.topics.forEach((ele,index) =>{
                    if(ele.type == 1){
                        this.answer[index] = {id:ele.id,radio: ''}
                    }else if(ele.type == 2){
                        this.answer[index] = {id:ele.id,check: []}
                    }else if(ele.type == 3){
                        this.answer[index] = {id:ele.id,gap: []}
                    }else{
                        this.answer[index] = {id:ele.id,jianda: ''}
                     }
                })
                this.len = this.topics.length
                this.topicShow = true;
                this._changType();
                this.setInterTime();
                this._getStartTime();
            })
        }else if(this.id == 1){
            const data = {
                zt: 1, jl: 2
            } 
            this.axios.post('/index/index/shijuantimu', data).then(res =>{
                const data = res.data.data;
                this.s_id = data.id;
                this.countDown = data.kssc_time;
                this.examTime = data.kssc_time;
                this.topics = data.condition;
                this.topics.forEach((ele,index) =>{
                    if(ele.type == 1){
                        this.answer[index] = {id:ele.id,radio: ''}
                    }else if(ele.type == 2){
                        this.answer[index] = {id:ele.id,check: []}
                    }else if(ele.type == 3){
                        this.answer[index] = {id:ele.id,gap: []}
                    }else{
                        this.answer[index] = {id:ele.id,radio: ''}
                    }
                })
                this.len = this.topics.length;
                this.topicShow = true;
                this._changType();
                this.setInterTime();
                this._getStartTime();
            })
        }
    },
    // 离开路由守卫
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        // alert(to.path)
        if(!this.isLeave){
            this.allow = false;
            this.dialogVisible = true;
            next(false);
        }else{
            next();
        }
    },
}
</script>
<style scoped>
    @import './theory.css';
</style>