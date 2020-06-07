var ripper = require('./ripper');
var formatter = require('./formatter');
var dateripper = require('./daterip');

var refresh = [true, false]
var country = "Canada"

function organize(){
    if (refresh[0]){
        if(!refresh[1]){
            ripper.getwiki(country)
            //rips the page in html format
            refresh[1] = true
        }
        returned = ripper.returnwiki()
        if (returned!=undefined){
            refresh[0] = false
            organizedarray = formatter.format(ripper.returnwiki())
            dateripper.pulldate(organizedarray)
        }
    }
}







module.exports = {
    organize,
  }