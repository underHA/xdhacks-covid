var final = undefined

function getwiki(month="January",year="2020"){
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  let wikiRequest = new XMLHttpRequest();
  
  
  let url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=Timeline_of_the_COVID-19_pandemic_in_'+month+"_"+year;
  wikiRequest.open('GET', url)
  wikiRequest.send();
  wikiRequest.onload = function() {
    let data = JSON.parse(wikiRequest.responseText);
    let array = data.query.pages;
    var finalinfo = []
    for(i in array) {
      finalinfo.push(array[i].extract)
    }
    final = (finalinfo[0])
  }
}

function returnwiki(){
  return final
}


module.exports = {
  getwiki,
  returnwiki,
}