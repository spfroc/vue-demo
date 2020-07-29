<template>
    <div id="container">

    </div>
</template>

<script>
    import {TMap} from "../common/map-import";

    export default {
        name: "Village",
        components:{
            TMap
        },
        data () {
          return {
              map: '',
          }
        },

        methods: {

        },

        mounted() {
            TMap('HFTBZ-3IO66-I4MSE-M57DC-7TEF5-2WF4Y').then(qq => {
                let map = new qq.maps.Map(document.getElementById("container"),{
                    //地图的中心地理坐标
                    center:new qq.maps.LatLng(39.916527,116.397128),zoom:8
                });
                console.log(map);
            });
        }


    }

</script>

<style scoped>
    #container{
        width:100%;
        height:500px;
    }
</style>