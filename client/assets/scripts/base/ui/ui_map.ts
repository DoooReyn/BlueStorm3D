import { setupDefaultBundle } from "./add_ons/ui_helper";
import { I_UiInfo } from "./ui_base";

/**
 * Ui资源信息映射表
 */
export const UiMap: { [key: string]: I_UiInfo } = {
    // Screen
    GameScreen: { path: "prefab/screen/game_screen" },
    HomeScreen: { path: "prefab/screen/home_screen" },
    // Layer
    BagLayer: { path: "prefab/layer/bag_layer" },
    ShopLayer: { path: "prefab/layer/shop_layer" },
    // Dialog
    ItemDetailDialog: { path: "prefab/dialog/item_detail_dialog" },
    ItemBuyDialog: { path: "prefab/dialog/item_buy_dialog" },
    BuyConfirmDialog: { path: "prefab/dialog/buy_confirm_dialog" },
    // Loading
    DefaultLoading: { path: "prefab/loading/default_loading" },
    // Tip
    ItemUseTip: { path: "prefab/tip/item_use_tip" },
};
for (const key in UiMap) {
    setupDefaultBundle(UiMap[key]);
}
