/**
 * Url      : db://assets/scripts/base/func/strings.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 字符串辅助方法
 */

const __UNREADABLE_LEVEL__ = 2;
const __UNREADABLE_OFFSET__ = 16;
const __UNREADABLE_RANGE_MIN__ = 766;
const __UNREADABLE_RANGE_MAX__ = 879;

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

/**
 * 数字转千分位字符串
 * @param num 数字
 * @returns 千分位字符串
 */
export function toThousand(num: number) {
    return Math.floor(num).toLocaleString("en");
}

/**
 * 去除除空格外的空字符
 * @param str 原始字符串
 * @returns 修正后的字符串
 */
export function trimNullChars(str: string) {
    return str.replace(/[\f\n\r\t\v\u1680\u180e\u2028\u2029\ufeff+]/g, "");
}

/**
 * 是否完全的中文字符串
 * @return 是否完全的中文字符串
 */
export function isChinese(str: string) {
    return /^[\u4E00-\u9FA5]+$/.test(str);
}

/**
 * 去除中文字符
 * @return 返回去除中文字符后的字符串
 */
export function removeChinese(str: string) {
    return str.replace(/[\u4E00-\u9FA5]+/gm, "");
}

/**
 * 使字符串不可阅读
 * @return 不可阅读的字符串
 */
export function unreadable(str: string) {
    return Array.prototype.map
        .call(str, function (char: string) {
            let code1 = String.fromCharCode(char.charCodeAt(0) + __UNREADABLE_OFFSET__);
            let code2 = new Array(__UNREADABLE_LEVEL__)
                .fill(0)
                .map(function () {
                    let min = __UNREADABLE_RANGE_MIN__;
                    let max = __UNREADABLE_RANGE_MAX__;
                    let code = Math.floor(Math.random() * (max - min + 1) + min);
                    return String.fromCharCode(code);
                })
                .join("");
            return code1 + code2;
        })
        .join("");
}

/**
 * 恢复不可阅读的字符串
 */
export function readable(str: string) {
    return Array.prototype.map
        .call(str, function (char: string, index: number) {
            let out = index % (__UNREADABLE_LEVEL__ + 1) === 0;
            if (!out) {
                return "";
            }
            return String.fromCharCode(char.charCodeAt(0) - __UNREADABLE_OFFSET__);
        })
        .join("");
}

/**
 * 是否有效的网址
 * @param str 网址
 * @returns 是否有效的网址
 */
export function isValidURL(str: string) {
    const pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i"
    );
    return !!pattern.test(str);
}
