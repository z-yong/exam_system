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
            <!-- <div class="btn" @click="seeError">查看错题</div> -->
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
            sec: 0
        }
    },
    methods: {
        seeError(){
            this.$router.push({name: 'myError'})
        }
    },
    created(){
        this.dataAnw = this.$route.query.data.data.data;
        console.log(this.dataAnw)
        const time = this.dataAnw.yongshi;
        this.min = Math.floor(time/60);
        this.sec = time%60
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