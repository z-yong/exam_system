<template>
    <div class="set-wrapper">
        <div class="set-header" id="set_head" :class="fixed ? 'fixed' : ''">
            <div class="title">{{isGetInfo ? topicTitle : (ruleForm.title + ' ' + topicType+'卷')}}</div>
            <div class="btn-header">
                <div class='adj'>
                    <el-button type="primary" @click="createAdjunct">{{ruleForm.adjun.length ? '保存并继续创建附件' : '创建附件'}}</el-button>
                </div>
                <div class="btnbtn">    
                    <el-button type="primary" @click="createConditions">创建作业条件</el-button>                
                </div>
                <div class="btnbtn">
                    <el-button type="primary" @click="submitForm('ruleForm')">{{submitText}}</el-button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                </div>
            </div>
        </div>
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
                    <div class="btnbtn">    
                        <el-button type="primary" @click="delAdjunct(el,i)">删除此附件</el-button>                
                    </div>
                </div>
                
                <div v-if="ruleForm.topics.length" class="new-topic">
                    <div class="topics" v-for="(topicItem,index) in ruleForm.topics" :key="index">
                        <div class="editor">        
                            <el-form-item :label="'作业条件'+(index+1)">
                                <z-editor :id="'topic'+index" :tinymceHtml="ruleForm['topics'][index].content"></z-editor>
                            </el-form-item>   
                        </div>
                        <div style="display:flex">
                            <div class="btnbtn" style="margin:2vh 6vw">    
                                <el-button type="primary" @click="saveConditions(topicItem,index)">保存作业条件并出题</el-button>                
                            </div>
                            <div class="btnbtn" style="margin:2vh 0vw">    
                                <el-button type="primary" @click="delConditions(topicItem,index)">删除此作业条件</el-button>                
                            </div>
                        </div>
                        <div v-if="ruleForm['topics'][index].topicArr.length">
                            <div v-for="(topic, i) in ruleForm['topics'][index].topicArr" :key="i">
                                <el-form-item label="题目类型">
                                    <template>
                                        <el-select v-model="topic.type">
                                            <el-option v-for="(item,index) in options2" :key="index" :value="item.label" :label="item.label"></el-option>
                                        </el-select>
                                    </template>
                                </el-form-item>
                                <el-form-item label="难度" :prop="topic.difficulty">
                                    <template>
                                        <el-select v-model="topic.difficulty" @change="change($event)">
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
                                    <el-form-item :label="(index+1)+'-'+(i+1)">
                                        <z-editor :id="'topic'+index+'-'+i" :tinymceHtml="topic.title"></z-editor>
                                    </el-form-item>   
                                </div>                
                                <div class="option" v-if="topic.type != '填空题'">
                                    <el-form-item label="A：">
                                        <el-input type="text" v-model="topic.a" @input="change($event)"></el-input>
                                    </el-form-item>
                                    <el-form-item label="B：">
                                        <el-input type="text" v-model="topic.b" @input="change($event)"></el-input>
                                    </el-form-item>
                                    <el-form-item label="C：">
                                        <el-input type="text" v-model="topic.c" @input="change($event)"></el-input>
                                    </el-form-item>
                                    <el-form-item label="D：">
                                        <el-input type="text" v-model="topic.d" @input="change($event)"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="topic.type == '多选题'"  label="E：">
                                        <el-input type="text" v-model="topic.e" @input="change($event)"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="topic.type == '多选题'" label="F：">
                                        <el-input type="text" v-model="topic.f" @input="change($event)"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="answer">
                                    <el-form-item v-if="topic.type == '单选题'" label="正确答案">
                                        <el-radio v-model="topic.danxuan" label="A" @change="change($event)">A</el-radio>
                                        <el-radio v-model="topic.danxuan" label="B" @change="change($event)">B</el-radio>
                                        <el-radio v-model="topic.danxuan" label="C" @change="change($event)">C</el-radio>
                                        <el-radio v-model="topic.danxuan" label="D" @change="change($event)">D</el-radio>
                                        <!-- <el-checkbox-group v-if="ruleForm['topics'][index]['topicType'] == '多选题'" v-model="ruleForm['topics'][index]['checkList']">
                                            <el-checkbox label="A" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="B" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="C" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="D" @change="change($event)"></el-checkbox>
                                        </el-checkbox-group> -->
                                    </el-form-item>
                                    <el-form-item v-if="topic.type == '多选题'" label="正确答案">
                                        <el-checkbox-group v-model="topic.duoxuan">
                                            <el-checkbox label="A" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="B" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="C" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="D" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="E" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="F" @change="change($event)"></el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <div class="gap">
                                        <el-form-item v-if="topic.type == '填空题'" label="正确答案">
                                            <el-input v-model="topic.tiankong" type="number" @input="change($event)"></el-input>
                                            <el-input v-model="topic.error" type="number" placeholder="请给出误差" @input="change($event)"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="grade">
                                    <el-form-item label="分数">
                                            <el-input type="number" @input="change($event)" v-model="topic.fraction"></el-input>
                                    </el-form-item>
                                </div>
                                <div style="display:flex">
                                    <div class="btnbtn" style="margin:2vh 6vw">    
                                        <el-button type="primary" @click="saveQua(topic,index,i)">保存此题并出下一题</el-button>                
                                    </div>
                                    <div class="btnbtn" style="margin:2vh 0vw">    
                                        <el-button type="primary" @click="delQua(topic,index,i)">删除此题</el-button>                
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
                
                
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
import { Loading } from 'element-ui';
let loadingInstance;
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
            fixed: false,
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
        // 创建作业条件
        createConditions(){
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
                            message: '请输入想定内容!',
                            type: 'error'
                        })
                        return
                    }
                    this.axios.post('/admin/issue/issue',data).then(res =>{
                        this.ruleForm.id = res.data.msg;
                        this.ruleForm.topics.push({content: '',topicArr: []});
                    })
                }else{
                    this.ruleForm.topics.push({content: '',topicArr: []});
                }
            }else{
                this.ruleForm.topics.push({content: '',topicArr: []})
            }
        },
        // 保存作业条件
        saveConditions(item,index){
            const content = tinymce.editors['topic'+index].getContent();
            if(!content){
                this._isEmpty('请填写作业条件')
                return
            }
            const data = {
                content,
                s_id: this.ruleForm.id
            }
            if(!this.isGetInfo){
                data.s_id = this.topicID;
                data.s_type = this.topicType;
            }
            this.axios.post('/admin/issue/condition',data).then(res =>{
                if(res.data.code == 200){
                    this.ruleForm.topics[index].id = res.data.msg;
                    this.ruleForm.topics[index].topicArr.push({id: '',title: '',type:'单选题',difficulty: '一般',c_id:res.data.msg,
                    danxuan:'',duoxuan: [],tiankong:'',a: '',b:'',c:'',d:'',e:'',f:'',answer:'',fraction: '',error:''})
                }
            })
        },
        // 删除作业条件
        delConditions(item,index){
            if(item.id){
                this.axios.post('/admin/issue/condition_delete',{id:item.id}).then(res =>{
                    this._isEmpty(res.data.msg)
                    if(res.data.code == 200){
                        this.ruleForm.topics.splice(index,1)
                    }
                })
            }else{
                this.ruleForm.topics.splice(index,1)
                this._isEmpty('删除成功')
            }
        },
        // 保存题目
        saveQua(item,index,i){
            const title = tinymce.editors['topic'+index+'-'+i].getContent();
            let type, difficulty,answer;
            if(!title) return this._isEmpty('请填写题目');
            if(item.type == '多选题' || item.type == '单选题'){
                if(!item.a) return this._isEmpty('请填写A选项');
                if(!item.b) return this._isEmpty('请填写B选项');
                if(!item.c) return this._isEmpty('请填写C选项');
                if(!item.d) return this._isEmpty('请填写D选项');
            }
            if(item.type == '多选题'){
                if(!item.e) return this._isEmpty('请填写E选项');
                if(!item.f) return this._isEmpty('请填写F选项');
            }
            if(!item.fraction) return this._isEmpty('请填写分数');
            if(item.type == '单选题'){
                type = 1;
                answer = item.danxuan;
            } 
            if(item.type == '多选题'){
                 type = 2;
                 answer = item.duoxuan;
            }
            if(item.type == '填空题'){
                 type = 3;
                 answer = item.tiankong;
            }
            if(!answer.length) return this._isEmpty('请填写答案');
            if(item.difficulty == '一般') difficulty = 1;
            if(item.difficulty == '普通难度') difficulty = 1;
            if(item.difficulty == '较难') difficulty = 1;
            if(item.difficulty == '最高难度') difficulty = 1;
            const data = {
                title, a:item.a, b:item.b, c:item.c, d:item.d, e:item.e, f:item.f, fraction: item.fraction, answer,c_id:item.c_id,type,difficulty
            }
            this.axios.post('/admin/issue/subject',data).then(res =>{
               this.ruleForm.topics[index].topicArr[i].id = res.data.msg;
               this.ruleForm.topics[index].topicArr.push({id: res.data.msg,title: '',type:'单选题',difficulty: '一般',c_id:item.c_id,
                    danxuan:'',duoxuan: [],tiankong:'', a: '',b:'',c:'',d:'',e:'',f:'',answer:'',fraction: '',error:''})
            })
        },
        // 删除附件
        delAdjunct(item,index){
            if(item.id){
                this.axios.post('/admin/issue/enclosure_delete',{id:item.id}).then(res =>{
                    this._isEmpty(res.data.msg)
                    if(res.data.code == 200){
                        this.ruleForm.adjun.splice(index,1);
                    }
                })
            }else{
                this.ruleForm.adjun.splice(index,1);
                this._isEmpty('删除成功')
            }
        },
        // 删除题目
        delQua(item,index){
            console.log(item)
            if(item.id){
                this.axios.post('/admin/issue/subject_delete',{id:item.id}).then(res =>{
                    this._isEmpty(res.data.msg)
                    if(res.data.code == 200){
                        this.ruleForm.topics[index].topicArr.splice(index,1)
                    }
                })
            }else{
                this.ruleForm.topics[index].topicArr.splice(index,1)
                this._isEmpty('删除成功')
            }
        },
        // 添加附件 /////如果adjunNum为0 就把标题和想定内容post上去
        createAdjunct(){
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
                        this.ruleForm.adjun.push({adjName: '', id: '', tinymceContent: ''});
                    })
                }else{
                    this.ruleForm.adjun.push({adjName: '', id: '', tinymceContent: ''});
                }
            }else if(this.postAdjun){//如果是继续出题 如果之前已经有了附件第一次就不上传 否则就会重复
                this.postAdjun = false;
                this.ruleForm.adjun.push({adjName: '', id: '', tinymceContent: ''});
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
                    console.log(res)
                    if(res.data.code == 200){
                        const len = this.ruleForm.adjun.length - 1;
                        this.ruleForm.adjun[len].id = res.data.msg;
                        this.ruleForm.adjun.push({adjName: '', id: '', tinymceContent: ''});
                    }
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
            const conditions = [];
            this.ruleForm.adjun.forEach((ele,index) =>{
                enclosure[index] = {};
                enclosure[index].title = ele.adjName;
                enclosure[index].content = tinymce.editors['content'+index].getContent();
                enclosure[index].id = ele.id
            })
            let i = 0;
            for (const iterator of this.ruleForm.topics) {
                conditions[i] = {};
                conditions[i].content = tinymce.editors['topic'+i].getContent();
                conditions[i].id = iterator.topicArr[0].c_id;
                if(!conditions[i].content) return this._isEmpty('请输入作业条件!');
                let j = 0;
                conditions[i].subject = [];
                for (const item of iterator.topicArr) {
                    conditions[i].subject[j] = item;
                    conditions[i].subject[j].title = tinymce.editors['topic'+i+'-'+j].getContent();
                    if(item.type == '单选题'){
                        conditions[i].subject[j].type = '1';
                        conditions[i].subject[j].answer = item.danxuan;
                    }else if(item.type == '多选题'){
                        conditions[i].subject[j].type = '2';
                        conditions[i].subject[j].answer = item.duoxuan;
                    }else{
                        conditions[i].subject[j].type = '3';
                        conditions[i].subject[j].answer = item.tiankong;
                    }
                    if(item.difficulty == '一般'){
                        conditions[i].subject[j].difficulty = '1';
                    }else if(item.difficulty == '普通难度'){
                        conditions[i].subject[j].difficulty = '2';
                    }else if(item.difficulty == '较难'){
                        conditions[i].subject[j].difficulty = '3';
                    }else{
                        conditions[i].subject[j].difficulty = '4';
                    }
                    delete conditions[i].subject[j].danxuan;
                    delete conditions[i].subject[j].duoxuan;
                    delete conditions[i].subject[j].tiankong;
                    j ++;
                }
                i ++;
            }
            const data = {
                id,
                outline,
                title,
                enclosure,
                conditions
            }
            if(!this.isGetInfo){
                data.id = this.topicID;
                // data.s_type = this.topicType;
                if(this.outline != '修改'){
                    data.s_type = this.topicType;
                }
            }
            this.axios.post('/admin/issue/preservation',data).then(res =>{
                if(res.data.code == 200){
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
            this.dialogFormVisible0 = false;  
            loadingInstance = Loading.service({
                lock: true,
                text: '加载中...',
                background: 'rgba(0,0,0,0.7)'
            });
            this.axios.get('/admin/issue/proceed?id='+this.id).then(res =>{
                this.absolute = false;
                const enclosure = res.data.data.enclosure;
                const condition = res.data.data.condition;
                this.ruleForm.id = res.data.data.id;
                this.ruleForm.title = res.data.data.title;
                this.tinymceHtml = res.data.data.outline;
                this._getData(enclosure,condition);
            })
        },
        change(e){
            this.$forceUpdate()
        },
        _getData(enclosure,condition){
            enclosure.forEach((ele,index) =>{
                this.ruleForm.adjun[index] = {}
                this.ruleForm.adjun[index]['adjName'] = ele.title;
                this.ruleForm.adjun[index]['tinymceContent'] = ele.content;
                this.ruleForm.adjun[index].id = ele.id
            })
            condition.forEach((ele,index) =>{
                this.ruleForm.topics[index] = {};
                this.ruleForm.topics[index]['content'] = ele.content;
                this.ruleForm.topics[index].topicArr = ele.subject;
                this.ruleForm.topics[index].topicArr.forEach((el,i) =>{
                    if(el.type == '单选题'){
                        el.danxuan = el.answer
                    }else if(el.type == '多选题'){
                        el.duoxuan = el.answer
                    }else{
                        el.tiankong = el.answer
                    }
                })
            })
            // 如果作业条件或者添加附件有内容的话 第一次点击作业条件无需post
            if(enclosure.length){
                this.postAdjun = true;
            }
            if(condition.length){
                this.postTopic = true;
            }
            this.isAllShow = true;
            loadingInstance.close();
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
         // 滚动固定
       this.$nextTick(()=>{
            const header = document.getElementById('set_head');
            const headTop = header.offsetTop;
            window.addEventListener('scroll',()=>{
                let scrollTop ;
                if(document.documentElement.scrollTop){
                    scrollTop = document.documentElement.scrollTop;
                }else{
                    scrollTop = window.pageYOffset;
                }
                if(scrollTop >= headTop){
                    this.fixed = true
                }else{
                    this.fixed = false
                }
            })
        })
    }
}
</script>