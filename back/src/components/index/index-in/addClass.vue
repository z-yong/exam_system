<template>
    <div class="add-class-wrapper">
         <div class="add-class-box">
            <div class="search">
                <span>筛选条件</span>
                <div>
                   <div style="display： inline-block; margin-left: 1vw">
                        <el-input v-model="className" placeholder="请输入班级名称" @input="searchData" clearable></el-input>
                   </div>
                </div>
                <el-button type='primary' @click="addClass('add')" class="add-ident">添加班级</el-button>
            </div>
            <div class="table">
                <p class="table-title">班级列表</p>
                <el-table :data="myTableData" style="width: 100%">
                    <el-table-column prop="id" label="编号" min-width="10px"></el-table-column>
                    <el-table-column prop="name" label="班级名称" min-width="15px"></el-table-column>
                    <el-table-column prop="time" label="班级创建时间" min-width="20px"></el-table-column>
                    <el-table-column label="操作" min-width="60px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="addClass('redact',scope.row,scope.$index)"><i class="iconfont">&#xe64b;</i>修改</el-button>
                            <el-button type="text" size="small" @click="setZhengshi(scope.row)"><i class="iconfont">&#xe64b;</i>添加正式卷</el-button>
                            <el-button type="text" size="small" @click="setMoni(scope.row)"><i class="iconfont">&#xe64b;</i>添加模拟卷</el-button>
                            <el-button type="text" size="small" @click="seeStudent(scope.row)"><i class="iconfont">&#xe738;</i>查看学生</el-button>
                            <el-button type="text" size="small" @click="seeExamRecord(scope.row)"><i class="iconfont">&#xe738;</i>查看考试安排记录</el-button>
                            <el-button type="text" size="small" @click="deleteData(scope.row)"><i class="iconfont">&#xe631;</i>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div>
            <el-dialog :title="disTitle" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
                <el-form :model="formData">
                    <div v-if="isClass">
                        <el-form-item label="班级名称" :label-width="isClass ? '100px' : '200px'" v-model="formData.name">
                            <el-input v-model="formData.name" placeholder="输入班级名称" autocomplete="off"></el-input>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <div v-if="disTitle == '添加正式卷'">
                            <el-form-item label="正式考卷" label-width="200px" v-model="formData.examination">
                                <el-select v-model="formData.examination" filterable placeholder="请选择技术试卷" @change='changeExamination'>
                                    <el-option v-for="item in examinations" :key="item.title" :label="item.title" :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select style="marign-left:3vw" v-model="formData.theory" filterable placeholder="请选择理论试卷" @change='changeExaminationLilun'>
                                    <el-option v-for="item in examinationsLilun" :key="item.title" :label="item.title" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="正式技术卷开考时间" label-width="200px">
                                <el-date-picker v-model="formData.timea" type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="正式技术卷考试时长(分钟)" label-width="200px">
                                <el-input v-model="formData.sca" autocomplete="off" placeholder="输入考试时长"></el-input>
                            </el-form-item>
                            <el-form-item label="正式理论卷开考时间" label-width="200px">
                                <el-date-picker v-model="formData.timeb" type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="正式理论卷考试时长(分钟)" label-width="200px">
                                <el-input v-model="formData.scb" autocomplete="off" placeholder="输入考试时长"></el-input>
                            </el-form-item>
                            <template>
                                <el-form-item label="技能与理论是否连考" label-width="200px">
                                    <el-radio-group v-model="meanwhile">
                                        <el-radio :label="0">否</el-radio>
                                        <el-radio :label="1">是</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </template>
                        </div>
                        <div v-if="disTitle == '添加模拟卷'">
                            <el-form-item label="模拟考卷" label-width="200px" v-model="formData.examination_mn">
                                <el-select v-model="formData.examination_mn" filterable placeholder="请选择技术考卷"  @change='changeExaminationMn'>
                                    <el-option v-for="item in examination_mns" :key="item.title" :label="item.title" :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="formData.theory_mn" filterable placeholder="请选择理论考卷"  @change='changeExaminationMnLilun'>
                                    <el-option v-for="item in examination_mnsLilun" :key="item.title" :label="item.title" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="模拟技术卷开考时间" label-width="200px">
                                <el-date-picker v-model="formData.timea" type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="模拟技术卷考试时长(分钟)" label-width="200px">
                                <el-input v-model="formData.sca" autocomplete="off" placeholder="输入考试时长"></el-input>
                            </el-form-item>
                            <el-form-item label="模拟理论卷开考时间" label-width="200px">
                                <el-date-picker v-model="formData.timeb" type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="模拟理论卷考试时长(分钟)" label-width="200px">
                                <el-input v-model="formData.scb" autocomplete="off" placeholder="输入考试时长"></el-input>
                            </el-form-item>
                            <template>
                                <el-form-item label="技能与理论是否连考" label-width="200px">
                                    <el-radio-group v-model="meanwhile">
                                        <el-radio :label="0">否</el-radio>
                                        <el-radio :label="1">是</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </template>
                        </div>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setClassTrue">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible2" width="30%">
            <span>确认删除该班级?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="deleteTrue">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style scoped>
    @import './addClass.css';
</style>

