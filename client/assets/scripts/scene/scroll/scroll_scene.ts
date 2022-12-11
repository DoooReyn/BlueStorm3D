import { _decorator, Node, EventTouch, Vec2, Enum, UITransform, Vec3, tween, Tween, sys } from "cc";
import { Gossip } from "../../base/ui/add_ons/gossip";
const { ccclass, property } = _decorator;

/**
 * UiScrollView 滚动方向
 */
enum E_UiScrollView_Direction {
    Horizontal,
    Vertical,
    Both,
}

/**
 * UiScrollView 边界类型
 * // TODO: Bounce/Scroll 事件
 */
enum E_UiScrollView_Boundary {
    Left,
    Right,
    Top,
    Bottom,
}

/**
 * UiScrollView 缓动动作标记
 */
enum E_UiSwrollView_TweenTag {
    Bounce = 8001,
    Inertia,
}

/**
 * UiScrollView 事件
 */
enum E_UiScrollView_Event {
    BounceStarted = "bounce-started",
    BounceFinished = "bounce-finished",
    ScrollFinished = "scroll-finished",
    Scrolling = "scrolling",
    BounceToLeft = "bounce-to-left",
    BounceToRight = "bounce-to-right",
    BounceToTop = "bounce-to-top",
    BounceToBottom = "bounce-to-bottom",
    ScrollToLeft = "scroll-to-left",
    ScrollToRight = "scroll-to-right",
    ScrollToTop = "scroll-to-top",
    ScrollToBottom = "scroll-to-bottom",
}

/**
 * Url      : db://assets/scripts/scene/scroll/scroll_scene.ts
 * Author   : reyn
 * Date     : Sat Dec 10 2022 14:53:08 GMT+0800 (中国标准时间)
 * Class    : ScrollScene
 * Desc     : 滚动视图测试场景
 */
