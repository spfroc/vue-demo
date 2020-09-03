<template>
    <mobile-layout></mobile-layout>
</template>

<script>
    import MobileLayout from './MobileLayout'
    export default {
        name: "BannerLink",
        components: {
            MobileLayout
        },
        methods: {
            connectWebViewJavascriptBridge(callback) {
                console.log(window.WebViewJavascriptBridge);
                if (window.WebViewJavascriptBridge) {
                    callback(WebViewJavascriptBridge)
                } else {
                    document.addEventListener('WebViewJavascriptBridgeReady', () => {
                        callback(WebViewJavascriptBridge)
                    }, false)
                }
            }
        },

        mounted() {
            this.connectWebViewJavascriptBridge((bridge) => {
                bridge.init(function(message, responseCallback) {
                    log('JS got a message', message)
                    let data = { 'Javascript Responds':'Wee!' }
                    log('JS responding with', data)
                    responseCallback(data)
                })
            })
        }
    }
</script>

<style scoped>

</style>