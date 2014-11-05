var colorTr = require('./lib/colorTr');

module.export = function(content, file) {
    var result = colorTr.creatNightCss(content);

    return result;
};