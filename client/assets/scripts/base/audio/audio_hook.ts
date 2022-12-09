import { _decorator, AudioSource, AudioClip, clamp01, isValid, game, Game } from "cc";
import { Singletons } from "../singletons";
import { Gossip } from "../ui/add_ons/gossip";
import { I_AudioHandler, I_AudioInfo } from "./audio_info";
const { ccclass } = _decorator;

/**
 * 音频缓存信息
 */
type I_AudioCacheInfo = {
    audio: I_AudioInfo;
    status: number;
    timer?: string;
};

/**
 * Url      : db://assets/scripts/base/audio/audio_hook.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:58 GMT+0800 (中国标准时间)
 * Class    : AudioHook
 * Desc     : 音频播放组件
 */
@ccclass("audio_hook")
export class AudioHook extends Gossip {
    // REGION START <Member Variables>

    /**
     * 音频缓存信息映射表
     */
    private _map: Map<string, I_AudioCacheInfo> = new Map();

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onEnable() {
        game.on(Game.EVENT_HIDE, this.pause, this);
        game.on(Game.EVENT_SHOW, this.resume, this);
        this.node.on(AudioSource.EventType.STARTED, this.onAudioPlayStarted, this);
        this.node.on(AudioSource.EventType.ENDED, this.onAudioPlayFinished, this);
    }

    protected onDisable() {
        game.off(Game.EVENT_HIDE, this.pause, this);
        game.off(Game.EVENT_SHOW, this.resume, this);
        this.node.off(AudioSource.EventType.STARTED, this.onAudioPlayStarted, this);
        this.node.off(AudioSource.EventType.ENDED, this.onAudioPlayFinished, this);
    }

    /**
     * 音频开始播放回调
     * - 需要修改引擎 `engine\cocos\audio\audio-source.ts`
     * @param _ 当前组件
     * @param clipName 音频名称
     */
    protected onAudioPlayStarted(_: AudioHook, clipName: string) {
        this.i("onAudioPlayStarted", clipName);
    }

    /**
     * 音频结束播放回调
     * - 需要修改引擎 `engine\cocos\audio\audio-source.ts`
     * @param _ 当前组件
     * @param clipName 音频名称
     */
    protected onAudioPlayFinished(_: AudioHook, clipName: string) {
        this.i("onAudioPlayFinished", clipName);
    }

    /**
     * 获得音频组件
     */
    protected get source() {
        return this.setupComponent(AudioSource);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 获取音量
     */
    public get volume() {
        return this.source.volume;
    }

    /**
     * 设置音量
     */
    public set volume(v: number) {
        this.source.volume = clamp01(v);
    }

    /**
     * 播放音频
     * @param clip 音频资源
     * @param audio 音频信息
     * @param handler 音频回调
     */
    public play(clip: AudioClip, audio: I_AudioInfo, handler: I_AudioHandler) {
        Singletons.drm.addRef(clip);
        if (audio.persist && !this._map.has(Singletons.drm.getAssetUUID(clip))) {
            // 如果需要常驻内存，则其引用计数需要额外+1
            Singletons.drm.addRef(clip);
        }
        if (audio.once) {
            // 一次性播放不需要停止之前播放的音频
            this.source.playOneShot(clip);
        } else {
            // 正常的播放需要先停止之前播放的音频
            this.stop();
            // 再设置新的音频资源
            this.source.clip = clip;
            this.source.loop = audio.loop;
            this.volume = audio.volume;
            this.source.play();
        }

        // 用定时器来模拟循环次数
        const duration = clip.getDuration();
        const uuid = (<any>clip)._uuid;
        const self = this;
        const interval = 0.1;
        const ticks = audio.loop ? 0 : Math.ceil(duration / interval);
        let loops = 0;
        const timer = Singletons.timer.createTimer(
            {
                interval,
                ticks,
                onStart() {
                    if (isValid(self)) {
                        self.d(`${audio.path} 开始播放，时长: ${duration}s: `, audio_info);
                        audio_info && (audio_info.status = AudioSource.AudioState.PLAYING);
                        handler?.onStarted();
                    }
                },
                onTick(ref) {
                    if (isValid(self) && ref.current > 0) {
                        const count = (ref.elapse / duration) | 0;
                        if (count > loops) {
                            loops = count;
                            handler?.onFinishedOnce();
                            self.d(`${audio.path} 已循环${count}次`, audio_info);
                        }
                        if (!audio.loop && ref.current >= ticks) {
                            self.d(`${audio.path} 播放结束,总计${ref.elapse}s,${count} 遍`, audio_info);
                            handler?.onFinished();
                        }
                    }
                },
                onPause() {
                    self.d(`${audio.path} 已暂停`, audio_info);
                    audio_info && (audio_info.status = AudioSource.AudioState.PAUSED);
                },
                onResume() {
                    self.d(`${audio.path} 已恢复`, audio_info);
                    audio_info && (audio_info.status = AudioSource.AudioState.PLAYING);
                },
                onStop(ref) {
                    self.d(`${audio.path}已停止`, audio_info);
                    audio_info && (audio_info.status = AudioSource.AudioState.STOPPED);
                    audio_info && Singletons.timer.delTimer(audio_info.timer);
                    Singletons.drm.decRef(uuid);
                },
            },
            false
        );
        var audio_info = { audio, timer: timer, status: AudioSource.AudioState.INIT };
        self._map.set(uuid, audio_info);
        Singletons.timer.startTimer(timer);
    }

    /**
     * 暂停
     */
    public pause() {
        if (this.source.clip && this.source.state === AudioSource.AudioState.PLAYING) {
            const uuid = Singletons.drm.getAssetUUID(this.source.clip);
            const info = this._map.get(uuid);
            if (info) {
                const timer = Singletons.timer.getTimer(info.timer);
                timer && timer.pause();
            }
            this.source.pause();
        }
    }

    /**
     * 恢复
     */
    public resume() {
        if (this.source.clip && this.source.state === AudioSource.AudioState.PAUSED) {
            const uuid = Singletons.drm.getAssetUUID(this.source.clip);
            const info = this._map.get(uuid);
            if (info) {
                const timer = Singletons.timer.getTimer(info.timer);
                timer && timer.resume();
            }
            this.source.play();
        }
    }

    /**
     * 停止
     */
    public stop() {
        if (
            this.source.clip &&
            (this.source.state === AudioSource.AudioState.PAUSED ||
                this.source.state === AudioSource.AudioState.PLAYING)
        ) {
            const uuid = Singletons.drm.getAssetUUID(this.source.clip);
            const info = this._map.get(uuid);
            info.timer && Singletons.timer.delTimer(info.timer);
            this.source.stop();
            this.source.clip = null;
        }
    }

    /**
     * 卸载
     */
    public unloadAll() {
        this._map.forEach((_, k) => Singletons.drm.decRef(k));
        this._map.clear();
    }

    // REGION START <public>
}
