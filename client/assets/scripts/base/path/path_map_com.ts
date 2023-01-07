import { Graphics, Rect, rect, UITransform, Vec2, Vec3, _decorator, Node, EventTouch, Color, v3, v2, size } from "cc";
import { Gossip } from "../ui/add_ons/gossip";
import { setupComponent } from "../ui/add_ons/ui_helper";
import { E_Path_MoveBehavior } from "./path_def";
import { PathGrid } from "./path_grid";
import { PathMap } from "./path_map";

const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/path/path_map_com.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 地图寻路组件（demo）
 */
@ccclass("path_map_com")
export class PathMapCom extends Gossip {
    // REGION START <Member Variables>
    @property({ type: Graphics, tooltip: "绘制组件" })
    protected graph: Graphics = null;

    @property({ displayName: "地图块数量" })
    protected size: Vec2 = v2();

    @property({ displayName: "地图块尺寸" })
    protected grid: Vec2 = v2();

    @property({ displayName: "地图块权重", tooltip: "z大于0表示允许斜行" })
    protected weight: Vec3 = v3();

    /**
     * 移动行为
     */
    protected _behavior: E_Path_MoveBehavior = E_Path_MoveBehavior.None;

    /**
     * 地图
     */
    protected _map: PathMap = null;

    /**
     * 上一次操作的网格
     */
    protected _grid: PathGrid = null;

