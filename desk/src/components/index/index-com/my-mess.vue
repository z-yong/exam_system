<template>
    <div class="mess">
        <div class="content">
            <div class="mess-title">基本信息</div>
            <ul>
                <li>
                    <span class="caption">姓名:</span>
                    <span class="desc">{{username}}</span>
                </li>
                <li>
                    <span class="caption">学号:</span>
                    <span class="desc">{{userID}}</span>
                </li>
                <li>
                    <span class="caption">考试次数:</span>
                    <span class="desc">{{examNum}}</span>
                </li>
                <li>
                    <span class="caption">合格:</span>
                    <span class="desc">{{qualNum}}</span>
                </li>
                <li>
                    <span class="caption">不合格:</span>
                    <span class="desc">{{noqualNum}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .mess{
        background: #f7f7f7;
        padding-top: 2vh;
        width: 100%;
    }
    .mess .content{
        background: #fff;
        width: 90%;
        margin: auto;
        padding: 0 2vw 2vh;
        border-top: 2px solid #1362cc;
        box-shadow: 2px 2px 3px 0px #ccc
    }
    .mess .content .mess-title{
        font-size: 15px;
        font-weight: 600;
        height: 8vh;
        line-height: 8vh;
    }
    .mess .content ul li{
        padding: 2vh 0 2vh 1vw;
        border-top: 1px solid #eee;
        color: #333;
        font-size: 15px;
    }
    .mess .content ul li .caption{
        display: inline-block;
        width: 80px;
        text-align: right
    }
    .mess .content ul li .desc{
        display: inline-block;
        text-indent: 1em;;
    }
</style>
<script>
export default {
    data(){
        return {
            username: '',
            userID: '',
            examNum: '',
            qualNum: '',
            noqualNum: ''
        }
    },
    methods: {
        _getInfoUserMess(){
            this.axios.get('/index/index/userInfo').then(res =>{
                const data = res.data.data;
                this.username = data.real_name;
                this.userID = data.user_name;
                this.examNum = data.kscs;
                this.qualNum = data.qualified;
                this.noqualNum = data.no_qualified;
            })
        }
    },
    created(){
        this._getInfoUserMess()
    }
}
</script>