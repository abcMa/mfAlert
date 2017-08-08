//当前页导航页数
var thisPageNum = 0;
Iptools.Start();
//如果编辑已经创建好的h5页面。选择模板是不可点击
if(getThisTabVars("isFinished") === "true"){
  $(".chooseTmp").css("color","gray");
}
//点击创建h5宣传页的导航
$(".chooseTmp").click(function(){
  if(checkformPageComplate($(this).attr("id"))){
    if(getThisTabVars("isFinished") === "true"){
      return false;
    }else{
      $(this).css("color","black");
      window.location.href="H5Template.html";
    }
  };
   
});

$(".baseInfo").click(function(){
  if(checkformPageComplate($(this).attr("id"))){
    if(getThisTabVars("h5tmpType") === "Simple"){
      window.location.href="H5SimplePage.html";
    }else if(getThisTabVars("h5tmpType") === "Multi"){
      window.location.href="H5MultiPage.html";
    }else{
      window.location.href="H5LongPage.html";
    }    
  };

});

$(".formConfig").click(function(){
   if(checkformPageComplate($(this).attr("id"))){
    window.location.href="H5FormPage.html";    
 }
});

$(".marketingConfig").click(function(){
   if(checkformPageComplate($(this).attr("id"))){
     window.location.href="H5MarketConfigPage.html";    
   };

});

/*
*点击导航菜单检查当前页面是否完整，如果完整需要把当前页面的表单提交
*/
//checkformPageComplate
function checkformPageComplate(nextPageNum){
  //首先检查当前页是否完整，不完整就不能跳转
  if(!checkFormItems()){
    return false;
  }
  
  var PageNum = parseInt(getThisTabVars("thisPageNum"));
  var isComplate = true;
  //跳到下一步
  if(parseInt(nextPageNum) - PageNum === 0 ||parseInt(nextPageNum) - PageNum === 1){
    //判断当前页是否完整
    if(getThisTabVars("isComplatePage"+PageNum+"") === "true"){
      isComplate = true;
    }else{
      isComplate = false;
    }
    
  //中间隔一步
  }else if(parseInt(nextPageNum) - PageNum === 2){
    //判断当前页和当前页的下一页是否完整
    if(getThisTabVars("isComplatePage"+PageNum+"") === "true" && getThisTabVars("isComplatePage"+(PageNum+1)+"") === "true"){
      isComplate = true;
    }else{
      isComplate = false;
    }
  //中间隔2步
  }else if(parseInt(nextPageNum) - PageNum === 3){
    //判断当前页和当前页的下一页,以及下一页的下一页是否完整
    if(getThisTabVars("isComplatePage"+PageNum+"") === "true" && getThisTabVars("isComplatePage"+(PageNum+1)+"") === "true" && getThisTabVars("isComplatePage"+(PageNum+2)+"") === "true"){
      isComplate = true;
    }else{
      isComplate = false;
    }
  //点之前的步骤
  }
  // if(addAwardFlag){
  //   if(checkAwardInfo()){
  //     commitInfo();
  //   }
  // }
  if(isComplate){
   nextStep();   
  }

  return isComplate;
}
//上传微信分享时显示logo
function addShareImg(e){
  $(e).attr("data-val",getImgUrl($(e),API_URL,tenantId,"pic"));
  $(".share-img").attr("src",SERVER_URL+getImgUrl($(e),API_URL,tenantId,"pic"));
  PutCampaignHeadPic(SERVER_URL+getImgUrl($(e),API_URL,tenantId,"pic"));
}
//提交分享至微信显示信息
function commitShareInfo(){
  var wxLogoStr =""; 
  if ($(".wx_share_logo").val() === "" &&$(".wx_share_title").val() === "" && $(".wx_share_des").val() === "") {
	  wxLogoStr = SERVER_URL+$(".wx_share_logo").attr("data-val");
	  return false;
  }else{
	  wxLogoStr = $(".share-img").attr("src");
  }
  var paramStr = "";
  var paramData ={
    "tenantId":tenantId,
    "userId":userId,
    "appletId":appletId,
    "valueId":valueid
  }
  paramStr += '{';
  paramStr += "\""+prefix+"_wx_pic\":\""+wxLogoStr+"\",";
  paramStr += "\""+prefix+"_wx_title\":\""+$(".wx_share_title").val()+"\",";
  paramStr += "\""+prefix+"_wx_description\":\""+$(".wx_share_des").val()+"\"";
  paramStr+= "}";
  paramData["fieldData"] = paramStr;
  Iptools.PutJson({
	ajaxCounting:false,
    url:"service/appletData",
    data:paramData,
    async:false,
  }).done(function(){
  })
}
//上传分享logo，同时要put到campaign表中的head_pic值中
function PutCampaignHeadPic(headPic){
	  var paramData ={
			    "tenantId":tenantId,
			    "userId":userId,
			    "appletId":campaignAppletId,
			    "valueId":getThisTabVars("campaignValueId")
	  }
	  //获得前缀
	  Iptools.GetJson({
		    url:"service/appletDataGetDetail",
		    data:paramData,
		    ajaxCounting:false,
		    async:false,
	  }).done(function(data){
		    prefix = data.rootBcGroupLinkId;
	  })
	  var paramStr="";
	  paramStr += '{';
	  paramStr += "\""+prefix+"_head_pic\":\""+headPic+"\"";
	  paramStr+= "}"; 
	  paramData["fieldData"] = paramStr;
	  Iptools.PutJson({
		    url:"service/appletData",
		    data:paramData,
		    ajaxCounting:false,
		    async:false,
	  }).done(function(){
		  
	  })
} 
//当输入框获取焦点时，非空提示要清空
$(".checkfocus").focus(function(){
   $(this).parent().parent().find(".errorNote").html("");
});

