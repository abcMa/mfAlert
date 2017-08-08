Iptools.Start();

var op ={async:false,"nameList":'\"Campaign Detail Applet\"'};
var campaignApplet ;
Iptools.uidataTool._getCustomizeApplet(op).done(function(data){
	campaignApplet = data.applets[0].applet;
})
var op1 = {async:false,"nameList":'\"Campaign_H5 Detail Applet\"'};
var h5Applet ;
Iptools.uidataTool._getCustomizeApplet(op1).done(function(data){
	h5Applet = data.applets[0].applet;
})
//var campaignId = getThisTabVars("campaignValueId");
var campaign_template_id = getThisTabVars("campaign_template_id");
//默认企业信息
var eadress = "";
var etel = "";
var ename = "";
var tagsArr = [];
var isTemplateData = false;//是否是预制模板
buildPage();
//build新建的初始化页面
function buildPage(){
    //获取企业信息	
	getTenantInfo();
	var t = getNowTime("today");
	$("#inputE").val(t);
	$("#stime").html(t);
	var nt = getNowTime("nextday");
	$("#endTime").val(nt);
	$("#etime").html(nt);
	getViewId();
	$("input[name=optionsRadios]:first").prop("checked",true);
	//初始化按钮颜色
	$("#mycolor").colorpicker({
	    color: "#09f",
	    showOn: "button",
	});
	$("#visitorEventTags").tagit({
		tagLimit: 20,
		beforeTagAdded: function(event, ui) {
			if(ui.tagLabel.length > 20){
				$(event.target).closest(".form-group").find(".promptR").show();
				return false;
			}
			$(event.target).closest(".form-group").find(".promptR").hide();
		},
		afterTagAdded :function(event, ui){
			tagsArr.push(ui.tagLabel);
		}
	});
	$("#formEventTags").tagit({
		tagLimit: 20,
		beforeTagAdded: function(event, ui) {
			if(ui.tagLabel.length > 20){
				$(event.target).closest(".form-group").find(".promptR").show();
				return false;
			}
			$(event.target).closest(".form-group").find(".promptR").hide();
		},
		afterTagAdded :function(event, ui){
			tagsArr.push(ui.tagLabel);
		}
	});
	getPreConfigH5Info();
	//绑定校验事件
	checkFormItems();
	$(".cancel-btn").on("click",function(){
		//关闭活动类型
        var actType = {
        	async:false,
  			"nameList":"\"campaignh5New2\""
  	    }
        var thisView ;
        Iptools.uidataTool._getCustomizeView(actType).done(function(data){
        	thisView = data;
        });
        if(Iptools.Tool._getVersion()=="v1"){
        	Iptools.Tool._redirectToParent();
        }else if(Iptools.Tool._getVersion()=="v2"){
	        //关闭当前
		    Iptools.uidataTool._getView({
	            view: thisView.views[0].view,
	            async:false
	        }).done( function (data) {
	        	Iptools.Tool._CloseTab({
	                view: thisView.views[0].view,
	                type: data.view.type
	            });
	        })
        }
	})
}
//是否是预制模板
function getPreConfigH5Info(){
	Iptools.GetJson({
		url:"basic/getTemplatePreconfigInfo",
		data:{"campaignTemplateId":campaign_template_id
		},
	}).done(function(json) {
		if (json.h5PreconfigInfo) {
			isTemplateData = true;
			buildPreH5Config(json);
		}
	})
}
//构建预制模板数据
function buildPreH5Config(data){
	var obj = data.h5PreconfigInfo;
	$("#inputEma").val(obj["title"]);
	$("#order").html(obj["title"]);
	$("#editer").summernote("code", obj["richText"]);
	$(".pre-edit").html(obj["richText"]);
	$("#inputEm").val(obj["subTitle"]);
	$("#orders").html(obj["subTitle"]);

	$("#inputEmail").val(obj["backImg"]);
	//预览首图
	$("#iimg").html('<img src="'+obj["backImg"]+'" alt=""/>');

	$("#btnWord").val(obj["buttonText"]?obj["buttonText"]:"");
	$(".section-siex-first b").html(obj["buttonText"]?obj["buttonText"]:"立即预约");
	if(obj["buttonColor"]){
		$("#mycolor").colorpicker({
			color: obj["buttonColor"]
		});
		$(".active-time-area").css("color",obj["buttonColor"]);
		$(".preadress-area").css("color",obj["buttonColor"]);
		$(".pretel-area").css("color",obj["buttonColor"]);
		$(".section-siex-first").css("background-color",obj["buttonColor"]);
	}
}
/**
 * 基本信息tab表单是否填写正确：0不正确。1正确
 */
