<template>
    <div class="wrapper-index">
        <div class="index-left">
            <div class="user-photo">
                <img src="../../assets/img/userPhoto.png" alt="">
                <p>{{userName}}</p>
            </div>
            <div class="index-left-menu" :class="fixed ? 'fixed' : ''">
                <el-col :span="24">
                    <el-menu
                    :unique-opened="true"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    @select="handleActive"
                    background-color="#1362cc"
                    text-color="#fff"
                    active-text-color="#fff">
                        <el-submenu v-if="isA" index="1">
                            <template slot="title">
                                <i class="icon iconfont">&#xe6d4;</i>
                                <span>题库管理</span>
                            </template>
                            <el-menu-item index="1-1" v-if="isbb">
                                <i class="iconfont circle">&#xe6b7;</i>
                                模拟考卷出题
                            </el-menu-item>
                            <el-menu-item index="1-2" v-if="iscc">
                                <i class="iconfont circle">&#xe6b7;</i>
                                正式考卷出题
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="2" v-if="isD">
                            <template slot="title">
                                <i class="icon iconfont">&#xe638;</i>
                                <span>考卷管理</span>
                            </template>
                            <el-menu-item index="2-1" v-if="isee">
                                <i class="iconfont circle">&#xe6b7;</i>
                                模拟考卷
                            </el-menu-item>
                            <el-menu-item index="2-2" v-if="isff">
                                <i class="iconfont circle">&#xe6b7;</i>
                                正式考卷
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="3" v-if="isG">
                            <template slot="title">
                                <i class="icon iconfont">&#xe6a3;</i>
                                <span>学生管理</span>
                            </template>
                            <el-menu-item index="3-1" v-if="ishh">
                                <i class="iconfont circle">&#xe6b7;</i>
                                添加学生
                            </el-menu-item>
                            <el-menu-item index="3-2" v-if="ishh">
                                <i class="iconfont circle">&#xe6b7;</i>
                                班级管理
                            </el-menu-item>
                            <el-menu-item index="3-3" v-if="isii">
                                <i class="iconfont circle">&#xe6b7;</i>
                                所有学生
                            </el-menu-item>
                            <el-menu-item index="3-4" v-if="isll">
                                <i class="iconfont circle">&#xe6b7;</i>
                                学生反馈
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="4" v-if="isJ">
                            <template slot="title">
                                <i class="icon iconfont">&#xe660;</i>
                                <span slot="title">设置</span>
                            </template>
                            <el-menu-item index="4-1" v-if="iskk">
                                <i class="iconfont circle">&#xe6b7;</i>
                                权限分配
                            </el-menu-item>
                            <el-menu-item index="4-2" v-if="iskk">
                                <i class="iconfont circle">&#xe6b7;</i>
                                用户管理
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-col>

            </div>
        </div>
        <div class="index-right">
            <div class="right-header" id="header" :class="fixed ? 'fixed' : ''">
                <div class="header-container">
                    <div class="header-left">
                        <span class="iconfont" @click="goHome">&#xe663;</span>
                        <span class="iconfont" id="reload" @click="reload(true)">
                              &#xe679;
                        </span>
                    </div>
                    <div class="header-right">
                        <!-- <div class="news">
                            <span class="iconfont">&#xe632;</span>
                            <div class="news-num">2</div>
                        </div> -->
                        <div class="exit" @click="backLogin" @mouseenter="isTextShow=true" @mouseleave="isTextShow = false">
                            <span class="iconfont">&#xe6c0;</span>
                            <div :class="isTextShow ? 'text show' : 'text' ">回到登录页</div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="menu-box">
                <ul>
                    <li v-for="(item,index) in menuList" :key="index" @click="changeMenu(index)"
                        :class="currentIndex == index ? 'menu-active' : ''">
                       <i v-html="item.icon" class="iconfont">{{item.icon}}</i>
                        <span class="menu-name">{{item.name}}</span>
                    </li>
                </ul>
            </div>
            <div class="right-content" v-if="isRouterAlive">
                <!-- <router-view ></router-view> -->
                <z-home v-if="home" @homeSend='receiveHome($event)'></z-home>
                <z-table v-if="table" :tableData='tableData' :isQual='isQual' @lookErr='gotoErr($event)'></z-table>
                <z-mis v-if="mis" :id="id" @leaveMis='backTable($event)'></z-mis>
                <z-set-topic v-if="setTopic" :topicTitle='topicTitle' :topicType='s_type' ref="setTopic" :isGetInfo='isGetInfo' :topicID='topicID' :topicName='topicName' :outline='outline' @gotoTopicTable='gotoTopicTable($event)'></z-set-topic>
                <z-simu v-if="simu" :isOper='isOper' @studentShow='studentShow' :title="isSimuTitle" @addTopic='addTopic($event)' @amendTopic='amendTopic($event)'></z-simu>
                <z-student v-if="student"></z-student>
                <z-feedback v-if="feedback"></z-feedback>
                <z-add-stu v-if="addStu"></z-add-stu>
                <z-add-class v-if="addClass"></z-add-class>
                <z-set-up v-if="setUp"></z-set-up>
                <z-user-admin v-if="userAdmin"/>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>确认返回登录页吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="backLogin">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style scoped>
    @import './Index.css';
