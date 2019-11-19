<template>
    <div class="mis-wrapper">
        <div class="mis-box">
            <p class="mis-title">
                <span class="iconfont" @click="misSend">&#xe501;</span>
                <span class="tt">错题</span>
            </p>
            <div class="mis-table">
                <template>
                    <el-table :data="myTableData" stripe style="width: 100%">
                        <el-table-column prop="title" label="试题名称" min-width="40" align='center'>
                        </el-table-column>
                        <el-table-column prop="type" label="试题类型" min-width="15" align='center'>
                        </el-table-column>
                        <el-table-column prop="difficulty" label="难度" min-width="15" align='center'>
                        </el-table-column>
                        <el-table-column prop="fraction" label="分数" min-width="15" align='center'>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
            <div class="paging">
                <el-pagination
                     @current-change ='changePage'
                    background
                    layout="prev, pager, next"
                    :total="pages">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import './mistakes.css';
</style>
<script>
export default {
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data(){
        return {                        
                tableData: [],
                myTableData: [],
                pages: 0
            }
    },
    methods: {
        misSend(){
            this.$emit('leaveMis')
        },
        changePage(currentIndex){
            this.myTableData = this.tableData.slice((currentIndex - 1)*6, currentIndex*6)
        }
    },
    created(){
        this.axios.get('/admin/index/chakan?id='+this.id).then(res =>{
            this.tableData = res.data.data;
            this.myTableData = this.tableData.slice(0,6);
            this.pages = Math.ceil(this.tableData.length/6)*10;
        })
    }
}
</script>