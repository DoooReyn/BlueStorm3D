/**
 * Url      : db://assets/scripts/base/func/arrays.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 数组辅助方法
 */

/**
 * 洗牌算法1
 * Fisher-Yates Shuffle 随机置乱算法
 * @param list 目标数组
 */
export function shuffle1(list: any[]): any[] {
    let count = list.length;
    while (count) {
        let index = Math.floor(Math.random() * count--);
        let temp = list[count];
        list[count] = list[index];
        list[index] = temp;
    }
    return list;
}

/**
 * 洗牌算法2
 * @param list 目标数组
 */
export function shuffle2(list: any[]): any[] {
    let count = list.length;
    for (let i = 0; i < count; i++) {
        let index = Math.floor(Math.random() * count);
        let temp = list[index];
        list[index] = list[0];
        list[0] = temp;
    }
    return list;
}

/**
 * 洗牌算法3
 * @param list 目标数组
 */
export function shuffle3(list: any[]) {
    return list.sort(() => Math.random() - 0.5);
}

/**
 * 从小到大排序
 * @param list 数字数组
 * @returns
 */
export function sortByAscending(list: number[]) {
    return list.sort((a, b) => a - b);
}

/**
 * 从大到小排序
 * @param list 数字数组
 * @returns
 */
export function sortByDescending(list: number[]) {
    return list.sort((a, b) => b - a);
}

/**
 * 数组去重
 * @param list 原始数组
 * @returns
 */
export function removeDuplicated(list: any[]) {
    return list.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index;
    });
}

/**
 * 获得指定范围内的数值数组
 * @param start 起始数值
 * @param ended 终止数值
 * @param step 增进步幅
 * @returns
 */
export function range(start: number, ended: number, step: number = 1) {
    start = start | 0;
    ended = ended | 0;
    step = step | 0;
    let ret = [];
    if (step > 0) {
        [start, ended] = ended > start ? [start, ended] : [ended, start];
        for (let i = start; i <= ended; i += step) {
            ret.push(i);
        }
    } else if (step === 0) {
        ret.push(start, ended);
    } else {
        [start, ended] = ended > start ? [start, ended] : [ended, start];
        for (let i = ended; i >= start; i += step) {
            ret.push(i);
        }
    }
    return ret;
}

/**
 * 累加
 * @param list 数值数组
 * @returns
 */
export function sumOf(list: number[]) {
    return list.reduce((a, b) => a + b, 0);
}

/**
 * 乘积
 * @param list 数值数组
 * @returns
 */
export function productOf(list: number[]) {
    return list.reduce((a, b) => a * b, 1);
}

/**
 * 截取第一个到指定个数的数组
 * @param list 数组
 * @param count 个数
 */
export function pickFromHead(list: any[], count: number) {
    return list.slice(0, count | 0);
}

/**
 * 截取从最后一个到指定个数的数组
 * @param list 数组
 * @param count 个数
 */
export function pickToTail(list: any[], count: number) {
    return list.slice((list.length - count) | 0, list.length);
}

/**
 * 前进一步
 * @param list 数组
 */
export function forward(list: any[]) {
    list.length > 1 && list.unshift(list.pop());
}

/**
 * 后退一步
 * @param list 数组
 */
export function backward(list: any[]) {
    list.length > 1 && list.push(list.shift());
}

/**
 * 前进/后退 n 步
 * @param list 数组
 * @param step 步数
 */
export function advance(list: any[], step: number) {
    step = step | 0;
    if (step !== 0 && list.length > 1) {
        if (step > 0) {
            list.unshift(...list.splice(list.length - step, step));
        } else {
            list.push(...list.splice(0, step));
        }
    }
    return list;
}

/**
 * 转换为字符串
 * @returns
 */
export function asString(list: any[]) {
    return list.length > 0 ? list.map((v) => v.toString()).join(",") : 0;
}

/**
 * 数组合并
 * @param arrays 数组列表
 * @returns
 */
export function zip(...arrays: any[]): any[] {
    return Array.apply(null, Array(arrays[0].length)).map(function (_: any, i: number) {
        return arrays.map(function (array) {
            return array[i];
        });
    });
}

/**
 * 数组扁平化
 * @param array 目标数组
 */
export function flatten(array: any[]) {
    while (array.some((v) => Array.isArray(v))) {
        array = [].concat.apply([], array);
    }
    return array;
}

/**
 * 合并数组
 * @param array1 目标数组1
 * @param array2 目标数组2
 */
export function combine(array1: any[], array2: any[]): any[] {
    return [...array1, ...array2];
}

/**
 * 随机获取数组索引
 * @param array 目标数组
 */
export function pickIndexFrom(array: any[]): number | undefined {
    if (array.length > 0) {
        return (Math.random() * array.length) | 0;
    }
}

/**
 * 随机获取数组成员
 * @param array 目标数组
 */
export function pickElementFrom(array: any[]): any {
    const size = array.length;
    if (size === 0) return undefined;
    else if (size === 1) return array[0];
    return array[pickIndexFrom(array)];
}

/**
 * 随机获取数组成员
 * @param array 目标数组
 */
export function pickElementsFrom(array: any[], count: number): any[] {
    count = Math.min(array.length, Math.max(1, count | 0));
    return shuffle1(array.slice()).slice(0, count);
}
