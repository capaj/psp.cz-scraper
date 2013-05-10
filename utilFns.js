module.exports = {
    clipTextBetween: function (str, begin, end) {
        var beginIndex = str.indexOf(begin)+begin.length;
        var endIndex = str.indexOf(end);
        return str.substring(beginIndex, endIndex)
    }
};