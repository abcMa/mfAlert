/**
 * Created by sks on 2017/6/1.
 */
//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :Login
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
        groups: {}
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
        widget._changeIcon();//点击之后上下的图标进行更换
        widget._toggleNowAndEnd();
        widget._enableTaskView();
        widget._enableCampaignView();
        widget._enableContactGroupReportSubmit();
        widget._enableGroupPanelClick();
        widget._enableReportGroupClick();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setLinkGroups().done(function () {
            widget._setLeftInfo();
            widget._setGroupSelect();
        });
        widget._setRightInfo();
        widget._setLoseReport();
        widget._setCampaignList();
        widget._bindingEventAfterLoad();
    },
    _setLinkGroups: function () {
        $(".left .num").loading({
            size: 79
        });
        var eles = $(".left .statistic .report.group");
        eles.loading({
            size: 79
        });
        var promise = $.Deferred();
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'report_to_cg_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[0].applet,
                    pageNow: 1,
                    pageSize: 1
                }).done(function (s) {
                    if (s && s.data && s.data.records && s.data.records.length) {
                        widget._UIDEFAULFS.groups = s.data.records[0];
                    }
                    promise.resolve();
                });
            }
        }).fail(function () {
            promise.resolve();
        });
        return promise;
    },
    _setGroupSelect: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contactgroup'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[0].applet,
                    pageNow: 1,
                    pageSize: 100
                }).done(function (s) {
                    if (s && s.data && s.data.records && s.data.records.length) {
                        $(".group-select").empty();
                        for (var i = 0; i < s.data.records.length; i++) {
                            var odata = s.data.records[i];
                            $(".group-select").append("<option value='" + odata[s.rootLink + ":id"] + "'>" + odata[s.rootLink + ":title"] + "</option>");
                        }
                        $(".group-select").each(function (key, obj) {
                            var ob = widget._UIDEFAULFS.groups[$(obj).attr("name")];
                            if (ob) {
                                $(obj).val(ob["id"]);
                            }
                        });
                    }
                });
            }
        });
    },
    _setGroupCount: function (applet, obj) {
        var group = $(obj).attr("data-group");
        if (Iptools.Tool._checkNull(group)) {
            if (widget._UIDEFAULFS.groups[group]) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: applet,
                    pageNow: 1,
                    pageSize: 1,
                    condition: JSON.stringify({
                        "contactlinkgroup:groupid": "=" + widget._UIDEFAULFS.groups[group]["id"]
                    })
                }).done(function (s) {
                    if (s && s.data && s.data.rowCount) {
                        $(obj).zeroTonum(0, s.data.rowCount, "fast");
                    } else {
                        $(obj).html(0);
                    }
                });
            } else {
                $(obj).html(0);
            }
        }
    },
    _setLeftInfo: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_list','contact_group_linkcontact_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[0].applet,
                    pageNow: 1,
                    pageSize: 1,
                    condition: JSON.stringify({
                        "contact:contacttype": "='3'"
                    })
                }).done(function (s) {
                    if (s && s.data && s.data.rowCount) {
                        $("#c_total").zeroTonum(0, s.data.rowCount, "fast");
                        widget._UIDEFAULFS.contactTotal = s.data.rowCount;
                    } else {
                        $("#c_total").html(0);
                        widget._UIDEFAULFS.contactTotal = 0;
                    }
                }).done(function () {
                    widget._setRateReport(r.applets[1].applet);
                });
                $(".left .num.group").each(function (key, obj) {
                    widget._setGroupCount(r.applets[1].applet, obj);
                });
            } else {
                $(".left .num").html(0);
            }
        }).fail(function () {
            $(".left .num").html(0);
        });
    },
    _setRightInfo: function () {
        $(".right .num.mock").loading({
            size: 30
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'task_list','Contact Trace List'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var now = new Date();
                var lastNow = (new Date(now.setDate(now.getDate() - 7))).format("yyyy-MM-dd hh:mm:ss");
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[0].applet,
                    pageNow: 1,
                    pageSize: 1,
                    condition: JSON.stringify({
                        "task:create_time": " <'" + lastNow + "'",
                        "task:status": "='1'"
                    })
                }).done(function (s) {
                    if (s && s.data && s.data.rowCount) {
                        $("#task_active").zeroTonum(0, s.data.rowCount, "fast");
                    } else {
                        $("#task_active").html(0);
                    }
                });
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[0].applet,
                    pageNow: 1,
                    pageSize: 1,
                    condition: JSON.stringify({
                        "task:create_time": " <'" + lastNow + "'",
                        "task:status": "='2'"
                    })
                }).done(function (s) {
                    if (s && s.data && s.data.rowCount) {
                        $("#task_done").zeroTonum(0, s.data.rowCount, "fast");
                    } else {
                        $("#task_done").html(0);
                    }
                });
                //trace
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[1].applet,
                    pageNow: 1,
                    pageSize: 1,
                    condition: JSON.stringify({
                        "contact_trace:trace_time": " <'" + lastNow + "'",
                        "contact_trace:trace_category": " in ('1','2','3','4')"
                    })
                }).done(function (s) {
                    if (s && s.data && s.data.rowCount) {
                        $("#interact_sys").zeroTonum(0, s.data.rowCount, "fast");
                    } else {
                        $("#interact_sys").html(0);
                    }
                });
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[1].applet,
                    pageNow: 1,
                    pageSize: 1,
                    condition: JSON.stringify({
                        "contact_trace:trace_time": " <'" + lastNow + "'",
                        "contact_trace:trace_category": " in ('5','6')"
                    })
                }).done(function (s) {
                    if (s && s.data && s.data.rowCount) {
                        $("#interact_man").zeroTonum(0, s.data.rowCount, "fast");
                    } else {
                        $("#interact_man").html(0);
                    }
                });
            } else {
                $(".right .num.mock").html(0);
            }
        }).fail(function () {
            $(".right .num.mock").html(0);
        });
    },
    _setRateReport: function (applet) {
        $(".left .statistic .report.group").each(function (key, obj) {
            widget._runRateReport(applet, obj);
        });
    },
    _runRateReport: function (applet, obj) {
        var group = $(obj).attr("data-group");
        if (Iptools.Tool._checkNull(group)) {
            if (widget._UIDEFAULFS.groups[group]) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: applet,
                    pageNow: 1,
                    pageSize: 1,
                    condition: JSON.stringify({
                        "contactlinkgroup:groupid": "=" + widget._UIDEFAULFS.groups[group]["id"]
                    })
                }).done(function (s) {
                    var count = 0;
                    if (s && s.data && s.data.rowCount) {
                        count = s.data.rowCount;
                    } else {
                        $(obj).html(0);
                    }
                    if (widget._UIDEFAULFS.contactTotal) {
                        hcThemes.changeTheme({
                            type: "ipCusLight"
                        });
                        $(obj).highcharts({
                            chart: {
                                type: 'pie',
                                options3d: {
                                    enabled: true,
                                    alpha: 20
                                }
                            },
                            title: {
                                text: ''
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    innerSize: 30,
                                    dataLabels: {
                                        enabled: false
                                    },
                                    showInLegend: true,
                                    depth: 35
                                }
                            },
                            tooltip: {
                                pointFormat: '{series.name}: {point.y}[占比<b>{point.percentage:.1f}%</b>]'
                            },
                            series: [
                                {
                                    name: "人数",
                                    data: [
                                        {
                                            name: $(obj).attr("data-name"),
                                            y: count,
                                            sliced: true,
                                            selected: true
                                        }, ["其他", widget._UIDEFAULFS.contactTotal - count]
                                    ]
                                }
                            ]
                        });
                    } else {
                        var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                            'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                        $(obj).css("position", "relative").html($(emptyHtml).css({
                            "position": "absolute",
                            "top": "50%",
                            "left": "50%",
                            "transform": "translateX(-50%) translateY(-60%)"
                        }));
                    }
                });
            } else {
                var empyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                    'class="emptyImg" style="width:50px;"><span>暂无统计数据</span></div>';
                $(obj).css("position", "relative").html($(empyHtml).css({
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translateX(-50%) translateY(-60%)"
                }));
            }
        } else {
            var empHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                'class="emptyImg" style="width:50px;"><span>暂无统计数据</span></div>';
            $(obj).css("position", "relative").html($(empHtml).css({
                "position": "absolute",
                "top": "50%",
                "left": "50%",
                "transform": "translateX(-50%) translateY(-60%)"
            }));
        }
    },
    _setLoseReport: function () {
        $("#stepChart").loading();
        Iptools.GetJson({
            url: "basic/contactgroups/getMemberReport",
            data: {
                token: Iptools.DEFAULTS.token,
                contactgroupId: 186
            }
        }).done(function (r) {
            if (r && r.series && r.series.length && r.total) {
                hcThemes.changeTheme({
                    type: "ipCusLight"
                });
                $("#stepChart").highcharts({
                    chart: {
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 10
                        }
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: '数量趋势'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },
                    series: [
                        {
                            name: '月份统计',
                            colorByPoint: true,
                            data: r.series
                        }
                    ],
                    drilldown: {
                        series: r.drilldown
                    }
                });
            } else {
                var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                    'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                $("#stepChart").css("position", "relative").html($(emptyHtml).css({
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translateX(-50%) translateY(-60%)"
                }));
            }
        });
    },
    _setCampaignList: function () {
        $("#activity .campaign").loading();
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign_H5 List Applet','Campaign Statistic List','Campaign Response List Applet'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var now = new Date();
                var lastNow = (new Date(now.setDate(now.getDate() - 7))).format("yyyy-MM-dd hh:mm:ss");
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[0].applet,
                    pageNow: 1,
                    pageSize: 50,
                    condition: JSON.stringify({
                        "campaign_h5:create_time": " >'" + lastNow + "'",
                        "campaign_h5:is_cancelled": " is null"
                    })
                }).done(function (s) {
                    if (s && s.data && s.data.records && s.data.records.length) {
                        $("#activity .campaign.now").empty();
                        for (var i = 0; i < s.data.records.length; i++) {
                            var od = s.data.records[i];
                            var title = Iptools.Tool._GetProperValue(od[s.rootLink + ":title"]);
                            var div = document.createElement("div");
                            $(div).addClass("campagn-block").data("key", (od[s.rootLink + ":campaign_id"] ? od[s.rootLink + ":campaign_id"]["id"] : 0));
                            var ul = document.createElement("ul");
                            $(ul).append($("<li></li>").append(
                                    "<span class='campaign-icon fa fa-eye'></span>",
                                    $("<span class='fa fa-spin fa-spinner visit-count'></span>")
                                    .data("key", (od[s.rootLink + ":campaign_id"] ? od[s.rootLink + ":campaign_id"]["id"] : 0))),
                                $("<li></li>").append(
                                    "<span class='campaign-icon fa fa-user'></span>",
                                    $("<span class='fa fa-spin fa-spinner enter-count'></span>")
                                    .data("key", (od[s.rootLink + ":campaign_id"] ? od[s.rootLink + ":campaign_id"]["id"] : 0))));
                            $(div).append("<h4>" + title + "</h4>", ul);
                            $("#activity .campaign.now").append(div);
                        }
                    } else {
                        $("#activity .campaign.now").html("<img src='../Content/Image/nodetail.png' />");
                    }
                }).done(function () {
                    Iptools.uidataTool._getUserlistAppletData({
                        appletId: r.applets[0].applet,
                        pageNow: 1,
                        pageSize: 50,
                        condition: JSON.stringify({
                            "campaign_h5:create_time": " >'" + lastNow + "'",
                            "campaign_h5:is_cancelled": " = 1"
                        })
                    }).done(function (s) {
                        if (s && s.data && s.data.records && s.data.records.length) {
                            $("#activity .campaign.end").empty();
                            for (var i = 0; i < s.data.records.length; i++) {
                                var od = s.data.records[i];
                                var title = Iptools.Tool._GetProperValue(od[s.rootLink + ":title"]);
                                var div = document.createElement("div");
                                $(div).addClass("campagn-block").data("key", (od[s.rootLink + ":campaign_id"] ? od[s.rootLink + ":campaign_id"]["id"] : 0));
                                var ul = document.createElement("ul");
                                $(ul).append($("<li></li>").append(
                                        "<span class='campaign-icon fa fa-eye'></span>",
                                        $("<span class='fa fa-spin fa-spinner visit-count'></span>")
                                        .data("key", (od[s.rootLink + ":campaign_id"] ? od[s.rootLink + ":campaign_id"]["id"] : 0))),
                                    $("<li></li>").append(
                                        "<span class='campaign-icon fa fa-user'></span>",
                                        $("<span class='fa fa-spin fa-spinner enter-count'></span>")
                                        .data("key", (od[s.rootLink + ":campaign_id"] ? od[s.rootLink + ":campaign_id"]["id"] : 0))));
                                $(div).append("<h4>" + title + "</h4>", ul);
                                $("#activity .campaign.end").append(div);
                            }
                        } else {
                            $("#activity .campaign.end").html("<img src='../Content/Image/nodetail.png' />");
                        }
                    }).done(function () {
                        Iptools.uidataTool._getCustomizeApplet({
                            nameList: "'Campaign Statistic List'"
                        }).done(function (ra) {
                            if (ra && ra.applets && ra.applets.length) {
                                $("#activity .campaign .visit-count").each(function (key, obj) {
                                    var id = $(obj).data("key");
                                    if (Iptools.Tool._checkNull(id)) {
                                        widget._getVisitCount(r.applets[1].applet, obj);
                                    }
                                });
                            }
                        });
                        Iptools.uidataTool._getCustomizeApplet({
                            nameList: "'Campaign Response List Applet'"
                        }).done(function (ra) {
                            if (ra && ra.applets && ra.applets.length) {
                                $("#activity .campaign .enter-count").each(function (key, obj) {
                                    var id = $(obj).data("key");
                                    if (Iptools.Tool._checkNull(id)) {
                                        widget._getEnterCount(r.applets[2].applet, obj);
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });
    },
    _getVisitCount: function (applet, obj) {
        Iptools.uidataTool._getUserlistAppletData({
            appletId: applet,
            pageNow: 1,
            pageSize: 1,
            condition: JSON.stringify({
                "campaign_statistic:campaign_id": " = " + $(obj).data("key"),
                "campaign_statistic:campaign_response_type": " = '2'"
            })
        }).done(function (s) {
            var span = document.createElement("span");
            $(span).addClass("num");
            if (s && s.data && s.data.rowCount) {
                $(obj).before($(span).html(s.data.rowCount));
            } else {
                $(obj).before($(span).html(0));
            }
            $(obj).remove();
        });
    },
    _getEnterCount: function (applet, obj) {
        Iptools.uidataTool._getUserlistAppletData({
            appletId: applet,
            pageNow: 1,
            pageSize: 1,
            condition: JSON.stringify({
                "campaign_response:campaign_id": " = " + $(obj).data("key"),
                "campaign_response:campaign_response_type": " = '3'",
            })
        }).done(function (s) {
            var span = document.createElement("span");
            $(span).addClass("num");
            if (s && s.data && s.data.rowCount) {
                $(obj).before($(span).html(s.data.rowCount));
            } else {
                $(obj).before($(span).html(0));
            }
            $(obj).remove();
        });
    },
    //点击之后上下的图标进行更换
    _changeIcon: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".right .title-header",
            event: function () {
                if ($(this).find("span.fa").hasClass("fa-angle-up")) {
                    $(this).find("span.fa").removeClass("fa-angle-up").addClass("fa-angle-down");
                } else {
                    $(this).find("span.fa").removeClass("fa-angle-down").addClass("fa-angle-up");
                }
            },
        });
    },
    //一周活动切换进行和已结束切换
    _toggleNowAndEnd: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".right .activity .content li",
            event: function () {
                $(this).addClass("active").siblings("li").removeClass("active");
                if ($(this).find("span").hasClass("active")) {
                    $(this).parent().parent().find(".now").css("display", "block");
                    $(this).parent().parent().find(".end").css("display", "none");
                } else if ($(this).find("span").hasClass('closed')) {
                    $(this).parent().parent().find(".now").css("display", "none");
                    $(this).parent().parent().find(".end").css("display", "block");
                }
            },
        });
    },
    _enableTaskView: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".right .task .view-all",
            event: function () {
                var me = $(this);
                me.addClass("no-events").button("loading");
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'new-tasks'"
                }).done(function (data) {
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            view: data.views[0].view
                        }).done(function (r) {
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true
                            });
                            me.removeClass("no-events").button("reset");
                        });
                    }
                });
            }
        });
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".right .task .view-my",
            event: function () {
                var me = $(this);
                me.addClass("no-events").button("loading");
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'new-mytask'"
                }).done(function (data) {
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            view: data.views[0].view
                        }).done(function (r) {
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true
                            });
                            me.removeClass("no-events").button("reset");
                        });
                    }
                });
            }
        });
    },
    _enableCampaignView: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".right .activity .campagn-block",
            event: function () {
                var me = $(this);
                var key = me.data("key");
                if (Iptools.Tool._checkNull(key)) {
                    Iptools.uidataTool._getCustomizeView({
                        nameList: "'campaign_detail'"
                    }).done(function (data) {
                        if (data.views.length) {
                            Iptools.uidataTool._getView({
                                view: data.views[0].view
                            }).done(function (r) {
                                Iptools.Tool._jumpView({
                                    view: data.views[0].view,
                                    valueId: key,
                                    name: r.view.name,
                                    type: r.view.type,
                                    url: r.view.url,
                                    bread: true
                                });
                            });
                        }
                    });
                }
            }
        });
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".right .activity .view-all",
            event: function () {
                var me = $(this);
                me.addClass("no-events").button("loading");
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'campaign_list'"
                }).done(function (data) {
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            view: data.views[0].view
                        }).done(function (r) {
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true
                            });
                            me.removeClass("no-events").button("reset");
                        });
                    }
                });
            }
        });
    },
    _enableContactGroupReportSubmit: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#reportGroupSubmit",
            event: function () {
                var me = $(this);
                me.addClass("no-events").button("loading");
                var data = {};
                $("#reportGroupModal .rg-conditions select").each(function (key, obj) {
                    data[$(obj).attr("name")] = $(obj).val();
                });
                Iptools.uidataTool._getCustomizeApplet({
                    nameList: "'report_to_cg_detail'"
                }).done(function (r) {
                    if (r && r.applets && r.applets.length) {
                        Iptools.uidataTool._saveAppletData({
                            appletId: r.applets[0].applet,
                            valueId: widget._UIDEFAULFS.groups["report_to_cg:id"],
                            data: JSON.stringify(data)
                        }).done(function () {
                            widget._setLinkGroups().done(function () {
                                widget._setLeftInfo();
                                widget._setGroupSelect();
                            }).done(function () {
                                $("#reportGroupModal").modal("hide");
                                me.removeClass("no-events").button("reset");
                            });
                        });
                    }
                });
            }
        });
    },
    _enableGroupPanelClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#contact_all_list",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'contact_list'"
                }).done(function (data) {
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            view: data.views[0].view
                        }).done(function (r) {
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true,
                                condition: {
                                    "contact:contacttype": "='3'"
                                }
                            });
                        });
                    }
                });
            }
        });
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".left .contact-group",
            event: function () {
                var me = $(this);
                me.css('cursor', "wait");
                var group = me.find(".num.group:first").attr("data-group");
                if (widget._UIDEFAULFS.groups[group]) {
                    Iptools.uidataTool._getCustomizeView({
                        nameList: "'contactGroupPortrait'"
                    }).done(function (data) {
                        if (data.views.length) {
                            Iptools.uidataTool._getView({
                                view: data.views[0].view
                            }).done(function (r) {
                                Iptools.Tool._jumpView({
                                    view: data.views[0].view,
                                    valueId: widget._UIDEFAULFS.groups[group]["id"],
                                    name: r.view.name,
                                    type: r.view.type,
                                    url: r.view.url,
                                    bread: true
                                });
                            });
                            me.css('cursor', "pointer");
                        }
                    });
                } else {
                    me.css('cursor', "pointer");
                }
            }
        });
    },
    _enableReportGroupClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".left .cg-in-btn",
            event: function () {
                var me = $(this);
                var group = me.attr("data-group");
                if (Iptools.Tool._checkNull(group)) {
                    if (widget._UIDEFAULFS.groups[group]) {
                        me.removeClass("fa-sign-in").addClass("fa-spin fa-spinner no-events");
                        Iptools.uidataTool._getCustomizeView({
                            nameList: "'contactGroupPortrait'"
                        }).done(function (data) {
                            if (data.views.length) {
                                Iptools.uidataTool._getView({
                                    view: data.views[0].view
                                }).done(function (r) {
                                    Iptools.Tool._jumpView({
                                        view: data.views[0].view,
                                        valueId: widget._UIDEFAULFS.groups[group]["id"],
                                        name: r.view.name,
                                        type: r.view.type,
                                        url: r.view.url,
                                        bread: true
                                    });
                                    me.addClass("fa-sign-in").removeClass("fa-spin fa-spinner no-events");
                                });
                            }
                        });
                    }
                }
            }
        });
    },
};