<template>
    <div class="topic-wrapper">
        <div class="topic-box">
            <div class="topic-menu">
                <div class="name">
                    <p class="name-desc">试卷名称：</p>
                    <p class="title">{{title}}</p>
                </div>
                <ul>
                    <p>子卷列表</p>
                    <li v-for="(item,index) in menuList" :key="index" @click="getTopic(index)"
                        :class="currentIndex == index ? 'active' : ''">{{item}} 卷</li>
                </ul>
            </div>
            <div class="topic-content">
                <div class="outline">
                    <p class="outline-title">想定内容</p>
                    <div class="content" v-html="content">{{content}}</div>
                </div>
                <div class="adjun">
                    <p class="adjun-title">所有附件</p>
                    <ul>
                        <li v-for="(adj,i) in adjunData" :key="i">
                            <p class="adjun-name">{{adj.title}}</p>
                            <div class="adjun-content" v-html="adj.content">{{adj.content}}</div>
                        </li>
                    </ul>
                </div>
                <div class="topics">
                    <p class="topic-title">作业条件</p>
                    <div class="topic-content">
                        <div class="alone">
                            <p class="topics-title">单选题</p>
                            <ul>
                                <li v-for="(item,index) in topicData" :key="index">
                                    <p class="topic-name">今天你吃了吗?</p>
                                    <div class="answers">
                                        <p>A: 吃了</p>
                                        <p>B: 吃了</p>
                                        <p>C: 吃了</p>
                                        <p>D: 吃了</p>
                                        <p>E: 吃了</p>
                                        <p>F: 吃了</p>
                                    </div>
                                    <p class="answer"><span class="topic-answer">正确答案：</span></p>
                                </li>
                            </ul>
                        </div>
                        <div class="multi">
                            <p class="topics-title">多选题</p>
                        </div>
                        <div class="gap">
                            <p class="topics-title">填空题</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style src='./Topic.css' scoped>
</style>
<script>
export default {
    data(){
        return {
            menuList: [],
            adjunData: [],
            topicData: [],
            title: '',
            content: '',
            currentIndex: 0
        }
    },
    methods: {
        getTopic(index){
            this.currentIndex = index;
        }
    },
    computed: {
        id(){
            return this.$route.query.id
        }
    },
    created(){
        console.log(this.id)
        this.axios.get('/admin/issue/seeIssue?id='+this.id).then(res =>{
            console.log(res)
            this.menuList = res.data.data.s_type;
            this.title = res.data.data.title;
            this.content = res.data.data.outline;
        })
        this.axios.get('/admin/issue/details?s_id='+this.id+'&s_type=A').then(res =>{
            console.log(res)
            res.data.data.enclosure.forEach((ele,index) =>{
                this.adjunData[index] = {}
                this.adjunData[index].title = ele.title;
                this.adjunData[index].content = ele.content
            })
            console.log(this.adjunData)
        })
    }
}
</script>