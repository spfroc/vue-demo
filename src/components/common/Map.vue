<template>
    <section id="a-map-container" style="width: 100%;height:400px;"></section>
</template>
<script>

    import Amap from 'vue-amap';
    import { lazyAMapApiLoaderInstance } from 'vue-amap';

    export default {

        name: "AMap",
        components:{
            Amap, lazyAMapApiLoaderInstance
        },

        props: ['width', 'height', 'lng', 'lat'],
        data () {
            return {
                map: '',
            }
        },

        methods: {

            mapInit () {
                Amap.initAMapApiLoader({
                    key: 'e026d6af144d5a75ed717f7c18f10fff',
                    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
                    v: '1.4.4'
                });

                lazyAMapApiLoaderInstance.load().then(() => {
                    this.map = new AMap.Map('a-map-container', {
                        center: new AMap.LngLat(this.lng, this.lat),
                        zoom: 14,
                    });
                    this.map.on('mapmove', this.centerChanged)
                });
            },

            centerChanged() {
                // console.log(this.map.getCenter());
            },
        },

        mounted() {
            console.log(this.width, this.height);
            this.mapInit();
        }

    }


</script>

<style scoped>

</style>