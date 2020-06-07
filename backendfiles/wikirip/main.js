var ripper = require('./ripper');
var formatter = require('./formatter');

var refresh = [true, false]


function organize(){
    if (refresh[0]){
        if(!refresh[1]){
            ripper.getwiki('Timeline_of_the_COVID-19_pandemic_in_Canada')
            refresh[1] = true
        }
        returned = ripper.returnwiki()
        if (returned!=undefined){
            formatter.format(ripper.returnwiki())
            refresh[0] = false
        }
    }
}







module.exports = {
    organize,
  }