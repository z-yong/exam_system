<template>
    <div class="correct-wrapper">
        <div style="padding:0 0 10px;color:#0070d8;cursor: pointer;" @click="back">返回上一层</div>
        <div v-if="topicList.length" class="topic-box">
            <div class="topic-item" v-for="(item,index) in topicList" :key="index">
                <div style="display: flex;align-items: center;">
                    <div>{{index+1}}、</div>
                    <div style="margin-top:3px" v-html="item.title">{{item.title}}</div>
                </div>
                <div class="answer">
                    <span>学生答案:</span>
                    <div v-if="item.automatic == 1">
                        <span v-for="(gap, i) in item.user_answer" :key="i" style="margin-right:1vw">{{gap}}</span>
                    </div>
                    <div v-else>{{item.user_answer}}</div>
                </div>
                <div class="answer">
                    <span>标准答案:</span>
                    <div v-if="item.automatic == 1">
                        <span v-for="(ans, i) in item.answer" :key="i" style="margin-right:1vw">{{ans}}</span>
                    </div>
                    <div v-else>{{item.answer}}</div>
                </div>
                <div class="difficulty">
                    <span>难度: {{item.difficulty}}</span>
                    <span>总分: {{item.fraction}}分</span>
                </div>
                <div class="fraction">
                    <span>最终得分：</span>
                    <!--  @input="callback => changeScore(callback, item.fraction)" -->
                    <input type="number" v-model="answerList[index].score" placeholder="请输入该题得分">
                </div>
            </div>
            <div class="submit">
                <span @click="submit">提交</span>
            </div>
        </div>
        <div v-else>
            此试卷无可批改的题目
        </div>
    </div>
</template>
<script>
export default {
    props: {
        ids: {
            type: Object 
        }
    },
    data(){
        return{
            topicList: [],
            answerList: []
        }
    },
    methods: {
        back(){
            this.$emit('back')
        },
        // changeScore(callback,fraction){
        //     // console.log(f,e)
        // },
        submit(){
            const data = this.ids;
            const timo = [];
            let index = 0;
            for (const item of this.answerList) {
                if(!item.score){
                    this.$message({
                        message: `第${index+1}题得分未填写，如没有得分请填0`,
                        type: 'error'
                    })
                    return
                }
                timo.push(item)
                index ++
            }
            data.timo = timo;
            this.axios.post('/admin/paper/modify_answer_content',data).then(res =>{
                if(res.data.code == 200){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this.$emit('seeStuPer',this.ids.u_id)
                }
            })
        },
        _getData(){
            this.axios.post('/admin/paper/get_answer_content',this.ids).then(res =>{
                if(res.data.code == 200){
                    this.topicList = res.data.data.filter(ele =>{
                        return ele.type == 4 || ele.automatic == 1;
                    })
                    this.topicList.forEach((ele,index) =>{
                        this.answerList[index] = { id: ele.daan_id, score: ele.score }
                    })
                }
            })
        }
    },
    created(){
        this._getData()
    }
}
</script>
<style scoped>
    @import './correctTopic.css';
</style>