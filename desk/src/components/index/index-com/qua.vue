<template>
    <div class="qua-wrapper">
        <p class="qua-header">
            <span>同学,请输入你想对老师说的话:</span>
        </p>
        <div class="qua-mess">
            <div class="qua-input">
                <textarea v-model="content"/>
            </div>
            <div class="qua-btn" @click="submitMess()">提交</div>
        </div>
    </div>
</template>

<style scoped>
    .qua-wrapper{
        width: 80%;
        margin-left: 3vw;
        background: #fff;
        box-sizing: border-box;
        padding-bottom: 5vh;
        box-shadow: 2px 2px 3px 0px #ccc
    }
    .qua-wrapper .qua-header{
        padding: 1vh 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        border-bottom: 1px solid #ddd
        
    }
    .qua-wrapper .qua-header span{
        display: inline-block;
        border-left: 3px solid #0070d8;
        text-indent: 1em;
        line-height: 4vh;
    }
    .qua-wrapper .qua-mess{
        padding: 2vh;
        width: 80%;
        margin: 2vh auto;
    }
    .qua-wrapper .qua-input{
        width: 100%;
        height: 15vh;
    }
    .qua-wrapper .qua-input textarea{
        width: 100%;
        height: 100%;
        padding: 1vw;
        text-indent: 1em
    }
    .qua-wrapper .qua-btn{
        width: 12vw;
        height: 5vh;
        background: #0070d8;
        color: #fff;
        font-size: 15px;
        line-height: 5vh;
        text-align: center;
        cursor: pointer;
        user-select: none;
        margin: 7vh auto 0
    }
</style>

<script>
export default {
    data(){
        return {
            content: ''
        }
    },
    methods: {
        submitMess(){
            if(this.content){
                this.axios.post('/index/index/feedback?content='+this.content).then(res =>{
                    this.$router.push('/index')
                    this.$message({
                        message: '提交成功! 等待老师回复',
                        type: 'success'
                    })
                })
            }else{
                this.$message({
                    message: '请输入你想对老师说的话',
                    type: 'error'
                })
            }
        }
    }
}
</script>