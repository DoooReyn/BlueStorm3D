export interface I_ItemDetailInfo {
    /**
     * 道具id
     */
    id: number;
    /**
     * 道具类型
     */
    type: "item" | "equip" | "book";
    /**
     * 道具名称
     */
    name: string;
    /**
     * 道具描述
     */
    desc: string;
}
export const ItemDetailConfig: { [key: string]: I_ItemDetailInfo } = {
    item_1001: {
        id: 1001,
        type: "item",
        name: "基础魂石",
        desc: "基础魂石，角色和武器的升级材料，塞尔达旷野上随处可见的矿产资源。",
    },
    item_1002: {
        id: 1002,
        type: "item",
        name: "中级魂石",
        desc: "中级魂石，角色和武器的升级材料，击杀小怪有概率掉落。",
    },
    item_1003: {
        id: 1003,
        type: "item",
        name: "高级魂石",
        desc: "高级魂石，角色和武器的升级材料，击杀Boss有概率掉落。",
    },
};
