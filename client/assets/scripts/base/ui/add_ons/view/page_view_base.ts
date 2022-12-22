import { _decorator, instantiate, sys, tween, Enum, EventTouch, Node, Prefab, Rect, Tween, Vec2, Vec3 } from "cc";
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
export enum E_UiPageView_TurnMode {
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
 * 边界原型
 */
export interface I_Boundary {
    left: number;
    right: number;
    top: number;
    bottom: number;
    toString(): string;
}

/**
 * 滑动方向信息
 */
export interface I_SlideDirectionInfo {
    scrollable: boolean;
    dir: E_UiPageView_Direction;
}

/**
 * 翻页视图事件
 * - PageChanged: 页码切换
 */
export enum E_UiPageView_Event {
    PageChanged = "on-page-changed",
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

    @property({ displayName: "翻页方式", type: Enum(E_UiPageView_TurnMode) })
    protected turnMode = E_UiPageView_TurnMode.Slide;

    @property({ displayName: "翻页方向", type: Enum(E_UiPageView_FromTo) })
    protected turnDir = E_UiPageView_FromTo.Horizontal;

    @property({ displayName: "页数", step: 1 })
    protected pages: number = 3;

    @property({ displayName: "滑动翻页触发距离(百分比)", range: [0, 1, 0.1] })
    protected distance: number = 0.5;

    @property({ displayName: "滑动翻页触发时间(秒)", tooltip: "超过此时间不会触发", range: [0, 1, 0.1] })
    protected duration: number = 0.1;

    @property({ displayName: "翻页动画时间(秒)" })
    protected moveTime: number = 0.3;

    @property({ displayName: "无限循环" })
    protected infinite: boolean = false;

    /**
     * 遮罩世界矩形框
     */
    protected _maskBox: Rect = null;

    /**
     * 当前页
     */
    protected _current: number = 0;

    /**
     * 时间记录点
     */
    protected _locMarks: number[] = [];

    /**
     * 移动否
     */
    protected _moved: AutomaticBooleanValue = new AutomaticBooleanValue(false);

    /**
     * 正在滑动否
     */
    protected _scrolling: AutomaticBooleanValue = new AutomaticBooleanValue(false);

    /**
     * 虚拟容器初始位置数组
     */
    private _locations: Vec3[] = null;

    /**
     * 虚拟容器数组
     */
    private _containers: ContainerPage[] = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        this._containers = [this.containerBackward, this.containerCurrent, this.containerForward];
    }