var tab1Full = 1;
$(document).ready(function(){
	$(".tabSwitch").on("show.bs.tab",function(){
		//校验基本信息是否填写完整
		$("#tab0-panel #enrollActivityForm").bootstrapValidator('validate');
		if (!$("#tab0-panel #enrollActivityForm").data("bootstrapValidator").isValid()){
			$("#tab0-tablink").addClass("imperfect");
			tab1Full = 0;
		}else{
			$("#tab0-tablink").removeClass("imperfect");
			tab1Full = 1;
		}
	});
	$("#tab0-panel #enrollActivityForm input").on("input",function(){
		$("#tab0-panel #enrollActivityForm").data('bootstrapValidator').validateField($(this).attr("name"));
		$("#tab0-panel #enrollActivityForm").bootstrapValidator('validate');
		if (!$("#tab0-panel #enrollActivityForm").data("bootstrapValidator").isValid()){
			$("#tab0-tablink").addClass("imperfect");
			tab1Full = 0;
		}else{
			$("#tab0-tablink").removeClass("imperfect");
			tab1Full = 1;
		}
	});
})

function getNextDay(d){

    var date = new Date();
    date.setDate(date.getDate()+1);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    
    var strDate = date.getDate();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (min >= 0 && min <= 9) {
    	min = "0" + min;
    }
    if (sec >= 0 && sec <= 9) {
    	sec = "0" + sec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + min
            + seperator2 + sec;
    return currentdate;
}
//获取viewid 
function getViewId(){
	Iptools.GetJson({
     url:"basic/customizeViewsByNameList",
     data:{"tenantId":Iptools.DEFAULTS.tenantId,"nameList":'\"campaign_form\"'},
     async:false,
   }).done(function(data){
        //viewId = data.id;
        getAppletIdByViewId(data[0].viewId);
   })
}
//根据viewId获取applet[]
function getAppletIdByViewId(ViewId){
	$(".form_area").html("");
	Iptools.GetJson({
     url:"service/views",
     data:{"token":Iptools.DEFAULTS.token,"viewId":ViewId},
     async:false,
   }).done(function(data){
        for (var i = 0; i < data.applets.length; i++) {
          getFormByAppletId(data.applets[i].uuid);
        };
   })
}
//根据appletId获取表单字段
function getFormByAppletId(AppletId){
	
    var formStr = "";
    Iptools.uidataTool._getApplet({
     "applet":AppletId,
     async:false,
   }).done(function(data){
        for (var i = 0; i < data.controls.length; i++) {
          formStr += data.controls[i].name;
          if(i < data.controls.length-1){
              formStr +="/";
          }
        };
   })

   var html='<div class="radio">'+
         '<label><input type="radio"  id="'+AppletId+'" name="optionsRadios" id="optionsRadios2">'+formStr+'</label>'+
        '</div>';
   $(".form-radio").append(html);
}


//实时校验表单
function checkFormItems(){
    $("#tab0-panel #enrollActivityForm").bootstrapValidator({
        fields: {
        	inputEmail: {
                validators: {
                    notEmpty: {
                        message: '必填'
                    },
                }
            },
            tel: {
                validators: {
                    notEmpty: {
                        message: '必填'
                    },
                    //regexp: {
                    //    regexp: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                    //    message: '请输入正确的手机号码'
                    //}
                }
            },
            inp: {
                validators: {
                    notEmpty: {
                        message: '必填'
                    },
                }
            },
            /*endTime: {
                validators: {
                    notEmpty: {
                        message: '必填'
                    },
                }
            },
            inputE: {
                validators: {
                    notEmpty: {
                        message: '必填'
                    },
                }
            },*/
            inputE: {
    			validators: {
    				//integer: {},
    				callback: {
    					message: '开始日期不能大于结束日期',
    					callback:function(value, validator,$field,options){
    						var begin = $("#endTime").val();
    						return Date.parse(value.replace(/-/g, "/")) <= Date.parse(begin.replace(/-/g, "/"));
    					}
    				}
    			}
    		},
    		endTime: {
    			validators: {
    				//integer: {},
    				callback: {
    					message: '结束日期不能小于开始日期',
    					callback:function(value, validator,$field){
    						var begin = $("#inputE").val();
    						$("#endTime").keypress();
    						validator.updateStatus('inputE', 'VALID');
    						return Date.parse(value.replace(/-/g, "/")) >=  Date.parse(begin.replace(/-/g, "/"));
    					}
    				}
    			}
    		},
            inputEma: {
                validators: {
                    notEmpty: {
                        message: '必填'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '标题长度必须在1到50位之间'
                    }
                }
            },
            inputEmail: {
                validators: {
                    notEmpty: {
                        message: '必填'
                    },
                }
            },
            inputEm: {
                validators: {
                    //notEmpty: {
                    //    message: '必填'
                    //},
                    stringLength: {
                        min: 2,
                        max: 20,
                        message: '副标题长度必须在2到20位之间'
                    },
                }
            }
        }
    });
    //$(widget._UIDEFAULFS.personForm).bootstrapValidator('validate');
   // if ($("#enrollActivityForm").data("bootstrapValidator").isValid()) {
}
//校验富文本
function checkEditor(){
	//富文本内容少于1024
	  if($("#editer").summernote('code').length > 2048){
	   $("#editer").parent().parent().find(".errorNote").html("*文本内容超长");
	    return false;
	  }
}
//是否是新建
var isCreate = true;
//新建或者更新数据
function createOrNewActivity(e){
	if(!tab1Full){
		$('#tab0-tablink').tab('show');
		$("#tab0-tablink").addClass("imperfect");
		return false;
	}
	var me = $(e);
   me.attr("data-loading-text", "<span class='icon-refresh icon-spin'></span> 保存中");
   me.css("pointer-events","none");
   me.button("loading");
	$("#tab0-panel #enrollActivityForm").bootstrapValidator('validate');
	if ($("#tab0-panel #enrollActivityForm").data("bootstrapValidator").isValid()&&$("#editer").summernote('code') !== "<p><br></p>") {
		   var prefix;
			//更新or新增活动
			  var paramStr = "";
			  var paramData ={
			    //"tenantId":Iptools.DEFAULTS.tenantId,
			    //"userId":Iptools.DEFAULTS.userId,
			    "appletId":campaignApplet
			  }
			  //获取前缀。。
			  Iptools.uidataTool._getApplet({
			    "applet":campaignApplet,
			    async:false,
			 }).done(function(data){
			    	prefix = data.rootLink;
			 }).done(function(){
//                 console.log(uploadImg);
				 var imgurl = getCanvasImgUrl(bgImgObj);
				  paramStr += '{';
				  paramStr += "\""+prefix+":head_pic\":\""+imgurl+"\",";
				  paramStr += "\""+prefix+":title\":\""+$("#inputEma").val()+"\",";
				  //paramStr += "\""+prefix+"_target_group\":"+$(".target_group").val()+",";
				  //paramStr += "\""+prefix+"_purpose\":\""+$(".purpose").val()+"\",";
				  paramStr += "\""+prefix+":start_time\":\""+$("#inputE").val()+"\",";
				  paramStr += "\""+prefix+":end_time\":\""+$("#endTime").val()+"\",";
				  paramStr += "\""+prefix+":status\":\"1\",";
				  paramStr += "\""+prefix+":campaign_scene_id\":\""+getThisTabVars("campaign_scene_id")+"\"";
				  paramStr+= "}"; 
				  paramData["data"] = paramStr;
				  paramData["async"] = false;
				  var ajaxType;
				  //if(campaignId === "" ||campaignId == null ||campaignId == "undefined"){
				    ajaxType = "post";
				    //isCreate = true;
				  /*}else{
				    ajaxType = "put";
				    isCreate = false;
				    paramData["valueId"] = campaignId;
				  }*/
				 // createOrNewH5();
	              //新建活动
				    Iptools.uidataTool._addAppletData(paramData).done(function(data){
				    	if(data){
					    	 campaignId = data.id;
						     setThisTabVars("campaignValueId",data.id);
						     addTags(tagsArr);
						     createOrNewH5(me);
				    	}
				  })
			 }).fail(function(){
					setTimeout(function(){
						me.button("reset");
						me.css("pointer-events","auto");
					},1000);
				})
	}else{
		setTimeout(function(){
			me.button("reset");
			me.css("pointer-events","auto");
		},1000);
	}
}

//新建or更新H5
function createOrNewH5(me){
	$("#tab0-panel #enrollActivityForm").bootstrapValidator('validate');
	if ($("#tab0-panel #enrollActivityForm").data("bootstrapValidator").isValid()&&$("#editer").summernote('code') !== "<p><br></p>") {
	  var paramData ={
	    //"tenantId":Iptools.DEFAULTS.tenantId,
	    //"userId":Iptools.DEFAULTS.userId,
	    "appletId":h5Applet,
	    async:false,
	  }
	  //获取前缀。。
	  Iptools.uidataTool._getApplet({"applet":h5Applet,
			    async:false,
	  }).done(function(data){
		  prefix = data.rootLink;
	  }).done(function(){
		  var paramStr = "";
		  var radios = $(".radio input");
		  var formappletId ;
		  for (var i = 0; i < radios.length; i++) {
		    if($(radios[i]).prop("checked")){
		       formappletId = $(radios[i]).attr("id");
		    }
		  };
		  var imgurl = getCanvasImgUrl(bgImgObj);
		  var formApplet ;
		  var visTags = "",formTags = "",
		  $visTags = $("#visitorEventTags").find("input[name=tags]"),
		  visTagsLen = $("#visitorEventTags").find("input[name=tags]").length,
		  $formTags = $("#formEventTags").find("input[name=tags]"),
		  formTagsLen = $("#formEventTags").find("input[name=tags]").length;
		  paramStr += '{';
		  //构建参数--其他设置
		  if(visTagsLen >0){
			  for(var i = 0;i<visTagsLen;i++){
				  visTags += $($visTags[i]).val();
				  if(i === visTagsLen-1){
					  continue;
				  }else{
					  visTags += "|"; 
				  }
				  
			  }
			  paramStr += "\""+prefix+":visitor_tags\":\'"+visTags+"\',";
		  }
		  if(formTagsLen >0){
              for(var j = 0;j<formTagsLen;j++){
            	  formTags += $($formTags[j]).val();
				  if(j === formTagsLen-1){
					  continue;
				  }else{
					  formTags += "|"; 
				  }
			  }
              paramStr += "\""+prefix+":form_contact_tags\":\'"+formTags+"\',";
		  }
		  if($("#btnWord").val() !== ""){
			  paramStr += "\""+prefix+":button_text\":\'"+$("#btnWord").val()+"\',"; 
		  }else{
			  paramStr += "\""+prefix+":button_text\":\'立即报名\',";
		  }
		  paramStr += "\""+prefix+":button_color\":\'"+$("#mycolor").val()+"\',";
		  //构建提交参数--基本信息
		  paramStr += "\""+prefix+":rich_text\":\'"+$("#editer").summernote('code').replace(/'/g, '&apos;')+"\',";
		  paramStr += "\""+prefix+":campaign_id\":\""+campaignId+"\",";
		  paramStr += "\""+prefix+":title\":\""+$("#inputEma").val()+"\",";
		  paramStr += "\""+prefix+":campaign_template_id\":\""+campaign_template_id+"\",";
		  paramStr += "\""+prefix+":start_time\":\""+$("#inputE").val()+"\",";
		  paramStr += "\""+prefix+":end_time\":\""+$("#endTime").val()+"\",";
		  paramStr += "\""+prefix+":form_applet\":\""+formappletId+"\",";
		  paramStr += "\""+prefix+":contact_phone\":\""+$("#tel").val()+"\",";
		  paramStr += "\""+prefix+":sub_title\":\""+$("#inputEm").val()+"\",";
		  paramStr += "\""+prefix+":location\":\""+$("#inp").val()+"\",";
		  paramStr += "\""+prefix+":back_img\":\""+imgurl+"\"";
		  paramStr+= "}";
		  paramData["data"] = paramStr;
		  //新建
		  var ajaxType;
		 // if(isCreate){
			  ajaxType = "post";
		  /*}else{
			  ajaxType = "put";
			  paramData["valueId"] = valueid;
		  }*/
		  
	  //ajax提交
		Iptools.uidataTool._addAppletData(paramData).done(function(json){
		    	if(json.retcode !== "fail"){
//		    		me.button("reset");
//					me.css("pointer-events","auto");

					Iptools.Tool.pAlert({
						type: "info",
						title: "系统提示：",
						content: "新建成功",
						delay: 1000
					});
			      //self.location.href = "../campaignInfo/campaignInfo.html";
			      //关闭活动类型
			        var actType = {
			        	async:false,
			  			"nameList":"\"campaign_new\""
			  	    }
			        var thisView ;
			        Iptools.uidataTool._getCustomizeView(actType).done(function(data){
			        	thisView = data;
			        });
			        var viewobj = {
			        		async:false,
				  			"nameList":"\"campaign_detail\""
				  	    }
			        //详情页view
				    var detailView ;
			        Iptools.uidataTool._getCustomizeView(viewobj).done(function(data){
				    	detailView = data;
				    });
				    //如果是从详情页进来的不需要关闭之前的详情页
				      if(Iptools.Tool._getVersion()=="v1"){
                              //关闭当前
				    		  Iptools.uidataTool._getView({
						            view: thisView.views[0].view,
						            async:false
						        }).done( function (data) {
						        	Iptools.Tool._CloseTab({
						                view: thisView.views[0].view,
						                type: data.view.type,
						            });
						        	//跳详情
							        Iptools.uidataTool._getView({
							            view: detailView.views[0].view,
							            async:false
							        }).done(function (data) {
							        	Iptools.Tool._jumpView({
							                view: detailView.views[0].view,
							                name: data.view.name+"-"+$("#inputEma").val(),
							                type: data.view.type,
							                valueId: campaignId,//h5id
							                primary: data.view.primary,
							                icon: data.view.icon,
							                url:data.view.url,
							                bread:true,
							                refresh:true
							            });
							        })
						        })
				      }else if(Iptools.Tool._getVersion()=="v2"){
				    	  Iptools.uidataTool._getView({
					            view: Iptools.DEFAULTS.currentView,
					            async:false
					        }).done( function (data) {
					        	Iptools.Tool._CloseTab({
					                view: Iptools.DEFAULTS.currentView,
					                type: data.view.type,
					                //valueId:Iptools.DEFAULTS.currentViewValue
					            },function(){
					            	Iptools.uidataTool._getView({
							            view: detailView.views[0].view,
							            async:false
							        }).done( function (data) {
						            	Iptools.Tool._jumpView({
							                view: detailView.views[0].view,
							                name: data.view.name+">"+$("#inputEma").val(),
							                type: data.view.type,
							                valueId: campaignId,//h5id
							                primary: data.view.primary,
							                icon: data.view.icon,
							                url:data.view.url,
							                bread:true,
							                refresh:true
							            });
							        })
					            },null);
					        })
					        	
				      }
		}else{
				Iptools.Tool.pAlert({
					type: "danger",
					title: "系统提示：",
					content: "服务器异常，请稍后重试！",
					delay: 1000
				});
				setTimeout(function(){
					me.button("reset");
					me.css("pointer-events","auto");
				},1000);
        }
		})
	  })
			  
			  
	}
}

//--------------------------------------fuqiang-edit----------------------------------
//图片上传功能....
var uploadImg=false;
var bgImgObj;
$("#photo").on('change',function(e){
//    uploadImg=true;
//    console.log(2222222222);
//    var files = this.files;
//    bgImgObj = $(this);
//    var img = new Image();
//    var reader = new FileReader();
//    reader.readAsDataURL(files[0]);
//    $("#iimg img").remove();
//    reader.onload = function(e){
//        var mb = (e.total/1024)/1024;
//        if(mb>= 2){
//            alert('文件大小大于2M');
//            return;
//        }
//        img.src = this.result;
//        document.getElementById('iimg').appendChild(img);
//        console.log(11100011);
//        $("#inputEmail").val(files[0].name);
//        $("#enrollActivityForm").data("bootstrapValidator").updateStatus("inputEmail", "NOT_VALIDATED").validateField("inputEmail");
//    }
    var me = $(this);
	var file = me[0].files[0].name;
	if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file))
	{

		Iptools.Tool.pAlert({
			type: "danger",
			title: "系统提示：",
			content: "图片类型必须是.gif,jpeg,jpg,png中的一种",
			delay: 1000
		});
		return false;
	}
    if (me[0].files && me[0].files.length) {
    component._crop({
	    file: me[0].files[0],
	    aspectRatio: 9 / 5, //图片裁剪框比例
	    minCanvasWidth:360,
	    minContainerHeight:200,
	    getCanvas: function (canvas) { //点击确定触发
	    	bgImgObj = canvas;
//	    	canvas.width=360;
//	    	canvas.height=200;
	    	$("#inputEmail").val(me[0].files[0].name);
	    	$(canvas).css("display","inline-block");
	        $("#iimg").html(canvas);
	        $("#iimg").find("canvas").css({"height":"100%","width":"100%"});
	        $("#tab0-panel #enrollActivityForm").data("bootstrapValidator").updateStatus("inputEmail", "NOT_VALIDATED").validateField("inputEmail");

	    
//	    Iptools.uidataTool._uploadCanvasData({ //上传裁剪的图片到服务器，得到图片路径
//		    canvas: canvas,
//		    type: "picture"
//	    }).done(function (path) {
//	        $("#crop-test-container").append(Iptools.DEFAULTS.serviceUrl + path);
//	    });
	    }
    });
    }	
});

