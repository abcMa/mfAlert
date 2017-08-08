/**
 * Created by sks on 2017/6/9.
 */
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
        widget._changeTab();
        widget._changeTwoTab();
        widget._enableReportTimeChangeButton();//客户趋势不同时间
        widget._enableReportTimeConditionRefresh();//客户转化分析指定时间段
        widget._enableTagReportAnalysisTabShow();//不同客户类型的标签分布的图标
    },
    _bindingEventAfterLoad: function () {
        widget._enableTimeOrDateField();
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._bindingEventAfterLoad();
        widget._setStepChart({
            type: 'year'
        });//客户趋势分析图表
        widget._setDefaultContent();
    },
    //不同导航栏的切换
    _changeTab:function(){
        widget._addEventListener({
            container:"body",
            target:"li:nth-child(1).title li a",
            type:"click",
            event:function(){
                $("li:nth-child(2).title li").removeClass("active");
                $(".comprehensive").css("display","block");
                $(".nature").css("display","none");
                if($(this).attr("aria-controls") == "collapseTrend"){
                    widget._setStepChart({
                        type: 'year'
                    });//客户趋势分析图表
                    $("#collapseTrend").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "collapseConversion"){
                    widget._setContactChart({
                        condition: ""
                    });//客户转化分析
                    $("#collapseConversion").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "collapseTags"){
                    widget._setTagReports({
                        panel: "all-type-contact",
                        contactType: ""
                    });//客户标签分析
                    $("#collapseTags").removeClass("collapse").siblings().addClass("collapse");
                }
            },
        })
    },
    _changeTwoTab:function(){
        widget._addEventListener({
            container:"body",
            target:"li:nth-child(2).title li a",
            type:"click",
            event:function(){
                $("li:nth-child(1).title li").removeClass("active");
                $(".comprehensive").css("display","none");
                $(".nature").css("display","block");
                if($(this).attr("aria-controls") == "models"){
                    widget._setContactPieReport({
                        nameList: "'car_model_cg_analysis_report'",
                        container: "modelsChart"
                    }); /*车型分析图表*/
                    $("#models").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "valueContact"){
                    widget._setContactPieReport({
                        nameList: "'pre_paid_cg_analysis_report'",
                        container: "valueContactChart"
                    }); /*储值客户分析图表*/
                    $("#valueContact").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "sourceContact"){
                    widget._setContactPieReport({
                        nameList: "'Contact Pie Group Region'",
                        container: "sourceContactChart"
                    }); /*客户来源分析图表*/
                    $("#sourceContact").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "store"){
                    widget._setContactPieReport({
                        nameList: "'last_visit_cg_analysis_report'",
                        container: "storeChart"
                    }); /*每次到店分析图表*/
                    $("#store").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "buy"){
                    widget._setContactPieReport({
                        nameList: "'buy_date_cg_analysis_report'",
                        container: "buyChart"
                    });/*购车时间图表*/
                    $("#buy").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "interaction"){
                    widget._setContactPieReport({
                        nameList: "'visit_times_cg_analysis_report'",
                        container: "interactionChart"
                    }); /*用户互动图表*/
                    $("#interaction").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "consumption"){
                    widget._setContactPieReport({
                        nameList: "'cg_fee_cg_analysis_report'",
                        container: "consumptionChart"
                    }); /*消费额图表*/
                    $("#consumption").removeClass("collapse").siblings().addClass("collapse");
                }else if($(this).attr("aria-controls") == "type"){
                    widget._setContactPieReport({
                        nameList: "'cg_visit_cg_analysis_report'",
                        container: "typeChart"
                    }); /*车型分析图表*/
                    $("#type").removeClass("collapse").siblings().addClass("collapse");
                }
            },
        })
    },
    _setDefaultContent: function () {
        $("#reportSearch_cpt").attr("data-loading-text", "<span class='icon-refresh icon-spin'></span>");
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Type Report'"
        }).done(function (data) {
            if (data.applets.length) {
                Iptools.uidataTool._getApplet({
                    async: false,
                    applet: data.applets[0].applet
                }).done(function (ds) {
                    if(ds){
                        $("#reportSearch_cpt").data("link", ds.rootLink);
                    }
                });
            }
        });
    },
    /*客户趋势分析图表*/
    _setStepChart: function (options) {
        $("#stepChart").loading();
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
    /*客户趋势分析点击不同时间段*/
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
    /*客户转化分析*/
    _setContactChart: function (options) {
        $("#contactChart").loading();
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
                    var index2 = rs.series[0].categories.indexOf("保有客户");
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
    /*客户转化分析指定时间范围*/
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
    /*客户标签分析*/
    _setTagReports: function (options) {
        $("#" + options.panel).html("");
        $("#" + options.panel).loading();
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
    /*时间选择器*/
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
    /*标签分布不同客户类型的图标*/
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
    /*客户分析属性分析*/
    _setContactPieReport: function (options) {
        $("#" +  options.container).loading();
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
};