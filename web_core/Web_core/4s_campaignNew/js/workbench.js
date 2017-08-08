//获取tab下的变量
//var allVars = getThisTabVars();
var appletId = H5AppletId;
var valueid = getThisTabVars("H5ValueId");
var h5tmpType = getThisTabVars("h5tmpType");
//是否更新h5
var isUpdateH5 = getThisTabVars("isFinished");
//是否可以切换跳转
var isComplate = true;
var currentStep = getThisTabVars("thisPageNum");
$(document).ready(function(){
initPage();

})
//初始化页面
function initPage(){
	//进行编辑
	if(valueid){
		$("."+h5tmpType+"-2").removeClass("hidden");
		$(".guide .step-2").addClass("active");
		//回显数据
		initAllPage();
		window.sessionStorage.setItem("thisPageNum",2);
		currentStep = "2";
	}else{
		$(".template-1").removeClass("hidden");
		$(".guide .step-1").addClass("active");
		//展示tamplate页
		initTemplatePage();
		window.sessionStorage.setItem("thisPageNum",1);
		currentStep = "1";
	}
}

//切换导航check的表单
function checkForms(currentStep){
	var result ;
	if(currentStep === "1"){
		result = checkTemplateFormItems();
	}else if(currentStep === "2"){
		switch(h5tmpType){
		case "Simple":
			result = checkSimpleFormItems();
			break;
		case "Long":
			result = checkLongFormItems();
			break;
		case "Multi":
			result = checkMultiFormItems();
			break;
		}
	}else if(currentStep === "3"){
		result = checkFormItems();
	}else{
		result = checkConfigFormItems();
	}
	return result;
}
var isFinished = getThisTabVars("isFinished");
//切换导航
$(".guide-item").bind("click",function(){
	//如果点击当前展现的tab
	if($(this).find(".iconfont").hasClass("active")){
		return false;
	}
	var clickNum = $(this).attr("id");
	//如果是编辑，模板页不渴点击
	 if(clickNum === "1" && isUpdateH5 === "true"){
		return false;
	} 
	 var isok = checkForms(currentStep);
	 //如果是编辑，在跳转导航的时候只需判断当前页面是否填写完整表单
	 if(isFinished === "false"){
		if(!checkPageIsComplate(currentStep,clickNum)){
			return false;
		};
	 }
	
	switch(clickNum){
	    case "1":
	    	if(!isok){
	    		return false;
	    	}
		    //点亮当前点击的导航图标
		    gotoStep1(1);
		break;
	    case "2":
	    	if(!isok){
	    		return false;
	    	}
	    	//点亮当前点击的导航图标
		    gotoStep2(2);
		break;
	    case "3":
	    	if(!isok){
	    		return false;
	    	}
	    	//点亮当前点击的导航图标
		    gotoStep3(3);	
		break;
	    case "4":
	    	if(!isok){
	    		return false;
	    	}
		    gotoStep4(4);
		break;
	}
})
var h5responseJson;
function initAllPage(){
	//initTemplatePage();

	switch(h5tmpType){
	case "Simple":
		initSimplePage();
		break;
	case "Long":
		initLongPage();
		break;
	case "Multi":
		initMultiPage();
		break;
	}
	initFormPage(h5responseJson);
	initConfigPage(h5responseJson);
}
//初始化template页面方法
function initTemplatePage(){
	  buildTemplatePage();
	  selectedTmp();
	  //绑定事件
	  $(".tmp-type").on("click",function(){
	    $(".tmp-type").css("background-color","white");
	    $(this).css("background-color","rgb(248, 248, 248)");
	    $(this).find("input").prop("checked",true); 
	    //已选择的模板存储到session中
	    if($(this).attr("id") === "tmp1"){
	    	setThisTabVars("h5tmpType","Simple");
	    }else if($(this).attr("id") === "tmp3"){
	    	setThisTabVars("h5tmpType","Multi");
	    }else if($(this).attr("id") === "tmp2"){
	    	setThisTabVars("h5tmpType","Long");
	    }else{
	    	setThisTabVars("h5tmpType","");
	    }
	  })
}
//初始化simple页面
function initSimplePage(){
    //window.sessionStorage.setItem("thisPageNum",2);
    $("#simplebtnColor").colorpicker({
      showOn: "button",
      color: "#2ea4ed"
    });
	  //button-color.change
	  $(".Simple-2 .button_color").on("change",function(){
        $(".Simple-2 .static-button").css("background-color",$(".Simple-2 .button_color").val());
	  })
	  //button-text.change
	  $(".Simple-2 .button_text").bind("input propertychange",function(){
		  if($(".Simple-2 .button_text").val().length === 0){
			  $(".Simple-2 .static-button").empty();
		  }else{
		      $(".Simple-2 .static-button").html($(".Simple-2 .button_text").val());
		  }
	  })
    buildSimplePage();
}
//初始化long页面
function initLongPage(){
	 // window.sessionStorage.setItem("thisPageNum",2);
	  $("#longbtncolor").colorpicker({
		  showOn: "button",
	      color: "#2ea4ed"
	     });
	  //button-color.change
	  $(".Long-2 .button_color").on("change",function(){
          $(".Long-2 .static-button").css("background-color",$(".Long-2 .button_color").val());
	  })
	  //button-text.change
	  $(".Long-2 .button_text").bind("input propertychange",function(){
		  if($(".Long-2 .button_text").val().length === 0){
			  $(".Long-2 .static-button").empty();
		  }else{
		      $(".Long-2 .static-button").html($(".Long-2 .button_text").val());
		  }
	  })
	  $("#editer").summernote({
	    lang: 'zh-CN',
	    height: 200,
	    //focus: true,
	    toolbar: [
	        ['style', ['bold', 'italic', 'underline', 'clear']],
	        ['fontsize', ['fontsize']],
	        ['table', ['table']],
	        ['insert', ['link', 'picture']],
	        ['para', ['paragraph']],
	        ['Misc', ['fullscreen', 'undo']]
	    ]
	  }); 
	  $(".note-editable.panel-body").css("line-height","20px");
	  $(".note-editable.panel-body").focus(function(){
	     $("#editer").parent().parent().find(".errorNote").html("");
	  }); 
	  // summernote.change
	  $('#editer').on('summernote.change', function(we, contents, $editable) {
	    //console.log('summernote\'s content is changed.');
		  $(".Long-2 .static-preview").html($("#editer").summernote('code'));
	  });
	  buildLongPage(true);
	  //选择完按钮颜色更新,flag表示页面刷新不执行updateH5操作。后续change都执行
		flag = true;
}

