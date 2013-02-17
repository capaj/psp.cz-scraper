This is early version of special-purpose built scraper. It's purpose is to scrape czech parliament webpage found here:
http://www.psp.cz/
and provide the data back. I need this data for another pet project of mine. I decided to make a scraper public module,
 because I wan't to showcase my usage of PhantomJS and also it is convenient for me.
There are just few datamodels which will be implemented:
(model              ----    example URL)
printHistory        ----    http://www.psp.cz/sqw/historie.sqw?t=834
parliamentMember    ----    http://www.psp.cz/sqw/detail.sqw?id=5953
pspVoting           ----    http://www.psp.cz/sqw/hlasy.sqw?g=57421
pspMeetingAgenda    ----    http://www.psp.cz/sqw/ischuze.sqw?s=51

In case you have any questions, feel free to ask them on github, g+ or via email.