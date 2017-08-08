Iptools.Start();
buildPage();
//构建页面
function buildPage(){
	$(".mark-type").prepend(getSceneTypes());
}
//获取场景类型
function getSceneTypes(){
	var html = "";
	Iptools.GetJson({
	    //ajaxCounting:false,
	    url:"basic/campaignSceneTypes",
	    async:false,
	}).done(function(data){
    	if(data){
    		var max = data.length;
    		var i;
    		var campaign_template_id;
    		for(i = 0;i < max ; i++){
    			var sences = getScenesBySceneTypeId(data[i].id);
    			html +='<div class="row lee" id="cut" onload="tap()">'+
	            '<div class="attract col-md-2 col-sm-2 col-xs-2">'+data[i].title+
	               ' <span class="circle" id="hom"></span>'+
	               ' <span class="disc"></span>'+
	            '</div>'+
	            '<div class="potential col-md-10 col-sm-10 col-xs-8">'+
	                '<div class="attract-writing">'+data[i].description+'</div>';
    			//构建场景类型下的场景s
	    		if (sences.length > 0) {
	    			var slen = sences.length;
                    for (var j = 0;j < slen ; j++) {

						if(sences[j].backImg){
							html += '<div class="services col-md-4 col-sm-4 gray " data-pid="'+data[i].id+'" id="'+sences[j].id+'" data-ttype="'+sences[j].sceneTemplateType+'" style="background-image: url('+sences[j].backImg+')" onclick="goEditActivity(this)">';
						}else{
							html += '<div class="services col-md-4 col-sm-4 gray " data-pid="'+data[i].id+'" id="'+sences[j].id+'" data-ttype="'+sences[j].sceneTemplateType+'" onclick="goEditActivity(this)">';
						}

						html +=	'<div class="service-top">';

						html += '<span class="service-title" title="' + sences[j].title + '">' + sences[j].title + '</span></div>';
						html += '</div>';

		    	      };
                }
	        html +='</div>'+
	        '</div>';
    		}
    	}
	})
	return html;
}
//获取场景类型下的所有场景
function getScenesBySceneTypeId(id){
    var data;
	Iptools.GetJson({
      url:"basic/getCampaignSceneQuick",
      data:{campaignSceneTypeId:id,
		  "token":Iptools.DEFAULTS.token},
      async:false,
    }).done(function(obj){
       data = obj;
    })
    return data;
}

//编辑活动及对应h5
function goEditActivity(e) {
	var sceneId = $(e).attr("id");
	var sceneTypeId = $(e).attr("data-pid");
	var templateType = $(e).attr("data-ttype");
	//其中一项无值，直接return
	if (!Iptools.Tool._checkNull(sceneId) || !Iptools.Tool._checkNull(sceneTypeId) || !Iptools.Tool._checkNull(templateType)) {
		return false;
	}
	/**
	 * campaignSceneId表：sceneId,sceneType,sceneTemplateType;
	 */
	var camTemId;
	//获取campaigntemplateType
	Iptools.GetJson({
		url: "basic/campaignSceneTemplates?campaignSceneId=" + $(e).attr("id") + "&sceneTemplateType=" + templateType,
		async: false,
	}).done(function (data) {
		if (data) {
			camTemId = data[0].id;
			if (!camTemId) {
				return false;
			}
			var sceneName = "";
			var viewobj = {};
			switch (templateType) {
				case "5"://服务预约
					sceneName = "服务预约";
					viewobj = {
						"nameList": "\"campaignh5New1\""
					}
					break;
				case "4"://活动报名
					sceneName = "活动报名";
					viewobj = {
						"nameList": "\"campaignh5New2\""
					}
					break;
				case "7"://问卷调研
					sceneName = "问卷调研";
					viewobj = {
						"nameList": "\"campaign_new_survey\""
					}
					break;
			}


			Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
				//设置跳转tab下的局部变量
				if (Iptools.Tool._getVersion() == "v1") {
					Iptools.uidataTool._getView({
						view: thisView.views[0].view,
						async: false
					}).done(function (json) {
						//设置tab下的局部变量
						Iptools.Tool._setTabData({
							view: thisView.views[0].view,
							type: json.view.type,
							valueId:sceneId,
							key: "campaign_scene_id",
							value: $(e).attr("id")
						});
						Iptools.Tool._setTabData({
							view: thisView.views[0].view,
							type: json.view.type,
							valueId:sceneId,
							key: "campaign_template_id",
							value: camTemId
						});
					});
					Iptools.uidataTool._getView({
						view: thisView.views[0].view,
					}).done(function (data) {
						Iptools.Tool._jumpView({
							view: thisView.views[0].view,
							name: data.view.name + "-" + sceneName,
							valueId:sceneId,
							type: data.view.type,
							primary: data.view.primary,
							icon: data.view.icon,
							url: data.view.url,
							bread: true
						});
					});
				} else {
					Iptools.uidataTool._getView({
						view: thisView.views[0].view,
					}).done(function (json) {
						Iptools.Tool._jumpView({
							view: thisView.views[0].view,
							name: json.view.name + ">" + sceneName,
							type: json.view.type,
							valueId:sceneId,
							primary: json.view.primary,
							icon: json.view.icon,
							url: json.view.url,
							bread: true
						}, null, null, function () {
							//设置tab下的局部变量
							Iptools.Tool._setTabData({
								view: thisView.views[0].view,
								type: json.view.type,
								valueId:sceneId,
								key: "campaign_scene_id",
								value: $(e).attr("id")
							});
							Iptools.Tool._setTabData({
								view: thisView.views[0].view,
								type: json.view.type,
								valueId:sceneId,
								key: "campaign_template_id",
								value: camTemId
							});

						});
					});
				}
			});


		}
	})
}
//“选择活动类型”页面右侧白框点亮左边蓝球
$(document).on("mouseenter", ".potential", function() {
         $(this).parent().find(".circle").hide();
         $(this).parent().find(".disc").show();
});
$(document).on("mouseleave", ".potential", function() {
	$(this).parent().find(".circle").show();
    $(this).parent().find(".disc").hide();
});