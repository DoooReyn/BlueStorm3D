import { _decorator, SpriteAtlas, Sprite, tween, Tween } from "cc";
import { Gossip } from "../gossip";
import { Animation } from "./animation";
const { ccclass, property, requireComponent } = _decorator;

/**
 * Url      : db://assets/scripts/base/animate/sheet.ts
 * Author   : reyn
 * Date     : Sat Jan 07 2023 21:39:45 GMT+0800 (中国标准时间)
 * Class    : Sheet
 * Desc     : 序列帧动画
 */
@ccclass("sheet")
@requireComponent(Sprite)
export class Sheet extends Gossip {
    // REGION START <Member Variables>
    @property({ displayName: "动画主体", type: Sprite, visible: false })
    body: Sprite = null;

    @property({ displayName: "序列帧", type: SpriteAtlas })
    atlas: SpriteAtlas = null;

    /**
     * 动画配置
     */
    private _animations: Map<string, Animation> = new Map();

    /**
     * 当前动画
     */
    private _current: string = "";

    /**
     * 动画是否播放中
     */
    private _playing: boolean = false;

    /**
     * 动画事件——播放
     */
    public static readonly EventPlay = "play";

    /**
     * 动画事件——停止
     */
    public static readonly EventStop = "stop";

    /**
     * 动画事件——暂停
     */
    public static readonly EventPause = "pause";

    /**
     * 动画事件——恢复
     */
    public static readonly EventResume = "resume";

    /**
     * 动画事件——切帧
     */
    public static readonly EventStep = "step";

    /**
     * 动画事件——循环一次
     */
    public static readonly EventLoopOnce = "loop-once";

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        this.body = this.getComponent(Sprite);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 添加动画
     * @param ani 动画
     */
    public addAnimation(ani: Animation) {
        if (!this._animations.has(ani.tag)) {
            this._animations.set(ani.tag, ani);
        }
    }

    /**
     * 删除动画
     * @param aniOrTag 动画或名称
     */
    public removeAnimation(aniOrTag: string | Animation) {
        const tag = aniOrTag instanceof Animation ? aniOrTag.tag : aniOrTag;
        if (this._animations.has(tag)) {
            this._animations.delete(tag);
        }
    }

    /**
     * 获取动画
     * @param tag 动画名称
     * @returns
     */
    public getAnimation(tag: string) {
        return this._animations.get(tag);
    }

    /**
     * 动画是否正在播放
     */
    public get playing() {
        return this._playing;
    }

    /**
     * 获取当前动画名称
     */
    public get current() {
        return this._current;
    }

    /**
     * 播放动画
     * @param tag 动画名称
     * @param loop 是否循环
     * @param reverse 是否倒叙
     * @returns
     */
    public play(tag: string, loop: boolean = true, reverse: boolean = false) {
        if (!this.atlas) return;
        if (!this._animations.has(tag)) return;
        this.stop();
        this._current = tag;
        let frames = [];
        let animation = this._animations.get(tag);
        for (let i = animation.from; i < animation.to; i++) {
            let frame = this.atlas.getSpriteFrame(animation.getFrameName(i));
            frame && frames.push(frame);
        }
        reverse && frames.reverse();
        this._playing = true;
        this.node.emit(Sheet.EventPlay, this._current);
        const self = this;
        let current = 0;
        let next = -1;
        function nextFrame() {
            if (self && self.playing) {
                next = current + 1;
                if (next === animation.frames) {
                    this.node.emit(Sheet.EventLoopOnce, animation.tag);
                    if (loop) {
                        current = 0;
                    } else {
                        self.stop();
                        return;
                    }
                } else {
                    current = next;
                }
                self.body.spriteFrame = frames[current];
                self.node.emit(Sheet.EventStep, animation.tag, current);
            }
        }
        const act = tween(this.node).call(nextFrame.bind(this)).delay(animation.timeOfFrame);
        return tween(this.node).repeatForever(act).start();
    }

    /**
     * 停止播放
     */
    public stop() {
        if (this._playing) {
            this.node.emit(Sheet.EventStop, this._current);
            Tween.stopAllByTarget(this.node);
            this._playing = false;
            this._current = "";
        }
    }

    /**
     * 暂停播放
     */
    public pause() {
        if (this.playing) {
            this._playing = false;
            this.node.emit(Sheet.EventPause, this._current);
        }
    }

    /**
     * 恢复播放
     */
    public resume() {
        if (this.current && !this.playing) {
            this._playing = true;
        }
    }

    /**
     * 切帧
     */
    public setIndex(index: number) {
        if (!this.current) return;
        const animation = this._animations.get(this.current);
        if (animation) {
            this.stop();
            const step = index + animation.from;
            const frame = animation.getFrameName(step);
            if (frame) {
                this.body.spriteFrame = this.atlas.getSpriteFrame(frame);
                this.node.emit(Sheet.EventStep, this._current, step);
            }
        }
    }

    // REGION ENDED <public>
}
