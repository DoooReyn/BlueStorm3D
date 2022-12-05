import { _decorator, Component, Node, EventTouch } from "cc";
import { AudioMap } from "../../base/audio/audio_map";
import { Singletons } from "../../base/singletons";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/audio/audio_scene.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 16:57:06 GMT+0800 (中国标准时间)
 * Class    : AudioScene
 * Desc     :
 */
@ccclass("AudioScene")
export class AudioScene extends Component {
    /************************************************************
     * 基础事件
     ************************************************************/

    onBtnClicked(e: EventTouch, type: string) {
        switch (type) {
            case "PlayMusic":
                Singletons.audio.play(AudioMap.bg1);
                break;
            case "PauseMusic":
                Singletons.audio.pauseMusic();
                break;
            case "ResumeMusic":
                Singletons.audio.resumeMusic();
                break;
            case "StopMusic":
                Singletons.audio.stopMusic();
                break;
            case "PlayClick":
                Singletons.audio.play(AudioMap.click);
                break;
            case "PlayCamera":
                Singletons.audio.play(AudioMap.camera);
                break;
            case "PlayAtSameTime":
                Singletons.audio.play(AudioMap.click);
                Singletons.audio.play(AudioMap.camera);
                break;
            case "PauseAll":
                Singletons.audio.pauseAll();
                break;
            case "ResumeAll":
                Singletons.audio.resumeAll();
                break;
            case "StopAll":
                Singletons.audio.stopAll();
                break;
        }
    }
}
