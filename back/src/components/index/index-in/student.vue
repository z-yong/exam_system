<template>
    <div class="stu-wrapper">
        <div class="stu-box">
            <div class="search">
                <div class="condition">
                    <span>筛选条件：</span>
                    <el-input
                        placeholder="请输入学生姓名或者学号"
                        v-model="stuSearchValue"
                        @input="searchStudent"
                        clearable>
                    </el-input>
                </div>
            </div>
            <div class="stu-table">
                <p class="table-title" style="display:flex;align-items:center;">
                    <span class="iconfont" style="margin-right:0.2vw;cursor: pointer;font-size:18px" @click="back">&#xe501;</span>
                    <span>所有学生列表</span>
                </p>
                <template>
                    <el-table :highlight-current-row="true"
                        :data="myTableData" style="width: 100%">
                        <el-table-column fixed prop="serial" label="序号" min-width="5px"></el-table-column>
                        <el-table-column prop="real_name" label="姓名" min-width="10px"></el-table-column>
                        <el-table-column  prop="pass" label="合格率" min-width="10px"></el-table-column>
                        <!-- <el-table-column prop="mobile" label="手机号" min-width="10px">
                        </el-table-column> -->
                        <el-table-column prop="user_name" label="学号" min-width="20px"></el-table-column>
                        <!-- <el-table-column prop="examination" label="试卷名称" min-width="15px"></el-table-column> -->
                        <el-table-column label="操作" min-width="15px">
                            <template slot-scope="scope">
                                <el-button type="text" @click="redact(scope.row)" size="small"><i class="iconfont">&#xe64b;</i>编辑</el-button>
                                <el-button type="text" @click="deleteStu(scope.row)" size="small"><i class="iconfont">&#xe631;</i>删除</el-button>
                                <el-button type="text" size="small" @click="seePerformancet(scope.row)"><i class="iconfont">&#xe738;</i>查看成绩</el-button>
                            </template>
                        </el-table-column>
                    </el-table> 
                </template>
                <div class="paging">
                    <el-pagination
                        background
                        @current-change='currentPage'
                        @prev-click='prevPage'
                        @next-click='nextPage'
                        layout="prev, pager, next"
                        :total="pages">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="修改" :visible.sync='redactBox'>
            <el-form :model="formData">
                <el-form-item label="姓名" label-width="100px">
                    <el-input v-model="formData.real_name" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="手机" label-width="100px">
                    <el-input type="number" v-model="formData.mobile" autocomplete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="学号" label-width="100px">
                    <el-input type="number" v-model="formData.user_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学生登录密码" label-width="100px">
                    <el-input type="number" v-model="formData.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="redactBox = false">取 消</el-button>
                <el-button type="primary" @click="redactTrue">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>确认删除此学生？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteTrue">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style scoped>
    @import './student.css';
</style>
<script>
export default {
    props: {
        classID: {
            type: Number
        }
    },
    data(){
        return {
            pages: 0,
            id: 0,
            stuSearchValue: '',
            dialogVisible: false,
            redactBox: false,
            formInline: {
                name: '',
                phone: '',
                id: '',
                sex: '',
                
            },
            formData: {},
            // rules: {
            //     name: [
            //         {required: true, message: '请输入学生姓名',trigger: 'blur'}
            //     ],
            //     phone: [
            //         {required: true, message: '请输入学生手机号',trigger: 'blur'}
            //     ],
            //     id: [
            //         {required: true, message: '请输入学号',trigger: 'blur'}
            //     ],
            //     sex: [
            //         {required: true, message: '请输入学生性别',trigger: 'blur'}
            //     ]
            // },
            tableData: [],
            myTableData: []
        }
    },
    methods: {
        back(){
            this.$emit('back')
        }, 
        searchStudent(value){
            this.axios.get('/admin/user/userlist?value='+value).then(res =>{
                res.data.data.forEach((ele,index) =>{
                    ele.serial = index+1
                })
                this.tableData = res.data.data
                this.pages =  Math.ceil(this.tableData.length*10/6);
                this.myTableData = this.tableData.slice(0,6)
            })
        },
        // 查看该学生历史成绩  
        seePerformancet(row){
            this.$emit('seeStuPer',row.id)
        },
        // // 添加学生按钮
        // onSubmit(formName){
        //      this.$refs[formName].validate((valid) => {
        //         if (valid) {
        //             alert(formName);
        //         } else {
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     });
        // },
        // 编辑
        redact(row){
            this.id = row.id;
            this.redactBox = true;
            this.axios.get('/admin/user/getUserInfo?id='+this.id).then(res =>{
                this.formData = res.data.data
                console.log(res.data)
            })
        },
        // 确认编辑
        redactTrue(){
            this.axios.post('/admin/user/updateUser',this.formData).then(res=>{
                console.log(res)
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.redactBox = false;
                this._getStuData()
            }).catch(err =>{
                console.log(err)
            })
        },
        // 删除学生
        deleteStu(row){
            this.id = row.id;
            this.dialogVisible = true;
        },
        // 确认删除
        deleteTrue(){
            const data = {id: this.id}
            this.axios.get('/admin/user/del?id='+this.id).then(res =>{
                this.dialogVisible = false;
                this._getStuData()
            })
        },
        // 用户点击分页数字
        currentPage(index){
            this.myTableData = this.tableData.slice(index*6-6,index*6)
            console.log(index)
        },
        // 点击上一页
        prevPage(index){
            // console.log(index)
        },
        // 点击下一页
        nextPage(index){
            // console.log(index)
        },
        _getStuData(){
            this.axios.post('/admin/user/get_all_users',{b_id: this.classID}).then(res =>{
                res.data.data.forEach((ele,index) =>{
                    ele.serial = index+1
                })
                this.tableData = res.data.data
                this.pages =  Math.ceil(this.tableData.length*10/6);
                this.myTableData = this.tableData.slice(0,6)
            }).catch(err =>{
                console.log(err)
            })
        } 
    },
    created(){
        this._getStuData()
    }
}
</script>