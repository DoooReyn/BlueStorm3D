/**
 * Url      : db://assets/scripts/base/func/web.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : Web辅助方法
 */

import { sys } from "cc";

/**
 * @zh
 * 刷新当前页面
 */
export function reloadWebPage() {
    sys.isBrowser && window.location.reload();
}

/**
 * @zh
 * 设置cookie
 * @param key cookie键名
 * @param value cookie键值
 */
export function setCookie(key: string, value: string) {
    if (sys.isBrowser) {
        const sec = 30 * 24 * 60 * 60 * 1000;
        const exp = new Date();
        exp.setTime(exp.getTime() + sec);
        const data = encodeURIComponent(value);
        document.cookie = `${key}=${data};expires=${exp.toUTCString()}`;
    }
}

/**
 * @zh
 * 获取cookie
 * @param key cookie键名
 * @returns cookie键值
 */
export function getCookie(key: string) {
    if (sys.isBrowser) {
        let reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
        let arr = document.cookie.match(reg);
        if (arr && arr.length >= 2) {
            return decodeURIComponent(arr[2]);
        }
    }
}

/**
 * 清除当前 URL 的参数（修改历史记录，不会刷新当前网页）
 */
export function clearUrlParam(): void {
    if (sys.isBrowser && window.history) {
        window.history.replaceState({}, null, ".");
    }
}

/**
 * 设置当前 URL 的参数（修改历史记录，不会刷新当前网页）
 * @param param 参数
 */
export function setUrlParam(param: string | { key: string; value: string }[]): void {
    if (sys.isBrowser && window.history) {
        if (Array.isArray(param)) {
            param = param.map((v) => `${v.key}=${v.value}`).join("&");
        }
        window.history.replaceState({}, null, `?${param}`);
    }
}

/**
 * 获取当前 URL 的参数
 * @param key 键
 */
export function getUrlParam(key: string): string {
    if (!window || !window.location) return null;

    const query = window.location.search.replace("?", "");
    if (query === "") return null;

    const substrings = query.split("&");
    for (let str of substrings) {
        const keyValue = str.split("=");
        if (decodeURIComponent(keyValue[0]) === key) {
            return decodeURIComponent(keyValue[1]);
        }
    }

    return null;
}

/**
 * 获取当前 URL 的所有参数
 */
export function getUrlParams() {
    if (!window || !window.location) return [];

    const query = window.location.search.replace("?", "");
    if (query === "") return [];

    const substrings = query.split("&"),
        params: { key: string; value: string }[] = [];
    for (let str of substrings) {
        const [key, val] = str.split("=");
        params.push({ key: key, value: val });
    }
    return params;
}

/**
 * 复制文本至设备剪贴板
 * @param value 文本内容
 */
export function copy(value: string): boolean {
    if (!document) return false;

    // 创建输入元素
    const element = document.createElement("textarea");
    element.readOnly = true;
    element.style.opacity = "0";
    element.value = value;
    document.body.appendChild(element);
    // 选择元素
    element.select();
    // 兼容低版本 iOS 的特殊处理
    if (sys.os === sys.OS.IOS) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    // 复制
    const result = document.execCommand("copy");
    element.remove();
    return result;
}
