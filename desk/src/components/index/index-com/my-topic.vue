<template>
    <div class="table-wrapper">
        <div class="table-box">
            <p class="table-title"><span>试卷列表</span></p>
            <!-- 表格 -->
            <div id="table">
                <template>
                    <el-table :highlight-current-row="true"
                        :data="myTableData" border style="width: 100%">
                        <el-table-column fixed prop="time" label="技能考试时间" min-width="10px">
                            <template slot-scope="scope">
                                <div>{{scope.row.time || '暂无'}}</div>
                                <!-- <div v-else>缺考</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="技能卷名称"  min-width="20px">
                            <template slot-scope="scope">
                                <div>{{scope.row.title || '暂无'}}</div>
                                <!-- <div v-else>缺考</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column  prop="cj" label="技能卷得分"  min-width="5px">
                            <template slot-scope="scope">
                                <div v-if="scope.row.cj">
                                    <span style="color:#DC143C">{{scope.row.cj}}</span>
                                    <span>/{{scope.row.score}}</span>
                                </div>
                                <div v-else>暂无</div>
                            </template>
                        </el-table-column>
                        <el-table-column fixed prop="time_a" label="理论考试时间" min-width="10px">
                            <template slot-scope="scope">
                                <div>{{scope.row.time_a || '暂无'}}</div>
                                <!-- <div v-else>缺考</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="title_a" label="理论卷名称"  min-width="20px">
                            <template slot-scope="scope">
                                <div>{{scope.row.title_a || '暂无'}}</div>
                                <!-- <div v-else>缺考</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column  prop="cj_a" label="理论卷得分"  min-width="5px">
                            <template slot-scope="scope">
                                <div v-if="scope.row.cj_a">
                                    <span style="color:#DC143C">{{scope.row.cj_a}}</span>
                                    <span>/{{scope.row.score_a}}</span>
                                </div>
                                <div v-else>暂无</div>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="zongfen" label="总分"  min-width="5px">
                            <template slot-scope="scope">
                                <div v-if="scope.row.cj_a || scope.row.cj">
                                    <span style="color:#DC143C">{{scope.row.zongfen}}</span>
                                    <span>/{{scope.row.zf}}</span>
                                </div>
                                <div v-else>暂无</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <div class="paging">
                    <el-pagination @current-change='changePage' background layout="prev, pager, next" :total="pages"
                                   @prev-click='prevPage' @next-click='nextPage' >
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
        changePage(index){
            this.myTableData = this.tableData.slice(6*(index - 1),6*index)
        },
        prevPage(){},
        nextPage(){},
        _getExamMess(){
            this.axios.get('/index/index/ExaminationList').then(res =>{
                this.tableData = res.data.data;
                this.pages = Math.ceil(this.tableData.length/6) *10;
                this.myTableData = this.tableData.slice(0,6);
            })
        }
        
    },
    created(){
        this._getExamMess();
    }
}
</script>