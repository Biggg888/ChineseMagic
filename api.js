var latestToggle=null;
var searchInput = document.getElementById('search');
function trim(x){
  return x.replace(/^\s+|\s+$/gm, '');
}
function toggle(a){
  if (trim(searchInput.value).length > 0) {
    return;
  }
  latestToggle = a;
  var li = a.parentNode;
  var ol = li.getElementsByTagName('ol')[0];
  var ols = document.getElementsByTagName('ol');
  for(var i=0,j=ols.length;i<j;i++){
    var o = ols[i];
    o.style.display = o==ol?'block':'none';
  }
}
(function(W,D){
  var addEvent = function(el,v,func){
    try{
      el.attachEvent('on' + v,function(e){func.call(el,W.event||e);});
    }catch(ex){}
    try{
      el.addEventListener(v,function(e){func.call(el,W.event||e);},false);
    }catch(ex){}
  };
  var setClass = function(o,s){
    try{
      o.className=s;
    }catch(e){
      o.setAttribute('class',s);
    }
  };
  var throttle = function(fn,delay,atleast){
    var timer = null;
    var previous = null;
    return function(){
      var now = +new Date();
      if(!previous) previous = now;
      if(atleast && now - previous > atleast){
        fn();
        previous = now;
        clearTimeout(timer);
      } else {
        clearTimeout(timer);
        timer = setTimeout(function(){
          fn();
          previous = null;
        }, delay);
      }
    }
  };
  var as = [];
  var ols = D.getElementsByTagName('ol');
  for(var i=0,j=ols.length;i<j;i++){
    var o = ols[i];
    var l = o.getElementsByTagName('a');
    for(var x=0,y=l.length;x<y;x++){
      as.push(l[x]);
    }
  }
  for(var i=0,j=as.length;i<j;i++){
    as[i].onclick=function(){
      var that = this;
      var href = that.href;
      if(href.indexOf('/')>-1){
        href = href.substr(href.lastIndexOf('/')+1);
      }
      if ('index.html' != href) {
        location.hash = href;
      }
      for(var x=0,y=as.length;x<y;x++){
        var o = as[x];
        setClass(o,o==that?'active':'');
      }
    };
  }
  
  var hash = location.hash;
  if(hash.indexOf('#')==0){
    var href = hash.substr(1);
    D.getElementById('doc').src=href;
    for(var i=0,j=as.length;i<j;i++){
      var a = as[i];
      if(href==a.getAttribute('href')){
        setClass(a,'active');
        var p = a.parentNode.parentNode.parentNode;
        var t = p.getElementsByTagName('a')[0];
        toggle(t);
      }else{
        setClass(a,'');
      }
    }
  }
  
  var renderSearch = function(){
    var v = trim(searchInput.value).toUpperCase();
    if (v.length < 1) {
      for(var i=0,j=as.length;i<j;i++){
        as[i].parentNode.style.display = '';
      }
      if(latestToggle){
        toggle(latestToggle);
      }
    } else {
      for(var i=0,j=as.length;i<j;i++){
        var a = as[i];
        var li = a.parentNode;
        if (a.innerHTML.toUpperCase().indexOf(v) > -1) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      }
      var ols = document.getElementsByTagName('ol');
      for(var i=0,j=ols.length;i<j;i++){
        var o = ols[i];
        o.style.display = 'block';
      }
    }
  }
  
  var doSearch = throttle(renderSearch,100,500);

  addEvent(searchInput, 'input', doSearch);
  addEvent(searchInput, 'propertychange', doSearch);
})(window,document);