//富文本编译器
$('#editer').summernote({
    height:150,
    lang: 'zh-CN',
    callbacks: {
        onChange: function () {
            var value = $(this).summernote("code");
            //console.log(value);
            $(".pre-edit").html( $(this).summernote("code"));
        }
    },
    toolbar:[
        ['style', ['bold', 'italic', 'underline', 'clear']],
        //['fontsize', ['fontsize']],
        ['table', ['table']],
        ['insert', ['link', 'picture']],
        ['para', ['paragraph']]
    ]
})
//切换到基本信息页面
function switchBasicInfo(){
//    console.log(1111);
    $(".switchBasic").css("display","block");
    $(".appendInfo").css("display","none");
    $(".section-acticle-bar").removeClass("section-acticle-bar-change");
    $(".section-event .nav-left").removeClass("nav-left-change");
}
//切换到基本设置页面
function switchOther(){
//    console.log(22222);
    $(".switchBasic").css("display","none");
    $(".appendInfo").css("display","block");
    $(".section-acticle-bar").addClass("section-acticle-bar-change");
    $(".section-event .nav-left").addClass("nav-left-change");
}

$("#mycolor").on("change.color", function(event, color){
    $(".evo-colorind").attr("style", "background-color:" + color);
	$(".active-time-area").css("color",color);
	$(".preadress-area").css("color",color);
	$(".pretel-area").css("color",color);
    $(".section-siex .section-siex-first").attr("style", "background-color:" + color);
});
$(".evo-cp-wrap").removeAttr("style");
//智能标签
$(document).ready(function(){
    visitorEvent();
    formContactEvent();
});
function visitorEvent(){
//    $("#visitorEventTags").tagit();
//    $(".tagit-new input").attr('placeholder','可输入自定义标签，以"空格"分隔');
    getVisitorTags();
}
function formContactEvent(){
//    $("#formEventTags").tagit();
//    $(".tagit-new input").attr('placeholder','可输入自定义标签，以"空格"分隔');
    getFormTags();
}
//系统的访客可选标签库
function getVisitorTags() {
    Iptools.GetJson({
        url: "basic/tags",
        data: {
            tenantId: Iptools.getDefaults({ key: "tenantId" }),
            token:Iptools.DEFAULTS.token
        }
    }).done(function(data){
       // console.log(data);
        for(var i = 0;i<data.length;i++){
            var html = '<div class="chooseOnly"><span class="btn tag lgTag" onclick="chooseVisitorTag(this)">'+data[i].tagValue+'</span></div>';
            $(".VisitorEventTag").append(html);
        };
    })
};
//系统的提交表单可选标签库
function getFormTags() {
    Iptools.GetJson({
        url: "basic/tags",
        data: {
            tenantId: Iptools.getDefaults({ key: "tenantId" }),
            token:Iptools.DEFAULTS.token
        }
    }).done(function(data){
        //console.log(data);
        for(var i = 0;i<data.length;i++){
            var html = '<div class="chooseOnly"><span class="smallLabel" onclick="chooseFormTag(this)">'+data[i].tagValue+'</span></div>';
            $(".FormEventTag").append(html);
        };
    })
};
function chooseVisitorTag(e){
    //点击系统标签为访客打上标签
    var setVisitorTag = $(e).html();
    $("#visitorEventTags").tagit('createTag',setVisitorTag);
}
function chooseFormTag(e){
    //点击系统标签为客户打上标签
    var setFormTag = $(e).html();
    $("#formEventTags").tagit('createTag',setFormTag);
}
//颜色选择插件中文字体
$(".evo-pointer").on("click", function(){
    $(".evo-palette tr:nth-child(1) .ui-widget-content").html("主题颜色");
    $(".evo-palette tr:nth-child(9) .ui-widget-content").text("标准颜色");
    $(".evo-more a").html("网页颜色");
});
//改变左侧按钮文字
function changeWord(){
    $(".section-siex .section-siex-first b").html( $("#btnWord").val());
    if($("#btnWord").val()==""){
        $(".section-siex .section-siex-first b").html("我感兴趣");
    }
}
//提交标签，按钮文字，和颜色
function putActivity(){
        var prefix=0;
        var paramStr = "";
        var paramData ={
            //"tenantId":Iptools.DEFAULTS.tenantId,
            //"userId":Iptools.DEFAULTS.userId,
            "applet":campaignApplet
        }
        Iptools.uidataTool._getApplet({
                applet:campaignApplet
        }).done(function(data){
            prefix = data.rootLink;
        }).done(function(){
            paramStr += "{";
            paramStr += "\""+prefix+":tagValues\":\""+$(".tagit-hidden-field").val()+"\",";
            paramStr += "\""+prefix+":button_text\":\""+$("#btnWord").val()+"\",";
            paramStr += "\""+prefix+":button_color\":\""+$("#mycolor").val()+"\",";
            paramStr+= "}";
//            paramData["fieldData"] = paramStr;
//            var ajaxType = "post";
//            $.ajax({
//                url:Iptools.DEFAULTS.API_URL+"service/appletData",
//                data:paramData,
//                type:ajaxType,
//                success:function(data){
//                    if(data){
//                        setThisTabVars("campaignValueId",data.id);
//                    }
//                }
//            })
            Iptools.uidataTool._addAppletData({
               
                    data:paramStr
            }).done(function(data){
                if(data){
                    setThisTabVars("campaignValueId",data.id);
                }
            })
        })
}
//新增加的标签要添加到标签库中
function addTags(tagsArr){
	var max = tagsArr.length;
	for(var i=0;i < max;i++){
		//添加标签
	    Iptools.PostJson({
	        url:"/basic/tags",
	        data:{
	            tenantId:Iptools.DEFAULTS.tenantId,
	            tagValue:tagsArr[i],
	            token:Iptools.DEFAULTS.token
	        }
	    }).done(function(data){
	            if(data){
//	            	var html = '<div class="chooseOnly"><span class="smallLabel" onclick="chooseFormTag(this)">'+data.tagValue+'</span></div>';
//	                $(".FormEventTag").append(html);
	            }
	    })
	}
}