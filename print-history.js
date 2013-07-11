var phantomProxy = require('phantom-proxy');
var utils = require("./utilFns.js");
var moment = require('moment');
moment.lang('cz');
// constants for scraping dates
var SHORT_DT_FORMAT = "D. M. YYYY";
var MWORD_DT_FORMAT = "D. MMMM YYYY";

module.exports = function(url, callback) {

    phantomProxy.create({'loadImages':'no'}, function (phantom) {
        var page = phantom.page;

        page.open(url, function () {
            console.log(url + " print history opened");
            page.injectJs('./jquery.js');
            page.evaluate(function () {
                var h1s = $('h1');
                var h1;
                if (h1s.length > 0) {
                    h1 = h1s[0].innerText;
                }

                var introducedParagraph = $('.document-log-item:nth-child(1) p')[0];

                var state;
                var states = {
                    accepted: $('.status.okx').length,     //if accepted there should be one paragraph with class status ok
                    refused: $('span.mark.terminated').length,
                    ongoing: $('[class=status]').length || $('span.mark.current').length
                };
                var countCheck = 0;
                for(var stateName in states)
                {
                    if (states[stateName] === 1) {
                        state = stateName;
                    }
                    countCheck += states[stateName];
                }

                var output = {
                    h1: h1,
                    state: state,
                    readings: $('strong.highlight').length,
                    dateIntroduced: introducedParagraph.textContent.split('dne')[1].trim()
                };

                if (countCheck !== 1) {
                    // from the previous three, only one should be equal to one, but there are some which don't have
                    console.warn("Exactly one state should be equal to one, check your input, maybe something has changed.");
                } else {
                    if (states.ongoing) {
                        output.nextMeetingWhereScheduledLink = $('[class=status]').find('a')[0].href;
                    }
                    if (states.accepted) {
                        output.publishedInLink = $('.status.okx').find('a')[0].href;
                    }
                }

//                var allLinks = $('a[href]');
//                var votingLinks = allLinks.filter(function (elem) {
//                    return elem.indexOf('hlasy.sqw');
//                });//TODO finish links


                var authorLinks = $('div.section-content.simple').find('a');
                if (authorLinks.length == 0) {
                    output.authorDescription = $('div.section-content.simple')[0].textContent;
                } else {
                    output.authorLinks = $.map(authorLinks, function(el){return el.href;})
                }

                var sectionTitles = $('h2.section-title');
                if (sectionTitles[0].innerHTML === "Dokument") {
                    output.type = 'document';
                } else {
                    output.type = 'novel';
                }
                return JSON.stringify(output);
            }, function (scraped) {
                if (scraped) {
                    scraped = JSON.parse(scraped);
                    var splitted = scraped.h1.split(/\r\n|\r|\n/);
                    var printHeading = splitted[0];
                    var printNumber = Number(printHeading.match(/\d+$/)[0]);
                    var printName = splitted[1];
                    if (scraped.authorDescription) {
                        utils.clipTextBetween(scraped.authorDescription, "<br>", "<p>");
                    }

                    var printH = {
                        number: printNumber,
                        name: printName,
                        state: scraped.state,
                        type: scraped.type,
                        readings: scraped.readings,
                        createdOn: moment(scraped.dateIntroduced, SHORT_DT_FORMAT)
                    };
                    //accepted, refused, ongoing
                    callback(printH) ;
                } else {
                    console.warn("scrape printHistory for " + url + " failed.");
                }
            });
        });
    });
};
