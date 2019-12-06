<template>
    <div class="table-wrapper">
        <div v-if="myTableData.length != 0" class="table-box">
            <p class="table-title"><span>{{myTableData[0]['state'] == '缺考' ? '缺考人数' : myTableData[0]['state']}}</span></p>
            <!-- 表格 -->
            <div id="table">
                <template>
                    <el-table :highlight-current-row="true"
                        :data="myTableData" border style="width: 100%">
                        <el-table-column fixed prop="real_name" label="学生" min-width="10px">
                        </el-table-column>
                        <el-table-column prop="user_name" label="学号" :min-width="isQual ? '20px' : '22.5px'">
                        </el-table-column>
                        <el-table-column  prop="time" label="近期考试时间" :min-width="isQual ? '20px' : '22.5px'">
                        </el-table-column>
                        <el-table-column prop="shijuan" label="试卷名称" :min-width="isQual ? '20px' : '22.5px'">
                        </el-table-column>
                        <el-table-column prop="state" :label="isQual ? '结果' : '此次缺考'" 
                                         :class-name="myTableData[0]['state'] == '合格' ? 'state' : 'noQual'" min-width="15px">
                        </el-table-column>
                        <el-table-column label="操作" min-width="15px" v-if="isQual">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看错题</el-button>
                                <!-- <el-button class-name="aa" type="text" size="small">不查看</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <div class="paging">
                    <el-pagination
                        @current-change	='changePage'
                        background
                        layout="prev, pager, next"
                        :total="pages">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-else class="no_table">
            暂无考试记录
        </div>
    </div>
</template>

<style scoped>
    @import './table.css';
</style>
<script>
export default {
    props: {
        tableData: {
            type: Array,
            required: true
        },
        isQual: {
            type: Boolean,
            required: true
        }
    },
    data(){
        return {
            pages: 0,
            myTableData: []
        }
    },
    methods: {
        handleClick(row) {
            this.$emit('lookErr',row.id)
        },
        changePage(currentIndex){
            this.myTableData = this.tableData.slice(6*(currentIndex - 1),6*currentIndex)
        }
    },
    computed: {
        
    },
    created(){
        this.myTableData = this.tableData.slice(0,6)
        this.pages = Math.ceil(this.tableData.length/6)*10
    }
}
</script>