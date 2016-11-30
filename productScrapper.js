
var fs = require('fs'),
    system = require('system');

function processProductPage(targetName, outputDest) {
  console.log(targetName)
  var product = page.evaluate( function() {
    var pName = $('div.right-side > h1.display-2').text();
    var price = $('div.right-side > .price > span').text();
    var img = $('img.cloudzoom').attr('src');
    var breadcrumbs = $('div.breadcrumbs >> ol > li')
    var cat = $.makeArray(breadcrumbs.map(function(index, el) {
       var con = '';
       if ($.makeArray(el.children).length == 0) {
         con = el.innerHTML;
       } else {
         con = el.children[0].innerHTML;
       }
       return con;
     })).join();
     var p = {name: pName,
             price: price,
             img: img,
             cat: cat}
     return p;
  })
  product.productUrl = targetName;
  try {
    targetDest = targetName.split('/')
    targetDest = targetDest[targetDest.length-1]
    fs.write(outputDest + targetDest, JSON.stringify(product), 'w');
   } catch(e) {
       console.log(e);
   }
     
}

function process(){
  console.log('processing');
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
    processProductPage(currentUrl, outputDest);
  }
  page.release();
  process();
}

console.log('init');

/*
 Read the url list,
 process each product page,
 save to a file
*/
var products = fs.read('productUrls.txt');
console.log('read data:', products);
products = products.split('\n');
console.log(products);
var urls = products;
var outputDest = 'products/'


var page = require('webpage').create();

console.log('process');
process();
