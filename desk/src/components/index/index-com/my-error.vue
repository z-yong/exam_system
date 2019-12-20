<template>
    <div class="mis-wrapper">
        <div class="mis-box">
            <p class="mis-title">
                <span class="tt">错题</span>
            </p>
            <div class="mis-table">
                <template>
                    <el-table :data="tableData" stripe style="width: 100%">
                        <el-table-column prop="name" label="试卷名称" min-width="15" align='center'></el-table-column>
                        <el-table-column prop="desc" label="试题名称" min-width="30" align='center'></el-table-column>
                        <el-table-column prop="type" label="试题类型" min-width="15" align='center'></el-table-column>
                        <el-table-column prop="degree" label="难度" min-width="15" align='center'></el-table-column>
                        <el-table-column prop="grade" label="分数" min-width="15" align='center'></el-table-column>
                    </el-table>
                </template>
            </div>
            <div class="paging">
                <el-pagination @current-change='changePage' background layout="prev, pager, next" :total="pages"></el-pagination>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import './my-error.css';
</style>
<script>
export default {
    data(){
        return {                        
                tableData: [],
                pages: 0
            }
    },
    methods: {
        changePage(currentIndex){
            this.tableData = this.tableData.slice(6*(currentIndex - 1),6*(currentIndex - 1) + 6)
        },
        _getTableData(){
            this.axios.get('/index/index/WrongQuestions').then(res =>{
                console.log(res)
                const data = res.data.data;
                data.forEach((ele) =>{
                    this.tableData.push({
                        name: ele.sj_name,
                        desc: ele.st_name,
                        type: ele.type,
                        degree: ele.difficulty,
                        grade: ele.fraction,
                        id: ele.id,
                        tid: ele.tid
                    })
                })
                this.pages = Math.ceil(this.tableData.length/6) * 10;
            })
        }
    },
    created(){
        this._getTableData()
    }
}
</script>