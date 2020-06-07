var ripper = require('./ripper');
var formatter = require('./formatter');
var dateripper = require('./daterip');

var refresh = [true, false]
var month = "February"
var year = "2020"

function organize(){
    if (refresh[0]){
        if(!refresh[1]){
            ripper.getwiki(month,year)
            //rips the page in html format
            refresh[1] = true
        }
        returned = ripper.returnwiki()
        if (returned!=undefined){
            refresh[0] = false
            organizedarray = formatter.format(ripper.returnwiki())
            dateripper.pulldate(organizedarray,year)
        }
    }
}







module.exports = {
    organize,
  }