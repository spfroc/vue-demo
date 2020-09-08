import Vue from 'vue'
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
export default function(Vue) {
    //添加全局API
    Vue.prototype.$common = {
        format, searchParams, richTextContentFormatter
    }
}
