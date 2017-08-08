//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :contactGroupList
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
        mainPanel: "#mainList",
        gLinkApplet: 0,
        data: {},
        nCons: {},
        tCons: {},
        groupSelected: "static"
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
        widget.enableFormSubmit();
        widget.enableFormCreate();
        widget.enableCreateModalClose();
        widget.enableConTypeClick();
        widget.enableConAdd();
        widget.enableConRemove();
        widget.enableConTrigger();
        widget.enableTagMove();
        widget.enableGroupTypeChange();
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._setList();
        widget._setCreateValidation();
        widget._setConColumns();
        widget._setTags();
    },
    _setList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contactgroup','contact_group_linkcontact_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                widget._UIDEFAULFS.gLinkApplet = r.applets[1].applet;
                component._table(widget._UIDEFAULFS.mainPanel, {
                    pageNow: 1,
                    pageSize: 10,
                    applet: r.applets[0].applet,
                    showChecks: false,
                    emptyText: "客户还没有被分群管理",
                    jumpType: "template",
                    jumpTemplate: "<a class='g-v-link' title='查看客户群画像'><span class='fa fa-edit'></span></a>",
                    events: [{
                        target: ".s-header-bar .s-manage .add-group",
                        type: "click",
                        event: function () {
                            $("#createModal").modal("show");
                        }
                    }, {
                        target: ".s-cell .g-v-link",
                        type: "click",
                        event: function () {
                            var me = $(this);
                            var index = parseInt(me.closest(".s-cell").attr("data-index"));
                            var type = $(widget._UIDEFAULFS.mainPanel).data("stable").options.data.records[index]["contactgroup:contact_group_type"];
                            if (type) type = type["id"];
                            var title = $(widget._UIDEFAULFS.mainPanel).data("stable").options.data.records[index]["contactgroup:title_original"];
                            var id = $(widget._UIDEFAULFS.mainPanel).data("stable").options.data.records[index]["contactgroup:id"];
                            var nl;
                            if (type == "dynamic") {
                                nl = "'dynamic_contact_group_view'";
                            } else {
                                nl = "'static_contact_group_view'";
                            }
                            Iptools.uidataTool._getCustomizeView({
                                nameList: nl
                            }).done(function (v) {
                                if (v && v.views && v.views.length) {
                                    Iptools.uidataTool._getView({
                                        view: v.views[0].view,
                                    }).done(function (data) {
                                        Iptools.Tool._jumpView({
                                            view: v.views[0].view,
                                            valueId: id,
                                            name: data.view.name + "->" + title,
                                            type: data.view.type,
                                            primary: data.view.primary,
                                            icon: data.view.icon,
                                            url: data.view.url,
                                            bread: true,
                                        });
                                    });
                                }
                            });
                        }
                    }],
                    dataModify: function (rs) {
                        var promise = $.Deferred();
                        if (rs) {
                            if (rs.columns && rs.columns.length) {
                                rs.columns.splice(2, 0, {
                                    type: "text",
                                    column: rs.rootLink + ":contactCount",
                                    name: "人数",
                                });
                                if (rs.data && rs.data.records && rs.data.records.length) {
                                    for (var i = 0; i < rs.data.records.length; i++) {
                                        var rec = rs.data.records[i];
                                        rec[rs.rootLink + ":contactCount"] = "<span class='fa fa-spin fa-spinner groupCount'></span>";
                                        rec[rs.rootLink + ":title_original"] = rec[rs.rootLink + ":title"];
                                        rec[rs.rootLink + ":title"] = "<a class='g-v-link'>" + rec[rs.rootLink + ":title"] + "</a>";
                                    }
                                }
                            }
                        }
                        promise.resolve(rs);
                        return promise;
                    },
                    afterLoad: function () {
                        var counts = $(widget._UIDEFAULFS.mainPanel + " .s-table .s-column span.groupCount");
                        counts.each(function (key, obj) {
                            var data = $(widget._UIDEFAULFS.mainPanel).data("stable").options.data.records[$(obj).closest(".s-cell").attr("data-index")];
                            if (data["contactgroup:contact_group_type"] && data["contactgroup:contact_group_type"]["id"] == "dynamic") {
                                Iptools.uidataTool._getUserlistAppletData({
                                    appletId: data["contactgroup:dataset_applet_id"],
                                    pageNow: 1,
                                    pageSize: 1
                                }).done(function (s) {
                                    if (s) {
                                        var count = s.data ? s.data.rowCount : 0;
                                        $(obj).before(count);
                                        $(obj).remove();
                                    }
                                }).fail(function () {
                                    $(obj).before(0);
                                    $(obj).remove();
                                });
                            } else {
                                Iptools.uidataTool._getUserlistAppletData({
                                    appletId: widget._UIDEFAULFS.gLinkApplet,
                                    pageNow: 1,
                                    pageSize: 1,
                                    condition: JSON.stringify({
                                        "contactlinkgroup:groupid": "=" + data["contactgroup:id"],
                                    })
                                }).done(function (s) {
                                    if (s) {
                                        var count = s.data ? s.data.rowCount : 0;
                                        $(obj).before(count);
                                        $(obj).remove();
                                    }
                                }).fail(function () {
                                    $(obj).before(0);
                                    $(obj).remove();
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    _setCreateValidation: function () {
        $("#dynamic_form").bootstrapValidator({
            fields: {
                group_name: {
                    validators: {
                        notEmpty: {
                            message: '请填写群名称'
                        }
                    }
                },
                group_by: {
                    validators: {
                        notEmpty: {
                            message: '请选择分组依据'
                        }
                    }
                },
                group_des: {
                    validators: {
                        notEmpty: {
                            message: '请填写群描述'
                        }
                    }
                }
            }
        });
    },
    _clearConditions: function () {
        $("#group_rule_container").hide();
        $("input[name='con-type']").eq(0).prop("checked", true);
        $("#g_con_list").empty();
        widget._UIDEFAULFS.nCons = {};
    },
    _setConColumns: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_group_dataset_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                Iptools.uidataTool._getUserlistAppletData({
                    appletId: r.applets[0].applet
                }).done(function (s) {
                    if (s && s.data && s.data.records && s.data.records.length) {
                        for (var i = 0; i < s.data.records.length; i++) {
                            var od = s.data.records[i];
                            if (od && od["group_dataset:group_reason"]) {
                                $("#group_reason").append("<option value='" + od["group_dataset:group_reason"]["id"] + "'>"
                                    + od["group_dataset:group_reason"]["name"] + "</option>");
                            }
                        }
                    }
                });
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#group_reason",
            type: "change",
            event: function () {
                var me = $(this);
                widget._clearConditions();
                $("#rule_header").append("<span class='fa fa-spin fa-spinner loading'></span>");
                if (me.val() != "") {
                    Iptools.GetJson({
                        url: "basic/contactgroups/getDataSetByGroupReason",
                        data: {
                            token: Iptools.DEFAULTS.token,
                            groupReason: me.val()
                        }
                    }).done(function (r) {
                        if (r) {
                            Iptools.uidataTool._getApplet({
                                applet: r.appletId
                            }).done(function (s) {
                                if (s && s.columns && s.columns.length) {
                                    var cols = [];
                                    for (var i = 0; i < s.columns.length; i++) {
                                        var col = s.columns[i];
                                        if (col.allowInnerQuery) {
                                            cols.push(col);
                                        }
                                    }
                                    widget._UIDEFAULFS.columns = cols;
                                    $("#rule_header").find(".loading").remove();
                                    $("#group_rule_container").show();
                                } else {
                                    $("#rule_header").find(".loading").remove();
                                }
                            });
                        } else {
                            $("#rule_header").find(".loading").remove();
                        }
                    }).fail(function () {
                        $("#rule_header").find(".loading").remove();
                    });
                } else {
                    $("#rule_header").find(".loading").remove();
                }
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
                $("#g-tag .tag-source").empty().append("<p>可选标签</p>");
                for (var i = 0; i < r.length; i++) {
                    var sp = document.createElement("span");
                    $(sp).addClass("tag-item").append($("<span class='text'>" + r[i].tagValue + "</span>"))
                        .data("key", r[i].id).data("val", r[i].tagValue).attr("data-key", r[i].id);
                    $("#g-tag .tag-source").append(sp);
                }
            }
        });
    },
    enableFormSubmit: function () {
        widget._addEventListener({
            container: "body",
            target: "#create_form",
            type: "submit",
            event: function () {
                $(".group-create").trigger("click");
                return false;
            }
        });
    },
    enableFormCreate: function () {
        widget._addEventListener({
            container: "body",
            target: "#dynamic_create",
            type: "click",
            event: function () {
                $("#dynamic_form").bootstrapValidator('validate');
                if ($("#dynamic_form").data("bootstrapValidator").isValid()) {
                    var btn = $(this);
                    btn.addClass("no-events").button("loading");
                    //create
                    Iptools.PostJson({
                        url: "basic/contactgroups/createByDataSet",
                        data: {
                            token: Iptools.DEFAULTS.token,
                            groupName: $("#groupName").val(),
                            groupReason: $("#group_reason").val(),
                            groupType: "dynamic",
                            description: $("#groupDes").val(),
                            queryType: $("#g-rule .con-type input[name='con-type']:eq(0)").prop("checked") ? "and" : "or",
                            condition: JSON.stringify(widget._UIDEFAULFS.nCons)
                        }
                    }).done(function (r) {
                        if (r) {
                            btn.removeClass("no-events").button("loading");
                            $("#autoModal").modal("hide");
                            $(widget._UIDEFAULFS.mainPanel).data("stable")._refresh();
                        }
                    });
                }
                return false;
            }
        });
    },
    enableCreateModalClose: function () {
        widget._addEventListener({
            container: "body",
            target: "#newModal",
            type: "hide.bs.modal",
            event: function () {
                $("#group_name").val("");
                $("#group_by").val("");
                $("#group_des").val("");
                $("#create_form").data("bootstrapValidator").resetForm();
                widget._UIDEFAULFS.nCons = {};
                $("#g_con_list").empty();
                $("#g-tag .tag-sel .tag-item").remove();
                $("#g-tag .tag-source .tag-item").show();
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
                $(dp).find("button").html(me.text() + " <span class='caret'></span>").data("data", data);
                var dc = me.parents(".g-con-group:first");
                delete widget._UIDEFAULFS.nCons[data.column];
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
                delete widget._UIDEFAULFS.nCons[data.column];
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
                                    delete widget._UIDEFAULFS.nCons[data.column];
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
                                    delete widget._UIDEFAULFS.nCons[data.column];
                                }
                                break;
                        }
                    } else {
                        delete widget._UIDEFAULFS.nCons[data.column];
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
                                    delete widget._UIDEFAULFS.nCons[data.column];
                                }
                                break;
                        }
                    } else {
                        delete widget._UIDEFAULFS.nCons[data.column];
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
                    delete widget._UIDEFAULFS.nCons[ctb.data('data').column];
                }
                $(gc).parent().remove();
            }
        });
    },
    enableTagMove: function () {
        widget._addEventListener({
            container: "body",
            target: ".tag-source .tag-item",
            type: "click",
            event: function () {
                var me = $(this);
                me.hide();
                var sp = document.createElement("span");
                $(sp).addClass("tag-item").append("<span class='text'>" + me.data("val") + "</span>",
                    $("<span></span>").addClass("remove fa fa-remove").data("key", me.data("key")));
                $("#g-tag .tag-sel").append(sp);
                widget._UIDEFAULFS.tCons[me.data("key")] = {
                    key: me.data("key"),
                    val: me.data("val")
                };
            }
        });
        widget._addEventListener({
            container: "body",
            target: ".tag-sel span.remove",
            type: "click",
            event: function () {
                var me = $(this);
                $(".tag-source .tag-item[data-key=" + me.data("key") + "]").show();
                delete widget._UIDEFAULFS.tCons[me.data("key")];
                me.parent().remove();
            }
        });
    },
    enableGroupTypeChange: function () {
        widget._addEventListener({
            container: "body",
            target: "#createModal .type-item",
            type: "click",
            event: function () {
                var me = $(this);
                me.addClass("selected").siblings(".type-item").removeClass("selected");
                widget._UIDEFAULFS.groupSelected = me.attr('data-type');
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#createModal #create_next_step",
            type: "click",
            event: function () {
                $("#createModal").modal("hide");
                if (widget._UIDEFAULFS.groupSelected == "static") {
                    $("#staticModal").modal("show");
                } else {
                    $("#autoModal").modal("show");
                }
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#staticModal",
            type: "show.bs.modal",
            event: function () {
                Iptools.uidataTool._getCustomizeApplet({
                    nameList: "'static_new_contact_group'"
                }).done(function (r) {
                    if (r && r.applets && r.applets.length) {
                        component._unit("#static_new", {
                            applet: r.applets[0].applet,
                            mode: "new",
                            beforeSave: function (data) {
                                var promise = $.Deferred();
                                data["contactgroup:contact_group_type"] = "static";
                                promise.resolve(data);
                                return promise;
                            },
                            afterSave: function () {
                                var promise = $.Deferred();
                                $("#staticModal").modal("hide");
                                $(widget._UIDEFAULFS.mainPanel).data("stable")._refresh();
                                promise.resolve();
                                return promise;
                            }
                        });
                    }
                });
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#autoModal",
            type: "hidden.bs.modal",
            event: function () {
                widget._clearConditions();
                $("#dynamic_form input").val("");
                $("#dynamic_form select").val("");
                $("#dynamic_form textarea").val("");
                $("#dynamic_form").data("bootstrapValidator").resetForm();
            }
        });
        widget._addEventListener({
            container: "body",
            target: "#static_new_confirm",
            type: "click",
            event: function () {
                var me = $(this);
                if ($("#static_new").data("unit")) {
                    $("#static_new").data("unit")._save(me);
                }
            }
        });
    },
}