import { _decorator, Enum, Vec2 } from "cc";
import { E_UiScrollView_Corner, E_UiScrollView_Direction, ScrollViewBase } from "./scroll_view_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/scroll_both_view.ts
 * Author   : reyn
 * Date     : Sat Dec 10 2022 10:06:32 GMT+0800 (中国标准时间)
 * Class    : ScrollView
 * Desc     : 双向滚动视图
 */
@ccclass("scroll_both_view")
export class ScrollBothView extends ScrollViewBase {
    // REGION START <Member Variables>

    @property({ displayName: "滚动方向", type: Enum(E_UiScrollView_Direction), readonly: true, override: true })
    protected direction: E_UiScrollView_Direction = E_UiScrollView_Direction.Both;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    /**
     * 初始化
     * - 初始化时会强制将容器节点的锚点修改为 `(0, 1)`
     * - 此举是为了保证初始位置的准确性
     * - 建议按照默认锚点布置子节点
     */
    protected _initialize() {
        this._cui.setAnchorPoint(0, 1);
        this.contentNode.position.set(-this._mui.width * 0.5, this._mui.height * 0.5, 0);
        super._initialize();
        // 将节点居中显示
        this.scrollToCenter();
    }

    protected _checkIfBoundaryBounced(): boolean {
        return this._checkIfHorizontalBounced() || this._checkIfVerticalBounced();
    }

    protected _checkMoveWithBounce(offset: Vec2): void {
        this.contentNode.position.add3f(offset.x, offset.y, 0);
    }

    protected _checkMoveWithNoBounce(offset: Vec2): void {
        this._checkHorizontalOffset(offset);
        this._checkVerticalOffset(offset);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 滚动到左上角
     * @param duration 动画时间
     */
    public scrollToTopLeft(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.TOP_LEFT, duration);
    }

    /**
     * 滚动到右上角
     * @param duration 动画时间
     */
    public scrollToTopRight(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.TOP_RIGHT, duration);
    }

    /**
     * 滚动到左下角
     * @param duration 动画时间
     */
    public scrollToBottomLeft(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.BOTTOM_LEFT, duration);
    }

    /**
     * 滚动到右下角
     * @param duration 动画时间
     */
    public scrollToBottomRight(duration: number = ScrollViewBase.SCROLL_DURATION) {
        this._scrollToCorner(E_UiScrollView_Corner.BOTTOM_RIGHT, duration);
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
     * 滚动到中间
     * @param duration 动画时间
     */
    public scrollToCenter(duration: number = ScrollViewBase.SCROLL_DURATION) {
        let px = ((this._cui.width - this._mui.width) * 0.5) / this._cui.width;
        let py = ((this._cui.height - this._mui.height) * 0.5) / this._cui.height;
        this._scrollToPercent(px, py, duration);
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
     * 是否已滚动到左上角
     * @returns
     */
    public isScrollToTopLeft() {
        return this._isScrollToCorner(E_UiScrollView_Corner.TOP_LEFT);
    }

    /**
     * 是否已滚动到右上角
     * @returns
     */
    public isScrollToTopRight() {
        return this._isScrollToCorner(E_UiScrollView_Corner.TOP_RIGHT);
    }

    /**
     * 是否已滚动到左下角
     * @returns
     */
    public isScrollToBottomLeft() {
        return this._isScrollToCorner(E_UiScrollView_Corner.BOTTOM_LEFT);
    }

    /**
     * 是否已滚动到右下角
     * @returns
     */
    public isScrollToBottomRight() {
        return this._isScrollToCorner(E_UiScrollView_Corner.BOTTOM_RIGHT);
    }

    // REGION ENDED <public>
}
