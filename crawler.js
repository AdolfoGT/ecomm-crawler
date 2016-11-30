
var fs = require('fs'),
    system = require('system');
    
/*
*/

function processPage(targetName, outputDest, successCallback) {
    pageI += 1;
    console.log('page: ' + pageI);
    page.render('example.png');
    // write to folder the links
    var ua = page.evaluate(function() {
        var content = $('.products-listing > li > a').map(function (index,el,arr){
          return window.location.protocol + '//' + window.location.hostname + el.getAttribute('href');
        });
        
        return $.makeArray(content).join('\n');
    });
    console.log(ua);
     
    try {
          fs.write(outputDest, '\n' + ua, 'a');
     } catch(e) {
         console.log(e);
     }
    
    // if possible continue to next page
    var next = page.evaluate(function() {
      if (!$('.icon.next-icon')) {
        return false;
      }
      if ($('.icon.next-icon').length == 0) {
        return false;
      }
      return !$('.icon.next-icon').hasClass('inactive')
    });
    if (next) {
      page.evaluate(function() {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        document.querySelector(".icon.next-icon").dispatchEvent(ev);
      });
      setTimeout(function (){
          processPage(targetName,outputDest, successCallback);
      }, 2000);
    } else {
      successCallback();
    }
}


function process(){
  console.log('processing');
  console.log(urls);
	if (urls.length == 0){
		phantom.exit();
	} else {
		var url = urls.pop();
		page = require('webpage').create();
		page.open(url, onFinishedLoading)
	}
}

function onFinishedLoading(status){
  console.log('onFinishedLoading')
  if(status === "success") {
    var currentUrl = page.evaluate(function() {
			return document.location.href;
		});
    console.log('Loading ' + currentUrl + ' finished with status: ' + status);
    //var product = page.evaluate( funtion() {});
    pageI = 0;
    processPage(currentUrl, outputDest, function() {
      page.release();
      process();
    });
  }
		
}

// list of urls to crawl
var urls = [
]


var page = require('webpage').create();
var pageI = 0;
var outputDest = 'productUrls.txt'
process();
