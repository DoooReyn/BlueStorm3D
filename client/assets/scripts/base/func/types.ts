/**
 * Url      : db://assets/scripts/base/func/types.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 类型辅助方法
 */

/**
 * @zh
 * 是否Function类型
 * @param item 目标
 * @returns 目标是否Function类型
 */
export function isFunction(item: any) {
    return typeof item === "function";
}

/**
 * @zh
 * 是否数值
 * @param item 目标
 * @returns 目标是否数值
 */
export function isNumber(item: any) {
    return typeof item === "number" && !isNaN(item);
}

/**
 * @zh
 * 是否字符串
 * @param item 目标
 * @returns 目标是否字符串
 */
export function isString(item: any) {
    return typeof item === "string";
}

/**
 * @zh
 * 是否对象
 * @param item 目标
 * @returns 目标是否对象
 */
export function isObject(item: any) {
    return Object.prototype.toString.call(item) === "[object Object]";
}

/**
 * @zh
 * 是否数组
 * @param item 目标
 * @returns 目标是否数组
 */
export function isArray(item: any) {
    return item instanceof Array;
}

/**
 * @zh
 * 是否布尔值
 * @param item 目标
 * @returns 目标是否布尔值
 */
export function isBoolean(item: any) {
    return typeof item === "boolean";
}

/**
 * @zh
 * 是否为真
 * @param item 目标
 * @returns 目标是否为真
 */
export function isTrue(item: any) {
    if (isBoolean(item)) {
        // 布尔值直接判定值
        return Boolean(item);
    } else {
        // null/undefined 判定为假，其他类型判定为真
        return !isNull(item);
    }
}

/**
 * @zh
 * 是否为假
 * @param item 目标
 * @returns 目标是否为假
 */
export function isFalse(item: any) {
    return !isTrue(item);
}

/**
 * @zh
 * 是否 undefined
 * @param t 目标
 * @returns 目标是否 undefined
 */
export function isUndefined(t: any) {
    return t === undefined;
}

/**
 * @zh
 * 是否为空
 * @param t 目标
 * @returns 目标是否为空
 */
export function isNull(t: any) {
    return t === null;
}

/**
 * @zh
 * 是否不为空
 * @param t 目标
 * @returns 目标是否不为空
 */
export function notNull(t: any) {
    return !isNull(t);
}

/**
 * @zh
 * 是否为空 <undefine/null>
 * @param t 目标
 * @returns 目标是否为空
 */
export function isNone(t: any) {
    return isNull(t) || isUndefined(t);
}
/**
 * @zh
 * 是否不为空 <undefine/null>
 * @param t 目标
 * @returns 目标是否不为空
 */
export function isNotNone(t: any) {
    return !this.isNone(t);
}
