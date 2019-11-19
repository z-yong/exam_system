<template>
    <div class="simu-wrapper">
        <div class="simu-header" id="head" :class="fixed ? 'fixed' : ''">
            <div class="simu-header-box">
                <div class="accessory">
                    <ul>
                        <li @click="clickTopMenu(index)" v-for="(item,index) in menuList" :key="index"
                            :class="currentIndex == index ? 'active-menu' : ''">
                            {{item}}
                        </li>
                    </ul>
                </div>
                <div class="count-down">{{countDown}}</div>
                <div class="current-state">
                    <div class="start">
                        <p class="start-desc">开始时间</p>
                        <p class="time">{{startTime}}</p>
                    </div>
                    <div class="state">
                        <p class="state-text">状态</p>
                        <p class="state-desc">未考</p>
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
                <div class="topic-item">
                    <div class="item-name">{{itemTitle}}{{type == '3' ? index+' ('+topicType+ ' ' +grade+'分)' : ''}}</div>
                    <div class="topic-content-box">
                        <div class="topic-content" v-html="content">
                            {{content}}
                        </div>
                        <div v-if="type == '3'" class="topic-sub">
                            <div v-if="topicType == '单选题'" class="selects">
                                <p class="select-item">A: <span>{{a}}</span></p>
                                <p class="select-item">B: <span>{{b}}</span></p>
                                <p class="select-item">C: <span>{{c}}</span></p>
                                <p class="select-item">D: <span>{{d}}</span></p>
                                <p class="select-item">E: <span>{{e}}</span></p>
                                <p class="select-item">F: <span>{{f}}</span></p>
                            </div>
                            <div v-if="topicType == '多选题'" class="selects">
                                <p class="select-item">A: <span>{{a}}</span></p>
                                <p class="select-item">B: <span>{{b}}</span></p>
                                <p class="select-item">C: <span>{{c}}</span></p>
                                <p class="select-item">D: <span>{{d}}</span></p>
                            </div>
                            <p class="difficulty">难度：<span>{{difficulty}}</span></p>
                        </div>
                        <div class="item-line">
                            <img src='../../assets/img/line.png' alt="">
                        </div>
                    </div>
                </div>
                <!-- <div class="submit" @click="submitAnswer">提交答卷</div> -->
            </div>
        </div>
        <!-- 对话框 -->
        <el-dialog
            title="温馨提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>{{hint}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="cancelShow" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click='leaveTrue'>确 定</el-button>
            </span>
        </el-dialog>
        <z-map></z-map>
    </div>
</template>

<style scoped>
    @import './Simu.css';
</style>

