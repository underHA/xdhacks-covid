const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]



function monthIndex(string){
  i = -1
  for (month of months){
    thismonth = string.lastIndexOf(month)
    if(thismonth > i){
      i = thismonth
    }
  }
  return i
}

function grabDate(restline){
  for(var i=0;i<15;i++){
    if((!isNaN(restline[i-1])&&(restline[i]=="."||restline[i]==","||restline[i]==" "))||i==restline.length){
      return restline.slice(0,i)
    }
  }
}



function pulldate(lines){
  datepulled = {}
  timeframe = []
  for (line of lines){

    //console.log(line)
    while(monthIndex(line)!=-1){
      start = monthIndex(line)
      if(start!=-1){
        policyDate = grabDate(line.slice(start,line.length))

        periodposition = line.lastIndexOf(".",start)
        if(periodposition!=-1){
          if(policyDate!=undefined){
            timeframe.push([policyDate,line.slice(periodposition+2,line.length)])
          }
          line = line.slice(0,periodposition)
        }else{
          if(policyDate!=undefined){
            timeframe.push([policyDate,line])
          }
          break
        }
      }else{
        break
      }
    }
  }
  console.log(timeframe)



}

module.exports = {
  pulldate,
}