<template>
    <div class="personal">
        <div class="per-wrapper">
            <ul>
                <li @click="goToMess">
                    <i class="iconfont">&#xe659;</i>
                    <span>基本信息</span>
                </li>
                <li @click="goToTopic">
                    <i class="iconfont">&#xe654;</i>
                    <span>考试结果</span>
                </li>
                <!-- <li @click="goToError">
                    <i class="iconfont">&#xe693;</i>
                    <span>我的错题</span>
                </li>
                <li @click="goToQua">
                    <i class="iconfont">&#xe619;</i>
                    <span>我的反馈</span>
                </li> -->
            </ul>
        </div>
    </div>
</template>

<style src='./personal.css' scoped>
</style>
<script>
export default {
    data(){
        return {
            userPhoto: require('../../../assets/img/userPhoto.png'),
            tableData: [
                {date:123,testName:'水电费水电费',result: '合格',}
            ]
        }
    },
    methods: {
        getPerMess(){
            console.log(this.userPhoto)
        },
        // 此方法可以调用本地目录修改用户头像
        getLocalPhoto(){
            const file = this.$refs.userPhoto.files[0];
            const fr = new FileReader()
            fr.onload = (e) => {
                this.userPhoto = e.target.result;
                const reg = /data:image/
                if(!reg.test(this.userPhoto)){
                    this.userPhoto = require('../../../assets/img/userPhoto.png')
                    this.$alert('这不是一张图片,请重新选择', '注意', {
                        confirmButtonText: '确定',
                        // callback: action => {
                        //     this.$message({
                        //         type: 'info',
                        //         message: `action: ${ action }`
                        //         });
                        // }
                    });
                }
            }
            fr.readAsDataURL(file);
            // 判断用户选择的是否是一张图片
            
        },
        goToMess(){
            this.$router.push({name: 'myMess'})
        },
        goToTopic(){
            this.$router.push({name: 'myTopic'})
        },
        goToQua(){
            this.$router.push({name: 'myQua'})
        },
        goToError(){
            this.$router.push({name: 'myError'})
        }
    },
    created(){
    }
}
</script>