//微信分享设置

$(".wx_config .iconfont").hover(function(){ $(".shareCase").show();}, function(){
$(".shareCase").hide();})

/*
*上传图片和后台交互,url:只写开发or生产地址根路径。fileObj:选择的图片的当前input对象
*/
function getImgUrl(fileObj,url,tenanId,type){
  var imgUrl = "";
  var paraData = new FormData();
  paraData.append("file", fileObj[0].files[0]);
  $.ajax({
    url:url+"basic/file/uploadpic?tenantId=" + tenantId + "&type=jpg",
    data:paraData,
    type:"post",
    processData: false,
    contentType: false,
    async:false,
    success:function(data){
       imgUrl = data;
    }
  })
  //fileObj.val("");
   return imgUrl;
}
//刷新iframe
function refreshIframe(preview_address){
	$("#mobilePreview").remove();
	$(".shareCase").before('<iframe id="mobilePreview" src="'+preview_address+'"></iframe>');
}
/*
 * set当前tab的全局变量,
 */
function setThisTabVars(key,val){
	Iptools.uidataTool._getView({
	    view: Iptools.DEFAULTS.currentView,
	    async:false
	}).done(function (json) {
		//设置tab下的局部变量
		var curViewVal = Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewValue)?Iptools.DEFAULTS.currentViewValue:0;
		Iptools.Tool._setTabData({
	        view: Iptools.DEFAULTS.currentView,
	        valueId:curViewVal,
	        type: json.view.type,
	        key:key,
	        value:val
	    });
	});
}
/*
 * get当前tab下全局变量的属性为key的值
 */
function getThisTabVars(key){
	var obj = {};
	Iptools.uidataTool._getView({
	    view: Iptools.DEFAULTS.currentView,
	    async:false
	}).done(function (json) {
		//debugger
		//获得tab下的局部变量
		var curViewVal = Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewValue)?Iptools.DEFAULTS.currentViewValue:0;
		    obj = Iptools.Tool._getTabData({
	        view: Iptools.DEFAULTS.currentView,
	        valueId:curViewVal,
	        type: json.view.type
	    });
		//console.log(obj);
	});
	return obj[key];
}

