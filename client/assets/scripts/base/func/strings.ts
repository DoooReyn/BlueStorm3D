/**
 * Url      : db://assets/scripts/base/func/strings.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 字符串辅助方法
 */

/**
 * @zh
 * 字符串格式化
 * @example
 * let s = "我叫{0}，我今年{1}岁"
 * let f = strings.format(s, "DoooReyn", "18")
 * console.log(f) // 我是DoooReyn，我今年18岁
 *
 * @return 格式化后的字符串
 */
export function format(str: string, ...args: any[]) {
    return str.replace(/\{(\d+)\}/g, function (match, index) {
        let v = args[index];
        return index < args.length ? v : match;
    });
}

/**
 * 解析json字符串
 * @param jsonStr Json字符串
 * @returns json数据
 */
export function asJsonObject(jsonStr: string) {
    let data = null;
    try {
        data = JSON.parse(jsonStr);
    } catch (err) {
        console.error("Json parse error", err);
    }
    return data;
}

/**
 * 转换为JSON字符串
 * @param o 任意值
 * @returns
 */
export function asJsonString(o: any) {
    return JSON.stringify(o, null, 0);
}

/**
 * 获取字符串字节长度
 */
export function byteLength(s: string) {
    return encodeURI(s).split(/%..|./).length - 1;
}
