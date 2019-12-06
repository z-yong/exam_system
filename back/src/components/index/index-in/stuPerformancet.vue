<template>
    <div class="per-wrapper">
        <div class="stu-per">
            <div class="per-table">
                <p class="table-title">{{name}}的历史考卷列表</p>
                <template>
                    <el-table :highlight-current-row="true"
                        :data="myTableData" style="width: 100%">
                        <el-table-column fixed prop="serial" label="序号" min-width="5px">
                        </el-table-column>
                        <el-table-column prop="title" label="考卷名称" min-width="20px">
                        </el-table-column>
                        <el-table-column  prop="simulation" label="考卷类别" min-width="10px">
                            <template slot-scope="scope">
                                <span>{{scope.row.simulation == 0 ? '正式考卷' : '模拟考卷'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="time" label="考试日期" min-width="10px">
                        </el-table-column>
                        <el-table-column prop="score" label="分数" min-width="10px">
                            <template slot-scope="scope">
                                <div v-if="scope.row.cj">
                                    <span style="color:#DC143C">{{scope.row.cj}}</span>
                                    <span>/{{scope.row.score}}</span>
                                </div>
                                <div v-else>缺考</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="15px">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="seePerformancet(scope.row)"><i class="iconfont">&#xe738;</i>查看答题卡</el-button>
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
            pages: 1,
            name: ''
        }
    },
    methods:{
        prevPage(){

        },
        nextPage(){

        },
        // 用户点击分页数字 
        currentPage(index){
            this.myTableData = this.tableData.slice(index*6-6,index*6)
        },
        seePerformancet(row){
            if(row.cj){
                this.$emit('seeAnswer',row)
            }else{
                this.$message({
                    message: '该场考试此学生没有参加',
                    type: 'error'
                })
            }
        }
    },
    created(){
        this.axios.post('/admin/user/get_user_issue',{u_id:this.id}).then(res =>{
            console.log(res)
            this.name = res.data.msg;
            res.data.data.forEach((ele,index) =>{
                    ele.serial = index+1
                })
            this.tableData = res.data.data;
            this.pages =  Math.ceil(this.tableData.length*10/6);
            this.myTableData = this.tableData.slice(0,6)
        })
    }
}
</script>
<style src='./stuPerformancet.css' scoped>
</style>