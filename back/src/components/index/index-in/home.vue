<template>
    <div class="home-wrapper">
        <div class="home-box">
            <div class="home-left">
                <div class="test-paper">
                    <p class="test-title">
                        最近一次考生试卷情况
                    </p>
                    <div class="test-paper-content">
                        <ul>
                            <li v-for="(mess,i) in testPaper" :key="i" @click="gotoTable(i)">
                                <div class="icon">
                                    <i v-html="mess.icon" class="iconfont">{{mess.icon}}</i>
                                </div>
                                <div class="mess-desc">
                                    <p class="num">{{mess.num}}</p>
                                    <p class="desc-name">{{mess.name}}</p>
                                </div>
                                <div class="one"></div>
                                <div class="three">
                                    <div class="two"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="ratio">
                    <ul class="ratio-list"> 
                        <li class="chart">
                            <p class="ratio-title">占比情况</p>
                            <div id="myChart1"></div>
                            <ul>
                                <li class="color" v-for="(item,index) in ratioMess" :key="index">
                                    <div class="circle" :style="{background: item.color}"></div>
                                    <span>{{item.name}}</span>
                                </li>
                            </ul>
                        </li>
                        <li class="chart">
                            <p class="ratio-title">试题难度选择情况</p>
                            <div id="myChart2"></div>
                            <ul>
                                <li class="color" v-for="(item,index) in parperSelect" :key="index">
                                    <div class="circle" :style="{background: item.color}"></div>
                                    <span>{{item.name}}</span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="home-right">
                <div class="right-top">
                    <div class="calendar">
                        <p class="calendar-name">日历</p>
                        <el-calendar v-model="value"></el-calendar>
                    </div>
                    <div class="task">
                        <ul class="task-list">
                            <li v-for="(item,index) in taskMess" :key="index">
                                <div class="icon">
                                    <i v-html="item.icon" class="iconfont">{{item.icon}}</i>
                                </div>
                                <div class="task-desc">
                                    <p class="task-time">{{item.time}}</p>
                                    <p class="task-content">{{item.content}}</p>
                                </div>
                            </li>
                            <!-- <li>
                                <div class="icon">
                                    <i class="iconfont">&#xe653;</i>
                                </div>
                                <div class="task-desc">
                                    <p class="task-time">01：30PM - 06:30PM</p>
                                    <p class="task-content">B卷考试，分配工作任务</p>
                                </div>
                            </li> -->
                        </ul>
                    </div>
                </div>
                <div class="right-bottom">
                    <div class="log">
                        <p class="log-title">登录日志</p>
                        <div class="log-content" v-for="(item,index) in journalMess" :key="index">
                            <div class="icon">
                                <i class="iconfont">&#xe610;</i>
                            </div>
                            <div class="log-desc" >
                                <p class="log-time">{{item.time}}</p>
                                <p class="log-mess">系统登录成功<br>IP地址：{{item.ip}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import './home.css';
</style>

<script>
export default {
    data(){
        return{
            testPaper: [],
            ratioMess: [],
            parperSelect: [],
            taskMess: [],
            journalMess: [],
            value: new Date()
        }
    },
    methods: {
        gotoTable(index){
            let data = {};
            let tableData = [];
            let isQual;
            let isSimuTitle = '所有试卷列表';
            let home,mis,setTopic,simu,student,addStu,addClass,feedback,setUp,table,isOper,userAdmin;
            if(index == 0 || index == 1 || index == 2){
                home = false;
                mis = false;
                setTopic = false;
                simu = false;
                student = false;
                addStu = false;
                setUp = false;
                feedback = false;
                addClass = false;
                userAdmin = false;
                table = true;
            }
            if(index == 0){
                 isQual = true;
                 this.axios.get('/admin/index/qualified?state=0').then(res =>{
                     tableData = res.data.data;
                     data = {
                            tableData,home,mis,setTopic,simu,table,student,feedback,addClass,addStu,setUp,isQual,isSimuTitle,isOper,userAdmin
                        }
                    this.$emit('homeSend',data)
                 })
            }else if(index == 1){
                isQual = true
                this.axios.get('/admin/index/qualified?state=1').then(res =>{
                     tableData = res.data.data;
                     data = {
                            tableData,home,mis,setTopic,simu,table,student,feedback,addClass,addStu,setUp,isQual,isSimuTitle,isOper,userAdmin
                        }
                    this.$emit('homeSend',data)
                 })
            }else if(index == 2){
                isQual = false;
                this.axios.get('/admin/index/qualified?state=2').then(res =>{
                     tableData = res.data.data;
                     data = {
                            tableData,home,mis,setTopic,simu,table,student,feedback,addStu,addClass,setUp,isQual,isSimuTitle,isOper,userAdmin
                        }
                    this.$emit('homeSend',data)
                 })
            }else if(index == 3){
                home = false;
                mis = false;
                setTopic = false;
                simu = false;
                table = false;
                student = false;
                addStu = false;
                feedback = false;
                setUp = false;
                addClass = false;
                userAdmin = false;
                isOper = true;
                simu = true;
                data = {
                            tableData,home,mis,setTopic,simu,table,student,addClass,feedback,addStu,setUp,isQual,isSimuTitle,isOper,userAdmin
                    }
                this.$emit('homeSend',data)
            }
            
        },
         _drawLine1(){
        // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart1'))
            const data = []
            this.ratioMess.forEach((ele,index) =>{
                data[index] = {}
                data[index]['value'] = parseInt(ele.ratio);
                data[index]['name'] = ele.name + ele.ratio;
                data[index]['itemStyle'] = {
                    color: ele.color, 
                    emphasis: {
                                // shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.7)'
                            }}
            })
            data.reverse() //逆序
            const option = {
                textStyle: {
                    "fontSize": 14
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data
                    }
                ]
            };
            myChart.setOption(option);
        },
         _drawLine2(){
        // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart2'))
            const data = []
            this.parperSelect.forEach((ele,index) =>{
                data[index] = {}
                data[index]['value'] = parseInt(ele.ratio);
                data[index]['name'] = ele.name + ele.ratio;
                data[index]['itemStyle'] = {color: ele.color}
            })
            data.reverse()//逆序
            const option = {
                textStyle: {
                    "fontSize": 14
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data
                    }
                ]
            };
            myChart.setOption(option);
        },
        // 获取初始化首页数据
        _getInfoData(){
            this.axios.get('/admin/index/getIndexInfo').then(res =>{
                const data = res.data.data;
                // 四个方块数据
                const qualified = {
                        name: '合格',
                        icon: '&#xe638;',
                        num: data.lately.qualified
                    }
                const unqualified = {
                        name: '未合格',
                        icon: '&#xe62d;',
                        num: data.lately.unqualified
                    }
                const lack = {
                        name: '缺考人数',
                        icon: '&#xe620;',
                        num: data.lately.lack
                    }
                const total = {
                        name: '总出卷',
                        icon: '&#xe612;',
                        num: data.lately.total
                    };
                this.testPaper.push(qualified,unqualified,lack,total)
                // 第一个圆数据
                const qua = {
                    ratio: data.proportion.qualified + '%',
                    name: '未合格',
                    color: '#ff637b'
                }
                const unq = {
                    ratio: data.proportion.unqualified + '%',
                    name: '合格',
                    color: '#4f70f0'
                }
                this.ratioMess.push(qua,unq);
                // 第二个圆数据
                const one = {
                    ratio: data.difficulty.one + '%',
                    name: '一般',
                    color: '#00c1ce'
                };
                const two = {
                    ratio: data.difficulty.two + '%',
                    name: '普通难度',
                    color: '#4f70f0'
                };
                const three = {
                    ratio: data.difficulty.three + '%',
                    name: '较难',
                    color: '#ff8572'
                };
                const four = {
                    ratio: data.difficulty.four + '%',
                    name: '最高难度',
                    color: '#ff637b'
                }
                this.parperSelect.push(one,two,three,four);
                // 确保dom挂载好再执行
                this._drawLine1();
                this._drawLine2();
                // 分配工作任务
                this.taskMess = data.task
                // 登录日志
                this.journalMess = data.journal
            }).catch(err =>{
                console.log(err)
            })
        }
    },
    created(){
        this._getInfoData()
    },
    mounted(){
        
    }
}
</script>