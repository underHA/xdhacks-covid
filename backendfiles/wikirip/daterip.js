const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]




function pulldate(lines,year){
  currentDate = []
  timeframe = []

  for (line of lines){
    if(line[0]=="EVENTDATE"){
      dateFix = line[1].split(" ")

      if(dateFix.length==2){
        if(dateFix.length==2){
          dateFix.push(year)
        }
      }
      currentDate = dateFix
      continue
    }
    

    timeframe.push([currentDate,line])
  }
  console.log(timeframe)



}

module.exports = {
  pulldate,
}