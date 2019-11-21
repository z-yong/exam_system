<template>
    <div class="set-wrapper">
        <p class="set-header">
            <span>{{isGetInfo ? topicTitle : (ruleForm.title + ' ' + topicType+'卷')}}</span>
        </p>
        <div v-if="isAllShow" class="issue-box">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">               
                <el-form-item label="标题">
                    <el-input :disabled="disabled" v-model="ruleForm.title" @input="change($event)" placeholder="输入标题"></el-input>
                </el-form-item> 
                <!-- 编辑器 -->
                <div class="editor">
                    <el-form-item label="想定内容">
                        <!-- <el-input type="textarea" v-model="ruleForm.pandect" placeholder="输入标题"></el-input> -->
                        <z-editor :id="tinymce" :tinymceHtml='tinymceHtml' ref="editorHtml"></z-editor>
                     </el-form-item>
                </div>               
                <div v-for="(el,i) in ruleForm.adjun" :key="i" class="topic_ed">
                    <el-form-item label="附件名称" >
                        <el-input type="text" v-model="ruleForm.adjun[i]['adjName']" @input="change($event)" placeholder="请输入附件名称"></el-input>
                    </el-form-item>
                    <div class="editor">
                        <el-form-item label="内容文本" >
                            <z-editor :id="'content' + i" :tinymceHtml='ruleForm.adjun[i].tinymceContent'></z-editor>
                            <!-- <el-input type="textarea" v-model="ruleForm.content" placeholder="请输入题目详解"></el-input> -->
                        </el-form-item>
                    </div>
                </div>
                <div class='adj' :style="{position: absolute ? 'absolute' : 'static',left: absolute ? '3vw' : '', bottom: absolute ? '0px' : ''}">
                    <el-button type="primary" @click="addTopic">保存附件</el-button>
                </div> 
                <div class="new-topic">
                    <div class="topics" v-for="(topicItem,index) in ruleForm.topics" :key="index">
                        <el-form-item label="题目类型">
                            <template>
                                <el-select v-model="ruleForm['topics'][index]['topicType']">
                                    <el-option
                                        v-for="(item,index) in options2"
                                        :key="index"
                                        :value="item.label"
                                        :label="item.label">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item label="难度" :prop="ruleForm['topics'][index]['degree']">
                            <template>
                                <el-select v-model="ruleForm['topics'][index]['degree']" @change="change($event)">
                                    <el-option
                                        v-for="(item,index) in degrees" 
                                        :key="index"
                                        :value="item.label"
                                        :label="item.label">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <div class="editor">        
                            <el-form-item :label="'作业条件'+(index+1)">
                                <z-editor :id="'topic'+index" :tinymceHtml="ruleForm['topics'][index]['tinymceTopic']"></z-editor>
                            </el-form-item>   
                        </div>                  
                        <div class="option" v-if="ruleForm['topics'][index]['topicType'] != '填空题'">
                            <el-form-item label="A：">
                                <el-input type="text" v-model="ruleForm['topics'][index]['optionA']" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="B：">
                                <el-input  type="text" v-model="ruleForm['topics'][index]['optionB']" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="C：">
                                <el-input type="text"  v-model="ruleForm['topics'][index]['optionC']" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="D：">
                                <el-input type="text" v-model="ruleForm['topics'][index]['optionD']" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item v-if="ruleForm['topics'][index]['topicType'] == '多选题'"  label="E：">
                                <el-input type="text" v-model="ruleForm['topics'][index]['optionE']" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item v-if="ruleForm['topics'][index]['topicType'] == '多选题'" label="F：">
                                <el-input type="text" v-model="ruleForm['topics'][index]['optionF']" @input="change($event)"></el-input>
                            </el-form-item>
                        </div>
                        <div class="answer">
                            <el-form-item v-if="ruleForm['topics'][index]['topicType'] == '单选题'" label="正确答案">
                                <el-radio v-model="ruleForm['topics'][index]['correct']" label="A" @change="change($event)">A</el-radio>
                                <el-radio v-model="ruleForm['topics'][index]['correct']" label="B" @change="change($event)">B</el-radio>
                                <el-radio v-model="ruleForm['topics'][index]['correct']" label="C" @change="change($event)">C</el-radio>
                                <el-radio v-model="ruleForm['topics'][index]['correct']" label="D" @change="change($event)">D</el-radio>
                                <!-- <el-checkbox-group v-if="ruleForm['topics'][index]['topicType'] == '多选题'" v-model="ruleForm['topics'][index]['checkList']">
                                    <el-checkbox label="A" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="B" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="C" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="D" @change="change($event)"></el-checkbox>
                                </el-checkbox-group> -->
                            </el-form-item>
                            <el-form-item v-if="ruleForm['topics'][index]['topicType'] == '多选题'" label="正确答案">
                                <el-checkbox-group v-model="ruleForm['topics'][index]['checkList']">
                                    <el-checkbox label="A" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="B" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="C" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="D" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="E" @change="change($event)"></el-checkbox>
                                    <el-checkbox label="F" @change="change($event)"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <div class="gap">
                                <el-form-item v-if="ruleForm['topics'][index]['topicType'] == '填空题'" label="正确答案">
                                    <el-input v-model="ruleForm['topics'][index]['gap']" @input="change($event)"></el-input>
                                    <span class="gap-desc">精确到 0.1</span>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="grade">
                            <el-form-item label="分数">
                                    <el-input type="number" @input="change($event)" v-model="ruleForm['topics'][index]['grade']"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="btnbtn" :style="{position: absolute ? 'absolute' : 'static',left: absolute ? '9vw' : '', bottom: absolute ? '5vh' : ''}">    
                    <el-button type="primary" @click="goOnQua">保存作业条件</el-button>                
                </div>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">{{submitText}}</el-button>
                </el-form-item>
                <!-- <el-dialog title="考试时间" :visible.sync="dialogFormVisible">
                    <el-form-item label="考试日期" prop="date">
                        <div class="block">
                            <el-date-picker
                                v-model="ruleForm.date"
                                type="datetime"
                                placeholder="请填写开始考试日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="审核" prop="way">
                            <el-select v-model="ruleForm.way" placeholder="请选择阅卷方式">
                                <el-option
                                    v-for="item in ways" 
                                    :key="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitTure">提 交</el-button>
                    </div>
                </el-dialog> -->
            </el-form>
        </div>
         <!-- 初始化页面对话框 -->
        <el-dialog title="提示" :visible.sync="dialogFormVisible0" :close-on-click-modal='false' :show-close='false'>
            <span class="dia-content"> 您的上一次出题内容系统已为您保留，请选择：</span>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="clearData">清除并重新出题</el-button>
                <el-button type="primary" @click="goOn">继续出题</el-button>
            </div>
        </el-dialog>
            <!-- 最后确认对话框 -->
            <el-dialog title="提示" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
            <span>是否确认提交？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitTure">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
    @import './setTopic.css';
