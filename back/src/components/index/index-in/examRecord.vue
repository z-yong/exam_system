<template>
    <div class="record-wrapper">
        <div class="table-box">
            <div class="table">
                <p class="table-title" style="display:flex;align-items:center;">
                    <span class="iconfont" style="margin-right:0.2vw;cursor: pointer;font-size:18px" @click="back">&#xe501;</span>
                    <span>班级历史考卷</span>
                </p>
                <el-table :data="myTableData" style="width: 100%">
                    <!-- <el-table-column prop="id" label="编号" min-width="10px"></el-table-column> -->
                    <el-table-column prop="title" label="技能卷名称" min-width="20px">
                        <template slot-scope="scope">
                            <span>{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title_a" label="理论卷名称" min-width="20px">
                        <template slot-scope="scope">
                            <span>{{scope.row.title_a}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="创建日期" min-width="10px" ></el-table-column>
                    <el-table-column prop="timea" label="技能卷开考日期" min-width="10px" ></el-table-column>
                    <el-table-column prop="timeb" label="理论卷开考日期" min-width="10px" ></el-table-column>
                    <el-table-column label="操作" min-width="10px">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="exportData(scope.row.id)"><i class="iconfont">&#xe7ef;</i>导出成绩</el-button>
                            <el-button type="text" size="small" @click="deleteData(scope.row.id)"><i class="iconfont">&#xe631;</i>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="paging">
                    <el-pagination background @current-change='currentPage' layout="prev, pager, next" :total="pages"></el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>确认删除该班级?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteTrue">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        id: {
            type: Number
        }
    },
    data(){
        return{
            tableData: [],
            myTableData: [],
            dialogVisible: false,
            recordID: '',
            pages: 1
        }
    },
    methods: {
        back(){
            this.$emit('back')
        },
        exportData(id){//下载word文件
            window.location.href = '/admin/user/get_export?id='+id;
        },
        deleteData(id){
            this.recordID = id;
            this.dialogVisible = true;
        },
        deleteTrue(){
            this.axios.post('/admin/user/delete_ksap', {id: this.recordID}).then(res =>{
                this.$message({
                    message: res.data.msg,
                    type: 'success'
                })
                this._getData();
                this.dialogVisible = false;
            })
        },
        // 用户点击分页数字 
        currentPage(index){
            this.myTableData = this.tableData.slice(index*6-6,index*6)
        },
        _getData(){
            this.axios.post('/admin/user/get_kaoshi_anpai',{b_id: this.id}).then(res =>{
                this.tableData = res.data.data;
                this.pages =  Math.ceil(this.tableData.length*10/6);
                this.myTableData = this.tableData.slice(0,6);
            })
        }
    },
    created(){
        this._getData();
    }
}
</script>
<style scoped>
    .record-wrapper{
        width: 100%;
        height: 100%;
        background: #f7f7f7;
        padding-top: 3vh;
    }
    .record-wrapper .table-box{
        width: 95%;
        margin: auto
    }
    .record-wrapper .table{
        width: 100%;
        background: #fff;
        margin-top: 2vh;
        padding-bottom: 3vh;
    }
    .record-wrapper .table .table-title{
        height: 7vh;
        line-height: 7vh;
        font-size: 16px;
        font-weight: 600;
        text-indent: 0.5em;
        border-bottom: 1px solid #eee
    }
    .record-wrapper .el-button.el-button--text.el-button--small:nth-child(1){
        color: green
    }
    .record-wrapper .el-button.el-button--text.el-button--small:nth-child(2){
        color: #ff637b;
    }
    .record-wrapper .el-button.el-button--text.el-button--small .iconfont{
        margin-right: 4px;
    }
    .record-wrapper .paging{
        text-align: center;
        margin: 4vh 0 0;
    }
</style>