export function deepClone (obj) {  
    if(typeof obj !== "object" && typeof obj !== 'function') {
        return obj; //原始类型直接返回
    }
    var o = isArray(obj) ? [] : {}; 
    for(let i in obj) {  
        if(obj.hasOwnProperty(i)){ 
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i]; 
        } 
    } 
    return o;
}
function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';  
}