(function($){
	$.fn.extend({
		"bindContextMenu":function(){
			widget.init();
			//增加contextmenu事件,匿名函数直接把事件对象保存到内存中（知识点：为什么widget.onContextMenu()不可以）
			document.addEventListener('contextmenu',function(e){
				e.preventDefault();
			    widget.showMenu(e.pageX, e.pageY);
			    //document.addEventListener('mousedown', onMouseDown, false);
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
		init:function(){
			widget.domReady();
			widget.param.menu = $('.contextMenu');
			widget.bindEventAfterDomReady();
		},
		bindEventAfterDomReady:function(){
			widget.refreshCurrentTab();
			widget.documentClick();
			widget.closeAllTabs();
			widget.closeOtherTab();
			widget.currentTab();
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
		documentClick:function(){
			$(document).on("click",function(e){
        		var clkArea = $(e.target);
        		if(!clkArea.hasClass("contextMenu")){
        			widget.hideMenu();
        		}
        	})
		},
        refreshCurrentTab:function(){
        	$(".cur-refresh").on("click",function(){
        		widget.hideMenu();
        		location.reload();
        	})
        },
        closeAllTabs:function(){
        	$(".all-close").on("click",function(){
        		widget.hideMenu();
        	})
        },
        closeOtherTab:function(){
        	$(".other-close").on("click",function(){
        		widget.hideMenu();
        	})
        },
		currentTab:function(){
			$(".cur-close").on("click",function(){
        		widget.hideMenu();
        	})
        }
	}
	
	

})(jQuery)