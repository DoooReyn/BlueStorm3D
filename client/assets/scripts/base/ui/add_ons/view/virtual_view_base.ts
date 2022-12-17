import { Vec3, Node, _decorator, EventTouch, Tween, tween, TweenEasing, UITransform } from "cc";
import { Gossip } from "../gossip";
import { getUiTransformOf } from "../ui_helper";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/virtual_view_base.ts
 * Author   : reyn
 * Date     : Tue Dec 13 2022 22:15:32 GMT+0800 (中国标准时间)
 * Class    : VirtualViewBase
 * Desc     : 虚拟滚动视图基类
 */
@ccclass("virtual_view_base")
export abstract class VirtualViewBase extends Gossip {
    // REGION START <Member Variables>

    /**
     * 默认滚动动作时间
     */
    protected static readonly SCROLL_DURATION = 0.166;

    /**
     * 默认滚动缓动曲线
     */
    protected static readonly SCROLL_EASING = "sineOut";

    /**
     * 滚动开始事件
     */
    public static readonly EVENT_SCOLL_START = "scroll-start";

    /**
     * 滚动中事件
     */
    public static readonly EVENT_SCOLLING = "scrolling";

    /**
     * 滚动结束事件
     */
    public static readonly EVENT_SCOLL_FINISH = "scroll-finish";

    /**
     * 回弹开始事件
     */
    public static readonly EVENT_BOUNCE_START = "bounce-start";

    /**
     * 回弹中事件
     */
    public static readonly EVENT_BOUNCEING = "bounce";

    /**
     * 回弹结束事件
     */
    public static readonly EVENT_BOUNCE_FINISH = "bounce-finish";

    /**
     * 子项移除事件
     */
    public static readonly EVENT_ITEM_REMOVE_FROM_VIEW = "remove-from-view";

    /**
     * 视图节点
     */
    @property({ displayName: "视图节点", type: Node })
    viewNode: Node = null;

    /**
     * 遮罩节点
     */
    @property({ displayName: "遮罩节点", type: Node })
    maskNode: Node = null;

    /**
     * 容器节点
     */
    @property({ displayName: "容器节点", type: Node })
    contentNode: Node = null;

    /**
     * 容器节点初始位置
     */
    protected _oriContentPos: Vec3 = Vec3.ZERO;

    /**
     * maskNode UITranform
     */
    protected _mui: UITransform = null;

    /**
     * contentNode UITranform
     */
    protected _cui: UITransform = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        this._mui = getUiTransformOf(this.maskNode);
        this._cui = getUiTransformOf(this.contentNode);
    }

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

    protected start() {
        this._initialize();
    }

    /**
     * 初始化
     * - 起始位置
     */
    protected _initialize() {
        this._oriContentPos = this.contentNode.position.clone();
    }

    /**
     * 触摸开始
     * @param e 触摸事件
     */
    protected abstract _onTouchStart(e: EventTouch): void;

    /**
     * 触摸移动
     * @param e 触摸事件
     */
    protected abstract _onTouchMove(e: EventTouch): void;

    /**
     * 触摸结束
     * @param e 触摸事件
     */
    protected abstract _onTouchEnded(e: EventTouch): void;

    /**
     * 触摸取消
     * @param e 触摸事件
     */
    protected abstract _onTouchCancel(e: EventTouch): void;

    /**
     * 滚动开始回调
     */
    protected _onScrollStart() {
        const { x, y } = this.contentNode.position;
        this.node.emit(VirtualViewBase.EVENT_SCOLL_START, x, y);
    }

    /**
     * 滚动中回调
     */
    protected _onScrolling() {
        const { x, y } = this.contentNode.position;
        this.node.emit(VirtualViewBase.EVENT_SCOLLING, x, y);
    }

    /**
     * 滚动结束回调
     */
    protected _onScrollFinished() {
        const { x, y } = this.contentNode.position;
        this.node.emit(VirtualViewBase.EVENT_SCOLL_FINISH, x, y);
    }

    /**
     * 滚动到指定位置
     * @param loc 指定位置
     * @param duration 动作持续时间
     * @param easing 缓动曲线
     */
    protected _scrollTo(
        loc: Vec3,
        duration: number = VirtualViewBase.SCROLL_DURATION,
        easing: TweenEasing = VirtualViewBase.SCROLL_EASING
    ): void {
        this.stopScroll();
        const current = this.contentNode.position;
        tween(current)
            .to(duration, loc, {
                easing: easing,
                onStart: this._onScrollStart.bind(this),
                onUpdate: (pos: Vec3) => {
                    this.contentNode.setPosition(pos);
                    this._onScrolling();
                },
            })
            .call(this._onScrollFinished.bind(this))
            .start();
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 滚动到指定索引的子项位置
     * @param index 指定索引的子项
     * @param duration 动画时间
     * @param easing 缓动曲线
     */
    public abstract scrollToItem(index: number, duration?: number, easing?: TweenEasing): void;

    /**
     * 停止滚动
     */
    public stopScroll() {
        Tween.stopAllByTarget(this.contentNode);
    }

    // REGION ENDED <public>
}
