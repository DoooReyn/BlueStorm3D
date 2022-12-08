import { _decorator, Node, director, AudioClip, clamp01 } from "cc";
import { Singletons } from "../singletons";
import SingletonBase from "../singleton_base";
import { setupDefaultBundle } from "../ui/add_ons/ui_helper";
import { AudioHook } from "./audio_hook";
import { I_AudioHandler, I_AudioInfo } from "./audio_info";

/**
 * Url      : db://assets/scripts/base/audio/audio_mgr.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Class    : AudioMgr
 * Desc     : 音频管理器
 */
export class AudioMgr extends SingletonBase {
    /**
     * 音频播放组件挂载节点
     */
    private _audio: Node = null;

    /**
     * 音乐播放组件
     */
    private _music: AudioHook = null;

    /**
     * 音效播放组件
     */
    private _effect: AudioHook = null;

    protected onInitialize(): void {
        this._audio = new Node("Root#Audio");
        const music = new Node("Music");
        const effect = new Node("Effect");
        this._audio.addChild(music);
        this._audio.addChild(effect);
        director.addPersistRootNode(this._audio);
        this._music = music.addComponent(AudioHook);
        this._effect = effect.addComponent(AudioHook);

        this.musicVolume = Singletons.store.music.data;
        this.effectVolume = Singletons.store.effect.data;
    }

    protected onDestroy() {
        this.stopAll();
        director.removePersistRootNode(this._audio);
        this._music = null;
        this._effect = null;
        this._audio = null;
    }

    /**
     * 获得音乐音量
     */
    get musicVolume() {
        return Singletons.store.music.data;
    }

    /**
     * 获得音效音量
     */
    get effectVolume() {
        return Singletons.store.effect.data;
    }

    /**
     * 设置音乐音量
     */
    set musicVolume(v: number) {
        this._music.volume = Singletons.store.music.data = clamp01(v);
    }

    /**
     * 设置音效音量
     */
    set effectVolume(v: number) {
        this._effect.volume = Singletons.store.effect.data = clamp01(v);
    }

    /**
     * 播放音频
     * @param audio 音频信息
     * @param handler 音频播放回调
     */
    play(audio: I_AudioInfo, handler?: I_AudioHandler) {
        audio.type = audio.type || "effect";
        audio.loop = audio.loop || false;
        audio.volume = clamp01(audio.volume || 1.0);
        setupDefaultBundle(audio);

        Singletons.drm.load<AudioClip>(audio.path, AudioClip, audio.bundle).then((clip) => {
            if (!clip) {
                const error = `[AudioMgr] play failed: ${audio.path}`;
                Singletons.log.e(error);
                handler && handler.onError(error);
                return;
            }
            if (audio.type === "music") {
                this._music.play(clip, audio, handler);
            } else {
                this._effect.play(clip, audio, handler);
            }
        });
    }

    /**
     * 暂停音乐
     */
    pauseMusic() {
        this._music.pause();
    }

    /**
     * 恢复音乐
     */
    resumeMusic() {
        this._music.resume();
    }

    /**
     * 停止音乐
     */
    stopMusic() {
        this._music.stop();
    }

    /**
     * 暂停所有音频
     */
    pauseAll() {
        this._effect.pause();
        this.pauseMusic();
    }

    /**
     * 恢复所有音频
     */
    resumeAll() {
        this._effect.resume();
        this.resumeMusic();
    }

    /**
     * 停止所有音频
     */
    stopAll() {
        this._effect.stop();
        this.stopMusic();
    }

    /**
     * 卸载所有音频资源
     */
    unloadAll() {
        this.stopAll();
        this._effect.unloadAll();
        this._music.unloadAll();
    }
}
