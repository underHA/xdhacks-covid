//turns html into nice array of strings

function format(html){
    lines = []
    while(true){
        initial = html.indexOf('<p>')
        final = html.indexOf('</p>')
        if(initial!=-1){
            topush = html.slice(initial+3,final)
            if(topush.slice(topush.length-1,topush.length)=="\n"){
                topush = topush.slice(0,topush.length-1)
            }
            lines.push(topush)
            html = html.slice(final+1,html.length)
        }else{
            break
        }

    }
    return lines
}




module.exports = {
    format,
  }