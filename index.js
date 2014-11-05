var colorTr = require('./lib/colorTr');

module.exports = function(content, file, option) {
    option = typeof option === 'object' ? option : {};

    if(option.undoFiles && option.undoFiles[file.filename]) { //过滤不作处理的文件
        return content;
    }

    return colorTr.creatNightCss(content);
};