<template>
    <div id="container">

        <!--<script charset="utf-8" src="https://map.qq.com/api/js?v=2.exp&key=HFTBZ-3IO66-I4MSE-M57DC-7TEF5-2WF4Y"></script>-->

    </div>

</template>
<script>

    import VueAMap from 'vue-amap';

    VueAMap.initAMapApiLoader({
        key: 'e026d6af144d5a75ed717f7c18f10fff',
        plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
        // 默认高德 sdk 版本为 1.4.4
        v: '1.4.4'
    });


</script>

<style scoped>

</style>