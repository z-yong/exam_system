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
                    <div class="item-name">单选题</div>
                    <div class="topic-content-wrapper">
                        <ul class="topic-content-ul">
                            <li v-if="!radioData.length" style="color: #999999;text-align:center;margin-top:1vh">无此项题</li>
                            <li v-for="(dan,di) in radioData" :key="di">
                                <div class="item-mess">
                                    <div style="margin:0 0 1vh -1vh;">
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
                                    </div>
                                    <span>({{duo.subject.fraction}}分)</span>
                                    <div>A. {{duo.subject.a}}</div>
                                    <div>B. {{duo.subject.b}}</div>
                                    <div>C. {{duo.subject.c}}</div>
                                    <div>D. {{duo.subject.d}}</div>
                                    <div v-if="duo.subject.e">E. {{duo.subject.e}}</div>
                                    <div v-if="duo.subject.f">F. {{duo.subject.f}}</div>
                                    <div v-if="duo.subject.g">G. {{duo.subject.g}}</div>
                                    <div v-if="duo.subject.h">H. {{duo.subject.h}}</div>
                                    <div style="margin:1vh 0 0 -1vh">
                                        <div>学生答案: 
                                            <span v-for="(d, di) in duo.user_answer" :key="di" style="margin-right:1vw"
                                                  :class="duoCorrect(d,duo.answer) ? 'green' : 'red'">
                                                {{d}}
                                            </span>
                                        </div>
                                        <div style="margin-top:10px">正确答案:
                                            <span v-for="(u, ui) in duo.answer" :key="ui" style="margin-right:1vw">{{u}}</span>
                                        </div>
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
                                    <div style="display:flex;flex-wrap:wrap; margin:0 0 1vh -1vh">
                                        {{ti+1}}、<div v-html="tian.subject.title">{{tian.subject.title}}</div>
                                        <span>({{tian.subject.fraction}}分)</span>
                                        <div style="margin-left:15px;color:red">误差{{tian.subject.error}}</div>
                                    </div>
                                    <div>
                                        <div>学生答案: 
                                            <span v-for="(t, ti) in  tian.user_answer" :key="ti" style="margin-right:1vw"
                                                  :class="tianCorrect(t,tian.answer,tian.subject.error) ? 'green' : 'red'">
                                                {{t}}
                                            </span>
                                        </div>
                                        <div style="margin-top:10px">正确答案:
                                            <span v-for="(tt,tti) in tian.answer" :key="tti" style="margin-right:1vw">{{tt}}</span>
                                        </div>
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
<style src='./anwser.css' scoped></style>
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
        //验证填空题学生答案的每一项与正确答案的每一项是否一致
        tianCorrect(item, arr, err){
            let A = false;
            const answer = parseFloat(item);
            for (const el of arr) {
                let num =  parseFloat(err)/100;
                if(answer >= parseFloat(el)-num && answer <= parseFloat(el)+num){
                    A = true;
                }
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