<template>
    <el-button type="" size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "ExportExcel",

        props: ['url', 'params'],

        methods: {
            exportExcel() {

                let downloadElement = document.createElement('a');
                let href = encodeURI(process.env.API_HOST + '/adminApi' + this.url + '?token=' + localStorage.getItem('auth-token') + '&' +this.setUrlParams())
                downloadElement.href = href;
                downloadElement.target = '_blank'
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);

            },

            setUrlParams() {
                return this.convertObj(this.params);
            },

            convertObj(data) {
                let _result = [];
                for (let key in data) {
                    let value = data[key];
                    if (value.constructor == Array) {
                        value.forEach(function(_value) {
                            _result.push(key + "=" + _value);
                        });
                    } else {
                        _result.push(key + '=' + value);
                    }
                }
                return _result.join('&');
            },
        }
    }
</script>

<style scoped>

</style>