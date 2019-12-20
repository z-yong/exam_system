<template>
    <div class="per-wrapper">
        <div class="stu-per">
            <div class="per-table">
                <p class="table-title">{{name}}的历史考卷列表</p>
                <!-- <div style="display:flex;align-items: center;background:#fff;border-bottom:1px solid #eee;margin-top:2vh"> -->
                    <!-- <div v-for="(menu,mi) in menuList" :key="mi" style="padding:1.2vh 2vw;cursor: pointer;border:1px solid #f7f7f7;" @click="changeMenu(mi)"
                        :style="{background:currentIndex == mi ? '#0070d8' : '',color: currentIndex == mi ? '#fff' : '',opacity: currentIndex == mi ? '0.7' : ''}">{{menu}}</div> -->
                <!-- </div> -->
                <template>
                    <el-table :highlight-current-row="true"
                        :data="myTableData" style="width: 100%">
                        <el-table-column fixed prop="serial" label="序号" min-width="5px"></el-table-column>
                        <el-table-column  prop="simulation" label="考卷类别" min-width="8px">
                            <template slot-scope="scope">
                                <span>{{scope.row.simulation == 0 ? '正式考卷' : '模拟考卷'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="技能卷考卷名称" min-width="15px"></el-table-column>
                        <el-table-column prop="timea" label="技能卷考试日期" min-width="10px"></el-table-column>
                        <el-table-column prop="cj" label="技能分" min-width="5px">
                            <template slot-scope="scope">
                                <div>
                                    <span style="color:#DC143C">{{scope.row.cj}}</span>
                                    <span>/{{scope.row.score}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title_a" label="理论卷考卷名称" min-width="15px"></el-table-column>
                        <el-table-column prop="timeb" label="理论卷考试日期" min-width="10px"></el-table-column>
                        <el-table-column prop="cj_a" label="理论分" min-width="5px">
                            <template slot-scope="scope">
                                <div>
                                    <span style="color:#DC143C">{{scope.row.cj_a}}</span>
                                    <span>/{{scope.row.score_a}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="zongfen" label="总分" min-width="8px">
                            <template slot-scope="scope">
                                <div>
                                    <span style="color:#DC143C">{{scope.row.zongfen}}</span>
                                    <span>/{{scope.row.manfen}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="20px">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="seePerformancet(scope.row)"><i class="iconfont">&#xe738;</i>查看答题卡</el-button>
                                <el-button type="text" size="small" @click="correctTopic(scope.row)"><i class="iconfont">&#xe64b;</i>批改试卷</el-button>
                            </template>
                        </el-table-column>
                    </el-table> 
                </template>
                <div class="paging">
                    <el-pagination background @current-change='currentPage' @prev-click='prevPage' @next-click='nextPage' 
                                   layout="prev, pager, next" :total="pages"></el-pagination>
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
            menuList: ['技能卷','理论卷'],
            currentIndex: 0,
            tableData: [],
            myTableData: [],
            pages: 1,
            name: ''

        }
    },
    methods:{
        changeMenu(index){
            this.currentIndex = index;
            if(index == 0){
                this._getOfficialData();
            }else{
                this._getTheoryData();
            }
        },
        prevPage(){

        },
        nextPage(){

        }, 
        // 用户点击分页数字 
        currentPage(index){
            this.myTableData = this.tableData.slice(index*6-6,index*6)
        },
        seePerformancet(row){
            if(!row.cj && !row.cj_a){
                this.$message({
                    message: '该场考试此学生没有参加',
                    type: 'error'
                })
            }else{
                this.$emit('seeAnswer',row)
            }
        },
        correctTopic(row){
            if(!row.cj_a){
                this.$message({
                    message: '该场考试此学生没有参加',
                    type: 'error'
                })
            }else{
                const data = {
                    u_id: row.u_id,
                    s_type_a: row.s_type_a,
                    l_id: row.l_id,
                    id: row.id
                }
                this.$emit('correct',data)
            }
        },
        _getOfficialData(){
            this.axios.post('/admin/user/get_user_issue',{u_id:this.id}).then(res =>{
                this.name = res.data.msg;
                res.data.data.forEach((ele,index) =>{
                    ele.serial = index+1
                })
                this.tableData = res.data.data;
                this.pages =  Math.ceil(this.tableData.length*10/6);
                this.myTableData = this.tableData.slice(0,6)
            })
        },
        _getTheoryData(){
            this.axios.post('/admin/paper/get_answer_list',{id: this.id}).then(res =>{
                console.log(res)
                res.data.data.forEach((ele,index) =>{
                    ele.serial = index+1
                })
                this.tableData = res.data.data;
                this.pages =  Math.ceil(this.tableData.length*10/6);
                this.myTableData = this.tableData.slice(0,6)
            })
        }
    },
    created(){
        this._getOfficialData();
    }
}
</script>
<style src='./stuPerformancet.css' scoped>
</style>