<template>
    <div class="wrapper-examend">
        <div class="examend-header">
            <ul>
                <router-link tag="li" to="/index" class="iconfont">&#xe636; 首页</router-link>
                <li>在线考试</li>
                <li>考试结果</li>
            </ul>
        </div>
        <div class="result">
            <div class="title">
                <p class="title-name">本次考试结束</p>
                <p class="require">本试卷要求：{{dataAnw.kssc_time}}分钟</p>
            </div>
            <div class="exam-mess">
                <ul class="mess-box">
                    <li class="circle-box">
                        <div class="circle">{{dataAnw.fraction}}分</div>
                        <p class="circle-desc">本次得分</p>
                    </li>
                    <li class="score-mess">
                        <ul>
                            <li>
                                <span class="iconfont">&#xe60b;</span>
                                <span class="topic-name">单选题分数：</span>
                                <span class="score">{{dataAnw.dan}}</span><span>分</span>
                            </li>
                            <li>
                                <span class="iconfont">&#xe6c1;</span>
                                <span class="topic-name">多选题分数：</span>
                                <span class="score">{{dataAnw.duo}}</span><span>分</span>
                            </li>
                            <li>
                                <span class="iconfont">&#xe656;</span>
                                <span class="topic-name">填空题分数：</span>
                                <span class="score">{{dataAnw.tian}}</span><span>分</span>
                            </li>
                            <li>
                                <span class="iconfont">&#xe60a;</span>
                                <span class="topic-name">正确题数：</span>
                                <span class="score">{{dataAnw.yes}} /{{dataAnw.zongtishu}}</span><span>题</span>
                            </li>
                            <li>
                                <span class="iconfont">&#xe66e;</span>
                                <span class="topic-name">用时：</span>
                                <span class="score">{{min}}</span><span>分钟</span>
                                <span class="score">{{sec}}</span><span>秒</span>
                            </li>
                        </ul>
                    </li>
                    <li class="img">
                        <img src="../../assets/img/book.png" alt="">
                        <p>恭喜完成本次试题!</p>
                    </li>
                </ul>
            </div>
            <div v-if="btnShow" class="btn" @click="goTheory">前往理论考试</div>
        </div> 
    </div>
</template>

<style scoped>
    @import './Examend.css';
</style>

<script>
export default {
    data(){
        return {
            dataAnw: {},
            min: 0,
            sec: 0,
            id: '',//正式还是模拟
            btnShow: false
        }
    },
    methods: {
        goTheory(){
            if(this.id == 0){
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
            }else{
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
        seeError(){
            this.$router.push({name: 'myError'})
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.dataAnw = this.$route.query.data.data.data;
        const time = this.dataAnw.yongshi;
        this.min = Math.floor(time/60);
        this.sec = time%60;
        // 是否是连考
        if(this.id == 0){//模拟
            this.axios.get('/index/index/get_xiayichang_mn_li').then(res =>{
                if(res.data.data.lianxian == 1){
                    this.btnShow =  true;
                }else{
                    this.btnShow = false;
                }
            })
        }else{//正式
            this.axios.get('/index/index/get_xiayichang_li').then(res =>{
                if(res.data.data.lianxian == 1){
                    this.btnShow =  true;
                }else{
                    this.btnShow = false;
                }
            })
        }
    },
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        // alert(to.path)
       localStorage.clear();
       next()
    }
}
</script>