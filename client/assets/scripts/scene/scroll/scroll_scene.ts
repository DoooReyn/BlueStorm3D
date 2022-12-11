import { _decorator, Node, EventTouch, Vec2, Enum, UITransform, Vec3, tween, Tween } from "cc";
import { Gossip } from "../../base/ui/add_ons/gossip";
const { ccclass, property } = _decorator;

enum E_ViewMoveDirection {
    Horizontal,
    Vertical,
    Both,
}

enum E_BoundaryAt {
    Left,
    Right,
    Top,
    Bottom,
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

    @property({ displayName: "滚动方向", type: Enum(E_ViewMoveDirection) })
    direction: E_ViewMoveDirection = E_ViewMoveDirection.Vertical;

    @property({ displayName: "允许边界回弹" })
    bouncable: boolean = true;

    @property({ displayName: "边界回弹时响应触摸事件" })
    movableWhenBounce: boolean = true;

    @property({ displayName: "边界回弹时间", tooltip: "不建议设置太大的值", min: 0 })
    bounceDuration: number = 0.2;

    private _isBouncing: boolean = false;
    private _isMoved: boolean = false;

    // REGION ENDED <Member Variables>

    // REGION START <protected>
    protected onEnable() {
        this.maskNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this, true);
        this.maskNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
        this.maskNode.on(Node.EventType.TOUCH_END, this.onTouchEnded, this, true);
        this.maskNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this, true);
    }

    /**
     * 触摸开始
     * - 如果目标节点是遮罩节点，应该阻止事件继续传递
     * @param e 触摸事件
     */
    protected onTouchStart(e: EventTouch) {
        if (e.target === this.maskNode || (this._isBouncing && !this.movableWhenBounce)) {
            e.propagationStopped = true;
        }
    }

    /**
     * 触摸移动
     * - 移动时判定移动距离是否不等于0，且目标节点如果不是遮罩节点，那么应该给目标节点发送 `TOUCH_CANCEL` 事件
     * - 同时阻止事件继续传递，这样就可以过滤掉目标节点上的触摸事件，专注于遮罩节点
     * - 即实现移动时不响应子节点的触摸事件
     * @param e 触摸事件
     */
    protected onTouchMove(e: EventTouch) {
        if (this._isBouncing && !this.movableWhenBounce) {
            e.propagationStopped = true;
            return;
        }
        const isMove = !e.getDelta().equals(Vec2.ZERO);
        if (isMove) {
            Tween.stopAllByTarget(this.contentNode.position);
            this._isMoved = true;
            if (e.target !== this.maskNode) {
                e.target.emit(Node.EventType.TOUCH_CANCEL, e);
            }
            this.moveOffset(e.getDelta().divide2f(2.0, 2.0));
        }
    }

    /**
     * 触摸结束
     * - 如果目标节点是遮罩节点，应该阻止事件继续传递
     * @param e 触摸事件
     */
    protected onTouchEnded(e: EventTouch) {
        if (this._isBouncing && !this.movableWhenBounce) {
            e.propagationStopped = true;
            return;
        }
        this.checkBoundaryBounce();
    }

    /**
     * 触摸取消
     * - 如果目标节点是遮罩节点，应该阻止事件继续传递
     * @param e 触摸事件
     */
    protected onTouchCancel(e: EventTouch) {
        if (this._isBouncing && !this.movableWhenBounce) {
            e.propagationStopped = true;
            return;
        }
        this.checkBoundaryBounce();
    }

    /**
     * 按钮点击事件
     * @param e 触摸事件
     */
    protected onBtnClicked(e: EventTouch) {
        this.i(e.target.parent.name);
    }

    /**
     * 获取与边界的距离
     * - 正数意味着在边界内
     * - 负数意味着超出边界
     * - 通常,不应该让边界距离为正数
     * @param boundary 边界位置
     * @returns
     */
    protected getBoundary(boundary: E_BoundaryAt) {
        const position = this.contentNode.position;
        const cuiTrans = this.contentNode.getComponent(UITransform);
        const muiTrans = this.maskNode.getComponent(UITransform);
        switch (boundary) {
            case E_BoundaryAt.Left:
                return muiTrans.width * muiTrans.anchorX + position.x - cuiTrans.anchorX * cuiTrans.width;
            case E_BoundaryAt.Right:
                return muiTrans.width * muiTrans.anchorX - position.x - cuiTrans.anchorX * cuiTrans.width;
            case E_BoundaryAt.Top:
                return muiTrans.height - cuiTrans.height - this.getBottomBoundary();
            case E_BoundaryAt.Bottom:
                return muiTrans.height * muiTrans.anchorY + position.y - cuiTrans.height * cuiTrans.anchorY;
        }
    }

    /**
     * 获取与左边界的距离
     * @returns
     */
    protected getLeftBoundary() {
        return this.getBoundary(E_BoundaryAt.Left);
    }

    /**
     * 获取与右边界的距离
     * @returns
     */
    protected getRightBoundary() {
        return this.getBoundary(E_BoundaryAt.Right);
    }

    /**
     * 获取与上边界的距离
     * @returns
     */
    protected getTopBoundary() {
        return this.getBoundary(E_BoundaryAt.Top);
    }

    /**
     * 获取与下边界的距离
     * @returns
     */
    protected getBottomBoundary() {
        return this.getBoundary(E_BoundaryAt.Bottom);
    }

    /**
     * 检查水平方向偏移
     * @param offset 移动偏移量
     */
    protected checkHorizontal(offset: Vec2 = Vec2.ZERO) {
        const position = this.contentNode.position;
        position.add3f(offset.x, 0, 0);
        let lx = this.getLeftBoundary();
        let rx = this.getRightBoundary();
        if (this.getIfContentOutOfMask().width) {
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
    protected checkVertical(offset: Vec2 = Vec2.ZERO) {
        const position = this.contentNode.position;
        position.add3f(0, offset.y, 0);
        let ty = this.getTopBoundary();
        let by = this.getBottomBoundary();
        if (this.getIfContentOutOfMask().height) {
            by > 0 && position.add3f(0, -by, 0);
            ty > 0 && position.add3f(0, ty, 0);
        } else {
            position.add3f(0, ty, 0);
        }
        return position;
    }

    /**
     * 内容节点尺寸是否超出了遮罩节点
     * @returns
     */
    protected getIfContentOutOfMask() {
        const cuiTrans = this.contentNode.getComponent(UITransform);
        const muiTrans = this.maskNode.getComponent(UITransform);
        return { width: cuiTrans.width > muiTrans.width, height: cuiTrans.height > muiTrans.height };
    }

    /**
     * 获取纠正过的位置
     */
    protected getCorrectedPosition(offset: Vec2 = Vec2.ZERO) {
        if (this.direction === E_ViewMoveDirection.Horizontal) {
            this.checkHorizontal(offset);
        } else if (this.direction === E_ViewMoveDirection.Vertical) {
            this.checkVertical(offset);
        } else if (this.direction === E_ViewMoveDirection.Both) {
            this.checkHorizontal(offset);
            this.checkVertical(offset);
        }
    }

    /**
     * 按照偏移量对内容节点进行移动
     * @param offset 移动偏移量
     */
    protected moveOffset(offset: Vec2 = Vec2.ZERO) {
        let position = this.contentNode.position;
        // this.i("offset:", offset.x, offset.y);
        // this.i("before:", position.x, position.y);
        if (this.bouncable) {
            if (this.direction === E_ViewMoveDirection.Horizontal) {
                position.add3f(offset.x, 0, 0);
            } else if (this.direction === E_ViewMoveDirection.Vertical) {
                position.add3f(0, offset.y, 0);
            } else if (this.direction === E_ViewMoveDirection.Both) {
                position.add3f(offset.x, offset.y, 0);
            }
        } else {
            this.getCorrectedPosition(offset);
        }
        // this.i("after:", position.x, position.y);
        this.contentNode.setPosition(position);
    }

    /**
     * 回弹校正
     */
    protected checkBoundaryBounce() {
        if (this.bouncable && this._isMoved) {
            const current = this.contentNode.position.clone();
            this.getCorrectedPosition();
            const correct = this.contentNode.position.clone();
            this.contentNode.position.set(current);
            tween(this.contentNode.position)
                .to(this.bounceDuration, correct, {
                    easing: "sineOut",
                    onStart: () => (this._isBouncing = true),
                    onUpdate: (target: Vec3) => (this.contentNode.position = target),
                })
                .call(() => {
                    this._isMoved = false;
                    this._isBouncing = false;
                })
                .start();
        } else {
            this._isMoved = false;
        }
    }

    // REGION ENDED <protected>

    // REGION START <public>

    // REGION ENDED <public>
}