    /**
     * 地图矩形
     */
    protected _mapRect: Rect = rect(0, 0, 0, 0);

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        this._map = new PathMap(this.size, this.weight);
        this._map.resetGrids();
        this._map.setStartAt(0, 0);
        this._map.setStopAt(this.size.x - 1, this.size.y - 1);
        this.resize();
        this._paintMap();
    }

    protected onEnable() {
        this.node.on(Node.EventType.TOUCH_START, this._onDragStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onDragMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._onDragStop, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onDragStop, this);
    }

    protected onDisable() {
        this.node.off(Node.EventType.TOUCH_START, this._onDragStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this._onDragMove, this);
        this.node.off(Node.EventType.TOUCH_END, this._onDragStop, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this._onDragStop, this);
    }

    /**
     * 触摸开始
     * @param e 触摸事件
     */
    protected _onDragStart(e: EventTouch) {
        let cell = this.touchAt(e);
        let grid = this._map.getGrid(cell.x, cell.y);
        // this.i("_onDragStart", grid);
        if (grid) {
            this._grid = grid;
            if (grid.isStart()) {
                this._behavior = E_Path_MoveBehavior.MoveStart;
            } else if (grid.isStop()) {
                this._behavior = E_Path_MoveBehavior.MoveStop;
            } else if (grid.isBlock()) {
                this._behavior = E_Path_MoveBehavior.EraseBlock;
                grid.asEmpty();
                this._paintMap();
            } else {
                this._behavior = E_Path_MoveBehavior.DrawBlock;
                grid.asBlock();
                this._paintMap();
            }
        }
    }

    /**
     * 触摸移动
     * @param e 触摸事件
     */
    private _onDragMove(e: EventTouch) {
        let cell = this.touchAt(e);
        let grid = this._map.getGrid(cell.x, cell.y);
        // this.i("_onDragMove", grid);
        if (grid) {
            switch (this._behavior) {
                case E_Path_MoveBehavior.DrawBlock:
                    if (grid.isEmpty()) {
                        grid.asBlock();
                        this._paintMap();
                    }
                    break;
                case E_Path_MoveBehavior.EraseBlock:
                    if (grid.isBlock()) {
                        grid.asEmpty();
                        this._paintMap();
                    }
                    break;
                case E_Path_MoveBehavior.MoveStart:
                    if (!grid.isBlock()) {
                        this._grid.asEmpty();
                        this._map.setStartAt(grid.row, grid.col);
                        this._paintMap();
                        this._grid = grid;
                    }
                    break;
                case E_Path_MoveBehavior.MoveStop:
                    if (!grid.isBlock()) {
                        this._grid.asEmpty();
                        this._map.setStopAt(grid.row, grid.col);
                        this._paintMap();
                        this._grid = grid;
                    }
                    break;
            }
        }
    }

    /**
     * 触摸结束
     * @param e 触摸事件
     */
    private _onDragStop(e: EventTouch) {
        let close = this._map.find();
        // this.i("onDragStop", close);
        this._grid = null;
        if (close.length > 0) {
            this._paintPath(close);
        }
    }

    // REGION ENDED <protected>

    // REGION START <private>

    /**
     * 绘制矩形
     * @param c 颜色
     * @param x 行
     * @param y 列
     * @param w 宽度
     * @param h 高度
     */
    private _drawRect(c: Color, x: number, y: number, w: number, h: number) {
        this.graph.rect(x, y, w, h);
        this.graph.fillColor = c;
        this.graph.fill();
        this.graph.stroke();
    }

    /**
     * 绘制线段
     * @param c 颜色
     * @param x1 起点所在行
     * @param y1 起点所在列
     * @param x2 终点所在行
     * @param y2 终点所在列
     */
    private _drawLine(c: Color, x1: number, y1: number, x2: number, y2: number) {
        this.graph.strokeColor = c;
        this.graph.moveTo(x1, y1);
        this.graph.lineTo(x2, y2);
        this.graph.stroke();
    }

    /**
     * 绘制网格
     * @param c 颜色
     * @param p 网格
     */
    private _drawGrid(c: Color, p: PathGrid) {
        const { x, y } = this._mapRect;
        const { x: w, y: h } = this.grid;
        const x1 = p.row * w + x;
        const y1 = p.col * h + y;
        this._drawRect(c, x1, y1, w, h);
    }

    /**
     * 绘制地图
     */
    private _paintMap() {
        this.graph.clear();
        const { x, y, width: w, height: h } = this._mapRect;
        this._drawRect(Color.WHITE, x, y, w, h);
        this._drawGrid(Color.BLUE, this._map.startAt);
        this._drawGrid(Color.GREEN, this._map.stopAt);
        for (let r = 0; r < this.size.x - 1; r++) {
            const y1 = (r + 1) * this.grid.y + y;
            const x2 = w + x;
            this._drawLine(Color.RED, x, y1, x2, y1);
        }
        for (let c = 0; c < this.size.y - 1; c++) {
            const x1 = (c + 1) * this.grid.x + y;
            const y2 = h + y;
            this._drawLine(Color.RED, x1, y, x1, y2);
        }
        this._map.grids.forEach((bl) => {
            bl.forEach((b) => {
                b.isBlock() && this._drawGrid(Color.GRAY, new PathGrid(b.row, b.col));
            });
        });
    }

    /**
     * 绘制路径
     * @param path 路径
     */
    private _paintPath(path: PathGrid[]) {
        path.forEach((b) => this._drawGrid(Color.CYAN, b));
        this._drawGrid(Color.BLUE, this._map.startAt);
        this._drawGrid(Color.GREEN, this._map.stopAt);
    }

    // REGION ENDED <private>

    // REGION START <public>

    /**
     * 获取地图宽度
     */
    public get mapWidth() {
        return this._mapRect.width;
    }

    /**
     * 获取地图高度
     */
    public get mapHeight() {
        return this._mapRect.height;
    }

    /**
     * 获取地图尺寸
     */
    public get mapSize() {
        return size(this.mapWidth, this.mapHeight);
    }

    /**
     * 获取地图网格行数
     */
    public get rows() {
        return this.size.x;
    }

    /**
     * 获取地图网格列数
     */
    public get cols() {
        return this.size.y;
    }

    /**
     * 获取地图网格行列数
     */
    public get rowAndCol() {
        return size(this.rows, this.cols);
    }

    /**
     * 获取网格宽度
     */
    public get gridWidth() {
        return this.grid.x;
    }

    /**
     * 获取网格宽度
     */
    public get gridHeight() {
        return this.grid.y;
    }

    /**
     * 获取网格尺寸
     */
    public get gridSize() {
        return size(this.gridWidth, this.gridHeight);
    }

    /**
     * 获取触摸点所在的网格位置
     * @param e 触摸点
     * @returns
     */
    public touchAt(e: EventTouch) {
        const touchAt = e.getLocation();
        const touchAt3d = v3(touchAt.x, touchAt.y, 0);
        const offset = v3(this._mapRect.width * 0.5, this._mapRect.height * 0.5, 0);
        const touchUT = setupComponent(e.target, UITransform);
        const touchAtWorld = touchUT.convertToNodeSpaceAR(touchAt3d).add(offset);
        return this.at(touchAtWorld);
    }

    /**
     * 获取触摸点所在的网格位置
     * @param p 触摸点位置
     * @returns
     */
    public at(p: Vec2 | Vec3) {
        let row = (p.x / this.grid.x) | 0;
        let col = (p.y / this.grid.y) | 0;
        return v2(row, col);
    }

    /**
     * 设置地图尺寸
     */
    public resize() {
        const w = this.size.x * this.grid.x;
        const h = this.size.y * this.grid.y;
        const x = -w * 0.5;
        const y = -h * 0.5;
        this.setupComponent(UITransform).setContentSize(w, h);
        this._mapRect = rect(x, y, w, h);
    }

    // REGION ENDED <public>
}
