<template>
    <div class="user-wrapper">
         <div class="user-box">
            <div class="search">
                <span>筛选条件</span>
                <div>
                   <div style="display： inline-block; margin-left: 1vw">
                        <el-input v-model="className" placeholder="请输入用户姓名或身份" @input="searchData" clearable></el-input>
                   </div>
                </div>
                <el-button type='primary' @click="addClass('add')" class="add-ident">添加新用户</el-button>
            </div>
            <div class="table">
                <p class="table-title">管理员列表</p>
                <el-table :data="myTableData" style="width: 100%">
                    <el-table-column prop="admin_name" label="账号" min-width="20px">
                    </el-table-column>
                    <el-table-column prop="admin_real" label="姓名" min-width="20px">
                    </el-table-column>
                    <el-table-column prop="admin_limit_name" label="身份" min-width="20px" >
                    </el-table-column>
                    <el-table-column prop="admin_state" label="是否启用" min-width="20px" >
                        <template slot-scope="scope">
                            <i class="iconfont" :class="scope.row.admin_state == 1 ? 'green' : 'red'">
                                {{scope.row.admin_state == 1 ? '&#xe62e;' : '&#xe600;'}}
                            </i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" min-width="20px">
                    </el-table-column>
                    <el-table-column label="操作" min-width="20px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="addClass('redact',scope.row,scope.$index)"><i class="iconfont">&#xe64b;</i>编辑</el-button>
                            <el-button type="text" size="small" @click="deleteData(scope.row)"><i class="iconfont">&#xe631;</i>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog :title="disTitle" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
            <el-form :model="formData">
                <el-form-item label="登录账号" label-width="80px">
                    <el-input :disabled="isamend" v-model="formData.admin_name" placeholder="输入登录账号" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" label-width="80px">
                    <el-input type="password" v-model="formData.admin_pwd" :placeholder="passPlaceholder" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="80px">
                    <el-input v-model="formData.admin_real" placeholder="输入用户姓名" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户身份" label-width="80px">
                    <el-select v-model="formData.admin_limit_name" filterable placeholder="请选择用户身份" @change='changeIdent'>
                        <el-option v-for="item in idents" :key="item.limit_name" :label="item.limit_name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用" label-width="80px">  
                    <el-radio-group v-model="formData.admin_state">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">不启用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addClassTrue">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible2" width="30%">
            <span>确认删除该用户?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="deleteTrue">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style scoped>
    @import './userAdmin.css';
</style>

<script>
export default {
    data(){
        return {
            value:'状态',
            id: 0,
            isAdd: true,
            className: '',
            isamend: false,
            formData:{
                admin_name: '',
                admin_pwd: '',
                admin_real: '',
                admin_limit_name: '',
                admin_state: 1
            },
            idents: [],
            disTitle: '添加班级',
            dialogFormVisible: false,
            dialogVisible2: false,
            tableData: [],
            myTableData: [],
            examinations: [],
            examination_mns: [],
            identID: 0,
            passPlaceholder: '输入登录密码'
        }
    },
    methods: {
        // 添加身份/编辑身份
        addClass(value,row,index){
            if(value == 'add'){
                this.disTitle = '添加新用户';
                this.passPlaceholder = '输入登录密码';
                this.isamend = false;
                this.formData = { admin_name: '', admin_pwd: '', admin_real: '', admin_state: 1,admin_limit_name: ''};
                this.identID = 0;
                this.dialogFormVisible = true
            }else{
                this.id = row.id;
                this.axios.get('/admin/user/getAdminUser?id='+row.id).then(res =>{
                    this.disTitle = '修改用户信息';
                    this.passPlaceholder = '输入修改的登录密码 (不填写则不会修改)';
                    this.isamend = true;
                    this.formData = res.data.data;
                    this.dialogFormVisible = true;
                    this.identID = res.data.data.admin_limit
                })
            }
        },
        // 确认添加班级/编辑班级
        addClassTrue(){
            if(this.disTitle == '修改用户信息'){
                const data = {
                    id: this.id,
                    admin_real: this.formData.admin_real,
                    admin_limit: this.identID,
                    admin_state: this.formData.admin_state
                }
                if(this.formData.admin_pwd) {
                    data.admin_pwd = this.formData.admin_pwd
                }
                this.axios.post('/admin/user/modifyAdminUser',data).then(res =>{
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    this._getInfoData()
                    this.dialogFormVisible = false;
                })
            }else{
                if(!this.formData.admin_name) return this.$message({message: '请输入登录账号！',type: 'error'});
                if(!this.formData.admin_pwd) return this.$message({message: '请输入登录密码！',type: 'error'});
                if(!this.formData.admin_real) return this.$message({message: '请输入用户姓名！',type: 'error'});
                if(!this.formData.admin_limit_name) return this.$message({message: '请选择用户身份！',type: 'error'});
                const data = {
                    admin_name: this.formData.admin_name,
                    admin_pwd: this.formData.admin_pwd,
                    admin_real: this.formData.admin_real,
                    admin_limit: this.identID,
                    admin_state: this.formData.admin_state
                }
                this.axios.post('/admin/user/addAdminUser',data).then(res =>{
                    console.log(res)
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
            this.axios.get('/admin/user/deleteAdminUser?id='+this.id).then(res =>{
                this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                this.dialogVisible2 = false;
                this._getInfoData()
            })
        },
        changeIdent(e){
            this.identID = e;
        },
        // 点击搜索
        searchData(value){
            let index = 0;
            this.myTableData = this.tableData.filter(item =>{
                return item.admin_real.match(value) || item.admin_limit_name.match(value)
            })
        },
        _getInfoData(){
            this.axios.get('/admin/user/AdminUserList').then(res =>{
                this.tableData = res.data.data;
                this.myTableData = this.tableData;
            })
            this.axios.get('/admin/user/getLimit').then(res =>{
                this.idents = res.data.data;
            })
        }
    },
    created(){
        this._getInfoData()
    }
}
</script>