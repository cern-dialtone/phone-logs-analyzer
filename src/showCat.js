export function showCat(id) {
    document.getElementById(id).parentElement.querySelector(".nested").classList.toggle("active");
    document.getElementById(id).classList.toggle("caret-down");
}
export function parselog(string) {
    if (!string)
        return ("Data unreadable");
    let list = (string.indexOf('|') > -1) ? string.split("|") : string;
    return (Array.isArray(list) ? list[1] : list);
}
export function convertJson(json) {
    if (isJson(json))
        return JSON.parse(json);
    return false;
}
export function isJson(txt) {
    try {
        JSON.parse(txt);
    }
    catch (e) {
        return false;
    }
    return (txt ? true : false);
}
