
/**
 * Created by capaj on 8.7.13.
 *
 */
var scrapeMethods = require('./main.js');

module.exports = {
    setUp: function (callback) {
        var self = this;
        var promises = [];
//        promises.push(prom);
        scrapeMethods.getPrintHistory('http://www.psp.cz/sqw/historie.sqw?t=620', function (history) {
            self.historyPassed = history;
            callback();
        });
    },
    printHistory: function (test) {
        test.equals(this.historyPassed.number, 620);
        test.equals(this.historyPassed.state, 'accepted');
        test.equals(this.historyPassed.createdOn.date(), 29);
        test.equals(this.historyPassed.createdOn.month()+1, 2);
        test.equals(this.historyPassed.createdOn.year(), 2012);
        test.done();
    },
    voting: function (test) {

    }
};