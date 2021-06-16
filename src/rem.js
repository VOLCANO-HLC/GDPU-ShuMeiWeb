/*
  作者：谭锦德
  功能：不同分辨率屏幕的设配
  日期：2021.3.9
*/

;
(function(win){
  //获取window的document
  var doc =  win.document;
  //获取window的document的元素对象
  var docEle = doc.documentElement

  //动态设置rem
  function refreshRem(){
    //获取设备的宽
    let width = docEle.getBoundingClientRect().width;
    
    //设置rem，将屏幕分割为10份
    let rem = width/10;
    //重置html的rem大小
    docEle.style.fontSize = rem + 'px';
  }
  //设备切换时自动刷新rem大小
  win.addEventListener('resize',refreshRem());
})(window)