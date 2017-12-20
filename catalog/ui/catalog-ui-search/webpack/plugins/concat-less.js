var fs = require('fs');
var path = require('path');

function concatLess(relativePath, fileName) {
    var filePath = path.join(relativePath, fileName + '.less');
    var file = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return file.replace(/@import\s*("|')([^"']+)("|')/g, function (match, _, importPath) {
        if (importPath.match(/\.css$/)) return '';
        var dirname = path.dirname(importPath);
        var basename = path.basename(importPath).replace(/\.less$/, '');
        return concatLess(path.join(relativePath, dirname), basename);
    });
}

function ConcatLessPlugin(options) {

}

ConcatLessPlugin.prototype.apply = function(compiler) {
    compiler.plugin('after-emit', function() {
        var less = concatLess(path.resolve(__dirname, '../../', './src/main/webapp/styles/'), 'styles');
        fs.writeFile(path.resolve(__dirname, '../../', './target/webapp/styles/uncompiledLess.less'), less);
    });
}

module.exports = ConcatLessPlugin;