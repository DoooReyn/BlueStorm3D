/**
 * Url      : db://assets/scripts/base/store/data_store.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:52:20 GMT+0800 (中国标准时间)
 * Desc     : 本地数据管理
 */

import { DataPiece } from "./data_piece";

/**
 * 音量数据
 */
export class VolumeData extends DataPiece<number> {
    protected check(piece: number): number {
        return Math.max(0, Math.min(1, piece));
    }
    protected default() {
        return 0.8;
    }
}

/**
 * Url      : db://assets/scripts/base/store/data_piece.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:52:20 GMT+0800 (中国标准时间)
 * Desc     : 本地数据存储项
 *   - 可以根据 DataPiece 创建自定义的数据类型
 */
export class DataStore {
    private _key: string = null;
    public music: VolumeData = null;
    public effect: VolumeData = null;

    /**
     * 初始化
     * @param key 主存储项 key
     */
    init(key: string) {
        if (!this._key) {
            this._key = key;
            this.music = new VolumeData(this._get("Music"), 0.8);
            this.effect = new VolumeData(this._get("Effect"), 1.0);
        }
    }

    /**
     * 获取存储子项 key
     * @param sub_key 存储子项 key
     * @returns
     */
    private _get(sub_key: string): string {
        return `${this._key}#${sub_key}`;
    }

    /**
     * 主动保存数据
     */
    public save() {
        this.music.serialize();
        this.effect.serialize();
    }
}
