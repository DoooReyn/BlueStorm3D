/**
 * Url      : db://assets/scripts/base/func/date.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 日期/时间辅助方法
 */

import { reserveFraction } from "./numbers";
import { padStart } from "./strings";

/**
 * 时间/日期格式
 */
export interface I_DateTime {
    second?: number;
    minute?: number;
    hour?: number;
    day?: number;
    month?: number;
    year?: number;
}

/**
 * 时间/日期格式单位
 */
export interface I_DateTimeUnit {
    second?: string;
    minute?: string;
    hour?: string;
    day?: string;
    month?: string;
    year?: string;
}

/**
 * 时间/日期的数值与单位
 */
interface I_DateTimeValueAndUnit {
    unit: string;
    val: number;
}

/**
 * 将时间戳转换为本地时间
 * @param time 时间戳
 * @returns 本地时间
 */
export function asLocaleTime(time: number) {
    return new Date(time).toLocaleTimeString();
}

/**
 * 将秒数数值转换为指定有效位数的秒数字符串
 * @param time js/ts秒数
 * @param bit 小数点后有效位数，默认2位
 * @returns 秒数字符串
 */
export function asSeconds(time: number, bit: number = 2) {
    return reserveFraction(time / 1000, bit);
}

/**
 * 秒数转换为时间
 * @param time 秒数
 * @returns
 */
export function asDateTime(time: number): I_DateTime {
    time = 0 | time;
    let result = 0;
    let dict: I_DateTime = { second: 0, minute: 0, hour: 0, day: 0, month: 0, year: 0 };
    let units: I_DateTime = { second: 60, minute: 60, hour: 24, day: 30, month: 12, year: 10000 };
    for (let unit in units) {
        result = time % units[unit];
        dict[unit] = result;
        time = (time / units[unit]) | 0;
        if (!time) break;
    }
    return dict;
}

/**
 * 按照指定格式化方法将秒数转换为字符串
 * @param value 秒数
 * @param formatter
 * @returns
 */
export function asDateTimeByFormmatter(value: number, formatter: (k: string, v: number) => string) {
    const time = asDateTime(value);
    return Object.keys(time)
        .reverse()
        .map((v) => formatter(v, time[v]))
        .join("");
}

/**
 * 秒数转换为时间格式
 * @param value 秒数
 * @param fmt 格式
 * @returns
 * @example
 *  const fmt = { second: "秒", hour: "时", minute: "分", day: "天", month: "月", year: "年" }
 *  asDateTimeInFormat(1671785953, fmt);
 *  // 53年08月29天08时59分13秒
 */
export function asDateTimeInFormat(value: number, fmt: I_DateTimeUnit) {
    return asDateTimeByFormmatter(value, (k, v) => {
        return fmt[k] ? `${padStart(v.toString(), "0", 2)}${fmt[k]}` : "";
    });
}
