(function($){
	$.fn.extend({
		"bindContextMenu":function(){
			//增加contextmenu事件
			$(this)[0].addEventListener('contextmenu', onContextMenu, false);
		}
	})
	var html = "";
			html +='<menu class="contextMenu">'+
				'<li class="menu-item">刷新</li>'+
				'<li class="menu-item">关闭当前</li>'+
				'<li class="menu-item">关闭其他</li>'+
				'<li class="menu-separator"></li>'+
				'<li class="menu-item">关闭所有</li>'+
			    '</menu>';
	$("body").append(html);
	var menu = document.querySelector('.contextMenu');
	//showmenu并移动到光标位置
	function showMenu(x, y){
	    menu.style.left = x + 'px';
	    menu.style.top = y + 'px';
	    menu.classList.add('show-menu');
	}
	function hideMenu(){
	    menu.classList.remove('show-menu');
	}
	/*
	 * show右键的menu,同时增加鼠标点击事件，只要鼠标点击就会hidemenu
	 */
	function onContextMenu(e){
	    e.preventDefault();
	    showMenu(e.pageX, e.pageY);
	    document.addEventListener('mousedown', onMouseDown, false);
	}
	/*
	 * 鼠标点击事件之后以藏menu，同事解除书店按下事件
	 */
	function onMouseDown(e){
	    hideMenu();
	    document.removeEventListener('mousedown', onMouseDown);
	}
})(jQuery)