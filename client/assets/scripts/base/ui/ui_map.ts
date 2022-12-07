import { I_UiInfo } from "./ui_base";

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
// TODO——Dialog需要支持点击外部关闭
