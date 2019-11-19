<template>
    <div class="feed-wrapper">
        <div class="feed-head">
            <div v-for="(item,index) in menuList" :key="index" class="head-item" 
                 @click="changeContent(index)" :class="currentIndex == index ? 'active' : ''">
                {{item}}
            </div>
        </div>
        <div class="feed-content">
            <ul class="feed-box-list">
                <li v-if="oneShow" class="box-item">
                    <ul class="content-list">
                        <li class="no" v-if="!noReply.length">暂无数据</li>
                        <li class="content-item" v-for="(item,index) in noReply" :key="index">
                            <p class="stu-name">{{item.stuName}}同学：</p>
                            <p class="stu-content">{{item.content}}</p>
                            <textarea v-model="item.teacherContent" placeholder="输入您想对该同学说的话"></textarea>
                            <el-button type="primary" size="mini" @click="sumAnw(item.id)">提交</el-button>
                        </li>
                    </ul>
                </li>
                <li v-if="!oneShow" class="box-item">
                    <ul class="content-list">
                        <li class="no" v-if="!reply.length">暂无数据</li>
                        <li class="content-item" v-for="(item,index) in reply" :key="index">
                            <p class="stu-name">{{item.stuName}}同学：</p>
                            <p class="stu-content">{{item.stuContent}}</p>
                            <p class="tea-name">{{item.teaName}}老师：</p>
                            <p class="tea-content">{{item.teaContent}}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<style src='./feedback.css' scoped>
</style>
<script>
export default {
    data(){
        return {
            currentIndex: 0,
            oneShow: true,
            menuList: ['待回复','已回复'],
            noReply: [],
            reply: []
        }
    },
    methods: {
        changeContent(index){
            this.currentIndex = index;
            this.oneShow = !this.oneShow
        },
        sumAnw(id){
            let reply;
            this.noReply.forEach(ele =>{
                if(ele.id == id){
                    reply = ele.teacherContent
                }
            })
            const data = {
                reply, id
            }
            this.axios.post('/admin/user/postReply',data).then(res =>{
                if(res.data.code == 200){
                    this.$message({
                        message: '提交成功！',
                        type: 'success'
                    })
                    this.noReply = [];
                    this.reply = [];
                    this._getInfoData()
                }
            })
        },
        _getInfoData(){
            this.axios.get('/admin/user/feedback').then(res =>{
                console.log(res)
                res.data.data.forEach(ele =>{
                    this.noReply.push({id: ele.id, content: ele.content, stuName: ele.uid, teacherContent: ''})
                })
            })
            this.axios.get('/admin/user/feedbackOk').then(res =>{
                console.log(res)
                res.data.data.forEach(ele =>{
                    this.reply.push({id: ele.id, stuContent: ele.content, teaContent: ele.reply, stuName: ele.uid, teaName: ele.reply_id})
                })
            })
        }
    },
    created(){
        this._getInfoData()
    }
}
</script>