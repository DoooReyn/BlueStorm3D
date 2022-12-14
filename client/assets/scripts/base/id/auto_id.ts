import { sys } from "cc";
import { isNumber } from "../func/types";

/**
 * Url      : db://assets/scripts/base/id/auto_id.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:42:56 GMT+0800 (中国标准时间)
 * Class    : AutoId
 * Desc     : 递增id生成器
 */
export class AutoId {
    private _id: number = 0;

    /**
     * @zh
     * 随机id
     * @returns 随机id
     */
    private static random() {
        let n = sys.now() + (window?.performance.now() || 0);
        return Math.floor(Math.random() * n) % 1000;
    }

    /**
     * @zh
     * 构造递增id生成器
     * @param start 起始id
     */
    constructor(start?: number) {
        if (isNumber(start)) {
            this._id = Math.abs(start | 0);
        } else {
            this._id = AutoId.random();
        }
    }

    /**
     * @zh
     * 获取下一个id
     * @returns 下一个id
     */
    next() {
        return ++this._id;
    }
}
