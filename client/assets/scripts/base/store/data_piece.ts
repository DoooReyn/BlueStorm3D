/**
 * Url      : db://assets/scripts/base/store/data_piece.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:52:20 GMT+0800 (中国标准时间)
 * Desc     : 本地数据存储项
 */

import { sys } from "cc";
import { asJsonObject, asJsonString } from "../func/strings";
import { isNull } from "../func/types";

/**
 * 本地数据存储项的数据类型
 */
export type T_DataPiece =
    | number
    | boolean
    | string
    | {
          [key: string]: number | boolean | string;
      }
    | (number | boolean | string)[];

/**
 * 本地数据存储项
 */
export abstract class DataPiece<T extends T_DataPiece> {
    protected _data: T = null;
    protected _key: string = "";

    constructor(key: string, default_value: T) {
        this._key = key;
        let data = this.unserialize();
        this.data = isNull(data) ? default_value : data;
        console.info(key, this._data);
    }

    /**
     * 序列化——保存数据
     */
    public serialize() {
        sys.localStorage.setItem(this._key, asJsonString(this._data));
    }

    /**
     * 反序列化——读取数据
     * @returns
     */
    protected unserialize(): T {
        return asJsonObject(sys.localStorage.getItem(this._key));
    }

    /**
     * 获取数据
     */
    public get data(): T {
        return this._data;
    }

    /**
     * 修改数据
     */
    public set data(piece: T) {
        this._data = this.check(piece);
        this.serialize();
    }

    /**
     * 矫正数据
     * @param piece 数据
     */
    protected abstract check(piece: T): T;
}
