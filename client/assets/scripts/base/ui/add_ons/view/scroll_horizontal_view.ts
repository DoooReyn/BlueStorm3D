import { _decorator, Enum, math } from "cc";
import { E_UiScrollView_Corner, E_UiScrollView_Direction, ScrollViewBase } from "./scroll_view_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/scroll_horizontal_view.ts
 * Author   : reyn
 * Date     : Wed Dec 14 2022 15:37:56 GMT+0800 (中国标准时间)
 * Class    : ScrollHorizontalView
 * Desc     : 水平滚动视图
 */
@ccclass("scroll_horizontal_view")
export class ScrollHorizontalView extends ScrollViewBase {
    // REGION START <Member Variables>

    @property({ displayName: "滚动方向", type: Enum(E_UiScrollView_Direction), readonly: true, override: true })
    protected direction: E_UiScrollView_Direction = E_UiScrollView_Direction.Horizontal;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    /**
     * 初始化
     * - 初始化时会强制将容器节点的锚点修改为 `(0, 0.5)`
     * - 此举是为了保证初始位置的准确性
     * - 建议按照默认锚点布置子节点
     */
    protected _initialize() {
        this._cui.setAnchorPoint(0, 0.5);
        this.contentNode.setPosition(-this._mui.width * 0.5, 0);
        super._initialize();
    }

    protected _checkIfBoundaryBounced(): boolean {
        return this._checkIfHorizontalBounced();
    }

    protected _checkMoveWithBounce(offset: math.Vec2): void {
        this.contentNode.position.add3f(offset.x, 0, 0);
    }

    protected _checkMoveWithNoBounce(offset: math.Vec2): void {
        this._checkHorizontalOffset(offset);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 滚动到水平百分比位置
     * @param percent 水平百分比
     * @param duration 动画事件
     */
    public scrollToPercent(percent: number, duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToPercentInDir(E_UiScrollView_Direction.Horizontal, percent, duration);
    }

    /**
     * 滚动到左边
     * @param duration 动画时间
     */
    public scrollToLeft(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.LEFT, duration);
    }

    /**
     * 滚动到右边
     * @param duration 动画时间
     */
    public scrollToRight(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.RIGHT, duration);
    }

    /**
     * 是否已滚动到左边
     * @returns
     */
    public isScrollToLeft() {
        return this._isScrollToCorner(E_UiScrollView_Corner.LEFT);
    }

    /**
     * 是否已滚动到右边
     * @returns
     */
    public isScrollToRight() {
        return this._isScrollToCorner(E_UiScrollView_Corner.RIGHT);
    }

    /**
     * 获取需要预加载的数量
     * @param size 预制体尺寸
     * @returns
     */
    public getPreloadCount(size: math.ISizeLike) {
        return ((this._mui.width / size.width) | 0) + 2;
    }

    // REGION ENDED <public>
}
