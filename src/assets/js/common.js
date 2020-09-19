import Vue from 'vue'
import axios from 'axios'

const format = (o, format) => { //日期类型
    let args = {
        "M+": o.getMonth() + 1,

        "d+": o.getDate(),

        "h+": o.getHours(),

        "m+": o.getMinutes(),

        "s+": o.getSeconds(),

        "q+": Math.floor((o.getMonth() + 3) / 3), //quarter
        "S": o.getMilliseconds()
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (o.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let i in args) {
        let n = args[i];
        if (new RegExp("(" + i + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
}

const searchParams = (searchParamsObject) => {
    for(let index in searchParamsObject) {
        if(index == 'createTime') {
            searchParamsObject.timeStart = searchParamsObject.createTime[0];
            searchParamsObject.timeEnd = searchParamsObject.createTime[1];
            delete searchParamsObject.createTime;
        }
        if(!searchParamsObject[index]) {
            delete searchParamsObject[index];
        }

    }
    return searchParamsObject;
}

const richTextContentFormatter = (row, column, cellValue) => {
    console.log('~~~',cellValue.replace(/(<.*?>|&nbsp;|\s\r\n\t|[ ])/g,""));
    let handledStr = cellValue.replace(/(<.*?>|&nbsp;|\s\r\n\t|[ ])/g,"").substr(0, 10);
    return handledStr.length < 10 ? handledStr : handledStr + '...';

}

const defaultAvatar = () => {
    let defaultImg = require('../img/default_user.png');
    return defaultImg;
}

const copyLink = (element) => {
    let text = document.getElementById(element);
    if (document.body.createTextRange) {
        //createTextRange是用在IE中的
        let range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("Copy")
    } else {
        alert("none");
    }

}

const appTokenAxios = () => {
    return axios.create({
        baseURL: '/',
        timeout: 1000,
    });

}

export default function(Vue) {
    //添加全局API
    Vue.prototype.$common = {
        format, searchParams, richTextContentFormatter,appTokenAxios, defaultAvatar, copyLink
    }
}
