var _ = require('underscore');
var utils = require("./utilFns.js");
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
                    // from the previous three, only one should be equal to one
                    console.warn("Exactly one state should be possible, check your input, maybe something has changed.");
                }

                var allLinks = $('a[href]');
                var votingLinks = _.filter(allLinks, function (elem) {
                    return elem.indexOf('hlasy.sqw');
                });//TODO finish links

                var output = {
                    h1: h1,
                    state: state,
                    readings: $('strong.highlight').length
                };
                var authorLinks = $('div.section-content.simple').find('a');
                if (authorLinks.length == 0) {
                    output.authorDescription = $('div.section-content.simple').innerHTML;
                } else {
                    output.authorLinks = $.map(authorLinks, function(el){return el.href;})
                }


                var sectionTitles = $('h2[class="section-title"]');
                if (sectionTitles[0].innerHTML === "Dokument") {
                    output.type = 'document';
                } else {
                    output.type = 'novel';
                }
                return JSON.stringify(output);
            }, function (scraped) {
                scraped = JSON.parse(scraped);
                if (scraped.h1) {
                    var splitted = scraped.h1.split(/\r\n|\r|\n/);
                    var printHeading = splitted[0];
                    var printNumber = printHeading.match(/\d+$/)[0];
                    var printName = splitted[1];
                    if (scraped.authorDescription) {
                        utils.clipTextBetween(scraped.authorDescription, "<br>", "<p>");
                    }

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