<template>
    <div class="map-wrapper">
        <div class="fixed-map" @click="openMap">
            <!-- <img id="img" src="../../assets/img/miniMap.png" alt="">
            <div class="icon">
                <img @click.stop="magImg" src="../../assets/img/magnify.png" alt="">
                <img @click.stop="shrImg" src="../../assets/img/shrink.png" alt="">
            </div> -->
            <div :id="mapID" style="width:auto; height:50vh"></div>
        </div>
        <!-- 大地图 -->
        <div class="map-box">
            <el-dialog title="全国地图" :visible.sync="isMapShow" width="90vw">
                <div :id ="bigMapID" style="width:100%; height:90vh"></div>
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
            mapID: 'container',
            bigMapID: 'big-container',
            mapEvents: {
                init(o) {
                    let marker = new AMap.Marker({ //点图标
                        position: [121.59996, 31.197646]
                    });
                    marker.setMap(o);
                    o.plugin(["AMap.Walking "], function() {
                        var driving = new AMap.Walking({
                            map: o,
                            showTraffic: false,//去掉实时路况
                            autoFitView: true, 
                            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                            policy: AMap.DrivingPolicy.LEAST_TIME
                        })
                        o.addControl(driving);
                    })
                }
            }
        }
    },
    methods: {
        init (id) {
            let map = new AMap.Map(id, {
                center: [117.2312320000, 31.8407410000],
                resizeEnable: true,
                zoom: 10
            });
            var marker = new AMap.Marker({
                position:[117.2312320000, 31.8407410000]//位置
            })
            // map.add(marker);//添加到地图
            // map.plugin('AMap.DragRoute', function () {
            //     // path 是驾车导航的起、途径和终点，最多支持16个途经点
            //     var path = []

            //     path.push([117.2312320000, 31.8407410000])
            //     path.push([116.321354, 39.896436])
            //     path.push([116.407012, 39.992093])

            //     var route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE)
            //     // 查询导航路径并开启拖拽导航
            //     route.search()
            // })
        },
        // 弹出地图
        openMap() {
            this.isMapShow = true;
            this.$nextTick(() =>{
                this.init(this.bigMapID);
            })
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
    },
    created(){
        this.init(this.mapID)
    }
}
</script>