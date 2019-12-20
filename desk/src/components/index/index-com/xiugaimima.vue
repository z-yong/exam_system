<template>
    <div class="xiugai">
        <el-input v-model="pass" type="password" placeholder="请输入修改密码"></el-input>
        <div class="iii">
            <el-input v-model="pass2" type="password" placeholder="请再次输入密码"></el-input>
        </div>
        <div>
            <el-button type="primary" @click="submitPass">提交</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            pass: '',
            pass2: '',
            id: this.$route.params.id
        }
    },
    methods: {
        submitPass(){
            if(!this.pass) return this._isEmpty('请输入密码');
            if(!this.pass2) return this._isEmpty('请输入确认密码');
            if(this.pass !== this.pass2) return this._isEmpty('两次密码不一致');
            this.axios.post('/index/index/updateinfo',{id:this.id,pws: this.pass}).then(res =>{
                if(res.data.code == 200){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    })
                    setTimeout(() =>{
                        this.$router.go(-1);
                    },500)
                }else{
                    this.$message({
                        message: '修改失败，与上次密码一致！',
                        type: 'error'
                    })
                }
            })
        },
        _isEmpty(message,close=false){
            this.$message({
                message,
                type: 'error'
            })
            if(close){
                this.dialogFormVisible = false
            }
        },
    },
    created(){
        console.log(this.id)
    }
}
</script>
<style scoped>
    .xiugai{
        background: #fff;
        width: 90%;
        margin: auto;
        padding: 2vh 2vw 5vh;
        border-top: 2px solid #1362cc;
        box-shadow: 2px 2px 3px 0px #ccc
    }
    .xiugai .el-input{
        width: 30%;
        margin-top: 3vh;
    }
    .xiugai .iii{
        margin: 0vh 0 4vh
    }
</style>