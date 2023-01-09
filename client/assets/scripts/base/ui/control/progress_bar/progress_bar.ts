import { Sprite, tween, Tween, _decorator } from "cc";
import { AutomaticValue } from "../../../func/automatic_value";
import { clamp } from "../../../func/numbers";
import { Gossip } from "../../add_ons/gossip";

const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/control/progress_bar.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : ProgressBar
 * Desc     : 进度条基类
 */
@ccclass("progress_bar")
export class ProgressBar extends Gossip {
    @property({ displayName: "背景图", type: Sprite })
    background: Sprite = null;

    @property({ displayName: "前景图", type: Sprite })
    foreground: Sprite = null;

    /**
     * 进度开始
     */
    public static readonly EventFillStart = "fill-start";

    /**
     * 进度变动中
     */
    public static readonly EventFillRange = "fill-range";

    /**
     * 进度结束
     */
    public static readonly EventFillEnded = "fill-ended";

    /**
     * 当前进度
     */
    private _range: AutomaticValue<number> = new AutomaticValue<number>(0);

    protected onLoad() {
        (<any>window).bar = this;
        this.range = 0;
    }

    /**
     * 进度变化回调
     * @virtual 子类需要实现变化方案
     */
    protected _onRangeChanged() {
        this.node.emit(ProgressBar.EventFillRange, this.range);
        if (this.range <= 0) {
            this.node.emit(ProgressBar.EventFillStart)
        } else if (this.range >= 1) {
            this.node.emit(ProgressBar.EventFillEnded)
        }
    }

    /**
     * 设置进度
     * @param range 进度
     */
    private _setRange(range: number) {
        this._range.value = range;
        this._onRangeChanged();
    }

    /**
     * 修正进度值
     * @param range 进度
     * @returns
     */
    public static trimRange(range: number) {
        return clamp(range, 0, 1)
    }

    /**
     * 当前进度
     */
    public get range() {
        return this._range.value
    }

    /**
     * 设置当前进度
     */
    public set range(range: number) {
        this._setRange(ProgressBar.trimRange(range));
    }

    /**
     * 播放进度动画
     * @param range 进度
     * @param delta 用时
     */
    public progressTo(range: number, delta: number) {
        const self = this;
        const before = this._range.value;
        const after = ProgressBar.trimRange(range);
        delta = Math.max(0, delta);

        Tween.stopAllByTarget(this._range);

        if (delta === 0) {
            this.range = range;
            return;
        }

        tween(this._range).to(delta, { value: after }, {
            onUpdate(_, ratio: number) {
                self && self.isValid && (self.range = before + after * ratio);
            }
        }).start();
    }
}
