<template>
    <div>
         <div class="stu-table">
            <p class="table-title">所有学生列表</p>
            <template>
                <el-table :highlight-current-row="true"
                    :data="myTableData" style="width: 100%">
                    <el-table-column fixed prop="serial" label="序号" min-width="5px">
                    </el-table-column>
                    <el-table-column prop="real_name" label="考卷名称" min-width="10px">
                    </el-table-column>
                    <el-table-column  prop="pass" label="考卷类别" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="mobile" label="考试日期" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="user_name" label="分数" min-width="20px">
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
            myTableData: [],
            currentPage: 0,
            pages: 1
        }
    },
    methods:{
        prevPage(){

        },
        nextPage(){

        },
        seePerformancet(row){

        }
    },
    created(){
        console.log(this.id)
    }
}
</script>