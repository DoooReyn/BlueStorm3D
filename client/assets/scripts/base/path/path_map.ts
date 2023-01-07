import { Vec2, Vec3 } from "cc";
import { isInRange } from "../func/numbers";
import { E_Path_GridType } from "./path_def";
import { PathGrid } from "./path_grid";

/**
 * 寻路地图基类
 */
export class PathMap {
    /**
     * 地图块横向/纵向数量
     */
    protected size: Vec2 = Vec2.ZERO;

    /**
     * 地图块横向/纵向/斜向权重
     */
    protected weight: Vec3 = Vec3.ZERO;

    /**
     * 地图网格列表
     */
    public grids: PathGrid[][] = [];

    /**
     * 起点
     */
    public startAt: PathGrid = null;

    /**
     * 终点
     */
    public stopAt: PathGrid = null;

    public constructor(size: Vec2, weight: Vec3) {
        this.resize(size);
        this.setWeight(weight);
    }

    /**
     * 设置起点
     * @param row 起点所在行
     * @param col 起点所在列
     */
    public setStartAt(row: number, col: number) {
        row = this.isValidRow(row) ? row : 0;
        col = this.isValidCol(col) ? col : 0;
        this.startAt = this.getGrid(row, col) || new PathGrid(row, col);
        this.startAt.asStart();
    }

    /**
     * 设置终点
     * @param row 终点所在行
     * @param col 终点所在列
     */
    public setStopAt(row: number, col: number) {
        row = this.isValidRow(row) ? row : this.size.x - 1;
        col = this.isValidCol(col) ? col : this.size.y - 1;
        this.stopAt = this.getGrid(row, col) || new PathGrid(row, col);
        this.stopAt.asStop();
    }

    /**
     * 设置地图尺寸
     * @param size 地图尺寸
     */
    public resize(size: Vec2) {
        this.size = size.clone();
    }

    /**
     * 设置地图权重
     * @param weight 权重
     */
    public setWeight(weight: Vec3) {
        this.weight = weight.clone();
    }

    /**
     * 获取指定行列所指的网格
     * @param row 行
     * @param col 列
     * @returns
     */
    public getGrid(row: number, col: number) {
        row = row | 0;
        col = col | 0;
        if (this.isValidRow(row) && this.isValidCol(col)) {
            return this.grids[row][col];
        }
    }

    /**
     * 是否有效的行
     * @param row 行
     * @returns
     */
    public isValidRow(row: number) {
        return isInRange(row, 0, this.size.x - 1);
    }

    /**
     * 是否有效的列
     * @param col 列
     * @returns
     */
    public isValidCol(col: number) {
        return isInRange(col, 0, this.size.y - 1);
    }

    /**
     * 获取当前网格周边的网格
     * @param current 当前网格
     */
    public getNeighbors(current: PathGrid): [number, number, number][] {
        let { row, col } = current;
        let neighbors = [
            [row, col + 1, this.weight.y],
            [row, col - 1, this.weight.y],
            [row - 1, col, this.weight.x],
            [row + 1, col, this.weight.x],
        ];

        if (this.weight.z > 0) {
            neighbors.push(
                [row - 1, col + 1, this.weight.z],
                [row + 1, col + 1, this.weight.z],
                [row - 1, col - 1, this.weight.z],
                [row + 1, col - 1, this.weight.z]
            );
        }

        let ret = [];
        neighbors.forEach((n) => {
            let [r, c, w] = n;
            let grid = this.getGrid(r, c);
            grid && ret.push([r, c, w]);
        });

        return ret;
    }

    /**
     * 计算当前网格的 H 值
     * @param current 当前网格
     */
    public calculateH(current: PathGrid): number {
        const row_dist = Math.abs(this.stopAt.row - current.row);
        const col_dist = Math.abs(this.stopAt.col - current.col);
        return row_dist * this.weight.x + col_dist * this.weight.y;
    }

    /**
     * 重置所有网格
     */
    public resetGrids() {
        for (let r = 0; r < this.size.x; r++) {
            this.grids[r] = this.grids[r] || [];
            for (let c = 0; c < this.size.y; c++) {
                this.grids[r][c] = this.grids[r][c] || new PathGrid(r, c);
                this.grids[r][c].reset();
            }
        }
    }

    /**
     * 开始寻路
     * 1. 新建开放列表和关闭列表
     * 2. 将起点放入开放列表
     * 3. 当开放列表不为空时，循环以下过程
     *      1. 获取开放列表中f值最小的节点作为当前节点
     *      2. 如果当前节点为终点，则结束循环，利用递归回溯返回完整路径
     *      3. 否则，将当前节点从开放列表中移除，加入关闭列表
     *      4. 接着获取当前节点的相邻节点
     *      5. 遍历相邻节点，跳过关闭列表中的节点和不可走的节点
     *      6. 如果相邻节点不在开放列表中，计算并更新其h值，并加入开放列表
     *      7. 否则，计算其g值，与其上次g值比较，若新值更小，则认定其路径更佳，将其父节点设置为当前节点，并更新其g,h,f值
     */
    public find(): PathGrid[] {
        if (!this.startAt || !this.stopAt) return [];

        this.resetGrids();
        let openList = [];
        let closeList = [];
        openList.push(this.startAt);

        function isInOpenList(p: PathGrid) {
            return openList.indexOf(p) > -1;
        }

        function isInCloseList(p: PathGrid) {
            return closeList.indexOf(p) > -1;
        }

        function addToCloseList(p: PathGrid) {
            const at = openList.indexOf(p);
            at > -1 && openList.splice(at, 1);
            closeList.push(p);
        }

        while (openList.length > 0) {
            // 获取开放列表中f值最小的节点作为当前节点
            let lowFIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[lowFIndex].f) {
                    lowFIndex = i;
                }
            }
            let current = openList[lowFIndex];

            if (current.type === E_Path_GridType.Stop) {
                // 如果当前节点为终点，则结束循环，利用递归回溯返回完整路径
                let curr = current;
                let ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            } else {
                // 否则，将当前节点从开放列表中移除，加入关闭列表
                addToCloseList(current);
            }

            // 接着获取当前节点的相邻节点
            let neighbors = this.getNeighbors(current);

            // 遍历相邻节点
            for (let n of neighbors) {
                const [x, y, w] = n;
                const grid = this.getGrid(x, y);
                if (grid.isBlock() || isInCloseList(grid)) {
                    // 跳过关闭列表中的节点和不可走的节点
                    continue;
                }

                const gScore = current.g + w;
                let gScoreIsBest = false;
                if (!isInOpenList(grid)) {
                    // 如果相邻节点不在开放列表中，计算并更新其h值，并加入开放列表
                    gScoreIsBest = true;
                    grid.h = this.calculateH(grid);
                    openList.push(grid);
                } else if (gScore < grid.g) {
                    // 否则，计算其g值，与其上次g值比较，若新值更小，则认定其路径更佳
                    gScoreIsBest = true;
                }
                if (gScoreIsBest) {
                    // 将其父节点设置为当前节点，并更新其g,h,f值
                    grid.parent = current;
                    grid.g = gScore;
                    grid.f = grid.g + grid.h;
                }
            }
        }

        return [];
    }
}
