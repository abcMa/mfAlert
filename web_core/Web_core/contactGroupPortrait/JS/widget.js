//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :contactGroupPortrait
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
        memberList: "#g_member_list",
        campaignList: "#g_campaign_list",
        data: {},
        cons: {
            ori: {
                anCons: {},
                atCons: {},
            },
            create: {
                anCons: {},
                atCons: {},
            },
            update: {
                anCons: {},
                atCons: {},
            },
            del: {
                anCons: [],
                atCons: [],
            }
        },
        operator: {
            "equal": "等于",
            "bigger": "大于",
            "smaller": "小于",
            "ebigger": "大于等于",
            "esmaller": "小于等于",
            "like": "LIKE",
            "between": "区间",
            "rbigger": "相对大于",
            "rsmaller": "相对小于",
            "rbetween": "相对区间",
            "isnull": "为空",
            "isnotnull": "不为空",
            "n_week": "本周",
            "n_month": "本月",
            "n_year": "本年"
        },
        reports: []
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
        widget.enableConTypeClick();
        widget.enableConAdd();
        widget.enableConRemove();
        widget.enableConTrigger();
        widget.enableTab();
        widget.enableTagMove();
        widget.enableConsSave();
        widget.enableInfoShow();
        widget.enableTaskSubmit();
        widget.enableMemberManage();
        widget.enableAnalysisTabShow();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setGroupInfo();
        widget._setMemberList();
        widget._setCampaignList();
        widget._setConColumns();
        widget._setCreateTaskInfo();
        widget._setFormValidation();
    },
    _runMemberReport: function () {
        var promise = $.Deferred();
        Iptools.GetJson({
            url: "service/appletListIds",
            data: {
                token: Iptools.DEFAULTS.token,
                viewId: Iptools.DEFAULTS.currentView,
                valueId: Iptools.DEFAULTS.currentViewValue,
                appletId: widget._UIDEFAULFS.linkContactApplet,
                column: "contactlinkgroup:contactid"
            }
        }).done(function (d) {
            if (d && d.ids && d.ids.length) {
                Iptools.GetJson({
                    url: "basic/contactgroups/getMemberReport",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        contactgroupId: Iptools.DEFAULTS.currentViewValue,
                        ids: d.ids.join()
                    }
                }).done(function (r) {
                    if (r && r.series && r.series.length && r.total) {
                        hcThemes.changeTheme({
                            type: "ipCusLight"
                        });
                        $("#g-report-member-trend").highcharts({
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
                        $("#g-report-member-trend").css("position", "relative").html($(emptyHtml).css({
                            "position": "absolute",
                            "top": "50%",
                            "left": "50%",
                            "transform": "translateX(-50%) translateY(-60%)"
                        }));
                    }
                    promise.resolve();
                });
            } else {
                var emHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                    'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                $("#g-report-member-trend").css("position", "relative").html($(emHtml).css({
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translateX(-50%) translateY(-60%)"
                }));
                promise.resolve();
            }
        });
        return promise;
    },
    _runTagReport: function () {
        var promise = $.Deferred();
        Iptools.GetJson({
            url: "service/appletListIds",
            data: {
                token: Iptools.DEFAULTS.token,
                viewId: Iptools.DEFAULTS.currentView,
                valueId: Iptools.DEFAULTS.currentViewValue,
                appletId: widget._UIDEFAULFS.linkContactApplet,
                column: "contactlinkgroup:contactid"
            }
        }).done(function (d) {
            if (d && d.ids && d.ids.length) {
                Iptools.GetJson({
                    url: "service/contactGroupTagReport",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        contactGroupId: Iptools.DEFAULTS.currentViewValue,
                        ids: d.ids
                    }
                }).done(function (r) {
                    if (r && r.categories && r.categories.length && r.series && r.series.length) {
                        hcThemes.changeTheme({
                            type: "ipCusLight"
                        });
                        $("#g-report-tags").highcharts({
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
                                categories: r.categories,
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: '数量 (人)'
                                }
                            },
                            tooltip: {
                                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                pointFormat: '<tr><td style="color:{series.color};padding:0">人数: </td>' +
                                    '<td style="padding:0"><b>{point.y:.1f} 人</b></td></tr>',
                                footerFormat: '</table>',
                                shared: true,
                                useHTML: true
                            },
                            legend: {
                                enabled: false,
                            },
                            plotOptions: {
                                column: {
                                    pointPadding: 0.2,
                                    borderWidth: 0
                                },
                                series: {
                                    colorByPoint: true
                                }
                            },
                            series: r.series
                        });
                        widget._UIDEFAULFS.reports.push($("#g-report-tags"));
                    } else {
                        var emptyHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                            'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                        $("#g-report-tags").css("position", "relative").html($(emptyHtml).css({
                            "position": "absolute",
                            "top": "50%",
                            "left": "50%",
                            "transform": "translateX(-50%) translateY(-60%)"
                        }));
                    }
                    promise.resolve();
                });
            } else {
                var empHtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                    'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                $("#g-report-tags").css("position", "relative").html($(empHtml).css({
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translateX(-50%) translateY(-60%)"
                }));
                promise.resolve();
            }
        });
        return promise;
    },
    _runSubReport: function (index, total, elements) {
        var promise = $.Deferred();
        if (index >= total) {
            promise.resolve();
        } else {
            var obj = elements.eq(index);
            var str = $(obj).attr("data-str");
            if (Iptools.Tool._checkNull(str)) {
                Iptools.uidataTool._getCustomizeApplet({
                    nameList: "'" + str + "'"
                }).done(function (r) {
                    if (r && r.applets && r.applets.length) {
                        var applet = r.applets[0].applet;
                        Iptools.uidataTool._buildReport({
                            container: $(obj).attr("id"),
                            applet: applet,
                            viewId: Iptools.DEFAULTS.currentView,
                            valueId: Iptools.DEFAULTS.currentViewValue,
                            date: (new Date().format("yyyy-MM-dd")),
                            timeType: "year",
                            showReport: true
                        }).done(function () {
                            widget._runSubReport(index + 1, total, elements).done(function () {
                                promise.resolve();
                            });
                        });
                        widget._UIDEFAULFS.reports.push($(obj));
                    }
                });
            }
        }
        return promise;
    },
    _runFeeReport: function () {
        var promise = $.Deferred();
        //高消费客户占比
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'high_fee_cg_analysis_report'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var applet = r.applets[0].applet;
                Iptools.GetJson({
                    url: "basic/contactgroups/getContactIdsByGroup",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        contactgroupId: Iptools.DEFAULTS.currentViewValue
                    }
                }).done(function (rs) {
                    if (rs && rs.retcode == "ok") {
                        var condition = {};
                        if (rs.contacts && rs.contacts.length) {
                            condition["contact_car_service_record:contact_id"] = " in (" + rs.contacts.join() + ")";
                            Iptools.uidataTool._buildReport({
                                container: "g-high-fee-report",
                                applet: applet,
                                viewId: Iptools.DEFAULTS.currentView,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                condition: JSON.stringify(condition),
                                showReport: false
                            }).done(function (ro) {
                                if (ro && ro.series && ro.series.length) {
                                    if (ro.series[0].data && ro.series[0].data.length) {
                                        var count = parseInt(ro.series[0].data[0]);
                                        if (count != -1 && $(widget._UIDEFAULFS.memberList).data("stable").options.data) {
                                            var subCount = $(widget._UIDEFAULFS.memberList).data("stable").options.data.rowCount - count;
                                            ro.series[0].data.push(subCount.toString());
                                            ro.series[0].categories.push("其它");
                                            var ds = {
                                                name: ro.series[0].name,
                                                data: []
                                            };
                                            var flag = true;
                                            for (var i = 0; i < ro.series[0].categories.length; i++) {
                                                var dsi = {
                                                    name: ro.series[0].categories[i],
                                                    y: parseInt(ro.series[0].data[i]),
                                                };
                                                if (flag) {
                                                    dsi["sliced"] = true;
                                                    dsi["selected"] = true;
                                                    flag = false;
                                                }
                                                ds.data.push(dsi);
                                            }
                                            var dsl = [];
                                            dsl.push(ds);
                                            $('#g-high-fee-report').highcharts({
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
                                                legend: {
                                                    layout: "vertical",
                                                    align: "right",
                                                    verticalAlign: "middle"
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
                                                series: dsl
                                            });
                                        } else {
                                            var ehtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                                                'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                                            $("#g-high-fee-report").css("position", "relative").html($(ehtml).css({
                                                "position": "absolute",
                                                "top": "50%",
                                                "left": "50%",
                                                "transform": "translateX(-50%) translateY(-60%)"
                                            }));
                                        }
                                        promise.resolve();
                                    }
                                } else {
                                    var emhtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                                        'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                                    $("#g-high-fee-report").css("position", "relative").html($(emhtml).css({
                                        "position": "absolute",
                                        "top": "50%",
                                        "left": "50%",
                                        "transform": "translateX(-50%) translateY(-60%)"
                                    }));
                                    promise.resolve();
                                }
                            });
                            widget._UIDEFAULFS.reports.push($("#g-high-fee-report"));
                        } else {
                            var ethtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                                'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                            $("#g-high-fee-report").css("position", "relative").html($(ethtml).css({
                                "position": "absolute",
                                "top": "50%",
                                "left": "50%",
                                "transform": "translateX(-50%) translateY(-60%)"
                            }));
                            promise.resolve();
                        }
                    }
                });
            }
        });
        return promise;
    },
    _runRateReport: function (index, total, elements) {
        var promise = $.Deferred();
        if (index >= total) {
            promise.resolve();
        }
        var obj = elements.eq(index);
        var str = $(obj).attr("data-str");
        if (Iptools.Tool._checkNull(str)) {
            Iptools.uidataTool._getCustomizeApplet({
                nameList: "'" + str + "'"
            }).done(function (r) {
                if (r && r.applets && r.applets.length) {
                    var applet = r.applets[0].applet;
                    Iptools.uidataTool._buildReport({
                        container: $(obj).attr("id"),
                        applet: applet,
                        viewId: Iptools.DEFAULTS.currentView,
                        valueId: Iptools.DEFAULTS.currentViewValue,
                        showReport: false
                    }).done(function (ro) {
                        if (ro && ro.series && ro.series.length) {
                            if (ro.series[0].data && ro.series[0].data.length) {
                                var count = parseInt(ro.series[0].data[0]);
                                if (count != -1 && $(widget._UIDEFAULFS.memberList).data("stable").options.data) {
                                    var subCount = $(widget._UIDEFAULFS.memberList).data("stable").options.data.rowCount - count;
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
                                        legend: {
                                            layout: "vertical",
                                            align: "right",
                                            verticalAlign: "middle"
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
                                                name: ro.series[0].name,
                                                data: [
                                                    {
                                                        name: ro.series[0].categories[0],
                                                        y: count,
                                                        sliced: true,
                                                        selected: true
                                                    }, ["其他", subCount]
                                                ]
                                            }
                                        ]
                                    });
                                } else {
                                    var ethtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                                        'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                                    $(obj).css("position", "relative").html($(ethtml).css({
                                        "position": "absolute",
                                        "top": "50%",
                                        "left": "50%",
                                        "transform": "translateX(-50%) translateY(-60%)"
                                    }));
                                }
                            }
                        } else {
                            var ehtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                                'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                            $(obj).css("position", "relative").html($(ehtml).css({
                                "position": "absolute",
                                "top": "50%",
                                "left": "50%",
                                "transform": "translateX(-50%) translateY(-60%)"
                            }));
                        }
                        widget._runRateReport(index + 1, total, elements).done(function () {
                            promise.resolve();
                        });
                    });
                    widget._UIDEFAULFS.reports.push($(obj));
                }
            });
        }
        return promise;
    },
    _runMoneyReport: function () {
        var promise = $.Deferred();
        //消费额
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'cg_fee_cg_analysis_report'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var applet = r.applets[0].applet;
                Iptools.GetJson({
                    url: "basic/contactgroups/getContactIdsByGroup",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        contactgroupId: Iptools.DEFAULTS.currentViewValue
                    }
                }).done(function (rs) {
                    if (rs && rs.retcode == "ok") {
                        var condition = {};
                        if (rs.contacts && rs.contacts.length) {
                            condition["contact_car_service_record:contact_id"] = " in (" + rs.contacts.join() + ")";
                            Iptools.uidataTool._buildReport({
                                container: "g-pay-fee-report",
                                applet: applet,
                                viewId: Iptools.DEFAULTS.currentView,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                showReport: true,
                                condition: JSON.stringify(condition)
                            });
                            widget._UIDEFAULFS.reports.push($("#g-pay-fee-report"));
                        } else {
                            var ethtml = '<div class="noDataArea emptyReport"><img src="../Content/Image/emptyReport.png" ' +
                                'class="emptyImg" style="width:100px;"><span>暂无统计数据</span></div>';
                            $("#g-pay-fee-report").css("position", "relative").html($(ethtml).css({
                                "position": "absolute",
                                "top": "50%",
                                "left": "50%",
                                "transform": "translateX(-50%) translateY(-60%)"
                            }));
                        }
                        promise.resolve();
                    }
                });
            }
        });
        return promise;
    },
    _setAnalysis: function () {
        $("#g-report-member-trend").loading();
        $("#g-report-tags").loading();
        $("#g-high-fee-report").loading();
        $("#g-pay-fee-report").loading();
        $("#g-analysis .g_analysis_sub_report .report.rate").each(function (key, obj) {
            $(obj).loading();
        });
        $("#g-analysis .g_analysis_sub_report .report.sub").each(function (key, obj) {
            $(obj).loading();
        });
        widget._runMemberReport().done(function () {
            widget._runTagReport().done(function () {
                var elements = $("#g-analysis .g_analysis_sub_report .report.sub");
                widget._runSubReport(0, elements.length, elements).done(function () {
                    var eles = $("#g-analysis .g_analysis_sub_report .report.rate");
                    widget._runRateReport(0, eles.length, eles);
                });
            });
        });
    },
    _setGroupInfo: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contactgroup Detail Applet'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var applet = r.applets[0].applet;
                Iptools.uidataTool._getUserDetailAppletData({
                    appletId: applet,
                    valueId: Iptools.DEFAULTS.currentViewValue
                }).done(function (rs) {
                    if (rs && rs.data) {
                        $("#cg-title").text(rs.data[rs.rootLink + ":title"]);
                        $("#cg-title-edit").val(rs.data[rs.rootLink + ":title"]);
                        $("#cg-des").text(rs.data[rs.rootLink + ":description"]);
                        $("#cg-des-edit").val(rs.data[rs.rootLink + ":description"]);
                        for (var i = 0; i < rs.controls.length; i++) {
                            if (rs.controls[i].column.indexOf("group_reason") != -1) {
                                if (rs.controls[i].pickList && rs.controls[i].pickList.length) {
                                    $("#cg-type").empty();
                                    for (var n = 0; n < rs.controls[i].pickList.length; n++) {
                                        var pl = rs.controls[i].pickList[n];
                                        if (rs.data[rs.rootLink + ":group_reason"] && pl.id == rs.data[rs.rootLink + ":group_reason"].id) {
                                            $("#cg-type").append("<option value='" + pl.id + "' selected='selected'>" + pl.name + "</option>");
                                            $("#cg-reason").html(pl.name);
                                        } else {
                                            $("#cg-type").append("<option value='" + pl.id + "'>" + pl.name + "</option>");
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                });
            }
        });
    },
    _setTasks: function () {
        $("#cg_task_list").empty();
        $("#cg_task_list").loading();
        Iptools.GetJson({
            url: "service/appletListIds",
            data: {
                token: Iptools.DEFAULTS.token,
                viewId: Iptools.DEFAULTS.currentView,
                valueId: Iptools.DEFAULTS.currentViewValue,
                appletId: widget._UIDEFAULFS.linkContactApplet,
                column: "contactlinkgroup:contactid"
            }
        }).done(function (d) {
            Iptools.uidataTool._getCustomizeApplet({
                nameList: "'cg_task_list'"
            }).done(function (r) {
                $("#cg_task_list").empty();
                if (r && r.applets && r.applets.length) {
                    var condition = {
                        "task:contact_id": "=-1"
                    };
                    if (d && d.ids && d.ids.length) {
                        condition["task:contact_id"] = " in (" + d.ids.join() + ")";
                    }
                    var applet = r.applets[0].applet;
                    component._table("#cg_task_list", {
                        pageNow: 1,
                        pageSize: 10,
                        applet: applet,
                        condition: condition,
                        showChecks: false
                    });
                }
            });
        });
    },
    _setCreateTaskInfo: function () {
        $("#task-form .datepicker").datetimepicker({
            format: "yyyy-mm-dd hh:00",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: 1
        }).on('hide', function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
            var me = $(this);
            $("#task-form").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
        $("#assignType").on("change", function () {
            if ($(this).val() == "4") {
                $("#t-form-assign").show();
            } else {
                $("#t-form-assign").hide();
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'task_list','employee_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                for (var a = 0; a < r.applets.length; a++) {
                    if (r.applets[a].name == "task_list") {
                        Iptools.uidataTool._getApplet({
                            applet: r.applets[a].applet
                        }).done(function (s) {
                            if (s && s.columns && s.columns.length) {
                                for (var m = 0; m < s.columns.length; m++) {
                                    var col = s.columns[m];
                                    if (col.column == s.rootLink + ":type") {
                                        if (col.pickList && col.pickList.length) {
                                            for (var p = 0; p < col.pickList.length; p++) {
                                                var pl = col.pickList[p];
                                                $("#taskType").append("<option value='" + pl.id + "'>" + pl.name + "</option>");
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        });
                    } else if (r.applets[a].name == "employee_list") {
                        Iptools.uidataTool._getUserlistAppletData({
                            appletId: r.applets[a].applet,
                            pageNow: 1,
                            pageSize: 100
                        }).done(function (rs) {
                            if (rs && rs.data && rs.data.records && rs.data.records.length) {
                                for (var i = 0; i < rs.data.records.length; i++) {
                                    var obj = rs.data.records[i];
                                    $("#taskAssign").append("<option value='" + obj[rs.rootLink + ":id"] + "'>" + obj[rs.rootLink + ":name"] + "</option>");
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    _setMemberList: function () {
        $("#widget._UIDEFAULFS.memberList").loading();
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_group_linkcontact_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var applet = r.applets[0].applet;
                widget._UIDEFAULFS.linkContactApplet = applet;
                $("#widget._UIDEFAULFS.memberList").empty();
                component._table(widget._UIDEFAULFS.memberList, {
                    pageNow: 1,
                    pageSize: 10,
                    view: Iptools.DEFAULTS.currentView,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                    applet: applet,
                    jumpType: "template",
                    jumpTemplate: "<a class='d-v-link'><span class='icon-magic'></span></a>",
                    events: [
                    {
                        target: ".s-header-bar .s-manage .add-member",
                        type: "click",
                        event: function () {
                            Iptools.uidataTool._getCustomizeApplet({
                                nameList: "'cg_contact_search_list'"
                            }).done(function (s) {
                                if (s && s.applets && s.applets.length) {
                                    var sap = s.applets[0].applet;
                                    component._table("#addMemberList", {
                                        pageNow: 1,
                                        pageSize: 10,
                                        applet: sap,
                                        showManage: false
                                    });
                                    $("#selectMemberModal").modal("show");
                                }
                            });
                        }
                    }, {
                        target: ".s-header-bar .s-manage .remove-member",
                        type: "click",
                        event: function () {
                            var me = $(this);
                            me.addClass("no-events").button("loading");
                            var index = $(widget._UIDEFAULFS.memberList).data("stable")._getCheckIndex();
                            var data = $(widget._UIDEFAULFS.memberList).data("stable").options.data;
                            var ids = [];
                            for (var i = 0; i < index.length; i++) {
                                var oda = data.records[index[i]];
                                if (Iptools.Tool._checkNull(oda["contactlinkgroup:contactid"])) {
                                    ids.push(oda["contactlinkgroup:contactid"]["id"]);
                                }
                            }
                            if (data && data.records && data.records.length && index && index.length) {
                                Iptools.PostJson({
                                    url: "basic/delContactFromGroup",
                                    data: {
                                        token: Iptools.DEFAULTS.token,
                                        contactgroupId: Iptools.DEFAULTS.currentViewValue,
                                        contactIds: ids.join()
                                    }
                                }).done(function () {
                                    me.removeClass("no-events").button("reset");
                                    widget._setMemberList();
                                });
                            }
                        }
                    }, {
                        target: ".s-header-bar .s-manage .add-group-task",
                        type: "click",
                        event: function () {
                            widget._UIDEFAULFS.taskMode = "table";
                            $("#taskModal").modal("show");
                        }
                    }, {
                        target: ".s-header-bar .s-manage .add-all-task",
                        type: "click",
                        event: function () {
                            $("#taskModal").modal("show");
                        }
                    }],
                    dataModify: null,
                    afterLoad: function () {
                        if ($(widget._UIDEFAULFS.memberList).data("stable").options.data) {
                            $("#cg-count").text($(widget._UIDEFAULFS.memberList).data("stable").options.data.rowCount);
                            $("#g-members-count").text($(widget._UIDEFAULFS.memberList).data("stable").options.data.rowCount);
                        } else {
                            $("#cg-count").text(0);
                            $("#g-members-count").text(0);
                        }
                        widget._setAnalysis();
                        widget._setTasks();
                    }
                });
            }
        });
    },
    _setCampaignList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contactgroup_link_campaign'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var applet = r.applets[0].applet;
                component._table(widget._UIDEFAULFS.campaignList, {
                    pageNow: 1,
                    pageSize: 10,
                    view: Iptools.DEFAULTS.currentView,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                    applet: applet,
                    jumpType: "template",
                    jumpTemplate: "<a class='d-v-link' title='查看活动详情'><span class='icon-signin'></span></a>",
                    events: [],
                    dataModify: function (rs) {
                        var promise = $.Deferred();
                        if (rs) {
                            if (rs.columns && rs.columns.length) {
                                rs.columns.push({
                                    type: "text",
                                    column: rs.rootLink + ":participate",
                                    name: "本群参与人数",
                                });
                                rs.columns.push({
                                    type: "text",
                                    column: rs.rootLink + ":participateRate",
                                    name: "参与率",
                                });
                                rs.columns.push({
                                    type: "text",
                                    column: rs.rootLink + ":participateTotal",
                                    name: "总参与人数",
                                });
                                rs.columns.push({
                                    type: "text",
                                    column: rs.rootLink + ":participateGrand",
                                    name: "贡献率",
                                });
                                if (rs.data && rs.data.records && rs.data.records.length) {
                                    for (var i = 0; i < rs.data.records.length; i++) {
                                        var rec = rs.data.records[i];
                                        rec[rs.rootLink + ":participate"] = "<span class='icon-spin icon-spinner participate' " +
                                            "data-id='" + rec[rs.rootLink + ":id"] + "'></span>";
                                        rec[rs.rootLink + ":participateRate"] = "<span class='icon-spin icon-spinner participateRate'></span>";
                                        rec[rs.rootLink + ":participateTotal"] = "<span class='icon-spin icon-spinner participateTotal'></span>";
                                        rec[rs.rootLink + ":participateGrand"] = "<span class='icon-spin icon-spinner participateGrand'></span>";
                                    }
                                }
                            }
                        }
                        promise.resolve(rs);
                        return promise;
                    },
                    afterLoad: function () {
                        Iptools.uidataTool._getCustomizeApplet({
                            nameList: "'Campaign Response List Applet'"
                        }).done(function (o) {
                            if (o && o.applets && o.applets.length) {
                                var cap = o.applets[0].applet;
                                var counts = $(widget._UIDEFAULFS.campaignList + " .s-table .s-column span.participate");
                                counts.each(function (key, obj) {
                                    var index = $(obj).parent().attr("data-index");
                                    var sc = $(obj).parents(".s-column:first");
                                    var id = $(obj).attr("data-id");
                                    widget._setCampaignCount(obj, cap, id, sc, index);
                                });
                            }
                        });
                        if ($(widget._UIDEFAULFS.campaignList).data("stable").options.data) {
                            $("#g-campaigns-counts").text($(widget._UIDEFAULFS.campaignList).data("stable").options.data.rowCount);
                        } else {
                            $("#g-campaigns-counts").text(0);
                        }
                    }
                });
            }
        });
    },
    _setCampaignCount: function (obj, cap, id, sc, index) {
        Iptools.uidataTool._getUserlistAppletData({
            appletId: cap,
            condition: JSON.stringify({
                "campaign_response:campaign_id": "=" + id
            })
        }).done(function (s) {
            var pRate = sc.siblings(".s-column:eq(2)").find(".s-cell:not(.header):eq(" + index + ")").find("span.participateRate");
            var pTotal = sc.siblings(".s-column:eq(3)").find(".s-cell:not(.header):eq(" + index + ")").find("span.participateTotal");
            var pGrand = sc.siblings(".s-column:eq(4)").find(".s-cell:not(.header):eq(" + index + ")").find("span.participateGrand");
            if (s && s.data && s.data.records && s.data.records.length) {
                var count = s.data.rowCount ? s.data.rowCount : 0;
                if (pTotal && pTotal.length) {
                    $(pTotal).before(count);
                    $(pTotal).remove();
                }
                var gStr = "";
                for (var i = 0; i < s.data.records.length; i++) {
                    var drec = s.data.records[i];
                    if (Iptools.Tool._checkNull(drec[s.rootLink + ":contact_id"])) {
                        gStr += drec[s.rootLink + ":contact_id"] + "-";
                    }
                }
                Iptools.uidataTool._getCustomizeApplet({
                    nameList: "'contact_group_linkcontact_list'"
                }).done(function (r) {
                    if (r && r.applets && r.applets.length) {
                        var applet = r.applets[0].applet;
                        Iptools.uidataTool._getUserlistAppletData({
                            appletId: applet,
                            pageNow: 1,
                            pageSize: 100,
                            view: Iptools.DEFAULTS.currentView,
                            valueId: Iptools.DEFAULTS.currentViewValue
                        }).done(function (rs) {
                            var pcount = 0;
                            var gcTotal = 0;
                            if (rs && rs.data && rs.data.records && rs.data.records.length) {
                                for (var x = 0; x < rs.data.records.length; x++) {
                                    var con = rs.data.records[x];
                                    if (Iptools.Tool._checkNull(con[rs.rootLink + ":contactid"])) {
                                        if (con[rs.rootLink + ":contactid"] && gStr.indexOf(con[rs.rootLink + ":contactid"]["id"].toString()) != -1) {
                                            pcount++;
                                        }
                                    }
                                }
                                gcTotal = rs.data.rowCount;
                            }
                            $(obj).before(pcount);
                            $(obj).remove();
                            if (gcTotal != 0) {
                                $(pRate).before(Math.round(pcount / count, 2) + "%");
                            } else {
                                $(pRate).before("0%");
                            }
                            $(pRate).remove();
                            $(pGrand).before(Math.round(pcount / count, 2) + "%");
                            $(pGrand).remove();
                        });
                    }
                });
            } else {
                if (pTotal && pTotal.length) {
                    $(pTotal).before(0);
                    $(pTotal).remove();
                    $(pRate).before("-");
                    $(pRate).remove();
                    $(pGrand).before("-");
                    $(pGrand).remove();
                    $(obj).before(0);
                    $(obj).remove();
                }
            }
        });
    },
    _setConColumns: function () {
        $(".g-con-add a").addClass("no-events").append("<span class='icon-spin icon-spinner loading'></span>").css("opacity", "0.6");
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_rule_applet','contact_group_rule_detail'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                widget._UIDEFAULFS.ruleSaveApplet = r.applets[1].applet;
                var applet = r.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: applet
                }).done(function (rs) {
                    if (rs) {
                        widget._UIDEFAULFS.data = rs;
                        $(".g-con-add a").removeClass("no-events").css("opacity", "1").find(".loading").remove();
                    }
                }).done(function () {
                    widget._setTags();
                });
            }
        });
    },
    _setTags: function () {
        $("#g-tag .tag-source").loading();
        Iptools.GetJson({
            url: "basic/tags",
            data: {
                token: Iptools.DEFAULTS.token
            }
        }).done(function (r) {
            if (r && r.length) {
                $(".tag-source").empty().append("<p>可选标签</p>");
                for (var i = 0; i < r.length; i++) {
                    var sp = document.createElement("span");
                    $(sp).addClass("tag-item").append($("<span class='text'>" + r[i].tagValue + "</span>"))
                        .data("key", r[i].id).data("val", r[i].tagValue).attr("data-key", r[i].id);
                    $(".tag-source").append(sp);
                }
            }
        }).done(function () {
            widget._setCons();
        });
    },
    _setFormValidation: function () {
        $("#g-info-form").bootstrapValidator({
            fields: {
                "g-title": {
                    validators: {
                        notEmpty: {
                            message: '请填写群名称'
                        }
                    }
                },
                "g-reason": {
                    validators: {
                        notEmpty: {
                            message: '请选择分组依据'
                        }
                    }
                },
                "g-des": {
                    validators: {
                        notEmpty: {
                            message: '请填写群描述'
                        }
                    }
                }
            }
        });
        $("#task-form").bootstrapValidator({
            fields: {
                taskName: {
                    validators: {
                        notEmpty: {
                            message: '请填写任务名称'
                        }
                    }
                },
                endTime: {
                    validators: {
                        notEmpty: {
                            message: '请填写任务截止时间'
                        }
                    }
                },
                taskDes: {
                    validators: {
                        notEmpty: {
                            message: '请填写任务描述'
                        }
                    }
                },
                taskType: {
                    validators: {
                        notEmpty: {
                            message: '请选择任务类型'
                        }
                    }
                },
                taskAssign: {
                    validators: {
                        notEmpty: {
                            message: '请选择任务默认负责人'
                        }
                    }
                },
            }
        });
    },
    _setCons: function () {
        widget._UIDEFAULFS.cons = {
            ori: {
                anCons: {},
                atCons: {},
            },
            create: {
                anCons: {},
                atCons: {},
            },
            update: {
                anCons: {},
                atCons: {},
            },
            del: {
                anCons: [],
                atCons: [],
            }
        }
        $("#ga_con_list").empty();
        $("#ga-tag-container .tag-sel .tag-item").remove();
        $("#ga-tag-container .tag-source .tag-item").show();
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contactgroup_rule_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var applet = r.applets[0].applet;
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: applet,
                    pageNow: 1,
                    pageSize: 100,
                    view: Iptools.DEFAULTS.currentView,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                }).done(function (rs) {
                    if (rs && rs.data && rs.data.records && rs.data.records.length) {
                        for (var i = 0; i < rs.data.records.length; i++) {
                            var rul = rs.data.records[i];
                            if (rul[rs.rootLink + ":type"] && rul[rs.rootLink + ":type"]["id"] == "1") {
                                //LogicType
                                var rlt = rul[rs.rootLink + ":logic_type"];
                                if (rlt == "and") {
                                    if (rul[rs.rootLink + ":rule_action"] && rul[rs.rootLink + ":rule_action"]["id"] == "1") {
                                        $("#g-rule-container .con-type.ga input:eq(0)").prop("checked", true);
                                    }
                                } else if (rlt == "or") {
                                    if (rul[rs.rootLink + ":rule_action"] && rul[rs.rootLink + ":rule_action"]["id"] == "1") {
                                        $("#g-rule-container .con-type.ga input:eq(1)").prop("checked", true);
                                    }
                                }
                                //sets
                                var li = document.createElement("li");
                                var d = document.createElement("div");
                                $(d).addClass("g-con-group exist");
                                //p-col
                                var dc = document.createElement("div");
                                $(dc).addClass("dropdown p-col-container");
                                var ulc = document.createElement("ul");
                                $(ulc).addClass("dropdown-menu");
                                var data = widget._UIDEFAULFS.data;
                                var selCol;
                                if (data && data.columns && data.columns.length) {
                                    for (var c = 0; c < data.columns.length; c++) {
                                        var col = data.columns[c];
                                        if (col["field"] == rul[rs.rootLink + ":field"]) {
                                            selCol = col;
                                        }
                                        $(ulc).append($("<li></li>").append($("<a class='con-col'>" + col["name"] + "</a>").data("data", col)));
                                    }
                                }
                                $(dc).append($("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                                    "aria-expanded='false'>" + (selCol ? selCol["name"] : "属性") + " <span class='caret'></span></button>")
                                    .data('data', selCol), ulc);
                                //p-type
                                var dpt = document.createElement("div");
                                $(dpt).addClass("dropdown p-type-container");
                                var ult = document.createElement("ul");
                                $(ult).addClass("dropdown-menu");
                                if (selCol && selCol["type"] == "select") {
                                    $(ult).append($("<li></li>").append($("<a class='p-con-type'>等于</a>").data("type", "equal").data("data", selCol)));
                                } else {
                                    $(ult).append($("<li></li>").append($("<a class='p-con-type'>等于</a>").data("type", "equal").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>大于</a>").data("type", "bigger").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>小于</a>").data("type", "smaller").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>大于等于</a>").data("type", "ebigger").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>小于等于</a>").data("type", "esmaller").data("data", selCol)));
                                }
                                $(ult).append($("<li></li>").append($("<a class='p-con-type'>为空</a>").data("type", "isnull").data("data", selCol)),
                                    $("<li></li>").append($("<a class='p-con-type'>不为空</a>").data("type", "isnotnull").data("data", selCol)));
                                if (selCol && selCol["type"] == "text") {
                                    $(ult).append($("<li></li>").append($("<a class='p-con-type'>LIKE</a>").data("type", "like").data("data", selCol)));
                                } else if (selCol && (selCol["type"] == "int")) {
                                    $(ult).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between").data("data", selCol)));
                                } else if (selCol && (selCol["type"] == "date" || selCol["type"] == "time")) {
                                    $(ult).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>相对大于</a>").data("type", "rbigger").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>相对小于</a>").data("type", "rsmaller").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>相对区间</a>").data("type", "rbetween").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>本周</a>").data("type", "n_week").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>本月</a>").data("type", "n_month").data("data", selCol)),
                                        $("<li></li>").append($("<a class='p-con-type'>本年</a>").data("type", "n_year").data("data", selCol)));
                                }
                                $(dpt).append($("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                                    "aria-expanded='false'>" + widget._UIDEFAULFS.operator[rul[rs.rootLink + ":operator"]]
                                    + " <span class='caret'></span></button>").data("data", selCol).data("type", rul[rs.rootLink + ":operator"])
                                    .data("code", rul[rs.rootLink + ":id"]), ult);
                                //p-value
                                var dv = document.createElement("div");
                                $(dv).addClass("p-value-container");
                                if (rul[rs.rootLink + ":operator"] != "isnull" && rul[rs.rootLink + ":operator"] != "isnotnull") {
                                    if (selCol && selCol["type"]) {
                                        switch (selCol["type"]) {
                                            case "int":
                                                if (rul[rs.rootLink + ":operator"] != "between") {
                                                    $(dv).append("<input class='form-control' type='number' value='" + rul[rs.rootLink + ":value_low"] + "' />");
                                                } else {
                                                    $(dv).append("<input class='form-control small' type='number' value='" + rul[rs.rootLink + ":value_low"] + "' /> " +
                                                        "- <input class='form-control small' type='number' value='" + rul[rs.rootLink + ":value_high"] + "' />");
                                                }
                                                break;
                                            case "text":
                                                $(dv).append("<input class='form-control' type='text' value='" + rul[rs.rootLink + ":value_low"] + "' />");
                                                break;
                                            case "select":
                                                var sl = document.createElement("select");
                                                $(sl).addClass("form-control");
                                                $(sl).append("<option value=''>请选择...</option>");
                                                if (selCol["pickList"] && selCol["pickList"].length) {
                                                    for (var p = 0; p < selCol["pickList"].length; p++) {
                                                        var opt = selCol["pickList"][p];
                                                        var option = $("<option value='" + opt["id"] + "'>" + opt["name"] + "</option>");
                                                        if (opt["id"] == rul[rs.rootLink + ":value_low"]) {
                                                            $(option).attr('selected', "selected");
                                                        }
                                                        $(sl).append(option);
                                                    }
                                                }
                                                $(dv).append(sl);
                                                break;
                                            case "date":
                                            case "time":
                                                if (rul[rs.rootLink + ":operator"] == "n_week" || rul[rs.rootLink + ":operator"] == "n_month" || rul[rs.rootLink + ":operator"] == "n_year") {
                                                    break;
                                                }
                                                if (rul[rs.rootLink + ":operator"] == "between") {
                                                    $(dv).append("<input class='form-control datepicker' type='text' placeholder='请选择开始日期'" +
                                                        " value='" + rul[rs.rootLink + ":value_low"] + "' />" +
                                                        " - <input class='form-control datepicker' type='text' placeholder='请选择结束日期'" +
                                                        " value='" + rul[rs.rootLink + ":value_high"] + "' />");
                                                } else if (rul[rs.rootLink + ":operator"] == "rbetween") {
                                                    var vl = rul[rs.rootLink + ":value_low"];
                                                    var vlv = vl ? vl.split("{")[0] : "";
                                                    var vlt = vl ? vl.split("{")[1].split("}")[0] : "";
                                                    var vh = rul[rs.rootLink + ":value_high"];
                                                    var vhv = vh ? vh.split("{")[0] : "";
                                                    var vht = vh ? vh.split("{")[1].split("}")[0] : "";
                                                    $(dv).append("<input class='form-control small stext' type='number' value='" + vlv + "' />" +
                                                        "<select class='form-control small stext'>" +
                                                        "<option value='hour' " + (vlt == "hour" ? "selected='selected'" : "") + ">小时</option>" +
                                                        "<option value='day' " + (vlt == "day" ? "selected='selected'" : "") + ">日</option>" +
                                                        "<option value='month' " + (vlt == "month" ? "selected='selected'" : "") + ">月</option></select>" +
                                                        " - <input class='form-control small stext' type='number' value='" + vhv + "' />" +
                                                        "<select class='form-control small stext'>" +
                                                        "<option value='hour' " + (vht == "hour" ? "selected='selected'" : "") + ">小时</option>" +
                                                        "<option value='day' " + (vht == "day" ? "selected='selected'" : "") + ">日</option>" +
                                                        "<option value='month' " + (vht == "month" ? "selected='selected'" : "") + ">月</option></select>");
                                                } else if (rul[rs.rootLink + ":operator"] == "rbigger") {
                                                    var rbvl = rul[rs.rootLink + ":value_low"];
                                                    var rbvlv = rbvl ? rbvl.split("{")[0] : "";
                                                    var rbvlt = rbvl ? rbvl.split("{")[1].split("}")[0] : "";
                                                    $(dv).append("<input class='form-control small stext' type='number' value='" + rbvlv + "' />" +
                                                        "<select class='form-control small stext'>" +
                                                        "<option value='hour' " + (rbvlt == "hour" ? "selected='selected'" : "") + ">小时</option>" +
                                                        "<option value='day' " + (rbvlt == "day" ? "selected='selected'" : "") + ">日</option>" +
                                                        "<option value='month' " + (rbvlt == "month" ? "selected='selected'" : "") + ">月</option></select>");
                                                } else if (rul[rs.rootLink + ":operator"] == "rsmaller") {
                                                    var rsbvl = rul[rs.rootLink + ":value_low"];
                                                    var rsbvlv = rsbvl ? rsbvl.split("{")[0] : "";
                                                    var rsbvlt = rsbvl ? rsbvl.split("{")[1].split("}")[0] : "";
                                                    $(dv).append("<input class='form-control small stext' type='number' value='" + rsbvlv + "' />" +
                                                        "<select class='form-control small stext'>" +
                                                        "<option value='hour' " + (rsbvlt == "hour" ? "selected='selected'" : "") + ">小时</option>" +
                                                        "<option value='day' " + (rsbvlt == "day" ? "selected='selected'" : "") + ">日</option>" +
                                                        "<option value='month' " + (rsbvlt == "month" ? "selected='selected'" : "") + ">月</option></select>");
                                                } else {
                                                    $(dv).append("<input class='form-control datepicker' type='text' placeholder='请选择日期'" +
                                                        " value='" + rul[rs.rootLink + ":value_low"] + "' />");
                                                }
                                                if (selCol["type"] == "date") {
                                                    $(dv).find(".datepicker").datetimepicker({
                                                        format: "yyyy-mm-dd",
                                                        autoclose: true,
                                                        todayBtn: true,
                                                        language: "zh-CN",
                                                        minView: "month"
                                                    }).on('hide', function (e) {
                                                        e = e || event;
                                                        event.preventDefault();
                                                        e.stopPropagation();
                                                        $(dv).find(".datepicker").trigger("blur");
                                                    });
                                                } else {
                                                    $(dv).find(".datepicker").datetimepicker({
                                                        format: "yyyy-mm-dd hh:00",
                                                        autoclose: true,
                                                        todayBtn: true,
                                                        language: "zh-CN",
                                                        minView: 1
                                                    }).on('hide', function (e) {
                                                        e = e || event;
                                                        event.preventDefault();
                                                        e.stopPropagation();
                                                        $(dv).find(".datepicker").trigger("blur");
                                                    });
                                                }
                                                break;
                                        }
                                    }
                                }
                                if (rul[rs.rootLink + ":rule_action"] && rul[rs.rootLink + ":rule_action"]["id"] == "1") {
                                    $("#ga_con_list").append($(li).append($(d).append(dc, dpt, dv,
                                        $("<span class='icon-minus-sign con-remove ga exist'></span>").data("key", rul[rs.rootLink + ":id"]))));
                                    widget._UIDEFAULFS.cons["ori"]["anCons"][rul[rs.rootLink + ":id"]] = rul;
                                }
                            } else if (rul[rs.rootLink + ":type"] && rul[rs.rootLink + ":type"]["id"] == "2") {
                                var tid = rul[rs.rootLink + ":value_low"];
                                var sp = document.createElement("span");
                                if (rul[rs.rootLink + ":rule_action"] && rul[rs.rootLink + ":rule_action"]["id"] == "1") {
                                    var asp = $("#ga-tag-container .tag-source .tag-item[data-key=" + tid + "]");
                                    if (asp && asp.length) {
                                        $(sp).addClass("tag-item").append("<span class='text'>" + asp.data("val") + "</span>",
                                            $("<span></span>").addClass("remove icon-remove exist").data("key", rul[rs.rootLink + ":id"]));
                                        $("#ga-tag-container .tag-sel").append(sp);
                                        widget._UIDEFAULFS.cons["ori"]["atCons"][tid] = {
                                            rid: rul[rs.rootLink + ":id"],
                                            key: asp.data("key"),
                                            val: asp.data("val")
                                        };
                                        asp.hide();
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    },
    enableTab: function () {
        widget._addEventListener({
            container: "#g-rule",
            target: ".rule-panel .type-lable:not(.active)",
            type: "click",
            event: function () {
                var me = $(this);
                var parent = me.parents(".rule-panel:first");
                parent.find(".rule-type-lable .type-lable").removeClass("active");
                me.addClass("active");
                parent.find(".rule-content .content").removeClass('active');
                $(me.attr("data-content")).addClass("active");
            }
        });
    },
    enableConTypeClick: function () {
        widget._addEventListener({
            container: "body",
            target: ".con-type a",
            type: "click",
            event: function () {
                var me = $(this);
                if (!me.find("input.blueRadio:checked").length) {
                    me.find("input.blueRadio").prop("checked", true);
                }
                var cp = me.parents(".con-type:first");
                if (cp.hasClass("ga")) {
                    if (Object.keys(widget._UIDEFAULFS.cons.ori.anCons).length) {
                        for (var oan in widget._UIDEFAULFS.cons.ori.anCons) {
                            if (!widget._UIDEFAULFS.cons.update.anCons[oan]) {
                                var obj = widget._UIDEFAULFS.cons.ori.anCons[oan];
                                widget._UIDEFAULFS.cons.update.anCons[oan] = {
                                    field: obj["contactgroup_rule:field"],
                                    operator: obj["contactgroup_rule:operator"],
                                    vlow: obj["contactgroup_rule:value_low"],
                                    vhigh: Iptools.Tool._GetProperValue(obj["contactgroup_rule:value_high"])
                                }
                            }
                        }
                    }
                    if (Object.keys(widget._UIDEFAULFS.cons.ori.atCons).length) {
                        for (var oat in widget._UIDEFAULFS.cons.ori.atCons) {
                            if (!widget._UIDEFAULFS.cons.update.atCons[oat]) {
                                var obt = widget._UIDEFAULFS.cons.ori.atCons[oat];
                                widget._UIDEFAULFS.cons.update.atCons[oat] = {
                                    rid: obt["rid"],
                                    key: obt["key"],
                                    val: obt["val"]
                                }
                            }
                        }
                    }
                }
            }
        });
    },
    enableConAdd: function () {
        widget._addEventListener({
            container: "body",
            target: ".g-con-add a.ga",
            type: "click",
            event: function () {
                var li = document.createElement("li");
                var d = document.createElement("div");
                $(d).addClass("g-con-group");
                var dc = document.createElement("div");
                $(dc).addClass("dropdown p-col-container");
                var ulc = document.createElement("ul");
                $(ulc).addClass("dropdown-menu");
                var data = widget._UIDEFAULFS.data;
                if (data && data.columns && data.columns.length) {
                    for (var i = 0; i < data.columns.length; i++) {
                        var col = data.columns[i];
                        $(ulc).append($("<li></li>").append($("<a class='con-col'>" + col["name"] + "</a>").data("data", col)));
                    }
                }
                $(dc).append("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                    "aria-expanded='false'>属性 <span class='caret'></span></button>", ulc);
                $(li).append($(d).append(dc, "<span class='icon-minus-sign con-remove ga'></span>"));
                $("#ga_con_list").append(li);
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul ul li a.con-col",
            type: "click",
            event: function () {
                var me = $(this);
                var data = me.data("data");
                var gul = me.parents(".g-con-ul:first");
                var dp = me.parents(".dropdown:first");
                $(dp).find("button").html(me.text() + " <span class='caret'></span>").data("data", data);
                var dc = me.parents(".g-con-group:first");
                var ctb = $(dc).find(".p-type-container button.g-con-btn");
                if (gul.hasClass("ga")) {
                    if (dc.hasClass('exist')) {
                        widget._UIDEFAULFS.cons.del.anCons.push(ctb.data("code"));
                    } else {
                        delete widget._UIDEFAULFS.cons.create.anCons[ctb.data('code')];
                    }
                }
                $(dc).find(".p-type-container").remove();
                $(dc).find(".p-value-container").remove();
                var dpt = document.createElement("div");
                $(dpt).addClass("dropdown p-type-container");
                var ulc = document.createElement("ul");
                $(ulc).addClass("dropdown-menu");
                if (data && data["type"] == "select") {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>等于</a>").data("type", "equal").data("data", data)));
                } else {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>等于</a>").data("type", "equal").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>大于</a>").data("type", "bigger").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>小于</a>").data("type", "smaller").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>大于等于</a>").data("type", "ebigger").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>小于等于</a>").data("type", "esmaller").data("data", data)));
                }
                $(ulc).append($("<li></li>").append($("<a class='p-con-type'>为空</a>").data("type", "isnull").data("data", data)),
                    $("<li></li>").append($("<a class='p-con-type'>不为空</a>").data("type", "isnotnull").data("data", data)));
                if (data && data["type"] == "text") {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>LIKE</a>").data("type", "like").data("data", data)));
                } else if (data && (data["type"] == "int")) {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between").data("data", data)));
                } else if (data && (data["type"] == "date" || data["type"] == "time")) {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>相对大于</a>").data("type", "rbigger").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>相对小于</a>").data("type", "rsmaller").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>相对区间</a>").data("type", "rbetween").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>本周</a>").data("type", "n_week").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>本月</a>").data("type", "n_month").data("data", data)),
                        $("<li></li>").append($("<a class='p-con-type'>本年</a>").data("type", "n_year").data("data", data)));
                }
                $(dpt).append("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                    "aria-expanded='false'>判断 <span class='caret'></span></button>", ulc);
                $(dc).find(".con-remove").before(dpt);
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul ul li a.p-con-type",
            type: "click",
            event: function () {
                var me = $(this);
                var data = me.data("data");
                var gul = me.parents(".g-con-ul:first");
                var dc = me.parents(".g-con-group:first");
                $(dc).find(".p-value-container").remove();
                var ctb = $(dc).find(".p-type-container button.g-con-btn");
                if (gul.hasClass("ga")) {
                    if (dc.hasClass('exist')) {
                        widget._UIDEFAULFS.cons.del.anCons.push(ctb.data("code"));
                        $(dc).removeClass("exist");
                    } else {
                        delete widget._UIDEFAULFS.cons.create.anCons[ctb.data('code')];
                    }
                }
                var dp = me.parents(".dropdown:first");
                $(dp).find("button").html(me.text() + " <span class='caret'></span>").data("data", data)
                    .data("type", me.data("type")).data("code", (new Date()).getTime());
                var d = document.createElement("div");
                $(d).addClass("p-value-container");
                if (me.data("type") != "isnull" && me.data("type") != "isnotnull") {
                    if (data && data["type"]) {
                        switch (data["type"]) {
                            case "int":
                                if (me.data("type") != "between") {
                                    $(d).append("<input class='form-control' type='number' />");
                                } else {
                                    $(d).append("<input class='form-control small' type='number' /> - <input class='form-control small' type='number' />");
                                }
                                break;
                            case "text":
                                $(d).append("<input class='form-control' type='text' />");
                                break;
                            case "select":
                                var sl = document.createElement("select");
                                $(sl).addClass("form-control");
                                $(sl).append("<option value=''>请选择...</option>");
                                if (data["pickList"] && data["pickList"].length) {
                                    for (var i = 0; i < data["pickList"].length; i++) {
                                        var opt = data["pickList"][i];
                                        $(sl).append("<option value='" + opt["id"] + "'>" + opt["name"] + "</option>");
                                    }
                                }
                                $(d).append(sl);
                                break;
                            case "date":
                            case "time":
                                if (me.data("type") == "n_week" || me.data("type") == "n_month" || me.data("type") == "n_year") {
                                    if (dc.hasClass('exist')) {
                                        widget._UIDEFAULFS.cons.del.anCons.push(ctb.data("code"));
                                        $(dc).removeClass("exist");
                                    }
                                    delete widget._UIDEFAULFS.cons.create.anCons[ctb.data('code')];
                                    widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = {
                                        field: data["field"],
                                        operator: me.data("type"),
                                    };
                                    break;
                                }
                                if (me.data("type") == "between") {
                                    $(d).append("<input class='form-control datepicker' type='text' placeholder='请选择开始日期' />" +
                                        " - <input class='form-control datepicker' type='text' placeholder='请选择结束日期' />");
                                } else if (me.data("type") == "rbetween") {
                                    $(d).append("<input class='form-control small stext' type='number' />" +
                                        "<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option></select>" +
                                        " - <input class='form-control small stext' type='number' />" +
                                        "<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option></select>");
                                } else if (me.data("type") == "rbigger") {
                                    $(d).append("<input class='form-control small stext' type='number' />" +
                                        "<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option></select>");
                                } else if (me.data("type") == "rsmaller") {
                                    $(d).append("<input class='form-control small stext' type='number' />" +
                                        "<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option></select>");
                                } else {
                                    $(d).append("<input class='form-control datepicker' type='text' placeholder='请选择日期' />");
                                }
                                if (data["type"] == "date") {
                                    $(d).find(".datepicker").datetimepicker({
                                        format: "yyyy-mm-dd",
                                        autoclose: true,
                                        todayBtn: true,
                                        language: "zh-CN",
                                        minView: "month"
                                    }).on('hide', function (e) {
                                        e = e || event;
                                        event.preventDefault();
                                        e.stopPropagation();
                                        $(d).find(".datepicker").trigger("blur");
                                    });
                                } else {
                                    $(d).find(".datepicker").datetimepicker({
                                        format: "yyyy-mm-dd hh:00",
                                        autoclose: true,
                                        todayBtn: true,
                                        language: "zh-CN",
                                        minView: 1
                                    }).on('hide', function (e) {
                                        e = e || event;
                                        event.preventDefault();
                                        e.stopPropagation();
                                        $(d).find(".datepicker").trigger("blur");
                                    });
                                }
                                break;
                        }
                    }
                    $(dc).find(".con-remove").before(d);
                } else {
                    if (dc.hasClass('exist')) {
                        widget._UIDEFAULFS.cons.del.anCons.push(ctb.data("code"));
                        $(dc).removeClass("exist");
                    }
                    delete widget._UIDEFAULFS.cons.create.anCons[ctb.data('code')];
                    widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = {
                        field: data["field"],
                        operator: me.data("type"),
                    };
                }
            }
        });
    },
    enableConTrigger: function () {
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul li input",
            type: "blur",
            event: function () {
                var me = $(this);
                var gul = me.parents(".g-con-ul:first");
                var gc = me.parents(".g-con-group:first");
                var gv = me.parents(".p-value-container");
                var ctb = $(gc).find(".p-type-container button.g-con-btn");
                var data = $(ctb).data('data');
                if (data) {
                    if (me.val() != "") {
                        switch ($(ctb).data("type")) {
                            case "equal":
                            case "bigger":
                            case "smaller":
                            case "ebigger":
                            case "esmaller":
                            case "like":
                                if ($(gul).hasClass('ga')) {
                                    if ($(gc).hasClass("exist")) {
                                        widget._UIDEFAULFS.cons.update.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: me.val() };
                                    } else {
                                        widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: me.val() };
                                    }
                                }
                                break;
                            case "between":
                                var vl = $(gv).find("input:eq(0)").val();
                                var vh = $(gv).find("input:eq(1)").val();
                                if (vl != "" && vh != "") {
                                    if ($(gul).hasClass('ga')) {
                                        if ($(gc).hasClass("exist")) {
                                            widget._UIDEFAULFS.cons.update.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: vl, vhigh: vh };
                                        } else {
                                            widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: vl, vhigh: vh };
                                        }
                                    }
                                }
                                break;
                            case "rbigger":
                            case "rsmaller":
                                var rl = $(gv).find("select").val();
                                if ($(gul).hasClass('ga')) {
                                    if ($(gc).hasClass("exist")) {
                                        widget._UIDEFAULFS.cons.update.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: me.val() + "{" + rl + "}" };
                                    } else {
                                        widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: me.val() + "{" + rl + "}" };
                                    }
                                }
                                break;
                            case "rbetween":
                                var rbl = $(gv).find("select:eq(0)").val();
                                var rbh = $(gv).find("select:eq(1)").val();
                                var rbli = $(gv).find("input:eq(0)").val();
                                var rbhi = $(gv).find("input:eq(1)").val();
                                if (rbli != "" && rbhi != "") {
                                    if ($(gul).hasClass('ga')) {
                                        if ($(gc).hasClass("exist")) {
                                            widget._UIDEFAULFS.cons.update.anCons[ctb.data("code")] = {
                                                field: data["field"],
                                                operator: $(ctb).data("type"),
                                                vlow: rbli + "{" + rbl + "}",
                                                vhigh: rbhi + "{" + rbh + "}"
                                            };
                                        } else {
                                            widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = {
                                                field: data["field"],
                                                operator: $(ctb).data("type"),
                                                vlow: rbli + "{" + rbl + "}",
                                                vhigh: rbhi + "{" + rbh + "}"
                                            };
                                        }
                                    }
                                }
                                break;
                        }
                    } else {
                        if ($(gul).hasClass('ga')) {
                            if (!$(gc).hasClass("exist")) {
                                delete widget._UIDEFAULFS.cons.create.anCons[data["field"]];
                            }
                        }
                    }
                }
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul li select",
            type: "change",
            event: function () {
                var me = $(this);
                var gul = me.parents(".g-con-ul:first");
                var gc = me.parents(".g-con-group:first");
                var gv = me.parents(".p-value-container");
                var ctb = $(gc).find(".p-type-container button.g-con-btn");
                var data = $(ctb).data('data');
                if (data) {
                    if (me.val() != "") {
                        switch ($(ctb).data("type")) {
                            case "equal":
                                if ($(gul).hasClass('ga')) {
                                    if ($(gc).hasClass("exist")) {
                                        widget._UIDEFAULFS.cons.update.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: me.val() };
                                    } else {
                                        widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: me.val() };
                                    }
                                }
                                break;
                            case "rbigger":
                            case "rsmaller":
                                var ri = $(gv).find("input").val();
                                if (ri != "") {
                                    if ($(gul).hasClass('ga')) {
                                        if ($(gc).hasClass("exist")) {
                                            widget._UIDEFAULFS.cons.update.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: ri + "{" + me.val() + "}" };
                                        } else {
                                            widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = { field: data["field"], operator: $(ctb).data("type"), vlow: ri + "{" + me.val() + "}" };
                                        }
                                    }
                                }
                                break;
                            case "rbetween":
                                var rbl = $(gv).find("select:eq(0)").val();
                                var rbh = $(gv).find("select:eq(1)").val();
                                var rbli = $(gv).find("input:eq(0)").val();
                                var rbhi = $(gv).find("input:eq(1)").val();
                                if (rbli != "" && rbhi != "") {
                                    if ($(gul).hasClass('ga')) {
                                        if ($(gc).hasClass("exist")) {
                                            widget._UIDEFAULFS.cons.update.anCons[ctb.data("code")] = {
                                                field: data["field"],
                                                operator: $(ctb).data("type"),
                                                vlow: rbli + "{" + rbl + "}",
                                                vhigh: rbhi + "{" + rbh + "}"
                                            };
                                        } else {
                                            widget._UIDEFAULFS.cons.create.anCons[ctb.data("code")] = {
                                                field: data["field"],
                                                operator: $(ctb).data("type"),
                                                vlow: rbli + "{" + rbl + "}",
                                                vhigh: rbhi + "{" + rbh + "}"
                                            };
                                        }
                                    }
                                }
                                break;
                        }
                    } else {
                        if ($(gul).hasClass('ga')) {
                            if ($(gc).hasClass("exist")) {
                                delete widget._UIDEFAULFS.cons.create.anCons[data["field"]];
                            }
                        }
                    }
                }
            }
        });
    },
    enableConRemove: function () {
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul.ga li span.con-remove",
            type: "click",
            event: function () {
                var me = $(this);
                var gc = me.parents(".g-con-group:first");
                var ctb = $(gc).find(".p-type-container button.g-con-btn");
                if (me.hasClass('exist')) {
                    widget._UIDEFAULFS.cons.del.anCons.push(ctb.data("code"));
                } else {
                    delete widget._UIDEFAULFS.cons.create.anCons[ctb.data('code')];
                }
                $(gc).parent().remove();
            }
        });
    },
    _saveNorCons: function (applet, groupId, ruleAction, logicType, data) {
        var param = {
            "contactgroup_rule:contact_group_id": groupId,
            "contactgroup_rule:rule_action": ruleAction,
            "contactgroup_rule:logic_type": logicType,
            "contactgroup_rule:type": "1",
            "contactgroup_rule:field": data["field"],
            "contactgroup_rule:operator": data["operator"],
            "contactgroup_rule:value_low": data["vlow"],
        };
        if (Iptools.Tool._checkNull(data["vhigh"])) {
            param["contactgroup_rule:value_high"] = data["vhigh"];
        }
        Iptools.uidataTool._addAppletData({
            appletId: applet,
            data: JSON.stringify(param)
        }).done(function () {
            widget._UIDEFAULFS.submitExcute++;
        });
    },
    _updateNorCons: function (applet, valueId, logicType, data) {
        var param = {
            "contactgroup_rule:logic_type": logicType,
            "contactgroup_rule:value_low": data["vlow"],
        };
        if (Iptools.Tool._checkNull(data["vhigh"])) {
            param["contactgroup_rule:value_high"] = data["vhigh"];
        }
        Iptools.uidataTool._saveAppletData({
            appletId: applet,
            valueId: valueId,
            data: JSON.stringify(param)
        }).done(function () {
            widget._UIDEFAULFS.submitExcute++;
        });
    },
    _updateTagCons: function (applet, logicType, data) {
        var param = {
            "contactgroup_rule:logic_type": logicType,
        };
        Iptools.uidataTool._saveAppletData({
            appletId: applet,
            valueId: data["rid"],
            data: JSON.stringify(param)
        }).done(function () {
            widget._UIDEFAULFS.submitExcute++;
        });
    },
    _delNorCons: function (applet, ids) {
        Iptools.uidataTool._deleteAppletData({
            appletId: applet,
            valueIds: ids,
            para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + applet + "&valueIds=" + ids
        }).done(function () {
            widget._UIDEFAULFS.submitExcute++;
        });
    },
    _saveTagCons: function (applet, groupId, ruleAction, logicType, data) {
        var param = {
            "contactgroup_rule:contact_group_id": groupId,
            "contactgroup_rule:rule_action": ruleAction,
            "contactgroup_rule:logic_type": logicType,
            "contactgroup_rule:type": "2",
            "contactgroup_rule:value_low": data["key"],
        };
        Iptools.uidataTool._addAppletData({
            appletId: applet,
            data: JSON.stringify(param)
        }).done(function () {
            widget._UIDEFAULFS.submitExcute++;
        });
    },
    enableConsSave: function () {
        widget._addEventListener({
            container: "body",
            target: "#g_rule_submit",
            type: "click",
            event: function () {
                if (widget._UIDEFAULFS.ruleSaveApplet) {
                    var me = $(this);
                    me.addClass("no-events").button('loading');
                    $("#g_rule_excute").hide();
                    var applet = widget._UIDEFAULFS.ruleSaveApplet;
                    widget._UIDEFAULFS.submitCount = 0;
                    widget._UIDEFAULFS.submitExcute = 0;
                    //logicType
                    var alt = $("#g-rule-container .con-type input:eq(0)").prop("checked") ? "and" : "or";
                    //create
                    widget._UIDEFAULFS.submitCount += Object.keys(widget._UIDEFAULFS.cons.create.anCons).length;
                    widget._UIDEFAULFS.submitCount += Object.keys(widget._UIDEFAULFS.cons.create.atCons).length;
                    //update
                    widget._UIDEFAULFS.submitCount += Object.keys(widget._UIDEFAULFS.cons.update.anCons).length;
                    widget._UIDEFAULFS.submitCount += Object.keys(widget._UIDEFAULFS.cons.update.atCons).length;
                    //delete
                    if (widget._UIDEFAULFS.cons.del.anCons.length > 0) {
                        widget._UIDEFAULFS.submitCount++;
                    }
                    if (widget._UIDEFAULFS.cons.del.atCons.length > 0) {
                        widget._UIDEFAULFS.submitCount++;
                    }
                    //POST
                    for (var can in widget._UIDEFAULFS.cons.create.anCons) {
                        widget._saveNorCons(applet, Iptools.DEFAULTS.currentViewValue, "1", alt, widget._UIDEFAULFS.cons.create.anCons[can]);
                    }
                    for (var cat in widget._UIDEFAULFS.cons.create.atCons) {
                        widget._saveTagCons(applet, Iptools.DEFAULTS.currentViewValue, "1", alt, widget._UIDEFAULFS.cons.create.atCons[cat]);
                    }
                    //PUT
                    for (var uan in widget._UIDEFAULFS.cons.update.anCons) {
                        widget._updateNorCons(applet, uan, alt, widget._UIDEFAULFS.cons.update.anCons[uan]);
                    }
                    for (var uat in widget._UIDEFAULFS.cons.update.atCons) {
                        widget._updateTagCons(applet, alt, widget._UIDEFAULFS.cons.update.atCons[uat]);
                    }
                    //DELETE
                    if (widget._UIDEFAULFS.cons.del.anCons.length) {
                        widget._delNorCons(applet, widget._UIDEFAULFS.cons.del.anCons.join(","));
                    }
                    if (widget._UIDEFAULFS.cons.del.atCons.length) {
                        widget._delNorCons(applet, widget._UIDEFAULFS.cons.del.atCons.join(","));
                    }
                    widget._UIDEFAULFS.conInterval = setInterval(function () {
                        if (widget._UIDEFAULFS.submitCount == widget._UIDEFAULFS.submitExcute) {
                            me.removeClass("no-events").button('reset');
                            $("#g_rule_excute").show();
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "更新完成"
                            });
                            clearInterval(widget._UIDEFAULFS.conInterval);
                            widget._setCons();
                        }
                    }, 1000);
                }
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#g_rule_excute",
            type: "click",
            event: function () {
                var me = $(this);
                me.addClass("no-events").button('loading');
                $("#g_rule_submit").hide();
                Iptools.GetJson({
                    url: "basic/contactgroups/runRule",
                    data: {
                        token: Iptools.DEFAULTS.token,
                        contactgroupId: Iptools.DEFAULTS.currentViewValue
                    }
                }).done(function () {
                    me.removeClass("no-events").button('reset');
                    $("#g_rule_submit").show();
                    $(widget._UIDEFAULFS.memberList).data("stable")._refresh();
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "执行完成"
                    });
                });
            }
        });
    },
    enableTagMove: function () {
        widget._addEventListener({
            container: "body",
            target: ".tag-source.ga .tag-item",
            type: "click",
            event: function () {
                var me = $(this);
                me.hide();
                var sp = document.createElement("span");
                $(sp).addClass("tag-item").append("<span class='text'>" + me.data("val") + "</span>",
                    $("<span></span>").addClass("remove icon-remove").data("key", me.data("key")));
                $("#ga-tag-container .tag-sel").append(sp);
                widget._UIDEFAULFS.cons.create.atCons[me.data("key")] = {
                    key: me.data("key"),
                    val: me.data("val")
                };
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".tag-sel.ga span.remove",
            type: "click",
            event: function () {
                var me = $(this);
                $("#ga-tag-container .tag-source .tag-item[data-key=" + me.data("key") + "]").show();
                if (me.hasClass('exist')) {
                    widget._UIDEFAULFS.cons.del.atCons.push(me.data("key"));
                } else {
                    delete widget._UIDEFAULFS.cons.create.atCons[me.data("key")];
                }
                me.parent().remove();
            }
        });
    },
    enableInfoShow: function () {
        widget._addEventListener({
            container: "body",
            target: ".g-manage .edit",
            type: "click",
            event: function () {
                var gi = $(this).parents(".g-info:first");
                gi.find(".g-noraml").hide();
                gi.find(".g-save").show();
                gi.find(".read").hide();
                gi.find(".write").show();
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".g-manage .remove",
            type: "click",
            event: function () {
                var gi = $(this).parents(".g-info:first");
                gi.find(".g-noraml").show();
                gi.find(".g-save").hide();
                gi.find(".read").show();
                gi.find(".write").hide();
                $("#g-info-form").data("bootstrapValidator").resetForm();
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".g-manage .ok",
            type: "click",
            event: function () {
                $("#g-info-form").bootstrapValidator('validate');
                if ($("#g-info-form").data("bootstrapValidator").isValid()) {
                    var me = $(this);
                    me.removeClass("icon-ok").addClass("icon-spin icon-spinner");
                    var gi = me.parents(".g-info:first");
                    Iptools.uidataTool._getCustomizeApplet({
                        nameList: "'Contactgroup Detail Applet'"
                    }).done(function (r) {
                        if (r && r.applets && r.applets.length) {
                            var applet = r.applets[0].applet;
                            Iptools.uidataTool._saveAppletData({
                                appletId: applet,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                data: JSON.stringify({
                                    "contactgroup:title": $("#cg-title-edit").val(),
                                    "contactgroup:group_reason": $("#cg-type").val(),
                                    "contactgroup:description": $("#cg-des-edit").val()
                                })
                            }).done(function () {
                                widget._setGroupInfo();
                                me.removeClass("icon-spin icon-spinner").addClass("icon-ok");
                                gi.find(".g-noraml").show();
                                gi.find(".g-save").hide();
                                gi.find(".read").show();
                                gi.find(".write").hide();
                            });
                        }
                    });
                }
            }
        });
    },
    enableTaskSubmit: function () {
        widget._addEventListener({
            container: "body",
            target: "#task_Submit",
            type: "click",
            event: function () {
                $("#task-form").bootstrapValidator('validate');
                if ($("#task-form").data("bootstrapValidator").isValid()) {
                    var me = $(this);
                    me.addClass("no-events").button("loading");
                    if (widget._UIDEFAULFS.taskMode == "table") {
                        var index = $(widget._UIDEFAULFS.memberList).data("stable")._getCheckIndex();
                        var data = $(widget._UIDEFAULFS.memberList).data("stable").options.data;
                        if (data && data.records && data.records.length && index && index.length) {
                            var ids = [];
                            for (var i = 0; i < index.length; i++) {
                                var oda = data.records[index[i]];
                                if (Iptools.Tool._checkNull(oda["contactlinkgroup:contactid"])) {
                                    ids.push(oda["contactlinkgroup:contactid"]["id"]);
                                }
                            }
                            Iptools.GetJson({
                                url: "basic/contactgroups/createtasks",
                                data: {
                                    token: Iptools.DEFAULTS.token,
                                    contactgroupId: Iptools.DEFAULTS.currentViewValue,
                                    taskName: $("#taskName").val(),
                                    endTime: $("#endTime").val(),
                                    taskDes: $("#taskDes").val(),
                                    taskType: $("#taskType").val(),
                                    assignType: $("#assignType").val(),
                                    taskAssign: $("#taskAssign").val(),
                                    contactIds: ids.join()
                                }
                            }).done(function () {
                                me.removeClass("no-events").button("reset");
                                $("#taskModal").modal('hide');
                                widget._setTasks();
                            });
                        }
                    } else {
                        Iptools.GetJson({
                            url: "service/appletListIds",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                viewId: Iptools.DEFAULTS.currentView,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                appletId: widget._UIDEFAULFS.linkContactApplet,
                                column: "contactlinkgroup:contactid"
                            }
                        }).done(function (d) {
                            if (d && d.ids && d.ids.length) {
                                Iptools.GetJson({
                                    url: "basic/contactgroups/createtasks",
                                    data: {
                                        token: Iptools.DEFAULTS.token,
                                        contactgroupId: Iptools.DEFAULTS.currentViewValue,
                                        taskName: $("#taskName").val(),
                                        endTime: $("#endTime").val(),
                                        taskDes: $("#taskDes").val(),
                                        taskType: $("#taskType").val(),
                                        assignType: $("#assignType").val(),
                                        taskAssign: $("#taskAssign").val(),
                                        contactIds: d.ids.join()
                                    }
                                }).done(function () {
                                    me.removeClass("no-events").button("reset");
                                    $("#taskModal").modal('hide');
                                    widget._setTasks();
                                });
                            }
                        });
                    }
                }
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#taskModal",
            type: "hide.bs.modal",
            event: function () {
                widget._UIDEFAULFS.taskMode = "whole";
                $("#taskName").val("");
                $("#endTime").val("");
                $("#taskDes").val("");
                $("#taskType").val("");
                $("#taskAssign").val("");
                $("#task-form").data("bootstrapValidator").resetForm();
            }
        });
    },
    enableMemberManage: function () {
        widget._addEventListener({
            container: "body",
            target: "#add_member_Submit",
            type: "click",
            event: function () {
                var idList = $("#addMemberList").data("stable")._getChecks();
                if (idList.length) {
                    var me = $(this);
                    me.addClass("no-events").button('loading');
                    Iptools.PostJson({
                        url: "basic/linkContactgroup",
                        data: {
                            token: Iptools.DEFAULTS.token,
                            contactgroupId: Iptools.DEFAULTS.currentViewValue,
                            contactIds: idList.join()
                        }
                    }).done(function () {
                        $("#selectMemberModal").modal("hide");
                        me.removeClass("no-events").button('reset');
                        $(widget._UIDEFAULFS.memberList).data("stable")._refresh();
                    });
                } else {
                    $("#selectMemberModal").modal("hide");
                }
            }
        });
    },
    enableAnalysisTabShow: function () {
        widget._addEventListener({
            container: "body",
            target: "#g-report-tab",
            type: "shown.bs.tab",
            event: function () {
                if (widget._UIDEFAULFS.reports.length) {
                    for (var i = 0; i < widget._UIDEFAULFS.reports.length; i++) {
                        var rep = widget._UIDEFAULFS.reports[i];
                        try {
                            rep.highcharts().reflow();
                        } catch (e) { }
                    }
                }
            }
        });
    }
}