@ccclass("scroll_scene")
export class ScrollScene extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "视图", type: Node })
    viewNode: Node = null;

    @property({ displayName: "遮罩", type: Node })
    maskNode: Node = null;

    @property({ displayName: "容器", type: Node })
    contentNode: Node = null;

    @property({ displayName: "滚动方向", type: Enum(E_UiScrollView_Direction) })
    direction: E_UiScrollView_Direction = E_UiScrollView_Direction.Vertical;

    @property({ displayName: "允许边界回弹" })
    bouncable: boolean = true;

    @property({ displayName: "边界回弹时间", tooltip: "不建议设置太大的值", range: [0, 1, 0.1] })
    bounceDuration: number = 0.2;

    @property({ displayName: "边界回弹时响应触摸事件" })
    dispatchAtBouncing: boolean = true;

    @property({ displayName: "开启惯性滚动" })
    inertiaEnable: boolean = false;

    @property({ displayName: "惯性滚动持续时间", range: [0, 1, 0.1] })
    inertiaDuration: number = 0.2;

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

    protected onEnable() {
        this.maskNode.on(Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.maskNode.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this, true);
        this.maskNode.on(Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.maskNode.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this, true);
    }

    protected onDisable() {
        this.maskNode.off(Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.maskNode.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this, true);
        this.maskNode.off(Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.maskNode.off(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this, true);
    }

    /**
     * 按钮点击事件
     * @param e 触摸事件
     */
    protected onBtnClicked(e: EventTouch) {
        this.i("onBtnClicked", e.target.parent.name);
    }

    /**
     * 触摸开始
     * - 如果目标节点是遮罩节点，应该阻止事件继续传递
     * @param e 触摸事件
     */
    protected _onTouchStart(e: EventTouch) {
        if (e.target === this.maskNode || (this._isBouncing && !this.dispatchAtBouncing)) {
            e.propagationStopped = true;
        }
        if (this.inertiaEnable && this.inertiaDuration > 0) {
            this._clearTouchLocMarks();
            this._addTouchLocMark(e.getLocation());
        }
    }

    /**
     * 触摸移动
     * - 移动时判定移动距离是否不等于0，且目标节点如果不是遮罩节点，那么应该给目标节点发送 `TOUCH_CANCEL` 事件
     * - 同时阻止事件继续传递，这样就可以过滤掉目标节点上的触摸事件，专注于遮罩节点
     * - 即实现移动时不响应子节点的触摸事件
     * @param e 触摸事件
     */
    protected _onTouchMove(e: EventTouch) {
        if (this._isBouncing && !this.dispatchAtBouncing) {
            e.propagationStopped = true;
            return;
        }

        const delta = e.getDelta();
        const moved = !delta.equals(Vec2.ZERO);
        if (moved) {
            Tween.stopAllByTag(E_UiSwrollView_TweenTag.Bounce);
            this._isMoved = true;
            if (e.target !== this.maskNode) {
                e.target.emit(Node.EventType.TOUCH_CANCEL, e);
            }
            if (this.inertiaEnable && this.inertiaDuration > 0) {
                this._addTouchLocMark(e.getLocation());
            }

            this._moveByOffset(delta.multiplyScalar(0.5));
        }
    }

    /**
     * 触摸结束
     * - 如果目标节点是遮罩节点，应该阻止事件继续传递
     * @param e 触摸事件
     */
    protected _onTouchEnded(e: EventTouch) {
        if (this._isBouncing && !this.dispatchAtBouncing) {
            e.propagationStopped = true;
            return;
        }

        if (this._isInertiaValid()) {
            this._addTouchLocMark(e.getLocation());
            let info = this._geTouchLocMarksInfo();
            if (info.valid) {
                this._scrollByInertia(info.dist);
            } else {
                this._checkBoundaryBounce();
            }
            this._clearTouchLocMarks();
        } else {
            this._checkBoundaryBounce();
        }
    }

    /**
     * 触摸取消
     * - 如果目标节点是遮罩节点，应该阻止事件继续传递
     * @param e 触摸事件
     */
    protected _onTouchCancel(e: EventTouch) {
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
        const contentOutOfMask = this._getDataOfOutSize();
        const isOutOfMask = contentOutOfMask.width || contentOutOfMask.height;
        return this.inertiaEnable && this.inertiaDuration > 0 && isOutOfMask;
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
    protected _geTouchLocMarksInfo() {
        let [v1, v2, v3] = this._touchLocMarks;
        let dist = v1[0].subtract(v3[0]);
        let time = (v1[1] - v2[1]) / 1000;
        return { dist, time, valid: time <= 0.01 };
    }

    /**
     * 清除触摸位置标记信息
     */
    protected _clearTouchLocMarks() {
        this._touchLocMarks.length = 0;
    }

    /**
     * 计算滚动距离衰减系数
     * @param distance 距离
     * @returns
     */
    protected _calculateAttenuatedFactor(distance: number) {
        return this.inertiaDuration * distance * 0.00000003;
    }

    /**
     * 检查水平方向是否需要回弹
     * @returns
     */
    protected _checkIfHorizontalBounced() {
        const contentOutOfMask = this._getDataOfOutSize();
        return contentOutOfMask.width && (this._getLeftBoundary() > 0 || this._getRightBoundary() > 0);
    }

    /**
     * 检查垂直方向是否需要回弹
     * @returns
     */
    protected _checkIfVerticalBounced() {
        const contentOutOfMask = this._getDataOfOutSize();
        return contentOutOfMask.height && (this._getBottomBoundary() > 0 || this._getTopBoundary() > 0);
    }

    /**
     * 惯性滚动
     * @param offset 移动偏移量
     */
    protected _scrollByInertia(offset: Vec2) {
        let bounced = false;
        const cuiTrans = this.contentNode.getComponent(UITransform);
        const muiTrans = this.maskNode.getComponent(UITransform);
        const totalMoveWidth = cuiTrans.width - muiTrans.width;
        const totalMoveHeight = cuiTrans.height - muiTrans.height;
        const attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);
        const attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);
        offset.x = offset.x * totalMoveWidth * this.inertiaDuration * attenuatedFactorX;
        offset.y = offset.y * totalMoveHeight * this.inertiaDuration * attenuatedFactorY;
        offset.x = Math.max(10, Math.abs(offset.x)) * Math.sign(offset.x);
        offset.y = Math.max(10, Math.abs(offset.y)) * Math.sign(offset.y);

        Tween.stopAllByTag(E_UiSwrollView_TweenTag.Inertia);
        tween(offset)
            .tag(E_UiSwrollView_TweenTag.Inertia)
            .to(0.5 / (1.5 - this.inertiaDuration), Vec2.ZERO, {
                easing: "smooth",
                onUpdate: (target: Vec2) => {
                    if (bounced) {
                        Tween.stopAllByTag(E_UiSwrollView_TweenTag.Inertia);
                        this._checkBoundaryBounce();
                    } else {
                        if (this.direction === E_UiScrollView_Direction.Vertical) {
                            bounced = this._checkIfVerticalBounced();
                        } else if (this.direction === E_UiScrollView_Direction.Horizontal) {
                            bounced = this._checkIfHorizontalBounced();
                        } else {
                            bounced = this._checkIfHorizontalBounced();
                            if (!bounced) bounced = this._checkIfVerticalBounced();
                        }
                        this._moveByOffset(target.multiplyScalar(0.5));
                    }
                },
            })
            .call(this._checkBoundaryBounce.bind(this))
            .start();
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
        const cuiTrans = this.contentNode.getComponent(UITransform);
        const muiTrans = this.maskNode.getComponent(UITransform);
        switch (boundary) {
            case E_UiScrollView_Boundary.Left:
                return muiTrans.width * muiTrans.anchorX + position.x - cuiTrans.anchorX * cuiTrans.width;
            case E_UiScrollView_Boundary.Right:
                return muiTrans.width * muiTrans.anchorX - position.x - cuiTrans.anchorX * cuiTrans.width;
            case E_UiScrollView_Boundary.Top:
                return muiTrans.height - cuiTrans.height - this._getBottomBoundary();
            case E_UiScrollView_Boundary.Bottom:
                return muiTrans.height * muiTrans.anchorY + position.y - cuiTrans.height * cuiTrans.anchorY;
        }
    }

    /**
     * 获取与左边界的距离
     * @returns
     */
    protected _getLeftBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Left);
    }

    /**
     * 获取与右边界的距离
     * @returns
     */
    protected _getRightBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Right);
    }

    /**
     * 获取与上边界的距离
     * @returns
     */
    protected _getTopBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Top);
    }

    /**
     * 获取与下边界的距离
     * @returns
     */
    protected _getBottomBoundary() {
        return this._getBoundary(E_UiScrollView_Boundary.Bottom);
    }

    /**
     * 检查水平方向偏移
     * @param offset 移动偏移量
     */
    protected _checkHorizontalOffset(offset: Vec2 = Vec2.ZERO) {
        const position = this.contentNode.position;
        position.add3f(offset.x, 0, 0);
        let lx = this._getLeftBoundary();
        let rx = this._getRightBoundary();
        if (this._getDataOfOutSize().width) {
            lx > 0 && position.add3f(-lx, 0, 0);
            rx > 0 && position.add3f(rx, 0, 0);
        } else {
            position.add3f((rx - lx) / 2, 0, 0);
        }
        return position;
    }

    /**
     * 检查垂直方向偏移
     * @param offset 移动偏移量
     */
    protected _checkVerticalOffset(offset: Vec2 = Vec2.ZERO) {
        const position = this.contentNode.position;
        position.add3f(0, offset.y, 0);
        let ty = this._getTopBoundary();
        let by = this._getBottomBoundary();
        if (this._getDataOfOutSize().height) {
            by > 0 && position.add3f(0, -by, 0);
            ty > 0 && position.add3f(0, ty, 0);
        } else {
            position.add3f(0, ty, 0);
        }
        return position;
    }

    /**
     * 检查最终位置偏移
     */
    protected _checkFinalOffset(offset: Vec2 = Vec2.ZERO) {
        if (this.direction === E_UiScrollView_Direction.Horizontal) {
            this._checkHorizontalOffset(offset);
        } else if (this.direction === E_UiScrollView_Direction.Vertical) {
            this._checkVerticalOffset(offset);
        } else if (this.direction === E_UiScrollView_Direction.Both) {
            this._checkHorizontalOffset(offset);
            this._checkVerticalOffset(offset);
        }
    }

    /**
     * 获取内容节点尺寸超出信息
     * @returns
     */
    protected _getDataOfOutSize() {
        const cuiTrans = this.contentNode.getComponent(UITransform);
        const muiTrans = this.maskNode.getComponent(UITransform);
        return { width: cuiTrans.width > muiTrans.width, height: cuiTrans.height > muiTrans.height };
    }

    /**
     * 按照偏移量对内容节点进行移动
     * @param offset 移动偏移量
     */
    protected _moveByOffset(offset: Vec2 = Vec2.ZERO) {
        let position = this.contentNode.position;
        if (this.bouncable) {
            if (this.direction === E_UiScrollView_Direction.Horizontal) {
                position.add3f(offset.x, 0, 0);
            } else if (this.direction === E_UiScrollView_Direction.Vertical) {
                position.add3f(0, offset.y, 0);
            } else if (this.direction === E_UiScrollView_Direction.Both) {
                position.add3f(offset.x, offset.y, 0);
            }
            this._isMoved = true;
        } else {
            this._checkFinalOffset(offset);
        }
        this._onScrolling(position.x, position.y);
        this.contentNode.setPosition(position);
    }

    /**
     * 回弹校正
     */
    protected _checkBoundaryBounce() {
        if (this.bouncable && this._isMoved) {
            const before = this.contentNode.position.clone();
            this._checkFinalOffset();
            const after = this.contentNode.position.clone();
            this.contentNode.position.set(before);
            Tween.stopAllByTag(E_UiSwrollView_TweenTag.Bounce);
            tween(this.contentNode.position)
                .tag(E_UiSwrollView_TweenTag.Bounce)
                .to(this.bounceDuration, after, {
                    easing: "sineOut",
                    onStart: this._onBounceStarted.bind(this),
                    onUpdate: this._onBounceRefresh.bind(this),
                })
                .call(this._onBounceFinished.bind(this))
                .start();
        } else {
            this._isMoved = false;
            this._onScrollFinished(this.contentNode.position.x, this.contentNode.position.y);
        }
    }

    /**
     * 边界回弹开始回调
     */
    protected _onBounceStarted() {
        this._isMoved = true;
        this._isBouncing = true;
        this.node.emit(E_UiScrollView_Event.BounceStarted, this);
        // this.i("onBounceStarted", this.contentNode.position.x, this.contentNode.position.y);
    }

    /**
     * 边界回弹位置刷新
     * @param pos 内容节点当前位置
     */
    protected _onBounceRefresh(pos: Vec3) {
        this.contentNode.position = pos;
        this._onScrolling(pos.x, pos.y);
    }

    /**
     * 边界回弹完成回调
     */
    protected _onBounceFinished() {
        this._isMoved = false;
        this._isBouncing = false;
        this.node.emit(E_UiScrollView_Event.BounceFinished, this);
        this._onScrollFinished(this.contentNode.position.x, this.contentNode.position.y);
        // this.i("onBounceFinished", this.contentNode.position.x, this.contentNode.position.y);
    }

    /**
     * 滚动中回调
     * @param x 内容节点当前位置X
     * @param y 内容节点当前位置Y
     */
    protected _onScrolling(x: number, y: number) {
        this.node.emit(E_UiScrollView_Event.Scrolling, this, x, y);
        // this.i("onScrolling", x, y);
    }

    /**
     * 滚动结束回调
     * @param x 内容节点当前位置X
     * @param y 内容节点当前位置Y
     */
    protected _onScrollFinished(x: number, y: number) {
        this.node.emit(E_UiScrollView_Event.ScrollFinished, this, x, y);
        // this.i("onScrollFinished", x, y);
    }

    // REGION ENDED <protected>
}
