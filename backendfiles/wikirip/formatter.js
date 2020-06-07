//turns html into nice array of strings

function format(html){
    lines = []
    while(true){
        initial = [html.indexOf('<p'),html.indexOf('<h3')]
        if(initial[0]<initial[1]||initial[1]==-1){
            final = html.indexOf('</p>')
            initial = initial[0]
            if(initial!=-1){
                topush = html.slice(initial+3,final)
                if(topush.slice(topush.length-1,topush.length)=="\n"){
                    topush = topush.slice(0,topush.length-1)
                }



                index = topush.indexOf("<i")
                while(index!=-1){
                    topush=topush.slice(0,index)+topush.slice(index+3,topush.length)
                    index = topush.indexOf("<i")
                }
                index = topush.indexOf("</i>")
                while(index!=-1){
                    topush=topush.slice(0,index)+topush.slice(index+4,topush.length)
                    index = topush.indexOf("</i>")
                }



                if(lines.length!=0){
                    lines.push(topush)
                }
                html = html.slice(final+1,html.length)
            }else{
                break
            }
        }else{
            final = html.indexOf('</h3')
            initial = initial[1]
            if(initial!=-1){
                topush = html.slice(initial+14,final-7)
                topush = topush.slice(topush.lastIndexOf(">")+1,topush.length)


                lines.push(["EVENTDATE",topush])
                html = html.slice(final+2,html.length)
            }else{
                break
            }
        }
        

    }
    return lines
}




module.exports = {
    format,
  }