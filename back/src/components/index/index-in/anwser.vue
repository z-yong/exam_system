<template>
    <div class="answer-wrapper">
        <div class="topic-box">
            <!-- <div style="display:flex;align-items: center;background:#fff;border-bottom:1px solid #eee;margin-top:2vh"> -->
                    <!-- <div v-for="(menu,mi) in menuList" :key="mi" style="padding:1.2vh 2vw;cursor: pointer;border:1px solid #f7f7f7;" @click="changeMenu(mi)"
                        :style="{background:currentIndex == mi ? '#0070d8' : '',color: currentIndex == mi ? '#fff' : '',opacity: currentIndex == mi ? '0.7' : ''}">{{menu}}</div> -->
                <!-- </div> -->
            <div class="topic">
                <div style="padding:10px 0;color:#0070d8;cursor: pointer;" @click="back">返回上一层</div>
                <div class="topic-item">
                    <!-- <div class="item-name">单选题</div> -->
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-if="!resultData.length" style="color: #999999;text-align:center;margin-top:1vh">无此项题</li>
                            <li v-for="(item,index) in resultData" :key="index">
                                <!-- 单选 -->
                                <div v-if="item.subject.type == 1" class="item-mess">
                                    <div style="margin:0 0 0vh 1vh;">
                                        {{index+1}}、<div v-html="item.subject.title">{{item.subject.title}}</div>
                                        <span>({{item.subject.fraction}}分)</span>
                                    </div>
                                    <div style="margin-top:1vh">A. {{item.subject.a}}</div>
                                    <div>B. {{item.subject.b}}</div>
                                    <div>C. {{item.subject.c}}</div>
                                    <div>D. {{item.subject.d}}</div>
                                    <div style="margin:1vh 0 0 -1vh">
                                        <div>学生答案：<span :class="item.correct == 0 ? 'green' : 'red'">{{item.user_answer}}</span></div>
                                        <div>得分：<span style="color:green;font-weight:600">{{item.score}}</span> 分</div>
                                        <div style="margin-top:10px">正确答案：{{item.answer}}</div>
                                    </div>
                                </div>
                                <!-- 多选 -->
                                <div v-if="item.subject.type == 2" class="item-mess">
                                    <div style="display:flex;margin:0 0 0vh -1vh">
                                        {{index+1}}、<div v-html="item.subject.title">{{item.subject.title}}</div>
                                        <span>({{item.subject.fraction}}分)</span>
                                    </div>
                                    <div style="margin-top:1vh">A. {{item.subject.a}}</div>
                                    <div>B. {{item.subject.b}}</div>
                                    <div>C. {{item.subject.c}}</div>
                                    <div>D. {{item.subject.d}}</div>
                                    <div v-if="item.subject.e">E. {{item.subject.e}}</div>
                                    <div v-if="item.subject.f">F. {{item.subject.f}}</div>
                                    <div v-if="item.subject.g">G. {{item.subject.g}}</div>
                                    <div v-if="item.subject.h">H. {{item.subject.h}}</div>
                                    <div style="margin:1vh 0 0 -1vh">
                                        <div>学生答案：
                                            <span v-for="(d, di) in item.user_answer" :key="di" style="margin-right:1vw"
                                                  :class="duoCorrect(d,item.answer) ? 'green' : 'red'">
                                                {{d}}
                                            </span>
                                        </div>
                                        <div>得分：<span style="color:green;font-weight:600">{{item.score}}</span> 分</div>
                                        <div style="margin-top:10px">正确答案：
                                            <span v-for="(u, ui) in item.answer" :key="ui" style="margin-right:1vw">{{u}}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 填空 -->
                                <div v-if="item.subject.type == 3" class="item-mess">
                                    <div style="display:flex;flex-wrap:wrap; margin:0 0 0vh -1vh">
                                        {{index+1}}、<div v-html="item.subject.title">{{item.subject.title}}</div>
                                        <span>({{item.subject.fraction}}分)</span>
                                        <div style="margin-left:15px;color:red">误差{{item.subject.error}}</div>
                                    </div>
                                    <div style="margin-top:1vh">
                                        <div>学生答案：
                                            <span v-for="(t, ti) in  item.user_answer" :key="ti" style="margin-right:1vw"
                                                  :class="tianCorrect(t,ti,item.answer,item.subject.error) ? 'green' : 'red'">
                                                {{t}}
                                            </span>
                                        </div>
                                        <div>得分：<span style="color:green;font-weight:600">{{item.score}}</span> 分</div>
                                        <div style="margin-top:10px;">正确答案：
                                            <span v-for="(tt,tti) in item.answer" :key="tti" style="margin-right:1vw">{{tt}}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
               
            </div>
        </div>
    </div>
</template>
<style src='./anwser.css' scoped></style>
<script>
export default {
    props: {
        answerData: {
            type: Object
        }
    },
    data(){
        return {
            id: 0,
            // menuList: ['技能','理论'],
            isShow: false,
            cancelShow: true,
            allow: false,
            resultData: [],
            radioData: [],//单选答案
            checkData: [],//多选答案
            gapData: [],//填空答案
            formData: []//总的答案
        }
    },
    methods: {
        back(){
            this.$emit('back')
        },
        //验证多选题学生答案的每一项与正确答案的每一项是否一致
        duoCorrect(item, arr){
            let A = false;
            for (const el of arr){
                if(el == item){
                    A = true;
                }
            }
            return A;
        },
        //验证填空题学生答案的每一项与正确答案相同下标的那一项是否一致
        tianCorrect(item, index, arr, err){
            let A = false;
            const answer = parseFloat(item);
            const num =  parseFloat(err)/100;
            if(answer >= parseFloat(arr[index])-num && answer <= parseFloat(arr[index])+num){
                A = true;
            }
            return A;
        },
        _getData(){
            const data = {
                j_id: this.answerData.j_id, 
                u_id: this.answerData.u_id,
                id: this.answerData.id,
                s_type: this.answerData.s_type_a
            }
            this.axios.post('/admin/user/get_user_answer_card', data).then(res =>{
                // this.radioData = res.data.data.dan;
                // this.checkData = res.data.data.duo;
                // this.gapData = res.data.data.tian;
                this.resultData = res.data.data;
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