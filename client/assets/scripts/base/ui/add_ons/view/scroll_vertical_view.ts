import { _decorator, Enum, math } from "cc";
import { E_UiScrollView_Corner, E_UiScrollView_Direction, ScrollViewBase } from "./scroll_view_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/scroll_vertical_view.ts
 * Author   : reyn
 * Date     : Wed Dec 14 2022 15:37:56 GMT+0800 (中国标准时间)
 * Class    : ScrollVerticalView
 * Desc     : 垂直滚动视图
 */
@ccclass("scroll_vertical_view")
export class ScrollVerticalView extends ScrollViewBase {
    // REGION START <Member Variables>

    @property({ displayName: "滚动方向", type: Enum(E_UiScrollView_Direction), readonly: true, override: true })
    protected direction: E_UiScrollView_Direction = E_UiScrollView_Direction.Vertical;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    /**
     * 初始化
     * - 初始化时会强制将容器节点的锚点修改为 `(0.5, 1)`
     * - 此举是为了保证初始位置的准确性
     * - 建议按照默认锚点布置子节点
     */
    protected _initialize() {
        this._cui.setAnchorPoint(0.5, 1);
        this.contentNode.setPosition(0, this._mui.height * 0.5);
        super._initialize();
    }

    protected _checkIfBoundaryBounced(): boolean {
        return this._checkIfVerticalBounced();
    }

    protected _checkMoveWithBounce(offset: math.Vec2): void {
        this.contentNode.position.add3f(0, offset.y, 0);
    }

    protected _checkMoveWithNoBounce(offset: math.Vec2): void {
        this._checkVerticalOffset(offset);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 滚动到垂直百分比位置
     * @param percent 垂直百分比
     * @param duration 动画事件
     */
    public scrollToPercent(percent: number, duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToPercentInDir(E_UiScrollView_Direction.Vertical, percent, duration);
    }

    /**
     * 滚动到顶部
     * @param duration 动画时间
     */
    public scrollToTop(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.TOP, duration);
    }

    /**
     * 滚动到底部
     * @param duration 动画时间
     */
    public scrollToBottom(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.BOTTOM, duration);
    }

    /**
     * 是否已滚动到顶部
     * @returns
     */
    public isScrollToTop() {
        return this._isScrollToCorner(E_UiScrollView_Corner.TOP);
    }

    /**
     * 是否已滚动到底部
     * @returns
     */
    public isScrollToBottom() {
        return this._isScrollToCorner(E_UiScrollView_Corner.BOTTOM);
    }

    /**
     * 获取需要预加载的数量
     * @param size 预制体尺寸
     * @returns
     */
    public getPreloadCount(size: math.ISizeLike) {
        return ((this._mui.height / size.height) | 0) + 2;
    }

    // REGION ENDED <public>
}
