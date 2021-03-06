Iptools.Start();

var op ={async:false,"nameList":'\"Campaign Detail Applet\"'};
var campaignApplet ;
Iptools.uidataTool._getCustomizeApplet(op).done(function(data){
	campaignApplet = data.applets[0].applet;
})
var op1 = {async:false,"nameList":'\"Campaign_H5 Detail Applet\"'};
var h5Applet;
Iptools.uidataTool._getCustomizeApplet(op1).done(function(data){
	h5Applet = data.applets[0].applet;
})
var campaignId = getThisTabVars("campaignValueId");
var h5id = getThisTabVars("H5ValueId");
var campaign_template_id = getThisTabVars("campaign_template_id");
//默认企业信息
var eadress = "";
var etel = "";
var ename = "";
var tagsArr = [];
buildPage();
//build新建的初始化页面
function buildPage(){
	//富文本编译器
	$('#editer').summernote({
		height:150,
		lang: 'zh-CN',
		callbacks: {
			onChange: function () {
				var value = $(this).summernote("code");
//	            console.log(value);
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
	getTenantInfo();
	getViewId();
	$("input[name=optionsRadios]:first").prop("checked",true);
	getCampaignInfoById();
	getH5InfoById();
	//绑定校验事件
	checkFormItems();
	$(".cancel-btn").on("click",function(){
		//关闭活动类型
		var actType = {
			async:false,
			"nameList":"\"campaignh5Edit1\""
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
					type: data.view.type,
					valueId:h5id
				});
			})
		}

	})
}
/**
 * 基本信息tab表单是否填写正确：0不正确。1正确
 */
