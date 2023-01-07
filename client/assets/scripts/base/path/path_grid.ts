import { E_Path_GridType } from "./path_def";

/**
 * Url      : db://assets/scripts/base/path/path_grid.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 地图网格
 */
export class PathGrid {
    /**
     * 所在行
     */
    public row: number;

    /**
     * 所在列
     */
    public col: number;

    /**
     * f值
     */
    public f: number;

    /**
     * g值
     */
    public g: number;

    /**
     * h值
     */
    public h: number;

    /**
     * 网格类型
     */
    public type: E_Path_GridType;

    /**
     * 父亲网格
     */
    public parent: PathGrid;

    /**
     * 构造一个网格
     * @param row 所在行
     * @param col 所在列
     * @param parent 父亲网格
     */
    public constructor(row: number, col: number, parent?: PathGrid) {
        this.row = row;
        this.col = col;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.type = E_Path_GridType.Empty;
        parent && (this.parent = parent);
    }

    /**
     * 是否起点
     * @returns
     */
    public isStart() {
        return this.type === E_Path_GridType.Start;
    }

    /**
     * 是否终点
     * @returns
     */
    public isStop() {
        return this.type === E_Path_GridType.Stop;
    }

    /**
     * 是否未灰点(不可寻路的点)
     * @returns
     */
    public isBlock() {
        return this.type === E_Path_GridType.Block;
    }

    /**
     * 是否为白点(可寻路的点)
     * @returns
     */
    public isEmpty() {
        return this.type === E_Path_GridType.Empty;
    }

    /**
     * 设置为起点
     */
    public asStart() {
        this.type = E_Path_GridType.Start;
    }

    /**
     * 设置为终点
     */
    public asStop() {
        this.type = E_Path_GridType.Stop;
    }

    /**
     * 设置为灰点
     */
    public asBlock() {
        this.type = E_Path_GridType.Block;
    }

    /**
     * 设置为起点
     */
    public asEmpty() {
        this.type = E_Path_GridType.Empty;
    }

    /**
     * 重置
     */
    public reset() {
        this.parent = null;
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}
