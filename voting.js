var phantomProxy = require('phantom-proxy');

module.exports = function(url, callback) {

    phantomProxy.create({'loadImages':'no'}, function (phantom) {
        var page = phantom.page;

        page.open(url, function () {
            page.injectJs('./node_modules/psp.cz-scraper/jquery.js');
            page.evaluate(function () {
                var main = $('div#main-content');
                if (main) {
                    var h1 = main.find('h1.page-title-x');
                    var protocolLink =  h1.children()[0];
                    var meetingNum = Number(h1.text().split('.')[0]);
                    var voteNum =  Number(protocolLink.innerHTML.split('.')[0]);
                } else {
                    return false;
                }
            }, function (scraped) {
                if (scraped) {
                    scraped = JSON.parse(scraped);


                    var voting = {number: printNumber, name: printName, state: scraped.state};
                    //accepted, refused, ongoing
                    callback(voting) ;
                } else {
                    console.warn("scrape printHistory for " + url + " failed.");
                }
            });
        });
    });
};
