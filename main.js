var scrapePrintHistory = function(url, callback) {
    var http = require('http')
        , phantomProxy = require('phantom-proxy')
        , path = require('path');

    phantomProxy.create({}, function (phantom) {
        var page = phantom.page;

        page.open(url, function () {
            page.injectJs('jquery.js');
            page.evaluate(function () {
                var h1s = $('h1');
                var h1;
                if (h1s.length > 0) {
                    h1 = $('h1')[0].innerText;
                }
                return JSON.stringify({h1: h1});
            }, function (scraped) {
                scraped = JSON.parse(scraped);
                if (scraped.h1) {
                    var splitted = scraped.h1.split(/\r\n|\r|\n/);
                    var printHeading = splitted[0];
                    var printNumber = printHeading.match(/\d+$/)[0];
                    var printName = splitted[1];
                    callback({number: printNumber, name: printName}) ;
                } else {
                    console.warn("scrape printHistory for " + url + " failed.");
                }
            });
        });
    });
};

module.exports = {scrapePrintHistory: scrapePrintHistory}






