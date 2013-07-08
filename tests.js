
/**
 * Created by capaj on 8.7.13.
 *
 */
var scrapeMethods = require('./main.js');

module.exports = {
    setUp: function (callback) {
        var self = this;
        scrapeMethods.getPrintHistory('http://www.psp.cz/sqw/historie.sqw?t=620', function (history) {
            self.historyPassed = history;
            callback();
        });
    },
    printHistory: function (test) {
        test.equals(this.historyPassed.number, 620);
        test.equals(this.historyPassed.state, 'accepted');
        test.done();
    }
};