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
                    <el-table-column prop="id" label="编号" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="name" label="班级名称" min-width="15px">
                    </el-table-column>
                    <el-table-column prop="time" label="班级创建时间" min-width="20px">
                    </el-table-column>
                    <el-table-column prop="examination" label="正式技术卷" min-width="25px" >
                    </el-table-column>
                    <el-table-column prop="theory" label="正式理论卷" min-width="25px" >
                    </el-table-column>
                    <el-table-column prop="examination_mn" label="模拟技术卷" min-width="25px" >
                    </el-table-column>
                    <el-table-column prop="theory_mn" label="模拟理论卷" min-width="25px" >
                    </el-table-column>
                    <el-table-column label="操作" min-width="30px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="addClass('redact',scope.row,scope.$index)"><i class="iconfont">&#xe64b;</i>编辑</el-button>
                            <el-button type="text" size="small" @click="deleteData(scope.row)"><i class="iconfont">&#xe631;</i>删除</el-button>
                            <el-button type="text" size="small" @click="seeStudent(scope.row)"><i class="iconfont">&#xe738;</i>查看学生</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog :title="disTitle" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
            <el-form :model="formData">
                <el-form-item label="班级名称" label-width="200px" v-model="formData.name">
                    <el-input v-model="formData.name" placeholder="输入班级名称" autocomplete="off"></el-input>
                </el-form-item>
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
                    <el-date-picker v-model="formData.timec" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="正式理论卷考试时长(分钟)" label-width="200px">
                    <el-input v-model="formData.scc" autocomplete="off" placeholder="输入考试时长"></el-input>
                </el-form-item>
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
                    <el-date-picker v-model="formData.timeb" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="模拟技术卷考试时长(分钟)" label-width="200px">
                    <el-input v-model="formData.scb" autocomplete="off" placeholder="输入考试时长"></el-input>
                </el-form-item>
                <el-form-item label="模拟理论卷开考时间" label-width="200px">
                    <el-date-picker v-model="formData.timed" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="模拟理论卷考试时长(分钟)" label-width="200px">
                    <el-input v-model="formData.scd" autocomplete="off" placeholder="输入考试时长"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addClassTrue">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible2"
            width="30%">
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
            isAdd: true,
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
            zhengshiID: 0,
            moniID: 0,
            zhengshiLilunID: 0,
            moniLilunID: 0,
            formData:{
                examination: '',
                theory: '',
                examination_mn: '',
                theory_mn: '',
                name: '',
                timea: '',
                timeb: '',
                timec: '',
                timed: '',
                sca: '',
                scb: '',
                scc: '',
                scd: '',
            }
        }
    },
    methods: {
        // 添加身份/编辑身份
        addClass(value,row,index){
            if(value == 'add'){
                this.disTitle = '添加班级';
                this.formData = { examination: '', examination_mn: '', name: ''};
                this.zhengshiID = 0;
                this.moniID = 0;
                this.dialogFormVisible = true
            }else{
                this.id = row.id;
                this.axios.get('/admin/user/getClassId?id='+row.id).then(res =>{
                    this.disTitle = '修改班级';
                    this.formData = res.data.data;
                    this.zhengshiID = res.data.data.examination_id;
                    this.moniID = res.data.data.examination_mn_id;
                    if(res.data.data.examination){
                        this.formData.examination = res.data.data.examination
                    }
                    if(res.data.data.examination_mn){
                        this.formData.examination_mn = res.data.data.examination_mn
                    }
                    if(res.data.data.theory){
                        this.formData.examinationLilun = res.data.data.theory
                    }
                    if(res.data.data.theory_mn){
                        this.formData.examination_mnLilun = res.data.data.theory_mn
                    }
                    this.dialogFormVisible = true;
                })
            }
        },
        // 确认添加班级/编辑班级
        addClassTrue(){
            const data = this.formData;
            data.examination = this.zhengshiID;
            data.examination_mn = this.moniID;
            data.theory = this.zhengshiLilunID;
            data.theory_mn = this.moniLilunID;
            if(this.disTitle == '修改班级'){
                data.id = this.id;
                this.axios.post('/admin/user/modifyClass',data).then(res =>{
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this._getInfoData()
                    this.dialogFormVisible = false;
                })
            }else{
                if(!this.formData.name) return this.$message({message: '请输入班级名称！',type: 'error'})
                this.axios.post('/admin/user/addClass',data).then(res =>{
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this._getInfoData()
                    this.dialogFormVisible = false;
                })
            }
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
        changeExamination(e){
            this.zhengshiID = e;
        },
        changeExaminationMn(e){
            this.moniID = e;
        },
        changeExaminationLilun(e){
            this.zhengshiLilunID = e;
        },
        changeExaminationMnLilun(e){
            this.moniLilunID = e;
        },
        // 点击搜索
        searchData(value){
            let index = 0;
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