//获取时间
function  getNowTime(str){
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;

    var strDate = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    //获取下一天
    if(str === "nextday"){
        strDate = strDate + 1;
    }else if(str === "pre7"){
        strDate = strDate - 7;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 1 && hour <= 9) {
        hour = "0" + hour;
    }
    if (min >= 0 && min <= 9) {
        min = "0" + min;
    }
    if (sec >= 0 && sec <= 9) {
        sec = "0" + sec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//----------------------------初始化各种appletId------------------------------------------------------s
var API_URL = Iptools.DEFAULTS.API_URL;
var SERVER_URL = Iptools.DEFAULTS.serviceUrl;
var tenantId = Iptools.DEFAULTS.tenantId;
var userId = Iptools.DEFAULTS.userId;
//活动
var campaignAppletId;
//H5
var H5AppletId;
//不记名报表
var viewAppletId;
//报名
var enrollAppletId;
//活动发布(渠道发布list--目前仅短信)
var messageListAppletId;
//根据活动id获取对应H5相关信息
var getH5InfoAppletId;
//短信
var channelAppletId;
//残垣人员list
var enrollListAppletId ;
//获取客户群list
var contactGroupListAppletId;
//客户群详细信息
var contactGroupDetailAppletId;

getCampaignAppletId();
getH5AppletId();
getViewAppletId();
getEnrollAppletId();
getmessageListAppletId();
getH5InfoAppletId();
getChannelAppletId();
//获取campaignAppletId
function getCampaignAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign Detail Applet\"'
        },
        }).done(function(data){
        	if(data){
        		campaignAppletId = data[0].appletId;
        	}
        })
}
//获取channelAppletId
function getChannelAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign Channel Detail Applet\"'
        },
    }).done(function(data){
    	if(data){
    		channelAppletId = data[0].appletId;
    	}
    })
}
//获取营销活动渠道messageListAppletId
function getmessageListAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign Channel List Applet\"'
        }
     }).done(function(data){
    	 if(data){
     		messageListAppletId = data[0].appletId;
     	}
     })
}
//获取H5AppletId
function getH5AppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign_H5 Detail Applet\"'
        }
    }).done(function(data){
    	if(data){
    		H5AppletId = data[0].appletId;
    	}
    })
}
//获取ViewAppletId
function getViewAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign Statistic Report\"'
        }
    }).done(function(data){
    	if(data){
    		viewAppletId = data[0].appletId;
    	}
    })
}

//获取enrollAppletId
function getEnrollAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign Response Report\"'
        }
    }).done(function(data){
    	if(data){
    		enrollAppletId = data[0].appletId;
    	}
    })
}

//获取enrollAppletId
function getH5InfoAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign_H5 List Applet\"'
        }
    }).done(function(data){
    	if(data){
    		getH5InfoAppletId = data[0].appletId;
    	}
    })
}
//得到参与人员appletId
function getEnrollListAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Campaign Response List Applet\"'
        }
    }).done(function(data){
    	if(data){
    		enrollListAppletId = data[0].appletId;
    	}
    })
}
//得到客户群list'appletId
function getContactGroupListAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Contactgroup List Applet\"'
        }
        }).done(function(data){
        	if(data){
        		contactGroupListAppletId = data[0].appletId;
        	}
        })
}
//得到客户群详情'appletId
function getContactGroupDetailAppletId(){
    Iptools.GetJson({
        async: false,
        ajaxCounting:false,
        url: "basic/customizeApplets",
        data: {
            "tenantId": tenantId,
            "nameList":'\"Contactgroup Detail Applet\"'
        }
    }).done(function(data){
    	if(data){
    		contactGroupDetailAppletId = data[0].appletId;
    	}
    })
}
//校验手机号码
function checkPhoneNum(PhoneNum){
	var result =true;
	 var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	 if (reg.test(PhoneNum)) {
		 result =true;
	 }else{
		 result =false;
	 };
	 return result;
}