//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :analysis
/**
    ui element styles and placement
    this widget is only adapted to CRM workspace for PC
    style :tag panels listing and horizend placements style
**/
var widget = {};
widget = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        campaignSelect: { text: [], value: [] },
        campaignCondition: {}
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
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
        widget._setCampaignReport(); //初始进入页面，页面浏览量
        widget._enableCampaignAnalysisTabShow(); //点击不同的营销活动对比分析出现的图标
        widget._enableCampaignChoosenClear(); //点击清空按钮
        widget._enableCampaignReportStartBtn(); //点击开始分析营销活动的按钮
        widget._enableCampaignTimeConditionSearch(); //选择时间范围
    },
    _bindingEventAfterLoad: function () {
        widget._enableTimeOrDateField(); //时间插件
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._bindingEventAfterLoad();
        widget._initCampaignData();  //初始化营销活动
    },
    _initCampaignData: function () {
        $('#campaign-choosen-list').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            allSelectedText: "全选",
            nonSelectedText: "未选择",
            nSelectedText: "已选择",
            buttonWidth: "270px",
            maxHeight: 270,
            onChange: function (option, checked) {
                if (checked) {
                    widget._UIDEFAULFS.campaignSelect.text.push($(option).text());
                    widget._UIDEFAULFS.campaignSelect.value.push($(option).val());
                    if (widget._UIDEFAULFS.campaignSelect.value.length == 5) {
                        $(".left .multiselect-container").find("li").each(function (key, obj) {
                            if (!$(obj).hasClass("active")) {
                                $(obj).addClass("disabled");
                                $(obj).find("input[type=checkbox]").attr("disabled", "disabled");
                            }
                        });
                    }
                } else {
                    var index = widget._UIDEFAULFS.campaignSelect.value.indexOf($(option).val());
                    if (index > -1) {
                        widget._UIDEFAULFS.campaignSelect.text.splice(index, 1);
                        widget._UIDEFAULFS.campaignSelect.value.splice(index, 1);
                    }
                    $(".left .multiselect-container").find("li").each(function (key, obj) {
                        $(obj).removeClass("disabled");
                        $(obj).find("input[type=checkbox]").removeAttr("disabled", "disabled");
                    });
                }
                widget._setCampaignSelectPanel();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign List Applet'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: data.applets[0].applet,
                    async: false,
                    pageNow: 1,
                    pageSize: 100
                }).done(function (ds) {
                    if (ds && ds.data && ds.data.records) {
                        var sopts = [];
                        for (var i = 0; i < ds.data.records.length; i++) {
                            var odata = ds.data.records[i];
                            var opt = {};
                            opt["label"] = odata[ds.rootLink + ":title"];
                            opt["title"] = odata[ds.rootLink + ":title"];
                            opt["value"] = odata[ds.rootLink + ":id"];
                            sopts.push(opt);
                        }
                        $('#campaign-choosen-list').multiselect('dataprovider', sopts);
                    }
                    $("#start-analysis-campaign").data("link", ds.rootLink);
                });
            }
        });
    },
    _setCampaignSelectPanel: function () {
        $("#campaign-choosen-body").html("");
        for (var i = 0; i < widget._UIDEFAULFS.campaignSelect.text.length; i++) {
            var oda = widget._UIDEFAULFS.campaignSelect.text[i];
            var li = document.createElement("li");
            $(li).html(oda);
            $("#campaign-choosen-body").append(li);
        }
    },
    /*初始进入页面，页面浏览量*/
    _setCampaignReport: function () {
        widget._setCampaignAnalysisReport({
            nameList: "'Campaign Analysis Type 2'",
            panel: "campaign-type-1",
            type: "2"
        });
    },
    _setCampaignAnalysisReport: function (options) {
        $("#campaign-type-1").loading();
        Iptools.uidataTool._getCustomizeApplet({
            nameList: options.nameList
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    async: false,
                    applet: data.applets[0].applet
                }).done(function (ds) {
                    if(ds){
                        var rLink = ds.rootLink;
                        var condition = {};
                        for (var item in widget._UIDEFAULFS.campaignCondition) {
                            condition[item] = widget._UIDEFAULFS.campaignCondition[item];
                        }
                        if (Iptools.Tool._checkNull(condition["campaign_id"])) {
                            condition[rLink + ":campaign_id"] = condition["campaign_id"];
                            delete condition["campaign_id"];
                        }
                        if (Iptools.Tool._checkNull(condition["create_time"])) {
                            condition[rLink + ":create_time"] = condition["create_time"];
                            delete condition["create_time"];
                        }
                        condition[rLink + ":campaign_response_type"] = "=" + options.type;
                        Iptools.uidataTool._buildReport({
                            applet: data.applets[0].applet,
                            container: options.panel,
                            condition: JSON.stringify(condition),
                            showReport: true
                        });
                    }
                });
            }
        });
    },
    /*时间插件*/
    _enableTimeOrDateField: function () {
        $(".datetimepickSearch").datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: "month"
        });
        $('.datetimepickSearch').datetimepicker().on('changeDate', function () {
            if ($(this).attr("id") == "campaign-startTime"){
                $(this).css("color","#282828");
                $("#campaign-endTime").datetimepicker('setStartDate', $(this).val());
            }else if($(this).attr("id") == "campaign-endTime"){
                $(this).css("color","#282828");
                $('#campaign-startTime').datetimepicker('setEndDate', $(this).val());
            }else if($(this).attr("id") == "campaign-startTime"){
                $(this).css("color","#282828");
                $('#campaign-endTime').datetimepicker('setStartDate', $(this).val());
            }else if($(this).attr("id") == "campaign-endTime"){
                $(this).css("color","#282828");
                $('#campaign-startTime').datetimepicker('setEndDate', $(this).val());
            }
        });
    },
    /*点击不同的营销活动对比分析出现的图标*/
    _enableCampaignAnalysisTabShow: function () {
        widget._addEventListener({
            container: "body",
            type: "shown.bs.tab",
            target: "#campaign-analysis-tab-holder a",
            event: function () {
                var me = $(this);
                switch (me.data("type")) {
                    case 1:
                        setTimeout(function () {
                            $("#campaign-type-1").loading();
                            widget._setCampaignAnalysisReport({
                                nameList: "'Campaign Analysis Type 2'",
                                panel: "campaign-type-1",
                                type: "2"
                            });
                        }, 100);
                        break;
                    case 2:
                        setTimeout(function () {
                            $("#campaign-type-2").loading();
                            widget._setCampaignAnalysisReport({
                                nameList: "'Campaign Analysis Type 1'",
                                panel: "campaign-type-2",
                                type: "1"
                            });
                        }, 100);
                        break;
                    case 3:
                        setTimeout(function () {
                            $("#campaign-type-3").loading();
                            widget._setCampaignAnalysisReport({
                                nameList: "'Campaign Analysis Type 3'",
                                panel: "campaign-type-3",
                                type: "3"
                            });
                        }, 100);
                        break;
                    case 4:
                        setTimeout(function () {
                            $("#campaign-type-4").loading();
                            widget._setCampaignAnalysisReport({
                                nameList: "'Campaign Analysis Type 5'",
                                panel: "campaign-type-4",
                                type: "5"
                            });
                        }, 100);
                        break;
                }
            }
        });
    },
    /*点击开始分析营销活动的按钮*/
    _enableCampaignReportStartBtn: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#start-analysis-campaign",
            event: function () {
                var me = $(this);
                if (widget._UIDEFAULFS.campaignSelect.value.length < 2) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "请选择2-5个营销活动"
                    });
                } else {
                    me.button("loading");
                    me.css("pointer-events", "none");
                    setTimeout(function () {
                        widget._UIDEFAULFS.campaignCondition["campaign_id"] = " in (" + widget._UIDEFAULFS.campaignSelect.value.join(",") + ")";
                        switch ($("#campaign-analysis-tab-holder li.active").find("a").data("type")) {
                            case 1:
                                $("#campaign-type-1").loading();
                                widget._setCampaignAnalysisReport({
                                    nameList: "'Campaign Analysis Type 2'",
                                    panel: "campaign-type-1",
                                    type: "2"
                                });
                                break;
                            case 2:
                                $("#campaign-type-2").loading();
                                widget._setCampaignAnalysisReport({
                                    nameList: "'Campaign Analysis Type 1'",
                                    panel: "campaign-type-2",
                                    type: "1"
                                });
                                break;
                            case 3:
                                $("#campaign-type-3").loading();
                                widget._setCampaignAnalysisReport({
                                    nameList: "'Campaign Analysis Type 3'",
                                    panel: "campaign-type-3",
                                    type: "3"
                                });
                                break;
                            case 4:
                                $("#campaign-type-4").loading();
                                widget._setCampaignAnalysisReport({
                                    nameList: "'Campaign Analysis Type 5'",
                                    panel: "campaign-type-4",
                                    type: "5"
                                });
                        }
                        me.button("reset");
                        me.css("pointer-events", "auto");
                    }, 1000);
                }
            }
        });
    },
    /*点击清空按钮*/
    _enableCampaignChoosenClear: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#clear-analysis-campaign",
            event: function () {
                $('#campaign-choosen-list').multiselect('deselectAll', false);
                $('#campaign-choosen-list').multiselect('updateButtonText');
                $(".left .multiselect-container").find("li").each(function (key, obj) {
                    $(obj).removeClass("disabled");
                    $(obj).find("input[type=checkbox]").removeAttr("disabled", "disabled");
                });
                $("#campaign-choosen-body").html("");
                widget._UIDEFAULFS.campaignSelect = { text: [], value: [] };
                widget._UIDEFAULFS.campaignCondition = {};
            }
        });
    },
    /*选择一段时间进行营销活动分析*/
    _enableCampaignTimeConditionSearch: function () {
        $("#reportSearch_campaign").attr("data-loading-text", "<span class='fa fa-refresh'></span>");
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#reportSearch_campaign",
            event: function () {
                var me = $(this);
                me.css("pointer-events", "none");
                me.button("loading");
                me.find("span").addClass("icon-spin");
                var tinput = me.parent().find("input.datetimepickSearch");
                var utime = tinput.eq(0).val();
                var dtime = tinput.eq(1).val();
                if (Iptools.Tool._checkNull(utime) && Iptools.Tool._checkNull(dtime)) {
                    widget._UIDEFAULFS.campaignCondition["create_time"] = " between '" + utime + "' and '" + dtime + "'";
                } else if (Iptools.Tool._checkNull(utime)) {
                    widget._UIDEFAULFS.campaignCondition["create_time"] = " >= '" + utime + "'";
                } else if (Iptools.Tool._checkNull(dtime)) {
                    widget._UIDEFAULFS.campaignCondition["create_time"] = " <= '" + dtime + "'";
                } else {
                    delete widget._UIDEFAULFS.campaignCondition["create_time"];
                }
                switch ($("#campaign-analysis-tab-holder li.active").find("a").data("type")) {
                    case 1:
                        $("#campaign-type-1").loading();
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 2'",
                            panel: "campaign-type-1",
                            type: "2"
                        });
                        break;
                    case 2:
                        $("#campaign-type-2").loading();
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 1'",
                            panel: "campaign-type-2",
                            type: "1"
                        });
                        break;
                    case 3:
                        $("#campaign-type-3").loading();
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 3'",
                            panel: "campaign-type-3",
                            type: "3"
                        });
                        break;
                    case 4:
                        $("#campaign-type-4").loading();
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 5'",
                            panel: "campaign-type-4",
                            type: "5"
                        });
                }
                setTimeout(function () {
                    me.find("span").removeClass("icon-spin");
                    me.css("pointer-events", "auto");
                    me.button("reset");
                }, 1000);
            }
        });
    },
};