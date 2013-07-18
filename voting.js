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
                    var voteItems = main.find('li');
                    if (voteItems.length === 200) {
                        var allVotes = [];
                        for (var i = 0; i < voteItems.length; i++) {
                            var vote = voteItems[i];
                            var span = vote.firstElementChild;
                            var attr = span.attributes[0].value;
                            var voteVal = attr.split(' ')[1];
                            var atag = vote.children[1];
                            var name = atag.innerText;
                            allVotes.push({name: name, val: voteVal});
                        }
                        var ret = {
                            votes: allVotes,
                            h1: h1,
                            meeting: meetingNum,
                            voteNumber: voteNum
                        };
                        return JSON.stringify(ret);


                    } else {
                        console.warn("scrape voting for " + url + " failed. We counted " + voteItems.length + " votes.");
                    }
                } else {
                    return false;
                }
            }, function (scraped) {
                if (scraped) {
                    callback(JSON.parse(scraped));
                } else {
                    console.warn("scrape voting for " + url + " failed.");
                }
            });
        });
    });
};
