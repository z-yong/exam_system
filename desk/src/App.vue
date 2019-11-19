<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>


<style>
html,body,#app{
  width: 100%;
  height: 100%;
}
.el-menu-item{
  color: #333 !important
}
html,body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td{margin:0;padding:0;font-family:Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Hiragino Sans GB W3", "Microsoft YaHei", STXihei, STHeiti, Heiti, SimSun, sans-serif; font-size:100%;}
html,body{color:#333}
body{background:#fff;overflow-x: hidden;}
ul,ol,li{ list-style:none;}
a:link, a:visited{ color:#333; text-decoration:none;}
img{ border:none;}
em{ font-style:normal;}
h1,h2,h3,h4,h5{ font-weight:normal;}
.clearfloat:after{ content:'.';display:block;overflow:hidden;visibility:hidden;font-size:0;line-height:0;width:0;height:0;}
.clearfloat{zoom:1;}
</style>
<script>
export default {
  // components: {
  //   "z-login": Login
  // }
}
</script>
