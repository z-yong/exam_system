<template>
    <div class="setup-wrapper">
         <div class="setup-box">
            <div class="search">
                <span>筛选条件</span>
                <div>
                    <el-select v-model="value" placeholder="请选择" @change="changeStatus">
                        <el-option value="状态"></el-option>
                        <el-option value="可用"></el-option>
                        <el-option value="不可用"></el-option>
                    </el-select>
                   <div class="identity">
                        <el-input v-model="identity" placeholder="请输入身份名称" @input="searchData" clearable></el-input>
                   </div>
                </div>
                <!-- <el-button type='primary' @click="searchData" class="el-icon-search"> 搜索</el-button> -->
                <el-button type='primary' @click="addIdent('add')" class="add-ident">添加身份</el-button>
            </div>
            <div class="table">
                <p class="table-title">身份列表</p>
                <el-table :data="myTableData" style="width: 100%">
                    <el-table-column prop="index" label="编号" min-width="20px">
                    </el-table-column>
                    <el-table-column prop="limit_name" label="身份" min-width="20px">
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" min-width="20px">
                    </el-table-column>
                    <el-table-column prop="state" label="状态" min-width="20px" >
                        <template slot-scope="scope">
                            <i class="iconfont" :class="scope.row.state == 1 ? 'green' : 'red'">
                                {{scope.row.state == 1 ? '&#xe62e;' : '&#xe600;'}}
                            </i>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="20px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="addIdent('redact',scope.row,scope.$index)"><i class="iconfont">&#xe64b;</i>编辑</el-button>
                            <el-button type="text" size="small" @click="deleteData(scope.row)"><i class="iconfont">&#xe631;</i>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog :title="disTitle" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
            <el-form :model="formData">
                <el-form-item label="身份名称" label-width="80px" v-model="formData.name">
                    <el-input v-model="formData.name" placeholder="输入身份名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限范围" label-width="80px">
                     <div class="block">
                        <el-cascader v-model="formData.values"
                            :show-all-levels='false'
                            placeholder="试试搜索：管理"
                            :options="options"
                            :props="{ multiple: true }"
                            filterable>
                        </el-cascader>
                    </div>
                </el-form-item>
                <el-form-item label="状态" label-width="80px">
                    <el-select v-model="formData.value" placeholder="请选择">
                        <el-option value='立即开启此身份' label="立即开启此身份"></el-option>
                        <el-option value='先保留,暂不开启' label="先保留,暂不开启"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addIdentTrue">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible2"
            width="30%">
            <span>确认删除此身份?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="deleteTrue">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style scoped>
    @import './setup.css';
</style>

<script>
export default {
    data(){
        return {
            value:'状态',
            id: 0,
            isAdd: true,
            identity: '',
            formData:{
                name: '',
                values: [],
                value: ''
            },
            disTitle: '添加身份',
            dialogFormVisible: false,
            dialogVisible2: false,
            tableData: [
                { 
                   serial: 1,
                   identity: '大领导' ,
                   juris: '整个后台管理',
                   status: false
                },
                { 
                   serial: 2,
                   identity: '特大领导' ,
                   juris: '整个项目管理',
                   status: true
                }
            ],
            myTableData: [],
            options: []
        }
    },
    methods: {
        changeStatus(value){
            const data = this.tableData.filter(item =>{
                return item.limit_name.match(this.identity)
            })
            if(value == '状态'){
                this.myTableData = data
            }else if(value == '不可用'){
                this.myTableData = data.filter((item) =>{
                    return item.state == 0
                })
            }else if(value == '可用'){
                this.myTableData = data.filter((item) =>{
                    return item.state == 1
                })
            }
        },
        // 添加身份/编辑身份
        addIdent(value,row,index){
            this.axios.get('/admin/manage/getLimit').then(res =>{
                    console.log(res.data);
                    res.data.data.forEach((ele,index) =>{
                        this.options[index] = {}
                        this.options[index]['children'] = []
                        this.options[index]['value'] = ele.id;
                        this.options[index]['label'] = ele.menu_name;
                        ele.child.forEach((el,i) =>{
                            this.options[index]['children'][i] = {}
                            this.options[index]['children'][i]['value'] = el.id;
                            this.options[index]['children'][i]['label'] = el.menu_name;
                        })
                    })
                    this.dialogFormVisible = true;
                })
            this.formData.values = [];
            if(value == 'add'){
                this.isAdd = true;
                this.formData.value = '',
                this.formData.name = '',
                this.values = [];
                this.disTitle = '添加身份'
            }else{
                this.isAdd = false;
                this.disTitle = '修改身份';
                this.id = row.id
                console.log(this.id)
                this.axios.get('/admin/manage/modify?id='+this.id).then(res =>{
                    console.log(res);
                    this.formData.name = res.data.data.limit_name;
                    if(res.data.data.state == 0){
                        this.formData.value = '先保留,暂不开启'
                    }else if(res.data.data.state == 1){
                        this.formData.value = '立即开启此身份'
                    }
                    const data = res.data.data.limit_data;
                    const arr = []
                    data.forEach(ele =>{
                        ele.child.forEach((e) =>{
                            if(e.state == 1){
                                arr.push([ele.id,e.id])
                            }
                            
                        })
                    })
                    this.formData.values = this.formData.values.concat(arr)
                    this.dialogFormVisible = true;
                    console.log(this.formData)
                })
                
            }
        },
        // 确认添加身份/编辑身份
        addIdentTrue(){
            const data = {}
            const arr = [];
            data.limit_data = [];
            this.formData.values.forEach(ele =>{
                arr.push(ele[0])
                arr.push(ele[1])
            });
            // 数组去重
            const obj = {}
            arr.forEach((ele,index) =>{
                if(!obj[ele]){
                    data.limit_data.push(ele);
                    obj[ele] = 1
                }
            })
            data.limit_name = this.formData.name;
            if(this.formData.value == '立即开启此身份'){
                data.state = 1
            }else{
                data.state = 0
            }
            if(this.isAdd){
                this.axios.post('/admin/manage/addIdentity',data).then(res =>{
                    this.dialogFormVisible = false;
                    this._getInfoData()
                })
            }else{
                data.id = this.id
                this.axios.post('/admin/manage/modifyIdentity',data).then(res =>{
                    this.dialogFormVisible = false;
                    this._getInfoData()
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
            this.axios.get('/admin/manage/deleteLimit?id='+this.id).then(res =>{
                this.dialogVisible2 = false;
                this.$message({
                    message: res.data.msg,
                    type: 'error'
                })
                this._getInfoData()
            })
        },
        // 点击搜索
        searchData(value){
            let index = 0;
            if(this.value != '状态'){
                if(this.value == '可用') index = 1;
                if(this.value == '不可用') index = 0
                this.myTableData = this.tableData.filter(item =>{
                    return item.limit_name.match(value) && (index == item.state)
                })
            }else{
                this.myTableData = this.tableData.filter(item =>{
                    return item.limit_name.match(value)
                })
            } 
        },
        _getInfoData(){
            this.axios.get('/admin/manage/limitList').then(res =>{
                this.tableData = res.data.data;
                this.tableData.forEach((ele,index) =>{
                    ele.index = index+1
                })
                this.myTableData = this.tableData;
            })
        }
    },
    created(){
        this._getInfoData()
    }
}
</script>