    protected onEnable() {
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

    protected start() {
        this.refreshMaskBox();
        this._syncLocations();
        this._checkContainersVisible();
    }

    protected update() {
        if (this._moved.isset() || this._scrolling.isset()) {
            this._checkContainersVisible();
        }
    }

    /**
     * 页码切换
     */
    protected _onPageChanged() {
        this.node.emit(E_UiPageView_Event.PageChanged, this._current, this);
    }

    /**
     * 同步虚拟容器位置
     */
    protected _syncLocations() {
        const locations = [];
        const { width, height } = this._maskBox;
        this._containers.forEach((v, i) => {
            const dir = i - 1;
            const x = this.isHorizontal ? width * dir : 0;
            const y = this.isVertical ? height * -dir : 0;
            v.node.setPosition(x, y);
            locations.push(new Vec3(x, y));
        });
        this._locations = locations;
    }

    /**
     * 检查容器可视
     * @param dir 滚动方向
     * @param container 容器
     * @param view 视图
     * @returns
     */
    protected _checkContainersVisible() {
        this._containers.forEach((v, i) => {
            const nextPage = this._getNextPage(i - 1);
            const isValid = this.isPageValid(nextPage);
            const visible = this.maskBox.intersects(getWorldBoundindBoxOf(v.node, this.maskNode));
            if (v.displayed !== visible) {
                isValid && visible ? this._showContainer(v, nextPage) : this._hideContainer(v, nextPage);
            }
        });
    }

    /**
     * 当前虚拟容器
     */
    protected get _currentContainer() {
        return this._containers[1];
    }

    /**
     * 获取当前虚拟容器的边界
     * @returns
     */
    protected _getBoundary(): I_Boundary {
        const box1 = getWorldBoundindBoxOf(this._currentContainer.node, this.maskNode);
        const box2 = this._maskBox;
        const boundary: I_Boundary = {
            left: box1.x - box2.x,
            right: box2.x - box1.x,
            top: box2.y - box1.y,
            bottom: box1.y - box2.y,
            toString() {
                return `left: ${this.left}, right: ${this.right}, top: ${this.top}, bottom: ${this.bottom}`;
            },
        };
        return boundary;
    }

    /**
     * 触摸开始
     * @param e 触摸事件
     */
    protected _onTouchStart(e: EventTouch) {
        if (!this.isSlideEnabled) return;
        if (e.target === this.maskNode || this._scrolling.isset()) {
            e.propagationStopped = true;
        }
        this._locMarks.length = 0;
        this._locMarks.push(sys.now());
        this._reLocateContainers();
    }

    /**
     * 触摸移动
     * @param e 触摸事件
     */
    protected _onTouchMoved(e: EventTouch) {
        if (!this.isSlideEnabled || this._scrolling.isset()) return;

        const delta = e.getDelta();
        const dir = this._getScrollDirByOffset(delta);
        const boundary = this._getBoundary();
        if (this.isHorizontal) {
            if (dir === E_UiPageView_Direction.Backward && boundary.left >= this._maskBox.width) return;
            if (dir === E_UiPageView_Direction.Forward && boundary.left <= -this._maskBox.width) return;
        } else {
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

    /**
     * 触摸结束
     * @param e 触摸事件
     */
    protected _onTouchEnded(e: EventTouch) {
        if (this.isSlideEnabled && !this._scrolling.isset() && this._moved.isset()) {
            this._locMarks.push(sys.now());
            const ret = this._getScrollDirInfo(e);
            // this.i(`${this._currentContainer.node.name} => scrollable: ${ret.scrollable}, dir: ${ret.dir}`);
            if (ret.scrollable && this.canAdvance(ret.dir)) {
                return this.advance(ret.dir);
            }
            this._checkBoundaryBounce(ret.dir);
        }
    }

    /**
     * 根据偏移量获得滑动方向
     * @param offset 偏移量
     * @returns
     */
    protected _getScrollDirByOffset(offset: Vec2) {
        const isForwards = this.isHorizontal ? offset.x < 0 : offset.y > 0;
        return isForwards ? E_UiPageView_Direction.Forward : E_UiPageView_Direction.Backward;
    }

    /**
     * 获取滑动方向信息
     * @param e 触摸事件
     * @returns
     */
    protected _getScrollDirInfo(e: EventTouch): I_SlideDirectionInfo {
        const offset = e.getUILocation().subtract(e.getUIStartLocation());
        const dir = this._getScrollDirByOffset(offset);
        const duration = this._locMarks.reduce((a, b) => b - a, 0) / 1000;
        const ret: I_SlideDirectionInfo = { scrollable: true, dir };
        if (this._locMarks.length === 2) {
            if (duration <= this.duration) return ret;
            if (this.isHorizontal && Math.abs(offset.x) >= this.maxDistance) return ret;
            if (this.isVertical && Math.abs(offset.y) >= this.maxDistance) return ret;
        }
        ret.scrollable = false;
        return ret;
    }

    /**
     * 移动偏移量
     * @param offset 偏移量
     */
    protected _moveBy(offset: Vec2) {
        const h_offset = this.isHorizontal ? offset.x : 0;
        const v_offset = this.isVertical ? offset.y : 0;
        this._containers.forEach((v) => v.node.setPosition(v.node.position.add3f(h_offset, v_offset, 0)));
    }

    /**
     * 按滑动方向滚动指定偏移量
     * @param dir 滑动方向
     * @param offset 偏移量
     */
    protected _scrollBy(dir: E_UiPageView_Direction, offset: Vec2) {
        const isBackwards = dir === E_UiPageView_Direction.Backward;
        const containers = this._containers.slice(...(isBackwards ? [0, 2] : [1, 3]));
        const duration = (this.moveTime * Math.abs(this.isHorizontal ? offset.x : offset.y)) / this.maxDistance;
        this._doScroll(containers, duration, offset);
    }

    /**
     * 获取滑动后的页码
     * @param dir 滑动方向
     * @returns
     */
    protected _getNextPage(dir: E_UiPageView_Direction) {
        const before = this._current;
        let after = before + dir;
        if (this.infinite) {
            if (after === -1) {
                after = this.pages - 1;
            } else if (after === this.pages) {
                after = 0;
            }
        }
        return after;
    }

    /**
     * 按指定方向翻页
     * @param dir 翻页方向
     */
    protected _scrollBywards(dir: E_UiPageView_Direction) {
        const isBackwards = dir === E_UiPageView_Direction.Backward;
        const boundary = this._getBoundary();
        const nextPage = this._getNextPage(dir);
        const containers = this._containers.slice(...(isBackwards ? [0, 2] : [1, 3]));
        const { width, height } = this._maskBox;
        const offset = new Vec3();
        if (this.isHorizontal) {
            offset.x = isBackwards ? width - boundary.left : boundary.right - width;
        } else {
            offset.y = isBackwards ? boundary.top - height : height - boundary.bottom;
        }
        const duration = (this.moveTime * Math.abs(this.isHorizontal ? offset.x : offset.y)) / this.maxDistance;
        const self = this;

        function onComplete() {
            if (isBackwards) {
                self._containers.unshift(self._containers.pop());
            } else {
                self._containers.push(self._containers.shift());
            }
            self._current = nextPage;
            self._onPageChanged();
            self._reLocateContainers();
        }

        this._doScroll(containers, duration, offset, onComplete);
    }

    /**
     * 虚拟容器位置排版
     */
    protected _reLocateContainers() {
        this._containers.forEach((v, i) => v.node.setPosition(this._locations[i].clone()));
    }

    /**
     * 执行滑动动作
     * @param containers 容器数组
     * @param duration 滑动事件
     * @param offset 滑动偏移量
     * @param onComplete 动画完成回调
     */
    protected _doScroll(containers: ContainerPage[], duration: number, offset: Vec2 | Vec3, onComplete?: Function) {
        const newOffset = new Vec3(offset.x, offset.y);
        const self = this;
        this._scrolling.set();

        function onFinished() {
            if (!self._scrolling.isset()) return;
            self._scrolling.unset();
            self._moved.unset();
            onComplete && onComplete();
        }

        containers.forEach((v) => {
            Tween.stopAllByTarget(v.node);
            tween(v.node.position)
                .by(duration, newOffset, {
                    easing: "sineOut",
                    onUpdate: () => v.node.setPosition(v.node.position),
                })
                .call(onFinished)
                .start();
        });
    }

    /**
     * 检查边界回弹
     * @param dir 滑动方向
     */
    protected _checkBoundaryBounce(dir: E_UiPageView_Direction) {
        let boundary = this._getBoundary();
        if (this.isHorizontal) {
            this._scrollBy(dir, new Vec2(dir === E_UiPageView_Direction.Backward ? -boundary.left : boundary.right));
        } else {
            this._scrollBy(dir, new Vec2(0, dir === E_UiPageView_Direction.Backward ? boundary.top : -boundary.bottom));
        }
    }

    /**
     * 页面进入
     * @param page 页面索引
     */
    protected _showContainer(container: ContainerPage, page: number) {
        container.node.emit(E_Container_Event.ItemShow, this, page);
    }

    /**
     * 页面退出
     * @param page 页面索引
     */
    protected _hideContainer(container: ContainerPage, page: number) {
        container.node.emit(E_Container_Event.ItemHide, this, page);
    }

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
     * 是否支持滑动式翻页
     */
    public get isSlideEnabled() {
        return this.isBothMode || this.isSlideMode;
    }

    /**
     * 是否支持触发式翻页
     */
    public get isTriggerEnabled() {
        return this.isBothMode || this.isTriggerMode;
    }

    /**
     * 是否滑动式
     */
    public get isSlideMode() {
        return this.turnMode === E_UiPageView_TurnMode.Slide;
    }

    /**
     * 是否触发式
     */
    public get isTriggerMode() {
        return this.turnMode === E_UiPageView_TurnMode.Trigger;
    }

    /**
     * 是否双轨式
     */
    public get isBothMode() {
        return this.turnMode === E_UiPageView_TurnMode.Both;
    }

    /**
     * 指定页面索引是否有效
     * @param page 页面索引
     * @returns
     */
    public isPageValid(page: number) {
        page = page | 0;
        return page >= 0 && page < this.pageSize;
    }

    /**
     * 按指定翻页方向是否可以成功翻页
     * @param dir 翻页方向
     * @returns
     */
    public canAdvance(dir: E_UiPageView_Direction) {
        const before = this._current;
        const after = this._getNextPage(dir);
        return before !== after && (this.infinite || (!this.infinite && this.isPageValid(after)));
    }

    /**
     * 按指定方向翻页
     * @param dir 翻页方向
     */
    public advance(dir: E_UiPageView_Direction) {
        if (this._scrolling.isset()) return;
        const yes = this.canAdvance(dir);
        yes && this._scrollBywards(dir);
        return yes;
    }

    /**
     * 直接翻到上一页
     * - 保留动画
     */
    public backwards() {
        this.advance(E_UiPageView_Direction.Backward);
    }

    /**
     * 直接翻到下一页
     * - 保留动画
     */
    public forwards() {
        this.advance(E_UiPageView_Direction.Forward);
    }

    /**
     * 直接翻到指定页
     * - 无动画
     * @param page 指定页索引
     */
    public turnTo(page: number) {
        page = page | 0;
        if (this.isPageValid(page) && this._current !== page) {
            this._showContainer(this._currentContainer, page);
            this._current = page;
            this._onPageChanged();
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

    /**
     * 触发翻页的最大滑动距离
     */
    public get maxDistance() {
        return (this.isHorizontal ? this._maskBox.width : this._maskBox.height) * this.distance;
    }

    /**
     * 创建页面
     * @returns
     */
    public createPage() {
        return instantiate(this.template);
    }

    /**
     * 设置页数
     * @param pages 页数
     * @returns
     */
    public set pageSize(pages: number) {
        pages = Math.max(0, pages | 0);
        if (pages === this.pages) return;

        const before = this.pages;
        this.pages = pages;
        if (pages === 0) {
            this._hideContainer(this._currentContainer, -1);
            this._current = -1;
        } else {
            if (before === 0) {
                this.turnTo(0);
            } else if (pages < this._current + 1) {
                this.turnTo(pages - 1);
            }
        }
    }

    /**
     * 获取页数
     */
    public get pageSize() {
        return this.pages;
    }

    /**
     * 增加/减少页数
     * @param offset 页数，正数为增加、负数为减少，默认增加一页
     */
    public addPage(offset: number = 1) {
        const before = this.pageSize;
        this.pageSize = before + (offset | 0);
    }

    // REGION ENDED <public>
}
