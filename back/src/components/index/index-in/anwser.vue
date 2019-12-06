<template>
    <div class="answer-wrapper">
        <div class="topic-box">
            <div class="topic">
                <div class="topic-item">
                    <div class="item-name">单选题</div>
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-if="!radioData.length" style="color: #999999;text-align:center;margin-top:1vh">无此项题</li>
                            <li v-for="(dan,di) in radioData" :key="di">
                                <div class="item-mess">
                                    <div style="display:flex;margin:0 0 1vh -1vh">
                                        {{di+1}}、<div v-html="dan.subject.title">{{dan.subject.title}}</div>
                                        <span>({{dan.subject.fraction}}分)</span>
                                    </div>
                                    <div>A. {{dan.subject.a}}</div>
                                    <div>B. {{dan.subject.b}}</div>
                                    <div>C. {{dan.subject.c}}</div>
                                    <div>D. {{dan.subject.d}}</div>
                                    <div style="margin:1vh 0 0 -1vh">
                                        <div>学生答案: <span :class="dan.correct == 0 ? 'green' : 'red'">{{dan.user_answer}}</span></div>
                                        <div style="margin-top:10px">正确答案: {{dan.answer}}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="item-line">
                            <img src='../../../assets/img/line2.png' alt="">
                        </div>
                    </div>
                </div>
                <div class="topic-item">
                    <div class="item-name">多选题</div>
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-if="!checkData.length" style="color: #999999;text-align:center;margin-top:1vh">无此项题</li>
                            <li v-for="(duo,du) in checkData" :key="du">
                                <div class="item-mess">
                                    <div style="display:flex;margin:0 0 1vh -1vh">
                                        {{du+1}}、<div v-html="duo.subject.title">{{duo.subject.title}}</div>
                                        <span>({{duo.subject.fraction}}分)</span>
                                    </div>
                                    <div>A. {{duo.subject.a}}</div>
                                    <div>B. {{duo.subject.b}}</div>
                                    <div>C. {{duo.subject.c}}</div>
                                    <div>D. {{duo.subject.d}}</div>
                                    <div>E. {{duo.subject.e}}</div>
                                    <div>F. {{duo.subject.f}}</div>
                                    <div style="margin:1vh 0 0 -1vh">
                                        <div>学生答案: <span :class="duo.correct == 0 ? 'green' : 'red'">{{duo.user_answer}}</span></div>
                                        <div style="margin-top:10px">正确答案: {{duo.answer}}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="item-line">
                            <img src='../../../assets/img/line2.png' alt="">
                        </div>
                    </div>
                </div>
                <div class="topic-item">
                    <div class="item-name">填空题</div>
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-if="!gapData.length" style="color: #999999;text-align:center;margin-top:1vh">无此项题</li>
                            <li v-for="(tian,ti) in gapData" :key="ti">
                                <div class="item-mess">
                                    <div style="display:flex;margin:0 0 1vh -1vh">
                                        {{ti+1}}、<div v-html="tian.subject.title">{{tian.subject.title}}</div>
                                        <span>({{tian.subject.fraction}}分)</span>
                                        <div style="margin-left:15px;color:red">精确到{{tian.subject.error}}</div>
                                    </div>
                                    <div>
                                        <div>学生答案: <span :class="tian.correct == 0 ? 'green' : 'red'">{{tian.user_answer}}</span></div>
                                        <div style="margin-top:10px">正确答案: {{tian.answer}}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="item-line">
                            <img src='../../../assets/img/line2.png' alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style src='./anwser.css' scoped>
    
</style>
<script>
export default {
    props: {
        answerData: {
            type: Object
        }
    },
    data(){
        return{
            id: 0,
            isShow: false,
            cancelShow: true,
            allow: false,
            radioData: [],//单选答案
            checkData: [],//多选答案
            gapData: [],//填空答案
            formData: []//总的答案
        }
    },
    methods: {
        _getData(){
            this.axios.post('/admin/user/get_user_answer_card',{s_id: this.answerData.s_id, u_id: this.answerData.u_id}).then(res =>{
                console.log(res)
                this.radioData = res.data.data.dan;
                this.checkData = res.data.data.duo;
                this.gapData = res.data.data.tian;
            }).catch(err =>{
                console.log(err)
            })
        }
    },
    created(){
        this._getData()
    }
}
</script>