import { _decorator, Node, EventTouch, TweenEasing, Enum, Vec2, sys, Tween, tween, Vec3, clamp01 } from "cc";
import { getUiTransformOf, TimeOfPerFrame } from "../ui_helper";
import { VirtualViewBase } from "./virtual_view_base";
const { ccclass, property } = _decorator;

/**
 * UiScrollView 滚动方向
 */
export enum E_UiScrollView_Direction {
    Horizontal,
    Vertical,
    Both,
}

/**
 * UiScrollView 边界类型
 */
export enum E_UiScrollView_Boundary {
    Left,
    Right,
    Top,
    Bottom,
}

/**
 * UiScrollView 边角类型
 */
export enum E_UiScrollView_Corner {
    LEFT,
    RIGHT,
    TOP,
    BOTTOM,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
}

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/scroll_view_base.ts
 * Author   : reyn
 * Date     : Sat Dec 10 2022 10:06:32 GMT+0800 (中国标准时间)
 * Class    : ScrollViewBase
 * Desc     :
 */
@ccclass("scroll_view_base")
export abstract class ScrollViewBase extends VirtualViewBase {
    // REGION START <Member Variables>

    @property({ displayName: "滚动方向", type: Enum(E_UiScrollView_Direction) })
    protected direction: E_UiScrollView_Direction = E_UiScrollView_Direction.Both;

    @property({ displayName: "允许边界回弹" })
    protected bouncable: boolean = true;

    @property({ displayName: "边界回弹时间", tooltip: "不建议设置太大的值", range: [0, 1, 0.1] })
    protected bounceDuration: number = 0.2;

    @property({ displayName: "边界回弹时响应触摸事件" })
    protected dispatchAtBouncing: boolean = true;

    @property({ displayName: "开启惯性滚动" })
    protected inertiaEnable: boolean = true;

    @property({ displayName: "惯性滚动持续时间", range: [0, 1, 0.1] })
    protected inertiaDuration: number = 0.5;

    /**
     * 正在回弹否
     */
    private _isBouncing: boolean = false;

    /**
     * 正在移动否
     */
    private _isMoved: boolean = false;

    /**
     * 位置标记信息
     */
    private _touchLocMarks: [Vec2, number][] = [];

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected _onTouchStart(e: EventTouch): void {
        this.stopScroll();

        if (e.target === this.maskNode || this._canDispatchAtBouncing) {
            e.propagationStopped = true;
        }

        if (this.inertiaEnable && this.inertiaDuration > 0) {
            this._clearTouchLocMarks();
            this._addTouchLocMark(e.getLocation());
        }
    }

    protected _onTouchMove(e: EventTouch): void {
        if (this._canDispatchAtBouncing) {
            e.propagationStopped = true;
            return;
        }

        const delta = e.getDelta();
        const moved = !delta.equals(Vec2.ZERO);
        if (moved) {
            if (e.target !== this.maskNode) {
                // 防止响应其他触摸节点
                e.target.emit(Node.EventType.TOUCH_CANCEL, e);
            }
            if (this.inertiaEnable && this.inertiaDuration > 0) {
                // 惯性触摸点
                this._addTouchLocMark(e.getLocation());
            }
            // 手动移动
            this._moveBy(delta);
        }
    }

    protected _onTouchEnded(e: EventTouch): void {
        if (this._canDispatchAtBouncing) {
            e.propagationStopped = true;
            return;
        }

        if (this._isInertiaValid()) {
            this._addTouchLocMark(e.getLocation());
            let info = this._getTouchLocMarksInfo();
            if (info.valid) {
                this._scrollByInertia(info.dist, info.time);
                this._clearTouchLocMarks();
                return;
            }
        }

        this._checkBoundaryBounce();
    }

    protected _onTouchCancel(e: EventTouch): void {
        this._onTouchEnded(e);
    }

    /**
     * 惯性滚动有效条件
     * - 惯性滚动开关开启
     * - 惯性滚动持续时间大于 0
     * - 内容节点尺寸超过视图
     * @returns
     */
    protected _isInertiaValid() {
        const outSize = this._sizeInfoOfExceeded;
        const isOutOfMask = outSize.width || outSize.height;
        return this.inertiaEnable && this.inertiaDuration > 0 && isOutOfMask;
    }

