//var widget = {};
//widget={
//   init:function(){
//	   widget.componentsInit();
//   },
//   componentsInit:function(){
//	   $("#end_summernote").summernote();
//   }
//}
//widget.init();
'use strict';
var words = document.querySelector('[data-question]');
//var sentence = document.querySelector('[data-sentence]');

function resetPlaceholder() {
    var s = document.querySelectorAll('.question');
    if (!s.length) {
        placeholder.style.display = 'block';
    } else {
        placeholder.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    var drag = dragula([
        words/*,
        sentence*/
    ]);
    //btn.addEventListener('click', submit);
//    drag.on('drop', resetPlaceholder);
//    drag.on('cancel', resetPlaceholder);
});