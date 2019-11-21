<template>
    <div class="wrapper index">
        <z-header :srcPath='path' :isShow='true' :userName='userName' @personSend='receivePer($event)'
                  :currentBgColor='bgColor' :currentFontColor='color'></z-header>
        <div class="index-main">
            <div class="content-left">
                <div class="user-mess">
                    <div class="user-photo">
                        <img src="../../assets/img/userPhoto.png" alt="">
                    </div>
                    <p class="user-name">{{userName}}</p>
                </div>
                <div v-if="isMenuShow" class="menu-left" :class="fixed ? 'fixed' : ''" id="menuLeft">
                    <el-row class="tac">
                        <el-col :span="24">
                            <el-menu unique-opened	:default-openeds='menuIndexArr' router
                                     class="el-menu-vertical-demo"
                                     @select="currentMenu"
                                     background-color="#fff"
                                     text-color="#0070d8"
                                     active-text-color="#fff">
                                <el-menu-item index="1">
                                    <i class="el-icon-s-opportunity"></i>
                                    <span slot="title">基本想定</span>
                                </el-menu-item>
                                <el-submenu index="2">
                                    <template slot="title">
                                        <i class="el-icon-s-grid" style="color:#0070d8"></i>
                                        <span>全部附件</span>
                                    </template>
                                    <el-menu-item v-for="(enclo,i) in enclosure" :key="i" :index='enclo.id'><i class="iconfont">&#xe6b7;</i>
                                        附件{{i+1}}
                                        <span class="enclo-text">({{enclo.title}})</span>
                                    </el-menu-item>
                                </el-submenu>
                                <el-submenu index="3">
                                    <template slot="title">
                                        <i class="el-icon-s-operation" style="color:#0070d8"></i>
                                        <span>作业条件</span>
                                    </template>
                                        <el-menu-item v-for="(sub,ii) in subject" :key="ii" @click="goToSimu(sub.id,ii)" :index="sub.id+'&'+(ii+1)"><i class="iconfont">&#xe6b7;</i>
                                            条件{{ii+1}}
                                        <span class="sub-text">({{sub.title}})</span>
                                        </el-menu-item>
                                </el-submenu>
                            </el-menu>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="content-right">
                <router-view :index='index' @simuSend='getCurrentIndex($event)'></router-view>
            </div>
        </div> 
    </div>
</template>

<style scoped>
    @import './Index.css';
</style>
<script>
import header from '../com/header'
export default {
    components: {
        "z-header": header
    },
    data(){
        return {
            fixed: false,
            path: require('../../assets/img/LOGO-white.png'),
            bgColor: '#0070d8',
            color: '#fff',
            userName: '',
            id: 0,
            countDowmTime: 0,
            menuIndexArr: [],
            index: 0,
            openOther: true,
            isMenuShow: false,
            enclosure: [],
            subject: [],
            currentIndex: 0
        }
    },
    methods: {
        goToSimu(id,index){
            console.log(id,index)
        },
        currentMenu(index,indexPath){
            const date = this._getStartTime()
            this.bgColor = '#0070d8', 
            this.color = '#fff',
            this.path = require('../../assets/img/LOGO-white.png');
            const { href } = this.$router.resolve({path: '/index/simu',query: {Time: date, indexPath: indexPath[0], id: index, topicID: this.id}})
            // if(this.openOther){
            //     this.openOther = false
                window.open(href, '_blank');
            // }
        },
        // header组件触发时间
        receivePer(index){
            this.index = index;
            localStorage.removeItem('exam')
            this.isMenuShow = false
        },
        rightMenu(index){
            this.currentIndex = index;
            if(index == 0){
                this.$router.push('/index/index-in')
            }
        },
        getCurrentIndex(index){
            this.isMenuShow = true;
            if(index == 0){
                this.menuIndexArr = ['1']
            }else if(index == 1){
                this.menuIndexArr = ['2']
            }else if(index == 2){
                this.menuIndexArr = ['3']
            }
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
        _controlScroll(){
            // 初始化菜单数据
            // 跟随页面滚动固定顶部dom
            if(this.isMenuShow){
                this.$nextTick(()=>{
                    const menuLeft = document.getElementById('menuLeft');
                    const top = menuLeft.offsetTop
                    window.addEventListener('scroll',()=>{
                        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                        if(scrollTop >= top){
                            this.fixed = true;
                            console.log(scrollTop,top)
                        }else{
                            this.fixed = false
                        }
                    })
                })
            }
        },
        _getExamingData(){
            // 获取Examing页面传过来的数据
            if(this.$route.query.enclosure){
                console.log(123)
                this.menuIndexArr = this.$route.query.menuIndex;
                this.isMenuShow = this.$route.query.isMenuShow;
                this.enclosure = this.$route.query.enclosure;
                this.subject = this.$route.query.subject;
                this.id = this.$route.query.id;
            }
        },
        _getUserName(){
            this.axios.get('/index/index/index').then(res =>{
                this.userName = res.data.data.real_name;
                localStorage.setItem('username',this.userName)
            })
        },
        // 如果用户刷新了 防止菜单信息没有
        _goMenuMess(){
            if(!localStorage.getItem('exam')){
                return 
            }
            const exam = localStorage.getItem('exam');
            let enclosure = [];
            let subject = [];
            if(exam == 'simu'){
                this.axios.get('/index/index/StartExamMn').then(res =>{
                    localStorage.setItem('exam','simu');
                    enclosure = res.data.data.enclosure;
                    subject = res.data.data.subject;
                    this.enclosure = enclosure;
                    this.subject = subject;
                    this.countDowmTime = res.data.data.kssc_time;
                    this.id = res.data.data.id;
                    // 去除富文本标签
                    // const reg = /<.+>/g;
                    this.subject.forEach(ele =>{
                        ele.title = ele.title.replace(/<[^>]+>/g, '')
                    })
                }).catch(err =>{
                    console.log(err)
                })
            }else if(exam == 'official'){
                this.axios.get('/index/index/StartExam').then(res =>{
                    localStorage.setItem('exam','official')
                    enclosure = res.data.data.enclosure;
                    subject = res.data.data.subject;   
                    this.enclosure = enclosure;
                    this.subject = subject;
                    this.countDowmTime = res.data.data.kssc_time;
                    this.id = res.data.data.id;
                    // 去除富文本标签
                    // const reg = /<.+>/g;
                    this.subject.forEach(ele =>{
                        ele.title = ele.title.replace(/<[^>]+>/g, '')
                    })
                }).catch(err =>{
                    console.log(err)
                })
            }
        }
    },
    created(){
        this._controlScroll();
        this._getUserName();
        this._getExamingData();
        this._goMenuMess();
        // 设置一把公共锁 当学生离开试卷页面或者答题卡页面时即解锁
        localStorage.setItem('leave',false);

        const href = window.location.href;
        const index = href.indexOf('?') + 1;
        if(index > 0){
            const argument = href.slice(index);
            if(argument.length){
                const reg = /([^?&=]+)=([^?&=|#]*)/g;
                const arr = argument.match(reg);
                let store_id = ''; 
                arr.forEach((ele) =>{
                    const i = ele.indexOf('=');
                    const name = ele.slice(0,i)
                    if(name == 'indexPath'){
                        this.isMenuShow = true;
                        this.menuIndexArr = [ele.slice(i+1)]
                    }
                })
            }
        }
    }
    
}
</script>
