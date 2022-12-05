import { _decorator, Component, Node, director, AudioSource, AudioClip, clamp01 } from "cc";
import { Singletons } from "../singletons";
import SingletonBase from "../singleton_base";
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
    private _audio: Node = null;
    private _music: AudioHook = null;
    private _effect: AudioHook = null;

    protected onInitialize(debuggable: boolean): void {
        this._audio = new Node("Root#Audio");
        const music = new Node("Music");
        const effect = new Node("Effect");
        this._audio.addChild(music);
        this._audio.addChild(effect);
        director.addPersistRootNode(this._audio);
        this._music = music.addComponent(AudioHook);
        this._effect = effect.addComponent(AudioHook);

        this._music.debuggable = this._effect.debuggable = debuggable;
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

    get musicVolume() {
        return Singletons.store.music.data;
    }

    get effectVolume() {
        return Singletons.store.effect.data;
    }

    set musicVolume(v: number) {
        this._music.volume = Singletons.store.music.data = clamp01(v);
    }

    set effectVolume(v: number) {
        this._effect.volume = Singletons.store.effect.data = clamp01(v);
    }

    play(audio: I_AudioInfo, handler?: I_AudioHandler) {
        audio.type = audio.type || "effect";
        audio.loop = audio.loop || false;
        audio.bundle = audio.bundle || "resources";
        audio.volume = clamp01(audio.volume || 1.0);

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

    pauseMusic() {
        this._music.pause();
    }

    stopMusic() {
        this._music.stop();
    }

    resumeMusic() {
        this._music.resume();
    }

    pauseAll() {
        this._effect.pause();
        this.pauseMusic();
    }

    resumeAll() {
        this._effect.resume();
        this.resumeMusic();
    }

    stopAll() {
        this._effect.stop();
        this.stopMusic();
    }

    unloadAll() {
        this.stopAll();
        this._effect.unloadAll();
        this._music.unloadAll();
    }
}
