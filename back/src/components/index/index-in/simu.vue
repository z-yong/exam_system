<template>
    <div class="simu-wrapper">
        <div class="simu-box">
            <div class="search">
                <div class="condition">
                    <span>筛选条件：</span>
                    <el-select v-model="value" placeholder="请选择" @change="getValue">
                        <el-option 
                        v-for="item in options"
                        :key="item.value"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                  <span class="topic-name">试卷名称</span>
                  <el-input
                    placeholder="请输入试卷名称"
                    v-model="topicName"
                    @input="searchTopicName"
                    clearable>
                  </el-input>
                </div>
                <!-- <div class="time">
                    <span class="startDate">选择开始时间：</span>
                    <div class="block start">
                        <el-date-picker
                        v-model="startDate"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                    <span class="endDate">选择结束时间：</span>
                    <div class="block">
                        <el-date-picker
                        v-model="endDate"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </div> -->
                <!-- <el-button type='primary' @click="searchData" class="el-icon-search"> 搜索</el-button> -->
            </div>
            <div class="table">
                <p class="table-title">{{title}}</p>
                <el-table :data="myTableData" style="width: 100%">
                    <el-table-column prop="serial" label="序号" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="name" label="试卷名称" min-width="30px">
                    </el-table-column>
                    <el-table-column v-if="isOper" prop="type" label="试卷类型" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="currentSelect" label="正式考卷" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="searchNum" label="卷数" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="usersNum" label="考生数" min-width="10px">
                    </el-table-column>
                    <el-table-column prop="qual" label="合格率" min-width="10px">
                    </el-table-column>
                    <el-table-column label="操作" min-width="36px">
                        <template slot-scope="scope">
                            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small"><i class="iconfont">&#xe605;</i>查看</el-button> -->
                            <el-button @click="redact(scope.row)" type="text" size="small"><i class="iconfont">&#xe64b;</i>设置</el-button>
                            <el-button type="text" @click="deleteData(scope.row)" size="small"><i class="iconfont">&#xe631;</i>删除</el-button>
                            <el-button @click="addTopic(scope.row)" type="text" size="small"><i class="iconfont">&#xe61b;</i>创建{{scope.row.currentTopic}}卷</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
        <!-- 删除模态框 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible" :close-on-click-modal='false' width="30%">
          <span>确认删除此试卷？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="isDelete">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑模态框 -->
        <el-dialog title="设置试卷" :visible.sync="dialogFormVisible2" :close-on-click-modal='false'>
          <el-form :model="formData" label-width="150px">
            <!-- label-width="50vw" -->
            <el-form-item label="试卷名称" >
              <el-input v-model="formData.name" autocomplete="off" placeholder="输入试卷名称"  label-width='30px'></el-input>
            </el-form-item>
            <el-form-item label="请选择正式考卷">
              <el-select v-model="formData.select">
                <el-option v-for="(item,index) in formData.selects" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开考日期" >
               <!-- <el-date-picker v-model="formData.date" type="date" placeholder="选择考试日期"></el-date-picker> -->
               <el-date-picker v-model="formData.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="考试时长(分钟)" >
               <el-input v-model="formData.time" autocomplete="off" placeholder="输入考试时长"></el-input>
            </el-form-item>
            <el-form-item label="考试人数" >
               <el-input v-model="formData.stuNum" autocomplete="off" placeholder="输入考试人数"></el-input>
            </el-form-item>
            <el-form-item label="请选择审核方式">
              <el-select v-model="formData.audit">
                <el-option v-for="(item,index) in formData.audits" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否需要修改已生成的试卷内容" label-width='240px'>
              <el-radio-group v-model="radio">
                <el-radio-button label="是"></el-radio-button>
                <el-radio-button label="否"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="settingTopic">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 选择ABCD卷模态框 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible3" :close-on-click-modal='false' width="30%">
          <span class="dialogVisible3Text">设置成功！您需要修改哪一卷？</span>
          <el-select v-model="selectValue" placeholder="选择试卷">
                        <el-option 
                        v-for="item in options2"
                        :key="item"
                        :value="item">
                        </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="goToSetTopic">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<style scoped>
    @import './simu.css';
</style>

