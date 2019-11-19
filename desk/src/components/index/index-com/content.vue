<template>
    <div class="wrapper">
        <div class="menu-right">
            <!-- <ul>
                <li v-for="(item,index) in menuRight" :key="index" v-html="item"
                    @click="rightMenu(index)"    :class="currentIndex == index ? 'right-menu-active' : ''">
                    {{item}}
                </li>
            </ul> -->
            <div class="path-box">
                <p class="currentPath">
                    <span class="menu-name" v-for="(item,i) in menuRight2" :key="i" :class="currentIndex == i ? 'menu-active': ''">{{item}}
                        <span class="icon-right"  v-if="i != (menuRight2.length - 1)">></span>
                    </span>
                </p>
            </div>
        </div>
        <div class="current-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped>
    .wrapper{
        height: 100%;
    }
    /* .wrapper .menu-right{
        height: 7vh;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
    .wrapper .menu-right ul{
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 2vw;
    }
    .wrapper .el-icon-s-home{
        color: #0070d8;
        margin-right: 5px;
    }
    .wrapper .menu-right ul li{
        margin: 0 3vw 0 0;
        height: 100%;
        line-height: 7vh;
        color: #0070d8;
        box-sizing: border-box;
        cursor: pointer;
        user-select: none;
    }
    .wrapper .menu-right ul li.right-menu-active{
        border-bottom: 3px solid #0070d8
    } */
    .wrapper .current-content{
        /* margin-top: 5vh; */
        background: #f7f7f7;
    }
    .wrapper .path-box{
        background: #f7f7f7;
        box-sizing: border-box;
        padding: 0 2vw
    }
    .wrapper .currentPath{
       line-height: 9vh;
       height: 9vh;
    }
    .currentPath span{
        color: #888
    }
    .wrapper .currentPath .menu-active{
        color: #0070d8
    }
    .wrapper .currentPath .icon-right{
        color: #888;
        margin: 0 0.2em
    }
    .wrapper .current-content{
        /* margin-top: 8vh; */
        width: 100%;
        height: 100%;
    }
</style>

<script>
export default {
    props: {
        index: {
            type: Number,
            required: true
        }
    },
    data(){
        return {
            userName: '用户名123',
            menuRight: ['<i class="el-icon-s-home"></i>首页','个人中心'],
            currentIndex: 0,
        }
    },
    methods: {
        rightMenu(index){
            if(index == 0){
                this.$router.push('/index/content/index-in')
            }
            if(index == 1){
                this.$router.push('/index/content/personal')
            }
            this.currentIndex = index;
            console.log(index)
        }
    },
    computed: {
        menuRight2(){
            if(this.$route.params.id == 1){
                this.currentIndex = 1;
                return ['首页',' 问题反馈']
            }else if(this.$route.params.id == 2){
                this.currentIndex = 1
                return ['首页',' 个人中心']
            }
            this.currentIndex = 0;
            return ['首页']
        }
    },
    created(){
        console.log(this.$route.params.id)
        this.currentIndex = this.index
    },
    beforeUpdate(){
        // this.currentIndex = this.index
        // console.log(this.index)
    }
    
}
</script>