    /**
     * 当内容节点正在回弹时能否响应触摸事件
     * @returns
     */
    protected get _canDispatchAtBouncing() {
        return this._isBouncing && !this.dispatchAtBouncing;
    }

    /**
     * 添加触摸位置标记
     * @param loc 位置
     */
    protected _addTouchLocMark(loc: Vec2) {
        if (this._touchLocMarks.length >= 3) {
            this._touchLocMarks.pop();
        }
        this._touchLocMarks.unshift([loc, sys.now()]);
    }

    /**
     * 获取触摸位置信息
     * @returns
     */
    protected _getTouchLocMarksInfo() {
        if (this._touchLocMarks.length < 3) {
            return { dist: Vec2.ZERO, time: 1, valid: false };
        } else {
            let [v1, v2, v3] = this._touchLocMarks;
            let dist = v1[0].subtract(v3[0]);
            let time = (v1[1] - v2[1]) / 1000;
            return { dist, time, valid: time <= 0.01 };
        }
    }

    /**
     * 清除触摸位置标记信息
     */
    protected _clearTouchLocMarks() {
        this._touchLocMarks.length = 0;
    }

    /**
     * 获取与边界的距离
     * - 正数意味着在边界内
     * - 负数意味着超出边界
     * - 通常,不应该让边界距离为正数
     * @param boundary 边界位置
     * @returns
     */
    protected _getBoundary(boundary: E_UiScrollView_Boundary) {
        const position = this.contentNode.position;
        switch (boundary) {
            case E_UiScrollView_Boundary.Left:
                return this._mui.width * this._mui.anchorX + position.x - this._cui.anchorX * this._cui.width;
            case E_UiScrollView_Boundary.Right:
                return -(this._cui.width - this._mui.width + this.getLeftBoundary());
            case E_UiScrollView_Boundary.Top:
                return this._mui.height - this._cui.height - this.getBottomBoundary();
            case E_UiScrollView_Boundary.Bottom:
                return this._mui.height * this._mui.anchorY + position.y - this._cui.height * this._cui.anchorY;
        }
    }

    /**
     * 获取内容节点尺寸超出信息
     * @returns
     */
    protected get _sizeInfoOfExceeded() {
        return { width: this._cui.width > this._mui.width, height: this._cui.height > this._mui.height };
    }

    /**
     * 计算滚动距离衰减系数
     * @param distance 距离
     * @returns
     */
    protected _calculateAttenuatedFactor(distance: number, deltaTime: number) {
        return (distance / Math.max(0.01, deltaTime)) * 0.05 * this.inertiaDuration;
    }

    /**
     * 边界回弹开始回调
     */
    protected _onBounceStarted() {
        this._isMoved = true;
        this._isBouncing = true;
        this.node.emit(VirtualViewBase.EVENT_BOUNCE_START);
    }

    /**
     * 边界回弹位置刷新
     * @param pos 内容节点当前位置
     */
    protected _onBounceRefresh(pos: Vec3) {
        this.contentNode.position = pos;
        this._onScrolling();
    }

    /**
     * 边界回弹完成回调
     */
    protected _onBounceFinished() {
        this._isMoved = false;
        this._isBouncing = false;
        this.node.emit(VirtualViewBase.EVENT_BOUNCE_FINISH);
        this._onScrollFinished();
    }

    /**
     * 按照偏移量对内容节点进行移动
     * @param offset 移动偏移量
     */
    protected _moveBy(offset: Vec2) {
        this._isMoved = true;
        this._checkMoveByOffset(offset);
        this._syncContentPosition();
        this._onScrolling();
    }

    /**
     * 惯性滚动
     * @param offset 移动偏移量
     */
    protected _scrollByInertia(offset: Vec2, deltaTime: number) {
        let bounced = false;
        offset.x = this._calculateAttenuatedFactor(offset.x, deltaTime);
        offset.y = this._calculateAttenuatedFactor(offset.y, deltaTime);
        this.stopScroll();
        tween(offset)
            .to(this.inertiaDuration, Vec2.ZERO, {
                easing: "smooth",
                onUpdate: (target: Vec2) => {
                    if (bounced) {
                        this.stopScroll();
                        this._checkBoundaryBounce();
                    } else {
                        bounced = this._checkIfBoundaryBounced();
                        this._moveBy(target);
                    }
                },
            })
            .start();
    }

