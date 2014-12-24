/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h:h,
        s:s,
        v:v
    };
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

/**
 * @param {String} hex  hex color
 eg:
 alert( hexToRgb("#0033ff").g ); // "51";
 alert( hexToRgb("#03f").g ); // "51";
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

//rgb转换成16进制(hex)的方法
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * 根据传进来的样式，自动生成夜间模式的样式,夜间模式的样式默认会在原来的样式名字上加上.night 方便切换
 * @param {String} cssStr 需要处理的样式字符串
 * @param {Object} option
 * @returns {string} 返回 cssStr + 夜间模式的样式
 * eg: '.title {border-color: #5eb4ed;}' ==> '.title {border-color: #5eb4ed;}.night .title{border-color:#2f5a77;}'
 */
function creatNightCss(cssStr, option) {

    var _MATCH_CSSKEYS_ = [ //设置查找样式的关键字
            'background', 'background-color',
            'border', 'border-top', 'border-bottom', 'border-right','border-left',
            'border-color','border-top-color', 'border-bottom-color', 'border-right-color','border-left-color',
            'color'
        ],
        _WORD_COLORS_ = { //默认的英文颜色对应颜色值
            aliceblue: [240, 248, 255]
            , antiquewhite: [250, 235, 215]
            , aqua: [0, 255, 255]
            , aquamarine: [127, 255, 212]
            , azure: [240, 255, 255]
            , beige: [245, 245, 220]
            , bisque: [255, 228, 196]
            , black: [0, 0, 0]
            , blanchedalmond: [255, 235, 205]
            , blue: [0, 0, 255]
            , blueviolet: [138, 43, 226]
            , brown: [165, 42, 42]
            , burlywood: [222, 184, 135]
            , cadetblue: [95, 158, 160]
            , chartreuse: [127, 255, 0]
            , chocolate: [210, 105, 30]
            , coral: [255, 127, 80]
            , cornflowerblue: [100, 149, 237]
            , cornsilk: [255, 248, 220]
            , crimson: [220, 20, 60]
            , cyan: [0, 255, 255]
            , darkblue: [0, 0, 139]
            , darkcyan: [0, 139, 139]
            , darkgoldenrod: [184, 134, 11]
            , darkgray: [169, 169, 169]
            , darkgreen: [0, 100, 0]
            , darkgrey: [169, 169, 169]
            , darkkhaki: [189, 183, 107]
            , darkmagenta: [139, 0, 139]
            , darkolivegreen: [85, 107, 47]
            , darkorange: [255, 140, 0]
            , darkorchid: [153, 50, 204]
            , darkred: [139, 0, 0]
            , darksalmon: [233, 150, 122]
            , darkseagreen: [143, 188, 143]
            , darkslateblue: [72, 61, 139]
            , darkslategray: [47, 79, 79]
            , darkslategrey: [47, 79, 79]
            , darkturquoise: [0, 206, 209]
            , darkviolet: [148, 0, 211]
            , deeppink: [255, 20, 147]
            , deepskyblue: [0, 191, 255]
            , dimgray: [105, 105, 105]
            , dimgrey: [105, 105, 105]
            , dodgerblue: [30, 144, 255]
            , firebrick: [178, 34, 34]
            , floralwhite: [255, 250, 240]
            , forestgreen: [34, 139, 34]
            , fuchsia: [255, 0, 255]
            , gainsboro: [220, 220, 220]
            , ghostwhite: [248, 248, 255]
            , gold: [255, 215, 0]
            , goldenrod: [218, 165, 32]
            , gray: [128, 128, 128]
            , green: [0, 128, 0]
            , greenyellow: [173, 255, 47]
            , grey: [128, 128, 128]
            , honeydew: [240, 255, 240]
            , hotpink: [255, 105, 180]
            , indianred: [205, 92, 92]
            , indigo: [75, 0, 130]
            , ivory: [255, 255, 240]
            , khaki: [240, 230, 140]
            , lavender: [230, 230, 250]
            , lavenderblush: [255, 240, 245]
            , lawngreen: [124, 252, 0]
            , lemonchiffon: [255, 250, 205]
            , lightblue: [173, 216, 230]
            , lightcoral: [240, 128, 128]
            , lightcyan: [224, 255, 255]
            , lightgoldenrodyellow: [250, 250, 210]
            , lightgray: [211, 211, 211]
            , lightgreen: [144, 238, 144]
            , lightgrey: [211, 211, 211]
            , lightpink: [255, 182, 193]
            , lightsalmon: [255, 160, 122]
            , lightseagreen: [32, 178, 170]
            , lightskyblue: [135, 206, 250]
            , lightslategray: [119, 136, 153]
            , lightslategrey: [119, 136, 153]
            , lightsteelblue: [176, 196, 222]
            , lightyellow: [255, 255, 224]
            , lime: [0, 255, 0]
            , limegreen: [50, 205, 50]
            , linen: [250, 240, 230]
            , magenta: [255, 0, 255]
            , maroon: [128, 0, 0]
            , mediumaquamarine: [102, 205, 170]
            , mediumblue: [0, 0, 205]
            , mediumorchid: [186, 85, 211]
            , mediumpurple: [147, 112, 219]
            , mediumseagreen: [60, 179, 113]
            , mediumslateblue: [123, 104, 238]
            , mediumspringgreen: [0, 250, 154]
            , mediumturquoise: [72, 209, 204]
            , mediumvioletred: [199, 21, 133]
            , midnightblue: [25, 25, 112]
            , mintcream: [245, 255, 250]
            , mistyrose: [255, 228, 225]
            , moccasin: [255, 228, 181]
            , navajowhite: [255, 222, 173]
            , navy: [0, 0, 128]
            , oldlace: [253, 245, 230]
            , olive: [128, 128, 0]
            , olivedrab: [107, 142, 35]
            , orange: [255, 165, 0]
            , orangered: [255, 69, 0]
            , orchid: [218, 112, 214]
            , palegoldenrod: [238, 232, 170]
            , palegreen: [152, 251, 152]
            , paleturquoise: [175, 238, 238]
            , palevioletred: [219, 112, 147]
            , papayawhip: [255, 239, 213]
            , peachpuff: [255, 218, 185]
            , peru: [205, 133, 63]
            , pink: [255, 192, 203]
            , plum: [221, 160, 221]
            , powderblue: [176, 224, 230]
            , purple: [128, 0, 128]
            , red: [255, 0, 0]
            , rosybrown: [188, 143, 143]
            , royalblue: [65, 105, 225]
            , saddlebrown: [139, 69, 19]
            , salmon: [250, 128, 114]
            , sandybrown: [244, 164, 96]
            , seagreen: [46, 139, 87]
            , seashell: [255, 245, 238]
            , sienna: [160, 82, 45]
            , silver: [192, 192, 192]
            , skyblue: [135, 206, 235]
            , slateblue: [106, 90, 205]
            , slategray: [112, 128, 144]
            , slategrey: [112, 128, 144]
            , snow: [255, 250, 250]
            , springgreen: [0, 255, 127]
            , steelblue: [70, 130, 180]
            , tan: [210, 180, 140]
            , teal: [0, 128, 128]
            , thistle: [216, 191, 216]
            , tomato: [255, 99, 71]
            , turquoise: [64, 224, 208]
            , violet: [238, 130, 238]
            , wheat: [245, 222, 179]
            , white: [255, 255, 255]
            , whitesmoke: [245, 245, 245]
            , yellow: [255, 255, 0]
            , yellowgreen: [154, 205, 50]
            , rebeccapurple: [102, 51, 153]
        },
        cssObjList,
        nightCSSStr = '';

    /**
     * css样式解析器，将带有颜色值的样式转换成对象
     * @param {String} cssStr
     * eg: '.font-catalog {color: #47aee9;}' ==> [{ classNsme: '.font-catalog', styleText: 'color: #47aee9;',style: { color: '#47aee9' }, nightStyle: {} }]
     */
    function creatCSSObjList(cssStr) {
        var cssList = cssStr.split('}'), //分割每一个class，将每个class转换成数组
            cssObjList = [];

        //将匹配的每个样式值转换成样式对象
        cssList.forEach(function(item){
            var splitIndex = item.indexOf('{'),
                styleText = item.substr(splitIndex + 1).replace(/(^\s*)|(\s*$)|(\r\n)/g, ''),
                cssObj, stylList, stylObj;

            //过滤不符合条件的样式
            if(/(background+)|(color)|(border)/g.test(styleText)){
                cssObj = {//截取每个clss的name和样式内容
                    className: item.substr(0, splitIndex).replace(/(^\s*)|(\s*$)/g, ''),
                    styleText: styleText,
                    style: {},
                    nightStyle: {}
                };

                stylList = cssObj.styleText.split(';');
                stylObj = {};

                stylList.forEach(function(stylItem){
                    if(stylItem) {
                        var splitIndex = stylItem.indexOf(':'),
                            styleName = stylItem.substr(0, splitIndex).replace(/(^\s*)|(\s*$)/g, '');

                        //只拿匹配的样式值
                        if(/(background+)|(color)|(border)/g.test(styleName)) {
                            stylObj[styleName] = stylItem.substr(splitIndex + 1).replace(/(^\s*)|(\s*$)/g, '');
                        }
                    }
                });

                if(Object.keys(stylObj).length) { //只保存有可能会有颜色属性的class
                    cssObj.style = stylObj;
                    cssObjList.push(cssObj);
                }
            }
        });

        return cssObjList;
    }

    cssObjList = creatCSSObjList(cssStr);

    cssObjList.forEach(function(css){
        _MATCH_CSSKEYS_.forEach(function(key){

            //只针对没有夜间模式的组件进行处理，以 .night 开头的class不作处理
            if(css.style && css.style[key] && !(/\.night\s/.test(css.className))){
                //获取16进制类型颜色
                var itemHex = /(#[0-9a-fA-F]+)/g.exec(css.style[key]),
                    itemRgb = /rgb\((\d+\s*),\s*(\d+\s*),\s*(\d+\s*)\)/ig.exec(css.style[key]),
                    itemNightCol, checkColor, hsvCheck;

                if(itemHex) { //如果是16进制颜色则要转换成rgb格式
                    itemHex = itemHex[0];
                    itemRgb = hexToRgb(itemHex);
                }
                else if (itemRgb) { //如果是rgb格式
                    itemRgb = {
                        r: parseInt(itemRgb[1]),
                        g: parseInt(itemRgb[2]),
                        b: parseInt(itemRgb[3])
                    };

                } else {
                    //进行英文颜色值的查找
                    Object.keys(_WORD_COLORS_).forEach(function(colName){
                        var colRe = new RegExp(colName),
                            matchTest = css.style[key].match(colRe);

                        if(matchTest && (matchTest[0].length === colName.length)) {
                            itemRgb = { //如果是类似red 这样的英文颜色
                                r: _WORD_COLORS_[colName][0],
                                g: _WORD_COLORS_[colName][1],
                                b: _WORD_COLORS_[colName][2]
                            };
                            return;
                        }
                    });
                }

                if(itemRgb) {
                    checkColor = '0x' + rgbToHex(itemRgb.r, itemRgb.g, itemRgb.b).substr(1);
                    hsvCheck = Math.round(rgbToHsv(itemRgb.r, itemRgb.g, itemRgb.b).v * 100);

                    if((key === 'color') && parseInt(checkColor) < parseInt('0xa0a0a0')) {
                        //对于字体的色值范围 0 ~a0a0a0 的区间内的转换成 #385170
                        itemNightCol = '#385170';
                    }
                    else if (hsvCheck < 40) {
                        //如果颜色的hsv中的亮度值小于40%，则不作处理
                        itemNightCol = null;
                    }
                    else {
                        itemNightCol = { //将rgb的每个值除以2可以得到夜间模式下的颜色值
                            r: Math.round(itemRgb.r/2),
                            g: Math.round(itemRgb.g/2),
                            b: Math.round(itemRgb.b/2)
                        };
                        itemNightCol = rgbToHex(itemNightCol.r, itemNightCol.g, itemNightCol.b);
                    }

                    if(itemNightCol) {
                        //添加对 !important 的处理
                        if(/\!important/.test(css.style[key])) {
                            itemNightCol += ' !important';
                        }

                        if(/color$/.test(key)){
                            css.nightStyle[key] = itemNightCol;
                        } else {
                            css.nightStyle[key + '-color'] = itemNightCol;
                        }
                    }
                }
            }
        });

        //生成夜间模式的样式
        if(Object.keys(css.nightStyle).length) {
            if(css.className === 'body') {
                css.className = '';
            }
            var nightClassStr = '.night ' + css.className + '{';
            for(var styleName in css.nightStyle) {
                nightClassStr += (styleName + ':' + css.nightStyle[styleName])+ ';';
            }
            nightCSSStr += (nightClassStr + '}');
        }

    });

    return cssStr += nightCSSStr;
}

module.exports = {
    creatNightCss: creatNightCss
};