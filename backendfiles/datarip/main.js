const fs = require('fs')
const csv = require('csv-parser');
var importantdata = {}

function pullinfo(file){
    var policy = {}
    var prevPolicy
    var prevCountry
    fs.createReadStream('./data/'+file)
    .pipe(csv())
    .on('data', function(data){
        try {    
            if(data.State!=prevPolicy){
                prevPolicy = data.State
                if(prevCountry == data.Entity){
                    policy[prevCountry].push([data.Date,data.State])
                }else{
                    prevCountry = data.Entity
                    policy[prevCountry] = []
                }
            }


            //perform the operation
        }
        catch(err) {
            //error handler
        }
        
    })
    .on('end',function(){
        //some final operation
        importantdata[file]=policy
    });
}


function organize(){
    var files = fs.readdirSync('./data/')
    for(const file of files){
        pullinfo(file)
    }
}

function organized(type){
    return importantdata[type]
}






module.exports = {
    organize,
    organized,
  }