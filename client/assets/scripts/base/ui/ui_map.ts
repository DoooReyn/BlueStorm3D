import { UiInfo } from "../res/res_info";

/**
 * Ui资源信息映射表
 */
export const UiMap = {
    // Screen
    GameScreen: UiInfo.from({ path: "prefab/screen/game_screen" }),
    HomeScreen: UiInfo.from({ path: "prefab/screen/home_screen" }),
    // Layer
    BagLayer: UiInfo.from({ path: "prefab/layer/bag_layer" }),
    ShopLayer: UiInfo.from({ path: "prefab/layer/shop_layer" }),
    // Dialog
    ItemDetailDialog: UiInfo.from({ path: "prefab/dialog/item_detail_dialog" }),
    ItemBuyDialog: UiInfo.from({ path: "prefab/dialog/item_buy_dialog" }),
    BuyConfirmDialog: UiInfo.from({ path: "prefab/dialog/buy_confirm_dialog" }),
    // Loading
    DefaultLoading: UiInfo.from({ path: "prefab/loading/default_loading" }),
    // Tip
    ItemUseTip: UiInfo.from({ path: "prefab/tip/item_use_tip" }),
};

(<any>window).UiMap = UiMap;
