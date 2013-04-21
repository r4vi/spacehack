### 
Nasa 2005 scrape
###

casper = require("casper").create({
  clientScripts: ['components/jquery/jquery.js',
  'components/underscore/underscore.js']
})
helpers = require("./helpers")

tocLinks = []
images = []
base = ''
year = 2011
finder = "http://technology.nasa.gov/?t=techfinder"

getBlurb = (self, title) ->
  self.thenOpen finder, ->
    self.echo 'opened tech xfer portal, looking for ' + title
    self.click 'div#cat_so'
    self.waitUntilVisible('div#cat_so.cat_selected', ->
      sr = @evaluate ->
        $('input#main_keyword_search').val("\"#{title}\"")
        $('button#search_button').click()
        console.log $('div#search_data').visible()
        
      @waitUntilVisible('div#search_data', ->
        pr_link = @evaluate ->
          $('.node_title > a').first().attr('href')
        @echo "press release at #{pr_link}"
        if pr_link
          @thenOpen pr_Link, ->
            @echo 'wtf on pr page ' + @getCurrentUrl()
        else
          title = 'no blurb found'
      ,-> @echo 'timedout', 20000)
    , -> @echo 'outer timeout', 15000)
  title


dump = (self, obj) ->
  self.echo "dumping data to json (out/2011.json)"
  fs = require "fs"
  fs.write("out/2011.json", JSON.stringify(obj), 'w')

casper.on 'remote.message', (msg) ->
  @echo "r:#{msg}"

casper.start "http://spinoff.nasa.gov/Spinoff2011/toc_2011.html", ->
  current = @getCurrentUrl()
  base = current.substring(0, current.lastIndexOf("/")+1)
  abs = (b, c) ->
    helpers.absoluteUri(b,c)
  
  @echo 'GOGOGO'
  tocLinks = @evaluate(->
    temp = []
    $('tr[valign=middle] a').each ->
      temp.push({href: $(this).attr('href'), text: $(this).text()})
    return temp)
  tocLinks = tocLinks.map (item) ->
    item.href = abs(base, item.href)
    item

  tocLinks = tocLinks.slice(0,2)
  casper.each (x['href'] for x in tocLinks), (self, link) ->
    @thenOpen link, ->

      current = @getCurrentUrl()
      base = current.substring(0, current.lastIndexOf("/")+1)
      @echo "#{@getTitle()} - #{link}"
      [story, image] = @evaluate -> [$('.story').text(), $('.story').find('img').first().attr('src')]
      c = @
      tocLinks = tocLinks.map (item) ->
        if item.href == link
          item.image = abs(base,image)
          #item.story = story
        item
  

casper.run ->
  dump @, tocLinks
  @exit()
