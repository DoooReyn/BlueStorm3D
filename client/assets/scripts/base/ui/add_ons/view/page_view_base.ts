import { _decorator, Enum, Node, Rect, EventTouch, Tween, Vec2, sys, CCInteger, Prefab, rect, tween, Vec3 } from "cc";
import { AutomaticBooleanValue } from "../../../func/automatic_value";
import { getWorldBoundindBoxOf } from "../ui_helper";
import { Gossip } from "../gossip";
import { ContainerPage } from "./container_page";
import { E_Container_Event } from "./container_base";
const { ccclass, property } = _decorator;

/**
 * 翻页方式
 * - Slide: 滑动式
 * - Trigger: 触发式，如按钮点击
 * - Both: 双轨式，即滑动式+触发式
 */
export enum E_UiPageView_TurnType {
    Slide,
    Trigger,
    Both,
}

/**
 * 翻页虚拟方向
 * - Backward: 上一页
 * - Forward: 下一页
 */
export enum E_UiPageView_Direction {
    Backward = -1,
    Forward = 1,
}

/**
 * 翻页真实方向
 * - Horizontal: 左右翻页
 * - Vertical: 上下翻页
 */
export enum E_UiPageView_FromTo {
    Horizontal,
    Vertical,
}

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/page_view_base.ts
 * Author   : reyn
 * Date     : Tue Dec 20 2022 18:34:23 GMT+0800 (中国标准时间)
 * Class    : PageViewBase
 * Desc     : 翻页视图基类
 */