var tab1Full = 1;
$(document).ready(function(){
	$(".tabSwitch").on("show.bs.tab",function(){
		//校验基本信息是否填写完整
		$("#tab0-panel #serviceApointment").bootstrapValidator('validate');
		if (!$("#tab0-panel #serviceApointment").data("bootstrapValidator").isValid()){
			//$("#tab0-tablink").css("color","black").html("基本信息");
			//$("#tab0-tablink").css("color","#a94442").html("基本信息（待完善）");
			$("#tab0-tablink").addClass("imperfect");
			tab1Full = 0;
		}else{
			$("#tab0-tablink").removeClass("imperfect");
			//$("#tab0-tablink").css("color","black").html("基本信息");
			tab1Full = 1;
		}
	});
	$("#tab0-panel #serviceApointment input").on("input",function(){
		$("#tab0-panel #serviceApointment").data('bootstrapValidator')
			.validateField($(this).attr("name"));
		$("#tab0-panel #serviceApointment").bootstrapValidator('validate');
		if (!$("#tab0-panel #serviceApointment").data("bootstrapValidator").isValid()){
			//$("#tab0-tablink").css("color","black").html("基本信息");
			//$("#tab0-tablink").css("color","#a94442").html("基本信息（待完善）");
			$("#tab0-tablink").addClass("imperfect");
			tab1Full = 0;
		}else{
			//$("#tab0-tablink").css("color","black").html("基本信息");
			$("#tab0-tablink").removeClass("imperfect");
			tab1Full = 1;
		}
	});
})
//获取活动信息
function getCampaignInfoById(){
	var paramStr = "";
	var paramData ={
		//"tenantId":Iptools.DEFAULTS.tenantId,
		//"userId":Iptools.DEFAULTS.userId,
		"appletId":campaignApplet,
		"valueId":campaignId,
		async:false,
	}
	var prefix;
	Iptools.uidataTool._getUserDetailAppletData(paramData).done(function(data){
		if(data.data){
			prefix = data.rootLink;
			//$("#editer").summernote("code", data.detailData[prefix+"_rich_text"]);

			$("#inputEma").val(data.data[prefix+":title"]);
			$("#order").html(data.data[prefix+":title"]);
		}
	})
}
//获取h5信息
function getH5InfoById(){

	var paramData ={
		async:false,
		//"tenantId":Iptools.DEFAULTS.tenantId,
		//"userId":Iptools.DEFAULTS.userId,
		"appletId":h5Applet,
		"valueId":h5id
	}
	Iptools.uidataTool._getUserDetailAppletData(paramData).done(function(data){
		if(data){
			var obj = data.data;
			prefix = data.rootLink;
			$("#editer").summernote("code", obj[prefix+":rich_text"]);
			$(".pre-edit").html(obj[prefix+":rich_text"]);
			$("#inputEm").val(obj[prefix+":sub_title"]);
			$("#orders").html(obj[prefix+":sub_title"]);

			var len = obj[prefix+":back_img"].split("/").length -1;
			var picName = obj[prefix+":back_img"].split("/")[len];
			bgimgurlStr = obj[prefix+":back_img"];
			$("#inputEmail").val(picName);
			//预览首图
			$("#iimg").html('<img src="'+obj[prefix+":back_img"]+'" alt=""/>');
			// $("#iimg img").attr("src",obj[prefix+"_back_img"]);

	               $("#inputE").val(obj[prefix+":start_time"]);
	               $("#stime").html(obj[prefix+":start_time"]);
//	               
//	               $("#endTime").val(obj[prefix+"_end_time"]);
//	               $("#etime").html(obj[prefix+"_end_time"]);
//	               
			$("#tel").val(obj[prefix+":contact_phone"]);
			$("#ptel").html(obj[prefix+":contact_phone"]);
//	               
//	               $("#inp").val(obj[prefix+"_location"]);
//	               $("#address").html(obj[prefix+"_location"]);
			$("#"+obj[prefix+":form_applet"]+"").prop("checked",true);

			if(obj[prefix+":form_contact_tags"]){
				var formTagArr = obj[prefix+":form_contact_tags"].split("|");
				// $("#formEventTags").tagit();
				for(var i = 0;i < formTagArr.length;i ++){
					$("#formEventTags").tagit('createTag',formTagArr[i]);
				}
			}
			if(obj[prefix+":visitor_tags"]){
				var visTagArr = obj[prefix+":visitor_tags"].split("|");
//	                   $("#visitorEventTags").tagit();
				for(var j = 0;j < visTagArr.length;j ++){
					$("#visitorEventTags").tagit('createTag',visTagArr[j]);
				}
			}


			$("#btnWord").val(obj[prefix+":button_text"]?obj[prefix+":button_text"]:"");
			$(".section-siex-first b").html(obj[prefix+":button_text"]?obj[prefix+":button_text"]:"立即预约");
			if(obj[prefix+":button_color"]){
				$("#mycolor").colorpicker({
					color: data.data[prefix+":button_color"]
				});
				$(".active-time-area").css("color",data.data[prefix+":button_color"]);
				$(".preadress-area").css("color",data.data[prefix+":button_color"]);
				$(".pretel-area").css("color",data.data[prefix+":button_color"]);
				$(".section-siex-first").css("background-color",obj[prefix+":button_color"]);
			}

		}
	})
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
	$("#tab0-panel #serviceApointment").bootstrapValidator({
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
				}
			},
			inp: {
				validators: {
					notEmpty: {
						message: '必填'
					},
				}
			},
			endTime: {
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
					},
				}
			},
			inputEmail: {
				validators: {
					notEmpty: {
						message: '必填'
					},
				}
			},
			//副标题非必填
			inputEm: {
				validators: {
					//notEmpty: {
					//	message: '必填'
					//},
					stringLength: {
						min: 0,
						max: 60,
						message: '副标题长度必须在0到60位之间',

					}
				}
			}
		}
	});
	//$(widget._UIDEFAULFS.personForm).bootstrapValidator('validate');
	// if ($("#enrollActivityForm").data("bootstrapValidator").isValid()) {
}
//是否是新建
var isCreate = true;
//新建或者更新数据
function createOrNewActivity(e){
	if(!tab1Full){
		$('#tab0-tablink').tab('show');
		//$("#tab0-tablink").css("color","#a94442").html("基本信息（待完善）");
		$("#tab0-tablink").addClass("imperfect");
		return false;
	}
	var me = $(e);
	me.attr("data-loading-text", "<span class='icon-refresh icon-spin'></span> 保存中");
	me.css("pointer-events","none");
	me.button("loading");
	$("#tab0-panel #serviceApointment").bootstrapValidator('validate');
	if ($("#tab0-panel #serviceApointment").data("bootstrapValidator").isValid()&&$("#editer").summernote('code') !== "<p><br></p>") {
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
			applet:campaignApplet,
			async:false,
		}).done(function(data){
			prefix = data.rootLink;
		}).done(function(){
			if(bgImgObj){
				var imgurl = getCanvasImgUrl(bgImgObj);
			}else{
				var imgurl = bgimgurlStr;
			}			  paramStr += '{';
			paramStr += "\""+prefix+":head_pic\":\""+imgurl+"\",";
			paramStr += "\""+prefix+":title\":\""+$("#inputEma").val()+"\",";
			//paramStr += "\""+prefix+"_target_group\":"+$(".target_group").val()+",";
			//paramStr += "\""+prefix+"_purpose\":\""+$(".purpose").val()+"\",";
			paramStr += "\""+prefix+":start_time\":\""+$("#inputE").val()+"\",";
			// paramStr += "\""+prefix+"_end_time\":\""+$("#endTime").val()+"\",";
			paramStr += "\""+prefix+":status\":\"1\"";
			//paramStr += "\""+prefix+"_campaign_scene_id\":\""+getThisTabVars("campaign_scene_id")+"\"";
			paramStr+= "}";
			paramData["data"] = paramStr;
			isCreate = false;
			paramData["valueId"] = campaignId;
			paramData["async"] = false;
			// createOrNewH5();
			//新建活动
			Iptools.uidataTool._saveAppletData(paramData).done(function(data){
				if(data){
					campaignId = campaignId;
					setThisTabVars("campaignValueId",campaignId);
					addTags(tagsArr);
					createOrNewH5(me);
				}
			}).fail(function(){
				setTimeout(function(){
					me.button("reset");
					me.css("pointer-events","auto");
				},1000);
			})
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
	$("#tab0-panel #serviceApointment").bootstrapValidator('validate');

	//$(".comfirm-btn").attr("data-loading-text", "<span class='icon-refresh icon-spin' style='margin-right:10px'></span>正在处理");
	if ($("#tab0-panel #serviceApointment").data("bootstrapValidator").isValid()&&$("#editer").summernote('code') !== "<p><br></p>") {
		var paramData ={
			//"tenantId":Iptools.DEFAULTS.tenantId,
			//"userId":Iptools.DEFAULTS.userId,
			"appletId":h5Applet,
			async:false
		}
		//获取前缀。。
		Iptools.uidataTool._getApplet({
			//"tenantId":Iptools.DEFAULTS.tenantId,
			//"userId":Iptools.DEFAULTS.userId,
			"applet":h5Applet,
			async:false
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
			if(bgImgObj){
				var imgurl = getCanvasImgUrl(bgImgObj);
			}else{
				var imgurl = bgimgurlStr;
			}
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
				paramStr += "\""+prefix+":button_text\":\'立即预约\',";
			}
			paramStr += "\""+prefix+":button_color\":\'"+$("#mycolor").val()+"\',";
			//构建提交参数--基本信息
			paramStr += "\""+prefix+":rich_text\":\'"+$("#editer").summernote('code').replace(/'/g, '&apos;')+"\',";
			paramStr += "\""+prefix+":campaign_id\":\""+campaignId+"\",";
			paramStr += "\""+prefix+":campaign_template_id\":\""+campaign_template_id+"\",";
			paramStr += "\""+prefix+":title\":\""+$("#inputEma").val()+"\",";
			paramStr += "\""+prefix+":start_time\":\""+$("#inputE").val()+"\",";
			// paramStr += "\""+prefix+"_end_time\":\""+$("#endTime").val()+"\",";
			paramStr += "\""+prefix+":form_applet\":\""+formappletId+"\",";
			paramStr += "\""+prefix+":contact_phone\":\""+$("#tel").val()+"\",";
			paramStr += "\""+prefix+":sub_title\":\""+$("#inputEm").val()+"\",";
			//paramStr += "\""+prefix+"_location\":\""+$("#inp").val()+"\",";
			paramStr += "\""+prefix+":back_img\":\""+imgurl+"\"";
			paramStr+= "}";
			paramData["data"] = paramStr;
			//新建
			var ajaxType;
			ajaxType = "put";
			paramData["valueId"] = h5id;

			//ajax提交
			Iptools.uidataTool._saveAppletData(paramData).done(function(json){
				if(json.retcode !== "fail"){
//					    		  me.button("reset");
//								  me.css("pointer-events","auto");

					Iptools.Tool.pAlert({
						type: "info",
						title: "系统提示：",
						content: "更新成功",
						delay: 1000
					});
					//self.location.href = "../campaignInfo/campaignInfo.html";
					viewobj = {
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

						//如果是从详情进入的编辑
						if(!getThisTabVars("formList")){
							Iptools.Tool._redirectToParent();
						}else{//从list进入的编辑，直接关闭当前tab，进入到详情页
							Iptools.uidataTool._getView({
								view: detailView.views[0].view,
								async:false
							}).done( function (data) {
								Iptools.Tool._CloseTab({
									view: detailView.views[0].view,
									type: data.view.type,

								});
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
						}
					}else if(Iptools.Tool._getVersion()=="v2"){
						Iptools.uidataTool._getView({
							view: Iptools.DEFAULTS.currentView,
							async:false
						}).done( function (data) {
							Iptools.Tool._CloseTab({
								view: Iptools.DEFAULTS.currentView,
								type: data.view.type,
								valueId:Iptools.DEFAULTS.currentViewValue
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
var bgImgObj,bgimgurlStr;
$("#photo").on('change',function(e){
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
//        $("#inputEmail").val(files[0].name);
//        $("#serviceApointment").data("bootstrapValidator").updateStatus("inputEmail", "NOT_VALIDATED").validateField("inputEmail");
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
				$("#tab0-panel #serviceApointment").data("bootstrapValidator").updateStatus("inputEmail", "NOT_VALIDATED").validateField("inputEmail");
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

function switchServiceOther(){
	$(".switchBasic").css("display","none");
	$(".appendInfo").css("display","block");
	$(".section-acticle").addClass("sectionActicleBarChange");
	$(".section-event .navLeft").addClass("navLeftChange");
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
//    $(".tagit-new input").attr('placeholder','可输入自定义标签，以"空格"分隔');
	getVisitorTags();
}
function formContactEvent(){
//    $(".tagit-new input").attr('placeholder','可输入自定义标签，以"空格"分隔');
	getFormTags();
}
//系统的可选标签
function getVisitorTags() {
	Iptools.GetJson({
		url: "basic/tags",
		data: {
			tenantId: Iptools.getDefaults({ key: "tenantId" }),
			token:Iptools.DEFAULTS.token
		}
	}).done(function(data){
//        console.log(data);
		for(var i = 0;i<data.length;i++){
			var html = '<div class="chooseOnly"><span class="btn tag lgTag" onclick="chooseVisitorTag(this)">'+data[i].tagValue+'</span></div>';
			$(".VisitorEventTag").append(html);
		};
	})
};
function getFormTags() {
	Iptools.GetJson({
		url: "basic/tags",
		data: {
			tenantId: Iptools.getDefaults({ key: "tenantId" }),
			token:Iptools.DEFAULTS.token
		}
	}).done(function(data){
//        console.log(data);
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
		$(".section-siex .section-siex-first b").html("立即预约");
	}
}
function putService(){
//    console.log();
	var prefix=0;
	var paramStr = "";
	var paramData ={
		//"tenantId":Iptools.DEFAULTS.tenantId,
		//"userId":Iptools.DEFAULTS.userId,
		"applet":campaignApplet
	}
	Iptools.uidataTool._getApplet(campaignApplet).done(function(data){
		prefix = data.rootLink;
		paramStr += "{";
		paramStr += "\""+prefix+":tagValues\":\""+$(".tagit-hidden-field").val()+"\",";
		paramStr += "\""+prefix+":button_text\":\""+$("#btnWord").val()+"\",";
		paramStr += "\""+prefix+":button_color\":\""+$("#mycolor").val()+"\",";
		paramStr+= "}";
//            paramData["fieldData"] = paramStr;
//            console.log( paramData["fieldData"]);
////            var ajaxType = "post";
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
			fieldData:paramStr
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