<script>
  export default {
    props: {
      isOper: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        id: 0,
        pages: 0,
        radio: '否',
        currentTopic: '',
        options: [{
          value: '全部'
        }, {
          value: '近一个月'
        }, {
          value: '近三个月'
        }],
        options2: [],
        topicName: '',
        selectValue: 'A卷',
        value: '全部',
        startDate: '',
        endDate: '',
        myTableData: [],
        tableData: [],
        formData: {
          name: '',
          select: '',
          selects: [],
          date: '',
          time: '',
          stuNum: '',
          audit: '人工审核',
          audits: ['人工审核','电脑审核']
        },
        dialogVisible: false,
        dialogFormVisible2: false,
        dialogVisible3: false
      }
    },
    methods: {
        // 获取下拉框内容
        getValue(value){
            if(this.title == '模拟考卷列表'){
              if(value == '近一个月'){
                this.axios.get('/admin/issue/trueList?simulation=1&time=1').then(res =>{
                  this._getData(res.data.data)
                })
              }else if(value == '近三个月'){
                this.axios.get('/admin/issue/trueList?simulation=1&time=3').then(res =>{
                  this._getData(res.data.data)
                })
              }else if(value == '全部'){
                this.axios.get('/admin/issue/trueList?simulation=1').then(res =>{
                  this._getData(res.data.data)
                })
              }
            }else if(this.title == '正式考卷列表'){
              if(value == '近一个月'){
                this.axios.get('/admin/issue/trueList?simulation=0&time=1').then(res =>{
                  this._getData(res.data.data)
                })
              }else if(value == '近三个月'){
                this.axios.get('/admin/issue/trueList?simulation=0&time=3').then(res =>{
                  this._getData(res.data.data)
                })
              }else if(value == '全部'){
                this.axios.get('/admin/issue/trueList?simulation=0').then(res =>{
                  this._getData(res.data.data)
                })
              }
            }else if(this.title == '所有试卷列表'){
              if(value == '近一个月'){
                this.axios.get('/admin/issue/trueList?time=1').then(res =>{
                  this._getData(res.data.data)
                })
              }else if(value == '近三个月'){
                this.axios.get('/admin/issue/trueList?time=3').then(res =>{
                  this._getData(res.data.data)
                })
              }else if(value == '全部'){
                this.axios.get('/admin/issue/trueList').then(res =>{
                  this._getData(res.data.data)
                })
              }
            }
        },
        searchData(){

        },
        // 过滤试卷名称事件
        searchTopicName(){
          this.myTableData = this.tableData.filter(data =>{
            return data.name.match(this.topicName)
          })
        },
        // 点击查看
        handleClick(row) {
          this.id = row.id;
          const routerLink = this.$router.resolve({path: '/Topic',query: {id: row.id}});
          window.open(routerLink.href,'_blank')
        },
        // 添加试卷
        addTopic(row){
          this.id = row.id
          this.axios.get('/admin/issue/abcdIssue?id='+this.id).then(res =>{
            console.log(res);
            const title = row.currentTopic;
            const id = this.id;
            const name = res.data.data.title;
            const outline = res.data.data.outline;
            this.$emit('addTopic',{title, id, outline, name})
          })
          
        },
        // 点击页码
        changePage(currentIndex){
            this.myTableData = this.tableData.slice(6*(currentIndex - 1),6*(currentIndex - 1) + 6)
        },
        // 点击设置
        redact(row){
          this.id = row.id;
          this.axios.get('/admin/issue/editIssue?id='+row.id).then(res =>{
            this.formData.name  = res.data.data.title;
            this.formData.date = res.data.data.kk_time;
            this.formData.time = res.data.data.kssc_time;
            this.formData.stuNum = res.data.data.cankao_num;
            this.formData.select = res.data.data.choice + '卷';
            this.formData.audit = res.data.data.examine == 0 ? '人工审核' : '电脑审核';
            res.data.data.s_type.forEach((ele,index) =>{
              this.formData.selects[index] = ele + '卷'
            })
            this.options2 = this.formData.selects
          })
          this.dialogFormVisible2 = true;
        },
        // 保存设置
        settingTopic(){
          const data = {
            id: this.id,
            title: this.formData.name,
            kk_time: this.formData.date,
            kssc_time: this.formData.time,
            cankao_num: this.formData.stuNum,
            choice: this.formData.select.slice(0,1),
            examine: this.formData.audit == '人工审核' ? 0 : 1
          }
          this.axios.post('/admin/issue/editDoIssue',data).then(res =>{
            this._getInfoData()
            this.dialogFormVisible2 = false;
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            if(this.radio == '是'){
              this.dialogVisible3 = true;
            }
          })
        },
        // 修改考卷
        goToSetTopic(){
          this.$emit('amendTopic',{id: this.id, s_type: this.selectValue.slice(0,1)})
          this.dialogVisible3 = false;
        },
        // 点击删除键
        deleteData(row){
          this.id = row.id //将id赋值给下面isDelete 用于操作数据
          this.dialogVisible = true;
        },
        // 确认删除弹框
        isDelete(){
          this.dialogVisible = false;
          this.axios.post('/admin/issue/deleteIssue?id='+this.id).then(res =>{
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this._getInfoData()
          })
        },
        _getData(data){
            data.forEach((ele,index) =>{
                    this.tableData[index] = {};
                    this.tableData[index].id = ele.id;
                    this.tableData[index].currentTopic = ele.abc
                    this.tableData[index].serial = index+1;
                    this.tableData[index].name = ele.title;
                    this.tableData[index].type = ele.simulation;
                    this.tableData[index].currentSelect = ele.choice + '卷';
                    this.tableData[index].usersNum = ele.ks_num
                    this.tableData[index].searchNum = ele.j_num;
                    this.tableData[index].qual = ele.rate;
                    this.pages = this.tableData.length/6 * 10;
                    this.myTableData = this.tableData.slice(0,6);
                })
        },
        _getInfoData(){
          if(this.title == '模拟考卷列表'){
              this.axios.get('/admin/issue/trueList?simulation=1').then(res =>{
                this._getData(res.data.data)
              })
          }else if(this.title == '正式考卷列表'){
              this.axios.get('/admin/issue/trueList?simulation=0').then(res =>{
                this._getData(res.data.data)
              })
          }else if(this.title == '所有试卷列表'){
              this.axios.get('/admin/issue/trueList').then(res =>{
                this._getData(res.data.data)
              })
          }
          
        }
    },
    created(){
      this._getInfoData()
    }
  }
</script>