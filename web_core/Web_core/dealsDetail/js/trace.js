/**
 * Created by sks on 2017/5/5.
 */
var trace = {};
trace = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        PAGE_SIZE : 5,
    },
    _rebuildUiDefaults: function (options) {
        trace._UIDEFAULFS = Iptools.Tool._extend(trace._UIDEFAULFS, options);
    },
    /*
     container :
     type :
     target :
     event :
     */
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
        trace._showTab();
        trace._clickGetTypeTrace({
            container:"#month-1",
            pageNow:1,
        })
        trace._clickGetTypeTrace({
            container:"#month-2",
            pageNow:1,
        })
        trace._clickGetTypeTrace({
            container:"#month-3",
            pageNow:1,
        })
    },
    _bindingEventAfterLoad: function () {

    },
    _init: function () {
        trace._bindingDomEvent();
        trace._bindingEventAfterLoad();
        $("#month-1").loading();
        $("#month-2").loading();
        $("#month-3").loading();
        trace._getTraceList({
            container:"#month-1",
            pageNow:1,
        });
        trace._getTraceList({
            container:"#month-2",
            pageNow:1,
        })
        trace._getTraceList({
            container:"#month-3",
            pageNow:1,
        })
        Iptools.Tool._pushListen("standard_deals_trace", function (ms) {
            if(ms.channel == "standard_deals_trace"){
                $("#month-1").html("");
                $("#month-1").loading();
                trace._getTraceList({
                    container:"#month-1",
                    pageNow:1,
                });
            }
        });
    },
    /*点击筛选面板*/
    _showTab:function(){
        widget._addEventListener({
            container:"body",
            type:"click",
            target:".select-btn",
            event:function(){
                if($(".trace-content .title-1 .s-search-bar").hasClass("active")){
                    $(".trace-content .title-1 .s-search-bar").removeClass("active");
                }else{
                    $(".trace-content .title-1 .s-search-bar").addClass("active");
                };
            }
        });
        widget._addEventListener({
            container:"body",
            type:"click",
            target:"button.clear",
            event:function(){
                $(".trace-type-selected option:first-child").prop("selected","selected");
                $(".trace-content .title-1 .s-search-bar").removeClass("active");
                $("#month-1").html(" ");
                $("#month-2").html(" ");
                $("#month-3").html(" ");
                trace._getTraceList({
                    container:"#month-1",
                    pageNow:1,
                });
                trace._getTraceList({
                    container:"#month-2",
                    pageNow:1,
                })
                trace._getTraceList({
                    container:"#month-3",
                    pageNow:1,
                })
            }
        })
    },
    /*获取最近三个月月份和本年*/
    _getMonthAndYears:function(month){
        var monthText = "";
        switch(month)
        {
            case 1:
                monthText = "一月";
                break;
            case 2:
                monthText = "二月"
                break;
            case 3:
                monthText = "三月"
                break;
            case 4:
                monthText = "四月"
                break;
            case 5:
                monthText = "五月"
                break;
            case 6:
                monthText = "六月"
                break;
            case 7:
                monthText = "七月"
                break;
            case 8:
                monthText = "八月"
                break;
            case 9:
                monthText = "九月"
                break;
            case 10:
                monthText = "十月"
                break;
            case 11:
                monthText = "十一月"
                break;
            case 12:
                monthText = "十二月"
                break;
        }
        return monthText;
    },
    /*获取动态的id*/
    _getTraceList:function(options){
        var promise = $.Deferred();
        if(options.pageNow > 1){
            $(options.container).find(".loadMore").loading();
        }
        Iptools.uidataTool._getCustomizeApplet({
            nameList:"'Contact Trace List'"
        }).done(function(data){
            if(data && data.applets){
                widget._UIDEFAULFS.traceListApplet = data.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet:widget._UIDEFAULFS.traceListApplet
                }).done(function(s){
                    if(s && s.rootLink){
                        widget._UIDEFAULFS.traceListRootId = s.rootLink;
                        var begin = $(options.container).attr("data-time")+"-01";
                        var end = $(options.container).attr("data-time");
                        var time  = end.split("-");
                        var endTime = time[0]+"-"+Number(Number(time[1])+1)+"-"+"01";
                        if(time[2] == 12){
                            endTime = Number(Number(time[0])+1)+"-"+Number(Number(time[1])+1)+"-"+"01";
                        }
                        var conditionPram = {};
                        conditionPram[widget._UIDEFAULFS.traceListRootId+":deal_id"] = " ='" + widget._UIDEFAULFS.dealId + "'";
                        conditionPram[widget._UIDEFAULFS.traceListRootId+":trace_time"] = " between '" + begin + "' and '" + endTime + "'";
                        if(options.type){
                            conditionPram[widget._UIDEFAULFS.traceListRootId+":trace_category"] = " ='" +options.type + "'";
                        }else {
                            delete conditionPram[widget._UIDEFAULFS.traceListRootId+":trace_category"];
                        }
                        var conditionPramJson = JSON.stringify(conditionPram);
                        Iptools.uidataTool._getUserlistAppletData({
                            appletId:widget._UIDEFAULFS.traceListApplet,
                            pageNow:options.pageNow,
                            pageSize:widget._UIDEFAULFS.PAGE_SIZE,
                            condition:conditionPramJson,
                            orderByColumn:'"'+widget._UIDEFAULFS.traceListRootId+':trace_time"',
                            orderByAscDesc:"desc"
                        }).done(function(r){
                            trace._buildDom(options,r);
                            $(options.container).find(".load-data-container").remove();
                            promise.resolve(r);
                        })
                    }
                })
            }
        })
    },
    /*组件dom结构*/
    _buildDom:function(options,r){
        if(options.pageNow > 1){
            $(options.container).find(".loadMore").remove();
        }else{

        };
        if(r && r.data && r.data.records){
            for(var i = 0;i<r.data.records.length;i++){
                var traceType = r.data.records[i][widget._UIDEFAULFS.traceListRootId+":trace_type"]["id"];
                var traceTypeName = "";
                if(r.data.records[i][widget._UIDEFAULFS.traceListRootId+":trace_type"]["name"]){
                    traceTypeName = r.data.records[i][widget._UIDEFAULFS.traceListRootId+":trace_type"]["name"];
                };
                var iconClassName = "";
                switch (traceType)
                {
                    case "10":
                        iconClassName = "fa-calendar-plus-o";
                        break;
                    case "11":
                        iconClassName = "fa-commenting-o";
                        break;
                    case "18":
                        iconClassName = "fa-commenting-o";
                        break;
                    case "19":
                        iconClassName = "fa-sign-in";
                        break;
                    case "23":
                        iconClassName = "fa-stop-circle";
                        break;
                    case "24":
                        iconClassName = "fa-check-square-o";
                        break;
                    case "27":
                        iconClassName = "fa-plus";
                        break;
                }
                var carNum = r.data.records[i][widget._UIDEFAULFS.traceListRootId+":deal_id"]["name"];
                var deeaTime = r.data.records[i][widget._UIDEFAULFS.traceListRootId+":update_time"];
                deeaTime = deeaTime.substr(5);
                var traceTime = r.data.records[i][widget._UIDEFAULFS.traceListRootId+":trace_time"];
                var traceContent =  r.data.records[i][widget._UIDEFAULFS.traceListRootId+":title"];
                var html = '<li class="trace-list">'+
                        '<span class="fa trace-list-fa '+iconClassName+'"></span>'+
                        '<div class="main-content">'+
                            '<div class="trace-left-content">'+
                                '<div class="trace-first-line">'+
                                    '<div class="trace-type">'+traceTypeName+'</div>'+
                                    '<div class="time">'+deeaTime+'</div>'+
                                '</div>'+
                                '<div class="trace-detail-list">对象 : <span class="car-number">'+carNum+'</span></div>'+
                                '<div class="trace-detail-list">时间 : <span class="deal-trace-time">'+traceTime+'</span></div>'+
                                '<div class="trace-detail-list">内容详情 : <span class="do-wahat">'+traceContent+'</span></div>'+
                            '</div>'+
                            '</div></li>'
                $(options.container).append(html);
            }
            var loadMoreHtml ="";
            loadMoreHtml = '<li class="loadMore"><button class="btn commonBtn revert load-more" type="button">加载更多动态</button></li>'
            $(options.container).append(loadMoreHtml);
            //如果没有下一页
            $(options.container).attr("data-pageNow",r.data.pageNow);
            $(options.container).attr("data-totalPage",r.data.pageCount);
            if(r.data.pageNow === r.data.pageCount){
                $(options.container).find(".loadMore").remove();
            }else{
                trace._clickGetMore(options);
            };
        }else {
            html = '<li class="trace-list"><span class="no-fa"></span><div class="main-content"><div class="trace-left-content" style="background-color: white;color:#ccc;padding: 0px;padding-left: 3px;">本月没有动态</div></div></li>';
            $(options.container).html(html);
            $(options.container).find(".main-content").css({
                "padding-top":"0px",
                "padding-bottom":"10px"
            });
        }
    },
    /*点击加载更多*/
    _clickGetMore:function(options){
        $("button.load-more").on("click",function(e){
            e.stopPropagation();
            if($(".trace-type-selected option:selected").val() != ""){
                trace._getTraceList({
                    "container":options.container,
                    "pageNow":Number($(options.container).attr("data-pageNow"))+1,
                    "type":$(".trace-type-selected option:selected").val()
                });
            }else{
                trace._getTraceList({
                    "container":options.container,
                    "pageNow":Number($(options.container).attr("data-pageNow"))+1,
                });
            }
        })
    },
    /*事件类型筛选*/
    _clickGetTypeTrace:function(options){
        $("button.trace-type-btn").on("click",function(e){
            e.stopPropagation();
            $(options.container).html(" ");
            trace._getTraceList({
                "container":options.container,
                "pageNow":options.pageNow,
                "type":$(".trace-type-selected option:selected").val()
            });
        })
        $(".trace-content .title-1 .s-search-bar").removeClass("active");
    },
}