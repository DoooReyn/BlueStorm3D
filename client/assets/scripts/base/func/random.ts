import { Color } from "cc";

/**
 * Url      : db://assets/scripts/base/func/random.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:49:26 GMT+0800 (中国标准时间)
 * Desc     : 随机
 */

/**
 * 获取随机 uuid
 * @returns
 */
export function randomUUID() {
    let d = new Date().getTime();
    d += window?.performance.now() || 0;
    let pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    return pattern.replace(/[xy]/g, (c) => {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}

/**
 * 随机颜色通道色值
 * @returns number
 */
export function randomColorBit() {
    return (Math.random() * 255) | 0;
}

/**
 * 随机颜色
 * @returns
 */
export function color3B() {
    return new Color(randomColorBit(), randomColorBit(), randomColorBit());
}

/**
 * 随机颜色
 * @returns
 */
export function color4B() {
    return new Color(
        randomColorBit(),
        randomColorBit(),
        randomColorBit(),
        randomColorBit()
    );
}

/**
 * @zh
 * 随机整数 [min, max]
 * @param min 下限
 * @param max 上限
 */
export function randomInteger(min: number, max: number) {
    return (Math.random() * (max - min + 1) + min) | 0;
}

/**
 * @zh
 * 随机浮点数 [min, max]
 * @param min 下限
 * @param max 上限
 * @return 随机数
 */
export function randomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
