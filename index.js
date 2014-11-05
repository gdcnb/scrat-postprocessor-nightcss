var colorTr = require('./lib/colorTr');

module.exports = function(content, file) {
    var result = colorTr.creatNightCss(content);

    return result;
};