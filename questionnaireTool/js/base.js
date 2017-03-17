var widget = {};
widget={
   init:function(){
	   widget.componentsInit();
   },
   componentsInit:function(){
	   $("#end_summernote").summernote();
   }
}
widget.init();