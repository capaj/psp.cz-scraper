var _ = require('underscore');

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
                var scrapedData = {h1: h1};

                var approvedSpan = $('.paragraph.approved');
                if (approvedSpan.length) {
                    scrapedData.approved = true;
                } else {
                    scrapedData.approved = false;
                }

                var allLinks = $('a[href]');
                var votingLinks = _.filter(allLinks, function (elem) {
                   return elem.indexOf('hlasy.sqw');
                });//TODO finish links
                
                var sectionTitles = $('h2[class="section-title"]');
                if (sectionTitles[0].innerHTML === "Dokument") {
                    scrapedData.type = 'document';
                } else {
                    scrapedData.type = 'novel';
                }
                
                return JSON.stringify(scrapedData);
            }, function (scraped) {
                scraped = JSON.parse(scraped);
                if (scraped.h1) {
                    var splitted = scraped.h1.split(/\r\n|\r|\n/);
                    var printHeading = splitted[0];
                    var printNumber = printHeading.match(/\d+$/)[0];
                    var printName = splitted[1];
                    delete scraped.h1;
                    _.extend(scraped, {number: printNumber, name: printName});
                    callback(scraped);
                } else {
                    console.warn("scrape printHistory for " + url + " failed.");
                }
            });
        });
    });
};

module.exports = {scrapePrintHistory: scrapePrintHistory}






