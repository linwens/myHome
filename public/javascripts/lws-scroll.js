/*轮播组件*/
;(function($){
	$.fn.infiniteLoop = function(option){
		var box = this;
		var opt = $.extend({},$.fn.infiniteLoop.defaults,option);
		return this.each(function(){
			var cont = $(opt.cont);
			var slider = cont.children('li');
			var sliderNum = slider.length;
			var leftBtn = $(opt.leftBtn);
			var rightBtn= $(opt.rightBtn);
			//定义移动距离，距离等于一个轮播页的宽度
			var distance = slider.outerWidth();
			//定义定时器
			var time = null;
			var isHover = null;
			//动态设置父元素ul宽度及起始位置
			cont.css({'width':distance*(sliderNum+2),left:-distance});
			//先复制头尾轮播页，用于过渡
			slider.last().clone().prependTo(cont);
			slider.first().clone().appendTo(cont);
			//初始化banner居中
			inCenter();
			//生成点击切换的小图标
			if(sliderNum>1){//只有一张图，就是静止
				var wrapHtml = '<div id="wrap"><ul>';
					wrapHtml+='<li class="onNav"><a href="#" class="sldNav"></a></li>';//第一个加个onNav样式
					for(var i = 1;i<sliderNum;i++){ //从第二个开始遍历
						wrapHtml+='<li><a href="#" class="sldNav"></a></li>';
					}
					wrapHtml +='</ul></div>';
				box.append(wrapHtml);
				//绑定小图标与轮播图
				var wrap = box.find('#wrap');
				var sldIcon = wrap.find('li');
				wrap.on('click', 'li', function(event) {
					event.preventDefault();
					var index = $(this).index();
					onNav(index);
					wrapIcon(index);
				});
			
				autoPlay();
				//鼠标hover暂停
				box.mouseenter(function(){
					isHover = 1;
					window.clearTimeout(time);
				})
				box.mouseleave(function(){
					isHover = null;
					if(time){
						window.clearTimeout(time);
						autoPlay();
					}else{
						autoPlay();
					}
				})
				// box.hover(function(){
				// 	window.clearTimeout(time);
				// },function(){
				// 	autoPlay();
				// })
			}
			//点击按钮触发
			leftBtn.on('click',function(){
				shiftPic("left");
			});
			rightBtn.on('click',function(){
				shiftPic("right");
			});
			//轮播切换函数
			function shiftPic(dir){
				window.clearTimeout(time);
				if($(opt.cont+':animated')){//效果就是：用户点击频率会影响切换。
					$(opt.cont).stop(false,true);//控制动画点击过快。不清除动画队列，只是让当前动画立即结束
				}
				var oLeft = cont.position().left;//获取元素初始位置
					oLeft = parseInt(oLeft);//取整
				var absPos = Math.abs(oLeft);//取绝对值
				if(dir=='left'){//向左切换
					cont.animate(
						{'left':oLeft+distance},
						opt.speed,
						function(){
							if(time){
								window.clearTimeout(time);
								if(!isHover){
									autoPlay();
								}
							}else{
								if(!isHover){
									autoPlay();
								}
							}
						}
					);
					//做个判断，移动到第一张后停止
					onNav(parseInt(absPos/distance)-2);
					if(parseInt(absPos/distance )==1){//当移动到第一张
						cont.animate(
							{'left':-distance*(sliderNum)},
							0,
							function(){
								if(time){
									window.clearTimeout(time);
									if(!isHover){
										autoPlay();
									}
								}else{
									if(!isHover){
										autoPlay();
									}
								}
							}
						);
						onNav(sliderNum-1);
					}
				}else if(dir=='right'){//向右切换
					cont.animate(
						{'left':oLeft-distance},
						opt.speed,
						function(){
							if(time){
								window.clearTimeout(time);
								if(!isHover){
									autoPlay();
								}
							}else{
								if(!isHover){
									autoPlay();
								}
							}
						}
					);
					//做个判断，移动到最后一张后停止
					onNav(parseInt(absPos/distance));
					if(parseInt(absPos/distance)==sliderNum){//当移动到最后一张
						cont.animate(
							{'left':-distance},
							0,
							function(){
								if(time){
									window.clearTimeout(time);
									if(!isHover){
										autoPlay();
									}
								}else{
									autoPlay();
								}
							}
						);
						onNav(0);
					}
				}
			}
			//点击小图标跳转
			function wrapIcon(index){
				if($(opt.cont+':animated')){//效果就是：用户点击频率会影响切换。
					$(opt.cont).stop(true,true);//控制动画点击过快。不清除动画队列，只是让当前动画立即结束
				}
				cont.animate(
					{'left':-(index+1)*distance},
					opt.speed
				);
			}
			//图标添加背景的函数
			function onNav(index){
				sldIcon.eq(index).addClass('onNav').siblings().removeClass('onNav');
			}
			//自动轮播
			function autoPlay(){
				time = window.setTimeout(
					function(){
						shiftPic(opt.direction)
					},
					opt.duration
				);
			};
			//控制banner居中
			function inCenter(){
				if(parseInt(box.width())<1920){
					var shift = (1920-box.width())*0.5;
					//box.children('ul').css({'margin-left':-shift});//放轮播图的ul实时居中定位
				}else{
					box.children('ul').css({'margin-left':0});
				}
			};
			//控制窗口缩放时，banner始终居中
			var resizeT = null;//及时清空时间，避免连续拖放影响性能
			$(window).resize(function(){//窗口缩放时触发
				window.clearTimeout(resizeT);
				resizeT = window.setTimeout(inCenter,200);
			});
		})
	};
	$.fn.infiniteLoop.defaults={
		duration:2000,
		speed:1000,
		cont:'#slideCont',
		direction:'right',
		leftBtn:'#leftBtn',
		rightBtn:'#rightBtn'
	}
})(jQuery);
$(function(){
	$('#sliderBox').infiniteLoop({
	    duration:2000,//切换的时间间隔
	    speed:1000//切换一张的速度
	});
});