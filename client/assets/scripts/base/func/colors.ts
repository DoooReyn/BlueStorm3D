import { Color } from "cc";
import { clamp } from "./numbers";

/**
 * Url      : db://assets/scripts/base/func/colors.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 颜色辅助方法
 */
export class Colors {
    public static readonly BLACK = Color.BLACK;
    public static readonly WHITE = Color.WHITE;
    public static readonly GREEN = Color.GREEN;
    public static readonly RED = Color.RED;
    public static readonly BLUE = Color.BLUE;
    public static readonly YELLOW = Color.YELLOW;
    public static readonly GRAY = Color.GRAY;
    public static readonly CYAN = Color.CYAN;
    public static readonly MAGENTA = Color.MAGENTA;
    public static readonly TRANSPARENT = Color.TRANSPARENT;

    /**
     * 是否为 16 进制颜色字符串
     * @param hex 16 进制颜色字符串
     */
    public static isHex(hex: string) {
        return /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(hex);
    }

    /**
     * 将十六进制颜色字符串转换为 cocos creator 色值
     * @param hex 十六进制颜色字符串
     * @returns
     */
    public static hex2cccolor(hex: string) {
        return new Color().fromHEX(hex);
    }

    /**
     * 是否rgb字符串
     * @param str rgb字符串
     * @returns
     */
    public static isRGB(str: string): boolean {
        return /^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/.test(
            str
        );
    }

    /**
     * rgb色值
     * @param rgb rgb字符串
     * @returns
     */
    public static getValuesRGB(rgb: string): string[] {
        rgb = this.isRGB(rgb) ? rgb : "rgb(255, 255, 255)";
        return rgb
            .substring(4, rgb.length - 1)
            .replace(/ /g, "")
            .split(",");
    }

    /**
     * 十六进制转rgb
     * @param hex 十六进制
     * @returns
     */
    public static hex2rgb(hex: string) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : null;
    }

    /**
     * hue 转 rgb
     * @param p p 值
     * @param q q 值
     * @param t t 值
     * @returns
     */
    public static hue2rgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    /**
     * hsl转rgb
     * @param h h值
     * @param s s值
     * @param l l值
     * @returns
     */
    public static hsl2rgb(h: number | string, s: number | string, l: number | string) {
        let r: number = 0,
            g: number = 0,
            b: number = 0;

        h = parseInt(h as string);
        s = parseInt(s as string);
        l = parseInt(l as string);

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1 / 3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1 / 3);
        }

        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }

    /**
     * rgba转rgb
     * @param rgba rgba色值
     * @returns
     */
    public static rgba2rgb(rgba: string) {
        let res: any = rgba
            .replace("rgba", "rgb")
            .replace(/[+-]?([.])[0-9]+/, "")
            .split(",");
        res.pop();
        res.join(",");
        res += ")";
        return res;
    }

    /**
     * 是否hsl
     * @param str hsl字符串
     * @returns
     */
    public static isHSL(str: string): boolean {
        return /hsl[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*[)]$/.test(
            str
        );
    }

    /**
     * 获取hsl
     * @param str hsl字符串
     * @returns
     */
    public static getValuesHSL(hsl: string): string[] {
        let res = hsl
            .substring(4, hsl.length - 1)
            .replace(/ /g, "")
            .replace(/%/g, "")
            .split(",");
        return res;
    }

    /**
     * 十六进制转hsl
     * @param str 十六进制
     * @returns
     */
    public static hex2hsl(hex: string) {
        // Convert hex to RGB first
        let r: any = 0,
            g: any = 0,
            b: any = 0;
        if (hex.length === 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length === 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return "hsl(" + h + "," + s + "%," + l + "%)";
    }

    /**
     * rgb转hsl
     * @param r r值
     * @param g g值
     * @param b b值
     * @returns
     */
    public static rgb2hsl(r: number, g: number, b: number) {
        (r /= 255), (g /= 255), (b /= 255);

        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h,
            s,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            //@ts-ignore
            h /= 6;
        }

        return `hsl(${h},${s},${l})`;
    }

    /**
     * rgba转hsla
     * @param r r值
     * @param g g值
     * @param b b值
     * @param a a值
     * @returns
     */
    public static rgba2hsla(r: number | string, g: number | string, b: number | string, a: number) {
        r = parseInt(r as string);
        g = parseInt(g as string);
        b = parseInt(b as string);
        a = clamp(a, 0, 255);

        (r /= 255), (g /= 255), (b /= 255);

        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h = 0,
            s = 0,
            l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            //@ts-ignore
            h /= 6;
        }

        return `hsla(${h},${s},${l},${a})`;
    }

    /**
     * 随机颜色
     */
    public static randomColor() {
        let a = "#";
        return (a += Math.floor(Math.random() * 16777215).toString(16));
    }

    /**
     * 随机颜色，带透明通道
     * @param alpha 透明通道
     * @returns
     */
    public static randomColorWithAlpha(alpha: number = 255) {
        return this.color2rgba(this.randomColor(), clamp(alpha, 0, 255));
    }

    /**
     * 是否rgba
     * @param str rgba字符串
     * @returns 是否rgba
     */
    public static isRGBA(str: string): boolean {
        return /^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){4}[)]$/.test(
            str
        );
    }

    /**
     * hsla转rgba
     * @param h h值
     * @param s s值
     * @param l l值
     * @param aplha a值
     * @returns
     */
    public static hsla2rgba(h: number | string, s: number | string, l: number | string, alpha: number) {
        alpha = clamp(alpha, 0, 255);
        h = parseInt(h as string);
        l = parseInt(l as string);
        s = parseInt(s as string);

        const rgb = this.hsl2rgb(h / 360, s / 100, l / 100),
            rgba = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")";

        return rgba;
    }

    /**
     * 十六进制转rgba
     * @param hex 十六进制
     * @param aplha a值
     * @returns
     */
    public static hex2rgba(hex: string, alpha: number) {
        alpha = clamp(alpha, 0, 255);
        if (this.isHex(hex)) {
            hex = hex.replace("#", "");
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
            return `rgba(${r},${g},${b},${alpha})`;
        } else {
            console.error("Cannot convert hex to RGBA. Invalid hex. USe Default.");
            return "rgba(255, 255, 255, 255)";
        }
    }

    /**
     * rgb转rgba
     * @param rgb rgb
     * @param aplha a值
     * @returns
     */
    public static rgb2rgba(rgb: string, alpha: number = 255) {
        alpha = clamp(alpha, 0, 255);
        let new_col = "";
        new_col = rgb.replace(/rgb/i, "rgba");
        new_col = new_col.replace(/\)/i, `,${alpha})`);
        return new_col;
    }

    /**
     * 字符串转rgba
     * @param color 颜色字符串
     * @returns
     */
    public static color2rgba(color: string, alpha: number) {
        alpha = clamp(alpha, 0, 255);
        let res = "";

        if (this.isHex(color)) {
            res = this.hex2rgba(color, alpha);
        }

        if (this.isRGB(color)) {
            res = this.rgb2rgba(color, alpha);
        }

        if (this.isHSL(color)) {
            const values = this.getValuesHSL(color);
            const a = this.hsl2rgb(values[0], values[1], values[2]);
            res = this.rgb2rgba(a, alpha);
        }

        return res;
    }
}
