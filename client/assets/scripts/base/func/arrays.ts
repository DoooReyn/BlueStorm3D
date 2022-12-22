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
    return list.sort((a, b) => {
        return Math.random() - 0.5;
    });
}

/**
 * 从小到大排序
 * @param numberArr 数字数组
 * @returns
 */
export function sortByAscending(numberArr: number[]) {
    return numberArr.sort((a, b) => a - b);
}

/**
 * 从大到小排序
 * @param numberArr 数字数组
 * @returns
 */
export function sortByDescending(numberArr: number[]) {
    return numberArr.sort((a, b) => b - a);
}

/**
 * 数组去重
 * @param arr 原始数组
 * @returns
 */
export function removeDuplicated(arr: any[]) {
    return arr.filter(function (item, index, arr) {
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
 * @param arr 数值数组
 * @returns
 */
export function sumOf(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0);
}

/**
 * 乘积
 * @param arr 数值数组
 * @returns
 */
export function productOf(arr: number[]) {
    return arr.reduce((a, b) => a * b, 1);
}

/**
 * 双向循环队列
 */
export class LoopQueue<T> extends Array {
    /**
     * 前进一步
     */
    public forwards() {
        this.length >= 1 && this.unshift(this.pop());
    }

    /**
     * 后退一步
     */
    public backwards() {
        this.length >= 1 && this.push(this.shift());
    }

    /**
     * 截取第一个到指定个数的数组
     */
    public pickFromHead(count: number): T[] {
        return this.slice(0, count | 0);
    }

    /**
     * 截取从最后一个到指定个数的数组
     */
    public pickToTail(count: number): T[] {
        return this.slice((this.length - count) | 0, this.length);
    }

    /**
     * 转换为字符串
     * @returns
     */
    public toString(): string {
        return this.map((v) => v.toString()).join(",");
    }
}