//初始化multi页面
function initMultiPage(){
    //window.sessionStorage.setItem("thisPageNum",2);
    $("#multibtncolor").colorpicker({
    	showOn: "button",
       color: "#2ea4ed"
      });
  //button-color.change
  $(".Multi-2 .button_color").on("change",function(){
    $(".Multi-2 .static-button").css("background-color",$(".Multi-2 .button_color").val());
    $(".Multi-2 .multi-static-button").css("background-color",$(".Multi-2 .button_color").val());
  })
  //button-text.change
  $(".Multi-2 .button_text").bind("input propertychange",function(){
	 $(".Multi-2 .static-button").html($(".Multi-2 .button_text").val());
	 $(".Multi-2 .multi-static-button").html($(".Multi-2 .button_text").val());
  })
    buildMultiPage();
}
//初始化form页面
function initFormPage(){
	  getViewId();
	  buildFormPage(h5responseJson);
}
//初始化config页面
function initConfigPage(){
    buildConfigPage(h5responseJson);
}
//下一步
function nextStep(e){
   var $this_step = $(e).parent().attr("id");
   switch($this_step){
   case "step1":
	   //检查当前页是否填写完整表单
	   if(!checkTemplateFormItems()){
		   alert("清填写完整表单");
		   return false;
	   }
	   //如果不是更新
	   if(!valueid){
		   createNewH5();
	   }
	   gotoStep2(2);
	   break;
   case "step2":
		//检查当前页是否填写完整表单
		switch(h5tmpType){
		case "Simple":
			//检查当前页是否填写完整表单
		   if(!checkSimpleFormItems()){
			   alert("清填写完整表单");
			   return false;
		   }
			break;
		case "Long":
			//检查当前页是否填写完整表单
		   if(!checkLongFormItems()){
			   alert("清填写完整表单");
			   return false;
		   }
			break;
		case "Multi":
			//检查当前页是否填写完整表单
		   if(!checkMultiFormItems()){
			   alert("清填写完整表单");
			   return false;
		   }
			break;
		}
	   gotoStep3(3);
	   break;
   case "step3":
		//检查当前页是否填写完整表单
	   if(!checkFormItems()){
		   alert("清填写完整表单");
		   return false;
	   }
	   gotoStep4(4);
	   break;
   case "step4":
	   //提交or更新h5相关信息
	   if(addAwardFlag){
		    if(checkConfigFormItems()){
		    	commitH5Info();
		    }
		  }else{
		      commitH5Info(); 
		  }
	   break;	   
   }
}
//创建新的H5
function createNewH5(){
	  var tpms = $(".template-1 input[name=tmp-type]");
	  var h5Id = "";
	  for (var i = 0; i < tpms.length; i++) {   
	      if($(tpms[i]).prop("checked") === true){
	         h5Id = $(tpms[i]).attr("data-tmpid");
	     }
	  };
	  var paramData ={
	    "tenantId":tenantId,
	    "userId":userId,
	    "appletId":appletId,
	  }
	  //获取前缀。。
		Iptools.GetJson({
			ajaxCounting:false,
		    url:"service/appletConfig",
		    data:{"tenantId":tenantId,"userId":userId,"appletId":appletId},
		    async:false,
		    success:function(data){
		    	prefix = data.rootBcGroupLinkId;
		    }
		})
	  var paramStr = "";
	  paramStr += '{';
	  paramStr += "\""+prefix+"_campaign_id\":\""+campaignId+"\",";
	  paramStr += "\""+prefix+"_campaign_template_id\":"+h5Id;
	  paramStr+= "}";
	   paramData["fieldData"] = paramStr;
	    var Ajaxtype;
	  if(valueId !=="" && valueId != null && valueId != "undefined"){
	    Ajaxtype ="put";
	    paramData["valueId"] = valueId;
	  }else{
	    Ajaxtype = "post";
	  }
	  $.ajax({
	    url:Iptools.DEFAULTS.API_URL+"service/appletData",
	    data:paramData,
	    type:Ajaxtype,
	    async:false,
	    success:function(data){
	    	if(data.retcode === "ok"){
	  	      if(Ajaxtype === "post"){
	  	    	setThisTabVars("H5ValueId",data.id);
	  	        //重新获取各种参数值
	  	        valueid = data.id;
	  	        h5tmpType = getThisTabVars("h5tmpType");
	  	        //初始化页面
	  	        initAllPage();
	  	      }	    		
	    	}

	      
	    }
	  })
}
//提交or更新表单
function commitH5Info(){
	commitShareInfo();
	  var paramData ={
	    "tenantId":tenantId,
	    "userId":userId,
	    "appletId":appletId
	  }
	  //获取前缀。。
	  Iptools.GetJson({
		ajaxCounting:false,
	    url:"service/appletConfig",
	    data:{"tenantId":tenantId,"userId":userId,"appletId":appletId},
	    async:false,
	    success:function(data){
	    	prefix = data.rootBcGroupLinkId;
	    }
	  })
	  var paramStr = "";
	  paramStr += '{';
	  //构建提交参数
	  paramStr += commitTamplateInfo();
	  switch(h5tmpType){
	  case "Simple":
		  paramStr += commitSimpleInfo();
		break;
	  case "Long":
		  paramStr += commitLongInfo();
		break;
	  case "Multi":
		  paramStr += commitMultiInfo();
		break;
	  }
	  paramStr += commitFormInfo();
	  //如果没有设置奖项，则不提交奖项相关参数
	  if(addAwardFlag){
		  paramStr += commitConfigInfo();
	  }
	  
	  paramStr+= "}";
	  paramData["fieldData"] = paramStr;
	  paramData["valueId"] = valueid;
	  //--------
	  
  //ajax提交
  Iptools.PutJson({
	 ajaxCounting:false,
    url:"service/appletData",
    data:paramData,
    async:false,
    success:function(data){
    	if(data){
    		setThisTabVars("isFinished",true);
            window.location.href="../campaignInfo/campaignInfo.html";
    	}else{
    		alert("保存失败，清稍后重试");
    	}
    }
  })
}
//跳转到step1
function gotoStep1(n){
	 //点亮当前点击的导航图标
    $(".iconfont").removeClass("active");
    $("#"+n+"").find(".iconfont").addClass("active");	
    $(".container").addClass("hidden");
    $(".template-1").removeClass("hidden");
    setThisTabVars("thisPageNum",1);
    currentStep = "1";
}
//跳转到step2
function gotoStep2(n){
	 //点亮当前点击的导航图标
    $(".iconfont").removeClass("active");
    $("#"+n+"").find(".iconfont").addClass("active");
    $(".container").addClass("hidden");
    $("."+h5tmpType+"-2").removeClass("hidden");
    setThisTabVars("thisPageNum",2);
    currentStep = "2";
}
//跳转到step3
function gotoStep3(n){
	 //点亮当前点击的导航图标
    $(".iconfont").removeClass("active");
    $("#"+n+"").find(".iconfont").addClass("active");	
    $(".container").addClass("hidden");
    $(".form-3").removeClass("hidden");
    setThisTabVars("thisPageNum",3);
    currentStep = "3";
}
//跳转到step4
function gotoStep4(n){
	 //点亮当前点击的导航图标
    $(".iconfont").removeClass("active");
    $("#"+n+"").find(".iconfont").addClass("active");
    $(".container").addClass("hidden");
    $(".config-4").removeClass("hidden");
    setThisTabVars("thisPageNum",4);
    currentStep = "4";
}
//上一步
function goback(e){
  var $this_step = $(e).parent().attr("id");
  switch($this_step){
  case "step1":
	  if(!checkTemplateFormItems()){
		  return false;
	  }
	  //创建新的h5
	  if(!valueid){
		  createNewH5();
	  }
		 //点亮当前点击的导航图标
	    $(".iconfont").removeClass("active");
	    $(".container").addClass("hidden");
	    window.location.href="createCampaign.html";
	   break;
  case "step2":
		//如果是编辑，模板页不可跳转
		 if(isUpdateH5 === "true"){
			return false;
		} 
		//检查当前页是否填写完整表单
		switch(h5tmpType){
		case "Simple":
			//检查当前页是否填写完整表单
		   if(!checkSimpleFormItems()){
			   alert("清填写完整表单");
			   return false;
		   }
			break;
		case "Long":
			//检查当前页是否填写完整表单
		   if(!checkLongFormItems()){
			   alert("清填写完整表单");
			   return false;
		   }
			break;
		case "Multi":
			//检查当前页是否填写完整表单
		   if(!checkMultiFormItems()){
			   alert("清填写完整表单");
			   return false;
		   }
			break;
		}
	  gotoStep1(1);
	   break;
  case "step3":
	   //检查当前页是否填写完整表单
	   if(!checkFormItems()){
		   alert("清填写完整表单");
		   return false;
	   }
	  gotoStep2(2);
	   break;
  case "step4":
	   //检查当前页是否填写完整表单
	   if(!checkConfigFormItems()){
		   alert("清填写完整表单");
		   return false;
	   }
	  gotoStep3(3);
	   break;
  }
}

//拼接提交的字段及字段设置的值
function buildParamStr(){
	switch(h5tmpType){
	case "Simple":
		initSimplePage();
		break;
	case "Long":
		initLongPage();
		break;
	case "Multi":
		initMultiPage();
		break;
	}
}