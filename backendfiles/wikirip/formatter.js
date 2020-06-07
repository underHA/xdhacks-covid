function format(html){
    lines = []
    while(true){
        initial = html.indexOf('<p>')
        final = html.indexOf('</p>')
        if(initial!=-1){
            lines.push(html.slice(initial,final))
            html = html.slice(final+1,html.length)
        }else{
            break
        }

    }
    
    console.log(lines)
}




module.exports = {
    format,
  }