    /**
     * 检查移动偏移量
     * @param offset 移动偏移量
     */
    protected _checkMoveByOffset(offset: Vec2 = Vec2.ZERO) {
        this.bouncable ? this._checkMoveWithBounce(offset) : this._checkMoveWithNoBounce(offset);
    }

    /**
     * 检查水平方向是否需要回弹
     * @returns
     */
    protected _checkIfHorizontalBounced() {
        const contentOutOfMask = this._sizeInfoOfExceeded;
        if (contentOutOfMask) {
            const lx = this.getLeftBoundary();
            const rx = this.getRightBoundary();
            return (lx <= 0 && rx >= 0) || (lx >= 0 && rx <= 0);
        }
    }

    /**
     * 检查垂直方向是否需要回弹
     * @returns
     */
    protected _checkIfVerticalBounced() {
        const contentOutOfMask = this._sizeInfoOfExceeded;
        if (contentOutOfMask.height) {
            const by = this.getBottomBoundary();
            const ty = this.getTopBoundary();
            return by >= 0 || ty >= 0;
        }
    }
    /**
     * 位置校正，包括回弹
     */
    protected _checkBoundaryBounce(forceDuration: number = 0) {
        if ((this.bouncable && this._isMoved) || forceDuration > 0) {
            this.stopScroll();
            const before = this.contentNode.position.clone();
            this._checkMoveWithNoBounce(Vec2.ZERO);
            const after = this.contentNode.position.clone();
            this.contentNode.position.set(before);
            const duration = forceDuration || this.bounceDuration;
            tween(this.contentNode.position)
                .to(duration, after, {
                    easing: "sineOut",
                    onStart: this._onBounceStarted.bind(this),
                    onUpdate: this._onBounceRefresh.bind(this),
                })
                .call(this._onBounceFinished.bind(this))
                .start();
        } else {
            this._isMoved = false;
            this._onScrollFinished();
        }
    }

    /**
     * 同步内容节点位置
     */
    protected _syncContentPosition() {
        this.contentNode.setPosition(this.contentNode.position);
    }

    /**
     * 检查指定方向是否需要回弹
     * @returns
     */
    protected abstract _checkIfBoundaryBounced(): boolean;

    /**
     * 按照偏移量对内容节点进行移动
     * @param offset 移动偏移量
     */
    protected abstract _checkMoveWithBounce(offset: Vec2): void;

    /**
     * 检查最终位置偏移
     * @param offset 移动偏移量
     */
    protected abstract _checkMoveWithNoBounce(offset: Vec2): void;

    /**
     * 检查水平方向偏移
     * - 水平滚动默认从左边开始，可以根据需要重写
     * - 垂直滚动不需要检查水平偏移
     * @param offset 移动偏移量
     */
    protected _checkHorizontalOffset(offset: Vec2 = Vec2.ZERO) {
        const position = this.contentNode.position;
        const x = position.x;
        position.add3f(offset.x, 0, 0);
        let lx = this.getLeftBoundary();
        let rx = this.getRightBoundary();
        if (this._sizeInfoOfExceeded.width) {
            if (lx > 0) {
                position.add3f(-lx, 0, 0);
            } else {
                rx > 0 && position.add3f(rx, 0, 0);
            }
        } else {
            position.add3f(-lx, 0, 0);
        }
        return position;
    }

    /**
     * 检查垂直方向偏移
     * - 垂直方向默认从顶部开始，可以根据需要重写
     * - 水平滚动不需要检查垂直偏移
     * @param offset 移动偏移量
     */
    protected _checkVerticalOffset(offset: Vec2 = Vec2.ZERO) {
        const position = this.contentNode.position;
        position.add3f(0, offset.y, 0);
        let ty = this.getTopBoundary();
        let by = this.getBottomBoundary();
        if (this._sizeInfoOfExceeded.height) {
            if (ty > 0) {
                position.add3f(0, ty, 0);
            } else {
                by > 0 && position.add3f(0, -by, 0);
            }
        } else {
            position.add3f(0, ty, 0);
        }
        return position;
    }