@ccclass("page_view_base")
export class PageViewBase extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "页面模板", type: Prefab })
    protected template: Prefab = null;

    @property({ displayName: "遮罩节点", type: Node })
    public maskNode: Node = null;

    @property({ displayName: "内容节点", type: Node })
    public contentNode: Node = null;

    @property({ displayName: "占位容器-上一页", type: ContainerPage })
    protected containerBackward: ContainerPage = null;

    @property({ displayName: "占位容器-当前页", type: ContainerPage })
    protected containerCurrent: ContainerPage = null;

    @property({ displayName: "占位容器-下一页", type: ContainerPage })
    protected containerForward: ContainerPage = null;

    @property({ displayName: "翻页方式", type: Enum(E_UiPageView_TurnType) })
    protected turnType = E_UiPageView_TurnType.Slide;

    @property({ displayName: "翻页方向", type: Enum(E_UiPageView_FromTo) })
    protected turnDir = E_UiPageView_FromTo.Horizontal;

    @property({ displayName: "页数", step: 1, type: CCInteger })
    protected pages: number = 3;

    @property({ displayName: "滑动翻页触发距离(百分比)", range: [0, 1, 0.1] })
    protected distance: number = 0.5;

    @property({ displayName: "滑动翻页触发时间(秒)", tooltip: "超过此时间不会触发", range: [0, 1, 0.1] })
    protected duration: number = 0.1;

    @property({ displayName: "翻页动画时间(秒)" })
    protected moveTime: number = 0.3;

    @property({ displayName: "无限循环" })
    protected infinite: boolean = false;

    protected _maskBox: Rect = null;
    protected _viewDirty: AutomaticBooleanValue = new AutomaticBooleanValue(false);

    /**
     * 当前页
     */
    protected _current: number = -1;
    protected _locMarks: number[] = [];
    protected _moved: AutomaticBooleanValue = new AutomaticBooleanValue(false);
    protected _scrolling: AutomaticBooleanValue = new AutomaticBooleanValue(false);
    private _locations: Vec3[] = null;
    private _containers: ContainerPage[] = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        this._locations = [this.containerBackward, this.containerCurrent, this.containerForward].map((v) =>
            v.node.position.clone()
        );
        this._containers = [this.containerBackward, this.containerCurrent, this.containerForward];
    }

    protected onEnable() {
        this.refreshMaskBox();
        this.maskNode.on(Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.maskNode.on(Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.maskNode.on(Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.maskNode.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnded, this, true);
    }

    protected onDisable() {
        this.maskNode.off(Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.maskNode.off(Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.maskNode.off(Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.maskNode.off(Node.EventType.TOUCH_CANCEL, this._onTouchEnded, this, true);
    }

    protected _checkContainerVisible(dir: E_UiPageView_Direction, container: ContainerPage, view: PageViewBase) {
        const page = dir === E_UiPageView_Direction.Backward ? view.current - 1 : view.current + 1;
        const valid = view.isPageValid(page);
        if (!valid) return;

        let visible = view.maskBox.intersects(getWorldBoundindBoxOf(container.node, view.maskNode));
        if (container.displayed !== visible) {
            const event = visible ? E_Container_Event.ItemShow : E_Container_Event.ItemHide;
            container.node.emit(event, view, view.current);
        }
    }

    protected _getBoundary() {
        const container = this._containers[1];
        const box1 = getWorldBoundindBoxOf(container.node, this.maskNode);
        const box2 = this._maskBox;
        const ret = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            toString() {
                return `left: ${this.left}, right: ${this.right}, top: ${this.top}, bottom: ${this.bottom}`;
            },
        };
        ret.left = box1.x - box2.x;
        ret.right = -ret.left;
        ret.bottom = box1.y - box2.y;
        ret.top = -ret.bottom;
        return ret;
    }

    protected _clearLocMarks() {
        this._locMarks.length = 0;
    }

    protected _addLocMark() {
        this._locMarks.push(sys.now());
    }

    protected _onTouchStart(e: EventTouch) {
        this.stopScroll();

        if (e.target === this.maskNode || this._scrolling.isset()) {
            e.propagationStopped = true;
        }

        this._clearLocMarks();
        this._addLocMark();
        this._containers.forEach((v, i) => v.node.setPosition(this._locations[i].clone()));
        // this.i(this._containers.map((v) => v.node.position.toString()));
    }

    protected _onTouchMoved(e: EventTouch) {
        if (this._scrolling.isset()) return;

        const delta = e.getDelta();
        const dir = this._getScrollDirByOffset(delta);
        const boundary = this._getBoundary();
        if (this.isHorizontal) {
            if (dir === E_UiPageView_Direction.Backward && boundary.left >= this._maskBox.width) return;
            if (dir === E_UiPageView_Direction.Forward && boundary.left <= -this._maskBox.width) return;
        }
        if (this.isVertical) {
            if (dir === E_UiPageView_Direction.Backward && boundary.bottom >= this._maskBox.height) return;
            if (dir === E_UiPageView_Direction.Forward && boundary.bottom <= -this._maskBox.height) return;
        }

        const moved = !delta.equals(Vec2.ZERO);
        if (moved) {
            this._moved.set();
            if (e.target !== this.maskNode) {
                // 防止响应其他触摸节点
                e.target.emit(Node.EventType.TOUCH_CANCEL, e);
            }
            // 手动移动
            this._moveBy(delta);
        }
    }

    protected _onTouchEnded(e: EventTouch) {
        if (!this._scrolling.isset() && this._moved.isset()) {
            this._addLocMark();
            const ret = this._getScrollDirInfo(e);
            this.i(`scrollable: ${ret.scrollable}, dir: ${ret.dir}, ${this._containers[1].node.name}`);
            ret.scrollable ? this._scrollBywards(ret.dir) : this._checkBoundary(ret.dir);
        }
    }

    protected _getScrollDirByOffset(offset: Vec2) {
        return this.isHorizontal
            ? offset.x < 0
                ? E_UiPageView_Direction.Forward
                : E_UiPageView_Direction.Backward
            : offset.y < 0
            ? E_UiPageView_Direction.Backward
            : E_UiPageView_Direction.Forward;
    }

    protected _getScrollDirInfo(e: EventTouch): { scrollable: boolean; dir: E_UiPageView_Direction } {
        const offset = e.getUILocation().subtract(e.getUIStartLocation());
        const dir = this._getScrollDirByOffset(offset);
        const duration = this._locMarks.reduce((a, b) => b - a, 0) / 1000;
        const ret = { scrollable: true, dir };
        if (this._locMarks.length === 2) {
            if (duration <= this.duration) return ret;
            if (this.isHorizontal && Math.abs(offset.x) >= this.maxDistance) return ret;
            if (this.isVertical && Math.abs(offset.y) >= this.maxDistance) return ret;
        }
        ret.scrollable = false;
        return ret;
    }

    protected _moveBy(offset: Vec2) {
        const h_offset = this.isHorizontal ? offset.x : 0;
        const v_offset = this.isVertical ? offset.y : 0;
        this.contentNode.children.forEach((v) => v.setPosition(v.position.add3f(h_offset, v_offset, 0)));
    }

    protected _scrollBy(dir: E_UiPageView_Direction, offset: Vec2) {
        const containers =
            dir === E_UiPageView_Direction.Backward ? this._containers.slice(0, 2) : this._containers.slice(1, 3);
        this._scrolling.set();
        containers.forEach((v) => {
            Tween.stopAllByTarget(v.node);
            const duration = (this.moveTime * Math.abs(this.isHorizontal ? offset.x : offset.y)) / this.maxDistance;
            tween(v.node.position)
                .by(duration, new Vec3(offset.x, offset.y, 0), {
                    easing: "sineOut",
                    onUpdate: () => {
                        v.node.setPosition(v.node.position);
                    },
                    onComplete: () => {
                        if (!this._scrolling.isset()) return;
                        this._scrolling.unset();
                        this._moved.unset();
                    },
                })
                .start();
        });
    }

    /**
     * 按指定方向翻页
     * @param dir 翻页方向
     */
    protected _scrollBywards(dir: E_UiPageView_Direction) {
        let page = 0;
        if (dir === E_UiPageView_Direction.Backward) {
            page = this._current - 1;
        } else {
            page = this._current + 1;
        }

        let boundary = this._getBoundary();
        const offset = new Vec3();
        if (this.isHorizontal) {
            offset.x =
                dir === E_UiPageView_Direction.Backward
                    ? this._maskBox.width - boundary.left
                    : boundary.right - this._maskBox.width;
        } else {
            offset.y =
                this._maskBox.height - (dir === E_UiPageView_Direction.Backward ? boundary.top : -boundary.bottom);
        }

        this._scrolling.set();

        let onComplete = () => {
            if (!this._scrolling.isset()) return;
            this._scrolling.unset();
            this._moved.unset();
            if (dir === E_UiPageView_Direction.Backward) {
                this._containers.unshift(this._containers.pop());
            } else {
                this._containers.push(this._containers.shift());
            }
            this._containers.forEach((v, i) => v.node.setPosition(this._locations[i].clone()));
            this._current = page;
            this.i(this._containers.map((v) => `${v.node.name}, ${v.node.position.toString()}`));
        };

        const containers =
            dir === E_UiPageView_Direction.Backward ? this._containers.slice(0, 2) : this._containers.slice(1, 3);

        containers.forEach((v) => {
            Tween.stopAllByTarget(v.node);
            const duration = (this.moveTime * Math.abs(this.isHorizontal ? offset.x : offset.y)) / this.maxDistance;
            tween(v.node.position)
                .by(duration, new Vec3(offset.x, offset.y, 0), {
                    easing: "sineOut",
                    onUpdate: () => {
                        // if (!this._scrolling.isset()) return;
                        v.node.setPosition(v.node.position);
                    },
                })
                .call(onComplete)
                .start();
        });
    }

    protected _checkBoundary(dir: E_UiPageView_Direction) {
        let boundary = this._getBoundary();
        if (this.isHorizontal) {
            this._scrollBy(dir, new Vec2(dir === E_UiPageView_Direction.Backward ? -boundary.left : boundary.right));
        } else {
            this._scrollBy(dir, new Vec2(0, dir === E_UiPageView_Direction.Backward ? -boundary.top : boundary.bottom));
        }
    }

    /**
     * 页面进入
     * @param page 页面索引
     */
    protected _onPageEnter(page: number) {}

    /**
     * 页面退出
     * @param page 页面索引
     */
    protected _onPageExit(page: number) {}

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 是否左右翻页
     * @returns
     */
    public get isHorizontal() {
        return this.turnDir === E_UiPageView_FromTo.Horizontal;
    }

    /**
     * 是否上下翻页
     * @returns
     */
    public get isVertical() {
        return this.turnDir === E_UiPageView_FromTo.Vertical;
    }

    /**
     * 停止滚动
     */
    public stopScroll() {
        Tween.stopAllByTarget(this.contentNode);
    }

    /**
     * 是否滑动式
     */
    public get isSlide() {
        return this.turnType === E_UiPageView_TurnType.Slide;
    }

    /**
     * 是否触发式
     */
    public get isTrigger() {
        return this.turnType === E_UiPageView_TurnType.Trigger;
    }

    /**
     * 是否双轨式
     */
    public get isBoth() {
        return this.turnType === E_UiPageView_TurnType.Both;
    }

    /**
     * 指定页面索引是否有效
     * @param page 页面索引
     * @returns
     */
    public isPageValid(page: number) {
        page = page | 0;
        return page >= 0 && page < this.total;
    }

    /**
     * 直接翻到上一页
     * - 保留动画
     */
    public backwards() {
        if (this.isPageValid(this._current - 1)) {
            this._scrollBywards(E_UiPageView_Direction.Backward);
        }
    }

    /**
     * 直接翻到下一页
     * - 保留动画
     */
    public forwards() {
        if (this.isPageValid(this._current - 1)) {
            this._scrollBywards(E_UiPageView_Direction.Forward);
        }
    }

    /**
     * 直接翻到指定页
     * - 无动画
     * @param page 指定页索引
     */
    public turnTo(page: number) {
        page = page | 0;
        if (page >= 0 && page < this.total && this._current !== page) {
            this._onPageEnter(page);
            this._current = page;
        }
    }

    /**
     * 刷新遮罩世界边界矩形框
     */
    public refreshMaskBox() {
        this._maskBox = getWorldBoundindBoxOf(this.maskNode, this.maskNode);
    }

    /**
     * 获取当前页索引
     */
    public get current() {
        return this._current;
    }

    /**
     * 获取页面总数
     */
    public get total() {
        return this.pages;
    }

    /**
     * 遮罩矩形框
     */
    public get maskBox() {
        const box = this._maskBox.clone();
        box.width -= 2;
        box.height -= 2;
        box.x += 1;
        box.y -= 1;
        return box;
    }

    public get maxDistance() {
        return (this.isHorizontal ? this._maskBox.width : this._maskBox.height) * this.distance;
    }

    // REGION ENDED <public>
}