</style>

<script>
import home from './index-in/home'
import table from './index-in/table'
import mis from './index-in/mistakes'
import setTopic from './index-in/setTopic'
import simu from './index-in/simu'
import feedback from './index-in/feedback'
import student from './index-in/student'
import setUp from './index-in/setUp'
import addStu from './index-in/addStu'
import addClass from './index-in/addClass'
import userAdmin from './index-in/userAdmin'

export default {
    components: {
        "z-home": home,
        "z-table": table,
        "z-mis": mis,
        "z-set-topic": setTopic,
        "z-simu": simu,
        "z-student": student,
        "z-set-up": setUp,
        "z-add-stu": addStu,
        "z-add-class": addClass,
        "z-feedback": feedback,
        "z-user-admin": userAdmin
    },
    // 用于刷新页面
    provide(){
        return {
            reload: this.reload
        }
    },
    data(){
        return{
            userName: '',
            fixed: false,
            home: true,
            table: false,
            mis: false,
            setTopic: false,
            simu: false,
            student: false,
            addStu: false,
            addClass: false,
            feedback: false,
            setUp: false,
            userAdmin: false,
            isOper: false,
            // 菜单权限显示
            isA: false,
            isbb: false,
            iscc: false,
            isD: false,
            isee: false,
            isff: false,
            isG: false,
            ishh: false,
            isii: false,
            isJ: false,
            iskk: false,
            isll: false,
            id: 0,
            topicID: 0,
            isTextShow: false,
            isRouterAlive: true,//用于刷新
            isQual: true,//确认是不是查看错题组件
            dialogVisible: false,
            isLeave: false,
            isGetInfo: true,
            topicTitle: '',
            s_type: '',
            outline: '',
            topicName: '',
            isSimuTitle: '',
            menuList: [
                {
                    icon: '&#xe663;',
                    name: '首页'
                }
            ],
            currentIndex: 0,
            currentMenuIndex: 0,
            tableData: ''
        }
    },
methods: {
        receiveHome(e){ //接收home组件传递的值
            this.menuList = [
                {
                    icon: '&#xe501;',
                    name: '回到首页'
                }
            ]
            this.currentIndex = -1;
            this.tableData = e.tableData;
            this.isQual = e.isQual;
            this.home = e.home;
            this.mis = e.mis;
            this.setTopic = e.setTopic;
            this.simu = e.simu;
            this.student = e.student;
            this.addStu = e.addStu;
            this.addClass = e.addClass;
            this.setUp = e.setUp;
            this.feedback = e.feedback;
            this.userAdmin = e.userAdmin;
            this.isOper = e.isOper;
            this.table = e.table;
            this.isSimuTitle = e.isSimuTitle
        },
        // 监听考卷管理页面添加B卷
        addTopic(e){
            this.table = false;
            this.mis = false;                      
            this.home = false;
            this.student = false;
            this.addStu = false;
            this.feedback = false;
            this.setUp = false;
            this.simu = false;
            this.addClass = false;
            this.userAdmin = false;
            this.s_type = e.title;
            this.topicID = e.id;
            this.outline = e.outline;
            this.topicName = e.name;
            this.isGetInfo = false;
            this.setTopic = true;
        },
        amendTopic(e){
            this.table = false;
            this.mis = false;                      
            this.home = false;
            this.student = false;
            this.addStu = false;
            this.feedback = false;
            this.setUp = false;
            this.addClass = false;
            this.userAdmin = false;
            this.simu = false;
            this.topicName = '';
            this.s_type = e.s_type;
            this.topicID = e.id;
            this.outline = '修改'
            this.isGetInfo = false;
            this.setTopic = true;
            console.log(typeof e.id)
        },
        gotoTopicTable(e){
            console.log(e)
            this.isSimuTitle = e.title;
            this.home = false;
            this.table = false;
            this.mis = false; 
            this.student = false;
            this.feedback = false;
            this.addStu = false;
            this.userAdmin = false;
            this.addClass = false;
            this.setUp = false;
            this.setTopic = false;
            this.isOper = false;
            this.simu = true;
            this.reload(false)
        },
        handleOpen(index, indexPath) {
            if(index == 1){
                 this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe70b;',
                        name: '模拟考卷出题'
                    },
                    {
                        icon: '&#xe996;',
                        name: '正式考卷出题'
                    }
                ]
                this.currentIndex = 0;
                this.currentMenuIndex = 1
            }else if(index == 2){
                this.menuList  =[
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe67f;',
                        name: '模拟考卷'
                    },
                    {
                        icon: '&#xe6a2;',
                        name: '正式考卷'
                    }
                ]
                this.currentIndex = 0;
                this.currentMenuIndex = 2
            }else if(index == 3){
                this.menuList  =[
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe67f;',
                        name: '添加学生'
                    },
                    {
                        icon: '&#xe6f5;',
                        name: '班级管理'
                    },
                    {
                        icon: '&#xe6a2;',
                        name: '所有学生'
                    },
                    {
                        icon: '&#xe61b;',
                        name: '学生反馈'
                    }
                ]
                this.currentIndex = 0;
                this.currentMenuIndex = 3
            }else if(index == 4){
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe647;',
                        name: '权限分配'
                    },
                    {
                        icon: '&#xe647;',
                        name: '用户管理'
                    }
                ]
                this.currentIndex = 0;
                this.currentMenuIndex = 4
            }
            // this.table = false;
            // this.mis = false;             
            // this.setTopic = false;
            // this.simu = false;
            // this.addStu = false;
            // this.student = false;
            // this.feedback = false;
            // this.setUp = false;
            // this.home = true;
        },
        handleClose(key, keyPath) {
            // this.menuList = [
            //     {
            //         icon: '&#xe663;',
            //         name: '首页'
            //     }
            // ],
            // this.currentIndex = 0;
            // this.currentMenuIndex = 0
        },
        // 右边菜单路由
        changeMenu(index){
            if(this.currentIndex == -1){
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    }
                ]
            }
            this.currentIndex = index;
            if(index == 0){
                    // this.$router.push({path: '/index/home'})// 到首页
                    this.table = false;
                    this.mis = false;                
                    this.setTopic = false;
                    this.simu = false;
                    this.student = false;
                    this.addStu = false;
                    this.addClass = false;
                    this.feedback = false;
                    this.userAdmin = false;
                    this.setUp = false;
                    this.home = true;
                    return
            }
            if(this.currentMenuIndex == 0){ //如果在首页
            }else if(this.currentMenuIndex == 1){//如果在题库管理
                if(index == 1){// 模拟考卷管理'
                    this.table = false;
                    this.mis = false;                      
                    this.home = false;
                    this.student = false;
                    this.addStu = false;
                    this.addClass = false;
                    this.feedback = false;
                    this.userAdmin = false;
                    this.setUp = false;
                    this.simu = false;
                    this.topicTitle = '模拟考卷';
                    this.isGetInfo = true;
                    this.setTopic = true; 
                    // this.$refs.setTopic._getInfo()
                }else if(index == 2){//正式考卷管理'
                    this.table = false;
                    this.mis = false;                
                    this.home = false;
                    this.student = false;
                    this.feedback = false;
                    this.addStu = false;
                    this.addClass = false;
                    this.userAdmin = false;
                    this.setUp = false;
                    this.simu = false;
                    this.topicTitle = '正式考卷'
                    this.isGetInfo = true;
                    this.setTopic = true; 
                    // this.$refs.setTopic._getInfo()
                }
            }else if(this.currentMenuIndex == 2){//如果在考卷管理
                if(index == 1){ //模拟考卷
                    this.home = false;
                    this.table = false;
                    this.mis = false; 
                    this.student = false;
                    this.addStu = false;
                    this.addClass = false;
                    this.feedback = false;
                    this.userAdmin = false;
                    this.setUp = false;
                    this.setTopic = false;
                    this.isSimuTitle = '模拟考卷列表'
                    this.isOper = false;
                    this.reload(false)
                    this.simu = true;
                }else if(index == 2){//正式考卷
                    this.home = false;
                    this.table = false;
                    this.mis = false; 
                    this.student = false;
                    this.addStu = false;
                    this.userAdmin = false;
                    this.addClass = false;
                    this.feedback = false;
                    this.setUp = false;
                    this.setTopic = false;
                    this.isSimuTitle = '正式考卷列表'
                    this.isOper = false;
                    this.reload(false);
                    this.simu = true;
                }

            }else if(this.currentMenuIndex == 3){//如果在学生管理
                if(index == 1){
                    this.home = false;
                    this.table = false;
                    this.mis = false;
                    this.setTopic = false;
                    this.userAdmin = false;
                    this.setUp = false;
                    this.addClass = false;
                    this.feedback = false;
                    this.simu = false;
                    this.student = false;
                    this.addStu =  true;
                }else if(index == 2){
                    this.home = false;
                    this.table = false;
                    this.mis = false;
                    this.setTopic = false;
                    this.setUp = false;
                    this.userAdmin = false;
                    this.simu = false;
                    this.feedback = false;
                    this.addStu = false;
                    this.student = false;
                    this.addClass = true;  
                }else if(index == 3){
                    this.home = false;
                    this.table = false;
                    this.mis = false;
                    this.userAdmin = false;
                    this.setTopic = false;
                    this.setUp = false;
                    this.simu = false;
                    this.addStu = false;
                    this.addClass = false;
                    this.feedback = false; 
                    this.student = true;
                }else if(index == 4){
                    this.home = false;
                    this.table = false;
                    this.mis = false;
                    this.setTopic = false;
                    this.userAdmin = false;
                    this.setUp = false;
                    this.simu = false;
                    this.addStu = false;
                    this.addClass = false;
                    this.student = false;
                    this.feedback = true 
                }
            }else if(this.currentMenuIndex == 4){//如果在设置
                if(index == 1){
                    this.home = false;
                    this.table = false;
                    this.mis = false;
                    this.simu = false;
                    this.userAdmin = false;
                    this.setTopic = false;
                    this.student = false;
                    this.feedback = false;
                    this.addClass = false;
                    this.addStu = false;
                    this.setUp = true;
                }else if(index == 2){
                    this.home = false;
                    this.table = false;
                    this.mis = false;
                    this.simu = false;
                    this.setUp = false;
                    this.setTopic = false;
                    this.student = false;
                    this.feedback = false;
                    this.addClass = false;
                    this.addStu = false;
                    this.userAdmin = true;
                }
            }
        },
        // 点击左边子菜单路由
        handleActive(index,indexPath){
            if(index == '1-1'){//模拟考卷管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe70b;',
                        name: '模拟考卷出题'
                    },
                    {
                        icon: '&#xe996;',
                        name: '正式考卷出题'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.student = false;
                this.addStu = false;
                this.setUp = false;
                this.addClass = false;
                this.feedback = false;
                this.userAdmin = false;
                this.simu = false;
                this.topicTitle = '模拟考卷'
                this.isGetInfo = true;
                this.setTopic = true;
                this.reload(false)
                this.currentIndex = 1;
                this.currentMenuIndex = 1;
                // this.$refs.setTopic._getInfo()
            }else if(index == '1-2'){//正式考卷管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe70b;',
                        name: '模拟考卷出题'
                    },
                    {
                        icon: '&#xe996;',
                        name: '正式考卷出题'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.setTopic = false;
                this.userAdmin = false;      
                this.student = false;
                this.addStu = false;
                this.feedback = false;
                this.addClass = false;
                this.setUp = false;  
                this.simu = false;
                this.topicTitle = '正式考卷'
                this.isGetInfo = true;
                this.setTopic = true;
                this.reload(false)
                this.currentIndex = 2;
                this.currentMenuIndex = 1;
                // this.$refs.setTopic._getInfo()
            }else if(index == '2-1'){ //考卷管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe61a;',
                        name: '模拟考卷'
                    },
                    {
                        icon: '&#xe61a;',
                        name: '正式考卷'
                    }
                ],               
                this.home = false;
                this.table = false;
                this.mis = false;
                this.student = false;
                this.feedback = false;
                this.addStu = false;
                this.setUp = false;
                this.userAdmin = false;
                this.addClass = false;
                this.setTopic = false;
                this.isSimuTitle = '模拟考卷列表'
                this.isOper = false;
                this.simu = true;
                this.reload(false)
                this.currentIndex = 1;
                this.currentMenuIndex = 2;
            }else if(index == '2-2'){ //考卷管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe61a;',
                        name: '模拟考卷'
                    },
                    {
                        icon: '&#xe61a;',
                        name: '正式考卷'
                    }
                ],               
                this.home = false;
                this.table = false;
                this.mis = false;
                this.student = false;
                this.userAdmin = false;
                this.addStu = false;
                this.feedback = false;
                this.addClass = false;
                this.setUp = false;
                this.setTopic = false;
                this.isSimuTitle = '正式考卷列表'
                this.isOper = false;
                this.simu = true;
                this.reload(false)
                this.currentIndex = 2;
                this.currentMenuIndex = 2;
            }else if(index == '3-1'){//学生管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe67f;',
                        name: '添加学生'
                    },
                    {
                        icon: '&#xe6f5;',
                        name: '班级管理'
                    },
                    {
                        icon: '&#xe6a2;',
                        name: '所有学生'
                    },
                    {
                        icon: '&#xe61b;',
                        name: '学生反馈'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.setTopic = false;
                this.feedback = false;
                this.simu = false;
                this.userAdmin = false;
                this.setUp = false;
                this.student = false;
                this.addClass = false;
                this.addStu = true;      
                this.currentIndex = 1;
                this.currentMenuIndex =  3;
            }else if(index == '3-2'){//学生管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe67f;',
                        name: '添加学生'
                    },
                    {
                        icon: '&#xe6f5;',
                        name: '班级管理'
                    },
                    {
                        icon: '&#xe6a2;',
                        name: '所有学生'
                    },
                    {
                        icon: '&#xe61b;',
                        name: '学生反馈'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.setTopic = false;
                this.addStu = false;
                this.userAdmin = false;
                this.setUp = false;
                this.feedback = false;
                this.simu = false; 
                this.student = false;
                this.addClass = true;   
                this.currentIndex = 2;
                this.currentMenuIndex =  3;
            }else if(index == '3-3'){//学生管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe67f;',
                        name: '添加学生'
                    },
                    {
                        icon: '&#xe6f5;',
                        name: '班级管理'
                    },
                    {
                        icon: '&#xe6a2;',
                        name: '所有学生'
                    },
                    {
                        icon: '&#xe61b;',
                        name: '学生反馈'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.setTopic = false;
                this.addStu = false;
                this.setUp = false;
                this.simu = false; 
                this.feedback = false;
                this.userAdmin = false;
                this.addClass = false;
                this.student = true;     
                this.currentIndex = 3;
                this.currentMenuIndex =  3;
            }else if(index == '3-4'){//学生管理
                this.menuList = [
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe67f;',
                        name: '添加学生'
                    },
                    {
                        icon: '&#xe6f5;',
                        name: '班级管理'
                    },
                    {
                        icon: '&#xe6a2;',
                        name: '所有学生'
                    },
                    {
                        icon: '&#xe61b;',
                        name: '学生反馈'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.setTopic = false;
                this.userAdmin = false;
                this.addStu = false;
                this.setUp = false;
                this.student = false;
                this.addClass = false;
                this.simu = false; 
                this.feedback = true;     
                this.currentIndex = 4;
                this.currentMenuIndex =  3;
            }else if(index == '4-1'){//设置
                this.menuList  =[
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe647;',
                        name: '权限分配'
                    },
                    {
                        icon: '&#xe647;',
                        name: '用户管理'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.setTopic = false;
                this.simu = false;
                this.student = false;
                this.userAdmin = false;
                this.feedback = false;
                this.addStu = false;
                this.setUp = true;    
                this.currentIndex = 1;
                this.currentMenuIndex = 4
            }else if(index == '4-2'){
                this.menuList  =[
                    {
                        icon: '&#xe663;',
                        name: '首页'
                    },
                    {
                        icon: '&#xe647;',
                        name: '权限分配'
                    },
                    {
                        icon: '&#xe647;',
                        name: '用户管理'
                    }
                ]
                this.home = false;
                this.table = false;
                this.mis = false;
                this.setTopic = false;
                this.simu = false;
                this.student = false;
                this.setUp = false;
                this.feedback = false;
                this.addStu = false;
                this.userAdmin = true;    
                this.currentIndex = 2;
                this.currentMenuIndex = 4
            }
        },
        // 监听模拟题库组件
        studentShow(){
            this.home  = false;
            this.table = false;
            this.simu = false;
            this.setTopic = false;
            this.addStu = false;
            this.feedback = false;
            this.addClass = false;
            this.userAdmin = false;
            this.mis = false;
            this.setUp = false;
            this.$nextTick(() =>{
                    this.setTopic = true;
                })
        },
        // 监听表格组件传来的参数
        gotoErr(e){
            this.id = e;
            this.home  = false;
            this.table = false;
            this.simu = false;
            this.setTopic = false;
            this.student = false;
            this.feedback = false;
            this.userAdmin = false;
            this.addClass = false;
            this.addStu = false;
            this.setUp = false;
            this.mis = true;
        },
        backTable(){ //回到合格或者不合格页面
            this.home  = false;
            this.mis = false;
            this.simu = false;
            this.setTopic = false;
            this.student = false;
            this.feedback = false;
            this.addClass = false;
            this.addStu = false;
            this.userAdmin = false;
            this.setUp = false;
            this.table = true;
        },
        // 页面刷新
        reload(circle){
            // 页面属性不白屏 数据驱动
            this.isRouterAlive = false
            this.$nextTick(() =>{
                this.isRouterAlive = true
                // location.reload() //不要使用这种方法
                const reload = document.getElementById('reload');
                let speed = 0;
               if(circle){
                    const timer = setInterval(() =>{
                        speed += 2
                        if(speed >= 360){
                            clearInterval(timer);
                            speed = 360
                        }
                        reload.style.transform = `rotate(${speed}deg)`;
                    },1)
               }
            })
        },
        // 回到首页
        goHome(){
            this.table  = false;
            this.mis = false;
            this.simu = false;
            this.setTopic = false;
            this.student = false;
            this.addStu = false;
            this.addClass = false;
            this.userAdmin = false;
            this.feedback = false;
            this.setUp = false;
            this.home = true;
            this.currentIndex = 0
        },
        // 回到登录页
        backLogin(){
            // this.dialogVisible = false;
            this.axios.post('/admin/login/outLogin').then(res =>{
                this.isLeave = true
                this.$router.push('/')
            })
        },
        // 菜单权限设置
        _getInfoMenu(){
            this.axios('/admin/index/index').then(res =>{
                res.data.data.forEach((ele,index) =>{
                    ele.child.forEach(e =>{
                        if(e.parent_id == 1) this.isA = true;
                        if(e.parent_id == 4) this.isD = true;
                        if(e.parent_id == 7) this.isG = true;
                        if(e.parent_id == 10) this.isJ = true;

                        if(e.id == 2) this.isbb = true;
                        if(e.id == 3) this.iscc = true;
                        if(e.id == 5) this.isee = true;
                        if(e.id == 6) this.isff = true;
                        if(e.id == 8) this.ishh = true;
                        if(e.id == 9) this.isii = true;
                        if(e.id == 11) this.iskk = true;
                        if(e.id == 12) this.isll = true;
                    })
                })
            })
        },
        // 获取用户名
        _getUserName(){
            this.axios.get('/admin/index/getUser').then(res =>{
                this.userName = res.data.msg
            })
        }
    },
    created(){
       this. _getInfoMenu();
       this._getUserName();
        // 滚动固定
       this.$nextTick(()=>{
            const header = document.getElementById('header');
            const headTop = header.offsetTop;
            window.addEventListener('scroll',()=>{
                let scrollTop ;
                if(document.documentElement.scrollTop){
                    scrollTop = document.documentElement.scrollTop;
                }else{
                    // scrollTop = window.pageYOffset;
                }
                if(scrollTop >= headTop){
                    this.fixed = true
                }else{
                    this.fixed = false
                }
            })
        })
    },
    // 离开路由守卫
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        // if(confirm('确认返回登录页?') == true){
        //     next()
        // }else{
        //     next(false)
        // }
        if(this.isLeave){
            this.isLeave = false
            this.$confirm('确认返回登录页？')
          .then(_ => {
            next();
            
          })
          .catch(next(false));
        }
    },
}
</script>
