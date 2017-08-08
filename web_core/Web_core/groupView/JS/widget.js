//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :dView
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
        mainPanel: "#mainArea",
        detailSearchPanle: "#modalList_body",
        detailSelectModal: "#detailControlSearchModal",
        searchForm: ".control-search-form",
        groupListForm: "groupListForm",
        groupListFormValidation: {},
        listSelectModal: "#listSelectButtonModal",
        listSelectPanle: "#selectList_body",
        defaultPicturePath: "Image/defaultHead.png",
        defaultWordPath: "Image/wordfile.jpg",
        defaultExcelPath: "Image/excelfile.jpg",
        defaultPPTPath: "Image/pptfile.jpg",
        defaultFilePath: "Image/fileadd.jpg",
        controlCalLinks: [],
        DataOriginalSets: {},
        DataCurrentSets: {},
        DataGroupSets: { New: [], Update: [], Delete: [] },
        DataGroupEditingStatus: false,
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
        widget._enablePickItemModal();
        widget._enableDetailSearchModalPick();
        widget._enableDetailSearchModalClear();
        widget._enableImageControl();
        widget._enableFileControl();
        widget._enableLightbox();
        widget._enablePaginationNext();
        widget._enablePaginationPre();
        widget._enablePaginationClick();
        widget._enableDataSave();
        widget._enableViewLink();
        widget._enableCheckboxAll(); //load checkbox all function
        widget._enableListItemClick(); //load row click of label list view
        widget._enableListItemCheckboxClick(); //load check box click of label list view
        widget._enableDataDelete(); //load json delete function
        widget._enableMainNewView(); //load data new view
        widget._enableListSelectModal();
        widget._enableListSelectModalPick();
        widget._enableListRemove();
        widget._enableControlSearchSubmit();
        widget._enableDateFormatProto();
        widget._enableControlChangeData();
        widget._enableListRefreshBtnClick(); //Refresh View Button Click
        widget._enableDebtsPaperBuilding();
        widget._enableDebtsListBuilding();
        widget._enableContactDataSave();
        widget._enableEditUnLock();
        widget._enableGroupListEditShow();
        widget._enableGroupListEditConfirm();
        widget._enableGroupListEditTrash();
        widget._enableGroupListEditRevert();
        widget._enableGroupListNewShow();
        widget._enableGroupListNewConfirm();
        widget._enableGroupListNewRemove();
        widget._enableGroupListNewTrash();
        widget._enableGroupDataSave();
        widget._enableGroupEditRevoke();
    },
    _bindingEventAfterLoad: function () {
        widget._enableTimeOrDateField();
        widget._enableControlCalLinkBinding();
        widget._enableSwitchControl();
        widget._enableRichTextArea();
    },
    _init: function () {
        //binding elements events before appending
        widget._bindingDomEvent();
        var options = {
            view: Iptools.DEFAULTS.currentView,
            valueId: Iptools.DEFAULTS.currentViewValue,
        };
        Iptools.uidataTool._getView({
            async: false,
            view: options.view,
        }, function (data) {
            options = Iptools.Tool._extend(options, {
                name: data.view.name,
                type: data.view.type,
                primary: data.view.primary,
                bread: true
            });
        });
        widget._initDetailApplet({
            viewId: options.view,
            appletId: options.primary,
            valueId: options.valueId,
            type: "primary",
            panel: ".group-section"
        });
        Iptools.DEFAULTS.currentViewApplet = options.primary;
        Iptools.setDefaults({ key: "currentViewApplet", value: options.primary });
        Iptools.uidataTool._getApplets({
            view: options.view,
            async: false
        }, function (ds) {
            $.each(ds.applets, function (key, obj) {
                if (obj.id != options.primary) {
                    if (obj.force) {
                        switch (obj.type) {
                            case "list":
                                widget._initListApplet({
                                    view: options.view,
                                    appletId: obj.id,
                                    valueId: options.valueId,
                                    pageNow: 1,
                                    pageSize: 500,
                                    condition: options.condition,
                                    orderByColumn: options.orderByColumn,
                                    orderByAscDesc: options.orderByAscDesc,
                                    type: "grouplist",
                                    panel: ".group-section .group-section-list"
                                });
                                break;
                            case "detail":
                                widget._initDetailApplet({
                                    view: options.view,
                                    appletId: obj.id,
                                    valueId: options.valueId,
                                    type: "groupdetail",
                                    panel: ".group-section .group-section-list"
                                });
                                break;
                        }
                    } else {
                        switch (obj.type) {
                            case "list":
                                widget._initListApplet({
                                    view: options.view,
                                    appletId: obj.id,
                                    valueId: options.valueId,
                                    pageNow: 1,
                                    pageSize: Iptools.DEFAULTS.pageSize,
                                    condition: options.condition,
                                    orderByColumn: options.orderByColumn,
                                    orderByAscDesc: options.orderByAscDesc,
                                    type: "extra",
                                    panel: ".group-extra-section"
                                });
                                break;
                            case "detail":
                                widget._initDetailApplet({
                                    view: options.view,
                                    appletId: obj.id,
                                    valueId: options.valueId,
                                    type: "extra",
                                    panel: ".group-extra-section"
                                });
                                break;
                        }
                    }
                }
            });
        });
        //after load binding events
        widget._bindingEventAfterLoad();
    },
    _initListApplet: function (options) {
        Iptools.uidataTool._getUserlistAppletData(Iptools.Tool._extend(options, { async: false }), function (ds) {
            if (ds.applet.type == "list") {
                $(options.panel).append(widget._setListAppletContent({
                    data: ds,
                    pageNow: 1,
                    condition: options.condition,
                    search: true,
                    panel: options.panel,
                    type: options.type,
                    container: Iptools.Tool._blank_replacement(ds.applet.name) + Math.floor(Math.random() * 10)
                }));
                $("#" + widget._UIDEFAULFS.groupListForm).bootstrapValidator({
                    fields: widget._UIDEFAULFS.groupListFormValidation
                });
            }
        });
    },
    _initDetailApplet: function (options) {
        Iptools.uidataTool._getUserDetailAppletData(Iptools.Tool._extend(options, { async: false }), function (ds) {
            if (ds.applet.type == "detail") {
                widget._setDetailAppletContent({
                    data: ds,
                    panel: options.panel,
                    type: options.type,
                    primaryKey: options.valueId,
                });
            }
        });
    },
    _setPanelHeader: function (options) {
        var nav = document.createElement("nav");
        $(nav).addClass("navbar navbar-default search-function-container");
        var dc = document.createElement("div");
        $(dc).addClass("container-fluid");
        var dn = document.createElement("div");
        $(dn).addClass("navbar-header");
        var btn = document.createElement("button");
        $(btn).addClass("navbar-toggle collapsed");
        $(btn).attr("type", "button");
        $(btn).attr("data-toggle", "collapse");
        $(btn).attr("data-target", "#nav_bar_" + options.data.applet.id);
        $(btn).attr("aria-expanded", "false");
        $(btn).append("<span class='sr-only'>Toggle</span>");
        $(btn).append("<span class='icon-bar'></span>");
        $(btn).append("<span class='icon-bar'></span>");
        $(btn).append("<span class='icon-bar'></span>");
        var at = document.createElement("a");
        $(at).addClass("navbar-brand");
        $(at).html(options.data.applet.displayName);
        $(dn).append(btn, at);
        var dcf = document.createElement("div");
        $(dcf).addClass("collapse navbar-collapse");
        $(dcf).attr("id", "nav_bar_" + options.data.applet.id);
        var ul = document.createElement("ul");
        $(ul).addClass("nav navbar-nav navbar-right button-nav");
        $(dcf).append(ul);
        $(dc).append(dn, dcf);
        $(nav).append(dc);
        return nav;
    },
    _setListAppletContent: function (options) {
        var listpanel = document.createElement("div");
        var header = widget._setPanelHeader(options);
        var mld;
        if (options.type == "grouplist") {
            mld = widget._setGroupListMainData(options);
        } else {
            mld = widget._setListAppletMainData(options);
        }
        var pagnav = "";
        if (options.type != "grouplist") {
            //init list records page guiding function and html
            var pagnode = widget._setListPaginationPanel({
                pageNow: options.pageNow,
                container: options.container,
                data: options.data,
                type: "label"
            });
            pagnav = document.createElement("nav");
            $(pagnav).attr("class", "text-center");
            $(pagnav).append(pagnode);
        }
        widget._setListButtonsPanel({
            applet: options.data.applet.id,
            condition: options.condition,
            type: options.type,
            container: options.container,
            holder: header,
        });
        if (options.type != "grouplist") {
            $(listpanel).append(header, mld);
        } else {
            $(listpanel).append(header, mld, pagnav);
        }
        return listpanel;
    },
    _setListAppletMainData: function (options) {
        var clickColumns = [];
        var clickColumnViews = [];
        var mld = document.createElement("div");
        $(mld).attr("id", options.container);
        $(mld).addClass("table-responsive");
        var tbl = document.createElement("table");
        $(tbl).addClass("table table-striped table-hover table-no-wrap");
        var th = document.createElement("thead");
        $(th).append("<tr><th style='text-align:center;width:50px;padding-top:5px;'><input type='checkbox' class='checkAll' /></th></tr>");
        var tbd = document.createElement("tbody");
        $.each(options.data.columns, function (key, obj) {
            if (Iptools.Tool._checkNull(obj.destinationView)) {
                clickColumns.push(obj.column);
                clickColumnViews.push(obj.destinationView);
            }
            if (obj.type != "hidden") {
                $(th).find("tr").append("<th>" + obj.name + "</th>");
            }
        });
        if (options.data.applet.isDetailView) {
            $(th).find("tr").append("<th>" + options.data.applet.detailColumnName + "</th>");
        }
        if (options.data.data && options.data.data.records) {
            $.each(options.data.data.records, function (key, obj) {
                var tempData;
                var tkey;
                var tr = document.createElement("tr");
                $(tr).addClass("hyperTr");
                var tdc = document.createElement("td");
                $(tdc).css({ "text-align": "center", "padding-top": "5px", "width": "50px" });
                var tdi = document.createElement("input");
                $(tdi).css("cursor", "pointer");
                $(tdi).attr("name", "list-item");
                $(tdi).attr("type", "checkbox");
                $(tdi).data("key", obj[options.data.rootLink + "_id"]);
                $(tdc).append(tdi);
                $(tr).append(tdc);
                for (var i = 0; i < options.data.columns.length; i++) {
                    if (options.data.columns[i].type != "hidden") {
                        var tdo = document.createElement("td");
                        var col = options.data.columns[i].column;
                        tempData = obj[col];
                        tempData = Iptools.Tool._checkNull(tempData) ? tempData : "";
                        if (options.data.columns[i].type == "rmb" && tempData != "") {
                            $(tdo).append("￥");
                        }
                        if (options.data.columns[i].type == "bool") {
                            tempData = tempData ? "是" : "否";
                        }
                        if (options.data.columns[i].type == "select" && Iptools.Tool._checkNull(options.data.columns[i].pickList)) {
                            for (var j = 0; j < options.data.columns[i].pickList.length; j++) {
                                if (options.data.columns[i].pickList[j].id == tempData) {
                                    tempData = options.data.columns[i].pickList[j].name;
                                    break;
                                }
                            }
                        }
                        if ($.inArray(col, clickColumns) != -1) {
                            var tdha = document.createElement("a");
                            $(tdha).css("cursor", "pointer");
                            $(tdha).attr("class", "hyperLinkAView");
                            if (typeof (tempData) == "object") {
                                $(tdha).attr("data-id", tempData["id"]);
                                for (tkey in tempData) {
                                    if (tkey != "id") {
                                        tempData = tempData[tkey];
                                    }
                                }
                            } else {
                                $(tdha).attr("data-id", obj[options.data.rootLink + "_id"]);
                            }
                            $(tdha).attr("data-key", clickColumnViews[$.inArray(col, clickColumns)]);
                            if (Iptools.Tool._checkNull(options.data.columns[i].hrefText) && Iptools.Tool._checkNull(tempData)) {
                                $(tdha).html(options.data.columns[i].hrefText);
                            } else {
                                $(tdha).html(tempData);
                            }
                            $(tdo).append(tdha);
                        } else {
                            if (typeof (tempData) == "object") {
                                for (tkey in tempData) {
                                    if (tkey != "id") {
                                        tempData = tempData[tkey];
                                    }
                                }
                            }
                            $(tdo).append(tempData);
                        }
                        if (options.data.columns[i].type == "percent" && tempData != "") {
                            $(tdo).append("%");
                        }
                        $(tr).append(tdo);
                    }
                }
                if (options.data.applet.isDetailView) {
                    $(tr).append("<td><a class='hyperLinkAView' style='cursor:pointer' data-id='" + obj[options.data.rootLink + "_id"]
                        + "' data-key='" + options.data.applet.detailViewId + "'>" + options.data.applet.detailHrefText + "</a></td>");
                }
                $(tbd).append(tr);
            });
        }
        $(tbl).append(th, tbd);
        $(mld).append(tbl);
        return mld;
    },
    _setGroupListRelatedControl: function (options) {
        var wData = {};
        Iptools.uidataTool._getUserDetailAppletData(Iptools.Tool._extend({
            appletId: options.data.applet.createApplet,
            valueId: options.valueId,
        }, { async: false }), function (ds) {
            if (ds.applet.type == "detail") {
                wData = widget._setGroupDetailControls({
                    data: ds,
                    oriData: options.data,
                    primaryKey: options.valueId
                });
            }
        });
        return wData;
    },
    _setGroupListMainData: function (options) {
        var clickColumns = [];
        var clickColumnViews = [];
        var reDetailWidget = widget._setGroupListRelatedControl(Iptools.Tool._extend(options, { valueId: 0 }));
        var mld = document.createElement("div");
        $(mld).attr("id", options.container);
        $(mld).addClass("table-responsive");
        var tbl = document.createElement("table");
        $(tbl).addClass("table table-striped table-no-wrap");
        $(tbl).data("relatedApplet", options.data.applet.createApplet);
        var th = document.createElement("thead");
        $(th).append("<tr></tr>");
        var tbd = document.createElement("tbody");
        $.each(options.data.columns, function (key, obj) {
            if (Iptools.Tool._checkNull(obj.destinationView)) {
                clickColumns.push(obj.column);
                clickColumnViews.push(obj.destinationView);
            }
            if (obj.type != "hidden") {
                $(th).find("tr").append("<th>" + obj.name + "</th>");
            }
        });
        if (options.data.applet.isDetailView) {
            $(th).find("tr").append("<th class='detail-column'>" + options.data.applet.detailColumnName + "</th>");
        }
        var trdn = document.createElement("tr");
        $(trdn).addClass("groupListNewRow info");
        $.each(options.data.columns, function (key, obj) {
            var tdo = document.createElement("td");
            $(tdo).addClass("editControlTd");
            var tdod = document.createElement("div");
            $(tdod).addClass("editControlText");
            var tdoc = document.createElement("div");
            $(tdoc).addClass("editListFieldControlHidden");
            if (obj.type != "hidden") {
                $(tdoc).html(reDetailWidget[obj.column]);
                $(tdo).append(tdod, tdoc);
                $(trdn).append(tdo);
            }
        });
        $(tbd).append(trdn);
        if (options.data.data && options.data.data.records) {
            $.each(options.data.data.records, function (key, obj) {
                var tempData;
                var tkey;
                var tr = document.createElement("tr");
                $(tr).data("key", obj[options.data.rootLink + "_id"]);
                var reDetailWidgetValued = widget._setGroupListRelatedControl(
                    Iptools.Tool._extend(options, { valueId: obj[options.data.rootLink + "_id"] }));
                for (var i = 0; i < options.data.columns.length; i++) {
                    if (options.data.columns[i].type != "hidden") {
                        var tdo = document.createElement("td");
                        $(tdo).addClass("editControlTd");
                        var tdod = document.createElement("div");
                        $(tdod).addClass("editControlText");
                        var col = options.data.columns[i].column;
                        var tdoc = document.createElement("div");
                        $(tdoc).addClass("editListFieldControlHidden");
                        $(tdoc).append(reDetailWidgetValued[col]);
                        tempData = obj[col];
                        tempData = Iptools.Tool._checkNull(tempData) ? tempData : "";
                        if (options.data.columns[i].type == "rmb" && tempData != "") {
                            $(tdod).append("￥");
                        }
                        if (options.data.columns[i].type == "bool") {
                            tempData = tempData ? "是" : "否";
                        }
                        if (options.data.columns[i].type == "select" && Iptools.Tool._checkNull(options.data.columns[i].pickList)) {
                            for (var j = 0; j < options.data.columns[i].pickList.length; j++) {
                                if (options.data.columns[i].pickList[j].id == tempData) {
                                    tempData = options.data.columns[i].pickList[j].name;
                                    break;
                                }
                            }
                        }
                        if ($.inArray(col, clickColumns) != -1) {
                            var tdha = document.createElement("a");
                            $(tdha).css("cursor", "pointer");
                            $(tdha).attr("class", "hyperLinkAView");
                            if (typeof (tempData) == "object") {
                                $(tdha).attr("data-id", tempData["id"]);
                                for (tkey in tempData) {
                                    if (tkey != "id") {
                                        tempData = tempData[tkey];
                                    }
                                }
                            } else {
                                $(tdha).attr("data-id", obj[options.data.rootLink + "_id"]);
                            }
                            $(tdha).attr("data-key", clickColumnViews[$.inArray(col, clickColumns)]);
                            if (Iptools.Tool._checkNull(options.data.columns[i].hrefText) && Iptools.Tool._checkNull(tempData)) {
                                $(tdha).html(options.data.columns[i].hrefText);
                            } else {
                                $(tdha).html(tempData);
                            }
                            $(tdod).append(tdha);
                        } else {
                            if (typeof (tempData) == "object") {
                                for (tkey in tempData) {
                                    if (tkey != "id") {
                                        tempData = tempData[tkey];
                                    }
                                }
                            }
                            $(tdod).append(tempData);
                        }
                        if (options.data.columns[i].type == "percent" && tempData != "") {
                            $(tdod).append("%");
                        }
                        $(tdo).append(tdod, tdoc);
                        $(tr).append(tdo);
                    }
                }
                if (options.data.applet.isDetailView) {
                    $(tr).append("<td class='detail-column'><a class='hyperLinkAView' style='cursor:pointer' data-id='"
                        + obj[options.data.rootLink + "_id"]
                        + "' data-key='" + options.data.applet.detailViewId + "'>" + options.data.applet.detailHrefText + "</a></td>");
                }
                $(tbd).append(tr);
            });
        }
        $(tbl).append(th, tbd);
        $(mld).append(tbl);
        return mld;
    },
    _setListButtonsPanel: function (options) {
        var data = Iptools.uidataTool._getAppletButtons({
            applet: options.applet
        });
        $(options.holder).find(".button-nav").html("");
        $.each(data.buttons, function (key, obj) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var span = document.createElement("span");
            switch (obj.type) {
                case "new":
                    $(a).attr("data-key", obj.createApplet);
                    $(a).attr("class", "listPanelBtnNewView");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-plus");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "del":
                    $(a).data("applet", options.applet);
                    $(a).attr("class", "appletDeleteBtn input-disabled");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-trash");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "save":
                    $(a).data("applet", options.applet);
                    $(a).attr("class", "SaveDataBtn");
                    $(a).attr("data-loading-text", "<span class='icon-save icon-spin' style='margin-right:10px'></span>保存中");
                    $(a).css("cursor", "pointer");
                    $(a).data("form", options.form);
                    $(span).addClass("icon-save");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "contactSave":
                    $(a).data("applet", options.applet);
                    $(a).attr("class", "contactSaveDataBtn");
                    $(a).attr("data-loading-text", "<span class='icon-save icon-spin' style='margin-right:10px'></span>保存中");
                    $(a).css("cursor", "pointer");
                    $(a).data("form", options.form);
                    $(span).addClass("icon-save");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "print":
                    $(a).data("applet", options.applet);
                    $(a).attr("class", "appletPrintBtn input-disabled");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-print");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "refresh":
                    $(a).attr("class", "listPanelBtnRefresh");
                    $(a).attr("data-loading-text", "<span class='icon-refresh icon-spin' style='margin-right:10px'></span>刷新中");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-refresh");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "debtsList":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).addClass("debts-list");
                    $(span).addClass("icon-file-alt");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "debtsPaper":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).addClass("debts-paper");
                    $(span).addClass("icon-building");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "accountBindingBankClear":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).addClass("accountBindingBankClear");
                    $(span).addClass("icon-random");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "groupHint":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).addClass("groupHintBtn");
                    $(span).addClass("icon-question-sign");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "groupUnLock":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).addClass("detailEditUnLock");
                    $(a).data("form", options.form);
                    $(span).addClass("icon-unlock");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
            }
            $(options.holder).find(".button-nav").append(li);
        });
    },
    _setGroupDetailControls: function (options) {
        var wData = {};
        $.each(options.data.controls, function (key, obj) {
            var dd = document.createElement("div");
            $(dd).css("margin-bottom", "0");
            switch (obj.type) {
                case "hidden":
                    $(dd).attr("class", "form-group");
                    $(dd).css("display", "none");
                    break;
                default:
                    $(dd).attr("class", "form-group");
                    break;
            }
            var selColumn = "";
            var selFlag = false;
            for (var i = 0; i < options.oriData.columns.length; i++) {
                var scol = options.oriData.columns[i];
                if (scol.column.split('_')[1] == obj.column.split('_')[1]) {
                    selColumn = scol.column;
                    selFlag = true;
                    break;
                }
            };
            if (selFlag) {
                var tkey = 0;
                var tValue;
                if (!Iptools.Tool._checkNull(options.data.data) || !Iptools.Tool._checkNull(options.data.data[obj.column])) {
                    tValue = "";
                } else {
                    tValue = options.data.data[obj.column];
                }
                if (typeof (tValue) == "object") {
                    for (var ikey in tValue) {
                        if (ikey != "id") {
                            tValue = tValue[ikey];
                        } else {
                            tkey = tValue[ikey];
                        }
                    }
                }
                var valires = widget._setValidate({
                    validations: widget._UIDEFAULFS.groupListFormValidation,
                    control: obj,
                    primaryKey: options.primaryKey
                });
                widget._UIDEFAULFS.groupListFormValidation = valires.validation;
                $(dd).append(widget._setControlValued({
                    control: obj,
                    value: tValue,
                    key: tkey,
                    container: widget._UIDEFAULFS.groupListForm,
                    valid: valires.valid,
                    primaryKey: options.primaryKey,
                }));
                wData[selColumn] = dd;
            }
        });
        return wData;
    },
    _setDetailAppletContent: function (options) {
        widget._UIDEFAULFS.DataOriginalSets[options.data.applet.id + "_form"] = {};
        widget._UIDEFAULFS.DataCurrentSets[options.data.applet.id + "_form"] = {};
        var header = widget._setPanelHeader(options);
        var form = document.createElement("form");
        $(form).attr("id", options.data.applet.id + "_form");
        var validations = {};
        $.each(options.data.controls, function (key, obj) {
            var dd = document.createElement("div");
            $(dd).css("padding-top", "20px");
            switch (obj.type) {
                case "richtext":
                    $(dd).attr("class", "form-group col-sm-12");
                    $(dd).css({ "margin": "0 0 25px 0", "text-align": "left" });
                    break;
                case "textarea":
                    $(dd).attr("class", "form-group col-sm-6");
                    $(dd).css({ "margin": "0 0 15px 0", "text-align": "left" });
                    break;
                case "hidden":
                    $(dd).attr("class", "form-group col-sm-3");
                    $(dd).css("display", "none");
                    break;
                default:
                    $(dd).attr("class", "form-group col-sm-3");
                    $(dd).css({ "margin": "0 0 15px 0", "text-align": "left", "min-height": "80px" });
                    break;
            }
            if (options.type == "primary") {
                $(dd).addClass("group-detail-field-control");
            }
            var lab = document.createElement("label");
            $(lab).attr("class", "control-label");
            $(lab).html(obj.name);
            $(dd).append(lab);
            var tkey = 0;
            var tValue;
            if (!Iptools.Tool._checkNull(options.data.data) || !Iptools.Tool._checkNull(options.data.data[obj.column])) {
                tValue = "";
            } else {
                tValue = options.data.data[obj.column];
            }
            if (typeof (tValue) == "object") {
                for (var ikey in tValue) {
                    if (ikey != "id") {
                        tValue = tValue[ikey];
                    } else {
                        tkey = tValue[ikey];
                    }
                }
            }
            var valires = widget._setValidate({
                validations: validations,
                control: obj,
                primaryKey: options.primaryKey
            });
            validations = valires.validation;
            $(dd).append(widget._setControlValued({
                control: obj,
                value: tValue,
                key: tkey,
                container: options.data.applet.id + "_form",
                valid: valires.valid,
                primaryKey: options.primaryKey
            }));
            $(form).append(dd);
            widget._setOriginalData({
                control: obj,
                value: tValue,
                key: tkey,
                container: options.data.applet.id + "_form"
            });
        });
        $(form).bootstrapValidator({ fields: validations });
        if (options.type == "primary") {
            $(header).addClass("detail-main-nav");
            $(options.panel).find(".panel-heading").html(header);
            $(options.panel).find(".panel-body").html(form);
        } else if (options.type == "grouplist") {
            var dlc = document.createElement("div");
            $(dlc).append(header, form);
            $(".group-section .group-section-list").append(dlc);
        } else {
            var ret = document.createElement("div");
            $(ret).append(header, form);
            $(options.panel).append(ret);
        }
        widget._setListButtonsPanel({
            applet: options.data.applet.id,
            condition: options.condition,
            type: options.type,
            container: options.container,
            holder: header,
            form: options.data.applet.id + "_form",
        });
    },
    _setOriginalData: function (options) {
        switch (options.control.type) {
            case "pickApplet":
            case "select":
            case "radio":
                widget._UIDEFAULFS.DataOriginalSets[options.container][options.control.column] = options.key;
                break;
            default:
                widget._UIDEFAULFS.DataOriginalSets[options.container][options.control.column] = options.value;
                break;
        }
    },
    _setValidate: function (options) {
        var track = false;
        var vdr = {};
        if (!options.control.empty && options.control.empty != undefined) {
            vdr["notEmpty"] = {
                message: "不可为空"
            }
            track = true;
        }
        switch (options.control.type) {
            case "int":
                vdr["regexp"] = {
                    regexp: /^-?[1-9]\d*$/,
                    message: "请输入整数"
                }
                track = true;
                break;
            case "float":
                vdr["regexp"] = {
                    regexp: /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/,
                    message: "请输入浮点数"
                }
                track = true;
                break;
            case "time":
                vdr["regexp"] = {
                    regexp: /(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2}:\d{2})/,
                    message: "请输入正确的时间格式（YYYY-mm-dd hh:mm:ss）"
                }
                track = true;
                break;
            case "date":
                vdr["regexp"] = {
                    regexp: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                    message: "请输入正确的日期格式（YYYY-mm-dd）"
                }
                track = true;
                break;
            case "percent":
                vdr["regexp"] = {
                    regexp: /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/,
                    message: "请输入0-100内的数值，小数不超过两位"
                }
                track = true;
                break;
            case "rmb":
                vdr["regexp"] = {
                    regexp: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                    message: "请输入非负的数值，小数不超过两位"
                }
                track = true;
                break;
        }
        if (Iptools.Tool._checkNull(options.control.reg)) {
            vdr["regexp"] = {
                regexp: eval(options.control.reg),
                message: options.control.regInfo
            }
            track = true;
        }
        if (track) {
            options.validations[options.primaryKey + "#" + options.control.column] = {
                validators: vdr,
            }
        }
        return { validation: options.validations, valid: track };
    },
    //load every control field according to its own type
    //type series :text time pickApplet select date check radio picture textarea file percent rmb hidden
    //this sets gots its value for controls
    _setControlValued: function (options) {
        var ip = document.createElement("input");
        var dg = document.createElement("div");
        var sg = document.createElement("span");
        var sp = document.createElement("span");
        var sd = document.createElement("span");
        var sdf = document.createElement("span");
        var sgf = document.createElement("span");
        var spf = document.createElement("span");
        var sl = document.createElement("select");
        switch (options.control.type) {
            case "text":
            default:
                $(ip).data("column", options.control.column);
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                return ip;
            case "int":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).css("text-align", "left");
                $(ip).data("column", options.control.column);
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("type", "text");
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).html("N");
                $(sg).append(sp);
                $(dg).append(sg, ip);
                return dg;
            case "float":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).css("text-align", "left");
                $(ip).data("column", options.control.column);
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("type", "text");
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).html("F");
                $(sg).append(sp);
                $(dg).append(sg, ip);
                return dg;
            case "pwd":
                $(ip).data("column", options.control.column);
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).attr("type", "password");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                return ip;
            case "time":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control timeStampPicker control-normal-text control-disabled");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("data-form", options.container);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                $(sg).addClass("input-group-addon");
                $(sp).addClass("icon-time");
                $(sp).attr("aria-hidden", "true");
                $(sp).attr("type", "button");
                $(sg).append(sp);
                $(dg).append(ip, sg);
                return dg;
            case "pickApplet":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).data("column", options.control.column);
                $(ip).data("key", options.key);
                $(ip).data("pick", "1");
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("readonly", "readonly");
                $(ip).attr("data-form", options.container);
                $(ip).attr("data-valid", options.valid);
                $(ip).val(options.value);
                $(sg).addClass("input-group-addon control-hidden");
                $(sdf).addClass("input-group-addon control-hidden");
                $(sdf).css("border-left", "1px #fff solid");
                $(sd).addClass("glyphicon glyphicon-trash clearSearchPick");
                $(sd).attr("aria-hidden", "true");
                $(sd).attr("title", "清空");
                $(sd).attr("type", "button");
                $(sd).css("cursor", "pointer");
                $(sdf).append(sd);
                $(sp).addClass("glyphicon glyphicon-search");
                $(sp).attr("aria-hidden", "true");
                $(sp).attr("title", "选择");
                $(sp).attr("type", "button");
                $(sp).attr("data-toggle", "modal");
                $(sp).attr("data-target", widget._UIDEFAULFS.detailSelectModal);
                $(sp).data("applet", options.control.pickApplet);
                $(sp).css("cursor", "pointer");
                $(sg).append(sp);
                if (options.control.destinationView) {
                    $(sgf).addClass("input-group-addon");
                    $(spf).attr("type", "button");
                    $(spf).addClass("glyphicon");
                    if (options.key) {
                        $(spf).attr("title", "查看");
                        $(spf).css("cursor", "pointer");
                        $(spf).addClass("glyphicon-eye-open hyperLinkAView");
                    } else {
                        $(spf).addClass("glyphicon-eye-close");
                    }
                    $(spf).data("key", options.control.destinationView);
                    $(spf).data("id", options.key);
                    $(sgf).append(spf);
                    $(dg).append(sgf);
                }
                if (!options.control.modify && !options.control.destinationView) {
                    return ip;
                } else if (!options.control.modify) {
                    $(dg).append(ip);
                } else {
                    $(dg).append(ip, sg, sdf);
                }
                return dg;
            case "pickselect":
                $(sl).data("column", options.control.column);
                $(sl).addClass("form-control control-normal-select control-disabled");
                $(sl).css("box-sizing", "border-box");
                $(sl).attr("name", options.primaryKey + "#" + options.control.column);
                $(sl).append("<option value=''>请选择</option>");
                $.each(widget._setPickOptions(options), function (key, obj) {
                    var op = document.createElement("option");
                    $(op).attr("value", obj.key);
                    if (options.value == obj.key) {
                        $(sl).find("option").removeAttr("selected");
                        $(op).attr("selected", "selected");
                    }
                    $(op).html(obj.value);
                    $(sl).append(op);
                });
                if (!options.control.modify) {
                    $(sl).attr("disabled", "disabled");
                }
                return sl;
            case "cascade":
                $(sl).data("column", options.control.column);
                $(sl).addClass("form-control control-disabled");
                $(sl).css("box-sizing", "border-box");
                $(sl).attr("name", options.primaryKey + "#" + options.control.column);
                $(sl).append("<option value=''>请选择</option>");
                $(sl).attr("disabled", "disabled");
                $(sl).data("applet", options.control.pickApplet);
                widget._setCascadeListener(options);
                return sl;
            case "select":
                $(sl).data("column", options.control.column);
                $(sl).addClass("form-control control-normal-select control-disabled");
                $(sl).css("box-sizing", "border-box");
                $(sl).attr("name", options.primaryKey + "#" + options.control.column);
                $(sl).append("<option value=''>请选择</option>");
                $.each(options.control.pickList, function (key, obj) {
                    var op = document.createElement("option");
                    $(op).attr("value", obj.id);
                    if (options.key == obj.id) {
                        $(sl).find("option").removeAttr("selected");
                        $(op).attr("selected", "selected");
                    }
                    $(op).html(obj.name);
                    $(sl).append(op);
                });
                if (!options.control.modify) {
                    $(sl).attr("disabled", "disabled");
                }
                return sl;
            case "date":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control dateStampPicker control-normal-text control-disabled");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("data-form", options.container);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                $(sg).addClass("input-group-addon");
                $(sp).addClass("glyphicon glyphicon-calendar");
                $(sp).attr("aria-hidden", "true");
                $(sp).attr("type", "button");
                $(sg).append(sp);
                $(dg).append(ip, sg);
                return dg;
            case "check":
                $(sg).addClass("cr-group form-control");
                $(sg).data("column", options.control.column);
                $(sg).css("border", "0").css("box-shadow", "none").css("padding", "6px 0");
                $.each(options.control.pickList, function (key, obj) {
                    var lab = document.createElement("label");
                    $(lab).addClass("checkbox-inline");
                    $(lab).css({ "margin": "0 10px 0 0" });
                    var ipt = document.createElement("input");
                    $(ipt).addClass("input-cr control-disabled");
                    $(ipt).attr("type", "checkbox");
                    $(ipt).val(obj.id);
                    if (!options.control.modify) {
                        $(ipt).attr("disabled", "disabled");
                    }
                    if (options.value && options.value.indexOf(obj.id) > -1) {
                        $(ipt).attr("checked", "checked");
                    }
                    $(lab).append(ipt, obj.name);
                    $(sg).append(lab);
                });
                return sg;
            case "radio":
                $(sg).addClass("cr-group form-control");
                $(sg).data("column", options.control.column);
                $(sg).css("border", "0").css("box-shadow", "none").css("padding", "6px 0");
                $.each(options.control.pickList, function (key, obj) {
                    var lab = document.createElement("label");
                    $(lab).addClass("radio-inline");
                    $(lab).css("margin-left", "2px");
                    var ipt = document.createElement("input");
                    $(ipt).addClass("input-cr control-disabled");
                    $(ipt).attr("type", "radio");
                    $(ipt).attr("name", options.primaryKey + "#" + options.control.column + "_radio");
                    $(ipt).val(obj.id);
                    if (!options.control.modify) {
                        $(ipt).attr("disabled", "disabled");
                    }
                    if (options.key && options.key.indexOf(obj.id) > -1) {
                        $(ipt).attr("checked", "checked");
                    }
                    $(lab).append(ipt, obj.name);
                    $(sg).append(lab);
                });
                return sg;
            case "picture":
                $(dg).css("text-align", "left").css("padding-left", "5px").css("height", "80px");
                var a = document.createElement("a");
                $(a).addClass("lightboxLink");
                $(a).data("has", false);
                if (options.value) {
                    $(a).data("has", true);
                    $(a).attr("href", options.value);
                } else {
                    $(a).attr("href", widget._UIDEFAULFS.defaultPicturePath);
                }
                $(a).data("column", options.control.column);
                $(a).attr("data-lightbox", options.container + "_lightbox");
                var img = document.createElement("img");
                if (options.value) {
                    $(img).attr("src", options.value);
                } else {
                    $(img).attr("src", widget._UIDEFAULFS.defaultPicturePath);
                }
                $(img).attr("width", "80");
                $(img).css("max-height", "80px");
                $(img).attr("alt", "");
                $(a).append(img);
                var dpg = document.createElement("div");
                $(dpg).addClass("progress pictureprogress");
                var dpb = document.createElement("div");
                $(dpb).addClass("progress-bar progress-bar-striped active");
                $(dpb).attr("role", "progressbar");
                $(dpb).attr("aria-valuenow", "100");
                $(dpb).attr("aria-valuemin", "0");
                $(dpb).attr("aria-valuemax", "100");
                $(dpb).css("width", "100%");
                $(sg).css("line-height", "14px");
                $(sg).html("loading...");
                $(dpb).append(sg);
                $(dpg).append(dpb);
                var af = document.createElement("a");
                $(af).addClass("img-file control-hidden");
                $(af).append("更改");
                $(ip).attr("type", "file");
                $(ip).attr("accept", ".jpg,.png");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(af).append(ip);
                if (!options.control.modify) {
                    $(dg).append(a, dpg);
                } else {
                    $(dg).append(a, dpg, af);
                }
                return dg;
            case "textarea":
                var txa = document.createElement("textarea");
                $(txa).data("column", options.control.column);
                $(txa).addClass("form-control detailTextarea control-disabled");
                if (!options.control.modify) {
                    $(txa).attr("disabled", "disabled");
                }
                $(txa).text(options.value);
                return txa;
            case "richtext":
                $(dg).addClass("control-rich-text control-disabled");
                $(dg).data("column", options.control.column);
                if (!options.control.modify) {
                    $(dg).attr("disabled", "disabled");
                }
                $(dg).html(options.value);
                return dg;
            case "file":
                var filename = "";
                var pathname = "";
                if (options.value) {
                    filename = options.value.split('|')[0];
                    pathname = options.value.split('|')[1];
                }
                var iconUrl;
                if (filename.indexOf("doc") > 0) {
                    iconUrl = widget._UIDEFAULFS.defaultWordPath;
                } else if (filename.indexOf("xls") > 0) {
                    iconUrl = widget._UIDEFAULFS.defaultExcelPath;
                } else if (filename.indexOf("ppt") > 0) {
                    iconUrl = widget._UIDEFAULFS.defaultPPTPath;
                } else {
                    iconUrl = widget._UIDEFAULFS.defaultFilePath;
                }
                $(dg).css("text-align", "left");
                var df = document.createElement("div");
                $(df).addClass("file-data");
                if (options.value) {
                    if (!options.control.modify) {
                        $(df).data("has", false);
                    } else {
                        $(df).data("has", true);
                    }
                    $(df).data("val", options.value);
                }
                $(df).data("column", options.control.column);
                var im = document.createElement("img");
                $(im).attr("src", iconUrl);
                $(im).attr("width", "80");
                $(im).attr("alt", "");
                var p = document.createElement("p");
                $(p).css("display", "inline-block");
                $(p).html(filename);
                var afu = document.createElement("a");
                $(afu).addClass("file-upload control-hidden");
                if (options.value) {
                    $(sp).html("更改");
                } else {
                    $(sp).html("上传");
                }
                $(ip).attr("type", "file");
                $(ip).attr("accept", ".doc,.docx,.xls,.xlsx,.ppt,.pptx");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(afu).append(sp, ip);
                if (!options.control.modify) {
                    $(df).append(im, p);
                } else {
                    $(df).append(im, p, afu);
                }
                if (pathname) {
                    var afd = document.createElement("a");
                    $(afd).addClass("file-download control-hidden");
                    $(afd).attr("href", pathname);
                    $(afd).html("下载");
                    $(df).append(afd);
                }
                $(dg).append(df);
                return dg;
            case "percent":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).css("text-align", "right");
                $(ip).data("column", options.control.column);
                $(ip).data("type", "percent");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("type", "text");
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).html("%");
                $(sg).append(sp);
                $(dg).append(ip, sg);
                return dg;
            case "rmb":
                $(dg).addClass("input-group");
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).html("￥");
                $(sg).append(sp);
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).data("column", options.control.column);
                $(ip).data("type", "rmb");
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                $(ip).val(options.value);
                $(dg).append(sg, ip);
                return dg;
            case "cal":
                $(dg).addClass("input-group");
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).addClass("icon-stethoscope");
                $(sg).append(sp);
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("disabled", "disabled");
                $(ip).val(options.value);
                $(dg).append(sg, ip);
                widget._UIDEFAULFS.controlCalLinks.push({
                    primaryKey: options.primaryKey,
                    key: options.control.column,
                    value: options.control.formula
                });
                return dg;
            case "hidden":
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "hidden");
                $(ip).addClass("form-control control-hidden-text");
                return ip;
            case "bool":
                $(ip).data("column", options.control.column);
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("type", "checkbox");
                $(ip).addClass("switch-checkbox control-disabled");
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (options.value) {
                    $(ip).attr("checked", "checked");
                }
                $(dg).append(ip);
                return dg;
            case "phoneEncrypt":
                $(dg).addClass("input-group");
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).addClass("icon-lock");
                $(sg).append(sp);
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("disabled", "disabled");
                if (options.value) {
                    $(ip).val(options.value.substr(0, 3) + "****" + options.value.substr(7));
                }
                $(dg).append(ip, sg);
                return dg;
            case "identityEncrypt":
                $(dg).addClass("input-group");
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).addClass("icon-lock");
                $(sg).append(sp);
                $(ip).addClass("form-control control-normal-text control-disabled");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.primaryKey + "#" + options.control.column);
                $(ip).attr("disabled", "disabled");
                if (options.value) {
                    $(ip).val(options.value.substr(0, options.value.length - 4) + "****");
                }
                $(dg).append(ip, sg);
                return dg;
        }
    },
    _setCascadeListener: function (options) {
        var ciobj = (eval("(" + options.control.cascadeFields + ")")).fields;
        var cicolumns = (eval("(" + options.control.cascadeFields + ")")).cascadeColumn;
        if (ciobj && ciobj.length) {
            for (var i = 0; i < ciobj.length; i++) {
                widget._addEventListener({
                    container: "body",
                    type: "change",
                    target: "select[name=" + ciobj[i] + "]",
                    event: function () {
                        var allcheck = true;
                        for (var j = 0; j < ciobj.length; j++) {
                            if (!Iptools.Tool._checkNull($("select[name=" + ciobj[j] + "]").val().trim())) {
                                allcheck = false;
                            }
                        }
                        if (allcheck) {
                            var condition = {};
                            for (var m = 0; m < ciobj.length; m++) {
                                condition[cicolumns[m]] = "=" + $("select[name=" + ciobj[m] + "]").val();
                            }
                            options.condition = JSON.stringify(condition);
                            $("select[name=" + options.control.column + "]").find("option:gt(0)").remove();
                            $.each(widget._setPickOptions(options), function (key, obj) {
                                var op = document.createElement("option");
                                $(op).attr("value", obj.key);
                                $(op).html(obj.value);
                                $("select[name=" + options.control.column + "]").append(op);
                            });
                            $("select[name=" + options.control.column + "]").removeAttr("disabled");
                            $("select[name=" + options.control.column + "]").change();
                        } else {
                            $("select[name=" + options.control.column + "]").find("option:gt(0)").remove();
                            $("select[name=" + options.control.column + "]").change();
                            $("select[name=" + options.control.column + "]").attr("disabled", "disabled");
                        }
                    }
                });
            }
        }
    },
    _setPickOptions: function (options) {
        var rs = [];
        var cond = options.condition;
        var condition = cond ? cond : [];
        Iptools.uidataTool._getUserlistAppletData({
            async: false,
            view: Iptools.DEFAULTS.currentView,
            appletId: options.control.pickApplet,
            pageNow: 1,
            pageSize: 50,
            condition: condition,
        }, function (ds) {
            var index = 0;
            for (var i = 0; i < ds.columns.length; i++) {
                if (ds.columns[i].pickFlag == "1") {
                    index = ds.columns[i].column;
                    break;
                }
            }
            $.each(ds.data.records, function (key, obj) {
                rs.push({
                    key: obj[ds.rootLink + "_id"],
                    value: obj[index]
                });
            });
        });
        return rs;
    },
    _setPickSearchOptions: function (options) {
        var rs = [];
        Iptools.uidataTool._getUserlistAppletData({
            async: false,
            view: Iptools.DEFAULTS.currentView,
            appletId: options.data.pickApplet,
            pageNow: 1,
            pageSize: 50
        }, function (ds) {
            var index = 0;
            for (var i = 0; i < ds.columns.length; i++) {
                if (ds.columns[i].pickFlag == "1") {
                    index = ds.columns[i].column;
                    break;
                }
            }
            $.each(ds.data.records, function (key, obj) {
                rs.push({
                    key: obj[ds.rootLink + "_id"],
                    value: obj[index]
                });
            });
        });
        return rs;
    },
    _setTableAppletContent: function (options) {
        var dg = document.createElement("div");
        var d = document.createElement("div");
        $(d).addClass("table-responsive");
        $(d).attr("id", options.container);
        $(d).append(widget._setTableAppletMainData(options));
        var nav = document.createElement("nav");
        $(nav).addClass("text-center");
        $(nav).append(widget._setListPaginationPanel({
            pageNow: options.pageNow,
            panel: widget._UIDEFAULFS.detailSearchPanle,
            data: options.data,
            type: "table",
            container: options.container,
            extra: options.type,
        }));
        $(dg).append(d);
        $(dg).append(nav);
        return dg;
    },
    _setTableAppletMainData: function (options) {
        var t = document.createElement("table");
        $(t).addClass("table table-striped table-bordered table-hover table-no-wrap");
        var th = document.createElement("thead");
        var tb = document.createElement("tbody");
        var thr = document.createElement("tr");
        $(thr).append("<th style='width:40px;'></th>");
        var tbr = document.createElement("tr");
        $.each(options.data.columns, function (key, obj) {
            if (obj.type != "hidden") {
                var thrh = document.createElement("th");
                if (obj.pickFlag == "1") {
                    $(thrh).addClass("pickColumn");
                }
                $(thrh).html(obj.name);
                $(thr).append(thrh);
            }
        });
        $(th).append(thr);
        var singleton = true;
        if (options.data.data && options.data.data.records.length) {
            $.each(options.data.data.records, function (key, obj) {
                $(tbr).html("");
                $(tbr).css("text-align", "center");
                var tbrip = document.createElement("input");
                if (options.type == "extra") {
                    $(tbrip).attr("type", "checkbox");
                    $(tbrip).css("margin", "0 auto");
                    $(tbrip).attr("name", "modalListCheckbox");
                    $(tbrip).addClass("checkbox");
                    $(tbrip).attr("data-key", obj[options.data.rootLink + "_id"]);
                    $(tbrip).data("applet", options.data.applet.id);
                } else {
                    $(tbrip).attr("type", "radio");
                    $(tbrip).css("margin", "0 auto");
                    $(tbrip).attr("name", "modalListRadio");
                    if (singleton) {
                        $(tbrip).attr("checked", "checked");
                    }
                    $(tbrip).addClass("radio");
                    $(tbrip).attr("data-key", obj[options.data.rootLink + "_id"]);
                    $(tbrip).data("applet", options.data.applet.id);
                }
                $(tbr).append("<td>" + tbrip.outerHTML + "</td>");
                $.each(options.data.columns, function (tkey, tobj) {
                    if (tobj.type != "hidden") {
                        var tempData = obj[tobj.column];
                        if (typeof (tempData) == "object") {
                            for (var skey in tempData) {
                                if (skey != "id") {
                                    tempData = tempData[skey];
                                    break;
                                }
                            }
                        }
                        var tbrd = document.createElement("td");
                        if (tobj.type == "rmb" && Iptools.Tool._checkNull(tempData)) {
                            $(tbrd).append("￥");
                        }
                        if (tobj.type == "select" && Iptools.Tool._checkNull(tobj.pickList)) {
                            for (var j = 0; j < tobj.pickList.length; j++) {
                                if (tobj.pickList[j].id == tempData) {
                                    tempData = tobj.pickList[j].name;
                                    break;
                                }
                            }
                        }
                        if (tobj.type == "bool") {
                            tempData = tempData ? "是" : "否";
                        }
                        $(tbrd).append(tempData);
                        $(tbr).append(tbrd);
                    }
                });
                $(tb).append(tbr.outerHTML);
                singleton = false;
            });
        }
        $(t).append(th);
        $(t).append(tb);
        return t;
    },
    _setListPaginationPanel: function (options) {
        var dateHas = false;
        if (Iptools.Tool._checkNull(options.data.data)) {
            dateHas = true;
        }
        var pag = document.createElement("div");
        $(pag).attr("class", "pagination");
        var paf = document.createElement("div");
        $(paf).attr("class", "pageForm");
        var bsp = document.createElement("span");
        $(bsp).attr("class", "base");
        var bspa = document.createElement("span");
        $(bspa).attr("class", "arrow-left");
        $(bspa).attr("data-page", options.pageNow);
        $(bspa).attr("data-parent", options.container);
        $(bspa).attr("data-applet", options.data.applet.id);
        $(bspa).attr("data-total", dateHas ? options.data.data.pageCount : 0);
        $(bspa).attr("data-type", options.type);
        $(bspa).attr("data-extra", options.extra);
        $(bspa).attr("data-rowcount", dateHas ? options.data.data.rowCount : 0);
        var pagpre = document.createElement("a");
        $(pagpre).attr("class", "pageSkip");
        $(pagpre).attr("title", "上一页");
        $(bspa).append(pagpre);
        var pagnum = document.createElement("a");
        $(pagnum).attr("class", "pagenum");
        $(pagnum).html(options.pageNow + "/" + (dateHas ? options.data.data.pageCount : 0));
        var bspn = document.createElement("span");
        $(bspn).attr("class", "arrow-right");
        $(bspn).attr("data-page", options.pageNow);
        $(bspn).attr("data-parent", options.container);
        $(bspn).attr("data-applet", options.data.applet.id);
        $(bspn).attr("data-total", dateHas ? options.data.data.pageCount : 0);
        $(bspn).attr("data-type", options.type);
        $(bspn).attr("data-extra", options.extra);
        $(bspn).attr("data-rowcount", dateHas ? options.data.data.rowCount : 0);
        var pagnxt = document.createElement("a");
        $(pagnxt).attr("class", "pageNext");
        $(pagnxt).attr("title", "下一页");
        $(bspn).append(pagnxt);
        $(bsp).append(bspa, pagnum, bspn);
        var psp = document.createElement("span");
        $(psp).addClass("pageCountCalText");
        var pageNowCount = dateHas ? options.data.data.pageSize : 0;
        if (options.pageNow >= (dateHas ? options.data.data.pageCount : 0)) {
            pageNowCount = (dateHas ? options.data.data.rowCount : 0) - (options.pageNow - 1) * (dateHas ? options.data.data.pageSize : 0);
        }
        $(psp).html("本页" + pageNowCount + "条，共" + (dateHas ? options.data.data.rowCount : 0) + "条");
        var pagip = document.createElement("input");
        $(pagip).attr("class", "pageInput");
        $(pagip).attr("type", "text");
        $(pagip).attr("maxlength", "4");
        var pagbtn = document.createElement("button");
        $(pagbtn).attr("class", "pageButton btn-sm");
        $(pagbtn).attr("data-parent", options.container);
        $(pagbtn).attr("data-applet", options.data.applet.id);
        $(pagbtn).attr("data-total", dateHas ? options.data.data.pageCount : 0);
        $(pagbtn).attr("data-type", options.type);
        $(pagbtn).attr("data-extra", options.extra);
        $(pagbtn).attr("data-rowcount", dateHas ? options.data.data.rowCount : 0);
        $(pagbtn).html("跳转");
        $(paf).append(bsp, psp, pagip, pagbtn);
        $(pag).append(paf);
        return pag;
    },
    _setControlSearchContent: function (options) {
        Iptools.uidataTool._getUserlistAppletData(options, function (data) {
            $(widget._UIDEFAULFS.searchForm).html("");
            $.each(data.columns, function (key, obj) {
                if (obj.allowOutterQuery) {
                    $(widget._UIDEFAULFS.searchForm).append(widget._setControlSearchItem({
                        data: obj,
                        condition: options.condition,
                    }));
                }
            });
            var sbtn = document.createElement("button");
            $(sbtn).attr("class", "btn btn-default");
            $(sbtn).attr("type", "submit");
            $(sbtn).attr("data-applet", options.appletId);
            $(sbtn).attr("data-parent", options.container);
            $(sbtn).css("margin", "-8px 3px 0 3px");
            $(sbtn).html("搜索");
            $(widget._UIDEFAULFS.searchForm).append(sbtn);
            //widget._enableTimeOrDateField();
        });
    },
    _setControlSearchItem: function (options) {
        var d = document.createElement("div"),
            lab = document.createElement("lable"),
            sl = document.createElement("select"),
            it = document.createElement("input");
        $(d).attr("class", "form-group control-search-item");
        $(d).attr("data-column", options.data.column);
        $(d).css({ "margin": "0 8px 8px 0" });
        $(lab).attr("class", "control-lable");
        $(lab).css("margin-right", "6px");
        $(lab).html(options.data.name);
        switch (options.data.type) {
            case "text":
                $(d).attr("data-type", "text");
                $(it).attr("type", "text");
                $(it).attr("class", "form-control");
                $(d).append(lab, it);
                break;
            case "int":
                $(d).attr("data-type", "int");
                $(it).attr("type", "text");
                $(it).attr("class", "form-control");
                $(d).append(lab, it);
                break;
            case "select":
                $(d).attr("data-type", "select");
                $(lab).html(options.data.name);
                $(sl).attr("class", "form-control");
                $(sl).css("box-sizing", "border-box");
                $(sl).html("<option value=''>请选择</option>");
                $.each(options.data.pickList, function (tkey, tobj) {
                    var op = document.createElement("option");
                    $(op).val(tobj.id);
                    $(op).html(tobj.name);
                    $(sl).append(op);
                });
                $(d).append(lab, sl);
                break;
            case "pickselect":
                $(d).attr("data-type", "select");
                $(lab).html(options.data.name);
                $(sl).attr("class", "form-control");
                $(sl).css("box-sizing", "border-box");
                $(sl).html("<option value=''>请选择</option>");
                $.each(widget._setPickSearchOptions(options), function (tkey, tobj) {
                    var op = document.createElement("option");
                    $(op).val(tobj.key);
                    $(op).html(tobj.value);
                    $(sl).append(op);
                });
                $(d).append(lab, sl);
                break;
        }
        return d;
    },
    _setSearchParaContext: function () {
        var paraStr = {};
        var objSearchItem = $(widget._UIDEFAULFS.searchForm).find(".control-search-item");
        for (var i = 0; i < objSearchItem.length; i++) {
            var columnName;
            var o = objSearchItem.eq(i);
            columnName = o.data("column");
            var inputValue;
            switch (o.data("type")) {
                case "text":
                    inputValue = o.find("input").eq(0).val().replace(widget._UIDEFAULFS.blankReg, '');
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = " like '%" + inputValue + "%'";
                    }
                    break;
                case "int":
                    inputValue = o.find("input").eq(0).val().replace(widget._UIDEFAULFS.blankReg, '');
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "=" + inputValue;
                    }
                    break;
                case "select":
                    inputValue = o.find("select").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = " ='" + inputValue + "'";
                    }
                    break;
            }
        }
        return JSON.stringify(paraStr);
    },
    _setControlCalLinks: function (options) {
        var cols = widget._spiltCalLink({
            str: options.value
        });
        for (var j = 0; j < cols.length; j++) {
            var ms = cols[j];
            var inputFlag = true;
            var tObj = $("input[name='" + options.primaryKey + "#" + ms + "']");
            if (!tObj.length) {
                inputFlag = false;
            }
            if (inputFlag) {
                widget._addEventListener({
                    container: "body",
                    type: "focus",
                    target: "input[name='" + options.primaryKey + "#" + ms + "']",
                    event: function () {
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").addClass("border-input-focus");
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").parent().find("span:first").addClass("border-span-focus");
                    }
                });
                widget._addEventListener({
                    container: "body",
                    type: "blur",
                    target: "input[name='" + options.primaryKey + "#" + ms + "']",
                    event: function () {
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").removeClass("border-input-focus");
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").parent().find("span:first").removeClass("border-span-focus");
                    }
                });
            } else {
                widget._addEventListener({
                    container: "body",
                    type: "focus",
                    target: "select[name='" + options.primaryKey + "#" + ms + "']",
                    event: function () {
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").addClass("border-input-focus");
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").parent().find("span:first").addClass("border-span-focus");
                    }
                });
                widget._addEventListener({
                    container: "body",
                    type: "blur",
                    target: "select[name='" + options.primaryKey + "#" + ms + "']",
                    event: function () {
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").removeClass("border-input-focus");
                        $("input[name='" + options.primaryKey + "#" + options.key + "']").parent().find("span:first").removeClass("border-span-focus");
                    }
                });
            }
            if (inputFlag) {
                widget._addEventListener({
                    container: "body",
                    type: "input propertychange",
                    target: "input[name='" + options.primaryKey + "#" + ms + "']",
                    event: function () {
                        var flag = true;
                        var cstr = options.value;
                        for (var x = 0; x < cols.length; x++) {
                            var targetObj = $("input[name='" + options.primaryKey + "#" + cols[x] + "']");
                            if (!targetObj.length) {
                                targetObj = $("select[name='" + options.primaryKey + "#" + cols[x] + "']");
                            }
                            if (widget._getCalControlVal({
                                name: cols[x],
                                primaryKey: options.primaryKey,
                            }) < 0 || targetObj.parent().parent().hasClass("has-error")
                                || Iptools.Tool._blank_replacement(targetObj.val()) == "") {
                                flag = false;
                            } else {
                                cstr = cstr.replace(eval("/{" + cols[x] + "}/g"), widget._getCalControlVal({
                                    name: cols[x],
                                    primaryKey: options.primaryKey,
                                }));
                            }
                        }
                        var ctl = $("input[name='" + options.primaryKey + "#" + options.key + "']");
                        if (flag) {
                            var result = eval(cstr);
                            var intreg = /^(-|\+)?\d+$/;
                            var floatreg = /^(-|\+)?\d+\.\d*$/;
                            if (typeof (result) == "string") {
                                $("input[name='" + options.primaryKey + "#" + options.key + "']").val(eval(cstr));
                                if (ctl.parents(".group-section").length == 0) {
                                    widget._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                                } else {
                                    if (ctl.parents("tr:first").hasClass("groupListEditRow")) {
                                        widget._updateGroupData({
                                            applet: ctl.parents("table:first").data("relatedApplet"),
                                            key: ctl.parents("tr:first").data("key"),
                                            column: ctl.data("column"),
                                            value: eval(cstr),
                                        });
                                        ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                    } else if (ctl.parents("tr:first").hasClass("groupListNewRow")) {
                                        widget._insertGroupData({
                                            applet: ctl.parents("table:first").data("relatedApplet"),
                                            key: ctl.parents("tr:first").data("key"),
                                            column: ctl.data("column"),
                                            value: eval(cstr),
                                        });
                                        ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                    }
                                }
                            } else if (typeof (result) == "number") {
                                if (intreg.test(result)) {
                                    ctl.val(eval(cstr));
                                    if (ctl.parents(".group-section").length == 0) {
                                        widget._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                                    } else {
                                        if (ctl.parents("tr:first").hasClass("groupListEditRow")) {
                                            widget._updateGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                        } else if (ctl.parents("tr:first").hasClass("groupListNewRow")) {
                                            widget._insertGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                        }
                                    }
                                } else if (floatreg.test(result)) {
                                    ctl.val(eval(cstr).toFixed(2));
                                    if (ctl.parents(".group-section").length == 0) {
                                        widget._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr).toFixed(2);
                                    } else {
                                        if (ctl.parents("tr:first").hasClass("groupListEditRow")) {
                                            widget._updateGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr).toFixed(2),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr).toFixed(2));
                                        } else if (ctl.parents("tr:first").hasClass("groupListNewRow")) {
                                            widget._insertGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr).toFixed(2),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr).toFixed(2));
                                        }
                                    }
                                }
                            }
                        } else {
                            ctl.val("");
                        }
                    }
                });
            } else {
                widget._addEventListener({
                    container: "body",
                    type: "change",
                    target: "select[name='" + options.primaryKey + "#" + ms + "']",
                    event: function () {
                        var flag = true;
                        var cstr = options.value;
                        for (var x = 0; x < cols.length; x++) {
                            var targetObj = $("input[name='" + options.primaryKey + "#" + cols[x] + "']");
                            if (!targetObj.length) {
                                targetObj = $("select[name='" + options.primaryKey + "#" + cols[x] + "']");
                            }
                            if (widget._getCalControlVal({
                                name: cols[x],
                                primaryKey: options.primaryKey,
                            }) < 0 || targetObj.parent().parent().hasClass("has-error")
                                || Iptools.Tool._blank_replacement(targetObj.val()) == "") {
                                flag = false;
                            } else {
                                cstr = cstr.replace(eval("/{" + cols[x] + "}/g"), widget._getCalControlVal({
                                    name: cols[x],
                                    primaryKey: options.primaryKey,
                                }));
                            }
                        }
                        if (flag) {
                            var result = eval(cstr);
                            var intreg = /^(-|\+)?\d+$/;
                            var floatreg = /^(-|\+)?\d+\.\d*$/;
                            var ctl = $("input[name='" + options.primaryKey + "#" + options.key + "']");
                            if (typeof (result) == "string") {
                                ctl.val(eval(cstr));
                                if (ctl.parents(".group-section").length == 0) {
                                    widget._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                                } else {
                                    if (ctl.parents("tr:first").hasClass("groupListEditRow")) {
                                        widget._updateGroupData({
                                            applet: ctl.parents("table:first").data("relatedApplet"),
                                            key: ctl.parents("tr:first").data("key"),
                                            column: ctl.data("column"),
                                            value: eval(cstr),
                                        });
                                        ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                    } else if (ctl.parents("tr:first").hasClass("groupListNewRow")) {
                                        widget._insertGroupData({
                                            applet: ctl.parents("table:first").data("relatedApplet"),
                                            key: ctl.parents("tr:first").data("key"),
                                            column: ctl.data("column"),
                                            value: eval(cstr),
                                        });
                                        ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                    }
                                }
                            } else if (typeof (result) == "number") {
                                if (intreg.test(result)) {
                                    ctl.val(eval(cstr));
                                    if (ctl.parents(".group-section").length == 0) {
                                        widget._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                                    } else {
                                        if (ctl.parents("tr:first").hasClass("groupListEditRow")) {
                                            widget._updateGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                        } else if (ctl.parents("tr:first").hasClass("groupListNewRow")) {
                                            widget._insertGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr));
                                        }
                                    }
                                } else if (floatreg.test(result)) {
                                    ctl.val(eval(cstr).toFixed(2));
                                    if (ctl.parents(".group-section").length == 0) {
                                        widget._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr).toFixed(2);
                                    } else {
                                        if (ctl.parents("tr:first").hasClass("groupListEditRow")) {
                                            widget._updateGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr).toFixed(2),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr).toFixed(2));
                                        } else if (ctl.parents("tr:first").hasClass("groupListNewRow")) {
                                            widget._insertGroupData({
                                                applet: ctl.parents("table:first").data("relatedApplet"),
                                                key: ctl.parents("tr:first").data("key"),
                                                column: ctl.data("column"),
                                                value: eval(cstr).toFixed(2),
                                            });
                                            ctl.parents("td:first").find(".editControlText").html(eval(cstr).toFixed(2));
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    },
    _setPeriodEndDate: function (date, period) {
        date = new Date(date);
        var tyear = date.getFullYear();
        var tmonth = date.getMonth();
        var tday = date.getDate();
        var nyear = parseInt(tyear);
        var nmonth = tmonth + parseInt(period);
        var nday = parseInt(tday);
        if (nmonth > 13) {
            nyear += nmonth / 12;
            nmonth = nmonth % 12;
        }
        var tdate = new Date(nyear, nmonth + 1, 0);
        var cday = tdate.getDate();
        var ndate;
        var rdate;
        if (cday >= nday) {
            ndate = new Date(nyear, nmonth, nday);
            rdate = new Date(ndate.getTime() - (1 * 24 * 60 * 60 * 1000));
        } else {
            ndate = new Date(nyear, nmonth, cday);
            rdate = ndate;
        }
        return rdate.format("yyyy-MM-dd");
    },
    _addDayToDate: function (date, day) {
        var rdate = new Date((new Date(date)).getTime() + parseInt(day) * 24 * 60 * 60 * 1000);
        return rdate.format("yyyy-MM-dd");
    },
    _addMonthToDate: function (date, month) {
        date = new Date(date);
        var tyear = date.getFullYear();
        var tmonth = date.getMonth();
        var tday = date.getDate();
        var nyear = parseInt(tyear);
        var nmonth = tmonth + parseInt(month);
        var nday = parseInt(tday);
        if (nmonth > 13) {
            nyear += nmonth / 12;
            nmonth = nmonth % 12;
        }
        var tdate = new Date(nyear, nmonth + 1, 0);
        var cday = tdate.getDate();
        var ndate;
        var rdate;
        if (cday >= nday) {
            ndate = new Date(nyear, nmonth, nday);
            rdate = ndate;
        } else {
            ndate = new Date(nyear, nmonth, cday);
            rdate = ndate;
        }
        return rdate.format("yyyy-MM-dd");
    },
    _reducePeriodToNow: function (date, total) {
        var ndate = new Date();
        var tdate = new Date(date);
        var nyear = parseInt(ndate.getFullYear());
        var nmonth = parseInt(ndate.getMonth());
        var nday = ndate.getDate();
        var tyear = parseInt(tdate.getFullYear());
        var tmonth = parseInt(tdate.getMonth());
        var tday = tdate.getDate();
        var period = tmonth - nmonth;
        if (tyear > nyear) {
            period += 12 * (tyear - nyear);
        }
        if (period < 0) {
            return "0";
        } else if (period == 0) {
            if (tday > nday) {
                return "1";
            } else {
                return "0";
            }
        } else {
            if (period + 1 > parseInt(total)) {
                return total;
            } else {
                return (period + 1).toString();
            }
        }
    },
    _enableTimeOrDateField: function () {
        $(".timeStampPicker").datetimepicker({
            format: "yyyy-mm-dd hh:ii:ss",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
        }).on('hide', function () {
            var me = $(this);
            me.trigger("input");
            me.trigger("blur");
            $("#" + me.data("form")).data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
        $(".dateStampPicker").datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: "month"
        }).on('hide', function () {
            var me = $(this);
            me.trigger("input");
            me.trigger("blur");
            $("#" + me.data("form")).data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
        });
    },
    _enableControlCalLinkBinding: function () {
        for (var i = 0; i < widget._UIDEFAULFS.controlCalLinks.length; i++) {
            widget._setControlCalLinks({
                primaryKey: widget._UIDEFAULFS.controlCalLinks[i].primaryKey,
                key: widget._UIDEFAULFS.controlCalLinks[i].key,
                value: widget._UIDEFAULFS.controlCalLinks[i].value
            });
        }
    },
    _enablePickItemModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: "#detailControlSearchModal",
            event: function (e) {
                var btn = $(e.relatedTarget);
                var me = $(this);
                e = e || event;
                e.stopPropagation();
                btn.addClass("currentDetailSearchTarget");
                Iptools.uidataTool._getUserlistAppletData({
                    async: false,
                    view: Iptools.DEFAULTS.currentView,
                    appletId: btn.data("applet"),
                    pageNow: 1,
                    pageSize: Iptools.DEFAULTS.pageSize
                }, function (ds) {
                    if (ds.applet.type == "list") {
                        var container = "modalContainer_" + Math.floor(Math.random() * 10);
                        me.find("#modalList_body").html("");
                        me.find("#modalList_body").append(widget._setTableAppletContent({
                            data: ds,
                            pageNow: 1,
                            pageSize: Iptools.DEFAULTS.pageSize,
                            container: container,
                        }));
                        widget._setControlSearchContent({
                            view: Iptools.DEFAULTS.currentView,
                            appletId: btn.data("applet"),
                            pageNow: 1,
                            pageSize: Iptools.DEFAULTS.pageSize,
                            container: container
                        });
                    }
                });
                me.css("margin-top", function () {
                    return btn.offset().top - 240;
                });
            }
        });
    },
    _enableDetailSearchModalPick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".detailSearchPick",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var container = $(this).parent().parent().find("#modalList_body");
                var selectTrds = container.find("input[name='modalListRadio']:checked");
                if (selectTrds.length) {
                    var index = 1;
                    container.find("th").each(function (key, obj) {
                        if ($(obj).hasClass("pickColumn")) {
                            index = key;
                        }
                    });
                    var value = selectTrds.parent().parent().find("td").eq(index).html();
                    var target = $(".currentDetailSearchTarget").parent().parent().find("input");
                    target.data("key", selectTrds.data("key"));
                    target.val(value);
                    $(widget._UIDEFAULFS.detailSelectModal).modal("hide");
                    if (target.data("valid")) {
                        $("#" + target.data("form")).data("bootstrapValidator").updateStatus(target.attr("name"), "NOT_VALIDATED").validateField(target.attr("name"));
                    }
                    target.trigger("blur");
                    $(".currentDetailSearchTarget").removeClass("currentDetailSearchTarget");
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "未选择项"
                    });
                }
            }
        });
    },
    _enableDetailSearchModalClear: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".clearSearchPick",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var target = $(this).parent().parent().find("input");
                target.data("key", "");
                target.val("");
                target.attr("title", "");
                if (target.data("valid")) {
                    $("#" + target.data("form")).data("bootstrapValidator").updateStatus(target.attr("name"), "NOT_VALIDATED").validateField(target.attr("name"));
                }
            }
        });
    },
    _enableImageControl: function () {
        widget._addEventListener({
            container: "body",
            type: "change",
            target: ".img-file input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                if (me[0].files.length) {
                    var f = me[0].files[0];
                    if (f.size / 1024 > 500) {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "上传图片大小不可大于500K"
                        });
                    } else {
                        var src = window.URL.createObjectURL(f);
                        me.parent().parent().find("img").attr("src", src);
                        me.parent().parent().find(".lightboxLink").data("has", false);
                        me.parent().parent().find(".lightboxLink").data("change", true);
                        me.parent().parent().find(".lightboxLink").attr("href", src);
                    }
                } else {
                    me.parent().parent().find("img").attr("src", widget._UIDEFAULFS.defaultPicturePath);
                    me.parent().parent().find(".lightboxLink").data("has", false);
                    me.parent().parent().find(".lightboxLink").attr("href", widget._UIDEFAULFS.defaultPicturePath);
                }
            }
        });
    },
    _enableFileControl: function () {
        widget._addEventListener({
            container: "body",
            type: "change",
            target: ".file-upload input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                if (me[0].files.length > 0) {
                    var ctrl = me.parent().parent();
                    var filename = me[0].files[0].name;
                    var iconUrl;
                    if (filename.indexOf("doc") > 0) {
                        iconUrl = widget._UIDEFAULFS.defaultWordPath;
                    } else if (filename.indexOf("xls") > 0) {
                        iconUrl = widget._UIDEFAULFS.defaultExcelPath;
                    } else if (filename.indexOf("ppt") > 0) {
                        iconUrl = widget._UIDEFAULFS.defaultPPTPath;
                    } else {
                        iconUrl = widget._UIDEFAULFS.defaultFilePath;
                    }
                    ctrl.find("img").attr("src", iconUrl);
                    ctrl.find("p").html(filename);
                    ctrl.find("span").html("更改");
                    ctrl.data("has", false);
                    ctrl.data("change", true);
                }
            }
        });
    },
    _enableLightbox: function () {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        });
        lightbox.init();
    },
    _enablePaginationNext: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".pagination .arrow-right",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var pageNow = parseInt(me.data("page"));
                var pageTotal = parseInt(me.data("total"));
                var container = $("#" + me.data("parent"));
                var cond = [];
                if (me.data("extra") != "extra") {
                    cond = $(widget._UIDEFAULFS.searchForm).find("input[type='hidden']").val();
                }
                var condition = cond ? cond : [];
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (pageNow < pageTotal) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                pageNow: pageNow + 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setListAppletMainData({
                                        data: ds,
                                        pageNow: pageNow + 1,
                                        condition: condition,
                                        container: me.data("parent")
                                    }));
                                }
                            });
                            me.data("page", pageNow + 1);
                            me.parent().find(".arrow-left").data("page", pageNow + 1);
                            me.parent().find(".pagenum").html((pageNow + 1) + "/" + pageTotal);
                        }
                        break;
                    case "table":
                        if (pageNow < pageTotal) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                pageNow: pageNow + 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: null,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setTableAppletMainData({
                                        data: ds,
                                        pageNow: pageNow + 1,
                                        pageSize: Iptools.DEFAULTS.pageSize,
                                        container: me.data("parent"),
                                        type: me.data("extra"),
                                    }));
                                }
                            });
                            me.data("page", pageNow + 1);
                            me.parent().find(".arrow-left").data("page", pageNow + 1);
                            me.parent().find(".pagenum").html((pageNow + 1) + "/" + pageTotal);
                            var pageNowCount = Iptools.DEFAULTS.pageSize;
                            if (pageNow + 1 == pageTotal) {
                                pageNowCount = me.data("rowcount") - pageNow * pageNowCount;
                            }
                            me.parent().parent().find(".pageCountCalText").html("本页" + pageNowCount + "条，共" + me.data("rowcount") + "条");
                        }
                        break;
                }
            }
        });
    },
    _enablePaginationPre: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".pagination .arrow-left",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var pageNow = parseInt(me.data("page"));
                var pageTotal = parseInt(me.data("total"));
                var container = $("#" + me.data("parent"));
                var cond = [];
                if (me.data("extra") != "extra") {
                    cond = $(widget._UIDEFAULFS.searchForm).find("input[type='hidden']").val();
                }
                var condition = cond ? cond : [];
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (pageNow > 1) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                pageNow: pageNow - 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setListAppletMainData({
                                        data: ds,
                                        pageNow: pageNow - 1,
                                        condition: condition,
                                        container: me.data("parent")
                                    }));
                                }
                            });
                            me.data("page", pageNow - 1);
                            me.parent().find(".arrow-right").data("page", pageNow - 1);
                            me.parent().find(".pagenum").html((pageNow - 1) + "/" + pageTotal);
                        }
                        break;
                    case "table":
                        if (pageNow > 1) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                pageNow: pageNow - 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: null,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setTableAppletMainData({
                                        data: ds,
                                        pageNow: pageNow - 1,
                                        pageSize: Iptools.DEFAULTS.pageSize,
                                        container: me.data("parent"),
                                        type: me.data("extra"),
                                    }));
                                }
                            });
                            me.data("page", pageNow - 1);
                            me.parent().find(".arrow-right").data("page", pageNow - 1);
                            me.parent().find(".pagenum").html((pageNow - 1) + "/" + pageTotal);
                            me.parent().parent().find(".pageCountCalText").html("本页" + Iptools.DEFAULTS.pageSize + "条，共" + me.data("rowcount") + "条");
                        }
                        break;
                }
            }
        });
    },
    _enablePaginationClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".pagination .pageButton",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var pageNow = parseInt(me.parent().find("input").val());
                var pageCurrent = parseInt(me.parent().find(".arrow-right").data("page"));
                var pageTotal = parseInt(me.data("total"));
                var container = $("#" + me.data("parent"));
                var cond = [];
                if (me.data("extra") != "extra") {
                    cond = $(widget._UIDEFAULFS.searchForm).find("input[type='hidden']").val();
                }
                var condition = cond ? cond : [];
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (pageNow > 0 && pageNow != pageCurrent && !(pageNow > pageTotal)) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                pageNow: pageNow,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setListAppletMainData({
                                        data: ds,
                                        pageNow: pageNow,
                                        condition: condition,
                                        container: me.data("parent")
                                    }));
                                }
                            });
                            me.data("page", pageNow);
                            me.parent().find(".arrow-right").data("page", pageNow);
                            me.parent().find(".arrow-left").data("page", pageNow);
                            me.parent().find(".pagenum").html((pageNow) + "/" + pageTotal);
                        }
                        break;
                    case "table":
                        if (pageNow > 0 && pageNow != pageCurrent && !(pageNow > pageTotal)) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                valueId: Iptools.DEFAULTS.currentViewValue,
                                pageNow: pageNow,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: null,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setTableAppletMainData({
                                        data: ds,
                                        pageNow: pageNow,
                                        pageSize: Iptools.DEFAULTS.pageSize,
                                        container: me.data("parent"),
                                        type: me.data("extra"),
                                    }));
                                }
                            });
                            me.data("page", pageNow);
                            me.parent().find(".arrow-right").data("page", pageNow);
                            me.parent().find(".arrow-left").data("page", pageNow);
                            me.parent().find(".pagenum").html((pageNow) + "/" + pageTotal);
                            var pageNowCount = Iptools.DEFAULTS.pageSize;
                            if (pageNow == pageTotal) {
                                pageNowCount = me.data("rowcount") - (pageNow - 1) * pageNowCount;
                            }
                            me.parent().parent().find(".pageCountCalText").html("本页" + pageNowCount + "条，共" + me.data("rowcount") + "条");
                        }
                        break;
                }
                me.parent().find("input").val("");
                return false;
            }
        });
    },
    _enableDataSave: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".SaveDataBtn",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                btn.button("loading");
                btn.css("cursor", "not-allowed");
                var me = $(this).data("form");
                $("#" + me).bootstrapValidator('validate');
                if ($("#" + me).data("bootstrapValidator").isValid()) {
                    var dataImg = $("#" + me).find(".lightboxLink");
                    var datafile = $("#" + me).find(".file-data");
                    dataImg.each(function () {
                        var ctrl = $(this);
                        var value;
                        if (ctrl.data("has")) {
                            value = ctrl.attr("href");
                        } else {
                            value = "";
                        }
                        if ($(this).data("change")) {
                            var imgPath;
                            var paraData = new FormData();
                            paraData.append("file", $(this).parent().find("input")[0].files[0]);
                            Iptools.uidataTool._uploadfileData({
                                data: paraData,
                                type: "picture"
                            }, function (path) {
                                imgPath = Iptools.DEFAULTS.serviceUrl + path;
                                widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")] = imgPath;
                            });
                        } else {
                            if (widget._UIDEFAULFS.DataOriginalSets[me][ctrl.data("column")] != value) {
                                widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")] = value;
                            } else {
                                delete widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")];
                            }
                        }

                    });
                    datafile.each(function () {
                        var value;
                        var ctl = $(this);
                        if ($(this).data("has")) {
                            value = $(this).data("val");
                        } else {
                            value = "";
                        }
                        if ($(this).data("change")) {
                            if ($(this).find("input")[0].files.length) {
                                var filepath;
                                var filename = ctl.find("input")[0].files[0].name;
                                var paraData = new FormData();
                                paraData.append("file", ctl.find("input")[0].files[0]);
                                Iptools.uidataTool._uploadfileData({
                                    data: paraData,
                                    type: "file"
                                }, function (path) {
                                    filepath = Iptools.DEFAULTS.serviceUrl + path;
                                    widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")] = filename + "|" + filepath;
                                });
                            }
                        } else {
                            if (widget._UIDEFAULFS.DataOriginalSets[me][ctl.data("column")] != value) {
                                widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")] = value;
                            } else {
                                delete widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")];
                            }
                        }
                    });
                    var appletId = $(this).data("applet");
                    var valueId = Iptools.DEFAULTS.currentViewValue;
                    if ($.isEmptyObject(widget._UIDEFAULFS.DataCurrentSets[me])) {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "未更新数据"
                        });
                    } else {
                        Iptools.uidataTool._saveAppletData({
                            appletId: appletId,
                            valueId: valueId,
                            data: JSON.stringify(widget._UIDEFAULFS.DataCurrentSets[me])
                        }, function () {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "更新完成"
                            });
                        }, function () {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "更新失败"
                            });
                        });
                        widget._reFreshView();
                    }
                }
                setTimeout(function () {
                    btn.button("reset");
                    btn.css("cursor", "pointer");
                }, 1000);
            }
        });
    },
    _enableContactDataSave: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".contactSaveDataBtn",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                btn.button("loading");
                btn.css("cursor", "not-allowed");
                var me = $(this).data("form");
                $("#" + me).bootstrapValidator('validate');
                if ($("#" + me).data("bootstrapValidator").isValid()) {
                    var phone = "";
                    var flag = false;
                    for (var item in widget._UIDEFAULFS.DataCurrentSets[me]) {
                        if (item.split("_")[1] == "phone") {
                            phone = widget._UIDEFAULFS.DataCurrentSets[me][item];
                            break;
                        }
                    }
                    if (Iptools.Tool._checkNull(phone)) {
                        Iptools.GetJson({
                            async: false,
                            url: "basic/contactsSearch",
                            data: {
                                tenantId: Iptools.DEFAULTS.tenantId,
                                phone: phone,
                            },
                            success: function (r) {
                                if (r && r.contactList.length > 0) {
                                    flag = true;
                                }
                            }
                        });
                    }
                    if (flag) {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "手机号码已存在"
                        });
                        setTimeout(function () {
                            btn.button("reset");
                            btn.css("cursor", "pointer");
                        }, 1000);
                        return;
                    }
                    var dataImg = $("#" + me).find(".lightboxLink");
                    var datafile = $("#" + me).find(".file-data");
                    dataImg.each(function () {
                        var ctrl = $(this);
                        var value;
                        if (ctrl.data("has")) {
                            value = ctrl.attr("href");
                        } else {
                            value = "";
                        }
                        if ($(this).data("change")) {
                            var imgPath;
                            var paraData = new FormData();
                            paraData.append("file", $(this).parent().find("input")[0].files[0]);
                            Iptools.uidataTool._uploadfileData({
                                data: paraData,
                                type: "picture"
                            }, function (path) {
                                imgPath = Iptools.DEFAULTS.serviceUrl + path;
                                widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")] = imgPath;
                            });
                        } else {
                            if (widget._UIDEFAULFS.DataOriginalSets[me][ctrl.data("column")] != value) {
                                widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")] = value;
                            } else {
                                delete widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")];
                            }
                        }

                    });
                    datafile.each(function () {
                        var value;
                        var ctl = $(this);
                        if ($(this).data("has")) {
                            value = $(this).data("val");
                        } else {
                            value = "";
                        }
                        if ($(this).data("change")) {
                            if ($(this).find("input")[0].files.length) {
                                var filepath;
                                var filename = ctl.find("input")[0].files[0].name;
                                var paraData = new FormData();
                                paraData.append("file", ctl.find("input")[0].files[0]);
                                Iptools.uidataTool._uploadfileData({
                                    data: paraData,
                                    type: "file"
                                }, function (path) {
                                    filepath = Iptools.DEFAULTS.serviceUrl + path;
                                    widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")] = filename + "|" + filepath;
                                });
                            }
                        } else {
                            if (widget._UIDEFAULFS.DataOriginalSets[me][ctl.data("column")] != value) {
                                widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")] = value;
                            } else {
                                delete widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")];
                            }
                        }
                    });
                    var appletId = $(this).data("applet");
                    var valueId = Iptools.DEFAULTS.currentViewValue;
                    if ($.isEmptyObject(widget._UIDEFAULFS.DataCurrentSets[me])) {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "未更新数据"
                        });
                    } else {
                        Iptools.uidataTool._saveAppletData({
                            appletId: appletId,
                            valueId: valueId,
                            data: JSON.stringify(widget._UIDEFAULFS.DataCurrentSets[me])
                        }, function () {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "更新完成"
                            });
                        }, function () {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "更新失败"
                            });
                        });
                        widget._reFreshView();
                    }
                }
                setTimeout(function () {
                    btn.button("reset");
                    btn.css("cursor", "pointer");
                }, 1000);
            }
        });
    },
    _enableViewLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".hyperLinkAView",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                Iptools.uidataTool._getView({
                    view: $(this).data("key"),
                }, function (data) {
                    Iptools.Tool._jumpView({
                        view: btn.data("key"),
                        name: data.view.name,
                        type: data.view.type,
                        valueId: btn.data("id"),
                        primary: data.view.primary,
                        icon: data.view.icon,
                        url: data.view.url,
                        bread: true,
                    });
                });
            }
        });
    },
    _spiltCalLink: function (options) {
        var res = [];
        while (options.str.indexOf("{") > -1) {
            var tstr = options.str.substring(options.str.indexOf("{") + 1);
            var kstr = tstr.substring(0, tstr.indexOf("}"));
            if (res.indexOf(kstr) < 0) {
                res.push(kstr);
            }
            options.str = tstr;
        }
        return res;
    },
    _getCalControlVal: function (options) {
        var targetObj = $("input[name='" + options.primaryKey + "#" + options.name + "']");
        if (!targetObj.length) {
            targetObj = $("select[name='" + options.primaryKey + "#" + options.name + "']");
        }
        var val = targetObj.val();
        var intreg = /^(-|\+)?\d+$/;
        var floatreg = /^(-|\+)?\d+\.\d*$/;
        if (intreg.test(val) || floatreg.test(val)) {
            return val;
        } else {
            return "'" + val + "'";
        }
    },
    _enableSwitchControl: function () {
        $(".switch-checkbox").each(function (key, obj) {
            var options = {
                onColor: "info",
                offColor: "default",
                onText: "是",
                offText: "否",
                labelWidth: "40",
                handleWidth: "60",
                labelText: "<i class='icon-exchange'></i>"
            };
            if (!obj.checked) {
                options.state = false;
            }
            if ($(obj).attr("disabled") == "disabled") {
                options.disabled = true;
            }
            $(obj).bootstrapSwitch(options);
        });
    },
    _enableRichTextArea: function () {
        $(".richtext-area").summernote({
            lang: 'zh-CN',
            minHeight: 150,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['table', ['table']],
                ['insert', ['link', 'picture']],
                ['para', ['paragraph']],
                ['Misc', ['fullscreen', 'undo']]
            ],
            callbacks: {
                onBlur: function () {
                    var value = $(this).summernote("code").replace(Iptools.DEFAULTS.qoutorReg, '');
                    var col = $(this).data("column");
                    var sets = $(this).parents("form:first").attr("id");
                    if (widget._UIDEFAULFS.DataOriginalSets[sets][col] != value) {
                        widget._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                    } else {
                        delete widget._UIDEFAULFS.DataCurrentSets[sets][col];
                    }
                },
            }
        });
    },
    _enableCheckboxAll: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".checkAll",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = this;
                var pan = $(this).parents("table");
                var nav = $(this).parents(".detail-list").find(".search-function-container");
                if (btn.checked) {
                    pan.find("input[name='list-item']").each(function () {
                        this.checked = true;
                    });
                    nav.find(".appletDeleteBtn").removeClass("input-disabled");
                    nav.find(".appletPrintBtn").removeClass("input-disabled");
                } else {
                    pan.find("input[name='list-item']").each(function () {
                        this.checked = false;
                    });
                    nav.find(".appletDeleteBtn").addClass("input-disabled");
                    nav.find(".appletPrintBtn").addClass("input-disabled");
                }
            }
        });
    },
    _enableListItemClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".hyperTr",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var row = $(this);
                var pan = row.parent().parent();
                var nav = $(this).parents(".detail-list").find(".search-function-container");
                var check = row.find("input[name='list-item']")[0];

                if (check.checked) {
                    check.checked = false;
                    if (!pan.find("input[name='list-item']:checked").length) {
                        nav.find(".appletDeleteBtn").addClass("input-disabled");
                        nav.find(".appletPrintBtn").addClass("input-disabled");
                    }
                    pan.find(".checkAll")[0].checked = false;
                } else {
                    check.checked = true;
                    nav.find(".appletDeleteBtn").removeClass("input-disabled");
                    nav.find(".appletPrintBtn").removeClass("input-disabled");
                    if (pan.find("input[name='list-item']:checked").length == pan.find("input[name='list-item']").length) {
                        pan.find(".checkAll")[0].checked = true;
                    }
                }
            }
        });
    },
    _enableListItemCheckboxClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "input[name='list-item']",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = this;
                var pan = $(this).parents("table").parent().parent();
                var nav = $(this).parents(".detail-list").find(".search-function-container");
                if (me.checked) {
                    nav.find(".appletDeleteBtn").removeClass("input-disabled");
                    nav.find(".appletPrintBtn").removeClass("input-disabled");
                    if (pan.find("input[name='list-item']:checked").length == pan.find("input[name='list-item']").length) {
                        pan.find(".checkAll")[0].checked = true;
                    }
                } else {
                    if (!pan.find("input[name='list-item']:checked").length) {
                        nav.find(".appletDeleteBtn").addClass("input-disabled");
                        nav.find(".appletPrintBtn").addClass("input-disabled");
                    }
                    pan.find(".checkAll")[0].checked = false;
                }
            }
        });
    },
    _enableMainNewView: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".listPanelBtnNewView",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                Iptools.Tool._newView({
                    applet: btn.data("key"),
                });
            }
        });
    },
    _enableDataDelete: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".appletDeleteBtn",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var target = me.parents(".detail-list").eq(0).find("input[name='list-item']:checked");
                var arr = [];
                target.each(function (key, obj) {
                    arr.push($(obj).data("key"));
                });
                arr = arr.join(',');
                if (confirm("确定删除？")) {
                    Iptools.uidataTool._deleteAppletData({
                        appletId: me.data("applet"),
                        valueIds: arr,
                        para: "?tenantId=" + Iptools.DEFAULTS.tenantId + "&userId=" + Iptools.DEFAULTS.userId + "&appletId=" + me.data("applet") + "&valueIds=" + arr,
                    }, function (r) {
                        if (r.retcode == "fail") {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: r.retmsg
                            });
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "删除完成"
                            });
                        }
                    }, function () {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "删除失败"
                        });
                    });
                    widget._reFreshView();
                }
            }
        });
    },
    _enableListSelectModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: "#listSelectButtonModal",
            event: function (e) {
                var btn = $(e.relatedTarget);
                var me = $(this);
                e = e || event;
                e.stopPropagation();
                btn.addClass("currentListSelectTarget");
                Iptools.uidataTool._getUserlistAppletData({
                    async: false,
                    view: Iptools.DEFAULTS.currentView,
                    appletId: btn.data("applet"),
                    pageNow: 1,
                    pageSize: Iptools.DEFAULTS.pageSize
                }, function (ds) {
                    if (ds.applet.type == "list") {
                        me.find(widget._UIDEFAULFS.listSelectPanle).html("");
                        me.find(widget._UIDEFAULFS.listSelectPanle).append(widget._setTableAppletContent({
                            data: ds,
                            pageNow: 1,
                            pageSize: Iptools.DEFAULTS.pageSize,
                            container: "modalContainer_" + Math.floor(Math.random() * 10),
                            type: "extra",
                        }));
                    }
                });
            }
        });
    },
    _enableListSelectModalPick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".listAppletSelect",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var container = $(this).parent().parent().find(widget._UIDEFAULFS.listSelectPanle);
                var selectTrds = container.find("input[name='modalListCheckbox']:checked");
                if (selectTrds.length) {
                    var target = $(".currentListSelectTarget");
                    var cbc = 0;
                    Iptools.uidataTool._getApplet({
                        async: false,
                        applet: Iptools.DEFAULTS.currentViewApplet
                    }, function (das) {
                        cbc = das.applet.bc;
                    });
                    var pbc = 0;
                    Iptools.uidataTool._getApplet({
                        async: false,
                        applet: target.data("applet")
                    }, function (das) {
                        pbc = das.applet.bc;
                    });
                    var links = Iptools.uidataTool._getAppletLinks({
                        pbc: pbc,
                        cbc: cbc,
                    });
                    if (links.destinationFields.length > 0) {
                        selectTrds.each(function (key, obj) {
                            var fieldData = "[{'" + links.destinationFields[0].columnName + "':'" + Iptools.DEFAULTS.currentViewValue + "'}]";
                            var appletId = target.data("applet");
                            var valueId = $(obj).data("key");
                            Iptools.uidataTool._saveAppletData({
                                appletId: appletId,
                                valueId: valueId,
                                data: fieldData
                            }, function () {
                            }, function () {
                            });
                        });
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "添加完成"
                        });
                    }
                    $(widget._UIDEFAULFS.listSelectModal).modal("hide");
                    $(".currentListSelectTarget").removeClass("currentListSelectTarget");
                    widget._reFreshView();
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "未选择项"
                    });
                }
            }
        });
    },
    _enableListRemove: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".listSelectBtn",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var target = me.parent().parent().find("input[name='list-item']:checked");
                var cbc = 0;
                Iptools.uidataTool._getApplet({
                    async: false,
                    applet: Iptools.DEFAULTS.currentViewApplet
                }, function (das) {
                    cbc = das.applet.bc;
                });
                var pbc = 0;
                Iptools.uidataTool._getApplet({
                    async: false,
                    applet: me.data("applet")
                }, function (das) {
                    pbc = das.applet.bc;
                });
                var links = Iptools.uidataTool._getAppletLinks({
                    pbc: pbc,
                    cbc: cbc,
                });
                if (confirm("确定移除？")) {
                    if (links.destinationFields.length > 0) {
                        target.each(function (key, obj) {
                            var fieldData = "[{'" + links.destinationFields[0].columnName + "':''}]";
                            var appletId = me.data("applet");
                            var valueId = $(obj).data("key");
                            Iptools.uidataTool._saveAppletData({
                                appletId: appletId,
                                valueId: valueId,
                                data: fieldData
                            }, function () {
                            }, function () {
                            });
                        });
                    }
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "移除完成",
                    });
                    widget._reFreshView();
                }
            }
        });
    },
    _enableControlSearchSubmit: function () {
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".control-search-form",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var condition = widget._setSearchParaContext();
                $(widget._UIDEFAULFS.searchForm).append("<input type='hidden' value='" + condition + "' />");
                Iptools.uidataTool._getUserlistAppletData({
                    async: false,
                    view: Iptools.DEFAULTS.currentView,
                    appletId: me.find("button").data("applet"),
                    pageNow: 1,
                    pageSize: Iptools.DEFAULTS.pageSize,
                    condition: condition,
                    orderByColumn: null,
                    orderByAscDesc: null,
                }, function (ds) {
                    if (ds.applet.type == "list") {
                        $(widget._UIDEFAULFS.detailSearchPanle).html("");
                        $(widget._UIDEFAULFS.detailSearchPanle).append(widget._setTableAppletContent({
                            data: ds,
                            pageNow: 1,
                            condition: condition,
                            container: me.find("button").data("parent")
                        }));
                    }
                });
                return false;
            }
        });
    },
    _enableDateFormatProto: function () {
        Date.prototype.format = function (format) {
            var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                           ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        }
    },
    _enableControlChangeData: function () {
        widget._addEventListener({
            container: "body",
            type: "blur",
            target: ".control-normal-text",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var value;
                if (me.data("pick") == "1") {
                    value = me.data("key");
                } else {
                    value = me.val().trim();
                }
                var col = me.data("column");
                if (me.parents(".group-section-list").length == 0) {
                    var sets = me.parents("form:first").attr("id");
                    if (widget._UIDEFAULFS.DataOriginalSets[sets][col] != value) {
                        widget._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                    } else {
                        delete widget._UIDEFAULFS.DataCurrentSets[sets][col];
                    }
                } else {
                    if (me.parents("tr:first").hasClass("groupListEditRow")) {
                        widget._updateGroupData({
                            applet: me.parents("table:first").data("relatedApplet"),
                            key: me.parents("tr:first").data("key"),
                            column: col,
                            value: value,
                        });
                        if (me.data("type") == "percent") {
                            me.parents("td:first").find(".editControlText").html(me.val().trim() + "%");
                        } else if (me.data("type") == "rmb") {
                            me.parents("td:first").find(".editControlText").html("￥" + me.val().trim());
                        } else {
                            me.parents("td:first").find(".editControlText").html(me.val().trim());
                        }
                    } else if (me.parents("tr:first").hasClass("groupListNewRow")) {
                        widget._insertGroupData({
                            applet: me.parents("table:first").data("relatedApplet"),
                            key: me.parents("tr:first").data("key"),
                            column: col,
                            value: value,
                        });
                        if (me.data("type") == "percent") {
                            me.parents("td:first").find(".editControlText").html(me.val().trim() + "%");
                        } else if (me.data("type") == "rmb") {
                            me.parents("td:first").find(".editControlText").html("￥" + me.val().trim());
                        } else {
                            me.parents("td:first").find(".editControlText").html(me.val().trim());
                        }
                    }
                }
            }
        });
        widget._addEventListener({
            container: "body",
            type: "change",
            target: ".control-normal-select",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var value = me.val();
                var col = me.data("column");
                if (me.parents(".group-section-list").length == 0) {
                    var sets = me.parents("form:first").attr("id");
                    if (widget._UIDEFAULFS.DataOriginalSets[sets][col] != value) {
                        widget._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                    } else {
                        delete widget._UIDEFAULFS.DataCurrentSets[sets][col];
                    }
                } else {
                    if (me.parents("tr:first").hasClass("groupListEditRow")) {
                        widget._updateGroupData({
                            applet: me.parents("table:first").data("relatedApplet"),
                            key: me.parents("tr:first").data("key"),
                            column: col,
                            value: value,
                        });
                        if (me.data("type") == "percent") {
                            me.parents("td:first").find(".editControlText").html(me.find("option:selected").text() + "%");
                        } else if (me.data("type") == "rmb") {
                            me.parents("td:first").find(".editControlText").html("￥" + me.find("option:selected").text());
                        } else {
                            me.parents("td:first").find(".editControlText").html(me.find("option:selected").text());
                        }
                    } else if (me.parents("tr:first").hasClass("groupListNewRow")) {
                        widget._insertGroupData({
                            applet: me.parents("table:first").data("relatedApplet"),
                            key: me.parents("tr:first").data("key"),
                            column: col,
                            value: value,
                        });
                        if (me.data("type") == "percent") {
                            me.parents("td:first").find(".editControlText").html(me.find("option:selected").text() + "%");
                        } else if (me.data("type") == "rmb") {
                            me.parents("td:first").find(".editControlText").html("￥" + me.find("option:selected").text());
                        } else {
                            me.parents("td:first").find(".editControlText").html(me.find("option:selected").text());
                        }
                    }
                }
            }
        });
        widget._addEventListener({
            container: "body",
            type: "change",
            target: ".cr-group input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if ($(this).parents(".group-section-list").length == 0) {
                    var sets = $(this).parents("form:first").attr("id");
                    var group = $(this).parents(".cr-group:first");
                    var col = group.data("column");
                    var value = widget._UIDEFAULFS.DataOriginalSets[sets][col];
                    var data = "";
                    if (group.find("input[type=checkbox]").length) {
                        $.each(group.find("input[type=checkbox]:checked"), function (lkey, lobj) {
                            data += lobj.value + "|";
                        });
                        value = data;
                    } else if (group.find("input[type=radio]").length) {
                        value = group.find("input[type=radio]:checked").val();
                    }
                    if (widget._UIDEFAULFS.DataOriginalSets[sets][col] != value) {
                        widget._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                    } else {
                        delete widget._UIDEFAULFS.DataCurrentSets[sets][col];
                    }
                }
            }
        });
        widget._addEventListener({
            container: "body",
            type: "blur",
            target: ".detailTextarea",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                if ($(this).parents(".group-section-list").length == 0) {
                    var value = $(this).val().trim();
                    var col = $(this).data("column");
                    var sets = $(this).parents("form:first").attr("id");
                    if (widget._UIDEFAULFS.DataOriginalSets[sets][col] != value) {
                        widget._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                    } else {
                        delete widget._UIDEFAULFS.DataCurrentSets[sets][col];
                    }
                }
            }
        });
        widget._addEventListener({
            container: "body",
            type: "switchChange.bootstrapSwitch",
            target: ".switch-checkbox",
            event: function (event, state) {
                if ($(this).parents(".group-section-list").length == 0) {
                    var value = state ? "1" : "0";
                    var col = $(this).data("column");
                    var sets = $(this).parents("form:first").attr("id");
                    if (widget._UIDEFAULFS.DataOriginalSets[sets][col] != value) {
                        widget._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                    } else {
                        delete widget._UIDEFAULFS.DataCurrentSets[sets][col];
                    }
                }
            }
        });
    },
    _reFreshView: function () {
        var options = {
            view: Iptools.DEFAULTS.currentView,
            valueId: Iptools.DEFAULTS.currentViewValue,
        };
        Iptools.uidataTool._getView({
            async: false,
            view: options.view,
        }, function (data) {
            options = Iptools.Tool._extend(options, {
                name: data.view.name,
                type: data.view.type,
                primary: data.view.primary,
                bread: false,
                url: data.view.url
            });
        });
        Iptools.Tool._reFreshView(options);
    },
    _enableListRefreshBtnClick: function () {
        widget._addEventListener({
            container: "body",
            target: ".listPanelBtnRefresh",
            type: "click",
            event: function () {
                var me = $(this);
                me.removeClass("listPanelBtnRefresh");
                me.button("loading");
                me.css("cursor", "not-allowed");
                setTimeout(function () {
                    widget._reFreshView();
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "刷新成功"
                    });
                }, 1000);
            }
        });
    },
    _enableDebtsPaperBuilding: function () {
        widget._addEventListener({
            container: "body",
            target: ".debts-paper",
            type: "click",
            event: function () {
                window.open("../DebtsPaper");
            }
        });
    },
    _enableDebtsListBuilding: function () {
        widget._addEventListener({
            container: "body",
            target: ".debts-list",
            type: "click",
            event: function () {
                window.open("../DebtsList");
            }
        });
    },
    _enableGroupHintLinkFunction: function () {
        $(".groupHintBtn").popover({
            html: "true",
            placement: "bottom",
            trigger: "hover",
            content: "<table class='group-table-hint-container'><tr>" +
                "<td><div class='group-table-hint'><span class='info'></span>新增<div></td>" +
                "<td><div class='group-table-hint'><span class='success'></span>编辑<div></td>" +
                "<td><div class='group-table-hint'><span class='danger'></span>删除<div></td>" +
                "</tr></table>"
        });
    },
    _enableGroupDataSave: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupSaveDataBtn",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                btn.button("loading");
                btn.addClass("input-disabled");
                var me = $(this).data("form");
                if (widget._UIDEFAULFS.DataGroupEditingStatus) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "编辑未完成"
                    });
                } else {
                    $("#" + me).bootstrapValidator('validate');
                    if ($("#" + me).data("bootstrapValidator").isValid()) {
                        var dataImg = $("#" + me).find(".lightboxLink");
                        var datafile = $("#" + me).find(".file-data");
                        dataImg.each(function () {
                            var ctrl = $(this);
                            var value;
                            if (ctrl.data("has")) {
                                value = ctrl.attr("href");
                            } else {
                                value = "";
                            }
                            if ($(this).data("change")) {
                                var imgPath;
                                var paraData = new FormData();
                                paraData.append("file", $(this).parent().find("input")[0].files[0]);
                                Iptools.uidataTool._uploadfileData({
                                    data: paraData,
                                    type: "picture"
                                }, function (path) {
                                    imgPath = Iptools.DEFAULTS.serviceUrl + path;
                                    widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")] = imgPath;
                                });
                            } else {
                                if (widget._UIDEFAULFS.DataOriginalSets[me][ctrl.data("column")] != value) {
                                    widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")] = value;
                                } else {
                                    delete widget._UIDEFAULFS.DataCurrentSets[me][ctrl.data("column")];
                                }
                            }

                        });
                        datafile.each(function () {
                            var value;
                            var ctl = $(this);
                            if ($(this).data("has")) {
                                value = $(this).data("val");
                            } else {
                                value = "";
                            }
                            if ($(this).data("change")) {
                                if ($(this).find("input")[0].files.length) {
                                    var filepath;
                                    var filename = ctl.find("input")[0].files[0].name;
                                    var paraData = new FormData();
                                    paraData.append("file", ctl.find("input")[0].files[0]);
                                    Iptools.uidataTool._uploadfileData({
                                        data: paraData,
                                        type: "file"
                                    }, function (path) {
                                        filepath = Iptools.DEFAULTS.serviceUrl + path;
                                        widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")] = filename + "|" + filepath;
                                    });
                                }
                            } else {
                                if (widget._UIDEFAULFS.DataOriginalSets[me][ctl.data("column")] != value) {
                                    widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")] = value;
                                } else {
                                    delete widget._UIDEFAULFS.DataCurrentSets[me][ctl.data("column")];
                                }
                            }
                        });
                        var valueId = Iptools.DEFAULTS.currentViewValue;
                        for (var i = 0; i < widget._UIDEFAULFS.DataGroupSets.New.length; i++) {
                            var data = widget._UIDEFAULFS.DataGroupSets.New[i];
                            delete data["key"];
                        }
                        if ($.isEmptyObject(widget._UIDEFAULFS.DataCurrentSets[me])
                            && widget._UIDEFAULFS.DataGroupSets.New.length == 0
                            && widget._UIDEFAULFS.DataGroupSets.Update.length == 0
                            && widget._UIDEFAULFS.DataGroupSets.Delete.length == 0) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "未更新数据"
                            });
                        } else {
                            Iptools.uidataTool._saveGroupAppletData({
                                valueId: valueId,
                                data: widget._UIDEFAULFS.DataCurrentSets[me],
                                cdata: widget._UIDEFAULFS.DataGroupSets
                            }, function () {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "更新完成"
                                });
                            }, function () {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "更新失败"
                                });
                            });
                            widget._reFreshView();
                        }
                    }
                }
                setTimeout(function () {
                    btn.button("reset");
                    btn.removeClass("input-disabled");
                }, 1000);
            }
        });
    },
    _enableEditUnLock: function () {
        widget._addEventListener({
            container: "body",
            target: ".detailEditUnLock",
            type: "click",
            event: function () {
                var me = $(this);
                var container = me.parents(".button-nav:first");
                var ad = document.createElement("a");
                var lid = document.createElement("li");
                var spd = document.createElement("span");
                $(ad).css("cursor", "pointer");
                $(ad).addClass("groupSaveDataBtn");
                $(ad).attr("data-loading-text", "<span class='icon-save icon-spin' style='margin-right:10px'></span>保存中");
                $(spd).addClass("icon-save");
                $(spd).css("margin-right", "10px");
                $(ad).append(spd, "保存");
                $(lid).append(ad);
                var ad2 = document.createElement("a");
                var lid2 = document.createElement("li");
                var spd2 = document.createElement("span");
                $(ad2).css("cursor", "pointer");
                $(ad2).addClass("revokeEditDataBtn");
                $(ad2).attr("data-loading-text", "<span class='icon-refresh icon-spin' style='margin-right:10px'></span>撤销中");
                $(spd2).addClass("icon-refresh");
                $(spd2).css("margin-right", "10px");
                $(ad2).append(spd2, "撤销编辑");
                $(lid2).append(ad2);
                container.html("");
                container.append(lid, lid2);
                $(".control-disabled").removeClass("control-disabled");
                $(".control-hidden").removeClass("control-hidden");
                $(".control-rich-text").addClass("richtext-area").removeClass("control-rich-text");
                widget._enableRichTextArea();
                //groupList change Status
                var a = document.createElement("a");
                var li = document.createElement("li");
                var sp = document.createElement("span");
                $(a).css("cursor", "pointer");
                $(a).addClass("groupListItemAdd");
                $(sp).addClass("icon-plus");
                $(sp).css("margin-right", "10px");
                $(a).append(sp, "添加");
                $(li).append(a);
                var a2 = document.createElement("a");
                var li2 = document.createElement("li");
                var sp2 = document.createElement("span");
                $(a2).css("cursor", "pointer");
                $(a2).addClass("groupHintBtn");
                $(sp2).addClass("icon-question-sign");
                $(sp2).css("margin-right", "10px");
                $(a2).append(sp2, "提示");
                $(li2).append(a2);
                $(".group-section-list .search-function-container .button-nav").html("");
                $(".group-section-list .search-function-container .button-nav").append(li, li2);
                $(".detail-column").hide();
                $(".group-section-list table thead tr").append("<th style='width:100px;'>操作</th>");
                $(".group-section-list table tbody tr").each(function (key, obj) {
                    if (!$(obj).hasClass("groupListNewRow")) {
                        $(obj).append(
                            "<td><div class='groupEditBtnGroup'><button class='btn btn-default icon-edit groupListEditShow'></button>" +
                            "<button class='btn btn-default icon-trash groupListEditTrash'></button></div></td>");
                    } else {
                        $(obj).find(".editControlTd .editControlText").hide();
                        $(obj).find(".editControlTd .editListFieldControlHidden").show();
                        $(obj).append(
                            "<td><div class='groupEditBtnGroup'><button class='btn btn-default icon-ok groupListNewConfirm'></button>" +
                            "<button class='btn btn-default icon-remove groupListNewRemove'></button></div></td>");
                    }
                });
                widget._enableGroupHintLinkFunction();
            }
        });
    },
    _enableGroupListEditShow: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListEditShow",
            type: "click",
            event: function () {
                var me = $(this);
                var tr = me.parent().parent().parent();
                var container = me.parents("table:first");
                if (container.find(".groupListEditRow").length == 0) {
                    tr.find(".editControlTd .editControlText").hide();
                    tr.find(".editControlTd .editListFieldControlHidden").show();
                    tr.addClass("groupListEditRow");
                    widget._UIDEFAULFS.DataGroupEditingStatus = true;
                    me.parents("table:first").parent().siblings("nav").find(".groupListItemAdd").addClass("input-disabled");
                    me.parent().html("<button class='btn btn-default icon-ok groupListEditConfirm'></button>");
                } else {
                    container.find(".groupListEditRow .groupListEditConfirm").click();
                    if (container.find(".groupListEditRow").length == 0) {
                        tr.find(".editControlTd .editControlText").hide();
                        tr.find(".editControlTd .editListFieldControlHidden").show();
                        tr.addClass("groupListEditRow");
                        widget._UIDEFAULFS.DataGroupEditingStatus = true;
                        me.parent().html("<button class='btn btn-default icon-ok groupListEditConfirm'></button>");
                    }
                }
            }
        });
    },
    _checkForGroupDataUpdate: function (options) {
        for (var i = 0; i < widget._UIDEFAULFS.DataGroupSets.Update.length; i++) {
            var data = widget._UIDEFAULFS.DataGroupSets.Update[i];
            if (data["appletId"] == options.applet && data["valueId"] == options.key) {
                return true;
            }
        }
        return false;
    },
    _enableGroupListEditConfirm: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListEditConfirm",
            type: "click",
            event: function () {
                var me = $(this);
                var tr = me.parent().parent().parent();
                $("#" + widget._UIDEFAULFS.groupListForm).bootstrapValidator('validate');
                if ($("#" + widget._UIDEFAULFS.groupListForm).data("bootstrapValidator").isValid()) {
                    if (widget._checkForGroupDataUpdate({
                        key: tr.data("key"),
                        applet: tr.parents("table:first").data("relatedApplet")
                    })) {
                        tr.addClass("success");
                    }
                    tr.removeClass("groupListEditRow");
                    widget._UIDEFAULFS.DataGroupEditingStatus = false;
                    tr.find(".editControlTd .editControlText").show();
                    tr.find(".editControlTd .editListFieldControlHidden").hide();
                    me.parents("table:first").parent().siblings("nav").find(".groupListItemAdd").removeClass("input-disabled");
                    me.parent().html("<button class='btn btn-default icon-edit groupListEditShow'></button>" +
                        "<button class='btn btn-default icon-trash groupListEditTrash'></button>");
                }
            }
        });
    },
    _enableGroupListEditTrash: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListEditTrash",
            type: "click",
            event: function () {
                var me = $(this);
                widget._deleteGroupData({
                    key: me.parents("tr:first").data("key"),
                    applet: me.parents("table:first").data("relatedApplet")
                });
                me.parent().parent().parent().addClass("danger");
                me.parent().html("<button class='btn btn-default icon-reply groupListEditRevert'></button>");
            }
        });
    },
    _enableGroupListEditRevert: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListEditRevert",
            type: "click",
            event: function () {
                var me = $(this);
                widget._removeDeleteGroupData({
                    key: me.parents("tr:first").data("key"),
                    applet: me.parents("table:first").data("relatedApplet")
                });
                me.parent().parent().parent().removeClass("danger");
                me.parent().html("<button class='btn btn-default icon-edit groupListEditShow'></button>" +
                    "<button class='btn btn-default icon-trash groupListEditTrash'></button>");
            }
        });
    },
    _enableGroupListNewShow: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListItemAdd",
            type: "click",
            event: function () {
                var me = $(this);
                me.addClass("input-disabled");
                var tr = me.parents(".search-function-container").eq(0).parent().find(".groupListNewRow");
                tr.show();
                widget._UIDEFAULFS.DataGroupEditingStatus = true;
                tr.data("key", (new Date().getTime()));
                me.parents(".search-function-container").eq(0).parent().find(".groupListEditShow").attr("disabled", "disabled");
            }
        });
    },
    _enableGroupListNewConfirm: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListNewConfirm",
            type: "click",
            event: function () {
                var me = $(this);
                $("#" + widget._UIDEFAULFS.groupListForm).bootstrapValidator('validate');
                if ($("#" + widget._UIDEFAULFS.groupListForm).data("bootstrapValidator").isValid()) {
                    var tr = document.createElement("tr");
                    $(tr).addClass("info");
                    var ntr = me.parents("table:first").find(".groupListNewRow");
                    var ntd = ntr.find(".editControlTd");
                    $(tr).data("key", ntr.data("key"));
                    for (var i = 0; i < ntd.length; i++) {
                        var xtd = ntd[i];
                        $(tr).append("<td>" + $(xtd).find(".editControlText").html() + "</td>");
                    }
                    $(tr).append("<td><div><button class='btn btn-default icon-trash groupListNewTrash'></div></td>");
                    $(".groupListItemAdd").removeClass("input-disabled");
                    me.parents("table:first").find(".groupListNewRow").after(tr);
                    me.parents("table:first").find(".groupListNewRow").hide();
                    me.parents("table:first").find(".groupListEditShow").removeAttr("disabled");
                    widget._clearGroupDataNew({ controls: ntr.find("input") });
                    widget._UIDEFAULFS.DataGroupEditingStatus = false;
                }
            }
        });
    },
    _enableGroupListNewRemove: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListNewRemove",
            type: "click",
            event: function () {
                var me = $(this);
                $(".groupListItemAdd").removeClass("input-disabled");
                me.parents("table:first").find(".groupListNewRow").hide();
                me.parents("table:first").find(".groupListEditShow").removeAttr("disabled");
                widget._removeInsertGroupData({
                    key: me.parents("tr:first").data("key"),
                    applet: me.parents("table:first").data("relatedApplet")
                });
                widget._clearGroupDataNew({ controls: me.parents("table:first").find(".groupListNewRow input") });
                widget._UIDEFAULFS.DataGroupEditingStatus = false;
            }
        });
    },
    _enableGroupListNewTrash: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupListNewTrash",
            type: "click",
            event: function () {
                var me = $(this);
                widget._removeInsertGroupData({
                    key: me.parents("tr:first").data("key"),
                    applet: me.parents("table:first").data("relatedApplet")
                });
                me.parents("tr:first").remove();
            }
        });
    },
    _updateGroupData: function (options) {
        var flag = true;
        for (var i = 0; i < widget._UIDEFAULFS.DataGroupSets.Update.length; i++) {
            var data = widget._UIDEFAULFS.DataGroupSets.Update[i];
            if (data["appletId"] == options.applet && data["valueId"] == options.key) {
                flag = false;
                data[options.column] = options.value;
            }
        }
        if (flag) {
            var newData = {
                appletId: options.applet,
                valueId: options.key,
            }
            newData[options.column] = options.value;
            widget._UIDEFAULFS.DataGroupSets.Update.push(newData);
        }
    },
    _insertGroupData: function (options) {
        var flag = true;
        for (var i = 0; i < widget._UIDEFAULFS.DataGroupSets.New.length; i++) {
            var data = widget._UIDEFAULFS.DataGroupSets.New[i];
            if (data["appletId"] == options.applet && data["key"] == options.key) {
                flag = false;
                data[options.column] = options.value;
            }
        }
        if (flag) {
            var newData = {
                appletId: options.applet,
                key: options.key,
            }
            newData[options.column] = options.value;
            widget._UIDEFAULFS.DataGroupSets.New.push(newData);
        }
    },
    _removeItemInArray: function (options) {
        var result = [];
        for (var i = 0; i < options.array.length; i++) {
            if (i != options.index) {
                result.push(options.array[i]);
            }
        }
        return result;
    },
    _removeInsertGroupData: function (options) {
        var index = -1;
        for (var i = 0; i < widget._UIDEFAULFS.DataGroupSets.New.length; i++) {
            var data = widget._UIDEFAULFS.DataGroupSets.New[i];
            if (data["appletId"] == options.applet && data["key"] == options.key) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            widget._UIDEFAULFS.DataGroupSets.New = widget._removeItemInArray({
                array: widget._UIDEFAULFS.DataGroupSets.New,
                index: index
            });
        }
    },
    _deleteGroupData: function (options) {
        var newData = {
            appletId: options.applet,
            valueId: options.key,
        }
        widget._UIDEFAULFS.DataGroupSets.Delete.push(newData);
    },
    _removeDeleteGroupData: function (options) {
        var index = -1;
        for (var i = 0; i < widget._UIDEFAULFS.DataGroupSets.Delete.length; i++) {
            var data = widget._UIDEFAULFS.DataGroupSets.Delete[i];
            if (data["appletId"] == options.applet && data["valueId"] == options.key) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            widget._UIDEFAULFS.DataGroupSets.Delete = widget._removeItemInArray({
                array: widget._UIDEFAULFS.DataGroupSets.Delete,
                index: index
            });
        }
    },
    _clearGroupDataNew: function (options) {
        $("#" + widget._UIDEFAULFS.groupListForm).data("bootstrapValidator").resetForm();
        for (var i = 0; i < options.controls.length; i++) {
            $(options.controls[i]).val("");
            $(options.controls[i]).parents("td:first").find(".editControlText").html("");
        }
    },
    _enableGroupEditRevoke: function () {
        widget._addEventListener({
            container: "body",
            target: ".revokeEditDataBtn",
            type: "click",
            event: function () {
                var me = $(this);
                me.button("loading");
                me.parents(".button-nav").find("a").addClass("input-disabled");
                setTimeout(function () {
                    widget._reFreshView();
                }, 1000);
            }
        });
    },
};