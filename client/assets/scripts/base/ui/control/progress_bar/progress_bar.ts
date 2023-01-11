import { Enum, Graphics, Mask, Sprite, tween, Tween, UITransform, Node, _decorator } from "cc";
import { AutomaticRangeValue } from "../../../value/automatic_number";
import { Gossip } from "../../add_ons/gossip";

const { ccclass, property } = _decorator;

/**
 * 伸展方向
 * - Forward  水平：从左到右，垂直：从下到上
 * - Backward 水平：从右到左，垂直：从上到下
 */
enum E_LineBar_Direction {
    Forward,
    Backward,
}

enum EventType {
    RangeStep = "range-step",
    RangeStart = "range-start",
    RangeEnded = "range-ended",
}

/**
 * Url      : db://assets/scripts/base/control/progress_bar.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : ProgressBar
 * Desc     : 进度条基类
 */
@ccclass("progress_bar")
export abstract class ProgressBar extends Gossip {
    @property({ displayName: "背景图", type: Sprite })
    background: Sprite = null;

    @property({ displayName: "前景图", type: Sprite })
    foreground: Sprite = null;

    @property({ displayName: "遮罩", type: Mask })
    protected mask_: Mask = null;

    @property({ displayName: "伸展方向", type: Enum(E_LineBar_Direction) })
    protected direction_ = E_LineBar_Direction.Forward;

    /**
     * 绘图组件
     */
    protected graphic_: Graphics = null;

    /**
     * 前景 UITransform 组件
     */
    protected transform_: UITransform = null;

    /**
     * 进度事件
     */
    protected static readonly EventType = Enum(EventType);

    /**
     * 当前进度
     */
    private _range: AutomaticRangeValue = new AutomaticRangeValue(0, 0, 1);

    /**
     * 前景尺寸变化事件回调
     */
    private _onSizeChanged() {
        this.mask_.getComponent(UITransform).setContentSize(this.transform_.contentSize);
        this._onRangeChanged();
    }

    protected onEnable() {
        this.foreground.node.on(Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }

    protected onDisable() {
        this.foreground.node.off(Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }

    protected onLoad() {
        this.transform_ = this.foreground.getComponent(UITransform);
        this.mask_.type = Mask.Type.GRAPHICS_STENCIL;
        this.graphic_ = this.mask_.getComponent(Graphics);
        this.graphic_.lineWidth = 0;
        this.graphic_.fillColor.fromHEX("#ffffff");
        this.graphic_.clear();
        this.range = 0;
    }

    /**
     * 进度变化回调
     */
    protected _onRangeChanged() {
        this._drawMaskStencil();

        this.node.emit(ProgressBar.EventType.RangeStep, this.range);
        if (this.range <= this._range.min) {
            this.node.emit(ProgressBar.EventType.RangeStart);
        } else if (this.range >= this._range.max) {
            this.node.emit(ProgressBar.EventType.RangeEnded);
        }
    }

    /**
     * 绘制遮罩蒙版
     */
    protected abstract _drawMaskStencil(): void;

    /**
     * 获得伸展方向
     */
    public get direction() {
        return this.direction_;
    }

    /**
     * 设置伸展方向
     */
    public set direction(v: E_LineBar_Direction) {
        this.direction_ = v;
        this._onRangeChanged();
    }

    /**
     * 是否正向增长
     */
    public get isForward() {
        return this.direction_ === E_LineBar_Direction.Forward;
    }

    /**
     * 是否逆向增长
     */
    public get isBackward() {
        return this.direction_ === E_LineBar_Direction.Backward;
    }

    /**
     * 获取当前进度
     */
    public get range() {
        return this._range.value;
    }

    /**
     * 设置当前进度
     */
    public set range(range: number) {
        this._range.value = range;
        this._onRangeChanged();
    }

    /**
     * 停止播放进度动画
     */
    public stopProgress() {
        Tween.stopAllByTarget(this._range);
    }

    /**
     * 播放进度动画
     * @param range 结束进度
     * @param delta 用时
     */
    public progressTo(range: number, delta: number) {
        const self = this;
        const before = this._range.value;
        const after = this._range.trim(range);
        const by = after - before;
        delta = Math.max(0, delta);

        this.stopProgress();

        if (delta === 0) {
            this.range = range;
            return;
        }

        tween(this._range)
            .by(
                delta,
                { value: by },
                {
                    onUpdate(_, ratio: number) {
                        self && self.isValid && (self.range = before + by * ratio);
                    },
                }
            )
            .start();
    }

    /**
     * 播放进度动画
     * @param from 开始进度
     * @param to 结束进度
     * @param delta 用时
     */
    public progressFromTo(from: number, to: number, delta: number) {
        this.range = from;
        this.progressTo(to, delta);
    }
}
