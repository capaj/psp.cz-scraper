var http = require('http')
    , phantomProxy = require('phantom-proxy')
    , path = require('path');

var scrapePrintHistory = function(url, callback) {

    phantomProxy.create({'loadImages':'no'}, function (phantom) {
        var page = phantom.page;

        page.open(url, function () {
            page.injectJs('jquery.js');
            page.evaluate(function () {
                var h1s = $('h1');
                var h1;
                if (h1s.length > 0) {
                    h1 = $('h1')[0].innerText;
                }
                var state;
                var states = {
                    accepted: $('.status.okx').length,     //if accepted there should be one paragraph with class status ok
                    refused: $('span.mark.terminated').length,
                    ongoing: $('[class=status]').length
                };
                var countCheck = 0;
                for(var stateName in states)
                {
                    if (states[stateName] === 1) {
                        state = stateName;
                    }
                    countCheck += states[stateName];
                }
                if (countCheck !== 1) {
                    console.warn("Exactly one state should be possible, check your input, maybe something has changed.");
                }
                // from the previous three, only one should be equal to one
                return JSON.stringify({h1: h1, state: state});
            }, function (scraped) {
                scraped = JSON.parse(scraped);
                if (scraped.h1) {
                    var splitted = scraped.h1.split(/\r\n|\r|\n/);
                    var printHeading = splitted[0];
                    var printNumber = printHeading.match(/\d+$/)[0];
                    var printName = splitted[1];
                    var printH = {number: printNumber, name: printName, state:scraped.state};
                    //accepted, refused, ongoing
                    callback(printH) ;
                } else {
                    console.warn("scrape printHistory for " + url + " failed.");
                }
            });
        });
    });
};

module.exports = {scrapePrintHistory: scrapePrintHistory};






