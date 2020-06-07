var main = require('./datarip/main');
function organizeData(){
  main.organize()
}
organizeData()
/*function test(i,j){
  return i
}





module.exports = {
  test,
}*/


//main loop
function intervalFunc() {
  console.log(main.organized('internal-movement-covid.csv'))
}
setInterval(intervalFunc,1000);
intervalFunc()
