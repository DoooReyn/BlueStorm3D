import { _decorator, Vec2, v2 } from "cc";
import { Gossip } from "../gossip";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/animate/animation.ts
 * Author   : reyn
 * Date     : Sat Jan 07 2023 21:39:45 GMT+0800 (中国标准时间)
 * Class    : Animation
 * Desc     : 序列帧动画配置
 */
@ccclass("animation")
export class Animation extends Gossip {
    @property({ displayName: "名称" })
    protected tag_: string = "";

    @property({ displayName: "动画索引" })
    protected range_: Vec2 = v2();

    @property({ displayName: "帧率" })
    protected time_: number = 60;

    /**
     * 标记
     */
    public get tag() {
        return this.tag_;
    }
    /**
     * 开始索引
     */
    public get from() {
        return this.range_.x;
    }
    /**
     * 结束索引
     */
    public get to() {
        return this.range_.y;
    }
    /**
     * 帧率
     */
    public get time() {
        return this.time_;
    }
    /**
     * 每帧用时
     */
    public get timeOfFrame() {
        return 1.0 / this.time_;
    }
    /**
     * 获取帧名称
     * @param index 索引
     * @returns
     */
    public getFrameName(index: number) {
        return `${this.tag}_${index | 0}`;
    }
    /**
     * 设置开始索引
     */
    public set from(from: number) {
        this.range_.x = from;
    }
    /**
     * 设置结束索引
     */
    public set to(to: number) {
        this.range_.y = to;
    }
    /**
     * 设置开始、结束索引
     */
    public set range(r: Vec2) {
        this.from = r.x;
        this.to = r.y;
    }
    /**
     * 总帧数
     */
    public get frames() {
        return this.range_.y - this.range_.x;
    }
    /**
     * 设置帧率
     */
    public set time(t: number) {
        this.time_ = t;
    }
}
