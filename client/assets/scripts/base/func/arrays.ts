/**
 * 洗牌算法1
 * Fisher-Yates Shuffle 随机置乱算法
 * @param list 目标数组
 */
export function shuffle1(list: any[]): any[] {
    let count = list.length;
    while (count) {
        let index = Math.floor(Math.random() * count--);
        let temp = list[count];
        list[count] = list[index];
        list[index] = temp;
    }
    return list;
}

/**
 * 洗牌算法2
 * @param list 目标数组
 */
export function shuffle2(list: any[]): any[] {
    let count = list.length;
    for (let i = 0; i < count; i++) {
        let index = Math.floor(Math.random() * count);
        let temp = list[index];
        list[index] = list[0];
        list[0] = temp;
    }
    return list;
}

/**
 * 洗牌算法3
 * @param list 目标数组
 */
export function shuffle3(list: any[]) {
    return list.sort((a, b) => {
        return Math.random() - 0.5;
    });
}
