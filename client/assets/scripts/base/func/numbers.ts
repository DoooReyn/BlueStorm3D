/**
 * Url      : db://assets/scripts/base/func/utils.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 数值辅助方法
 */

/**
 * 获取数值的整数部分
 * @param n 数值
 * @returns
 */
export function pickDecimal(n: number) {
    return n | 0;
}

/**
 * 获取数值的小数部分
 * @param n 数值
 * @returns
 */
export function pickFraction(n: number) {
    return n - pickDecimal(n);
}

/**
 * 保留数值的小数点后几位
 * @param n 数值
 * @param count 位数
 */
export function reserveFraction(n: number, count: number) {
    count = Math.max(0, count | 0);
    const pow = Math.pow(10, count);
    return ((n * pow) | 0) / pow;
}

/**
 * 比较两个数值是否近似相等
 * @param 数值 a
 * @param 数值 b
 * @returns
 */
export function equalApproximately(a: number, b: number): boolean {
    return Math.abs(a - b) <= 1.0e-6;
}

/**
 * 截取数值到指定范围
 * @param n 数值
 * @param min 限定最小值
 * @param max 限定最大值
 * @returns
 */
export function clamp(n: number, min: number, max: number): number {
    return Math.min(Math.max(n, min), max);
}

/**
 * 数值是否位于限定范围内
 * @param v 数值
 * @param min 限定最小值
 * @param max 限定最大值
 * @returns
 */
export function isInRange(v: number, min: number, max: number) {
    return v >= min && v <= max;
}
