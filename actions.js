YUI().use('slider','anim', function (Y) {
  var current = 'time';
  var data = fifa.data.query.results.row;
  var all = data.length;
  var maxval={time:0,shots:0,passes:0,tackles:0,saves:0};
  var countries = {};
  var positions = {};
  var names = '';
  for(var i=1;i<all;i++){
    if(+data[i].time > maxval.time){maxval.time = +data[i].time;}
    if(+data[i].shots > maxval.shots){maxval.shots = +data[i].shots;}
    if(+data[i].passes > maxval.passes){maxval.passes = +data[i].passes;}
    if(+data[i].tackles > maxval.tackles){maxval.tackles = +data[i].tackles;}
    if(+data[i].saves > maxval.saves){maxval.saves = +data[i].saves;}
    countries[data[i].team] = 1;
    positions[data[i].position] = 1;
  }
  Y.one('#buttons').delegate('click',function(e){
    var id = this.get('id');
    if(current != id){
      Y.one('#'+current).removeClass('on');
    }
    Y.one('#'+id).addClass('on');
    current = id;
    addNames(maxval[id]);
    createSlider(maxval[id]);
  },'button');

  function update( e ) {
      addNames(e.newVal);
  }    
  function addNames(val){
    Y.one('#current').set('innerHTML',val);
    var names = '';
    for(var i=0;i<all;i++){
      if(+data[i][current] >= val){
        names += '<li>'+data[i].surname+' ('+data[i].position+
                 ', '+data[i].team+')</li>';
      }
    }
    Y.one('#slidenames').set('innerHTML','<ul>'+names+'</ul>');
  }
  createSlider(maxval.time);
  function createSlider(maxval){
    addNames(maxval);
    Y.one('#maxval').set('innerHTML',maxval);
    Y.one('#slider').set('innerHTML','');
    var xSlider = new Y.Slider({
        length : 300,
        min    : 0,
        max    : maxval,
        value : maxval
    });
    xSlider.after( "valueChange", update);
    xSlider.render('#slider')
  }

  fifa.old = false;
  Y.one('#fifa').append('<div id="player"></div><ul id="countries"></ul>');
  var out = '';
  for(i in countries){
    out+='<li><button>'+i+'</button></li>';
  };
  Y.one('#countries').set('innerHTML',out);

  Y.one('#fifa').append('<ul id="position"></ul>');
  var out = '';
  for(i in positions){
    out+='<li><button>'+i+'</button></li>';
  }
  Y.one('#position').set('innerHTML',out);

  Y.one('#fifa').append('<ul id="names"></ul>');

  Y.one('#position').delegate('click',function(e){
    filter('Position',this.get('innerHTML'));
  },'button');  
  Y.one('#countries').delegate('click',function(e){
    filter('Team',this.get('innerHTML'));
  },'button');  

  Y.one('#names').delegate('click',function(e){
    if(this.get('innerHTML')==='delete'){
      var an = this.ancestor('ul');
      var myAnim = new Y.Anim({node:an,to:{opacity:0},duration:.5});
      myAnim.run();
      myAnim.on('end', function() {
        var myAnim2 = new Y.Anim({node:an,to:{height:0},duration:.2});
        myAnim2.run();
        myAnim2.on('end', function() {
           an.remove();
        });
      });
    } else {
      if(this.get('innerHTML')===Y.one('#player').get('innerHTML')){
        Y.one('#player').set('innerHTML','').setY(-9999);
      } else {
        Y.one('#player').set('innerHTML',this.get('innerHTML')).
                         setX(this.getX()+100).
                         setY(this.getY()+10);
      }
    }
  },'button');  
  function r(num){
    return Math.round(num*100)/100
  }
  function filter(what,value){
    var data = fifa.data.query.results.row;
    var all = data.length;
    var names = '';
    var time=0,shots=0,passes=0,tackles=0,saves=0,count=0;
    var w = what.toLowerCase();
    for(var i=1;i<all;i++){
      if(data[i][w] === value){
        time += +data[i].time;
        shots += +data[i].shots;
        passes += +data[i].passes;
        tackles += +data[i].tackles;
        saves += +data[i].saves;
        names += '<li><button>'+data[i].surname+
                 ' <span>Country: '+data[i].team+
                 ' Position: '+data[i].position+' Time: '+
                  data[i].time+' Shots: '+data[i].shots+
                 ' Passes: '+data[i].passes+' Tackles: '+
                  data[i].tackles+' Saves: '+data[i].saves+
                 '</span></button></li>';
        count++;
      }
    }
    var n = Y.one('#names').prepend('<ul class="hid">'+
                                    '<li class="summary"><span>'+
                                     what+': '+value+'</span> Time: '+time+
                                     ' ('+r(time/count)+' average) '+
                                     'Shots '+shots+' ('+r(shots/count)+
                                     ' average) Passes '+passes+
                                     ' ('+r(passes/count)+' average) '+
                                     'Tackles '+tackles+
                                     ' ('+r(tackles/count)+' average) '+
                                     'Saves '+saves+' ('+r(saves/count)+
                                     ' average)<button>delete</button>'+
                                     '<div></div></li>'+names+'</ul>');
    var an = Y.one('#names ul');
    an.setStyle('opacity',0);
    var height = an.getStyle('height');
    an.setStyle('height',0);
    an.removeClass('hid');
    var myAnim = new Y.Anim(
      {
        node:an,
        to:{
          opacity:1,
          height:height
        },
        duration:.3
      }
    );
    myAnim.run();
  };
});
