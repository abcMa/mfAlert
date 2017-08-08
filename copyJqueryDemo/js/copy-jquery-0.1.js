/**
 * Created by mafang on 2017/7/18.
 */

var $ = function(dom){

    if(dom == null){
        return false;
    }
    //判断是什么选择器
    /**
     * *-所有元素
     * .dom-类选择器
     * #dom-id选择器
     * dom-标签选择器
     * dom[attr=val]-属性选择器
     * 等选择器
     */
    var curObj = $.selector(dom);

    var $this = {
        css : function(ops,val){
            if(!ops){
                return false;
            }
            //以对象的方式传参
            if(ops instanceof Object){
                for(var index in ops){
                    curObj.style[index] = ops[index];
                }
            }else{//以key,value的方式传参
                curObj.style[ops] = val;
            }
        },
        hide:function(){
            curObj.style.display = "none";
        },
        show:function(type){
            if(type){
                if(type == "inline"){
                    curObj.style.display = "inline";
                }else if(type == "inlineBlock"){
                    curObj.style.display = "inline-block";
                }
            }else{
                curObj.style.display = "block";
            }

        },
        on:function(type,target,fn){

        }
    }
    return $this;
}


//暂且只支持id选择器
$.selector = function(id){
    //判断是否是字符串
    if(typeof id != "string"){
      return false;
    }
    return document.getElementById(id.split("#")[1]);

}