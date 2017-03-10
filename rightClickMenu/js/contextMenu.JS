(function($){
	$.fn.extend({
		"bindContextMenu":function(){
			widget.domReady();
			//增加contextmenu事件,匿名函数直接把事件对象保存到内存中（知识点：为什么widget.onContextMenu()不可以）
			$(this)[0].addEventListener('contextmenu',function(e){
				e.preventDefault();
			    widget.showMenu(e.pageX, e.pageY);
			    document.addEventListener('mousedown', onMouseDown, false);
			} , false);
		}
	})
	function onMouseDown(e){
	    widget.hideMenu();
	    document.removeEventListener('mousedown', onMouseDown);
	}
	var widget ={
		param:{
			menu:""
		},
		domReady:function(){
			var html = "";
			html +='<menu class="contextMenu">'+
				'<li class="menu-item cur-refresh">刷新</li>'+
				'<li class="menu-item cur-close">关闭当前</li>'+
				'<li class="menu-item other-close">关闭其他</li>'+
				'<li class="menu-separator"></li>'+
				'<li class="menu-item all-close">关闭所有</li>'+
			    '</menu>';
	        $("body").append(html);
	        widget.param.menu = $('.contextMenu');
		},
		//var menu = document.querySelector('.contextMenu');
		//showmenu并移动到光标位置
		showMenu:function (x, y){
			widget.param.menu.css("left",x + 'px');
			widget.param.menu.css("top",y + 'px');
		    widget.param.menu.addClass('show-menu');
		},
		hideMenu :function (){
			widget.param.menu.removeClass('show-menu');
		},
		/*
		 * show右键的menu,同时增加鼠标点击事件，只要鼠标点击就会hidemenu
		 */
//		onContextMenu:function (e){
//		    e.preventDefault();
//		    widget.showMenu(e.pageX, e.pageY);
//		    document.addEventListener('mousedown', onMouseDown, false);
//		},
		/*
		 * 鼠标点击事件之后以藏menu，同时解除按下事件
		 */
		onMouseDown:function (e){
		    widget.hideMenu();
		    //sdocument.removeEventListener('mousedown', widget.onMouseDown());
		}
	}
	
	

})(jQuery)