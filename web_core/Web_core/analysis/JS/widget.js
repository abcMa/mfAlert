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
        widget._enableViewTabShow();
        widget._enableReportTimeChangeButton();
        widget._enableReportTypeChangeButton();
        widget._enableReportTimeConditionRefresh();
        widget._enableAnalysisTabShow();
        widget._enableCampaignAnalysisTabShow();
        widget._enableCampaignChoosenClear();
        widget._enableCampaignReportStartBtn();
        widget._enableCampaignTimeConditionSearch();
        widget._enableTagReportAnalysisTabShow();
    },
    _bindingEventAfterLoad: function () {
        widget._enableTimeOrDateField();
        widget._enableContactDataTimePicker();
    },
    _init: function () {
        Iptools.Tool._coverWindowShow();
        widget._bindingDomEvent();
        widget._setDefaultContent();
        widget._setContactWholeReport();
        widget._initCampaignData();
        widget._bindingEventAfterLoad();
        setTimeout(function () {
            Iptools.Tool._coverWindowHide();
        }, 1500);
    },
    _initCampaignData: function () {
        $('#campaign-choosen-list').multiselect({
            allSelectedText: "全选",
            nonSelectedText: "未选择",
            nSelectedText: "已选择",
            buttonWidth: "100%",
            maxHeight: 400,
            onChange: function (option, checked) {
                if (checked) {
                    widget._UIDEFAULFS.campaignSelect.text.push($(option).text());
                    widget._UIDEFAULFS.campaignSelect.value.push($(option).val());
                    if (widget._UIDEFAULFS.campaignSelect.value.length == 5) {
                        $(".campaign-select-panel .multiselect-container").find("li").each(function (key, obj) {
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
                    $(".campaign-select-panel .multiselect-container").find("li").each(function (key, obj) {
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
                    if (ds.data && ds.data.records) {
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
            var span = document.createElement("span");
            $(span).html(oda);
            $("#campaign-choosen-body").append(span);
        }
    },
    _setDefaultContent: function () {
        $("#reportSearch_cpt").attr("data-loading-text", "<span class='icon-refresh icon-spin'></span>");
        $("#start-analysis-campaign").attr("data-loading-text", "<span class='icon-refresh icon-spin'></span>");
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Type Report'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    async: false,
                    applet: data.applets[0].applet
                }).done(function (ds) {
                    $(".report-type-btn").data("link", ds.rootLink);
                });
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Type Report'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    async: false,
                    applet: data.applets[0].applet
                }).done(function (ds) {
                    $("#reportSearch_cpt").data("link", ds.rootLink);
                });
            }
        });
    },
    _setCampaignReport: function () {
        widget._setCampaignAnalysisReport({
            nameList: "'Campaign Analysis Type 2'",
            panel: "campaign-type-1",
            type: "2"
        });
    },
    _setCampaignAnalysisReport: function (options) {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: options.nameList
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    async: false,
                    applet: data.applets[0].applet
                }).done(function (ds) {
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
                });
            }
        });
    },
    _setContactPieReport: function (options) {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: options.nameList
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._buildReport({
                    applet: data.applets[0].applet,
                    container: options.container,
                    condition: options.condition,
                    showReport: true
                });
            }
        });
    },
    _setContactPieGroupChart: function () {
        widget._setContactPieReport({
            nameList: "'Contact Pie Group Type'",
            container: "ana2-pie-chart-1"
        });
        widget._setContactPieReport({
            nameList: "'Contact Pie Group Region'",
            container: "ana2-pie-chart-2"
        });
        widget._setContactPieReport({
            nameList: "'Contact Pie Group Location'",
            container: "ana2-pie-chart-3"
        });
        widget._setContactPieReport({
            nameList: "'Contact Pie Group Gender'",
            container: "ana2-pie-chart-4"
        });
        widget._setContactPieReport({
            nameList: "'Contact Pie Group Age'",
            container: "ana2-pie-chart-5"
        });
        widget._setContactPieReport({
            nameList: "'Contact Pie Group Income'",
            container: "ana2-pie-chart-6"
        });
        widget._setContactPieReport({
            nameList: "'Contact Pie Group Education'",
            container: "ana2-pie-chart-7"
        });
    },
    _setStepChart: function (options) {
    	//$("#stepChart").html("");
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact New Count Report'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._buildReport({
                    applet: data.applets[0].applet,
                    container: "stepChart",
                    date: (new Date()).format("yyyyMMdd"),
                    timeType: options.type,
                    showReport: true
                });
            }
        });
    },
    _setContactChart: function (options) {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Type Report'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._buildReport({
                    applet: data.applets[0].applet,
                    condition: options.condition,
                    container: "contactChart",
                    showReport: true
                }).done(function (rs) {
                    var index1 = rs.series[0].categories.indexOf("潜在客户");
                    var index2 = rs.series[0].categories.indexOf("消费客户");
                    var index3 = rs.series[0].categories.indexOf("会员客户");
                    var rdata = rs.series[0].data;
                    var n1 = parseInt(rdata[index1]), n2 = parseInt(rdata[index2]), n3 = parseInt(rdata[index3]);
                    if (n1 + n2) {
                        $("#line_rate_cost").text(parseInt(n2 / (n1 + n2) * 100) + "%");
                    } else {
                        $("#line_rate_cost").text("0%");
                    }
                    if (n1 + n2 + n3) {
                        $("#line_rate_total").text(parseInt((n2 + n3) / (n1 + n2 + n3) * 100) + "%");
                    } else {
                        $("#line_rate_total").text("0%");
                    }
                    if (n2 + n3) {
                        $("#line_rate_member").text(parseInt(n3 / (n2 + n3) * 100) + "%");
                    } else {
                        $("#line_rate_member").text("0%");
                    }
                });
            }
        });
    },
    _setContactWholeReport: function () {
        widget._setStepChart({
            type: 'year'
        });
        widget._setContactChart({
            condition: ""
        });
        widget._setTagReports({
            panel: "all-type-contact",
            contactType: ""
        });
    },
    _setTagReports: function (options) {
    	$("#" + options.panel).html("");
    	var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
        var para = {
            tenantId: Iptools.DEFAULTS.tenantId
        }
        if (Iptools.Tool._checkNull(options.contactType)) {
            para["contactType"] = options.contactType;
        }
        para["token"]= Iptools.DEFAULTS.token,
        Iptools.GetJson({
            url: "service/contactTagReport",
            data: para
        }).done(function (r) {
            if (r && r.series && r.categories) {
            	if(r.series.length === 0 || r.series[0].data.length === 0){
            		$("#" + options.panel).html(emptyHtml);
            		$("#" + options.panel+" .noDataArea").css("padding-top",$("#" + options.panel).height() === 0 ? 0+"px":($("#" + options.panel).height()- 175)/2+"px");
            	}else{
            		$('#' + options.panel).highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: null
                        },
                        plotOptions: {
                            series: {
                                colorByPoint: true
                            }
                        },
                        xAxis: {
                            categories: r.categories
                        },
                        yAxis: {
                            title: {
                                text: "数量(个)"
                            }
                        },
                        series: r.series
                    });
            	}
                
            }
        });
    },
    _enableTimeOrDateField: function () {
        $(".datetimepickSearch").datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: "month"
        });
    },
    //客户转化分析的结束时间不能小于开始时间
    _enableContactDataTimePicker:function(){
    	$('.datetimepickSearch').datetimepicker().on('changeDate', function(ev){
    	    if ($(this).attr("id") === "contact-startTime"){
    	    	$("#contact-endTime").datetimepicker('setStartDate', $(this).val());
    	    }else if($(this).attr("id") === "contact-endTime"){
    	    	$('#contact-startTime').datetimepicker('setEndDate', $(this).val());
    	    }else if($(this).attr("id") === "campaign-startTime"){
    	    	$('#campaign-endTime').datetimepicker('setStartDate', $(this).val());
    	    }else if($(this).attr("id") === "campaign-endTime"){
    	    	$('#campaign-startTime').datetimepicker('setEndDate', $(this).val());
    	    }
    	});
    },
    _enableViewTabShow: function () {
        widget._addEventListener({
            container: "body",
            type: "shown.bs.tab",
            target: ".analysis-tab-child a",
            event: function () {
                var me = $(this);
                if (me.data('type') == "1") {
                    setTimeout(function () {
                        widget._setContactWholeReport();
                    }, 100);
                } else {
                    setTimeout(function () {
                        widget._setContactPieGroupChart();
                    }, 100);
                }
            }
        });
    },
    _enableAnalysisTabShow: function () {
        widget._addEventListener({
            container: "body",
            type: "shown.bs.tab",
            target: ".analysis-tab a",
            event: function () {
                var me = $(this);
                if (me.data('type') == "1") {
                    setTimeout(function () {
                        widget._setContactWholeReport();
                    }, 100);
                } else if (me.data("type") == "4") {
                    setTimeout(function () {
                        widget._setCampaignReport();
                    }, 100);
                }
            }
        });
    },
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
                            widget._setCampaignAnalysisReport({
                                nameList: "'Campaign Analysis Type 2'",
                                panel: "campaign-type-1",
                                type: "2"
                            });
                        }, 100);
                        break;
                    case 2:
                        setTimeout(function () {
                            widget._setCampaignAnalysisReport({
                                nameList: "'Campaign Analysis Type 1'",
                                panel: "campaign-type-2",
                                type: "1"
                            });
                        }, 100);
                        break;
                    case 3:
                        setTimeout(function () {
                            widget._setCampaignAnalysisReport({
                                nameList: "'Campaign Analysis Type 3'",
                                panel: "campaign-type-3",
                                type: "3"
                            });
                        }, 100);
                        break;
                    case 4:
                        setTimeout(function () {
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
    _enableTagReportAnalysisTabShow: function () {
        widget._addEventListener({
            container: "body",
            type: "shown.bs.tab",
            target: "#tag_report_analysis a",
            event: function () {
                var me = $(this);
                switch (me.data("type")) {
                    case 1:
                        setTimeout(function () {
                            widget._setTagReports({
                                panel: "all-type-contact",
                                contactType: ""
                            });
                        }, 100);
                        break;
                    case 2:
                        setTimeout(function () {
                            widget._setTagReports({
                                panel: "1-type-contact",
                                contactType: "2"
                            });
                        }, 100);
                        break;
                    case 3:
                        setTimeout(function () {
                            widget._setTagReports({
                                panel: "2-type-contact",
                                contactType: "3"
                            });
                        }, 100);
                        break;
                    case 4:
                        setTimeout(function () {
                            widget._setTagReports({
                                panel: "3-type-contact",
                                contactType: "4"
                            });
                        }, 100);
                        break;
                }
            }
        });
    },
    _enableReportTimeChangeButton: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".report-time-btn",
            event: function () {
                var me = $(this);
                me.parent().find(".report-time-btn").removeClass("report-btn-selected");
                me.addClass("report-btn-selected");
                switch (me.data("target")) {
                    case "contact-trend":
                        widget._setStepChart({
                            type: me.data("type")
                        });
                        break;
                }
            }
        });
    },
    _enableReportTypeChangeButton: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".report-type-btn",
            event: function () {
                var me = $(this);
                me.parent().find(".report-type-btn").removeClass("report-btn-selected");
                var condition = {};
                me.addClass("report-btn-selected");
                if (Iptools.Tool._checkNull(me.data("target"))) {
                    switch (me.data("type")) {
                        case 2:
                        case 3:
                        case 4:
                            condition[me.data("link") + ":contactType"] = "=" + me.data("type");
                            break;
                    }
                    switch (me.data("target")) {
                        case "ana2-pie-chart-2":
                            widget._setContactPieReport({
                                nameList: "'Contact Pie Group Region'",
                                container: "ana2-pie-chart-2",
                                condition: JSON.stringify(condition)
                            });
                            break;
                        case "ana2-pie-chart-3":
                            widget._setContactPieReport({
                                nameList: "'Contact Pie Group Location'",
                                container: "ana2-pie-chart-3",
                                condition: JSON.stringify(condition)
                            });
                            break;
                        case "ana2-pie-chart-4":
                            widget._setContactPieReport({
                                nameList: "'Contact Pie Group Gender'",
                                container: "ana2-pie-chart-4",
                                condition: JSON.stringify(condition)
                            });
                            break;
                        case "ana2-pie-chart-5":
                            widget._setContactPieReport({
                                nameList: "'Contact Pie Group Age'",
                                container: "ana2-pie-chart-5",
                                condition: JSON.stringify(condition)
                            });
                            break;
                        case "ana2-pie-chart-6":
                            widget._setContactPieReport({
                                nameList: "'Contact Pie Group Income'",
                                container: "ana2-pie-chart-6",
                                condition: JSON.stringify(condition)
                            });
                            break;
                        case "ana2-pie-chart-7":
                            widget._setContactPieReport({
                                nameList: "'Contact Pie Group Education'",
                                container: "ana2-pie-chart-7",
                                condition: JSON.stringify(condition)
                            });
                            break;
                    }
                }
            }
        });
    },
    _enableReportTimeConditionRefresh: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#reportSearch_cpt",
            event: function () {
                var me = $(this);
                me.button("loading");
                me.css("pointer-events", "none");
                var tinputs = me.parent().find("input");
                var condition = {};
                if (tinputs.length) {
                    setTimeout(function () {
                        var update = tinputs.eq(0).val();
                        var downdate = tinputs.eq(1).val();
                        if (update != "" && downdate != "") {
                            condition[me.data("link") + ":create_time"] = " between '" + update + "' and '" + downdate + "'";
                        } else if (update != "") {
                            condition[me.data("link") + ":create_time"] = " >= '" + update + "'";
                        } else if (downdate != "") {
                            condition[me.data("link") + ":create_time"] = " <= '" + downdate + "'";
                        }
                        if (!$.isEmptyObject(condition)) {
                            widget._setContactChart({
                                condition: JSON.stringify(condition)
                            });
                        }
                    }, 100);
                    me.button("reset");
                    me.css("pointer-events", "auto");
                }
            }
        });
    },
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
                                widget._setCampaignAnalysisReport({
                                    nameList: "'Campaign Analysis Type 2'",
                                    panel: "campaign-type-1",
                                    type: "2"
                                });
                                break;
                            case 2:
                                widget._setCampaignAnalysisReport({
                                    nameList: "'Campaign Analysis Type 1'",
                                    panel: "campaign-type-2",
                                    type: "1"
                                });
                                break;
                            case 3:
                                widget._setCampaignAnalysisReport({
                                    nameList: "'Campaign Analysis Type 3'",
                                    panel: "campaign-type-3",
                                    type: "3"
                                });
                                break;
                            case 4:
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
    _enableCampaignChoosenClear: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#clear-analysis-campaign",
            event: function () {
                $('#campaign-choosen-list').multiselect('deselectAll', false);
                $('#campaign-choosen-list').multiselect('updateButtonText');
                $(".campaign-select-panel .multiselect-container").find("li").each(function (key, obj) {
                    $(obj).removeClass("disabled");
                    $(obj).find("input[type=checkbox]").removeAttr("disabled", "disabled");
                });
                $("#campaign-choosen-body").html("");
                widget._UIDEFAULFS.campaignSelect = { text: [], value: [] };
                widget._UIDEFAULFS.campaignCondition = {};
            }
        });
    },
    _enableCampaignTimeConditionSearch: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#reportSearch_campaign",
            event: function () {
                var me = $(this);
                me.css("pointer-events", "none");
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
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 2'",
                            panel: "campaign-type-1",
                            type: "2"
                        });
                        break;
                    case 2:
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 1'",
                            panel: "campaign-type-2",
                            type: "1"
                        });
                        break;
                    case 3:
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 3'",
                            panel: "campaign-type-3",
                            type: "3"
                        });
                        break;
                    case 4:
                        widget._setCampaignAnalysisReport({
                            nameList: "'Campaign Analysis Type 5'",
                            panel: "campaign-type-4",
                            type: "5"
                        });
                }
                setTimeout(function () {
                    me.find("span").removeClass("icon-spin");
                    me.css("pointer-events", "auto");
                }, 1000);
            }
        });
    },
};