</style>
<script>
import Editor from '../Editor'
import tinymce from 'tinymce/tinymce'
export default {
    props: {
        topicType: {
            type: String,
            required: true
        },
        topicTitle: {
            type: String,
            required: true
        },
        isGetInfo: {
            type: Boolean,
            required: true
        },
        topicID: {
            type: Number,
            required: true
        },
        outline: {
            type: String,
            required: true
        },
        topicName: {
            type: String,
            required: true
        }
    },
    // props: ['topicType','topicTitle','isGetInfo','topicID','outline','topicName'],
    components: {
        "z-editor": Editor
    },
    data(){
        return {
            isAllShow: false,
            absolute: true,
            postTopic: false,
            postAdjun: false,
            submitText: '生成试卷',
            id: '',
            tinymce: 'tinymce',
            content: 'content',
            z_topic: 'z-topic',
            tinymceHtml: '',
            dialogFormVisible: false,
            dialogFormVisible0: false,
            isAddTopic: false,
            disabled: false,
            adjunNum: 0,
            options2: [
                        {
                        label: '单选题'
                    }, {
                        label: '多选题'
                    }, {
                        label: '填空题'
                    }
                ],
            degrees: [
                        {
                        label: '一般'
                    }, {
                        label: '普通难度'
                    }, {
                        label: '较难'
                    },{
                        label: '最高难度'
                    }
                ],
            ways: [
                {value: '人工阅卷'},
                {value: '电脑阅卷'}
            ],
            // editorText: '直接初始化值', // 双向同步的变量
            // editorTextCopy: '',  // content-change 事件回掉改变的对象
            ruleForm: {
                    id: 0,
                    title: '',
                    topicNum: 1,
                    topics: [],
                    adjun: []
                },
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                adjunct: [
                    { required: true, message: '请选择或创建附件', trigger: 'blur' }
                ],
                adjName: [
                    { required: true, message: '请输入附件名称', trigger: 'blur' }
                ],
                topicName: [
                    { required: true, message: '请填写作业条件', trigger: 'blur' }
                ],
                time: [
                    { required: true, message: '请填写此卷考试时长', trigger: 'blur' }
                ],
                topic: [
                    { required: true, message: '请出题', trigger: 'blur' }
                ],
                optionA: [
                    { required: true, message: '请填写A选项内容', trigger: 'blur' }
                ],
                optionB: [
                    { required: true, message: '请填写B选项内容', trigger: 'blur' }
                ],
                optionC: [
                    { required: true, message: '请填写C选项内容', trigger: 'blur' }
                ],
                optionD: [
                    { required: true, message: '请填写D选项内容', trigger: 'blur' }
                ],
                optionE: [
                    { message: '请填写E选项内容', trigger: 'blur' }
                ],
                optionF: [
                    { message: '请填写F选项内容', trigger: 'blur' }
                ],
                grade: [
                    { required: true, message: '请填写此题分数', trigger: 'blur' }
                ],
                gap: [
                    { required: true, message: '请填写正确答案', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // editor组件事件监听
        _getMess(tiny){
            let content = tinymce.get(tiny).getContent()
            content = content.replace(/<[^>]+>/g,'')
            return content
        },
        _getTinyMess(){          
            tinymce.activeEditor.getContent();
        },
        // 作业条件（出题）
        goOnQua(){
            this.absolute = false;
            if(!this.ruleForm.topics.length){
                if(!this.ruleForm.title){
                    this.$message({
                        message: '请输入考卷标题',
                        type: 'error'
                    })
                    return
                }else if(!this.ruleForm.id && this.isGetInfo){
                    const data = {
                        title: this.ruleForm.title,
                        outline: tinymce.editors['tinymce'].getContent(),
                        simulation: this.topicTitle == '正式考卷' ? 0 : 1
                    }
                    if(!data.outline){
                        this.$message({
                            message: '请输入附件内容!',
                            type: 'error'
                        })
                        return
                    }       
                    this.axios.post('/admin/issue/issue',data).then(res =>{
                        this.ruleForm.id = res.data.msg;
                        this.ruleForm.topics.push({ tinymceTopic: '', t_id:'', topicType: '单选题', degree: '一般', topic: '', correct: "A", optionA: '', optionB: '', 
                                                optionC: '', optionD: '', optionE: '', optionF: '', grade: 0, checkList: ['A'], gap: ''})
                    })
                }else{//如果已经创建该试卷 获取到其id
                    this.ruleForm.topics.push({ tinymceTopic: '', t_id:'', topicType: '单选题', degree: '一般', topic: '', correct: "A", optionA: '', optionB: '', 
                                                optionC: '', optionD: '', optionE: '', optionF: '', grade: 0, checkList: ['A'], gap: ''})
                }
            }else if(this.postTopic){ //如果是继续出题 如果之前已经有了题目第一次就不上传 否则就会重复
                this.postTopic = false;
                this.ruleForm.topics.push({ tinymceTopic: '', t_id:'', topicType: '单选题', degree: '一般', topic: '', correct: "A", optionA: '', optionB: '', 
                                                optionC: '', optionD: '', optionE: '', optionF: '', grade: 0, checkList: ['A'], gap: ''})
            }else{
                const len = this.ruleForm.topics.length;
                const currentTopic = this.ruleForm.topics[len-1];
                let type = '';
                let difficulty = '';
                let answer = '';
                if(!tinymce.editors['topic'+(len-1)].getContent()){
                    this._isEmpty("请出题!")
                    return
                }
                if(currentTopic.topicType == '单选题' || currentTopic.topicType == '多选题'){
                    if(!currentTopic.optionA){
                        this._isEmpty('请填写A选项!')
                        return
                    }
                    if(!currentTopic.optionB){
                        this._isEmpty('请填写B选项!')
                        return
                    }
                    if(!currentTopic.optionC){
                        this._isEmpty('请填写C选项!')
                        return
                    }
                    if(!currentTopic.optionD){
                        this._isEmpty('请填写D选项!')
                        return
                    }
                }
                if(currentTopic.topicType == '单选题'){
                    type = 1;
                    answer = currentTopic.correct;
                }else if (currentTopic.topicType == '多选题'){
                    type = 2;
                    answer = currentTopic.checkList;
                    if(!currentTopic.optionE){
                        this._isEmpty('请填写E选项!')
                        return
                    }
                    if(!currentTopic.optionF){
                        this._isEmpty('请填写F选项!')
                        return
                    }
                }else if(currentTopic.topicType == '填空题'){
                    type = 3;
                    answer = currentTopic.gap;
                }
                if(currentTopic.degree == '一般') difficulty = 1;
                if(currentTopic.degree == '普通难度') difficulty = 2;
                if(currentTopic.degree == '较难') difficulty = 3;
                if(currentTopic.degree == '最高难度') difficulty = 4;
                const s_id = this.ruleForm.id;
                const title = tinymce.editors['topic'+(len-1)].getContent();
                const a = currentTopic.optionA;
                const b = currentTopic.optionB;
                const c = currentTopic.optionC;
                const d = currentTopic.optionD;
                const e = currentTopic.optionE;
                const f = currentTopic.optionF;
                const fraction = currentTopic.grade
                if(!answer.length){
                    this._isEmpty('请填写正确答案!')
                    return
                }
                if(!fraction){
                    this._isEmpty('请填写此题分数!');
                    return
                }
                const data = {
                    s_id,
                    title,
                    type,
                    difficulty,
                    a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    answer,
                    fraction
                }
                if(!this.isGetInfo){
                    data.s_id = this.topicID;
                    data.s_type = this.topicType;
                }
                this.axios.post('/admin/issue/subject',data).then(res =>{
                    this.ruleForm.topics.push({ tinymceTopic: '', t_id:'', topicType: '单选题', degree: '一般', topic: '', correct: "A", optionA: '', optionB: '', 
                                                optionC: '', optionD: '', optionE: '', optionF: '', grade: '', checkList: ['A'], gap: ''})
                })
            }
            

        },
        // 添加附件 /////如果adjunNum为0 就把标题和想定内容post上去
        addTopic(){
            if(!this.ruleForm.adjun.length){
                if(!this.ruleForm.title){
                    this.$message({
                        message: '请输入考卷标题',
                        type: 'error'
                    })
                    return
                }else if(!this.ruleForm.id && this.isGetInfo){
                    const data = {
                        title: this.ruleForm.title,
                        outline: tinymce.editors['tinymce'].getContent(),
                        simulation: this.topicTitle == '正式考卷' ? 0 : 1
                    }
                    if(!data.outline){
                        this.$message({
                            message: '请输入想定内容!',
                            type: 'error'
                        })
                        return
                    }
                    this.axios.post('/admin/issue/issue',data).then(res =>{
                        this.ruleForm.id = res.data.msg;
                        this.ruleForm.adjun.push({adjName: '', f_id: '', tinymceContent: ''});
                    })
                }else{
                    this.ruleForm.adjun.push({adjName: '', f_id: '', tinymceContent: ''});
                }
            }else if(this.postAdjun){//如果是继续出题 如果之前已经有了附件第一次就不上传 否则就会重复
                this.postAdjun = false;
                this.ruleForm.adjun.push({adjName: '', f_id: '', tinymceContent: ''});
            }else{
                const len = this.ruleForm.adjun.length;
                const data = {
                    content: tinymce.editors['content' + (len-1)].getContent(),
                    s_id: this.ruleForm.id,
                    title: this.ruleForm.adjun[len-1].adjName
                };
                if(!this.isGetInfo){
                    data.s_id = this.topicID;
                    data.s_type = this.topicType;
                }
                if(!data.title){
                    this._isEmpty('请输入附件名称!')
                    return
                }
                if(!data.content){
                    this._isEmpty('请输入附件内容!')
                    return
                }
                this.axios.post('/admin/issue/enclosure',data).then(res =>{
                    this.ruleForm.adjun.push({adjName: '', f_id: '', tinymceContent: ''});
                })
            }
        },
        // 最终提交
        submitTure(){
            // 在这里请求接口 失败不要删除
            const outline = tinymce.editors['tinymce'].getContent();
            const title = this.ruleForm.title;
            const id = this.ruleForm.id;
            const enclosure = [];
            const subject = [];
            this.ruleForm.adjun.forEach((ele,index) =>{
                enclosure[index] = {};
                enclosure[index].title = ele.adjName;
                enclosure[index].content = tinymce.editors['content'+index].getContent();
                enclosure[index].id = ele.f_id
            })
            if(enclosure.length){
                const enc = enclosure[enclosure.length-1];
                if(!enc.title) return this._isEmpty('请输入附件名称!',true);
                if(!enc.content) return this._isEmpty('请输入附件内容!',true);
            }
            this.ruleForm.topics.forEach((ele,index) =>{
                subject[index] = {};
                let type = 0;
                subject[index].title = tinymce.editors['topic'+index].getContent();
                if(ele.topicType == '单选题') {
                    type = 1;
                    subject[index].answer = ele.correct;
                }
                if(ele.topicType == '多选题') {
                    type = 2;
                    subject[index].answer = ele.checkList;
                }
                if(ele.topicType == '填空题') {
                    type = 3;
                    subject[index].answer = ele.gap;
                }
                subject[index].type = type;
                subject[index].difficulty = ele.degree;
                subject[index].fraction = ele.grade;
                subject[index].id = ele.t_id;
                subject[index].a = ele.optionA
                subject[index].b = ele.optionB
                subject[index].c = ele.optionC
                subject[index].d = ele.optionD
                subject[index].e = ele.optionE
                subject[index].f = ele.optionF
            })
            if(subject.length){
                const sub = subject[subject.length-1];
                if(!sub.title) return this._isEmpty('请出最后一题！',true);
                if(sub.type == 1){
                    if(!sub.a) return this._isEmpty('请填写A选项！',true);
                    if(!sub.b) return this._isEmpty('请填写B选项！',true);
                    if(!sub.c) return this._isEmpty('请填写C选项！',true);
                    if(!sub.d) return this._isEmpty('请填写D选项！',true);
                }else if(sub.type == 2){
                    if(!sub.a) return this._isEmpty('请填写A选项！',true);
                    if(!sub.b) return this._isEmpty('请填写B选项！',true);
                    if(!sub.c) return this._isEmpty('请填写C选项！',true);
                    if(!sub.d) return this._isEmpty('请填写D选项！',true);
                    if(!sub.e) return this._isEmpty('请填写E选项！',true);
                    if(!sub.f) return this._isEmpty('请填写F选项！',true);
                }
                if(!sub.answer) return this._isEmpty('请填写正确答案！',true);
                if(!sub.fraction) return this._isEmpty('请填写此题分数！',true);
            }
            const data = {
                id,
                outline,
                title,
                enclosure,
                subject
            }
            if(!this.isGetInfo){
                data.id = this.topicID;
                // data.s_type = this.topicType;
                if(this.outline != '修改'){
                    data.s_type = this.topicType;
                }
            }
            this.axios.post('/admin/issue/preservation',data).then(res =>{
                tinymce.editors['tinymce'].setContent('');
                if(this.isGetInfo){
                    this.dialogFormVisible = false;
                    console.log(this.tinymceHtml)
                    this.ruleForm = {id: 0, title: '', topicNum: 1, topics: [], adjun: []};
                    this.$message({
                        message: '辛苦了,此试卷创建成功! 您可以继续创建试卷!',
                        type: 'success'
                    })
                    return
                }else{
                    this.dialogFormVisible = false;
                    let title = '';
                    if(res.data.data == 0){
                        title = '正式考卷列表'
                    }else if(res.data.data == 1){
                        title = '模拟考卷列表'
                    } 
                    if(this.outline == '修改'){
                        this.$message({
                            message: `辛苦了,${this.ruleForm.title+this.topicType}卷 保存成功!`,
                            type: 'success'
                        })
                    }else{
                        this.$message({
                            message: `辛苦了,${this.ruleForm.title+this.topicType}卷 创建成功!`,
                            type: 'success'
                        })
                    }
                    this.$emit('gotoTopicTable',{title})
                }
            })
        },
        // 判断提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.dialogFormVisible = true
            } else {
                return false;
            }
            });
        },
        // 清除并重新出题
        clearData(){
            this.axios.post('/admin/issue/emptyIssue?id='+this.id).then(res =>{
                this.dialogFormVisible0 = false;
                this.isAllShow = true;
                this.absolute = true;
            })
            
        },
        // 继续出题
        goOn(){
            this.axios.get('/admin/issue/proceed?id='+this.id).then(res =>{
                this.absolute = false; 
                // const enclosure = res.data.data.enclosure;
                // const subject = res.data.data.subject
                this._getData(res.data.data.enclosure,res.data.data.subject);
                this.ruleForm.id = res.data.data.id;
                this.ruleForm.title = res.data.data.title;
                this.tinymceHtml = res.data.data.outline;
                this.dialogFormVisible0 = false;   
            })
        },
        change(e){
            this.$forceUpdate()
        },
        _getData(enclosure,subject){
            enclosure.forEach((ele,index) =>{
                this.ruleForm.adjun[index] = {}
                this.ruleForm.adjun[index]['adjName'] = ele.title;
                this.ruleForm.adjun[index]['tinymceContent'] = ele.content;
                // tinymce.editors['tinymce'].setContent(ele.content)
                this.ruleForm.adjun[index].f_id = ele.id
            })
            console.log(enclosure)
            subject.forEach((ele,index) =>{
                this.ruleForm.topics[index] = {};
                this.ruleForm.topics[index]['tinymceTopic'] = ele.title;
                //tinymce.editors['topic'+index].setContent(ele.tm.title)
                this.ruleForm.topics[index]['topicType'] = ele.type;
                this.ruleForm.topics[index]['degree'] = ele.difficulty;
                this.ruleForm.topics[index]['grade'] = ele.fraction;
                this.ruleForm.topics[index]['t_id'] = ele.id
                if(ele.type == '单选题' || ele.type == '多选题'){
                    this.ruleForm.topics[index]['optionA'] = ele.a;
                    this.ruleForm.topics[index]['optionB'] = ele.b;
                    this.ruleForm.topics[index]['optionC'] = ele.c;
                    this.ruleForm.topics[index]['optionD'] = ele.d;
                    this.ruleForm.topics[index]['optionE'] = ele.e;
                    this.ruleForm.topics[index]['optionF'] = ele.f;
                    if(ele.type == '单选题'){
                        this.ruleForm.topics[index]['correct'] = ele.answer[0]
                    }else if(ele.type == '多选题'){
                        this.ruleForm.topics[index]['checkList'] = ele.answer
                    }
                }else{
                    this.ruleForm.topics[index]['gap'] = ele.answer[0]
                }
            })
            // 如果作业条件或者添加附件有内容的话 第一次点击作业条件无需post
            if(enclosure.length){
                this.postAdjun = true;
            }
            if(subject.length){
                this.postTopic = true;
            }
            this.isAllShow = true
        },
        _isEmpty(message,close=false){
            this.$message({
                message,
                type: 'error'
            })
            if(close){
                this.dialogFormVisible = false
            }
        },
        _getInfo(){
            let data = {};
            if(this.topicTitle == '正式考卷'){
                data.simulation = 0;
            }else if(this.topicTitle == '模拟考卷'){
                data.simulation = 1;
            }
            this.axios.get('/admin/issue/testing?simulation='+data.simulation).then(res =>{
                console.log(res)
                if(res.data.code == 200){
                    this.isAllShow = false;
                    this.id = res.data.data;
                    this.dialogFormVisible0 = true;
                }else{
                    this.isAllShow = true;
                }
            })
        }
    },
    created(){
        if(this.isGetInfo){
            this._getInfo();
        }else{
            if(this.outline == '修改'){
                this.axios.get('/admin/issue/editAbcIssue?id='+this.topicID+'&s_type='+this.topicType).then(res =>{
                    console.log(res)
                    this.absolute = false;
                    // const enclosure = res.data.data.enclosure;
                    // const subject = res.data.data.subject
                    this._getData(res.data.data.enclosure, res.data.data.subject);
                    this.ruleForm.id = res.data.data.id;
                    this.ruleForm.title = res.data.data.title;
                    this.tinymceHtml = res.data.data.outline;
                    this.submitText = '保存修改'
                })
            }else{
                this.isAllShow = true;
                this.ruleForm.title = this.topicName;
                this.tinymceHtml = this.outline;
                this.disabled = true;
            } 
        }
    }
}
</script>