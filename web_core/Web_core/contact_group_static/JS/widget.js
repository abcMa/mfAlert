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
        gm: "#group_info",
        ml: "#g_member_list",
        campaignList: "#g_campaign_list",
        taskList: "#g_task_list",
        searchListApplet: 0,
        taskEditApplet: 0
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
        widget._enableContactSelect();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setTaskForm();
        widget._setGroupInfo();
        widget._setGroupReport();
    },
    _setTaskForm: function () {
        $("#task-form").bootstrapValidator({
            fields: {
                taskName: {
                    validators: {
                        notEmpty: {
                            message: '请填写任务名称'
                        }
                    }
                },
                taskStatus: {
                    validators: {
                        notEmpty: {
                            message: '请选择任务状态'
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
            }
        });
        $("#endTime").datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
        }).on('hide', function (e) {
            e = e || event;
            event.preventDefault();
            e.stopPropagation();
        });
    },
    _setGroupInfo: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_group_detail','contact_group_linkcontact_list','contactgroup_link_campaign','cg_task_list','cg-link-task-edit'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                widget._UIDEFAULFS.taskEditApplet = r.applets[4].applet;
                component._panel(widget._UIDEFAULFS.gm, {
                    applet: r.applets[0].applet,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                    dataModify: function (data) {
                        var promise = $.Deferred();
                        if (data && data.controls && data.controls.length) {
                            for (var i = 0; i < data.controls.length; i++) {
                                var con = data.controls[i];
                                if (con.column == "contactgroup:group_reason") {
                                    con.type = "hidden";
                                }
                            }
                            data.controls.splice(2, 0, {
                                type: "html",
                                column: data.rootLink + ":contactCount",
                                name: "客户群人数",
                            });
                            if (data.data) {
                                data.data["contactgroup:contactCount"] = "<span id='group_total_count' class='fa fa-spin fa-spinner'></span>";
                            }
                        }
                        promise.resolve(data);
                        return promise;
                    }
                });
                component._table(widget._UIDEFAULFS.ml, {
                    applet: r.applets[1].applet,
                    view: Iptools.DEFAULTS.currentView,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                    groupBtnName: "创建任务",
                    dataModify: function (data) {
                        var promise = $.Deferred();
                        if (data && data.data && data.data.records && data.data.records.length) {
                            for (var i = 0; i < data.data.records.length; i++) {
                                var od = data.data.records[i];
                                if (Iptools.Tool._checkNull(od["contactlinkgroup:task_id"])) {
                                    od["contactlinkgroup:task_id"] = "<a class='link-task-item' data-key='" + od["contactlinkgroup:task_id"]["id"]
                                        + "'>" + od["contactlinkgroup:task_id"]["name"] + "</a>";
                                }
                            }
                        }
                        promise.resolve(data);
                        return promise;
                    },
                    afterLoad: function () {
                        var d = $(widget._UIDEFAULFS.ml).data("stable").options.data;
                        if (d && d.rowCount) {
                            $("#group_total_count").removeClass("fa fa-spin fa-spinner").html(d.rowCount);
                            $("#g-members-count").html(d.rowCount);
                        } else {
                            $("#group_total_count").removeClass("fa fa-spin fa-spinner").html(0);
                            $("#g-members-count").html(0);
                        }
                    },
                    events: [
                        {
                            target: ".s-header-bar .s-manage .add-member",
                            type: "click",
                            event: function () {
                                Iptools.uidataTool._getCustomizeApplet({
                                    nameList: "'cg_contact_search_list'"
                                }).done(function (s) {
                                    if (s && s.applets && s.applets.length) {
                                        component._table("#addMemberList", {
                                            applet: s.applets[0].applet
                                        });
                                        widget._UIDEFAULFS.searchListApplet = s.applets[0].applet;
                                    }
                                    $("#selectMemberModal").modal("show");
                                });
                            }
                        },
                        {
                            target: ".s-header-bar .s-manage .remove-member",
                            type: "click",
                            event: function () {
                                if (confirm("确定移除？")) {
                                    var ids = $(widget._UIDEFAULFS.ml).data("stable")._getChecks();
                                    Iptools.PostJson({
                                        url: "basic/contactgroups/removeLinks",
                                        data: {
                                            token: Iptools.DEFAULTS.token,
                                            links: ids.join()
                                        }
                                    }).done(function () {
                                        $(widget._UIDEFAULFS.ml).data("stable")._refresh();
                                        widget._setGroupReport();
                                    });
                                }
                            }
                        },
                        {
                            target: ".s-header-bar .s-manage .ct-select",
                            type: "click",
                            event: function () {
                                widget._UIDEFAULFS.selectIds = $(widget._UIDEFAULFS.ml).data("stable")._getChecks();
                                $("#taskModal").modal("show");
                            }
                        }, {
                            target: ".s-header-bar .s-manage .ct-all",
                            type: "click",
                            event: function () {
                                var me = $(this);
                                me.closest(".s-manage-group").find("button").addClass("no-events").button("loading");
                                var data = {
                                    applet: r.applets[1].applet
                                }, condition = $(widget._UIDEFAULFS.ml).data("stable")._getCondition();
                                if (condition != "") {
                                    data["condition"] = condition;
                                }
                                Iptools.uidataTool._getAppletColumnValueList(data).done(function (rs) {
                                    if (rs && rs.ids && rs.ids.length) {
                                        widget._UIDEFAULFS.selectIds = rs.ids;
                                        $("#taskModal").modal("show");
                                    } else {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "无筛选数据"
                                        });
                                    }
                                    me.closest(".s-manage-group").find("button").removeClass("no-events").button("reset");
                                });
                            }
                        },
                        {
                            target: ".s-cell .link-task-item",
                            type: "click",
                            event: function () {
                                var me = $(this);
                                var id = me.attr("data-key");
                                component._unit("", {
                                    applet: widget._UIDEFAULFS.taskEditApplet,
                                    type: "modal",
                                    modal: {
                                        width: 800,
                                        title: "编辑任务"
                                    },
                                    mode: "edit",
                                    valueId: id,
                                    autoRefresh: false
                                });
                            }
                        }
                    ],
                    multiPanel: true,
                    panels: [{
                        name: "趋势",
                        icon: "fa fa-pie-chart",
                        container: "g_member_report",
                        onShow: function () {
                            try {
                                $("#g_member_report").highcharts().reflow();
                            } catch (e) { }
                        }
                    }]
                });
                component._table(widget._UIDEFAULFS.campaignList, {
                    view: Iptools.DEFAULTS.currentView,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                    applet: r.applets[2].applet,
                    condition: {
                        "campaign_channel:target_group": "=" + Iptools.DEFAULTS.currentViewValue
                    },
                    emptyText: "没有客群活动。去做个活动活跃一下客群吧",
                    emptyClick: function () {
                        Iptools.uidataTool._getCustomizeView({
                            nameList: "'campaign_new'"
                        }).done(function (v) {
                            if (v && v.views && v.views.length) {
                                Iptools.uidataTool._getView({
                                    view: v.views[0].view
                                }).done(function (s) {
                                    Iptools.Tool._jumpView({
                                        view: v.views[0].view,
                                        name: s.view.name,
                                        type: s.view.type,
                                        url: s.view.url,
                                        bread: true
                                    });
                                });
                            }
                        });
                    },
                    jumpType: "template",
                    jumpTemplate: "<a class='d-v-link' title='查看活动详情'><span class='fa fa-edit'></span></a>",
                    events: [],
                    afterLoad: function () {
                        var data = $(widget._UIDEFAULFS.campaignList).data("stable").options.data;
                        if (data && data.rowCount) {
                            $("#g-campaigns-counts").html(data.rowCount);
                        } else {
                            $("#g-campaigns-counts").html(0);
                        }
                    },
                    showChecks: false
                });
            }
        });
    },
    _setGroupReport: function () {
        $("#g_member_report").loading();
        Iptools.GetJson({
            url: "basic/contactgroups/getMemberReport",
            data: {
                token: Iptools.DEFAULTS.token,
                contactgroupId: Iptools.DEFAULTS.currentViewValue
            }
        }).done(function (r) {
            if (r && r.series && r.series.length && r.total) {
                hcThemes.changeTheme({
                    type: "ipCusLight"
                });
                $("#g_member_report").highcharts({
                    chart: {
                        type: 'column'
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
                    'class="emptyImg" style="width:150px;"><span>暂无统计数据</span></div>';
                $("#g_member_report").css("position", "relative").html($(emptyHtml).css({
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translateX(-50%) translateY(-60%)"
                }));
            }
        });
    },
    _enableContactSelect: function () {
        widget._addEventListener({
            container: "body",
            target: "#add_member_select",
            type: "click",
            event: function () {
                var me = $(this);
                me.closest(".btn-group").find("button").addClass("no-events").button("loading");
                var ids = $("#addMemberList").data("stable")._getChecks();
                if (ids && ids.length) {
                    Iptools.PostJson({
                        url: "basic/linkContactgroup",
                        data: {
                            token: Iptools.DEFAULTS.token,
                            contactgroupId: Iptools.DEFAULTS.currentViewValue,
                            contactIds: ids.join()
                        }
                    }).done(function () {
                        me.closest(".btn-group").find("button").removeClass("no-events").button("reset");
                        $("#selectMemberModal").modal("hide");
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "添加完成"
                        });
                        $(widget._UIDEFAULFS.ml).data("stable")._refresh();
                        widget._setGroupReport();
                    });
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "未选择"
                    });
                    me.closest(".btn-group").find("button").removeClass("no-events").button("reset");
                }
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#add_member_all",
            type: "click",
            event: function () {
                var me = $(this);
                me.closest(".btn-group").find("button").addClass("no-events").button("loading");
                var data = {
                    applet: widget._UIDEFAULFS.searchListApplet
                }, condition = $("#addMemberList").data("stable")._getCondition();
                if (condition != "") {
                    data["condition"] = condition;
                }
                Iptools.uidataTool._getAppletColumnValueList(data).done(function (rs) {
                    if (rs && rs.ids && rs.ids.length) {
                        Iptools.PostJson({
                            url: "basic/linkContactgroup",
                            data: {
                                token: Iptools.DEFAULTS.token,
                                contactgroupId: Iptools.DEFAULTS.currentViewValue,
                                contactIds: rs.ids.join()
                            }
                        }).done(function () {
                            me.closest(".btn-group").find("button").removeClass("no-events").button("reset");
                            $("#selectMemberModal").modal("hide");
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "添加完成"
                            });
                            $(widget._UIDEFAULFS.ml).data("stable")._refresh();
                            widget._setGroupReport();
                        });
                    } else {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "无筛选数据"
                        });
                    }
                    me.closest(".btn-group").find("button").removeClass("no-events").button("reset");
                });
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#taskModal",
            type: "hide.bs.modal",
            event: function () {
                try {
                    $("#taskName").val("");
                    $("#taskStatus").val("");
                    $("#endTime").val("");
                    $("#taskDes").val("");
                    $("#taskType").val("");
                    $("#taskAssign").val("").data("key", "");
                    $("#task-form").show();
                    $("#task_assign_search_list").hide();
                    $("#taskModal .modal-dialog").css("max-width", "500px");
                    $("#taskModal .modal-footer button").show();
                    $("#taskModal .modal-footer button.search-list").hide();
                    $("#task-form").data("bootstrapValidator").resetForm();
                } catch (e) { }
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#taskModal",
            type: "show.bs.modal",
            event: function () {
                $("#select_count").html(widget._UIDEFAULFS.selectIds.length);
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#task_assign_search",
            type: "click",
            event: function () {
                $("#task_assign_search_list").loading();
                $("#task-form").hide();
                $("#task_assign_search_list").show();
                $("#taskModal .modal-dialog").css("max-width", "");
                $("#taskModal .modal-footer button").hide();
                $("#taskModal .modal-footer button.search-list").show();
                Iptools.uidataTool._getCustomizeApplet({
                    nameList: "'employee_search_list'"
                }).done(function (s) {
                    if (s && s.applets && s.applets.length) {
                        component._table("#task_assign_search_list", {
                            applet: s.applets[0].applet,
                            checkType: "radio"
                        });
                    }
                });
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#task_assign_select",
            type: "click",
            event: function () {
                var od = $("#task_assign_search_list").data("stable")._getRadio();
                if (od && od.id) {
                    $("#taskAssign").data("key", od.id);
                    $("#taskAssign").val(od.name);
                    $("#task-form").show();
                    $("#task_assign_search_list").hide();
                    $("#taskModal .modal-dialog").css("max-width", "500px");
                    $("#taskModal .modal-footer button").show();
                    $("#taskModal .modal-footer button.search-list").hide();
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "未选择数据"
                    });
                }
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#task_assign_cancel",
            type: "click",
            event: function () {
                $("#task-form").show();
                $("#task_assign_search_list").hide();
                $("#taskModal .modal-dialog").css("max-width", "500px");
                $("#taskModal .modal-footer button").show();
                $("#taskModal .modal-footer button.search-list").hide();
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#task_Submit",
            type: "click",
            event: function () {
                var me = $(this);
                $("#task-form").bootstrapValidator('validate');
                if ($("#task-form").data("bootstrapValidator").isValid()) {
                    me.addClass("no-events").button('loading');
                    var data = {
                        token: Iptools.DEFAULTS.token,
                        contactgroupId: Iptools.DEFAULTS.currentViewValue,
                        taskStatus: $("#taskStatus").val(),
                        taskName: $("#taskName").val(),
                        endTime: $("#endTime").val(),
                        taskDes: $("#taskDes").val(),
                        taskType: $("#taskType").val(),
                        linkIds: widget._UIDEFAULFS.selectIds.join()
                    }
                    if (Iptools.Tool._checkNull($("#taskAssign").data("key"))) {
                        data["taskAssign"] = $("#taskAssign").data("key");
                    }
                    Iptools.PostJson({
                        url: "basic/contactgroups/createStaticGroupTask",
                        data: data
                    }).done(function () {
                        me.removeClass("no-events").button('reset');
                        $("#taskModal").modal("hide");
                        $(widget._UIDEFAULFS.ml).data("stable")._refresh();
                        widget._setGroupReport();
                    });
                }
            }
        });
    }
}