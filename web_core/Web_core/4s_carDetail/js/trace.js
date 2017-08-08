/**
 * Created by sks on 2017/7/7.
 */
var trace = {}
trace = {
    DEFAULTS:{
        traceDetail:"",
        PAGE_SIZE:10,
        selectPanel:0 ,//s是否初始化删选面板，0：未初始化，1：初始化
        selectCondition:{}//筛选构建的condition
     },
    _getInteractInfo:function(ops){
        var promise = $.Deferred();
        var pageNow = ops.pageNow,begin = ops.thisMonth+"-"+"01",end = ops.thisMonth+"-"+"31",container = ops.container;

        var condition = {};
        condition = $.extend(true,{},trace.DEFAULTS.selectCondition);
        condition["contact_trace:car_id"] = " ="+widget.DEFAULTS.carId;
        condition['contact_trace:trace_time'] = " BETWEEN '" + begin + "' AND '"+end+"'";

        if(pageNow > 1){
            $(container).find(".loadMore").loading();
        }else{
            $(container).find(".status-block").loading();
        }
        //获取每一条车对应工单的里程
        if(trace.DEFAULTS.traceDetail == ""){
            Iptools.uidataTool._getCustomizeApplet({
                "nameList": "\"car_trace_list\""
            }).done(function (thisView) {
                trace.DEFAULTS.traceDetail = thisView.applets[0].applet;
                Iptools.uidataTool._getUserlistAppletData({
                    "appletId": trace.DEFAULTS.traceDetail,
                    "pageNow":pageNow,
                    "pageSize":trace.DEFAULTS.PAGE_SIZE,
                    "orderByColumn":"contact_trace:trace_time",
                    "orderByAscDesc":"desc",
                    "condition":JSON.stringify(condition)
                }).done(function(r){
                    if(r){
                        //构建动态dom
                        trace._buildTrace(ops,r);
                        promise.resolve();
                    }
                })
            })
        }else{
            Iptools.uidataTool._getUserlistAppletData({
                "appletId": trace.DEFAULTS.traceDetail,
                "pageNow":pageNow,
                "pageSize":trace.DEFAULTS.PAGE_SIZE,
                "orderByColumn":"contact_trace:trace_time",
                "orderByAscDesc":"desc",
                "condition": JSON.stringify(condition)
            }).done(function(r){
                if(r){
                    //构建动态dom
                    trace._buildTrace(ops,r);
                    promise.resolve(r);
                }
            })
        }
        $(".status-item-row").css("margin-top","10px");
        return promise;
    },
    _buildTrace:function(ops,r){
        if(ops.pageNow > 1){
            $(ops.container).find(".loadMore").remove();
        }else{
            $(ops.container).find(".status-block .load-data-container").remove();
        }
        if(trace.DEFAULTS.selectPanel === 0){
            widget._buildSelectPanel(r);
        }
        var  html ="";
        if(r && r.data && r.data.records){

            var len = r.data.records.length,
                records = r.data.records;
            for(var i = 0;i < len;i++){
                //构建每一条动态
                html += trace._buildTraceDomByType(records[i]);
            }
            $(ops.container).find(".status-block").append(html);

            //加载更多dom
            var loadMoreHtml ="";
            loadMoreHtml = '<div class="loadMore"><button>加载更多动态</button></div>'
            $(ops.container).find(".status-block").append(loadMoreHtml);

            //如果没有下一页
            if(r.data.pageNow === r.data.pageCount){
                $(ops.container).find(".loadMore").remove();
            }else{
                trace._bindLoadMoreEvent(ops);
            }

            $(ops.container).attr("data-pageNow",r.data.pageNow);
            $(ops.container).attr("data-totalPage",r.data.pageCount);
        }else{
            html +=
                '<div class="status-item-row no-data">'+
                "本月没有动态"+
                '</div>';
            $(ops.container).find(".status-block").append(html);
        }
        trace._bindSkipEvents();
    },
    _bindLoadMoreEvent:function(ops){
        $(".loadMore button").on("click",function(e){
            //e.stopPropagation();
            trace._getInteractInfo({
                "container":ops.container,
                "pageNow":ops.pageNow+1,
                "thisMonth":ops.thisMonth
            });
        });
        $(1)._jumpView({},null,function(){
            Iptools.Tool._setTabData({
                view:"",
                valueId:"",
                type:view.type,
                key:"contactLinkId",
                value:""
            });
            var value=Iptools.Tool._getTabData({
                view:"",
                valueId:"",
                type:view.type,
                key:"contactLinkId"
            })
        });
    },
    _buildTraceDomByType:function(r){
        var type= r["contact_trace:trace_type"].id,tracePrefix = "contact_trace",carPrefix = "car";
        var html ="",
            typeName ="",
            typeStr = "",//代表动态类型字符串
            isOwner = 0,//是否显示owner
            onlyLink = 0,//是否跳转且只显示title和跳转字段

            iconStr;
        var dealarr,deallen;
        switch(type){
            case "3"://消费
               typeName = "消费";
                iconStr = "fa-rmb";
                isOwner = 0;
                break;
            case "9"://创建任务
                typeName = "";
                iconStr = "fa-plus";
                isOwner = 0;
                break;
            case "10"://创建笔记
                typeName = "";
                iconStr = "fa-check";
                isOwner = 0;
                break;
            case "11"://创建笔记
                typeName = "";
                iconStr = "fa-commenting-o";
                isOwner = 0;
                break;
            case "14"://完成任务
                typeName = "";
                iconStr = "fa-calendar-plus-o";
                isOwner = 0;
                break;
            case "17":
                typeName = "回访";
                iconStr = "fa-file-text-o";
                isOwner = 1;
                break;
            case "18":
                typeName = "外呼";
                iconStr = "fa-file-text-o";
                isOwner = 1;
                break;
            case "19":
                typeName = "来电";
                iconStr = "fa-file-text-o";
                isOwner = 1;
                break;
            case "20"://维保
                typeName = "维保";
                iconStr = "fa-wrench";
                isOwner = 1;
                break;
            case "21"://到店
                typeName = "到店";
                iconStr = "fa-wpforms";
                isOwner = 1;
                break;
            case "22"://重新打开任务
                typeName = "";
                iconStr = "fa-toggle-on";
                isOwner = 0;
                break;
            case "27"://增加线索
                typeName = "线索";
                typeStr = "deal";
                iconStr = "fa-plus";
                isOwner = 0;
                onlyLink = 1;
                break;
            case "28"://增加保险
                typeName = "保险";
                typeStr = "insurance";
                iconStr = "fa-plus";
                isOwner = 0;
                onlyLink = 1;
                break;
            case "29"://增加延保
                typeName = "延保";
                typeStr = "extendInsurance";
                iconStr = "fa-plus";
                isOwner = 0;
                onlyLink = 1;
                break;
            case "30"://增加安吉星
                typeName = "安吉星";
                typeStr = "onStar";
                iconStr = "fa-plus";
                isOwner = 0;
                onlyLink = 1;
                break;
            default :
                typeName = "";
                iconStr = "fa-plus";
                isOwner = 0;
                break;

        }
        html +=
            '<div class="status-item-row">'+
            '<span class="rowIcon '+iconStr+'"></span>';
        html +='<div class="item-row">'+
            '<span>'+r[tracePrefix+":trace_type"].name+'</span>'+
            '<span class="item-row-right">'+r["contact_trace:trace_time"]+'</span>'+
            '</div>';
        if(!onlyLink){

            html +='<div class="item-row">'+
                '<span>'+typeName+'对象：</span>'+
                '<span class="status-val">'+r[carPrefix+":plate_number"]+'</span>'+
                '</div>';
            //html +='<div class="item-row">'+
            //    '<span>'+typeName+'时间：</span>'+
            //    '<span class="status-val">'+r[tracePrefix+":create_time"]+'</span>'+
            //    '</div>';
            html +='<div class="item-row">'+
                '<span>内容详情：</span>'+
                '<span class="status-val">'+r[tracePrefix+":title"]+'</span>'+
                '</div>';
            //来电记录需要显示是否接通
            if(type == "18"){
                var constatus = r[tracePrefix+":is_phone_connected"]?r[tracePrefix+":is_phone_connected"]:"";
                if(constatus){
                    constatus = "是";
                }else{
                    constatus = "否";
                }
                html +='<div class="item-row">'+
                    '<span>是否接通：</span>'+
                    '<span class="status-val">'+constatus+'</span>'+
                    '</div>';
            }


        }else{
            if(typeStr === "deal"){
                dealarr = r[tracePrefix+":title"].split("&");
                deallen = r[tracePrefix+":title"].split("&").length;

                html +='<div class="item-row">'+
                    '<span>线索类型：</span>'+
                    '<span class="status-val">'+dealarr[deallen-1]+'</span>'+
                    '</div>';
            }
            html +='<div class="item-row">'+
                '<span>'+typeName+'编号：</span>';
            //线索
            if(r[tracePrefix+":value_id"]){
                if(deallen >= 3){
                    html += '<span class="status-val clickable '+typeStr+'" data-id="'+r[tracePrefix+":value_id"]+'">'+dealarr[deallen-2].join("&")+'</span>';
                }else{
                    html += '<span class="status-val clickable '+typeStr+'" data-id="'+r[tracePrefix+":value_id"]+'">'+dealarr[deallen-2]+'</span>';
                }
            }else{
                var title = r[tracePrefix+":title"]?r[tracePrefix+":title"]:"";
                html += '<span class="status-val clickable '+typeStr+'">'+title+'</span>';
            }
            html +=  '</div>';
        }
        if(isOwner&&r[tracePrefix+":owner"]){
            html +='<div class="item-row">'+
            '<span>记录人：</span>'+
            '<span class="status-val">'+r[tracePrefix+":owner"].name+'</span>';
        }
            html+='</div>';
            html+='</div>';
        return html;
    },
    _bindSkipEvents:function(){
        //保险跳转
        $("body").on("click",".insurance",function(){
            trace._goInsuranceDetail(this);
        })
        //线索跳转
        $("body").on("click",".deal",function(){
            trace._goDealDetail(this);
        })
        //安吉星跳转
        $("body").on("click",".onStar",function(){
            trace._goOnStarDetail(this);
        })
        //延保跳转
        $("body").on("click",".extendInsurance",function(){
            trace._goExtendInsuranceDetail(this);
        })
    },
    //跳转线索详情
    _goDealDetail:function(e){
        var id = $(e).attr("data-id");
        if(id){
            var viewobj={nameList : '\"deals_detail_view\"'};//查看全部短信记录
            Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
                Iptools.uidataTool._getView({
                    view: thisView.views[0].view,
                    async: false
                }).done(function (data) {
                    Iptools.Tool._jumpView({
                        view: thisView.views[0].view,
                        name: data.view.name,
                        type: data.view.type,
                        primary: data.view.primary,
                        icon: data.view.icon,
                        url: data.view.url,
                        valueId: id,
                        bread: true
                    }, function () {
                    })
                })
            });
        }

    },
    //安吉星列表
    _goOnStarDetail:function(){
        var viewobj={nameList : '\"onStart_list\"'};//查看全部短信记录
        Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
            Iptools.uidataTool._getView({
                view: thisView.views[0].view,
                async: false
            }).done(function (data) {
                Iptools.Tool._jumpView({
                    view: thisView.views[0].view,
                    name: data.view.name,
                    type: data.view.type,
                    primary: data.view.primary,
                    icon: data.view.icon,
                    url: data.view.url,
                    bread: true
                }, function () {
                })
            })
        });
    },
    //延保列表
    _goExtendInsuranceDetail:function(){
        var viewobj = {nameList : '\"extendInsurance_list\"'};//查看全部短信记录
        Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
            Iptools.uidataTool._getView({
                view: thisView.views[0].view,
                async: false
            }).done(function (data) {
                Iptools.Tool._jumpView({
                    view: thisView.views[0].view,
                    name: data.view.name,
                    type: data.view.type,
                    primary: data.view.primary,
                    icon: data.view.icon,
                    url: data.view.url,
                    bread: true
                }, function () {
                })
            })
        });
    },
    //保险列表
    _goInsuranceDetail:function(){
        var viewobj={nameList : '\"insurance_list\"'};//查看全部短信记录
        Iptools.uidataTool._getCustomizeView(viewobj).done(function (thisView) {
            Iptools.uidataTool._getView({
                view: thisView.views[0].view,
                async: false
            }).done(function (data) {
                Iptools.Tool._jumpView({
                    view: thisView.views[0].view,
                    name: data.view.name,
                    type: data.view.type,
                    primary: data.view.primary,
                    icon: data.view.icon,
                    url: data.view.url,
                    bread: true
                }, function () {
                })
            })
        });
    }
}
