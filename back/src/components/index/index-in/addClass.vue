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
                    <el-table-column prop="name" label="班级名称" min-width="20px">
                    </el-table-column>
                    <el-table-column prop="examination" label="正式考卷" min-width="30px" >
                    </el-table-column>
                    <el-table-column prop="examination_mn" label="模拟考卷" min-width="30px" >
                    </el-table-column>
                    <el-table-column prop="time" label="创建时间" min-width="20px">
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
                <el-form-item label="班级名称" label-width="80px" v-model="formData.name">
                    <el-input v-model="formData.name" placeholder="输入班级名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="正式考卷" label-width="80px" v-model="formData.examination">
                    <el-select v-model="formData.examination" filterable placeholder="请选择正式考卷" @change='changeExamination'>
                        <el-option v-for="item in examinations" :key="item.title" :label="item.title" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模拟考卷" label-width="80px" v-model="formData.examination_mn">
                    <el-select v-model="formData.examination_mn" filterable placeholder="请选择模拟考卷"  @change='changeExaminationMn'>
                        <el-option v-for="item in examination_mns" :key="item.title" :label="item.title" :value="item.id">
                        </el-option>
                    </el-select>
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
            formData:{
                examination: '',
                examination_mn: '',
                name: ''
            },
            disTitle: '添加班级',
            dialogFormVisible: false,
            dialogVisible2: false,
            tableData: [],
            myTableData: [],
            examinations: [],
            examination_mns: [],
            zhengshiID: 0,
            moniID: 0
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
                    this.dialogFormVisible = true;
                })
            }
        },
        // 确认添加班级/编辑班级
        addClassTrue(){
            if(this.disTitle == '修改班级'){
                const data = {
                    id: this.id,
                    name: this.formData.name,
                    examination: this.zhengshiID,
                    examination_mn: this.moniID
                }
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
                const data = {
                    name: this.formData.name,
                    examination: this.zhengshiID,
                    examination_mn: this.moniID
                }
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
            console.log(e)
            this.moniID = e;
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
            this.axios.get('/admin/user/getIssueZheng').then(res =>{
                console.log(res)
                this.examinations = res.data.data;
            })
            this.axios.get('/admin/user/getIssueMu').then(res =>{
                this.examination_mns = res.data.data
            })
        }
    },
    created(){
        this._getInfoData()
    }
}
</script>