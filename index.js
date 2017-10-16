/**
 * Created by Administrator on 2017/10/13.
 */
(function(root,doc,factory){
    if(typeof define==="function"&& define.amd){
        define(["jquery"],function($){
            return factory($);
        })
    }else{
        factory(root.jQuery);
    }
  }(this,document,function($){
    $.fn.esign=function(canvasEdit,sign_show,sign_clear,sign_ok){
        var domMap=domInit(canvasEdit,sign_show,sign_clear,sign_ok);
        var canvas=domMap.canvasEdit[0];
        // console.log(canvas.toDataURL());
        if(typeof document.ontouchstart != "undefined"){/*移动端适配*/
            canvas.addEventListener("touchmove",onMouseMove,false);
            canvas.addEventListener("touchstart",onMouseDown,false);
            canvas.addEventListener("touchend",onMouseUp,false);
        }else{ /*pc适配*/
            canvas.addEventListener("mousemove",onMouseMove,false);
            canvas.addEventListener("mousedown",onMouseDown,false);
            canvas.addEventListener("mouseup",onMouseUp,false);
            canvas.addEventListener("mouseleave",onMouseUp,false);
        }
        
        var context=canvas.getContext("2d");
        var linex = new Array();
        var liney = new Array();
        var linen = new Array();
        var lastX = 1;
        var lastY = 30;
        var flag = 0;
        
        //注册按钮点击事件
        domMap.sign_ok.on("click",function(){
            preview();
          rewrite();
        });
        
        domMap.sign_clear.on("click",function(){
          clearImg();
          rewrite();
        });
       
      /*清除图片*/
      function clearImg(){
        console.log(domMap.sign_show[0]);
        domMap.sign_show[0].innerHTML = "";
        
      }
      
        /*根据坐标获取绘图坐标*/
        function getCanvasPos(canvas , evt){
            var rect = canvas.getBoundingClientRect();
            var x,y;
            if(evt.targetTouches){
                x=evt.targetTounches[0].clientX;
                y=evt.targetTounches[0].clientY;
            }else{
                x=evt.clientX;
                y=evt.clientY;
            }
            return {
                x:(x - rect.left) * (canvas.width/rect.width),
                y:(y - rect.top) * (canvas.height/rect.height)
            }
        }
        
        
        /*传参默认dom*/
        function domInit(canvasEdit,sign_show,sign_clear,sign_ok){
            var domMap = {};
            if(!canvasEdit){
                domMap.canvasEdit = $("#canvasEdit");
            }else{
                domMap.canvasEdit = $("#"+canvasEdit);
            }
            if(!sign_show){
                domMap.sign_show = $("#sign_show");
            } else{
                domMap.sign_show = $("#" + sign_show);
            }
            
            if(!sign_clear){
                domMap.sign_clear = $("#sign_clear");
            } else{
                domMap.sign_clear = $("#" + sign_clear);
            }
            
            if(!sign_ok){
                domMap.sign_ok = $("#sign_ok");
            } else{
                domMap.sign_ok = $("#" + sign_ok);
            }
            return domMap;
        }
  
      //鼠标移动的时候
      function onMouseMove(evt)
      {
        var x = getCanvasPos(canvas, evt).x;
          y = getCanvasPos(canvas, evt).y;
    
        //判断是否处于按下状态
        if (flag == 1) {
          //如果是则画图
          linex.push(x);
          liney.push(y);
          linen.push(1);
          context.save();
          context.translate(context.canvas.width / 2, context.canvas.height / 2);
          context.translate(-context.canvas.width / 2 , -context.canvas.height/2);
          context.beginPath();
          context.lineWidth = 2;
          for (var i = 1; i < linex.length; i++) {
            lastX = linex[i];
            lastY = liney[i];
            if (linen[i] == 0)
              context.moveTo(lastX, lastY);
            else
              context.lineTo(lastX, lastY);
          }
          context.shadowBlur = 10;
          context.stroke();
          context.restore();
        }
        evt.preventDefault();
      }
  
      //当鼠标按下的时候修改按下标志，并开始记录坐标
      function onMouseDown(evt) {
        var x = getCanvasPos(canvas, evt).x,
          y = getCanvasPos(canvas, evt).y;
        flag = 1;
        linex.push(x);
        liney.push(y);
        linen.push(0);
      }
  
      //鼠标松开清除标志
      function onMouseUp() {
        flag = 0;
      }
      
      
      /*rewrite*/
      function rewrite(){
          linex=new Array();
          liney=new Array();
          linen=new Array();
            console.log(canvas.width);
          context.clearRect(0,0,canvas.width,canvas.height);
      }
      
      /*图片保存*/
      function preview(){
         var show=domMap.sign_show[0];
         show.innerHTML="";
         // show.appendChild(converImgTo(canvas));
        $(show).append(converImgTo(canvas));
      }
      
      function converImgTo(c){
        var image = new Image();
        image.width = 80;
        image.height = 50;
        image.src = canvas.toDataURL("i/png");
        return image;
          var img=new Image();
          img.width=80;
          img.height=30;
          img=c.toDataURL("i.png");
            return img;
      }
    }
    return $.fn.esign;
}))