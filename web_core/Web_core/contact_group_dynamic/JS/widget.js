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
        sl: "#g_static_group_list",
        columns: [],
        nCons: {}
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
        widget.enableConUpdate();
        widget.enableReportSelectChange();
        widget.enableCreateStaticGroup();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setValidator();
        widget._setGroupInfo();
    },
    _setValidator: function () {
        $("#static-group-form").bootstrapValidator({
            fields: {
                sgName: {
                    validators: {
                        notEmpty: {
                            message: '请填写群名称'
                        }
                    }
                },
                sgDes: {
                    validators: {
                        notEmpty: {
                            message: '请填写客群描述'
                        }
                    }
                },
                sgType: {
                    validators: {
                        notEmpty: {
                            message: '请选择目标客户'
                        }
                    }
                },
            }
        });
    },
    _setGroupInfo: function () {
        $(".g-con-add a").addClass("no-events").append("<span class='fa fa-spin fa-spinner loading'></span>");
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_group_detail','applet_to_report_list','contact-group-static-list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                component._panel(widget._UIDEFAULFS.gm, {
                    applet: r.applets[0].applet,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                    afterLoad: function () {
                        var applet = $(widget._UIDEFAULFS.gm).data("panel").options.DataOriginalSets["contactgroup:dataset_applet_id"];
                        widget._UIDEFAULFS.mainMemberListApplet = applet;
                        component._table(widget._UIDEFAULFS.ml, {
                            applet: applet,
                            groupBtnName: "创建静态客户群",
                            afterLoad: function () {
                                var s = $(widget._UIDEFAULFS.ml).data("stable").options;
                                if (s && s.columns && s.columns.length) {
                                    var cols = [];
                                    for (var i = 0; i < s.columns.length; i++) {
                                        var col = s.columns[i];
                                        if (col.allowInnerQuery) {
                                            cols.push(col);
                                        }
                                    }
                                    widget._UIDEFAULFS.columns = cols;
                                    widget._setConditions();
                                    $(".g-con-add a").removeClass("no-events").find(".loading").remove();
                                }
                                if (s.appletData.innerConditionOperator == "and") {
                                    $("#g-rule .con-type input[name='con-type']:eq(0)").prop("checked", true);
                                } else if (s.appletData.innerConditionOperator == "or") {
                                    $("#g-rule .con-type input[name='con-type']:eq(1)").prop("checked", true);
                                }
                                $("#report_panel").loading();
                                Iptools.uidataTool._getUserlistAppletData({
                                    appletId: r.applets[1].applet,
                                    condition: JSON.stringify({
                                        "applet_to_report:applet_id": " = '" + applet + "'"
                                    })
                                }).done(function (rs) {
                                    $("#report_select").empty();
                                    if (rs && rs.data && rs.data.records && rs.data.records.length) {
                                        for (var n = 0; n < rs.data.records.length; n++) {
                                            var ods = rs.data.records[n];
                                            $("#report_select").append("<option value='" + ods[rs.rootLink + ":report_id"] + "'>"
                                                + ods[rs.rootLink + ":report_name"] + "</option>");
                                            $("#report_select").trigger("change");
                                        }
                                    }
                                    $("#report_select").append("<option value='bMap'>热力分布</option>");
                                });
                            },
                            events: [
                                {
                                    target: ".s-header-bar .s-manage .csg-select",
                                    type: "click",
                                    event: function () {
                                        widget._UIDEFAULFS.selectIds = $(widget._UIDEFAULFS.ml).data("stable")._getChecks();
                                        $("#static-g-Modal").modal("show");
                                    }
                                }, {
                                    target: ".s-header-bar .s-manage .csg-all",
                                    type: "click",
                                    event: function () {
                                        var me = $(this);
                                        me.closest(".s-manage-group").find("button").addClass("no-events").button("loading");
                                        var data = {
                                            applet: applet
                                        }, condition = $(widget._UIDEFAULFS.ml).data("stable")._getCondition();
                                        if (condition != "") {
                                            data["condition"] = condition;
                                        }
                                        Iptools.uidataTool._getAppletColumnValueList(data).done(function (rs) {
                                            if (rs && rs.ids && rs.ids.length) {
                                                widget._UIDEFAULFS.selectIds = rs.ids;
                                                $("#static-g-Modal").modal("show");
                                            } else {
                                                Iptools.Tool.pAlert({
                                                    title: "系统提示",
                                                    content: "无筛选数据"
                                                });
                                            }
                                            me.closest(".s-manage-group").find("button").removeClass("no-events").button("reset");
                                        });
                                    }
                                }
                            ],
                            multiPanel: true,
                            panels: [{
                                name: "分析",
                                icon: "fa fa-pie-chart",
                                container: "g_analysis",
                                onShow: function () {
                                    try {
                                        $("#report_panel").highcharts().reflow();
                                    } catch (e) {
                                    }
                                }
                            }]
                        });
                    }
                });
                component._table(widget._UIDEFAULFS.sl, {
                    applet: r.applets[2].applet,
                    condition: {
                        "contactgroup:from_contact_group_id": " = " + Iptools.DEFAULTS.currentViewValue
                    },
                    showChecks: false,
                    jumpType: "template",
                    jumpTemplate: "<a class='d-v-link' title='查看'><span class='fa fa-edit'></span></a>",
                });
            }
        });
    },
    _setConditions: function () {
        widget._UIDEFAULFS.nCons = {};
        $("#g_con_list").empty();
        for (var c = 0; c < widget._UIDEFAULFS.columns.length; c++) {
            var con = widget._UIDEFAULFS.columns[c];
            if (con.allowInnerQuery && Iptools.Tool._checkNull(con.innerQueryFormula)) {
                widget._UIDEFAULFS.nCons[con.column] = con.innerQueryFormula;
                var li = document.createElement("li");
                var d = document.createElement("div");
                $(d).addClass("g-con-group");
                var dc = document.createElement("div");
                $(dc).addClass("dropdown p-col-container border");
                var ulf = document.createElement("ul");
                $(ulf).addClass("dropdown-menu");
                var columns = widget._UIDEFAULFS.columns;
                if (columns && columns.length) {
                    for (var i = 0; i < columns.length; i++) {
                        var col = columns[i];
                        $(ulf).append($("<li></li>").append($("<a class='con-col'>" + col["name"] + "</a>").data("data", col)));
                    }
                }
                $(dc).append($("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                    "aria-expanded='false'>" + con.name + " <span class='caret'></span></button>").data("data", con), ulf);
                $(d).append(dc);
                var dpt = document.createElement("div");
                $(dpt).addClass("dropdown p-type-container");
                var ulc = document.createElement("ul");
                $(ulc).addClass("dropdown-menu");
                $(ulc).append($("<li></li>").append($("<a class='p-con-type'>等于</a>").data("type", "equal")),
                    $("<li></li>").append($("<a class='p-con-type'>为空</a>").data("type", "isnull")),
                    $("<li></li>").append($("<a class='p-con-type'>不为空</a>").data("type", "isnotnull"))).data("data", con);
                if (con && con["type"] != "select") {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>大于</a>").data("type", "bigger")),
                        $("<li></li>").append($("<a class='p-con-type'>小于</a>").data("type", "smaller")),
                        $("<li></li>").append($("<a class='p-con-type'>大于等于</a>").data("type", "ebigger")),
                        $("<li></li>").append($("<a class='p-con-type'>小于等于</a>").data("type", "esmaller")));
                }
                if (con && con["type"] == "text") {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>LIKE</a>").data("type", "like")));
                } else if (con && (con["type"] == "int")) {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between")));
                } else if (con && (con["type"] == "date" || con["type"] == "time")) {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between")),
                        $("<li></li>").append($("<a class='p-con-type'>相对大于</a>").data("type", "rbigger")),
                        $("<li></li>").append($("<a class='p-con-type'>相对小于</a>").data("type", "rsmaller")),
                        $("<li></li>").append($("<a class='p-con-type'>相对区间</a>").data("type", "rbetween")),
                        $("<li></li>").append($("<a class='p-con-type'>本周</a>").data("type", "n_week")),
                        $("<li></li>").append($("<a class='p-con-type'>本月</a>").data("type", "n_month")),
                        $("<li></li>").append($("<a class='p-con-type'>本年</a>").data("type", "n_year")));
                }
                var type = widget._getConditionType(con.innerQueryFormula);
                $(dpt).append($("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                    "aria-expanded='false'>" + type.name + " <span class='caret'></span></button>").data("data", con).data("type", type.type), ulc);
                $(d).append(dpt);
                //value
                var dv = document.createElement("div");
                $(dv).addClass("p-value-container");
                if (type.type != "isnull" && type.type != "isnotnull" && type.type != "n_week" && type.type != "n_month" && type.type != "n_year") {
                    $(dpt).addClass("border");
                    switch (con.type) {
                        case "int":
                            if (type.type != "between") {
                                $(dv).append("<input class='form-control' type='number' value='" + parseInt(type.vl) + "' />");
                            } else {
                                $(dv).append("<input class='form-control small' type='number' value='" + parseInt(type.vl) + "' />" +
                                    " - <input class='form-control small' type='number' value='" + parseInt(type.vh) + "' />");
                            }
                            break;
                        case "text":
                            $(dv).append("<input class='form-control' type='text' value='" + type.vl + "' />");
                            break;
                        case "select":
                            var sl = document.createElement("select");
                            $(sl).addClass("form-control");
                            $(sl).append("<option value=''>请选择...</option>");
                            if (con["pickList"] && con["pickList"].length) {
                                for (var p = 0; p < con["pickList"].length; p++) {
                                    var opt = con["pickList"][p];
                                    $(sl).append("<option value='" + opt["id"] + "'>" + opt["name"] + "</option>");
                                }
                                $(sl).val(type.vl);
                            }
                            $(dv).append(sl);
                            break;
                        case "date":
                        case "time":
                            if (type.type == "between") {
                                $(dv).append("<input class='form-control datepicker' type='text' placeholder='请选择开始日期' value='" + type.vl + "' />" +
                                    " - <input class='form-control datepicker' type='text' placeholder='请选择结束日期' value='" + type.vh + "' />");
                            } else if (type.type == "rbetween") {
                                $(dv).append("<input class='form-control small stext' type='number'  value='" + parseInt(type.vl) + "'/>",
                                    $("<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>").val(type.vlt),
                                    " - <input class='form-control small stext' type='number'  value='" + parseInt(type.vh) + "'/>",
                                    $("<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>").val(type.vht));
                            } else if (type.type == "rbigger") {
                                $(dv).append("<input class='form-control small stext' type='number'  value='" + parseInt(type.vl) + "' />",
                                    $("<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>").val(type.vlt));
                            } else if (type.type == "rsmaller") {
                                $(dv).append("<input class='form-control small stext' type='number'  value='" + parseInt(type.vl) + "' />",
                                    $("<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>").val(type.vlt));
                            } else {
                                $(dv).append("<input class='form-control datepicker' type='text' placeholder='请选择日期'  value='" + type.vl + "' />");
                            }
                            if (con.type == "date") {
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
                                    format: "yyyy-mm-dd hh:ii:ss",
                                    autoclose: true,
                                    todayBtn: true,
                                    language: "zh-CN",
                                }).on('hide', function (e) {
                                    e = e || event;
                                    event.preventDefault();
                                    e.stopPropagation();
                                    $(dv).find(".datepicker").trigger("blur");
                                });
                            }
                            break;
                    }
                    $(d).append(dv);
                }
                $(li).append(d, "<span class='fa fa-minus-circle con-remove'></span>");
                $("#g_con_list").append(li);
            }
        }
    },
    _getConditionType: function (formula) {
        var type = {
            type: "",
            name: "判断"
        };
        var vlt = "", vht = "", vl = "", vh = "";
        if (formula.indexOf("> {") != -1) {
            if (formula.indexOf("+") != -1) {
                vlt = formula.substring(formula.indexOf("{") + 1, formula.indexOf("+"));
                vl = formula.substring(formula.indexOf("+"), formula.indexOf("}"));
            } else {
                vlt = formula.substring(formula.indexOf("{") + 1, formula.indexOf("-"));
                vl = formula.substring(formula.indexOf("-"), formula.indexOf("}"));
            }
            type = {
                type: "rbigger",
                name: "相对大于",
                vlt: vlt,
                vl: vl
            };
        } else if (formula.indexOf("< {") != -1) {
            if (formula.indexOf("+") != -1) {
                vlt = formula.substring(formula.indexOf("{") + 1, formula.indexOf("+"));
                vl = formula.substring(formula.indexOf("+"), formula.indexOf("}"));
            } else {
                vlt = formula.substring(formula.indexOf("{") + 1, formula.indexOf("-"));
                vl = formula.substring(formula.indexOf("-"), formula.indexOf("}"));
            }
            type = {
                type: "rsmaller",
                name: "相对小于",
                vlt: vlt,
                vl: vl
            };
        } else if (formula.indexOf("between {") != -1) {
            if (formula.split("{")[1].indexOf("+") != -1) {
                vlt = formula.split("{")[1].substring(0, formula.split("{")[1].indexOf("+"));
                vl = formula.split("{")[1].substring(formula.split("{")[1].indexOf("+"), formula.split("{")[1].indexOf("}"));
            } else {
                vlt = formula.split("{")[1].substring(0, formula.split("{")[1].indexOf("-"));
                vl = formula.split("{")[1].substring(formula.split("{")[1].indexOf("-"), formula.split("{")[1].indexOf("}"));
            }
            if (formula.split("{")[2].indexOf("+") != -1) {
                vht = formula.split("{")[2].substring(0, formula.split("{")[2].indexOf("+"));
                vh = formula.split("{")[2].substring(formula.split("{")[2].indexOf("+"), formula.split("{")[2].indexOf("}"));
            } else {
                vht = formula.split("{")[2].substring(0, formula.split("{")[2].indexOf("-"));
                vh = formula.split("{")[2].substring(formula.split("{")[2].indexOf("-"), formula.split("{")[2].indexOf("}"));
            }
            type = {
                type: "rbetween",
                name: "相对区间",
                vlt: vlt,
                vl: vl,
                vht: vht,
                vh: vh
            };
        } else if (formula.indexOf("{n_week}") != -1) {
            type = {
                type: "n_week",
                name: "本周"
            };
        } else if (formula.indexOf("{n_month}") != -1) {
            type = {
                type: "n_month",
                name: "本月"
            };
        } else if (formula.indexOf("n_year") != -1) {
            type = {
                type: "n_year",
                name: "本年"
            };
        } else if (formula.indexOf(">=") != -1) {
            vl = formula.split("'")[1];
            type = {
                type: "ebigger",
                name: "大于等于",
                vl: vl
            };
        } else if (formula.indexOf("<=") != -1) {
            vl = formula.split("'")[1];
            type = {
                type: "esmaller",
                name: "小于等于",
                vl: vl
            };
        } else if (formula.indexOf(">") != -1) {
            vl = formula.split("'")[1];
            type = {
                type: "bigger",
                name: "大于",
                vl: vl
            };
        } else if (formula.indexOf("<") != -1) {
            vl = formula.split("'")[1];
            type = {
                type: "smaller",
                name: "小于",
                vl: vl
            };
        } else if (formula.indexOf("=") != -1) {
            vl = formula.split("'")[1];
            type = {
                type: "equal",
                name: "等于",
                vl: vl
            };
        } else if (formula.indexOf("is null") != -1) {
            type = {
                type: "isnull",
                name: "为空"
            };
        } else if (formula.indexOf("is not null") != -1) {
            type = {
                type: "isnotnull",
                name: "不为空"
            };
        } else if (formula.indexOf("like") != -1) {
            vl = formula.split("%")[1];
            type = {
                type: "like",
                name: "LIKE",
                vl: vl
            };
        } else if (formula.indexOf("between") != -1) {
            vl = formula.split("'")[1];
            vh = formula.split("'")[3];
            type = {
                type: "between",
                name: "区间",
                vl: vl,
                vh: vh
            };
        }
        return type;
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
            }
        });
    },
    enableConAdd: function () {
        widget._addEventListener({
            container: "body",
            target: ".g-con-add a",
            type: "click",
            event: function () {
                var li = document.createElement("li");
                var d = document.createElement("div");
                $(d).addClass("g-con-group");
                var dc = document.createElement("div");
                $(dc).addClass("dropdown p-col-container");
                var ulc = document.createElement("ul");
                $(ulc).addClass("dropdown-menu");
                var columns = widget._UIDEFAULFS.columns;
                if (columns && columns.length) {
                    for (var i = 0; i < columns.length; i++) {
                        var col = columns[i];
                        $(ulc).append($("<li></li>").append($("<a class='con-col'>" + col["name"] + "</a>").data("data", col)));
                    }
                }
                $(dc).append("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                    "aria-expanded='false'>属性 <span class='caret'></span></button>", ulc);
                $(li).append($(d).append(dc), "<span class='fa fa-minus-circle con-remove'></span>");
                $("#g_con_list").append(li);
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul ul li a.con-col",
            type: "click",
            event: function () {
                var me = $(this);
                var data = me.data("data");
                var dp = me.parents(".dropdown:first").addClass("border");
                if ($(dp).find("button").data("data")) {
                    widget._UIDEFAULFS.nCons[$(dp).find("button").data("data").column] = "";
                }
                $(dp).find("button").html(me.text() + " <span class='caret'></span>").data("data", data);
                var dc = me.parents(".g-con-group:first");
                widget._UIDEFAULFS.nCons[data.column] = "";
                $(dc).find(".p-type-container").remove();
                $(dc).find(".p-value-container").remove();
                var dpt = document.createElement("div");
                $(dpt).addClass("dropdown p-type-container");
                var ulc = document.createElement("ul");
                $(ulc).addClass("dropdown-menu");
                $(ulc).append($("<li></li>").append($("<a class='p-con-type'>等于</a>").data("type", "equal")),
                    $("<li></li>").append($("<a class='p-con-type'>为空</a>").data("type", "isnull")),
                    $("<li></li>").append($("<a class='p-con-type'>不为空</a>").data("type", "isnotnull"))).data("data", data);
                if (data && data["type"] != "select") {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>大于</a>").data("type", "bigger")),
                        $("<li></li>").append($("<a class='p-con-type'>小于</a>").data("type", "smaller")),
                        $("<li></li>").append($("<a class='p-con-type'>大于等于</a>").data("type", "ebigger")),
                        $("<li></li>").append($("<a class='p-con-type'>小于等于</a>").data("type", "esmaller")));
                }
                if (data && data["type"] == "text") {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>LIKE</a>").data("type", "like")));
                } else if (data && (data["type"] == "int")) {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between")));
                } else if (data && (data["type"] == "date" || data["type"] == "time")) {
                    $(ulc).append($("<li></li>").append($("<a class='p-con-type'>区间</a>").data("type", "between")),
                        $("<li></li>").append($("<a class='p-con-type'>相对大于</a>").data("type", "rbigger")),
                        $("<li></li>").append($("<a class='p-con-type'>相对小于</a>").data("type", "rsmaller")),
                        $("<li></li>").append($("<a class='p-con-type'>相对区间</a>").data("type", "rbetween")),
                        $("<li></li>").append($("<a class='p-con-type'>本周</a>").data("type", "n_week")),
                        $("<li></li>").append($("<a class='p-con-type'>本月</a>").data("type", "n_month")),
                        $("<li></li>").append($("<a class='p-con-type'>本年</a>").data("type", "n_year")));
                }
                $(dpt).append($("<button class='btn g-con-btn dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' " +
                    "aria-expanded='false'>判断 <span class='caret'></span></button>").data("data", data), ulc);
                $(dc).append(dpt);
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul ul li a.p-con-type",
            type: "click",
            event: function () {
                var me = $(this);
                var data = me.closest("ul").data("data");
                var dc = me.parents(".g-con-group:first");
                $(dc).find(".p-value-container").remove();
                widget._UIDEFAULFS.nCons[data.column] = "";
                var dp = me.parents(".dropdown:first");
                $(dp).find("button").html(me.text() + " <span class='caret'></span>").data("type", me.data("type"));
                var d = document.createElement("div");
                $(d).addClass("p-value-container");
                if (me.data("type") != "isnull" && me.data("type") != "isnotnull") {
                    dp.addClass("border");
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
                                    dp.removeClass("border");
                                    widget._UIDEFAULFS.nCons[data.column] = " {" + me.data("type") + "}";
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
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>" +
                                        " - <input class='form-control small stext' type='number' />" +
                                        "<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>");
                                } else if (me.data("type") == "rbigger") {
                                    $(d).append("<input class='form-control small stext' type='number' />" +
                                        "<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>");
                                } else if (me.data("type") == "rsmaller") {
                                    $(d).append("<input class='form-control small stext' type='number' />" +
                                        "<select class='form-control small stext'>" +
                                        "<option value='hour'>小时</option>" +
                                        "<option value='day'>日</option>" +
                                        "<option value='month'>月</option>" +
                                        "<option value='fdmonth'>月初</option>" +
                                        "<option value='ldmonth'>月末</option>" +
                                        "</select>");
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
                                        format: "yyyy-mm-dd hh:ii:ss",
                                        autoclose: true,
                                        todayBtn: true,
                                        language: "zh-CN",
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
                    $(dc).append(d);
                } else {
                    dp.removeClass("border");
                    if (me.data("type") == "isnull") {
                        widget._UIDEFAULFS.nCons[data.column] = " is null";
                    } else {
                        widget._UIDEFAULFS.nCons[data.column] = " is not null";
                    }
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
                var gc = me.parents(".g-con-group:first");
                var gv = me.parents(".p-value-container");
                var ctb = $(gc).find(".p-type-container button.g-con-btn");
                var data = $(ctb).data('data');
                if (data) {
                    if (me.val() != "") {
                        switch ($(ctb).data("type")) {
                            case "equal":
                                widget._UIDEFAULFS.nCons[data.column] = " = '" + me.val() + "'";
                                break;
                            case "bigger":
                                widget._UIDEFAULFS.nCons[data.column] = " > '" + me.val() + "'";
                                break;
                            case "smaller":
                                widget._UIDEFAULFS.nCons[data.column] = " < '" + me.val() + "'";
                                break;
                            case "ebigger":
                                widget._UIDEFAULFS.nCons[data.column] = " >= '" + me.val() + "'";
                                break;
                            case "esmaller":
                                widget._UIDEFAULFS.nCons[data.column] = " <= '" + me.val() + "'";
                                break;
                            case "like":
                                widget._UIDEFAULFS.nCons[data.column] = " like '%" + me.val() + "%'";
                                break;
                            case "between":
                                var vl = $(gv).find("input:eq(0)").val();
                                var vh = $(gv).find("input:eq(1)").val();
                                if (vl != "" && vh != "") {
                                    widget._UIDEFAULFS.nCons[data.column] = " between '" + vl + "' and '" + vh + "'";
                                } else {
                                    widget._UIDEFAULFS.nCons[data.column] = "";
                                }
                                break;
                            case "rbigger":
                                var rb = $(gv).find("select").val();
                                if (parseInt(me.val()) < 0) {
                                    widget._UIDEFAULFS.nCons[data.column] = " > {" + rb + me.val() + "}";
                                } else {
                                    widget._UIDEFAULFS.nCons[data.column] = " > {" + rb + "+" + me.val() + "}";
                                }
                                break;
                            case "rsmaller":
                                var rl = $(gv).find("select").val();
                                if (parseInt(me.val()) < 0) {
                                    widget._UIDEFAULFS.nCons[data.column] = " < {" + rl + me.val() + "}";
                                } else {
                                    widget._UIDEFAULFS.nCons[data.column] = " < {" + rl + "+" + me.val() + "}";
                                }
                                break;
                            case "rbetween":
                                var rbl = $(gv).find("select:eq(0)").val();
                                var rbh = $(gv).find("select:eq(1)").val();
                                var rbli = $(gv).find("input:eq(0)").val();
                                var rbhi = $(gv).find("input:eq(1)").val();
                                if (rbli != "" && rbhi != "") {
                                    if (parseInt(rbli) >= 0) {
                                        rbli = "+" + rbli;
                                    }
                                    if (parseInt(rbhi) >= 0) {
                                        rbhi = "+" + rbhi;
                                    }
                                    widget._UIDEFAULFS.nCons[data.column] = " between {" + rbl + rbli + "} and {" + rbh + rbhi + "}";
                                } else {
                                    widget._UIDEFAULFS.nCons[data.column] = "";
                                }
                                break;
                        }
                    } else {
                        widget._UIDEFAULFS.nCons[data.column] = "";
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
                var gc = me.parents(".g-con-group:first");
                var gv = me.parents(".p-value-container");
                var ctb = $(gc).find(".p-type-container button.g-con-btn");
                var data = $(ctb).data('data');
                if (data) {
                    if (me.val() != "") {
                        switch ($(ctb).data("type")) {
                            case "equal":
                                widget._UIDEFAULFS.nCons[data.column] = " = '" + me.val() + "'";
                                break;
                            case "rbigger":
                                var rbi = $(gv).find("input").val();
                                if (rbi != "") {
                                    if (parseInt(rbi) >= 0) {
                                        rbi = "+" + rbi;
                                    }
                                    widget._UIDEFAULFS.nCons[data.column] = " > {" + me.val() + rbi + "}";
                                }
                                break;
                            case "rsmaller":
                                var rsi = $(gv).find("input").val();
                                if (rsi != "") {
                                    if (parseInt(rsi) >= 0) {
                                        rsi = "+" + rsi;
                                    }
                                    widget._UIDEFAULFS.nCons[data.column] = " < {" + me.val() + rsi + "}";
                                }
                                break;
                            case "rbetween":
                                var rbl = $(gv).find("select:eq(0)").val();
                                var rbh = $(gv).find("select:eq(1)").val();
                                var rbli = $(gv).find("input:eq(0)").val();
                                var rbhi = $(gv).find("input:eq(1)").val();
                                if (rbli != "" && rbhi != "") {
                                    if (parseInt(rbli) >= 0) {
                                        rbli = "+" + rbli;
                                    }
                                    if (parseInt(rbhi) >= 0) {
                                        rbhi = "+" + rbhi;
                                    }
                                    widget._UIDEFAULFS.nCons[data.column] = " between {" + rbl + rbli + "} and {" + rbh + rbhi + "}";
                                } else {
                                    widget._UIDEFAULFS.nCons[data.column] = "";
                                }
                                break;
                        }
                    } else {
                        widget._UIDEFAULFS.nCons[data.column] = "";
                    }
                }
            }
        });
    },
    enableConRemove: function () {
        widget._addEventListener({
            container: "body",
            target: ".g-con-ul li span.con-remove",
            type: "click",
            event: function () {
                var me = $(this);
                var gc = me.siblings(".g-con-group:first");
                var ctb = $(gc).find(".p-type-container button.g-con-btn");
                if (ctb && ctb.data("data")) {
                    widget._UIDEFAULFS.nCons[ctb.data('data').column] = "";
                }
                $(gc).parent().remove();
            }
        });
    },
    enableConUpdate: function () {
        widget._addEventListener({
            container: "body",
            target: "#g_rule_submit",
            type: "click",
            event: function () {
                var me = $(this);
                me.addClass("no-events").button("loading");
                var data = {
                    token: Iptools.DEFAULTS.token,
                    valueId: Iptools.DEFAULTS.currentViewValue,
                    queryType: $("#g-rule .con-type input[name='con-type']:eq(0)").prop("checked") ? "and" : "or",
                    condition: JSON.stringify(widget._UIDEFAULFS.nCons)
                }
                Iptools.PutJson({
                    url: "basic/contactgroups/updateDataset",
                    data: data
                }).done(function () {
                    widget._setGroupInfo();
                    setTimeout(function () {
                        me.removeClass("no-events").button("reset");
                    }, 1000);
                });
            }
        });
    },
    enableReportSelectChange: function () {
        widget._addEventListener({
            container: "body",
            target: "#report_select",
            type: "change",
            event: function () {
                var me = $(this);
                $("#report_panel").loading();
                if (me.val() == "bMap") {
                    widget._setBMap();
                } else {
                    Iptools.uidataTool._buildReport({
                        applet: me.val(),
                        date: (new Date()).format("yyyyMMdd"),
                        timeType: "year",
                        showReport: true,
                        container: "report_panel"
                    });
                }
            }
        });
    },
    enableCreateStaticGroup: function () {
        widget._addEventListener({
            container: "body",
            target: "#create_static",
            type: "click",
            event: function () {
                var me = $(this);
                $("#static-group-form").bootstrapValidator('validate');
                if ($("#static-group-form").data("bootstrapValidator").isValid()) {
                    me.addClass("no-events").button("loading");
                    var data = {
                        token: Iptools.DEFAULTS.token,
                        groupId: Iptools.DEFAULTS.currentViewValue,
                        carIds: widget._UIDEFAULFS.selectIds.join(),
                        contactType: $("#sgType").val(),
                        name: $("#sgName").val(),
                        description: $("#sgDes").val()
                    }
                    Iptools.PostJson({
                        url: "basic/contactgroups/createStaticGroup",
                        data: data
                    }).done(function () {
                        me.removeClass("no-events").button("reset");
                        $("#static-g-Modal").modal("hide");
                        $(widget._UIDEFAULFS.sl).data("stable")._refresh();
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "创建完成"
                        });
                    });
                }
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#static-g-Modal",
            type: "hide.bs.modal",
            event: function () {
                $("#sgName").val("");
                $("#sgType").val("");
                $("#sgDes").val("");
                $("#static-group-form").data("bootstrapValidator").resetForm();
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#static-g-Modal",
            type: "show.bs.modal",
            event: function () {
                $("#select_count").html(widget._UIDEFAULFS.selectIds.length);
            }
        });
    },
    _setBMap: function () {
        var myGeo = new BMap.Geocoder();
        var lgt = [];
        Iptools.uidataTool._getAppletColumnValueList({
            applet: widget._UIDEFAULFS.mainMemberListApplet,
            column: "customer:customer_address",
            condition: JSON.stringify($(widget._UIDEFAULFS.ml).data("stable").options.condition)
        }).done(function (r) {
            if (r && r.ids && r.ids.length) {
                for (var i = 0; i < r.ids.length; i++) {
                    myGeo.getPoint(r.ids[i], function (point) {
                        if (point) {
                            lgt.push({
                                "lng": point.lng,
                                "lat": point.lat,
                                "count": 50
                            });
                        }
                    });
                }
                setTimeout(function () {
                    widget._setHeatMap(lgt);
                }, 1000);
            }
        });
    },
    _setHeatMap: function (points) {
        $("#report_panel").empty().append("<div id='bMap_container' style='height: 400px;'></div>");
        var map = new BMap.Map("bMap_container");// 创建地图实例
        var point = new BMap.Point(116.418261, 39.921984);
        map.centerAndZoom(point, 11);             // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom(); // 允许滚轮缩放
        if (!isSupportCanvas()) {
            alert('您当前浏览器不支持查看热力图');
        }
        heatmapOverlay = new BMapLib.HeatmapOverlay({"radius": 20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data: points, max: 100});

        function isSupportCanvas() {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        }
    }
}