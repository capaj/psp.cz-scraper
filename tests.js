var scraper = require('./main.js');

scraper.scrapePrintHistory('http://www.psp.cz/sqw/historie.sqw?t=834', function (history) {
    console.log("scraped: " + history);
});