<script>
import { setInterval, clearInterval } from 'timers';
import map from './map'
export default {
    // props: {
    //     fixed: {
    //         type: Boolean,
    //         required: true
    //     }
    // },
    components: {
        "z-map": map
    },
    data(){
        return {
            menuList: ['基本想定','全部附件','作业条件'],
            currentIndex: 0,
            fixed: false,
            countDown: '',
            dialogVisible: false,
            timer: '',
            cancelShow: false,
            allow: false,
            hint: '考试未结束，无法查看其他页面!',
            isLeave: false,
            itemTitle: '',
            content: '',
            type: '',
            topicType: '',
            index: 0,
            id: 0,
            a: '',
            b: '',
            c: '',
            d: '',
            e: '',
            f: '',
            difficulty: '',
            grade: '',
            answer: ''
        }
    },
    methods: {
        // 点击顶部菜单项
        clickTopMenu(index){
            this.currentIndex = index;
            this.$emit('simuSend',index)
        },
        // 提交答卷
        submitAnswer(){
            if(!JSON.parse(localStorage.getItem('leave'))){
                const minute = localStorage.getItem('minute');
                const seconds = localStorage.getItem('seconds');
                this.hint = `距离考试结束还有${minute}分钟${seconds}秒，确认提交答卷吗？`;
                this.cancelShow = true;
                this.allow = true
                this.dialogVisible = true
            }
        },
        // 设置倒计时
        _changeCountDown(minute,seconds){
                minute = parseInt(minute);
                seconds = parseInt(seconds)
                this.timer = setInterval(() =>{
                    if(!JSON.parse(localStorage.getItem('leave'))){
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
                        localStorage.setItem('seconds',seconds)
                        if(minute == 0 && seconds == 0){
                            clearInterval(this.timer);
                            localStorage.clear()
                            this.hint = '时间已到,点击确认提交答卷';
                            this.allow = true;
                            this.dialogVisible = true;
                        }
                    }else{
                        clearInterval(this.timer)
                    }
                },1000)
        },
        setInterTime(){
            //判断取值 防止用户刷新
            let minute;
            let seconds ;
            if(localStorage.getItem('seconds')){
                minute = localStorage.getItem('minute');
                seconds = localStorage.getItem('seconds')
            }else{
                minute = parseInt(this.countDown);
                seconds = 0
                localStorage.setItem('minute',minute)
                localStorage.setItem('seconds',seconds)
            }
            this._changeCountDown(minute,seconds);
        },
        // 倒计时已到 考试结束
        examEnd(){
            this.dialogVisible2 = false
        },
        // 用户离开
        leaveTrue(){
           if(this.allow){
                clearInterval(this.timer)
                localStorage.removeItem('minute');
                localStorage.removeItem('seconds');
                localStorage.removeItem('startTime');
                localStorage.removeItem('endTime');
                localStorage.setItem('leave',true)
                this.dialogVisible = false;
                this.isLeave = true;
                let url = location.href;
                const index = url.indexOf('index')
                url = url.slice(0,index);
                this.$router.push({name: 'Examend'})
                // this.$router.back()
                // location.href = url + 'examend?a=1'
           }else{
               this.dialogVisible = false;
           }
        },
        handleClose(done) {
            // this.$confirm('确认关闭？')
            // .then(_ => {
                done();
            // })
            // .catch(_ => {});
        }
    },
    computed: {
        startTime(){
            if(!localStorage.getItem('startTime')){
                localStorage.setItem('startTime',this.$route.query.Time[0])
            }
            return localStorage.getItem('startTime')
        },
        endTime(){
             if(!localStorage.getItem('endTime')){
                localStorage.setItem('endTime',this.$route.query.Time[1])
            }
            return localStorage.getItem('endTime')
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
            next(false)
        }else{
            next()
        }
    },
    created(){
        const data = this.$route.query;
        console.log(data)
        this.type = data.indexPath;
        if(data.indexPath == '1'){
            this.currentIndex = 0;
            this.axios.get('/index/index/getIssue?id='+data.topicID).then(res =>{
                this.itemTitle = res.data.data.title;
                this.content = res.data.data.outline;
                this.countDown = res.data.data.kssc_time;
                this.setInterTime()
            })
        }else if(data.indexPath == '2'){
            this.currentIndex = 1;
            this.axios.get('/index/index/getEnclosure?id='+data.id).then(res =>{
                this.itemTitle = res.data.data.title;
                this.content = res.data.data.content;
                this.countDown = res.data.data.kssc_time;
                this.id = res.data.data.id;
                this.setInterTime()
            })
        }else if(data.indexPath == '3'){
            this.currentIndex = 2;
            if(data.index){
                this.index = data.index
            }else{
                this.index = data.id.slice(data.id.indexOf('&'+1))
            }
            this.axios.get('/index/index/getSubject?id='+data.id).then(res =>{
                console.log(res)
                const data = res.data.data;
                this.itemTitle = '作业条件'
                this.content = data.title;
                if(data.type == 1){ //单选题
                    this.topicType = '单选题';
                    this.a = data.a;
                    this.b = data.b;
                    this.c = data.c;
                    this.d = data.d;
                    this.e = data.e;
                    this.f = data.f; 
                }else if(data.type == 2){//多选题
                    this.topicType = '多选题';
                    this.a = data.a;
                    this.b = data.b;
                    this.c = data.c;
                    this.d = data.d;
                }else if(data.type == 3){//填空题
                    this.topicType = '填空题'
                }
                this.id = data.id;
                this.answer = data.answer;
                this.grade = data.fraction;
                if(data.difficulty == 0)  this.difficulty = '一般'
                if(data.difficulty == 1)  this.difficulty = '普通难度'
                if(data.difficulty == 2)  this.difficulty = '较难'
                if(data.difficulty == 3)  this.difficulty = '最高难度'
                this.countDown = data.kssc_time;
                this.setInterTime()
            })
        }
        this.$nextTick(()=>{
            const head = document.getElementById('head');
            const top = head.offsetTop
            window.addEventListener('scroll',()=>{
                const scrollTop = document.documentElement.scrollTop ||  document.body.scrollTop;
                if(scrollTop >= top){
                    this.fixed = true;
                }else{
                    this.fixed = false
                }
            })
        })
    }
}
</script>