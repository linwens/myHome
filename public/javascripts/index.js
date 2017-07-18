$(function(){
	//导航下滑效果
	var beforeScroll = 0;
	$(window).scroll(function(){
		var afterScroll = $(this).scrollTop();
			delta = afterScroll - beforeScroll;
		if(delta===0){
			return false;
		}else if(delta>0){//向下
			if($(window).scrollTop()>0){
				$('#JS_nav').stop(true,false).animate({'top':'0px'},300);
			}
		}else{//向上
			if($(window).scrollTop()<=0){
				$('#JS_nav').stop(true,false).animate({'top':'-60px'},300);
			}
		}
		beforeScroll = afterScroll;
	});
	//banner鼠标悬浮效果
	var cont = document.getElementById('JS_parallax');
	var params = {
		centerX : cont.offsetWidth/2,
		centerY : cont.offsetHeight/2
	};
	function getSetoff(e){
		var x = e.clientX,
			y = e.clientY,
			disX = x-params.centerX,
			disY = y-params.centerY;
		moveNodes(disX,disY);
	};
	function moveNodes(disX,disY){
		var nodeList = cont.getElementsByTagName('li');
		var lens = nodeList.length;
		for(var i = 0;i<lens;i++){
			if(nodeList[i].style.zIndex==5&&nodeList[i].style.zIndex==6&&nodeList[i].style.zIndex==9){
				nodeList[i].style.marginLeft=disX*0.005*nodeList[i].style.zIndex+'px';
			}else{
				nodeList[i].style.marginLeft=disX*0.005*nodeList[i].style.zIndex+'px';
				nodeList[i].style.marginTop=disY*0.01*nodeList[i].style.zIndex+'px';
			}
			
		}
	};
	window.onload = function(){
		if(document.addEventListener){
			cont.addEventListener('mousemove',getSetoff);
			cont.addEventListener('mouseout',function(){moveNodes(0,0)});
		}else{
			cont.attachEvent('onmousemove',getSetoff);
			cont.attachEvent('onmouseout',function(){moveNodes(0,0)});
		}
	};
	//我的作品展示，划入展示效果
	function sideShow(){}
	//scroll逐级展示效果
	function gScroll(){

	}
	//'来点儿希望'彩票随机码生成js
});