<script>
export default {
    data(){
        return {
            value:'状态',
            id: 0,
            isClass: true,
            meanwhile: 0,
            className: '',
            disTitle: '添加班级',
            dialogFormVisible: false,
            dialogVisible2: false,
            tableData: [],
            myTableData: [],
            examinations: [],
            examination_mns: [],
            examinationsLilun: [],
            examination_mnsLilun: [],
            jinengID: '',
            lilunID: '',
            formData:{
                examination: '',
                theory: '',
                examination_mn: '',
                theory_mn: '',
                name: '',
                timea: '',
                timeb: '',
                sca: '',
                scb: ''
            }
        }
    },
    methods: {
        // 添加身份/编辑身份
        addClass(value,row){
            this.isClass = true;
            if(value == 'add'){
                this.disTitle = '添加班级';
                this.formData = { examination: '', examination_mn: '', name: ''};
                this.zhengshiID = 0;
                this.moniID = 0;
                this.dialogFormVisible = true;
            }else{
                this.id = row.id;
                this.axios.get('/admin/user/getClassId?id='+row.id).then(res =>{
                    this.disTitle = '修改班级';
                    this.formData = res.data.data;
                    this.dialogFormVisible = true;
                })
            }
        },
        // 确认添加班级/编辑班级
        setClassTrue(){
            const data = {};
            if(this.disTitle == '添加班级'){
                if(!this.formData.name) return this.$message({message: '请输入班级名称！',type: 'error'})
                data.name = this.formData.name;
                this.axios.post('/admin/user/addClass',data).then(res =>{
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this._getInfoData();
                    this.dialogFormVisible = false;
                })
            }else if(this.disTitle == '修改班级'){
                if(!this.formData.name) return this.$message({message: '请输入班级名称！',type: 'error'})
                data.id = this.id;
                data.name = this.formData.name;
                this.axios.post('/admin/user/modifyClass',data).then(res =>{
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this._getInfoData()
                    this.dialogFormVisible = false;
                })
            }else if(this.disTitle == '添加正式卷'){
                // const data = this.deepClone(this.formData) //深度克隆
                data.b_id = this.id;
                data.j_id = this.jinengID;
                data.timea = this.formData.timea;
                data.sca = this.formData.sca;
                data.l_id = this.lilunID;
                data.timeb = this.formData.timeb;
                data.scb = this.formData.scb;
                data.zs = 1;
                data.meanwhile = this.meanwhile;
                this.axios.post('/admin/user/add_class_an', data).then(res =>{
                    console.log(res);
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this.dialogFormVisible = false;
                })
            }else if(this.disTitle == '添加模拟卷'){
                data.b_id = this.id;
                data.j_id = this.jinengID;
                data.timea = this.formData.timea;
                data.sca = this.formData.sca;
                data.l_id = this.lilunID;
                data.timeb = this.formData.timeb;
                data.scb = this.formData.scb;
                data.zs = 2;
                data.meanwhile = this.meanwhile;
                this.axios.post('/admin/user/add_class_an', data).then(res =>{
                    console.log(res)
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this.dialogFormVisible = false;
                })
            }
        },
        setZhengshi(row){
            this.id = row.id;
            this.isClass = false;
            this.isZhenshi = true;
            this.disTitle = '添加正式卷'
            this.dialogFormVisible = true
        },
        setMoni(row){
            this.id = row.id;
            this.isClass = false;
            this.disTitle = '添加模拟卷'
            this.dialogFormVisible = true
        },
        // 删除身份
        deleteData(row){
            this.id = row.id;
            this.dialogVisible2 = true;
        },
        // 确认删除身份
        deleteTrue(){
            this.axios.get('/admin/user/deleteClass?id='+this.id).then(res =>{
                this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                this.dialogVisible2 = false;
                this._getInfoData()
            })
        },
        // 查看当前班级学生
        seeStudent(row){
            this.$emit('seeStudent',row.id)
        },
        seeExamRecord(row){
            this.$emit('seeExamRecord',row.id)
        },
        changeExamination(e){
            this.jinengID = e;
        },
        changeExaminationMn(e){
            this.jinengID = e;
        },
        changeExaminationLilun(e){
            this.lilunID = e;
        },
        changeExaminationMnLilun(e){
            this.lilunID = e;
        },
        // 点击搜索
        searchData(value){
            this.myTableData = this.tableData.filter(item =>{
                return item.name.match(value)
            })
        },
        _getInfoData(){
            this.axios.get('/admin/user/classList').then(res =>{
                this.tableData = res.data.data;
                this.tableData.forEach((ele,index) =>{
                    ele.index = index+1
                })
                this.myTableData = this.tableData;
            })
            // 技术类考卷
            this.axios.get('/admin/user/getIssueZheng').then(res =>{
                this.examinations = res.data.data;
            })
            this.axios.get('/admin/user/getIssueMu').then(res =>{
                this.examination_mns = res.data.data
            })
            // 理论类考卷
            this.axios.get('/admin/user/getPaperZheng').then(res =>{
                this.examinationsLilun = res.data.data;
            })
            this.axios.get('/admin/user/getPaperMu').then(res =>{
                this.examination_mnsLilun = res.data.data
            })
        }
    },
    created(){
        this._getInfoData()
    }
}
</script>