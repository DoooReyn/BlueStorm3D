import { _decorator, Component } from "cc";
import { disableDomErrorNode } from "../../base/func/utils";
import { ScrollFixedViewBase } from "../../base/ui/add_ons/view/scroll_fixed_view_base";
import { ScrollVerticalView } from "../../base/ui/add_ons/view/scroll_vertical_view";
const { ccclass, property } = _decorator;

export interface I_Fixed_Data {
    id: number;
    desc: string;
}

const TEST_DATA_1: I_Fixed_Data[] = [
    { id: 1001, desc: "item_001" },
    { id: 1002, desc: "item_002" },
    { id: 1003, desc: "item_003" },
    { id: 1001, desc: "item_004" },
    { id: 1002, desc: "item_005" },
    { id: 1003, desc: "item_006" },
    { id: 1001, desc: "item_007" },
    { id: 1002, desc: "item_008" },
    { id: 1003, desc: "item_009" },
];

const TEST_DATA_2: I_Fixed_Data[] = [
    { id: 1001, desc: "item_001" },
    { id: 1002, desc: "item_002" },
    { id: 1003, desc: "item_003" },
    { id: 1001, desc: "item_004" },
    { id: 1002, desc: "item_005" },
    { id: 1003, desc: "item_006" },
    { id: 1001, desc: "item_010" },
    { id: 1002, desc: "item_011" },
    { id: 1003, desc: "item_012" },
    { id: 1001, desc: "item_007" },
    { id: 1002, desc: "item_008" },
    { id: 1003, desc: "item_009" },
];

const TEST_DATA_3: I_Fixed_Data[] = [
    { id: 1001, desc: "item_010" },
    { id: 1002, desc: "item_011" },
    { id: 1003, desc: "item_012" },
    { id: 1001, desc: "item_001" },
    { id: 1002, desc: "item_002" },
    { id: 1003, desc: "item_003" },
];

(<any>window)["ViewData"] = { TEST_DATA_1, TEST_DATA_2, TEST_DATA_3 };

/**
 * Url      : db://assets/scripts/scene/scroll/fixed_scroll_scene.ts
 * Author   : reyn
 * Date     : Fri Dec 16 2022 09:29:53 GMT+0800 (中国标准时间)
 * Class    : FixedScrollScene
 * Desc     :
 */
@ccclass("fixed_scroll_scene")
export class FixedScrollScene extends ScrollFixedViewBase<I_Fixed_Data, ScrollVerticalView> {
    start() {
        (<any>window)[this.node.name] = this;
        disableDomErrorNode();
        super.start();
    }

    protected _onPreloaded(): void {
        this.reload(TEST_DATA_1);
    }
}
