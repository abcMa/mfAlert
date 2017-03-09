(function($) {
	var soptions={
    		"appletid":null,//appletId
    		"selectOnChange":true,//selected时是否触发搜索事件
    		"inputOnChange":true,//input时是否触发搜索事件
    		"afterChangeSearch":null,//搜索事件之后的回调函数
    		"conditionApplet":null
    };
	//扩展jquery方法
	$.fn.extend({
        "buildConditionByAppletId": function (options) {
        	var result = "";
            Iptools.uidataTool._getUserlistAppletData({
                  appletId: options.appletid,
                  async: false
              }).done(function (rt) {
                if(rt){
                	result = widget.getConditionByData(rt);
                }
            })
            soptions.conditionApplet = options.appletid;
            $(this).append(result);
            //select bind onchange 事件
            if(options.selectOnChange){
            	widget.changeSelectCondtion({"callBack":options.afterChangeSearch});
            }
            //input bind onchange 事件
            if(options.inputOnChange){
            	widget.changeInputCondtion({"callBack":options.afterChangeSearch});
            }
            // return options;
        }
    });
	
	var widget = {
		//check term 
		 checkNull:function(term){
			 var ret = false;
			 if(typeof str === "string" && str.length !== 0){
				 ret = true;
			 }else if(typeof str === "undefined"){
				 ret = true;
			 }else if(str != null){
				 ret = true;
			 }else if(!str){
				 ret = true;
			 }else{
				 ret = false;
			 }
			 return ret;
		 },
	    //获取每个条件
	    getConditionByData:function(data){
	    	var ret="";
	    	if(data.columns){
	    		var cobjs=data.columns;
	    		for(var i=0;i<cobjs.length;i++){
	    			if(cobjs[i].allowOutterQuery){
	    				ret += widget.renderConditionByColumns(cobjs[i]);
	    			}
	    			
	    		}
	    	}
	    	return ret;
	    },
	    //根据类型渲染条件
	    renderConditionByColumns:function(columnItem){
	    	var html = "";
	    	if(columnItem){
	    		var colObj=columnItem;
	    		var $d = $(document.createElement("div")),
	            $lab = $(document.createElement("lable")),
	            $sl = $(document.createElement("select")),
	            $it = $(document.createElement("input"));
	    		$d.attr("class", "col-md-2 col-sm-2 cds-item");
	    		$sl.addClass("form-control cds-select");
	    		$it.addClass("form-control cds-input");
	    		var colType = columnItem.type;
	    		var html="";
	    		switch (colType){
	    		case "text"://input
	    			$it.attr("data-column",colObj.column);
	    			$it.attr("placeHolder",colObj.name);
	    			$d.append($it);
	    			html = $d[0].outerHTML;
	    			break;
	    		case "select"://select
	    			$sl.attr("data-column",colObj.column);
	    			var picobj=colObj.pickList;
	    			$sl.append('<option value="-1">请选择'+colObj.name+'</option>');
	    			for(var i=0;i<picobj.length;i++){
	    				$sl.append('<option value="'+picobj[i].id+'">'+picobj[i].name+'</option>');
	    			}
	    			$d.append($sl);
	    			html = $d[0].outerHTML;
	    			break;
	    		case "count":
	    			break;
	    		}
	    	}
	    	return html;
	    },
	    //onchange-Select触发筛选
	    changeSelectCondtion:function(obj){
	    	var $slct = $(".cds-item .cds-select");
	    	$slct.change(function(){
	    		widget.searchByCondition({"condition":widget.buildSearchCondition(),"callBack":obj.callBack});
	    	})
	    },
	  //onchange-input触发筛选
	    changeInputCondtion:function(obj){
	    	var $ipt = $(".cds-item .cds-input");
	    	$ipt.change(function(){
	    		widget.searchByCondition({"condition":widget.buildSearchCondition(),"callBack":obj.callBack});
	    	})
	    },
	    //拼condition
	    buildSearchCondition:function(){
	    	var condition={};
	    	var ipts = $(".cds-item .cds-input");
	    	var selets=$(".cds-item .cds-select");
	    	//input
	        for(var i = 0 ; i < ipts.length ; i++){
	        	var key=$(ipts[i]).attr("data-column");
	        	var val=$(ipts[i]).val();
	        	if(val !== ""){
	        		condition[key] = " like '%" + val + "%'";
	        	}
	        }
	        //select
	        for(var j = 0 ;j < selets.length ; j++){
	        	var key=$(selets[j]).attr("data-column");
	        	var val=$(selets[j]).val();
	        	if(val !== ""){
	        		condition[key] = "='" + val + "'";
	        	}
	        }
	        return condition;
	    },
	    //搜索
	    searchByCondition:function(optsObj){
	    	var condition = optsObj.condition ? optsObj.condition:widget.buildSearchCondition;
	    	Iptools.uidataTool._getUserlistAppletData({
	            appletId: soptions.conditionApplet,
	            async: false,
	            condition: JSON.stringify(condition),
	            pageNow: 1,
	            pageSize: 100
	        }).done(function (rt) {
	        	if(rt){
	        		if(optsObj.callBack){
	        			optsObj.callBack(rt);
	        		}
	        	}
	        })
	    }
	}
	
})(jQuery)
