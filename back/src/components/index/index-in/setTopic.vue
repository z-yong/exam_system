<template>
    <div class="set-wrapper">
        <div class="set-header" id="set_head" :class="fixed ? 'fixed' : ''">
            <div class="title">{{isGetInfo ? topicTitle : (ruleForm.title || ruleForms.title + ' ' + topicType+'卷')}}</div>
            <div v-if="currentIndex == 0" class="btn-header">
                <div class='adj'>
                    <el-button type="primary" @click="createAdjunct">{{ruleForm.adjun.length ? '保存附件并继续创建' : '创建附件'}}</el-button>
                </div>
                <div class="btnbtn">    
                    <el-button type="primary" @click="createConditions">创建作业条件</el-button>                
                </div>
                <div class="btnbtn">
                    <el-button type="primary" @click="submitForm('ruleForm')">{{submitText}}</el-button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                </div>
            </div>
            <div v-else class="btn-header">
                <div class="btnbtn">
                    <el-button type="primary" @click="submitForm">{{submitText}}</el-button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                </div>
            </div>
        </div>
        <div v-if="isAllShow">
            <div style="display:flex;align-items: center;background:#fff;border-bottom:1px solid #eee">
                <div v-for="(menu,mi) in menuList" :key="mi" style="padding:1.2vh 2vw;cursor: pointer;border:1px solid #f7f7f7;" @click="changeMenu(mi)"
                     :style="{background:currentIndex == mi ? '#0070d8' : '',color: currentIndex == mi ? '#fff' : '',opacity: currentIndex == mi ? '0.7' : ''}">{{menu}}</div>
            </div>
            <div class="issue-box">
                <el-form v-if="currentIndex == 0" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">               
                    <el-form-item label="标题">
                        <el-input :disabled="disabled" v-model="ruleForm.title" @input="change($event)" placeholder="输入标题"></el-input>
                    </el-form-item>
                    <!-- 编辑器 -->
                    <div class="editor">
                        <el-form-item label="想定内容">
                            <z-editor :id="tinymce" :tinymceHtml='tinymceHtml' ref="editorHtml"></z-editor>
                        </el-form-item>
                    </div>               
                    <div v-for="(el,i) in ruleForm.adjun" :key="i" class="topic_ed">
                        <el-form-item :label="'附件名称'+(i+1)" >
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
                                <div v-if="ruleForm.topics[index].topicArr.length == 0" class="btnbtn" style="margin:1vh 4vw 3vh">    
                                    <el-button type="primary" @click="saveConditions(topicItem,index)">保存作业条件并出题</el-button>                
                                </div>
                                <div class="btnbtn" style="margin:1vh 7vw 3vh">    
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
                                                <el-option v-for="(item,index) in degrees" :key="index" :value="item.label" :label="item.label"></el-option>
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
                                        <el-form-item v-if="topic.type == '多选题'"  label="G：">
                                            <el-input type="text" v-model="topic.g" @input="change($event)"></el-input>
                                        </el-form-item>
                                        <el-form-item v-if="topic.type == '多选题'" label="H：">
                                            <el-input type="text" v-model="topic.h" @input="change($event)"></el-input>
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
                                                <el-checkbox label="G" @change="change($event)"></el-checkbox>
                                                <el-checkbox label="H" @change="change($event)"></el-checkbox>
                                            </el-checkbox-group>
                                        </el-form-item>
                                        <div class="gap">
                                            <el-form-item v-if="topic.type == '填空题'" label="正确答案">
                                                <div v-for="(t) in 10" :key="t">
                                                    <el-input v-model="topic.tiankong[t-1]" type="" @input="change($event)" placeholder="请填写答案(最少填一个)"></el-input>
                                                </div>
                                                <el-input v-model="topic.error" type="number" placeholder="请给出误差(可不填)" @input="change($event)"></el-input>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="grade">
                                        <el-form-item label="分数">
                                            <el-input type="number" @input="change($event)" v-model="topic.fraction"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div style="display:flex">
                                        <div v-if="i == ruleForm['topics'][index].topicArr.length-1" class="btnbtn" style="margin:1vh 5vw 3vh">    
                                            <el-button type="primary" @click="saveQua(topic,index,i)">保存此题并出下一题</el-button>                
                                        </div>
                                        <div class="btnbtn" style="margin:1vh 6vw 3vh">    
                                            <el-button type="primary" @click="delQua(topic,index,i)">删除此题</el-button>                
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </el-form>
                <!-- 理论出题 -->
                <el-form v-if="currentIndex == 1" :model="ruleForms" :rules="rules" ref="ruleForms" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="标题">
                        <el-input v-model="ruleForms.title" @input="change($event)" placeholder="输入标题"></el-input>
                    </el-form-item>
                    <div v-if="!ruleForms.topicsLilun.length" class="btnbtn" style="margin:8vh 3vw">    
                        <el-button type="primary" @click="saveLilunTitle">保存此标题并开始出题</el-button>                
                    </div>
                    <div v-if="ruleForms.topicsLilun.length" class="new-topic">
                        <div class="topics">
                            <div v-for="(topic, i) in ruleForms.topicsLilun" :key="i">
                                <el-form-item label="题目类型">
                                    <template>
                                        <el-select v-model="topic.type">
                                            <el-option v-for="(item,index) in options1" :key="index" :value="item.label" :label="item.label"></el-option>
                                        </el-select>
                                    </template>
                                </el-form-item>
                                <el-form-item label="难度" :prop="topic.difficulty">
                                    <template>
                                        <el-select v-model="topic.difficulty">
                                            <el-option v-for="(item,index) in degrees" :key="index" 
                                                       :value="item.label" :label="item.label">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-form-item>
                                <div class="editor">        
                                    <el-form-item :label="(i+1)+''">
                                        <z-editor :id="'topicLilun'+i" :tinymceHtml="topic.title"></z-editor>
                                    </el-form-item>   
                                </div>                
                                <div class="option" v-if="topic.type == '单选题' || topic.type == '多选题'">
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
                                    <el-form-item v-if="topic.type == '多选题'"  label="G：">
                                        <el-input type="text" v-model="topic.g" @input="change($event)"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="topic.type == '多选题'" label="H：">
                                        <el-input type="text" v-model="topic.h" @input="change($event)"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="answer">
                                    <el-form-item v-if="topic.type == '单选题'" label="正确答案">
                                        <el-radio v-model="topic.danxuan" label="A" @change="change($event)">A</el-radio>
                                        <el-radio v-model="topic.danxuan" label="B" @change="change($event)">B</el-radio>
                                        <el-radio v-model="topic.danxuan" label="C" @change="change($event)">C</el-radio>
                                        <el-radio v-model="topic.danxuan" label="D" @change="change($event)">D</el-radio>
                                    </el-form-item>
                                    <el-form-item v-if="topic.type == '多选题'" label="正确答案">
                                        <el-checkbox-group v-model="topic.duoxuan">
                                            <el-checkbox label="A" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="B" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="C" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="D" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="E" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="F" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="G" @change="change($event)"></el-checkbox>
                                            <el-checkbox label="H" @change="change($event)"></el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                    <div class="gap">
                                        <div v-if="topic.type == '填空题'">
                                            <el-form-item label="正确答案">
                                                <div v-for="(t) in 10" :key="t">
                                                    <el-input v-model="topic.tiankong[t-1]" type="" @input="change($event)" placeholder="请填写答案(最少填一个)"></el-input>
                                                </div>
                                                <el-input v-model="topic.error" type="number" placeholder="请给出误差" @input="change($event)"></el-input>
                                            </el-form-item>
                                            <el-form-item label="阅卷方式">
                                                <el-radio-group v-model="topic.automatic">
                                                    <el-radio :label="0">电脑阅卷</el-radio>
                                                    <el-radio :label="1">人工阅卷</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </div>
                                        <div class="textarea">
                                            <el-form-item v-if="topic.type == '简答题'" label="正确答案">
                                                <el-input v-model="topic.tianjian" type="textarea" @input="change($event)"></el-input>
                                            </el-form-item>
                                        </div>
                                    </div>
                                </div>
                                <div class="grade">
                                    <el-form-item label="分数">
                                        <el-input type="number" @input="change($event)" v-model="topic.fraction"></el-input>
                                    </el-form-item>
                                </div>
                                <div style="display:flex">
                                    <div v-if="i == ruleForms.topicsLilun.length-1" class="btnbtn" style="margin:1vh 3vw 3vh">    
                                        <el-button type="primary" @click="saveQuaLilun(topic,i)">保存此题并出下一题</el-button>                
                                    </div>
                                    <div class="btnbtn" style="margin:1vh 3vw 3vh">    
                                        <el-button type="primary" @click="delQuaLilun(topic,i)">删除此题</el-button>                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
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
            default: '',
            required: true
        },
        topicName: {
            type: String,
            required: true
        },
        topicIndex: {
            type: Number,
            default: 0
        }
    },
    // props: ['topicType','topicTitle','isGetInfo','topicID','outline','topicName'],
    components: {
        "z-editor": Editor
    },
    data(){
        return {
            currentIndex: 0,
            menuList: ['技 能','理 论'],
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
            options1: [
                        {
                        label: '单选题'
                    }, {
                        label: '多选题'
                    }, {
                        label: '填空题'
                    }, {
                        label: '简答题'
                    }
                ],
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
            ruleForms: {
                id:'',
                title: '',
                topicsLilun: []
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
        changeMenu(index){
            this.currentIndex = index;
            if(!this.ruleForms.title){
                let data = {};
                if(this.topicTitle == '正式考卷'){
                    data.simulation = 0;
                }else if(this.topicTitle == '模拟考卷'){
                    data.simulation = 1;
                }
                this.axios.get('/admin/paper/testing?simulation='+data.simulation).then(res =>{
                    if(res.data.code == 200){
                        this.isAllShow = false;
                        this.ruleForms.id = res.data.data;
                        this.dialogFormVisible0 = true;
                    }else{
                        this.isAllShow = true;
                    }
                })
            }
        },
        // 创建作业条件
        createConditions(){
            if(this.currentIndex == 1){
                return this._isEmpty('这是理论出题 !');
            }
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
                this.ruleForm.topics.push({content: '',topicArr: []});
            }
        },
        // 保存作业条件
        saveConditions(item,index){
            const content = tinymce.editors['topic'+index].getContent();
            if(!content){
                this._isEmpty('请填写作业条件');
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
                    if(this.ruleForm.topics[index].topicArr.length == 0){
                        this.ruleForm.topics[index].topicArr.push({id: '',title: '',type:'单选题',difficulty: '一般',c_id:res.data.msg,
                        danxuan:'',duoxuan: [],tiankong:[],a: '',b:'',c:'',d:'',e:'',f:'',answer:'',fraction: '',error:''})
                    }
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
            // if(!title) return this._isEmpty('请填写题目');
            if(item.type == '多选题' || item.type == '单选题'){
                if(!item.a) return this._isEmpty('请填写A选项');
                if(!item.b) return this._isEmpty('请填写B选项');
                if(!item.c) return this._isEmpty('请填写C选项');
                if(!item.d) return this._isEmpty('请填写D选项');
            }
            // if(item.type == '多选题'){
            //     if(!item.e) return this._isEmpty('请填写E选项');
            // }
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
                title, a:item.a, b:item.b, c:item.c, d:item.d, e:item.e, f:item.f,g:item.g, h:item.h, fraction: item.fraction, 
                answer,c_id:item.c_id,type,difficulty,error: item.error
            }
            this.axios.post('/admin/issue/subject',data).then(res =>{
               this.ruleForm.topics[index].topicArr[i].id = res.data.msg;
               this.ruleForm.topics[index].topicArr.push({id: '',title: '',type:'单选题',difficulty: '一般',c_id:item.c_id,
                    danxuan:'',duoxuan: [],tiankong:[], a: '',b:'',c:'',d:'',e:'',f:'',g: '',h: '', answer:'',fraction: '',error:''})
               this.$forceUpdate()
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
            if(item.id){
                this.axios.post('/admin/issue/subject_delete',{id:item.id}).then(res =>{
                    this._isEmpty(res.data.msg);
                    if(res.data.code == 200){
                        this.ruleForm.topics[index].topicArr.splice(index,1);
                        this.$forceUpdate();
                    }
                })
            }else{
                this.ruleForm.topics[index].topicArr.splice(index,1);
                this.$forceUpdate()
                // this._isEmpty('删除成功')
            }
        },
        // 保存标题
        saveLilunTitle(){
            if(!this.ruleForms.title) return this._isEmpty('请输入标题')
            const data = {
                title: this.ruleForms.title,
                simulation: this.topicTitle == '正式考卷' ? 0 : 1,
                id: this.ruleForms.id
            }
            if(!this.isGetInfo){
                data.s_type = this.topicType;
                data.id = this.topicID
            }
            this.axios.post('/admin/paper/paper',data).then(res =>{
                if(res.data.code == 200){
                    this.ruleForms.id = res.data.msg;
                    this.ruleForms.topicsLilun.push({id: '',title: '',type:'单选题',difficulty: '一般',error:'',automatic: 0,
                        danxuan:'',duoxuan: [],tiankong: [],tianjian:'',a: '',b:'',c:'',d:'',e:'',f:'',g: '',h: '', answer:'',fraction: ''})
                }else{
                    this._isEmpty(res.data.msg)
                }
            })
        },
        // 保存理论题目
        saveQuaLilun(item,index){
            const s_id = this.ruleForms.id;
            const title = tinymce.editors['topicLilun'+index].getContent();
            let type, difficulty,answer;
            if(!title) return this._isEmpty('请填写题目');
            if(item.type == '多选题' || item.type == '单选题'){
                if(!item.a) return this._isEmpty('请填写A选项');
                if(!item.b) return this._isEmpty('请填写B选项');
                if(!item.c) return this._isEmpty('请填写C选项');
                if(!item.d) return this._isEmpty('请填写D选项');
            }
            // if(item.type == '多选题'){
            //     if(!item.e) return this._isEmpty('请填写E选项');
            //     if(!item.f) return this._isEmpty('请填写F选项');
            // }
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
            if(item.type == '简答题'){
                 type = 4;
                 answer = item.tianjian;
            }
            if(!answer.length) return this._isEmpty('请填写答案');
            if(item.difficulty == '一般') difficulty = '1';
            if(item.difficulty == '普通难度') difficulty = '2';
            if(item.difficulty == '较难') difficulty = '3';
            if(item.difficulty == '最高难度') difficulty = '4';
            const data = {
               id:item.id, s_id, title, a:item.a, b:item.b, c:item.c, d:item.d, e:item.e, f:item.f, g:item.g, h:item.h,
               fraction: item.fraction, answer,type,difficulty,error:item.error,automatic: item.automatic
            }
            if(!this.isGetInfo){
                data.s_id = this.topicID;
                data.s_type = this.topicType;
            }
            this.axios.post('/admin/paper/topic',data).then(res =>{
                if(res.data.code == 200){
                    this.ruleForms.topicsLilun[index].id = res.data.msg
                    this.ruleForms.topicsLilun.push({id: '',title: '',type:'单选题', difficulty: '一般',error:'',automatic: 0,
                        danxuan:'',duoxuan: [],tiankong: [], tianjian:'',a: '',b:'',c:'',d:'',e:'',f:'',g: '',h:'', answer:'',fraction: ''})
                }else{
                    this._isEmpty(res.data.msg)
                }
            })
        },
        delQuaLilun(item,index){
            if(item.id){
                this.axios.post('/admin/paper/topic_delete',{id:item.id}).then(res =>{
                    this._isEmpty(res.data.msg)
                    if(res.data.code == 200){
                        this.ruleForms.topicsLilun.splice(index,1)
                    }
                })
            }else if(index == 0){
                this._isEmpty('您还未保存,无需删除')
            }else{
                this.ruleForms.topicsLilun.splice(index,1)
                this._isEmpty('删除成功')
            }
        },
        // 添加附件    如果adjunNum为0 就把标题和想定内容post上去
        createAdjunct(){
            if(this.currentIndex == 1){
                return this._isEmpty('这是理论出题 !')
            }
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
            if(this.currentIndex == 0){
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
            }else{
                const title = this.ruleForms.title;
                const subject = [];
                this.ruleForms.topicsLilun.forEach((ele,index) =>{
                    subject[index] = ele;
                    subject[index].title = tinymce.editors['topicLilun'+index].getContent();
                    if(ele.type == '单选题'){
                        subject[index].type = '1'
                        subject[index].answer = ele.danxuan;
                    }else if(ele.type == '多选题'){
                        subject[index].type = '2'
                        subject[index].answer = ele.duoxuan;
                    }else if(ele.type == '填空题'){
                        subject[index].type = '3'
                        subject[index].answer = ele.tiankong;
                    }else{
                        subject[index].type = '4'
                        subject[index].answer = ele.tianjian;
                    }
                    if(ele.difficulty == '一般'){
                        subject[index].difficulty = '1'
                    }else if(ele.difficulty == '普通难度'){
                        subject[index].difficulty = '2'
                    }else if(ele.difficulty == '较难'){
                        subject[index].difficulty = '3'
                    }else{
                        subject[index].difficulty = '4'
                    }
                    delete subject[index].danxuan;
                    delete subject[index].duoxuan;
                    delete subject[index].tiankong;
                    delete subject[index].tianjian;
                })
                const data = {
                    paper:{id: this.ruleForms.id,title},
                    subject
                }
                if(!this.isGetInfo){
                    data.id = this.topicID;
                    // data.s_type = this.topicType;
                    if(this.outline != '修改'){
                        data.s_type = this.topicType;
                    }
                }
                this.axios.post('/admin/paper/preservation',data).then(res =>{
                    if(res.data.code == 200){
                        if(this.isGetInfo){
                            this.dialogFormVisible = false;
                            this.ruleForms = {id: 0, title: '', topicsLilun: []};
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
                                    message: `辛苦了,${this.ruleForms.title+this.topicType}卷 保存成功!`,
                                    type: 'success'
                                })
                            }else{
                                this.$message({
                                    message: `辛苦了,${this.ruleForms.title+this.topicType}卷 创建成功!`,
                                    type: 'success'
                                })
                            }
                            this.$emit('gotoTopicTable',{title})
                        }
                    }
                })
            }
        },
        // 判断提交
        submitForm() {
            if(this.currentIndex == 0){
                const outline = tinymce.editors['tinymce'].getContent();
                const title = this.ruleForm.title;
                if(!title) return this._isEmpty('您还未写标题');
                if(!outline) return this._isEmpty('您还未写想定内容');
            }else{
                const title = this.ruleForms.title;
                if(!title) return this._isEmpty('您还未写标题')
            }
            this.dialogFormVisible = true
        },
        // 清除并重新出题
        clearData(){
            if(this.currentIndex == 0){
                this.axios.post('/admin/issue/emptyIssue?id='+this.ruleForm.id).then(res =>{
                    if(res.data.code == 200){
                        this.dialogFormVisible0 = false;
                        this.isAllShow = true;
                        this.absolute = true;
                    }
                })
            }else{
                this.axios.post('/admin/paper/emptyIssue?id='+this.ruleForms.id).then(res =>{
                    if(res.data.code == 200){
                        this.dialogFormVisible0 = false;
                        this.isAllShow = true;
                        this.absolute = true;
                    }
                })
            }
        },
        // 继续出题
        goOn(){
            this.dialogFormVisible0 = false;  
            loadingInstance = Loading.service({
                lock: true,
                text: '加载中...',
                background: 'rgba(0,0,0,0.7)'
            });
            if(this.currentIndex == 0){
                this.axios.get('/admin/issue/proceed?id='+this.ruleForm.id).then(res =>{
                    this.absolute = false;
                    const enclosure = res.data.data.enclosure;
                    const condition = res.data.data.condition;
                    this.ruleForm.id = res.data.data.id;
                    this.ruleForm.title = res.data.data.title;
                    this.tinymceHtml = res.data.data.outline;
                    this._getData(enclosure,condition);
                    loadingInstance.close();
                })
            }else{
                this.axios.get('/admin/paper/proceed?id='+this.ruleForms.id).then(res =>{
                    this.ruleForms.title = res.data.data.paper.title;
                    res.data.data.topic.forEach((el) =>{
                        if(el.type == '单选题'){
                            el.danxuan = el.answer;
                        }else if(el.type == '多选题'){
                            el.duoxuan = el.answer;
                        }else if(el.type == '填空题'){
                            el.tiankong = el.answer;
                        }else{
                            el.tianjian = el.answer;
                        }
                    })
                    this.ruleForms.topicsLilun = res.data.data.topic;
                    this.isAllShow = true;
                    loadingInstance.close();
                })
            }
        },
        change(){
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
                this.ruleForm.topics[index].topicArr.forEach((el) =>{
                    if(el.type == '单选题'){
                        el.danxuan = el.answer
                    }else if(el.type == '多选题'){
                        el.duoxuan = el.answer
                        console.log(el.duoxuan)
                    }else{
                        el.tiankong = el.answer
                    }
                })
                this.ruleForm.topics[index].topicArr.push({title: '',type:'单选题',difficulty: '一般',c_id:ele.id,
                    danxuan:'',duoxuan: [],tiankong:[], a: '',b:'',c:'',d:'',e:'',f:'',answer:'',fraction: '',error:''})
            })
            // 如果作业条件或者添加附件有内容的话 第一次点击作业条件无需post
            if(enclosure.length){
                this.postAdjun = true;
            }
            if(condition.length){
                this.postTopic = true;
            }
            this.isAllShow = true;
        },
        // editor组件事件监听
        _getMess(tiny){
            let content = tinymce.get(tiny).getContent()
            content = content.replace(/<[^>]+>/g,'')
            return content
        },
        _getTinyMess(){          
            tinymce.activeEditor.getContent();
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
                if(res.data.code == 200){
                    this.isAllShow = false;
                    this.ruleForm.id = res.data.data;
                    this.dialogFormVisible0 = true;
                }else{
                    this.isAllShow = true;
                }
            })
        }
    },
    created(){
        console.log(tinymce)
        if(this.isGetInfo){//如果不是修改试卷
            this._getInfo();
        }else{
            if(this.outline == '修改'){//修改试卷topicIndex
                if(this.topicIndex == 0){//技能
                    this.axios.get('/admin/issue/editAbcIssue?id='+this.topicID+'&s_type='+this.topicType).then(res =>{
                        this.absolute = false;
                        this.isAllShow = true;
                        this._getData(res.data.data.enclosure, res.data.data.condition);
                        this.ruleForm.id = res.data.data.id;
                        this.ruleForm.title = res.data.data.title;
                        this.tinymceHtml = res.data.data.outline;
                        this.submitText = '保存修改'
                    })
                }else{//理论
                    this.axios.get('/admin/paper/editAbcIssue?id='+this.topicID+'&s_type='+this.topicType).then(res =>{
                        const data = res.data.data;
                        this.isAllShow = true;
                        this.ruleForms.id = data.paper.id;
                        this.ruleForms.title = data.paper.title;
                        this.ruleForms.topicsLilun = data.subject;
                        for (const item of this.ruleForms.topicsLilun) {
                            if(item.type == '单选题'){
                                item.danxuan = item.answer 
                            }else if(item.type == '多选题'){
                                item.duoxuan = item.answer
                            }else if(item.type == '填空题'){
                                item.tiankong = item.answer
                            }else{
                                item.tianjian = item.answer
                            }
                        }
                        this.submitText = '保存修改'
                        this.currentIndex = 1
                    })
                }
            }else{//添加B C D...卷
                if(this.outline){
                    this.isAllShow = true;
                    this.ruleForm.title = this.topicName;
                    this.tinymceHtml = this.outline;
                    this.disabled = true;
                }else{
                    this.isAllShow = true;
                    this.currentIndex = 1;
                    this.ruleForms.title = this.topicName;
                    this.disabled = true;
                }
            } 
        }
         // 滚动固定
       this.$nextTick(()=>{
            const header = document.getElementById('set_head');
            const headTop = header.offsetTop;
            window.addEventListener('scroll',()=>{
                let scrollTop;
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