    /**
     * 是否已滚动到指定边角
     * @param corner 指定边角
     * @returns
     */
    protected _isScrollToCorner(corner: E_UiScrollView_Corner) {
        const exceeded = this._sizeInfoOfExceeded;
        switch (corner) {
            case E_UiScrollView_Corner.BOTTOM:
                return exceeded.height ? this.getBottomBoundary() >= 0 : true;
            case E_UiScrollView_Corner.TOP:
                return exceeded.height ? this.getTopBoundary() >= 0 : true;
            case E_UiScrollView_Corner.LEFT:
                return exceeded.width ? this.getLeftBoundary() >= 0 : true;
            case E_UiScrollView_Corner.RIGHT:
                return exceeded.width ? this.getRightBoundary() >= 0 : true;
            case E_UiScrollView_Corner.BOTTOM_LEFT:
                return (
                    this._isScrollToCorner(E_UiScrollView_Corner.LEFT) &&
                    this._isScrollToCorner(E_UiScrollView_Corner.BOTTOM)
                );
            case E_UiScrollView_Corner.BOTTOM_RIGHT:
                return (
                    this._isScrollToCorner(E_UiScrollView_Corner.RIGHT) &&
                    this._isScrollToCorner(E_UiScrollView_Corner.BOTTOM)
                );
            case E_UiScrollView_Corner.TOP_LEFT:
                return (
                    this._isScrollToCorner(E_UiScrollView_Corner.LEFT) &&
                    this._isScrollToCorner(E_UiScrollView_Corner.TOP)
                );
            case E_UiScrollView_Corner.TOP_RIGHT:
                return (
                    this._isScrollToCorner(E_UiScrollView_Corner.RIGHT) &&
                    this._isScrollToCorner(E_UiScrollView_Corner.TOP)
                );
        }
    }

    /**
     * 滚动到指定边角
     * @param corner 指定边角
     */
    protected _scrollToCorner(corner: E_UiScrollView_Corner, duration: number = ScrollViewBase.SCROLL_DURATION) {
        const exceeded = this._sizeInfoOfExceeded;
        switch (corner) {
            case E_UiScrollView_Corner.TOP:
                this.isVerticalEnabled &&
                    exceeded.height &&
                    this._scrollToPercentInDir(E_UiScrollView_Direction.Vertical, 0, duration);
                break;
            case E_UiScrollView_Corner.BOTTOM:
                this.isVerticalEnabled &&
                    exceeded.height &&
                    this._scrollToPercentInDir(E_UiScrollView_Direction.Vertical, 1, duration);
                break;
            case E_UiScrollView_Corner.LEFT:
                this.isHorizontalEnabled &&
                    exceeded.width &&
                    this._scrollToPercentInDir(E_UiScrollView_Direction.Horizontal, 0, duration);
                break;
            case E_UiScrollView_Corner.RIGHT:
                this.isHorizontalEnabled &&
                    exceeded.width &&
                    this._scrollToPercentInDir(E_UiScrollView_Direction.Horizontal, 1, duration);
                break;
            case E_UiScrollView_Corner.TOP_LEFT:
                this.isBothEnabled && exceeded.width && exceeded.height && this._scrollToPercent(0, 0, duration);
                break;
            case E_UiScrollView_Corner.TOP_RIGHT:
                this.isBothEnabled && exceeded.width && exceeded.height && this._scrollToPercent(1, 0, duration);
                break;
            case E_UiScrollView_Corner.BOTTOM_LEFT:
                this.isBothEnabled && exceeded.width && exceeded.height && this._scrollToPercent(0, 1, duration);
                break;
            case E_UiScrollView_Corner.BOTTOM_RIGHT:
                this.isBothEnabled && exceeded.width && exceeded.height && this._scrollToPercent(1, 1, duration);
                break;
        }
    }

