<template>
    <div class="map-wrapper">
        <div class="fixed-map" @click="openMap">
            <!-- <img id="img" src="../../assets/img/miniMap.png" alt="">
            <div class="icon">
                <img @click.stop="magImg" src="../../assets/img/magnify.png" alt="">
                <img @click.stop="shrImg" src="../../assets/img/shrink.png" alt="">
            </div> -->
            <div :id="isMapShow ? '' : mapID" style="width:auto; height:50vh"></div>
        </div>
        <!-- 大地图 -->
        <div class="map-box">
            <el-dialog title="全国地图" :visible.sync="isMapShow" width="90vw">
                <!-- <img src="../../assets/img/map.png" alt="" width="100%"> -->
                <div id='container-big' style="width:100%; height:auto"></div>
            </el-dialog>
        </div>
    </div>
</template>

<style scoped>
    .fixed-map{
        position: fixed;
        top: 50%;
        right: 0;
        transform: translate(0,-50%);
        border: 2px dotted rgb(181, 220, 241);
        padding: 5px;
        width: 11vw;
        height: 32vh;
        border-radius: 10px;
        overflow: hidden;
        perspective:150px;
        perspective-origin: 50%;
        -webkit-perspective:150px;	/* Safari 和 Chrome */
        -webkit-perspective-origin: 50%;
        transform-style: preserve-3d;
    }
    .fixed-map>img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%,-50%,10px);
        width: auto;
        height: 50vh;
    }
    div.fixed-map .icon{
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 1.5vw;
        height: 8vh;
    }
    div.fixed-map .icon img{
        position: relative;
        width: 100%;
        height: auto;
        z-index: 9999;
    }
</style>
<script>
export default {
    data(){
        return {
            isMapShow: false,
            size: 10,
            mapID: 'container' 
        }
    },
    methods: {
        init (id) {
            let map = new AMap.Map(id, {
                center: [116.397428, 39.90923],
                resizeEnable: true,
                zoom: 10
            })
        },
        // 弹出地图
        openMap() {
            this.isMapShow = true;
            this.init('container-big')
        },
        magImg(){
            this.$nextTick(()=>{
                const img = document.getElementById('img');
                this.size += 10
                img.style.transform = `translate3d(-50%,-50%,${this.size}px)`
            })
        },
        shrImg(){
            this.$nextTick(()=>{
                const img = document.getElementById('img');
                this.size -= 10
                img.style.transform = `translate3d(-50%,-50%,${this.size}px)`
            })
        }
    },
    mounted(){
        this.init(this.mapID)
    }
}
</script>