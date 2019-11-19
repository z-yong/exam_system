<template>
    <div class="table-wrapper">
        <div class="table-box">
            <p class="table-title"><span>试卷列表</span></p>
            <!-- 表格 -->
            <div id="table">
                <template>
                    <el-table :highlight-current-row="true"
                        :data="myTableData" border style="width: 100%">
                        <el-table-column fixed prop="time" label="考试时间" min-width="10px">
                        </el-table-column>
                        <el-table-column prop="name" label="试卷名称"  min-width="20px">
                        </el-table-column>
                        <el-table-column  prop="qua" label="分数"  min-width="10px">
                        </el-table-column>
                    </el-table>
                </template>
                <div class="paging">
                    <el-pagination
                        @curren-change='changePage'
                        background
                        layout="prev, pager, next"
                        :total="pages">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import './my-topic.css';
</style>
<script>
export default {
    data(){
        return {
            tableData: [],
            myTableData: [],
            pages: 0
        }
    },
    methods: {
         changePage(currentIndex){
            this.myTableData = this.tableData.slice(6*(currentIndex - 1),6*currentIndex)
        },
        _getExamMess(){
            this.axios.get('/index/index/ExaminationList').then(res =>{
                const data = res.data.data;
                data.forEach((ele,index) =>{
                    this.tableData.push({time: ele.time, name: ele.title, qua: ele.achievement ,id: ele.id})
                })
                this.pages = Math.ceil(this.tableData.length/6) *10;
                this.myTableData = this.tableData.slice(0,6);
            })
        }
        
    },
    created(){
        this._getExamMess()
        // const data = JSON.parse(this.$route.query.tableData)
        // console.log(data)
        // this.tableData = data
    }
}
</script>