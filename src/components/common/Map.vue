<template>
    <section id="a-map-container" style="width: 100%;height:376px;"></section>
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
                    key: 'bf8e162c12d4797e0310c699ff45b3c2',
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
                        let newCenter = this.map.setFitView();
                        // console.log(newCenter);
                    }
                    this.$emit('map-mounted', this.map);

                });

            },

            centerChanged() {
                // console.log(this.map.getCenter());
            },

            markersInit(AMap) {
                let path = []
                this.markers.forEach(marker => {
                    // console.log(marker);
                    path.push(new AMap.LngLat(marker.lng, marker.lat));
                    new AMap.CircleMarker({
                        map: this.map,
                        center: new AMap.LngLat(marker.lng, marker.lat),
                        radius: 10,
                        strokeColor: '#4169E1',
                        fillColor: '#4169E1',
                        zIndex: 55,
                    })
                });
                let newCenter = this.map.setFitView();
                // console.log(newCenter);
                let polyline = new AMap.Polyline({
                    path: path,
                    strokeColor: '#EEC900',
                    fillColor: '#EEC900',
                    lineCap: 'round',
                    lineJoin: 'round',
                    showDir: true,
                    strokeWeight: 5
                });
                // console.log(polyline);
                this.map.add([polyline]);
            },

        },

        mounted() {
            // console.log(this.width, this.height);
            if(!this.zoom) {
                this.zoom = 15
            }
            this.mapInit();


            // this.$emit('map-mounted', this.map);
        }

    }


</script>

<style scoped>

</style>