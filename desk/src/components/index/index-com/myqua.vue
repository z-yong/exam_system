<template>
    <div class="my-qua">
        <ul class="qua-list">
            <li v-for="(item,index) in quaMessList" :key="index" class="qua-box">
                <div class="qua-title">
                    <p>{{item.date}}</p>
                </div>
                <div class="qua-content">
                    <div class="my-qua-item">
                        <span class="span">我：</span>
                        <p>{{item.issue}}</p>
                    </div>
                    <div class="teacher">
                        <span class="span">{{item.teacher}}</span>
                        <p>{{item.response}}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<style scoped>
    .my-qua{
        background: #f7f7f7;
        width: 100%;
    }
    .my-qua .qua-list{
        background: #fff;
        width: 90%;
        margin: auto;
    }
    .my-qua .qua-list li{
        padding: 0 0 2vh;
        box-shadow: 2px 2px 3px 0px #ccc
    }
    .my-qua .qua-list .qua-title{
        padding: 2vh 0;
        font-size: 15px;
        font-weight: 600;
    }
    .my-qua .qua-list .qua-title p{
        text-indent: .5em;
        border-left: 2px solid #1362cc;
    }
    .qua-list .qua-content .my-qua-item,
    .qua-list .qua-content .teacher{
        padding: 2vh 3vw;
        color: #666;
        border-top: 1px solid #eee
    }
    .qua-list .qua-content .my-qua-item .span{
        display: inline-block;
        width: 60px;
        text-align: right;
        font-weight: 600;
    }
    .qua-list .qua-content .teacher .span{
        display: inline-block;
        width: 100px;
        text-align: right;
        font-weight: 600;
    }
    .qua-list .qua-content .my-qua-item p,
    .qua-list .qua-content .teacher p{
        padding-left: 4vw
    }
</style>
<script>
export default {
    data(){
        return {
            quaMessList: []
        }
    },
    methods: {
        _getQuaMess(){
            this.axios.get('/index/index/myFeedback').then(res =>{
                res.data.data.forEach((ele,index) =>{
                    this.quaMessList.push({date:ele.time, issue: ele.content,response: ele.reply,teacher: ele.reply_id})
                })
            })
        }
    },
    created(){
        this._getQuaMess()
    }
}
</script>