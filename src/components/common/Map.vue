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

        props: ['width', 'height', 'lng', 'lat', 'zoom', 'markers'],
        data () {
            return {
                map: '',
            }
        },

        methods: {

            mapInit () {
                Amap.initAMapApiLoader({
                    key: 'e026d6af144d5a75ed717f7c18f10fff',
                    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.CircleMarker', 'AMap.Marker'],
                    v: '1.4.4'
                });

                lazyAMapApiLoaderInstance.load().then(() => {
                    this.map = new AMap.Map('a-map-container', {
                        center: new AMap.LngLat(this.lng, this.lat),
                        zoom: 14,
                    });
                    this.map.on('mapmove', this.centerChanged)
                    if(this.markers && this.markers.length > 0) {
                        this.markersInit(AMap);
                    } else {
                        console.log('xxxx');
                    }
                });

            },

            centerChanged() {
                console.log(this.map.getCenter());
            },

            markersInit(AMap) {
                this.markers.forEach(marker => {
                    console.log(marker);
                    new AMap.CircleMarker({
                        map: this.map,
                        center: new AMap.LngLat(marker.lng, marker.lat),
                    })
                });
            }
        },

        mounted() {
            this.mapInit();
            console.log(this.width, this.height);
            if(!this.zoom) {
                this.zoom = 14
            }


        }

    }


</script>

<style scoped>

</style>