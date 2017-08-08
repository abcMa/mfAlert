//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :lView
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
        mainPanel: "#contentPanel",
        buttonPanel: "#buttonListPanel",
        searchPanle: "#searchPanel",
        ExportModal: "#ExportModal",
        mainSearchModal: "#mainListSearchModal",
        withdrawModal: "#WithdrawExcelOutModal",
        investRecordModal: "#InvestRecordExcelOutModal",
        debtsModal: "#debtsAnalysisModal",
        detailSearchPanle: "#upBox_form_body",
        searchForm: ".list-search-form",
        defaultPicturePath: "../Content/Image/defaultHead.png",
        condition: {},
        modalCondition: {},
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
        widget._enableSearchPickModal();
        widget._enableCheckboxAll();//load checkbox all function
        widget._enableListItemClick();//load row click of label list view
        widget._enableListItemCheckboxClick();//load check box click of label list view
        widget._enableDetailSearchModalClear();//load truncate button of pick applet control
        widget._enableDataDelete();//load json delete function
        widget._enableMainSearchModalPick();//load modal of searching controls in main view
        widget._enablePaginationNext();//load pagination function next
        widget._enablePaginationPre();//load pagination function previous
        widget._enablePaginationClick();//load pagination function filled page
        widget._enableMainNewView();//load data new view
        widget._enableViewLink();//load jump view link function
        widget._enablePanelSearch();
        widget._enableControlSearchSubmit();
        widget._enableImportModalShow();
        widget._enableImportModalHide();
        widget._enableImportFileChange();
        widget._enableImportUpload();
        widget._enableWithdrawExcelExcute();
        widget._enableInvestRecordExcelExcute();
        widget._enableListRefreshBtnClick();//Refresh View Click
        widget._enableDebtsAnalysisModalShow();
        widget._enableWithdrawSubmitBtnClick();
        widget._enableWithdrawSuccessBtnClick();
        widget._enableWithdrawFailBtnClick();
        widget._enableInvestExportModalShow();
        widget._enableGroupNewBtnClick();
    },
    _bindingEventAfterLoad: function () {
        widget._enableTimeOrDateField();
    },
    _init: function () {
        Iptools.DEFAULTS.pageSize = 15;
        widget._bindingDomEvent();
        Iptools.uidataTool._getView({
            view: Iptools.DEFAULTS.currentView,
        }, function (data) {
            Iptools.DEFAULTS.currentViewApplet = data.view.primary;
            Iptools.setDefaults({ key: "currentViewApplet", value: data.view.primary });
            widget._initView({
                view: Iptools.DEFAULTS.currentView,
                name: data.view.name,
                type: data.view.type,
                primary: data.view.primary,
                icon: data.view.icon,
                bread: true,
                clear: true,
            });
        });
        if (Iptools.Tool._checkNull(Iptools.getDefaults({ key: "currentViewCondition" }))) {
            widget._UIDEFAULFS.condition = eval("(" + Iptools.getDefaults({ key: "currentViewCondition" }) + ")");
        }
    },
    _reFreshView: function () {
        Iptools.uidataTool._getView({
            view: Iptools.DEFAULTS.currentView,
        }, function (data) {
            Iptools.DEFAULTS.currentViewApplet = data.view.primary;
            Iptools.setDefaults({ key: "currentViewApplet", value: data.view.primary });
            widget._initView({
                view: Iptools.DEFAULTS.currentView,
                name: data.view.name,
                type: data.view.type,
                primary: data.view.primary,
                icon: data.view.icon,
                valueId: Iptools.DEFAULTS.currentViewValue,
                bread: false,
            });
        });
    },
    _initView: function (options) {
        widget._initListApplet({
            view: options.view,
            appletId: options.primary,
            pageNow: 1,
            pageSize: Iptools.DEFAULTS.pageSize,
            condition: JSON.stringify(widget._UIDEFAULFS.condition),
            orderByColumn: options.orderByColumn,
            orderByAscDesc: options.orderByAscDesc,
            panel: widget._UIDEFAULFS.mainPanel
        });
        if (!$.isEmptyObject(widget._UIDEFAULFS.condition)) {
            $("#collapseSearch").collapse("show");
        }
    },
    _initListApplet: function (options) {
        Iptools.DEFAULTS.currentViewValue = 0;
        Iptools.setDefaults({ key: "currentViewValue", value: 0 });
        Iptools.uidataTool._getUserlistAppletData(Iptools.Tool._extend(options, { async: false }), function (ds) {
            if (ds.applet.type == "list") {
                $("#lView_title").html(ds.applet.displayName);
                $(options.panel).html("");
                $(options.panel).append(widget._setListAppletContent({
                    data: ds,
                    pageNow: 1,
                    condition: options.condition,
                    search: true,
                    panel: options.panel,
                    type: options.type,
                    container: Iptools.Tool._blank_replacement(ds.applet.name) + Math.floor(Math.random() * 10)
                }));
                widget._setMainSearchContent({
                    view: options.view,
                    appletId: options.appletId,
                    pageNow: 1,
                    pageSize: Iptools.DEFAULTS.pageSize,
                    condition: options.condition,
                    orderByColumn: options.orderByColumn,
                    orderByAscDesc: options.orderByAscDesc,
                    container: Iptools.Tool._blank_replacement(ds.applet.name) + Math.floor(Math.random() * 10),
                    panel: options.panel,
                });
            }
        });
    },
    _setContactListTag: function (options) {
        var result = "";
        var tags = Iptools.uidataTool._getContactTags(options);
        if (tags && tags.length) {
            result = document.createElement("div");
            for (var item in tags) {
                var btn = document.createElement("btn");
                $(btn).addClass("btn btn-sm btn-primary input-tags-disabled");
                $(btn).attr("disabled", "disabled");
                $(btn).html(tags[item].tag);
                $(result).append(btn);
            }
        }
        return result;
    },
    _setListAppletMainData: function (options) {
        //list layer
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
                $(tdc).css({ "text-align": "center", "padding-top": "5px" });
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
                        if (options.data.columns[i].type == "phoneEncrypt" && tempData != "") {
                            tempData = tempData.substr(0, 3) + "****" + tempData.substr(7);
                        }
                        if (options.data.columns[i].type == "identityEncrypt" && tempData != "") {
                            tempData = tempData.substr(0, tempData.length - 4) + "****";
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
                        if (options.data.columns[i].type == "tag") {
                            tempData = widget._setContactListTag({
                                contact: obj[options.data.rootLink + "_id"]
                            });
                            $(tdo).html(tempData);
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
    _setListAppletContent: function (options) {
        var listpanel = document.createElement("div");
        var listlabel = document.createElement("div");
        $(listlabel).addClass("list-title col-sm-12");
        $(listlabel).html(options.data.applet.displayName);
        var extrad = document.createElement("div");
        var extrab = document.createElement("div");
        $(extrad).addClass("col-sm-12");
        var mld = widget._setListAppletMainData(options);
        //init list records page guiding function and html
        var pagnode = widget._setListPaginationPanel({
            pageNow: options.pageNow,
            container: options.container,
            data: options.data,
            type: "label",
            searchContainer: widget._UIDEFAULFS.searchPanle
        });
        var pagnav = document.createElement("nav");
        $(pagnav).attr("class", "text-center");
        $(pagnav).append(pagnode);
        widget._setListButtonsPanel({
            applet: options.data.applet.id,
            condition: options.condition,
            type: options.type,
            container: options.container,
        });
        if (options.type != "extra") {
            $(listpanel).append(mld, pagnav);
        } else {
            $(listpanel).addClass("row detail-list");
            $(extrab).append(mld, pagnav);
            $(extrad).append(extrab);
            $(listpanel).append(listlabel, extrad);
        }
        return listpanel;
    },
    _setListButtonsPanel: function (options) {
        var data = Iptools.uidataTool._getAppletButtons({
            applet: options.applet
        });
        $(widget._UIDEFAULFS.buttonPanel).html("");
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
                    //创建按钮也增加全选box
                case "marketnew":
                    $(a).data("applet", options.applet);
                    $(a).attr("class", "marketnewBtn input-disabled");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-fire");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "import":
                    $(li).addClass("dropdown");
                    $(a).attr("class", "dropdown-toggle");
                    $(a).attr("data-toggle", "dropdown");
                    $(a).attr("role", "button");
                    $(a).attr("aria-haspopup", "true");
                    $(a).attr("aria-expanded", "false");
                    $(span).addClass("icon-signin");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, "导入", "<span class='caret'></span>");
                    var ul = document.createElement("ul");
                    $(ul).addClass("dropdown-menu");
                    var lid = document.createElement("li");
                    var ad = document.createElement("a");
                    $(ad).attr("href", obj.name);
                    $(ad).attr("class", "importTemplate");
                    $(ad).css("cursor", "pointer");
                    $(ad).data("container", options.container);
                    $(ad).html("下载模板");
                    $(lid).append(ad);
                    var lim = document.createElement("li");
                    var ami = document.createElement("a");
                    $(ami).attr("class", "importLoad");
                    $(ami).attr("data-toggle", "modal");
                    $(ami).attr("data-target", widget._UIDEFAULFS.ExportModal);
                    $(ami).css("cursor", "pointer");
                    $(ami).data("container", options.container);
                    $(ami).attr("data-applet", options.applet);
                    $(ami).html("导入");
                    $(lim).append(ami);
                    $(ul).append(lid, lim);
                    $(li).append(a, ul);
                    break;
                case "withdrawExport":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).attr("data-toggle", "modal");
                    $(a).attr("data-target", widget._UIDEFAULFS.withdrawModal);
                    $(span).addClass("icon-paste");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "investrecordExport":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).attr("data-toggle", "modal");
                    $(a).attr("data-type", "0");
                    $(a).attr("data-target", widget._UIDEFAULFS.investRecordModal);
                    $(span).addClass("icon-paste");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "investrecordExportOwner":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).attr("data-toggle", "modal");
                    $(a).attr("data-type", "1");
                    $(a).attr("data-target", widget._UIDEFAULFS.investRecordModal);
                    $(span).addClass("icon-paste");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "investrecordExportPos":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).attr("data-toggle", "modal");
                    $(a).attr("data-type", "3");
                    $(a).attr("data-target", widget._UIDEFAULFS.investRecordModal);
                    $(span).addClass("icon-paste");
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
                case "debtsAnalysis":
                    $(a).data("applet", options.applet);
                    $(a).css("cursor", "pointer");
                    $(a).attr("data-toggle", "modal");
                    $(a).attr("data-target", widget._UIDEFAULFS.debtsModal);
                    $(span).addClass("icon-bar-chart");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "withdrawSubmit":
                    $(a).data("applet", options.applet);
                    $(a).addClass("withdrawSubmit input-disabled");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-pencil");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "withdrawSuccess":
                    $(a).data("applet", options.applet);
                    $(a).addClass("withdrawSuccess input-disabled");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-ok-sign");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "withdrawFail":
                    $(a).data("applet", options.applet);
                    $(a).addClass("withdrawFail input-disabled");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(span).addClass("icon-remove-sign");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
                case "groupNew":
                    $(a).data("applet", options.applet);
                    $(a).addClass("groupNewBtn");
                    $(a).css("cursor", "pointer");
                    $(a).data("container", options.container);
                    $(a).data("newview", options.createApplet);
                    $(span).addClass("icon-plus");
                    $(span).css("margin-right", "10px");
                    $(a).append(span, obj.name);
                    $(li).append(a);
                    break;
            }
            $(widget._UIDEFAULFS.buttonPanel).append(li);
        });
    },
    _setListPaginationPanel: function (options) {
        var pag = document.createElement("div");
        $(pag).attr("class", "pagination");
        var paf = document.createElement("div");
        $(paf).attr("class", "pageForm");
        var bsp = document.createElement("span");
        $(bsp).attr("class", "base");
        var bspa = document.createElement("span");
        var pageCount = (Iptools.Tool._checkNull(options.data.data) ? options.data.data.pageCount : "0");
        var rowCount = (Iptools.Tool._checkNull(options.data.data) ? options.data.data.rowCount : "0");
        $(bspa).attr("class", "arrow-left");
        $(bspa).attr("data-page", options.pageNow);
        $(bspa).attr("data-parent", options.container);
        $(bspa).attr("data-applet", options.data.applet.id);
        $(bspa).attr("data-total", pageCount);
        $(bspa).attr("data-type", options.type);
        $(bspa).attr("data-rowcount", rowCount);
        var pagpre = document.createElement("a");
        $(pagpre).attr("class", "pageSkip");
        $(pagpre).attr("title", "上一页");
        $(bspa).append(pagpre);
        var pagnum = document.createElement("a");
        $(pagnum).attr("class", "pagenum");
        $(pagnum).html(options.pageNow + "/" + pageCount);
        var bspn = document.createElement("span");
        $(bspn).attr("class", "arrow-right");
        $(bspn).attr("data-page", options.pageNow);
        $(bspn).attr("data-parent", options.container);
        $(bspn).attr("data-applet", options.data.applet.id);
        $(bspn).attr("data-total", pageCount);
        $(bspn).attr("data-type", options.type);
        $(bspn).attr("data-rowcount", rowCount);
        var pagnxt = document.createElement("a");
        $(pagnxt).attr("class", "pageNext");
        $(pagnxt).attr("title", "下一页");
        $(bspn).append(pagnxt);
        $(bsp).append(bspa, pagnum, bspn);
        var psp = document.createElement("span");
        $(psp).addClass("pageCountCalText");
        var pageNowCount = Iptools.DEFAULTS.pageSize;
        if (options.pageNow >= pageCount) {
            pageNowCount = rowCount - (options.pageNow - 1) * Iptools.DEFAULTS.pageSize;
        }
        $(psp).html("本页" + pageNowCount + "条，共" + rowCount + "条");
        var pagip = document.createElement("input");
        $(pagip).attr("class", "pageInput");
        $(pagip).attr("type", "text");
        $(pagip).attr("maxlength", "4");
        var pagbtn = document.createElement("button");
        $(pagbtn).attr("class", "pageButton btn-sm");
        $(pagbtn).attr("data-parent", options.container);
        $(pagbtn).attr("data-applet", options.data.applet.id);
        $(pagbtn).attr("data-total", pageCount);
        $(pagbtn).attr("data-type", options.type);
        $(pagbtn).attr("data-rowcount", rowCount);
        $(pagbtn).html("跳转");
        $(paf).append(bsp, psp, pagip, pagbtn);
        $(pag).append(paf);
        return pag;
    },
    _setTableAppletMainData: function (options) {
        var t = document.createElement("table");
        $(t).addClass("table table-striped table-bordered table-hover");
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
        if (options.data.data && options.data.data.records) {
            $.each(options.data.data.records, function (key, obj) {
                $(tbr).html("");
                $(tbr).css("text-align", "center");
                var tbrip = document.createElement("input");
                $(tbrip).attr("type", "radio");
                $(tbrip).css("margin", "0 auto");
                $(tbrip).attr("name", "modalListRadio");
                if (singleton) {
                    $(tbrip).attr("checked", "checked");
                }
                $(tbrip).addClass("radio");
                $(tbrip).attr("data-key", obj[options.data.rootLink + "_id"]);
                $(tbrip).data("applet", options.data.applet.id);
                $(tbr).append("<td>" + tbrip.outerHTML + "</td>");
                $.each(options.data.columns, function (tkey, tobj) {
                    if (tobj.type != "hidden") {
                        var tempData = obj[tobj.column];
                        tempData = Iptools.Tool._checkNull(tempData) ? tempData : "";
                        var tbrd = document.createElement("td");
                        if (typeof (tempData) == "object") {
                            for (var skey in tempData) {
                                if (skey != "id") {
                                    tempData = tempData[skey];
                                    break;
                                }
                            }
                        }
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
                        if (tobj.type == "percent" && Iptools.Tool._checkNull(tempData)) {
                            $(tbrd).append("%");
                        }
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
            searchContainer: widget._UIDEFAULFS.searchForm
        }));
        $(dg).append(d);
        $(dg).append(nav);
        return dg;
    },
    _setListSearchContent: function (options) {
        Iptools.uidataTool._getUserlistAppletData(options, function (data) {
            $(widget._UIDEFAULFS.searchForm).html("");
            $.each(data.columns, function (key, obj) {
                if (obj.allowOutterQuery) {
                    $(widget._UIDEFAULFS.searchForm).append(widget._setListSearchItem({
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
    _setListSearchItem: function (options) {
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
    _setListSearchParaContext: function () {
        widget._UIDEFAULFS.modalCondition = {};
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
                        widget._UIDEFAULFS.modalCondition[columnName] = " like '%" + inputValue + "%'";
                    }
                    break;
                case "int":
                    inputValue = o.find("input").eq(0).val().replace(widget._UIDEFAULFS.blankReg, '');
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "=" + inputValue;
                        widget._UIDEFAULFS.modalCondition[columnName] = "=" + inputValue;
                    }
                    break;
                case "select":
                    inputValue = o.find("select").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "='" + inputValue + "'";
                        widget._UIDEFAULFS.modalCondition[columnName] = "='" + inputValue + "'";
                    }
                    break;
            }
        }
        return JSON.stringify(paraStr);
    },
    _setMainSearchContent: function (options) {
        var sd = document.createElement('div');
        $(sd).attr("class", "listSearchTable");
        var form = document.createElement("form");
        $(form).addClass("main-list-search-form");
        Iptools.uidataTool._getUserlistAppletData(options, function (data) {
            $.each(data.columns, function (key, obj) {
                if (obj.allowOutterQuery) {
                    $(form).append(widget._setMainSearchItem({
                        data: obj,
                        condition: options.condition,
                    }));
                }
            });
            var sbtn = document.createElement("button");
            $(sbtn).attr("class", "btn btn-sm btn-default searchExcute");
            $(sbtn).css({ "float": "right", "margin-right": "20px;" });
            $(sbtn).attr("type", "submit");
            $(sbtn).attr("data-applet", options.appletId);
            $(sbtn).attr("data-parent", options.container);
            $(sbtn).attr("data-panel", options.panel);
            $(sbtn).html("搜索");
            $(form).append(sbtn);
            $(sd).append(form);
            $(widget._UIDEFAULFS.searchPanle).html("");
            $(widget._UIDEFAULFS.searchPanle).append(sd);
            widget._bindingEventAfterLoad();
        });
    },
    _setMainSearchItem: function (options) {
        var d = document.createElement("div"),
            lab = document.createElement("lable"),
            dc = document.createElement("div"),
            it = document.createElement("input"),
            du = document.createElement("div"),
            dui = document.createElement("input"),
            dm = document.createElement("div"),
            dd = document.createElement("div"),
            ddi = document.createElement("input"),
            sl = document.createElement("select"),
            sg = document.createElement("span"),
            sp = document.createElement("span"),
            sd = document.createElement("span"),
            sdf = document.createElement("span");
        $(d).attr("class", "form-group searchContextItem");
        $(d).css("margin-bottom", "0");
        $(d).attr("data-column", options.data.column);
        $(dc).attr("class", "col-sm-7 searchData");
        $(dc).css("padding", "0");
        $(lab).attr("class", "col-sm-5 searchlabel control-lable");
        $(lab).css("text-align", "center");
        $(lab).html(options.data.name);
        switch (options.data.type) {
            case "text":
                $(d).addClass("col-sm-2");
                $(d).attr("data-type", "text");
                $(it).attr("type", "text");
                $(it).attr("class", "form-control");
                $(it).val(widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "text"
                }));
                $(dc).append(it);
                $(d).append(lab, dc);
                break;
            case "int":
                $(d).addClass("col-sm-2");
                $(d).attr("data-type", "int");
                $(it).attr("type", "text");
                $(it).attr("class", "form-control");
                $(it).val(widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "text"
                }));
                $(dc).append(it);
                $(d).append(lab, dc);
                break;
            case "time":
                $(d).addClass("col-sm-5");
                $(lab).attr("class", "col-sm-2 searchlabel control-lable");
                $(lab).css("padding", "0");
                $(d).attr("data-type", "time");
                $(du).attr("class", "dateSearchPicker col-sm-4");
                $(du).css({ "margin-bottom": "12px", "padding-right": "0" });
                $(dui).attr("class", "form-control timeStampPicker upper");
                $(dui).attr("type", "text");
                $(dui).css("padding-right", "5px");
                $(dui).val(widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "upTime"
                }));
                $(du).append(dui);
                $(dm).attr("class", "dateSearchPicker dateSearchSeprator col-sm-1");
                $(dm).css({ "width": "1%", "padding": "5px 0 0 3px" });
                $(dm).html("—");
                $(dd).attr("class", "dateSearchPicker col-sm-4");
                $(dd).css({ "margin-bottom": "10px", "padding-right": "0" });
                $(ddi).attr("class", "form-control timeStampPicker lower");
                $(ddi).attr("type", "text");
                $(ddi).css("padding-right", "5px");
                $(ddi).val(widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "downTime"
                }));
                $(dd).append(ddi);
                $(d).append(lab, dd, dm, du);
                break;
            case "select":
                $(d).addClass("col-sm-2");
                $(d).attr("data-type", "select");
                $(lab).html(options.data.name);
                $(sl).attr("class", "form-control");
                $(sl).css("box-sizing", "border-box");
                $(sl).html("<option value=''>请选择</option>");
                var val = widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "select"
                });
                $.each(options.data.pickList, function (tkey, tobj) {
                    var op = document.createElement("option");
                    $(op).val(tobj.id);
                    if (tobj.id == val) {
                        $(op).attr("selected", "selected");
                    }
                    $(op).html(tobj.name);
                    $(sl).append(op);
                });
                $(dc).append(sl);
                $(d).append(lab, dc);
                break;
            case "date":
                $(d).addClass("col-sm-5");
                $(lab).attr("class", "col-sm-2 searchlabel control-lable");
                $(lab).css("padding", "0");
                $(d).attr("data-type", "date");
                $(du).attr("class", "dateSearchPicker col-sm-4");
                $(du).css({ "margin-bottom": "12px" });
                $(dui).attr("class", "form-control dateStampPicker upper");
                $(dui).attr("type", "text");
                $(dui).css("padding-right", "5px");
                $(dui).val(widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "upDate"
                }));
                $(du).append(dui);
                $(dm).attr("class", "dateSearchPicker dateSearchSeprator col-sm-1");
                $(dm).css({ "width": "1%", "padding": "5px 0 0 3px" });
                $(dm).html("—");
                $(dd).attr("class", "dateSearchPicker col-sm-4");
                $(dd).css({ "margin-bottom": "10px" });
                $(ddi).attr("class", "form-control dateStampPicker lower");
                $(ddi).attr("type", "text");
                $(ddi).css("padding-right", "5px");
                $(ddi).val(widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "downDate"
                }));
                $(dd).append(ddi);
                $(d).append(lab, dd, dm, du);
                break;
            case "pickApplet":
                $(d).addClass("col-sm-3");
                var va = widget._mainSearchConditionSplit({
                    condition: options.condition,
                    column: options.data.column,
                    type: "pickApplet"
                });
                $(d).attr("data-type", "pickApplet");
                $(it).attr("type", "text");
                $(it).attr("class", "form-control");
                $(it).attr("readonly", "readonly");
                if (va) {
                    $(it).val(widget._searchRelatedFieldName({
                        id: va,
                        applet: options.data.pickApplet,
                        pageNow: 1
                    }));
                }
                $(sg).attr("class", "input-group-addon");
                $(sp).attr("class", "glyphicon glyphicon-search pickAppletHolders");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).attr("data-toggle", "modal");
                $(sp).attr("data-target", widget._UIDEFAULFS.mainSearchModal);
                $(sp).attr("data-applet", options.data.pickApplet);
                $(sp).css("cursor", "pointer");
                $(dc).addClass("input-group");
                $(sg).append(sp);
                $(sg).css("padding", "0");
                $(sg).css("min-width", "30px");
                $(sdf).addClass("input-group-addon");
                $(sdf).css("border-left", "1px #fff solid");
                $(sd).addClass("glyphicon glyphicon-trash clearSearchPick");
                $(sd).attr("aria-hidden", "true");
                $(sd).attr("title", "清空");
                $(sd).attr("type", "button");
                $(sd).css("cursor", "pointer");
                $(sdf).css("padding", "0");
                $(sdf).css("min-width", "30px");
                $(sdf).append(sd);
                $(dc).append(it, sg, sdf);
                $(d).append(lab, dc);
                break;
            case "pickselect":
                $(d).addClass("col-sm-2");
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
                $(dc).append(sl);
                $(d).append(lab, dc);
                break;
        }
        return d;
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
    /*
    */
    _searchRelatedFieldName: function (options) {
        var result = "";
        Iptools.uidataTool._getUserlistAppletData({
            async: false,
            viewId: Iptools.DEFAULTS.currentView,
            appletId: options.applet,
            pageNow: options.pageNow,
            pageSize: Iptools.DEFAULTS.pageSize,
        }, function (ds) {
            var data = ds.data.records;
            if (data) {
                var flag = true;
                for (var i = 0; i < data.length; i++) {
                    if (data[i]["id"] == parseInt(options.id)) {
                        flag = false;
                        for (var j = 0; j < ds.columns.length; j++) {
                            if (ds.columns[j].pickFlag == "1") {
                                var columnName = ds.columns[j]["columnName"];
                                result = data[i][columnName];
                                break;
                            }
                        };
                        break;
                    }
                }
                if (flag && data.length != 0) {
                    result = widget._searchRelatedFieldName({
                        id: options.id,
                        applet: options.applet,
                        pageNow: options.pageNow + 1
                    });
                }
            }
        });
        return result;
    },
    _mainSearchConditionSplit: function (options) {
        var result = "";
        var condition = {};
        if (Iptools.Tool._checkNull(options.condition)) {
            condition = eval("(" + options.condition + ")");
        }
        var column = options.column;
        var type = options.type;
        if (condition[column]) {
            result = Iptools.Tool._search_replacement(condition[column]);
            switch (type) {
                case "int":
                    result = Iptools.Tool._blank_replacement(result);
                    break;
                case "text":
                    result = Iptools.Tool._blank_replacement(result).substring(4);
                    break;
                case "downDate":
                    if (result.indexOf(">") != -1) {
                        result = result.substring(1);
                    } else if (result.indexOf("between") != -1) {
                        result = result.split(" ")[2];
                    } else {
                        result = "";
                    }
                    break;
                case "upDate":
                    if (result.indexOf("<") != -1) {
                        result = result.substring(1);
                    } else if (result.indexOf("between") != -1) {
                        result = result.split(" ")[4];
                    } else {
                        result = "";
                    }
                    break;
                case "downTime":
                    if (result.indexOf(">") != -1) {
                        result = result.substring(1);
                    } else if (result.indexOf("between") != -1) {
                        result = result.split(" ")[2] + " " + result.split(" ")[3];
                    } else {
                        result = "";
                    }
                    break;
                case "upTime":
                    if (result.indexOf("<") != -1) {
                        result = result.substring(1);
                    } else if (result.indexOf("between") != -1) {
                        result = result.split(" ")[5] + " " + result.split(" ")[6];
                    } else {
                        result = "";
                    }
                    break;
                case "pickApplet":
                    result = Iptools.Tool._blank_replacement(result);
                    break;
            }
        }
        return result;
    },
    _showMainSearchPanel: function () {
        $(widget._UIDEFAULFS.mainSearchArea).show();
        $(widget._UIDEFAULFS.mainContentArea).removeClass("col-sm-9 col-sm-12").addClass("col-sm-9");
    },
    _hideMainSearchPanel: function () {
        $(widget._UIDEFAULFS.mainSearchArea).hide();
        $(widget._UIDEFAULFS.mainContentArea).removeClass("col-sm-9 col-sm-12").addClass("col-sm-12");
    },
    _enableScreenClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".screenMenuli",
            event: function () {
                $(".screenMenuli").removeClass("screen-selected");
                $(this).addClass("screen-selected");
                widget._initScreen({
                    screen: $(this).data("screen")
                });
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
                if (btn.checked) {
                    pan.find("input[name='list-item']").each(function () {
                        this.checked = true;
                    });
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletDeleteBtn").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletPrintBtn").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSubmit").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSuccess").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawFail").removeClass("input-disabled");
                } else {
                    pan.find("input[name='list-item']").each(function () {
                        this.checked = false;
                    });
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletDeleteBtn").addClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletPrintBtn").addClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSubmit").addClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSuccess").addClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawFail").addClass("input-disabled");
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
                var check = row.find("input[name='list-item']")[0];
                if (check.checked) {
                    check.checked = false;
                    if (!pan.find("input[name='list-item']:checked").length) {
                        $(widget._UIDEFAULFS.buttonPanel).find(".appletDeleteBtn").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".appletPrintBtn").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSubmit").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSuccess").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".withdrawFail").addClass("input-disabled");
                    }
                    pan.find(".checkAll")[0].checked = false;
                } else {
                    check.checked = true;
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletDeleteBtn").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletPrintBtn").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSubmit").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSuccess").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawFail").removeClass("input-disabled");
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
                if (me.checked) {
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletDeleteBtn").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".appletPrintBtn").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSubmit").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSuccess").removeClass("input-disabled");
                    $(widget._UIDEFAULFS.buttonPanel).find(".withdrawFail").removeClass("input-disabled");
                    if (pan.find("input[name='list-item']:checked").length == pan.find("input[name='list-item']").length) {
                        pan.find(".checkAll")[0].checked = true;
                    }
                } else {
                    if (!pan.find("input[name='list-item']:checked").length) {
                        $(widget._UIDEFAULFS.buttonPanel).find(".appletDeleteBtn").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".appletPrintBtn").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSubmit").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".withdrawSuccess").addClass("input-disabled");
                        $(widget._UIDEFAULFS.buttonPanel).find(".withdrawFail").addClass("input-disabled");
                    }
                    pan.find(".checkAll")[0].checked = false;
                }
            }
        });
    },
    _enableTimeOrDateField: function () {
        $(".timeStampPicker").datetimepicker({
            format: "yyyy-mm-dd hh:ii:ss",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
        });
        $(".dateStampPicker").datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            language: "zh-CN",
            minView: "month"
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
                    applet: btn.data("key")
                });
            }
        });
    },
    _enableSearchPickModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: "#mainListSearchModal",
            event: function (e) {
                var btn = $(e.relatedTarget);
                var me = $(this);
                e = e || event;
                e.stopPropagation();
                btn.addClass("currentMainSearchTarget");
                Iptools.uidataTool._getUserlistAppletData({
                    async: false,
                    view: Iptools.DEFAULTS.currentView,
                    appletId: btn.data("applet"),
                    pageNow: 1,
                    pageSize: Iptools.DEFAULTS.pageSize
                }, function (ds) {
                    if (ds.applet.type == "list") {
                        var container = "modalContainer_" + Math.floor(Math.random() * 10);
                        me.find("#upBox_form_body").html("");
                        me.find("#upBox_form_body").append(widget._setTableAppletContent({
                            data: ds,
                            pageNow: 1,
                            pageSize: Iptools.DEFAULTS.pageSize,
                            container: container
                        }));
                        widget._setListSearchContent({
                            view: Iptools.DEFAULTS.currentView,
                            appletId: btn.data("applet"),
                            pageNow: 1,
                            pageSize: Iptools.DEFAULTS.pageSize,
                            container: container
                        });
                    }
                });
            }
        });
    },
    _enableControlSearchSubmit: function () {
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".list-search-form",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var condition = widget._setListSearchParaContext();
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
    _enableMainSearchModalPick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".mainSearchPick",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var container = $(this).parent().parent().find("#upBox_form_body");
                var selectTrds = container.find("input[name='modalListRadio']:checked");
                if (selectTrds.length) {
                    var index = 1;
                    container.find("th").each(function (key, obj) {
                        if ($(obj).hasClass("pickColumn")) {
                            index = key;
                        }
                    });
                    var value = selectTrds.parent().parent().find("td").eq(index).html();
                    var target = $(".currentMainSearchTarget").parent().parent().find("input");
                    target.data("key", selectTrds.data("key"));
                    target.val(value);
                    target.attr("title", value);
                    $(widget._UIDEFAULFS.mainSearchModal).modal("hide");
                    $(".currentMainSearchTarget").removeClass("currentMainSearchTarget");
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
                var target = $("#" + me.data("container")).find("input[name='list-item']:checked");
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
                var pageNowCount;
                var condition;
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (!$.isEmptyObject(widget._UIDEFAULFS.condition)) {
                            condition = JSON.stringify(widget._UIDEFAULFS.condition);
                        }
                        if (pageNow < pageTotal) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
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
                            pageNowCount = Iptools.DEFAULTS.pageSize;
                            if (pageNow + 1 == pageTotal) {
                                pageNowCount = me.data("rowcount") - pageNow * pageNowCount;
                            }
                            me.parent().parent().find(".pageCountCalText").html("本页" + pageNowCount + "条，共" + me.data("rowcount") + "条");
                        }
                        break;
                    case "table":
                        if (!$.isEmptyObject(widget._UIDEFAULFS.modalCondition)) {
                            condition = JSON.stringify(widget._UIDEFAULFS.modalCondition);
                        }
                        if (pageNow < pageTotal) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow + 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setTableAppletMainData({
                                        data: ds,
                                        pageNow: pageNow + 1,
                                        pageSize: Iptools.DEFAULTS.pageSize,
                                        container: me.data("parent")
                                    }));
                                }
                            });
                            me.data("page", pageNow + 1);
                            me.parent().find(".arrow-left").data("page", pageNow + 1);
                            me.parent().find(".pagenum").html((pageNow + 1) + "/" + pageTotal);
                            pageNowCount = Iptools.DEFAULTS.pageSize;
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
                var condition;
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (!$.isEmptyObject(widget._UIDEFAULFS.condition)) {
                            condition = JSON.stringify(widget._UIDEFAULFS.condition);
                        }
                        if (pageNow > 1) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
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
                            me.parent().parent().find(".pageCountCalText").html("本页" + Iptools.DEFAULTS.pageSize + "条，共" + me.data("rowcount") + "条");
                        }
                        break;
                    case "table":
                        if (!$.isEmptyObject(widget._UIDEFAULFS.modalCondition)) {
                            condition = JSON.stringify(widget._UIDEFAULFS.modalCondition);
                        }
                        if (pageNow > 1) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow - 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setTableAppletMainData({
                                        data: ds,
                                        pageNow: pageNow - 1,
                                        pageSize: Iptools.DEFAULTS.pageSize,
                                        container: me.data("parent")
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
                var pageNowCount;
                var container = $("#" + me.data("parent"));
                var condition;
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (!$.isEmptyObject(widget._UIDEFAULFS.condition)) {
                            condition = JSON.stringify(widget._UIDEFAULFS.condition);
                        }
                        if (pageNow > 0 && pageNow != pageCurrent && !(pageNow > pageTotal)) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
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
                            pageNowCount = Iptools.DEFAULTS.pageSize;
                            if (pageNow == pageTotal) {
                                pageNowCount = me.data("rowcount") - (pageNow - 1) * pageNowCount;
                            }
                            me.parent().parent().find(".pageCountCalText").html("本页" + pageNowCount + "条，共" + me.data("rowcount") + "条");
                        }
                        break;
                    case "table":
                        if (!$.isEmptyObject(widget._UIDEFAULFS.modalCondition)) {
                            condition = JSON.stringify(widget._UIDEFAULFS.modalCondition);
                        }
                        if (pageNow > 0 && pageNow != pageCurrent && !(pageNow > pageTotal)) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(widget._setTableAppletMainData({
                                        data: ds,
                                        pageNow: pageNow,
                                        pageSize: Iptools.DEFAULTS.pageSize,
                                        container: me.data("parent")
                                    }));
                                }
                            });
                            me.data("page", pageNow);
                            me.parent().find(".arrow-right").data("page", pageNow);
                            me.parent().find(".arrow-left").data("page", pageNow);
                            me.parent().find(".pagenum").html((pageNow) + "/" + pageTotal);
                            pageNowCount = Iptools.DEFAULTS.pageSize;
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
    _setSearchParaContext: function (options) {
        widget._UIDEFAULFS.condition = {};
        var paraStr = {};
        var objSearchItem = options.panel.find(".searchContextItem");
        for (var i = 0; i < objSearchItem.length; i++) {
            var columnName;
            var o = objSearchItem.eq(i);
            columnName = o.data("column");
            var inputValue;
            switch (o.data("type")) {
                case "int":
                    inputValue = o.find("input").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "=" + inputValue;
                        widget._UIDEFAULFS.condition[columnName] = "=" + inputValue;
                    }
                    break;
                case "text":
                    inputValue = o.find("input").eq(0).val().replace(widget._UIDEFAULFS.blankReg, '');
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = " like '%" + inputValue + "%'";
                        widget._UIDEFAULFS.condition[columnName] = " like '%" + inputValue + "%'";
                    }
                    break;
                case "time":
                    inputValue = o.find(".lower").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = ">='" + inputValue + "'";
                        widget._UIDEFAULFS.condition[columnName] = ">='" + inputValue + "'";
                    }
                    var tcond = paraStr[columnName];
                    inputValue = o.find(".upper").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        if (!tcond) {
                            paraStr[columnName] = "<='" + inputValue + "'";
                            widget._UIDEFAULFS.condition[columnName] = "<='" + inputValue + "'";
                        } else {
                            tcond = tcond.split("'")[1];
                            paraStr[columnName] = " between '" + tcond + "' and '" + inputValue + "'";
                            widget._UIDEFAULFS.condition[columnName] = " between '" + tcond + "' and '" + inputValue + "'";
                        }
                    }
                    break;
                case "date":
                    inputValue = o.find(".lower").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = ">='" + inputValue + "'";
                        widget._UIDEFAULFS.condition[columnName] = ">='" + inputValue + "'";
                    }
                    var dcond = paraStr[columnName];
                    inputValue = o.find(".upper").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        if (!dcond) {
                            paraStr[columnName] = "<='" + inputValue + "'";
                            widget._UIDEFAULFS.condition[columnName] = "<='" + inputValue + "'";
                        } else {
                            dcond = dcond.split("'")[1];
                            paraStr[columnName] = " between '" + dcond + "' and '" + inputValue + "'";
                            widget._UIDEFAULFS.condition[columnName] = " between '" + dcond + "' and '" + inputValue + "'";
                        }
                    }
                    break;
                case "select":
                    inputValue = o.find("select").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "='" + inputValue + "'";
                        widget._UIDEFAULFS.condition[columnName] = "='" + inputValue + "'";
                    }
                    break;
                case "pickApplet":
                    inputValue = o.find("input").eq(0).data("key");
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "='" + inputValue + "'";
                        widget._UIDEFAULFS.condition[columnName] = "='" + inputValue + "'";
                    }
                    break;
                case "pickselect":
                    inputValue = o.find("select").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "='" + inputValue + "'";
                        widget._UIDEFAULFS.condition[columnName] = "='" + inputValue + "'";
                    }
                    break;
            }
        }
        return JSON.stringify(paraStr);
    },
    _enablePanelSearch: function () {
        widget._addEventListener({
            container: "body",
            type: "submit",
            target: ".main-list-search-form",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this).find("button");
                var condition = widget._setSearchParaContext({
                    panel: $(widget._UIDEFAULFS.searchPanle)
                });
                Iptools.Tool._setBreadCondition({
                    condition: JSON.stringify(widget._UIDEFAULFS.condition)
                });
                Iptools.uidataTool._getUserlistAppletData({
                    async: false,
                    view: Iptools.DEFAULTS.currentView,
                    appletId: me.data("applet"),
                    pageNow: 1,
                    pageSize: Iptools.DEFAULTS.pageSize,
                    condition: condition,
                    orderByColumn: null,
                    orderByAscDesc: null,
                }, function (ds) {
                    if (ds.applet.type == "list") {
                        $(me.data("panel")).html("");
                        var pagnode = widget._setListPaginationPanel({
                            pageNow: 1,
                            container: me.data("parent"),
                            data: ds,
                            type: "label"
                        });
                        var pagnav = document.createElement("nav");
                        $(pagnav).attr("class", "text-center");
                        $(pagnav).append(pagnode);
                        $(me.data("panel")).append(widget._setListAppletMainData({
                            data: ds,
                            pageNow: 1,
                            condition: condition,
                            container: me.data("parent")
                        }), pagnode);
                    }
                });
                return false;
            }
        });
    },
    _enableImportModalShow: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: widget._UIDEFAULFS.ExportModal,
            event: function (e) {
                var btn = $(e.relatedTarget);
                $(".import-file").val("");
                $(".export-hint").html("<span>*</span>请选择文件");
                $("#export_excute").attr("disabled", "disabled");
                $("#export_excute").data("applet", btn.data("applet"));
            }
        });
    },
    _enableInvestExportModalShow: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.modal",
            target: widget._UIDEFAULFS.investRecordModal,
            event: function (e) {
                var btn = $(e.relatedTarget);
                $("#investrecord_excel_excute").attr("data-type", btn.data("type"));
            }
        });
    },
    _enableImportModalHide: function () {
        widget._addEventListener({
            container: "body",
            type: "hide.bs.modal",
            target: widget._UIDEFAULFS.ExportModal,
            event: function () {
                widget._reFreshView();
            }
        });
    },
    _enableImportFileChange: function () {
        widget._addEventListener({
            container: "body",
            type: "change",
            target: ".import-file",
            event: function () {
                var f = this.files;
                if (f && f.length) {
                    if (f[0].size / 1024 > 2048) {
                        $(".export-hint").html("<span>*</span>文件大小不可大于2M");
                        $("#export_excute").attr("disabled", "disabled");
                    } else if (!(f[0].name.substr(f[0].name.length - 4) == "xlsx" || f[0].name.substr(f[0].name.length - 4).indexOf("xls") >= 0)) {
                        $(".export-hint").html("<span>*</span>只支持.xls或.xlsx的文件");
                        $("#export_excute").attr("disabled", "disabled");
                    } else {
                        $(".export-hint").html("");
                        $("#export_excute").removeAttr("disabled");
                    }
                } else {
                    $(".export-hint").html("<span>*</span>请选择文件");
                    $("#export_excute").attr("disabled", "disabled");
                }
            }
        });
    },
    _enableImportUpload: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#export_excute",
            event: function () {
                var me = $(this);
                me.button('loading');
                me.parent().find(".import-file").attr("disabled", "disabled");
                var f = me.parent().find(".import-file")[0].files;
                if (f && f.length) {
                    var columnArray = [];
                    var titleArray = [];
                    Iptools.uidataTool._getUserlistAppletData({
                        async: true,
                        view: Iptools.DEFAULTS.currentView,
                        appletId: me.data("applet"),
                        pageNow: 1,
                        pageSize: Iptools.DEFAULTS.pageSize,
                        condition: null,
                        orderByColumn: null,
                        orderByAscDesc: null,
                    }, function (ds) {
                        for (var j = 0; j < ds.columns.length; j++) {
                            titleArray.push(ds.columns[j].name);
                            columnArray.push(ds.columns[j].column);
                        }
                        var xls = XLSX;
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var data = e.target.result;
                            var wb;
                            wb = xls.read(data, { type: 'binary' });
                            var result = {};
                            wb.SheetNames.forEach(function (sheetName) {
                                var roa = xls.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                                if (roa.length > 0) {
                                    result[sheetName] = roa;
                                }
                            });
                            var jdata = JSON.stringify(result, 2, 2);
                            jdata = $.parseJSON(jdata);
                            if (window.Worker) {
                                var worker = new Worker("JS/FileUploader.js");
                                worker.postMessage({
                                    titleArray: titleArray,
                                    columnArray: columnArray,
                                    jdata: jdata,
                                    applet: me.data("applet"),
                                    tenantId: Iptools.DEFAULTS.tenantId,
                                    userId: Iptools.DEFAULTS.userId,
                                });
                                worker.onmessage = function (mes) {
                                    Iptools.Tool.pAlert({
                                        title: "系统提示",
                                        content: mes.data
                                    });
                                    me.button('reset');
                                    me.parent().find(".import-file").removeAttr("disabled");
                                    $(".export-hint").html(mes.data);
                                    $(".import-file").val("");
                                    worker.terminate();
                                };
                            } else {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "当前浏览器不支持此功能"
                                });
                            }
                        }
                        reader.readAsBinaryString(f[0]);
                    });
                }
            }
        });
    },
    _enableWithdrawExcelExcute: function () {
        widget._addEventListener({
            container: "body",
            target: "#withdraw_excel_excute",
            type: "click",
            event: function () {
                var me = $(this);
                me.button("loading");
                var data = {
                    tenantId: parseInt(Iptools.DEFAULTS.tenantId),
                    status: "",
                    beginTime: "",
                    endTime: ""
                }
                if (Iptools.Tool._checkNull($("#withdraw_status").val())) {
                    data["status"] = $("#withdraw_status").val();
                }
                if (Iptools.Tool._checkNull($("#withdraw_start_date").val())) {
                    data["beginTime"] = $("#withdraw_start_date").val().replace(Iptools.DEFAULTS.lineReg, "");
                }
                if (Iptools.Tool._checkNull($("#withdraw_end_date").val())) {
                    data["endTime"] = $("#withdraw_end_date").val().replace(Iptools.DEFAULTS.lineReg, "");
                }
                if (window.Worker) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "正在处理中..."
                    });
                    var worker = new Worker("JS/withdrawExcel.js");
                    worker.postMessage({
                        data: data,
                    });
                    worker.onmessage = function (r) {
                        r = $.parseJSON(r.data);
                        if (r && r.retcode == "ok") {
                            self.location = Iptools.DEFAULTS.serviceUrl + r.filePath;
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "导出完成，请下载"
                            });
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "导出失败"
                            });
                        }
                        me.button("reset");
                        worker.terminate();
                    };
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "当前浏览器不支持此功能"
                    });
                    me.button("reset");
                }
            },
        });
    },
    _enableInvestRecordExcelExcute: function () {
        widget._addEventListener({
            container: "body",
            target: "#investrecord_excel_excute",
            type: "click",
            event: function () {
                var me = $(this);
                me.button("loading");
                var data = {
                    tenantId: parseInt(Iptools.DEFAULTS.tenantId),
                    beginTime: "",
                    endTime: "",
                    userId: "",
                    authType: ""
                }
                if (Iptools.Tool._checkNull($("#invest_start_date").val())) {
                    data["beginTime"] = $("#invest_start_date").val().replace(Iptools.DEFAULTS.lineReg, "");
                }
                if (Iptools.Tool._checkNull($("#invest_end_date").val())) {
                    data["endTime"] = $("#invest_end_date").val().replace(Iptools.DEFAULTS.lineReg, "");
                }
                switch (me.data("type")) {
                    case 1:
                        data["userId"] = Iptools.DEFAULTS.userId;
                        data["authType"] = 1;
                        break;
                    case 3:
                        data["userId"] = Iptools.DEFAULTS.userId;
                        data["authType"] = 3;
                        break;
                }
                if (window.Worker) {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "正在处理中..."
                    });
                    var worker = new Worker("JS/investExcel.js");
                    worker.postMessage({
                        data: data,
                    });
                    worker.onmessage = function (r) {
                        if (Iptools.Tool._checkNull(r)) {
                            r = $.parseJSON(r.data);
                            if (r && r.retcode == "ok") {
                                self.location = Iptools.DEFAULTS.serviceUrl + r.filePath;
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "导出完成，请下载"
                                });
                            } else {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "导出失败"
                                });
                            }
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "导出失败"
                            });
                        }
                        me.button("reset");
                        worker.terminate();
                    };
                } else {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: "当前浏览器不支持此功能"
                    });
                    me.button("reset");
                }
            },
        });
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
    _enableDebtsAnalysisModalShow: function () {
        widget._addEventListener({
            container: "body",
            target: widget._UIDEFAULFS.debtsModal,
            type: "show.bs.modal",
            event: function () {
                Iptools.GetJson({
                    url: "basic/invest/debtsanalysis",
                    data: {
                        tenantId: Iptools.DEFAULTS.tenantId
                    },
                    success: function (r) {
                        $("#debtsAnalysis_body").highcharts({
                            chart: {
                                type: 'column',
                                width: 500
                            },
                            title: {
                                text: null
                            },
                            yAxis: {
                                title: {
                                    text: '金额（元）'
                                }
                            },
                            xAxis: {
                                categories: r.categories,
                                title: {
                                    text: null
                                }
                            },
                            series: r.series
                        });
                    }
                });
            }
        });
    },
    _enableWithdrawSubmitBtnClick: function () {
        widget._addEventListener({
            container: "body",
            target: ".withdrawSubmit",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var target = $("#" + me.data("container")).find("input[name='list-item']:checked");
                var arr = [];
                target.each(function (key, obj) {
                    arr.push($(obj).data("key"));
                });
                arr = arr.join(',').toString();
                Iptools.PostJson({
                    async: false,
                    url: "basic/withdraw/approve",
                    data: {
                        tenantId: Iptools.DEFAULTS.tenantId,
                        withdrawIdList: arr,
                        status: "2",
                    },
                    success: function (r) {
                        if (r && r.retmsg) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: r.retmsg
                            });
                        }
                    },
                    error: function () {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "提交失败"
                        });
                    }
                });
                widget._reFreshView();
            }
        });
    },
    _enableWithdrawSuccessBtnClick: function () {
        widget._addEventListener({
            container: "body",
            target: ".withdrawSuccess",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var target = $("#" + me.data("container")).find("input[name='list-item']:checked");
                var arr = [];
                target.each(function (key, obj) {
                    arr.push($(obj).data("key"));
                });
                arr = arr.join(',').toString();
                Iptools.PostJson({
                    async: false,
                    url: "basic/withdraw/approve",
                    data: {
                        tenantId: Iptools.DEFAULTS.tenantId,
                        withdrawIdList: arr,
                        status: "3",
                    },
                    success: function (r) {
                        if (r && r.retmsg) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: r.retmsg
                            });
                        }
                    },
                    error: function () {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "提交失败"
                        });
                    }
                });
                widget._reFreshView();
            }
        });
    },
    _enableWithdrawFailBtnClick: function () {
        widget._addEventListener({
            container: "body",
            target: ".withdrawFail",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var target = $("#" + me.data("container")).find("input[name='list-item']:checked");
                var arr = [];
                target.each(function (key, obj) {
                    arr.push($(obj).data("key"));
                });
                arr = arr.join(',').toString();
                Iptools.PostJson({
                    async: false,
                    url: "basic/withdraw/approve",
                    data: {
                        tenantId: Iptools.DEFAULTS.tenantId,
                        withdrawIdList: arr,
                        status: "4",
                    },
                    success: function (r) {
                        if (r && r.retmsg) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: r.retmsg
                            });
                        }
                    },
                    error: function () {
                        Iptools.Tool.pAlert({
                            title: "系统提示",
                            content: "提交失败"
                        });
                    }
                });
                widget._reFreshView();
            }
        });
    },
    _enableGroupNewBtnClick: function () {
        widget._addEventListener({
            container: "body",
            target: ".groupNewBtn",
            type: "click",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                Iptools.setDefaults({
                    key: "currentNewView",
                    value: me.data("newview")
                });
                self.location = "../groupNew";
            }
        });
    },
};