    /**
     * 滚动到水平或垂直百分比位置
     * @param percent 水平或垂直百分比
     * @param duration 动画事件
     */
    protected _scrollToPercentInDir(
        dir: E_UiScrollView_Direction.Horizontal | E_UiScrollView_Direction.Vertical,
        percent: number,
        duration: number = ScrollViewBase.SCROLL_DURATION
    ) {
        if (this.isHorizontalEnabled && dir === E_UiScrollView_Direction.Horizontal) {
            this._scrollToPercent(percent, 0, duration, true, false);
        } else if (this.isVerticalEnabled && dir === E_UiScrollView_Direction.Vertical) {
            this._scrollToPercent(0, percent, duration, false, true);
        }
    }

    /**
     * 滚动到百分比位置
     * @param xPercent 水平百分比
     * @param yPercent 垂直百分比
     * @param duration 动画时间
     */
    protected _scrollToPercent(
        xPercent: number,
        yPercent: number,
        duration: number = VirtualViewBase.SCROLL_DURATION,
        xEnabled: boolean = true,
        yEnabled: boolean = true
    ) {
        xPercent = clamp01(xPercent);
        yPercent = clamp01(yPercent);
        const pos = new Vec3(this._cui.width * xPercent, -this._cui.height * yPercent);
        let target = this._oriContentPos.clone();
        if (this.isHorizontalEnabled) {
            if (xEnabled) {
                let hof = pos.x;
                let ubf = this._cui.width - this._mui.width;
                if (hof > ubf) hof = ubf;
                target.x = this._oriContentPos.x - hof;
            } else {
                target.x = this.contentNode.position.x;
            }
        }
        if (this.isVerticalEnabled) {
            if (yEnabled) {
                let vof = pos.y;
                let ubf = this._cui.height - this._mui.height;
                -vof > ubf && (vof = -ubf);
                target.y = this._oriContentPos.y - vof;
            } else {
                target.y = this.contentNode.position.y;
            }
        }
        this._scrollTo(target, duration);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 水平滚动可用否
     */
    public get isHorizontalEnabled() {
        return this.isHorizontalOnly || this.isBothEnabled;
    }

    /**
     * 垂直滚动可用否
     */
    public get isVerticalEnabled() {
        return this.isVerticalOnly || this.isBothEnabled;
    }

    /**
     * 任意方向滚动可用否
     */
    public get isBothEnabled() {
        return this.direction === E_UiScrollView_Direction.Both;
    }

    /**
     * 水平单向滚动可用否
     */
    public get isHorizontalOnly() {
        return this.direction === E_UiScrollView_Direction.Horizontal;
    }

    /**
     * 垂直单向滚动可用否
     */
    public get isVerticalOnly() {
        return this.direction === E_UiScrollView_Direction.Vertical;
    }

    /**
     * 获取与左边界的距离
     * @returns
     */
    public getLeftBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Left);
    }

    /**
     * 获取与右边界的距离
     * @returns
     */
    public getRightBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Right);
    }

    /**
     * 获取与上边界的距离
     * @returns
     */
    public getTopBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Top);
    }

    /**
     * 获取与下边界的距离
     * @returns
     */
    public getBottomBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Bottom);
    }

    public scrollToItem(index: number, duration?: number, easing?: TweenEasing): void {
        index = index | 0;
        if (index >= 0 && index < this.contentNode.children.length) {
            let item = this.contentNode.children[index];
            let tui = getUiTransformOf(item);
            let target = this._oriContentPos.clone();
            if (this.isHorizontalEnabled) {
                let hof = item.position.x - tui.width * (0.5 - this._cui.anchorX);
                let ubf = this._cui.width - this._mui.width;
                if (hof > ubf) hof = ubf;
                target.x = this._oriContentPos.x - hof;
            }
            if (this.isVerticalEnabled) {
                let vof = item.position.y + tui.height * (1 - tui.anchorY);
                let ubf = this._cui.height - this._mui.height;
                -vof > ubf && (vof = -ubf);
                target.y = this._oriContentPos.y - vof;
            }
            this._scrollTo(target, duration, easing);
        }
    }

    /**
     * 刷新视图
     */
    public refreshView() {
        this._checkBoundaryBounce(TimeOfPerFrame * 10);
    }

    // REGION ENDED <public>
}
