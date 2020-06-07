var main = require('./wikirip/main');
/*function test(i,j){
  return i
}





module.exports = {
  test,
}*/



function intervalFunc() {
  main.organize()
}
setInterval(intervalFunc,1000);
intervalFunc()