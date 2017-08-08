//IntoPalm Components js file
//Author :Ethan
//Created :2016-11-01
/**
 ui element styles and placement
 this plugins provides function able to set the UI elements for detail Applet in Editing mode
 Please Check for standard files exited in /standard directory
 **/
if (typeof jQuery === 'undefined' || typeof Iptools === 'undefined') {
    throw new Error('缺少必要JS');
}
var component = {};
component = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        mainPanel: "#mainArea",
        detailSearchPanle: "#modalList_body",
        detailSelectModal: "#detailControlSearchModal",
        searchForm: ".control-search-form",
        listSelectModal: "#listSelectButtonModal",
        listSelectPanle: "#selectList_body",
        defaultPicturePath: "../Content/Image/defaultHead.svg",
        defaultWordPath: "Image/wordfile.jpg",
        defaultExcelPath: "Image/excelfile.jpg",
        defaultPPTPath: "Image/pptfile.jpg",
        defaultFilePath: "Image/fileadd.jpg",
        controlCalLinks: [],
        DataOriginalSets: {},
        DataCurrentSets: {},
        modalCondition: {},
        formValidations: {},
        cropModal: "cropImgModal",
        cropDefaults: {
            init: false,
            src: "",
            file: null,
            aspectRatio: 16 / 10,
            showRatioFree: true,
            canvas: null,
            getCanvas: function () {
            }
        },
        pageDefaults: {},
        cropImageCanvas: {}
    },
    _rebuildUiDefaults: function (options) {
        component._UIDEFAULFS = Iptools.Tool._extend(component._UIDEFAULFS, options);
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
    _table: function (cta, ops) {
        var standardTable = function (container, options) {
            this.$container = $(container);
            this.$container.loading();
            this.options = $.extend({}, standardTable.DEFAULT_OPTIONS, options);
            this.options.oCondition = this.options.condition;
            this._freezeCount = 0;
            this._NormalCount = 0;
            var that = this;
            this._init().done(function () {
                that._buildData();
                that._apply();
                that._bindEvents();
            });
        };
        standardTable.DEFAULT_OPTIONS = {
            borderStyle: "bordered-ud",
            pageSize: 10,
            pageNow: 1,
            oCondition: {},
            condition: {},
            virtualCondition: {},
            order: null,
            orderType: null,
            tableTitle: null,
            applet: null,
            view: null,
            valueId: null,
            freezeCols: [],
            normalCols: [],
            manageCols: [],
            searchCons: [],
            appletData: null,
            columns: null,
            data: null,
            rootLink: null,
            statisticData: null,
            pag: null,
            buttons: [],
            search: null,
            investStatus: "wait",
            checkType: "checkbox",
            showChecks: true,
            showManage: true,
            showHeader: true,
            currentCount: 0,
            checkCount: 0,
            jumpType: "default",
            jumpTemplate: null,
            placeHolder: "",
            groupBtnName: "功 能",
            searchModalTitle: "搜索选择器",
            emptyImage: "../Content/Image/nodetail.png",
            emptyText: "未查询到数据",
            emptySearch: "未搜索到数据",
            emptySize: 150,
            emptyClick: null,
            events: [],
            dataModify: null,
            tcondition: [],
            tconditionVal: "",
            multiPanel: false,
            saveConditions: true,
            panels: [],
            searchEvent: null,
            afterLoad: null,
            searchLength: 0,
            mainSecOnshow: null
        };
        standardTable.prototype = {
            constructor: standardTable,
            _init: function () {
                var promise = $.Deferred();
                var that = this;
                if (that.options.applet) {
                    if (Iptools.DEFAULTS.currentView) {
                        Iptools.uidataTool._getView({
                            view: Iptools.DEFAULTS.currentView,
                        }).done(function (data) {
                            var opt = {
                                view: Iptools.DEFAULTS.currentView,
                                type: data.view.type,
                            }
                            if (Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewValue)) {
                                opt["valueId"] = Iptools.DEFAULTS.currentViewValue;
                            }
                            var crs = Iptools.Tool._getTabData(opt);
                            if (crs && crs["condition"]) {
                                that.options.condition = Iptools.Tool._extend(that.options.condition, crs["condition"]);
                                that.options.oCondition = that.options.condition;
                            }
                            var options = {
                                appletId: that.options.applet,
                                pageNow: that.options.pageNow,
                                pageSize: that.options.pageSize,
                            }
                            if (!$.isEmptyObject(that.options.condition)) {
                                options.condition = JSON.stringify(that.options.condition);
                            }
                            if (that.options.order) {
                                options.orderByColumn = that.options.order;
                            }
                            if (that.options.orderType) {
                                options.orderByAscDesc = that.options.orderType;
                            }
                            if (that.options.view) {
                                options.view = that.options.view;
                            }
                            if (that.options.valueId) {
                                options.valueId = that.options.valueId;
                            }
                            that.options.pag = "st-pag-" + new Date().getTime();
                            that.options.search = "sp-search-form-" + new Date().getTime();
                            that.options.searchModal = "st-search-modal-" + new Date().getTime();
                            that.options.searchModalList = "st-search-modal-list-" + new Date().getTime();
                            that.options.checkName = "s-table-check-" + new Date().getTime();
                            Iptools.uidataTool._getUserlistAppletData(options).done(function (r) {
                                if (r) {
                                    if (that.options.dataModify && typeof that.options.dataModify == "function") {
                                        that.options.dataModify(r).done(function (rm) {
                                            that.options.columns = rm.columns;
                                            that.options.data = rm.data;
                                            that.options.appletData = rm.applet;
                                            that.options.rootLink = rm.rootLink;
                                            that.options.statisticData = rm.statisticData;
                                            Iptools.uidataTool._getAppletButtons({
                                                applet: that.options.applet
                                            }).done(function (rs) {
                                                that.options.buttons = rs.buttons;
                                                promise.resolve();
                                            }).fail(function () {
                                                promise.resolve();
                                            });
                                        });
                                    } else {
                                        that.options.columns = r.columns;
                                        that.options.data = r.data;
                                        that.options.appletData = r.applet;
                                        that.options.rootLink = r.rootLink;
                                        that.options.statisticData = r.statisticData;
                                        Iptools.uidataTool._getAppletButtons({
                                            applet: that.options.applet
                                        }).done(function (rs) {
                                            that.options.buttons = rs.buttons;
                                            promise.resolve();
                                        }).fail(function () {
                                            promise.resolve();
                                        });
                                    }
                                }
                            });
                        });
                    } else {
                        console.log("Invalid Request For Table Component");
                    }
                }
                return promise;
            },
            _buildData: function () {
                var that = this;
                if (that.options.columns) {
                    //checkColumn
                    var dc = document.createElement("div");
                    $(dc).addClass("s-column").data("type", "freeze-check");
                    if (that.options.showChecks) {
                        var dch = document.createElement("div");
                        $(dch).addClass("s-cell header check " + that.options.borderStyle);
                        var dct = document.createElement("div");
                        if (that.options.checkType != "radio") {
                            $(dct).addClass("content").append("<span><input type='checkbox' class='blueCheckbox all'/></span>");
                        }
                        $(dc).append($(dch).append(dct));
                        if (that.options.data && that.options.data.records) {
                            for (var x = 0; x < that.options.data.records.length; x++) {
                                var dot = that.options.data.records[x];
                                if (that.options.checkType == "radio") {
                                    $(dc).append($("<div data-index='" + x + "' class='s-cell check " + that.options.borderStyle
                                        + "'><input type='radio' name='" + that.options.checkName + "' class='blueRadio'/></div>")
                                        .data("key", dot ? dot[that.options.rootLink + ":id"] : ""));
                                } else {
                                    $(dc).append($("<div data-index='" + x + "' class='s-cell check " + that.options.borderStyle
                                        + "'><input type='checkbox' class='blueCheckbox'/></div>").data("key", dot ? dot[that.options.rootLink + ":id"] : ""));
                                }
                            }
                        }
                        that._freezeCount++;
                        that.options.freezeCols.push(dc);
                    }
                    //normalColumn
                    for (var i = 0; i < that.options.columns.length; i++) {
                        var col = that.options.columns[i];
                        if (col.type == "hidden") continue;
                        var d = document.createElement("div");
                        $(d).addClass("s-column").data("index", i + 1).data("column", col.column).data("type", col.type).data("view", col.destinationView);
                        var dh = document.createElement("div");
                        $(dh).addClass("s-cell header " + that.options.borderStyle).append(
                            col.isFreeze ? "<span class='lock-bar unlock fa fa-lock'></span>" : "<span class='lock-bar lock fa fa-unlock'></span>");
                        var dhc = document.createElement("div");
                        $(dhc).addClass("content").append("<span>" + col.name + "</span>");
                        if (col.allowOrderBy) {
                            $(dhc).append("<div class='sort'><span class='fa fa-sort opacity'></span></div>").addClass("sort").data("sort", "not").data("column", col.column);
                        }
                        if (col.pickFlag == "1") {
                            $(d).addClass("p-column");
                        }
                        $(d).append($(dh).append(dhc));
                        if (that.options.data && that.options.data.records) {
                            that.options.currentCount = that.options.data.records.length;
                            for (var n = 0; n < that.options.data.records.length; n++) {
                                var so = that.options.data.records[n];
                                var key = so[that.options.rootLink + ":id"];
                                var sod = so[col.column];
                                if (sod && Iptools.Tool._checkNull(sod) && typeof sod == "object") {
                                    if (Iptools.Tool._checkNull(sod["id"])) {
                                        key = sod["id"];
                                    }
                                    sod = sod["name"];
                                }
                                sod = Iptools.Tool._GetProperValue(sod);
                                if (sod == "") sod = '-';
                                switch (col.type) {
                                    case "bool":
                                        sod = (sod == "1" ? "是" : "否");
                                        break;
                                    case "rmb":
                                        sod = "&yen;" + sod;
                                        break;
                                    case "percent":
                                        sod = sod + "%";
                                        break;
                                }
                                if (col.type != "hidden") {
                                    if (Iptools.Tool._checkNull(col.destinationView)) {
                                        $(d).append($("<div class='s-cell vlink " + that.options.borderStyle + "' data-index='" + n + "'>" +
                                            "<a class='d-v-link'>" + sod + "<a></div>").data("key", key).data("view", col.destinationView));
                                    } else {
                                        $(d).append("<div class='s-cell " + that.options.borderStyle + "' data-index='" + n + "'>" + sod + "</div>");
                                    }
                                }
                            }
                        }
                        if (col.isFreeze) {
                            that._freezeCount++;
                            that.options.freezeCols.push($(d).addClass("freeze"));
                        } else {
                            that._NormalCount++;
                            that.options.normalCols.push(d);
                        }
                        //search column
                        if (col.allowOutterQuery) {
                            var csd = document.createElement("div");
                            $(csd).addClass("s-search-item").data({
                                "type": col.searchType,
                                "column": col.column,
                                "name": col.name,
                                "isNewLine": col.isNewLine,
                                "isSeprate": col.isSeprate,
                                "seprateTitle": col.seprateTitle,
                                "virtual": (col.virtualType && col.virtualType > 1)
                            });
                            if (Iptools.Tool._checkNull(col.size)) {
                                $(csd).data("size", col.size);
                            } else {
                                $(csd).data("size", 12);
                            }
                            var sgd = document.createElement("div");
                            $(sgd).addClass("form-group");
                            var searchFlag = false;
                            var v1 = "", v2 = "";
                            switch (col.searchType) {
                                case "text":
                                    if (that.options.condition && that.options.condition[col.column]) {
                                        var tstr = that.options.condition[col.column];
                                        if (Iptools.Tool._checkNull(tstr) && tstr.indexOf("like") != -1) {
                                            v1 = tstr.split("%")[1].split("%")[0];
                                        }
                                    }
                                    $(sgd).append($("<label>" + col.name + "</label>").append($("<span class='dropdown st-search-dropdown'></span>").append(
                                        $("<a class='st-search-config'><span class='fa fa-cog'></span></a>").data("col", col),
                                        that._setSearchConfiguration(col.searchType))),
                                        $("<input type='text' class='form-control' value='" + v1 + "' />").data("column", col.column));
                                    $(csd).append(sgd);
                                    searchFlag = true;
                                    break;
                                case "select":
                                    if (that.options.condition && that.options.condition[col.column]) {
                                        var sstr = that.options.condition[col.column];
                                        if (Iptools.Tool._checkNull(sstr) && sstr.indexOf("=") != -1) {
                                            v1 = sstr.split("=")[1];
                                            if (v1.indexOf("'") != -1 || v1.indexOf('"') != -1) {
                                                v1 = Iptools.Tool._search_replacement(v1);
                                            }
                                        }
                                    }
                                    $(sgd).append($("<label>" + col.name + "</label>").append($("<span class='dropdown st-search-dropdown'></span>").append(
                                        $("<a class='st-search-config'><span class='fa fa-cog'></span></a>").data("col", col),
                                        that._setSearchConfiguration(col.searchType))));
                                    var sel = document.createElement("select");
                                    $(sel).addClass("form-control").append("<option value=''>请选择...</option>").data("column", col.column);
                                    if (col.pickList && col.pickList.length) {
                                        for (var s = 0; s < col.pickList.length; s++) {
                                            var pi = col.pickList[s];
                                            if (pi.id == v1) {
                                                $(sel).append("<option value='" + pi.id + "' selected='true'>" + pi.name + "</option>");
                                            } else {
                                                $(sel).append("<option value='" + pi.id + "'>" + pi.name + "</option>");
                                            }
                                        }
                                    }
                                    $(csd).append($(sgd).append(sel));
                                    searchFlag = true;
                                    break;
                                case "bool":
                                    if (that.options.condition && that.options.condition[col.column]) {
                                        var bstr = that.options.condition[col.column];
                                        if (Iptools.Tool._checkNull(bstr) && bstr.indexOf("=") != -1) {
                                            v1 = bstr.split("=")[1];
                                            if (v1.indexOf("'") != -1 || v1.indexOf('"') != -1) {
                                                v1 = Iptools.Tool._search_replacement(v1);
                                            }
                                        }
                                    }
                                    $(sgd).append($("<label>" + col.name + "</label>").append($("<span class='dropdown st-search-dropdown'></span>").append(
                                        $("<a class='st-search-config'><span class='fa fa-cog'></span></a>").data("col", col),
                                        that._setSearchConfiguration(col.searchType))), "<br />",
                                        $("<input type='checkbox' class='s-search-switch' " +
                                            (v1 == "1" ? "checked:'checked'" : "") + " />").data("column", col.column));
                                    $(csd).append(sgd);
                                    searchFlag = true;
                                    break;
                                case "date":
                                    if (that.options.condition && that.options.condition[col.column]) {
                                        var dstr = that.options.condition[col.column];
                                        if (Iptools.Tool._checkNull(dstr) && dstr.indexOf("=") != -1) {
                                            v2 = dstr.split("=")[1];
                                            if (v2.indexOf("'") != -1 || v2.indexOf('"') != -1) {
                                                v2 = Iptools.Tool._search_replacement(v2);
                                            }
                                        }
                                    }
                                    $(sgd).append($("<label>" + col.name + "</label>").append($("<span class='dropdown st-search-dropdown'></span>").append(
                                        $("<a class='st-search-config'><span class='fa fa-cog'></span></a>").data("col", col),
                                        that._setSearchConfiguration(col.searchType))),
                                        $("<input type='text' class='form-control datePicker low' placeholder='起始日期' />").data("column", col.column),
                                        $("<input type='text' class='form-control datePicker high' placeholder='结束日期' />").data("column", col.column),
                                        "<div class='input-group st-con-relative low'><input type='number' class='form-control' placeholder='数值' />" +
                                        "<span class='input-group-addon'><select><option value='hour'>小时</option><option value='day'>天</option>" +
                                        "<option value='month'>月</option><option value='year'>年</option></select></span></div>",
                                        "<div class='input-group st-con-relative high'><input type='number' class='form-control' placeholder='数值' />" +
                                        "<span class='input-group-addon'><select><option value='hour'>小时</option><option value='day'>天</option>" +
                                        "<option value='month'>月</option><option value='year'>年</option></select></span></div>");
                                    $(csd).append(sgd);
                                    searchFlag = true;
                                    break;
                                case "time":
                                    $(sgd).append($("<label>" + col.name + "</label>").append($("<span class='dropdown st-search-dropdown'></span>").append(
                                        $("<a class='st-search-config'><span class='fa fa-cog'></span></a>").data("col", col),
                                        that._setSearchConfiguration(col.searchType))),
                                        $("<input type='text' class='form-control timePicker low' placeholder='起始时间' />").data("column", col.column),
                                        $("<input type='text' class='form-control timePicker high' placeholder='结束时间' />").data("column", col.column));
                                    $(csd).append(sgd);
                                    searchFlag = true;
                                    break;
                                case "pickApplet":
                                    $(sgd).append($("<label>" + col.name + "</label>").append($("<span class='dropdown st-search-dropdown'></span>").append(
                                        $("<a class='st-search-config'><span class='fa fa-cog'></span></a>").data("col", col),
                                        that._setSearchConfiguration(col.searchType))), $("<div class='input-group'></div>").append(
                                        $("<input type='text' class='form-control s-search-applet-ip' disabled='disabled' />").data("column", col.column),
                                        $("<span class='input-group-addon s-search-applet'><span class='fa fa-search'></span></span>").data("applet", col.pickApplet)));
                                    $(csd).append(sgd);
                                    searchFlag = true;
                                    break;
                            }
                            if (searchFlag) {
                                that.options.searchCons.push(csd);
                            }
                        }
                    }
                    //extraColumn
                    var ecd = document.createElement("div");
                    $(ecd).addClass("s-column").data("type", "vlink-column");
                    if (that.options.showManage) {
                        if (that.options.appletData.isDetailView) {
                            var ech = document.createElement("div");
                            $(ech).addClass("s-cell header vlink " + that.options.borderStyle);
                            var ect = document.createElement("div");
                            $(ect).addClass("content").append("<span>" + that.options.appletData.detailColumnName + "</span>");
                            $(ecd).append($(ech).append(ect));
                            if (that.options.data && that.options.data.records) {
                                for (var v = 0; v < that.options.data.records.length; v++) {
                                    var eot = that.options.data.records[v];
                                    if (that.options.jumpType == "template") {
                                        $(ecd).append($("<div class='s-cell vlink " + that.options.borderStyle
                                            + "' data-index='" + v + "'>" + (that.options.jumpTemplate ?
                                                that.options.jumpTemplate : that.options.appletData.detailHrefText)
                                            + "</div>").data("key", eot ? eot[that.options.rootLink + ":id"] : "")
                                            .data("view", that.options.appletData.detailViewId));
                                    } else {
                                        $(ecd).append($("<div class='s-cell vlink " + that.options.borderStyle
                                            + "' data-index='" + v + "'><a class='d-v-link'>" + that.options.appletData.detailHrefText
                                            + "</a></div>").data("key", eot ? eot[that.options.rootLink + ":id"] : "")
                                            .data("view", that.options.appletData.detailViewId));
                                    }
                                }
                            }
                            that._NormalCount++;
                            that.options.manageCols.push(ecd);
                        }
                    }
                }
            },
            _apply: function () {
                var that = this;
                that.$container.empty();
                //header
                var thd = document.createElement("div");
                $(thd).addClass("s-header-bar");
                var tht = document.createElement("div");
                $(tht).addClass("s-title").html(that.options.tableTitle ? that.options.tableTitle : that.options.appletData.displayName);
                var tbg = document.createElement("div");
                if (that.options.multiPanel) {
                    $(tbg).addClass("btn-group s-btn-group").attr("role", "group").append(
                        $("<button type='button' class='btn small commonBtn'><span class='fa fa-list'></span>列表</button>").data("panel", "s-table-list-panel"));
                }
                var thm = document.createElement("div");
                $(thm).addClass("s-manage");
                if (that.options.searchCons.length) {
                    var sbtn = $("<button class='btn small commonBtn revert ul-search dropdown-toggle'" +
                        " data-loading-text=\"<span class='fa fa-spin fa fa-spinner'></span>\"  " +
                        "data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>筛 选" +
                        "</button>").data("status", "0");
                    var tsd = document.createElement("div");
                    $(tsd).addClass("s-search-bar");
                    var tsf = document.createElement("form");
                    $(tsf).attr("id", that.options.search);
                    var placeHolder = "";
                    if (that.options.searchCons.length) {
                        for (var s = 0; s < that.options.searchCons.length; s++) {
                            var sim = that.options.searchCons[s];
                            if ($(sim).data("type") == "text") {
                                that.options.tcondition.push($(sim).data("column"));
                                if (placeHolder != "") {
                                    placeHolder += "/";
                                }
                                placeHolder += $(sim).data("name");
                            }
                            if ($(sim).data("isSeprate")) {
                                $(tsf).append(that._setSearchTitle(sim));
                            }
                            that.options.searchLength += parseInt($(sim).data("size"));
                            if (that.options.searchLength > 12) {
                                $(tsf).append("<br/>");
                                that.options.searchLength = parseInt($(sim).data("size"));
                            }
                            $(tsf).append(sim);
                            if ($(sim).data("isNewLine")) {
                                $(tsf).append("<br/>");
                                that.options.searchLength = 0;
                            }
                        }
                        $(tsd).append(tsf, "<div class='btn-group-right'><button class='btn cancel revert ul-form-btn clear'>清 空</button>" +
                            "<button class='btn commonBtn ul-form-btn'>筛 选</button></div>");
                    }
                    if (that.options.tcondition.length) {
                        $(thm).append("<form class='s-t-search-form'>" +
                            "<input class='form-control' placeholder='" +
                            (Iptools.Tool._checkNull(that.options.placeHolder) ? that.options.placeHolder : placeHolder) + "'/>" +
                            "<span class='form-control-feedback fa fa-search'></span></form>");
                    }
                    var sul = $("<ul class='dropdown-menu dropdown-menu-right s-search-ul'></ul>").append($("<li " +
                        " data-stopPropagation='true'></li>").append(tsd)).css("margin-top", "-10px");
                    $(thm).append($("<div class='btn-group'></div>").append(sbtn, sul));
                    //bind datetimepicker
                    try {
                        $(thm).find(".form-control.datePicker").datetimepicker({
                            format: "yyyy-mm-dd",
                            autoclose: true,
                            todayBtn: true,
                            language: "zh-CN",
                            minView: "month"
                        });
                        $(thm).find(".form-control.timePicker").datetimepicker({
                            format: "yyyy-mm-dd hh:00",
                            autoclose: true,
                            todayBtn: true,
                            language: "zh-CN",
                            minView: 1
                        });
                    } catch (e) {
                        console.log("ERROR: required datetimepicker");
                    }
                    //bind switch
                    try {
                        $(thm).find("input.s-search-switch").bootstrapSwitch({
                            onText: "是",
                            offText: "否",
                            size: "small",
                            handleWidth: 50,
                            labelWidth: 30
                        });
                    } catch (e) {
                        console.log("ERROR: required bootstrap-switch");
                    }
                }
                for (var b = 0; b < that.options.buttons.length; b++) {
                    var btn = that.options.buttons[b];
                    if (btn.name.length == 2) {
                        btn.name = btn.name.substr(0, 1) + " " + btn.name.substr(1, 1);
                    }
                    if (btn.style && btn.style.indexOf("group") != -1) {
                        if ($(thm).find(".s-manage-group").length <= 0) {
                            $(thm).append("<div class='btn-group s-manage-group'><button type='button' class='btn commonBtn small " +
                                "dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='margin-right:0;' " +
                                "data-loading-text='<span class=\"fa fa-spin fa-spinner\"></span>执行中'>" + that.options.groupBtnName +
                                " <span class='caret'></span></button><ul class='dropdown-menu dropdown-menu-right s-group-ul'>" +
                                "</ul></div>");
                        }
                        $(thm).find(".s-manage-group ul.s-group-ul").append($("<li></li>").append($("<a class='" + btn.type + " " +
                            (btn.style && btn.style.indexOf("cascade") != "-1" ? "cascade no-events" : "") + "'>" +
                            btn.name + "</a>").data("view", btn.createView)
                            .data("applet", btn.createApplet)));
                    } else {
                        $(thm).append($("<button class='btn " + btn.style + " " + btn.type
                            + (btn.style && btn.style.indexOf("cascade") != "-1" ? " no-events disableBtn" : "") + "' " +
                            "data-loading-text=\"<span class='fa fa-spin fa-spinner'></span>执行中\">" +
                            "<span class='text'>" + btn.name + "</span></button>").data("view", btn.createView)
                            .data("applet", btn.createApplet));
                    }
                }
                $(thd).append($(tht).append((that.options.multiPanel ? tbg : ""), thm));
                //table
                var table = document.createElement("div");
                $(table).addClass("s-table col-lg-12");
                var tfd = document.createElement("div");
                $(tfd).addClass("s-table-freeze col-lg-" + that.options.freezeCols.length);
                if (that.options.freezeCols.length == 0) {
                    $(tfd).css("display", "none");
                } else {
                    for (var x = 0; x < that.options.freezeCols.length; x++) {
                        $(tfd).append(that.options.freezeCols[x]);
                    }
                }
                var tnd = document.createElement("div");
                $(tnd).addClass("s-table-container col-lg-12");
                if (that.options.normalCols.length) {
                    for (var i = 0; i < that.options.normalCols.length; i++) {
                        $(tnd).append(that.options.normalCols[i]);
                    }
                }
                var tmd = document.createElement("div");
                $(tmd).addClass("s-manage-freeze col-lg-1");
                if (that.options.manageCols.length) {
                    for (var m = 0; m < that.options.manageCols.length; m++) {
                        $(tmd).append(that.options.manageCols[m]);
                    }
                } else {
                    $(tmd).css("display", "none");
                }
                //pagination
                var tpd = document.createElement("div");
                $(tpd).attr("id", that.options.pag).addClass("s-pagination row");
                $(table).append(tfd, tnd, tmd);
                if (that.options.showHeader) {
                    that.$container.append(thd);
                }
                //emptyData
                var eyd = document.createElement("div");
                that.$container.append($("<div id='s-table-list-panel' class='s-panel'></div>").append(table, $(eyd).hide(), tpd));
                //searchModal
                var modal = document.createElement('div');
                $(modal).addClass("modal fade").attr({
                    "id": that.options.searchModal,
                    "tabindex": "-1",
                    "role": "dialog",
                    "data-backdrop": "static"
                });
                var mdialog = document.createElement('div');
                $(mdialog).addClass('modal-dialog').attr("role", "document").css("width", "800px");
                var mcontent = document.createElement('div');
                $(mcontent).addClass('modal-content').css({
                    "width": "auto",
                    "min-height": "200px"
                }).append(
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' " +
                    "aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' " +
                    ">" + that.options.searchModalTitle + "</h4></div>",
                    "<div class='modal-body' style='padding:0'><div id='" + that.options.searchModalList + "'></div></div>",
                    "<div class='modal-footer'><button type='button' class='btn commonBtn search-confirm'>确定</button>" +
                    "<button type='button' class='btn cancel revert' data-dismiss='modal' style='margin-left:5px;'>取消</button></div>");
                that.$container.after($(modal).append($(mdialog).append(mcontent)));
                //panels
                for (var p = 0; p < that.options.panels.length; p++) {
                    var pan = that.options.panels[p];
                    if (pan.type == "button") {
                        var btn = $("<button type='button' class='btn small commonBtn revert no-container'><span class='" +
                            (pan.icon ? pan.icon : "fa fa-th") + "'></span>" + pan.name + "</button>")
                        $(tbg).append(btn);
                        if (pan.onShow && typeof pan.onShow == "function") {
                            btn.bind("click", pan.onShow);
                        }
                    } else {
                        if (pan && pan.name && pan.container) {
                            $(tbg).append($("<button type='button' class='btn small commonBtn revert'><span class='" +
                                (pan.icon ? pan.icon : "fa fa-th") + "'></span>" + pan.name + "</button>")
                                .data("panel", pan.container));
                            that.$container.append($("#" + pan.container).addClass("s-panel"));
                            $("#" + pan.container).hide();
                            if (pan.onShow && typeof pan.onShow == "function") {
                                $("#" + pan.container).bind("s-show", pan.onShow);
                            }
                        }
                    }
                }
                if (that.options.data) {
                    component._pager({
                        container: that.options.pag,
                        pageSize: that.options.pageSize,
                        pageCount: that.options.data.pageCount,
                        rowCount: that.options.data.rowCount,
                        pageNow: that.options.pageNow,
                        jump: function (page) {
                            that.options.pageNow = page;
                            that._invest().done(function () {
                                that._investData();
                            });
                        }
                    });
                } else {
                    $(eyd).addClass("s-empty-container col-lg-12").append($("<img src='" + that.options.emptyImage
                        + "' alt='' />").css("height", that.options.emptySize + "px")
                            .addClass((that.options.emptyClick && typeof that.options.emptyClick == "function") ? "e-img-fc" : ""),
                        "<span>" + that.options.emptyText + "</span>").show();
                    component._pager({
                        container: that.options.pag,
                        pageSize: that.options.pageSize,
                        pageCount: 0,
                        rowCount: 0,
                        pageNow: that.options.pageNow,
                        jump: function (page) {
                            that.options.pageNow = page;
                            that._invest().done(function () {
                                that._investData();
                            });
                        }
                    });
                }
                if (that.options.afterLoad && typeof that.options.afterLoad == "function") {
                    that.options.afterLoad();
                }
            },
            _setSearchTitle: function (sim) {
                var t = document.createElement('div');
                $(t).addClass("t-search-title").append($(sim).data("seprateTitle"));
                return t;
            },
            _setSearchConfiguration: function (type) {
                var ul = document.createElement("ul");
                $(ul).addClass("dropdown-menu");
                switch (type) {
                    case "text":
                        $(ul).append($("<li></li>").append($("<a></a>").addClass("st-search-con-type selected").data("type", "like").html("LIKE")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "equal").html("等于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "nequal").html("不等于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnull").html("为空")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnotnull").html("不为空")));
                        break;
                    case "select":
                    default:
                        $(ul).append($("<li></li>").append($("<a></a>").addClass("st-search-con-type selected").data("type", "equal").html("等于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "nequal").html("不等于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnull").html("为空")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnotnull").html("不为空")));
                        break;
                    case "bool":
                        $(ul).append($("<li></li>").append($("<a></a>").addClass("st-search-con-type selected").data("type", "equal").html("等于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnull").html("为空")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnotnull").html("不为空")));
                        break;
                    case "date":
                    case "time":
                        $(ul).append($("<li></li>").append($("<a></a>").addClass("st-search-con-type selected").data("type", "equal").html("等于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "nequal").html("不等于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "bigger").html("大于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "smaller").html("小于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "n_day").html("本天")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "n_week").html("本周")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "n_month").html("本月")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "n_year").html("本年")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "between").html("区间")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "rbigger").html("相对大于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "rsmaller").html("相对小于")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "rbetween").html("相对区间")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnull").html("为空")),
                            $("<li></li>").append($("<a></a>").addClass("st-search-con-type").data("type", "isnotnull").html("不为空")));
                        break;
                }
                return ul;
            },
            _invest: function () {
                var promise = $.Deferred();
                var that = this;
                if (that.options.investStatus == "load") {
                    promise.reject();
                } else {
                    that.options.investStatus = "load";
                    that.$container.find(".s-column").each(function (key, obj) {
                        $(obj).find(".s-cell:gt(0)").remove();
                    });
                    //emptyContainer clear
                    that.$container.find(".s-empty-container").remove();
                    //gain loading panel
                    var lod = document.createElement("div");
                    that.$container.find(".s-pagination").before(lod);
                    $(lod).addClass("s-loading-data").loading();
                    var options = {
                        appletId: that.options.applet,
                        pageNow: that.options.pageNow,
                        pageSize: that.options.pageSize,
                    }
                    if (that.options.tcondition.length && that.options.tconditionVal != "") {
                        var condition = [];
                        for (var i = 0; i < that.options.tcondition.length; i++) {
                            var tcon = {};
                            tcon[that.options.tcondition[i]] = " like '%" + that.options.tconditionVal + "%'";
                            if (that.options.oCondition && !$.isEmptyObject(that.options.oCondition)) {
                                tcon = Iptools.Tool._extend(that.options.oCondition, tcon);
                            }
                            condition.push(tcon);
                        }
                        options.condition = JSON.stringify(condition);
                    } else if (!$.isEmptyObject(that.options.condition)) {
                        options.condition = JSON.stringify(Iptools.Tool._extend(that.options.oCondition, that.options.condition));
                    } else if (that.options.oCondition && !$.isEmptyObject(that.options.oCondition)) {
                        options.condition = JSON.stringify(that.options.oCondition);
                    }
                    if (that.options.order) {
                        options.orderByColumn = that.options.order;
                    }
                    if (that.options.orderType) {
                        options.orderByAscDesc = that.options.orderType;
                    }
                    if (that.options.view) {
                        options.view = that.options.view;
                    }
                    if (that.options.valueId) {
                        options.valueId = that.options.valueId;
                    }
                    Iptools.uidataTool._getUserlistAppletData(options).done(function (r) {
                        if (r) {
                            if (that.options.dataModify && typeof that.options.dataModify == "function") {
                                that.options.dataModify(r).done(function (rm) {
                                    that.options.data = rm.data;
                                    that.options.investStatus = "wait";
                                    promise.resolve();
                                    that.$container.find(".s-loading-data").remove();
                                });
                            } else {
                                that.options.data = r.data;
                                that.options.investStatus = "wait";
                                promise.resolve();
                                that.$container.find(".s-loading-data").remove();
                            }
                        }
                    }).done(function () {
                        Iptools.uidataTool._getView({
                            view: Iptools.DEFAULTS.currentView,
                        }).done(function (data) {
                            var opt = {
                                view: Iptools.DEFAULTS.currentView,
                                type: data.view.type,
                                key: "condition",
                                value: that.options.condition
                            }
                            if (Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewValue)) {
                                opt["valueId"] = Iptools.DEFAULTS.currentViewValue;
                            }
                            Iptools.Tool._setTabData(opt);
                        });
                    });
                }
                return promise;
            },
            _investData: function () {
                var that = this;
                //checkbox clear
                that.options.checkCount = 0;
                that.$container.find(".s-header-bar .s-manage .cascade").addClass("no-events disableBtn");
                that.$container.find(".s-table-freeze .s-cell.header.check input.blueCheckbox").prop("checked", false);
                //invest
                var cols = that.$container.find(".s-column");
                if (that.options.data && that.options.data.records) {
                    for (var i = 0; i < cols.length; i++) {
                        var col = $(cols[i]);
                        that.options.currentCount = that.options.data.records.length;
                        for (var n = 0; n < that.options.data.records.length; n++) {
                            //checkbox
                            if (col.data("type") == "freeze-check") {
                                var dot = that.options.data.records[n];
                                if (that.options.checkType == "radio") {
                                    $(col).append($("<div data-index='" + n + "' class='s-cell check " + that.options.borderStyle
                                        + "'><input type='radio' name='" + that.options.checkName + "' class='blueRadio'/></div>")
                                        .data("key", dot ? dot[that.options.rootLink + ":id"] : ""));
                                } else {
                                    $(col).append($("<div data-index='" + n + "' class='s-cell check " + that.options.borderStyle
                                        + "'><input type='checkbox' class='blueCheckbox'/></div>").data("key", dot ? dot[that.options.rootLink + ":id"] : ""));
                                }
                                continue;
                            }
                            //vlink
                            if (col.data("type") == "vlink-column") {
                                var eot = that.options.data.records[n];
                                if (that.options.jumpType == "template") {
                                    $(col).append($("<div class='s-cell vlink " + that.options.borderStyle
                                        + "' data-index='" + n + "'><a>" + (that.options.jumpTemplate ?
                                            that.options.jumpTemplate : that.options.appletData.detailHrefText)
                                        + "</a></div>").data("key", eot ? eot[that.options.rootLink + ":id"] : "")
                                        .data("view", that.options.appletData.detailViewId));
                                } else {
                                    $(col).append($("<div class='s-cell vlink " + that.options.borderStyle
                                        + "' data-index='" + n + "'><a>" + that.options.appletData.detailHrefText
                                        + "</a></div>").data("key", eot ? eot[that.options.rootLink + ":id"] : "")
                                        .data("view", that.options.appletData.detailViewId));
                                }
                                continue;
                            }
                            //normal data
                            var so = that.options.data.records[n];
                            var key = so[that.options.rootLink + ":id"];
                            var sod = so[col.data("column")];
                            if (sod && Iptools.Tool._checkNull(sod) && typeof sod == "object") {
                                if (Iptools.Tool._checkNull(sod["id"])) {
                                    key = sod["id"];
                                }
                                sod = sod["name"];
                            }
                            sod = Iptools.Tool._GetProperValue(sod);
                            if (sod == "") sod = '-';
                            switch (col.data("type")) {
                                case "bool":
                                    sod = (sod == "1" ? "是" : "否");
                                    break;
                                case "rmb":
                                    sod = "&yen;" + sod;
                                    break;
                                case "percent":
                                    sod = sod + "%";
                                    break;
                            }
                            if (col.data("type") != "hidden") {
                                if (Iptools.Tool._checkNull(col.data("view"))) {
                                    $(col).append($("<div class='s-cell vlink " + that.options.borderStyle + "' data-index='" + n + "'>" +
                                        "<a class='d-v-link'>" + sod + "<a></div>").data("key", key).data("view", col.data("view")));
                                } else {
                                    $(col).append("<div class='s-cell " + that.options.borderStyle + "' data-index='" + n + "'>" + sod + "</div>");
                                }
                            }
                        }
                    }
                    component._pager({
                        container: that.options.pag,
                        pageSize: that.options.pageSize,
                        pageCount: that.options.data.pageCount,
                        rowCount: that.options.data.rowCount,
                        pageNow: that.options.pageNow,
                        jump: function (page) {
                            that.options.pageNow = page;
                            that._invest().done(function () {
                                that._investData();
                            });
                        }
                    });
                } else {
                    //emptyData
                    var eyd = document.createElement("div");
                    var eText = that.options.emptyText;
                    if (that.options.tcondition.length > 0 || !$.isEmptyObject(that.options.condition)) {
                        eText = that.options.emptySearch;
                    }
                    that.$container.find("#" + that.options.pag).before($(eyd).addClass("s-empty-container col-lg-12").append($("<img src='" + that.options.emptyImage
                        + "' alt='' />").css("height", that.options.emptySize + "px")
                            .addClass((that.options.emptyClick && typeof that.options.emptyClick == "function") ? "e-img-fc" : ""),
                        "<span>" + eText + "</span>"));
                    component._pager({
                        container: that.options.pag,
                        pageSize: that.options.pageSize,
                        pageCount: 0,
                        rowCount: 0,
                        pageNow: that.options.pageNow,
                        jump: function (page) {
                            that.options.pageNow = page;
                            that._invest().done(function () {
                                that._investData();
                            });
                        }
                    });
                }
                if (that.options.afterLoad && typeof that.options.afterLoad == "function") {
                    that.options.afterLoad();
                }
            },
            _refresh: function () {
                var that = this;
                that.options.pageNow = 1;
                that._invest().done(function () {
                    that._investData();
                });
            },
            _condition: function (options) {
                var that = this;
                that.options.tcondition = [];
                that.options.tconditionVal = "";
                try {
                    that.options.condition = Iptools.Tool._extend(that.options.condition, options);
                } catch (e) {
                }
            },
            _getCondition: function () {
                var that = this, result = "";
                if (that.options.tcondition.length && that.options.tconditionVal != "") {
                    var condition = [];
                    for (var i = 0; i < that.options.tcondition.length; i++) {
                        var tcon = {};
                        tcon[that.options.tcondition[i]] = " like '%" + that.options.tconditionVal + "%'";
                        if (that.options.oCondition && !$.isEmptyObject(that.options.oCondition)) {
                            tcon = Iptools.Tool._extend(that.options.oCondition, tcon);
                        }
                        condition.push(tcon);
                    }
                    result = JSON.stringify(condition);
                } else if (!$.isEmptyObject(that.options.condition)) {
                    result = JSON.stringify(Iptools.Tool._extend(that.options.oCondition, that.options.condition));
                } else if (that.options.oCondition && !$.isEmptyObject(that.options.oCondition)) {
                    result = JSON.stringify(that.options.oCondition);
                }
                return result;
            },
            _getChecks: function () {
                var that = this;
                var cks = that.$container.find(".s-cell.check:not(.header) input.blueCheckbox:checked"), idList = [];
                if (cks && cks.length) {
                    for (var i = 0; i < cks.length; i++) {
                        idList.push($(cks[i]).parent().data("key"));
                    }
                }
                return idList;
            },
            _getCheckIndex: function () {
                var that = this;
                var cks = that.$container.find(".s-cell.check:not(.header) input.blueCheckbox:checked"), idList = [];
                if (cks && cks.length) {
                    for (var i = 0; i < cks.length; i++) {
                        idList.push($(cks[i]).parents(".s-cell:first").attr("data-index"));
                    }
                }
                return idList;
            },
            _getRadio: function () {
                var that = this;
                var cks = that.$container.find(".s-cell.check:not(.header) input.blueRadio:checked"), radio = {};
                if (cks && cks.length) {
                    radio = {
                        id: $(cks[0]).parent().data("key"),
                        index: $(cks[0]).parents(".s-cell:first").attr("data-index"),
                        name: that.$container.find(".s-table .s-column.p-column .s-cell").eq(parseInt($(cks[0]).parents(".s-cell:first").attr("data-index")) + 1).text()
                    }
                }
                return radio;
            },
            _setConditionConfig: function (so) {
                var that = this;
                var col = $(so).data("column"), vl, vh, vnl, vnh, vlt, vht, virtual = $(so).data("virtual");
                switch ($(so).data("type")) {
                    case "text":
                        vl = $(so).find("input").val();
                        break;
                    case "select":
                        vl = $(so).find("select").val();
                        break;
                    case "date":
                        vl = $(so).find("input.datePicker.low").val();
                        vh = $(so).find('input.datePicker.high').val();
                        vnl = $(so).find(".st-con-relative.low").find("input").val();
                        vlt = $(so).find(".st-con-relative.low").find("select").val();
                        vnh = $(so).find(".st-con-relative.high").find("input").val();
                        vht = $(so).find(".st-con-relative.high").find("select").val();
                        break;
                    case "time":
                        vl = $(so).find("input.timePicker.low").val();
                        vh = $(so).find('input.timePicker.high').val();
                        vnl = $(so).find(".st-con-relative.low").find("input").val();
                        vlt = $(so).find(".st-con-relative.low").find("select").val();
                        vnh = $(so).find(".st-con-relative.high").find("input").val();
                        vht = $(so).find(".st-con-relative.high").find("select").val();
                        break;
                    case "bool":
                        try {
                            vl = $(so).find("input.s-search-switch").bootstrapSwitch('state');
                        } catch (ex) {
                            console.log("ERROR: required bootstrap-switch");
                        }
                        break;
                    case "pickApplet":
                        try {
                            vl = $(so).find(".s-search-applet").data("key");
                        } catch (ex) {
                            console.log("ERROR: Can not Read HTML-DATA value");
                        }
                        break;
                }
                if (virtual) {
                    switch ($(so).find(".st-search-dropdown .st-search-con-type.selected").data("type")) {
                        case "like":
                            if (vl && vl != "") {
                                that.options.virtualCondition[col] = " like '%" + vl + "%'";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "equal":
                            if (vl && vl != "") {
                                that.options.virtualCondition[col] = " = '" + vl + "'";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "nequal":
                            if (vl && vl != "") {
                                that.options.virtualCondition[col] = " != '" + vl + "'";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "isnull":
                            that.options.virtualCondition[col] = " is null";
                            break;
                        case "isnotnull":
                            that.options.virtualCondition[col] = " is not null";
                            break;
                        case "bigger":
                            if (vl && vl != "") {
                                that.options.virtualCondition[col] = " > '" + vl + "'";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "smaller":
                            if (vl && vl != "") {
                                that.options.virtualCondition[col] = " < '" + vl + "'";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "n_day":
                            that.options.virtualCondition[col] = " {n_day}";
                            break;
                        case "n_week":
                            that.options.virtualCondition[col] = " {n_week}";
                            break;
                        case "n_month":
                            that.options.virtualCondition[col] = " {n_month}";
                            break;
                        case "n_year":
                            that.options.virtualCondition[col] = " {n_year}";
                            break;
                        case "between":
                            if (vl && vl != "" && vh && vh != "") {
                                that.options.virtualCondition[col] = " between '" + vl + "' and '" + vh + "'";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "rbigger":
                            if (vnl && vnl != "" && vlt) {
                                that.options.virtualCondition[col] = " > {" + vlt + (parseInt(vnl) > -1 ? "+" : "") + vnl + "}";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "rsmaller":
                            if (vnl && vnl != "" && vlt) {
                                that.options.virtualCondition[col] = " < {" + vlt + (parseInt(vnl) > -1 ? "+" : "") + vnl + "}";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                        case "rbetween":
                            if (vnl && vnl != "" && vnh && vnh != "" && vlt && vht) {
                                that.options.virtualCondition[col] = " between {" + vlt + (parseInt(vnl) > -1 ? "+" : "") + vnl
                                    + "} and {" + vht + (parseInt(vnh) > -1 ? "+" : "") + vnh + "}";
                            } else {
                                delete that.options.virtualCondition[col];
                            }
                            break;
                    }
                } else {
                    switch ($(so).find(".st-search-dropdown .st-search-con-type.selected").data("type")) {
                        case "like":
                            if (vl && vl != "") {
                                that.options.condition[col] = " like '%" + vl + "%'";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "equal":
                            if (vl && vl != "") {
                                that.options.condition[col] = " = '" + vl + "'";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "nequal":
                            if (vl && vl != "") {
                                that.options.condition[col] = " != '" + vl + "'";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "isnull":
                            that.options.condition[col] = " is null";
                            break;
                        case "isnotnull":
                            that.options.condition[col] = " is not null";
                            break;
                        case "bigger":
                            if (vl && vl != "") {
                                that.options.condition[col] = " > '" + vl + "'";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "smaller":
                            if (vl && vl != "") {
                                that.options.condition[col] = " < '" + vl + "'";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "n_day":
                            that.options.condition[col] = " {n_day}";
                            break;
                        case "n_week":
                            that.options.condition[col] = " {n_week}";
                            break;
                        case "n_month":
                            that.options.condition[col] = " {n_month}";
                            break;
                        case "n_year":
                            that.options.condition[col] = " {n_year}";
                            break;
                        case "between":
                            if (vl && vl != "" && vh && vh != "") {
                                that.options.condition[col] = " between '" + vl + "' and '" + vh + "'";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "rbigger":
                            if (vnl && vnl != "" && vlt) {
                                that.options.condition[col] = " > {" + vlt + (parseInt(vnl) > -1 ? "+" : "") + vnl + "}";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "rsmaller":
                            if (vnl && vnl != "" && vlt) {
                                that.options.condition[col] = " < {" + vlt + (parseInt(vnl) > -1 ? "+" : "") + vnl + "}";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                        case "rbetween":
                            if (vnl && vnl != "" && vnh && vnh != "" && vlt && vht) {
                                that.options.condition[col] = " between {" + vlt + (parseInt(vnl) > -1 ? "+" : "") + vnl
                                    + "} and {" + vht + (parseInt(vnh) > -1 ? "+" : "") + vnh + "}";
                            } else {
                                delete that.options.condition[col];
                            }
                            break;
                    }
                }
            },
            _bindEvents: function () {
                var that = this;
                that.$container.unbind();
                that.$container
                    .on("click", ".lock-bar.lock", function () {
                        var me = $(this);
                        var column = me.parent().parent();
                        if (that._freezeCount >= (5 + (that.options.showChecks ? 1 : 0))) {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "冻结列不能超过5列"
                            });
                        } else {
                            me.removeClass("fa fa-unlock lock").addClass("fa fa-lock unlock");
                            that.$container.find(".s-table-freeze").removeClass("col-lg-" + that._freezeCount++).addClass("col-lg-" + that._freezeCount).show();
                            column.addClass("freeze");
                            that.$container.find(".s-table-freeze").append(column);
                        }
                    });
                that.$container
                    .on("click", ".lock-bar.unlock", function () {
                        var me = $(this);
                        me.removeClass("fa fa-lock unlock").addClass("fa fa-unlock lock");
                        var column = me.parent().parent();
                        var index = parseInt(column.data("index"));
                        var cols = that.$container.find(".s-table-container .s-column");
                        var move = false;
                        for (var i = 0; i < cols.length; i++) {
                            var col = $(cols[i]);
                            var idx = parseInt(col.data("index"));
                            if (idx >= index) {
                                column.removeClass("freeze");
                                col.before(column);
                                move = true;
                                break;
                            }
                        }
                        if (!move) {
                            that.$container.find(".s-table-container").append(column);
                        }
                        that.$container.find(".s-table-freeze").removeClass("col-lg-" + that._freezeCount--).addClass("col-lg-" + that._freezeCount).show();
                        if (that._freezeCount <= 0) {
                            that.$container.find(".s-table-freeze").hide();
                        }
                    });
                that.$container
                    .on("mouseover", ".s-cell:not(.header)", function () {
                        var me = $(this);
                        var index = parseInt(me.attr("data-index"));
                        that.$container.find(".s-column").each(function (key, obj) {
                            $(obj).find(".s-cell").eq(index + 1).css("background-color", "#f7f7f7");
                        });
                    });
                that.$container
                    .on("mouseleave", ".s-cell:not(.header)", function () {
                        var me = $(this);
                        var index = parseInt(me.attr("data-index"));
                        that.$container.find(".s-column").each(function (key, obj) {
                            $(obj).find(".s-cell").eq(index + 1).css("background-color", "transparent");
                        });
                    });
                that.$container
                    .on("click", ".s-cell:not(.header):not(.check)", function () {
                        var me = $(this);
                        var index = parseInt(me.attr("data-index"));
                        if (index >= 0 && that.options.showChecks) {
                            if (that.options.checkType == "radio") {
                                var rx = that.$container.find(".s-table-freeze .s-cell.check").eq(index + 1).find("input.blueRadio");
                                if (rx.length && !rx[0].checked) {
                                    rx.prop("checked", true);
                                }
                            } else {
                                var ctx = that.$container.find(".s-table-freeze .s-cell.check").eq(index + 1).find("input.blueCheckbox");
                                if (ctx.length && ctx[0].checked) {
                                    ctx.prop("checked", false);
                                } else {
                                    ctx.prop("checked", true);
                                }
                                ctx.trigger("change");
                            }
                        }
                    });
                that.$container
                    .on("click", ".s-header-bar .s-manage .s-search-ul li[data-stopPropagation]", function (ev) {
                        ev = ev || event;
                        ev.stopPropagation();
                    });
                that.$container
                    .on("change", ".s-cell.check:not(.header) input.blueCheckbox", function () {
                        var me = $(this);
                        if (me.length) {
                            var ctxa = that.$container.find(".s-table-freeze .s-cell.header.check input.blueCheckbox");
                            if (me[0].checked) {
                                that.options.checkCount++;
                                that.$container.find(".s-header-bar .s-manage .cascade").removeClass("no-events disableBtn");
                                if (ctxa.length && !ctxa[0].checked && that.options.checkCount == that.options.currentCount) {
                                    ctxa.prop("checked", true);
                                }
                            } else {
                                that.options.checkCount--;
                                if (that.options.checkCount == 0) {
                                    that.$container.find(".s-header-bar .s-manage .cascade").addClass("no-events disableBtn");
                                }
                                if (ctxa.length && ctxa[0].checked) {
                                    ctxa.prop("checked", false);
                                }
                            }
                        }
                    });
                that.$container
                    .on("change", ".s-cell.header.check input.blueCheckbox", function () {
                        var me = $(this);
                        if (me.length) {
                            if (me[0].checked) {
                                that.$container.find(".s-cell:not(.header).check input.blueCheckbox").prop("checked", true);
                                that.$container.find(".s-header-bar .s-manage .cascade").removeClass("no-events disableBtn");
                                that.options.checkCount = that.options.currentCount;
                            } else {
                                that.$container.find(".s-cell:not(.header).check input.blueCheckbox").prop("checked", false);
                                that.$container.find(".s-header-bar .s-manage .cascade").addClass("no-events disableBtn");
                                that.options.checkCount = 0;
                            }
                        }
                    });
                that.$container
                    .on("click", ".s-header-bar .s-manage .refresh", function () {
                        var me = $(this);
                        me.addClass("no-events").button("loading");
                        that._invest().done(function () {
                            that._investData();
                            me.removeClass("no-events").button("reset");
                        }).fail(function () {
                            me.removeClass("no-events").button("reset");
                        });
                    });
                that.$container
                    .on("click", ".s-header-bar .s-manage .vlink", function () {
                        var me = $(this);
                        me.addClass("no-events").button("loading");
                        Iptools.uidataTool._getView({
                            view: me.data("view"),
                        }).done(function (data) {
                            Iptools.Tool._jumpView({
                                view: me.data("view"),
                                name: data.view.name,
                                type: data.view.type,
                                primary: data.view.primary,
                                icon: data.view.icon,
                                url: data.view.url,
                                bread: true,
                            });
                            me.removeClass("no-events").button("reset");
                        }).fail(function () {
                            me.removeClass("no-events").button("reset");
                        });
                    });
                that.$container
                    .on("click", ".s-header-bar .s-manage .del", function () {
                        var me = $(this);
                        me.addClass("no-events").button("loading");
                        var cks = that.$container.find(".s-cell.check:not(.header) input.blueCheckbox:checked"),
                            ids = "", idList = [];
                        if (cks && cks.length) {
                            for (var i = 0; i < cks.length; i++) {
                                idList.push($(cks[i]).parent().data("key"));
                            }
                            ids = idList.join(",");
                        }
                        Iptools.uidataTool._deleteAppletData({
                            appletId: that.options.applet,
                            valueIds: ids,
                            para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + that.options.applet + "&valueIds=" + ids
                        }).always(function (r) {
                            if (r && r.retcode == "fail") {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: r.retmsg
                                });
                                me.removeClass("no-events").button("reset");
                            } else {
                                that.options.pageNow = 1;
                                that._invest().done(function () {
                                    that._investData();
                                    me.button("reset");
                                }).fail(function () {
                                    me.button("reset");
                                });
                            }
                        });
                    });
                that.$container
                    .on("click", ".s-header-bar .s-manage .export", function () {
                        var me = $(this);
                        me.addClass("no-events").button("loading");
                        var data = {
                            view: Iptools.DEFAULTS.currentView,
                            appletId: that.options.applet,
                            pageNow: that.options.pageNow,
                            pageSize: that.options.pageSize,
                            valueId: Iptools.DEFAULTS.currentViewValue,
                            condition: JSON.stringify(that.options.condition),
                            orderByColumn: that.options.orderByColumn,
                            orderByAscDesc: that.options.orderByAscDesc,
                            virtualCondition: JSON.stringify(that.options.virtualCondition)
                        }
                        Iptools.uidataTool._exportExcel(data).done(function (path) {
                            window.open(path);
                            me.removeClass("no-events").button("reset");
                        })
                    });
                that.$container
                    .on("click", ".s-cell.vlink a.d-v-link", function (ev) {
                        ev = ev || event;
                        ev.stopPropagation();
                        var me = $(this);
                        var prefix = "";
                        if (that.$container.find(".s-table .s-column.p-column").length) {
                            var index = parseInt(me.parents(".s-cell:first").attr("data-index"));
                            prefix = "->" + that.$container.find(".s-table .s-column.p-column .s-cell").eq(index + 1).text();
                        }
                        Iptools.uidataTool._getView({
                            view: me.parent().data("view"),
                        }).done(function (data) {
                            if (data) {
                                Iptools.Tool._jumpView({
                                    view: me.parent().data("view"),
                                    name: data.view.name + prefix,
                                    type: data.view.type,
                                    valueId: me.parent().data("key"),
                                    primary: data.view.primary,
                                    icon: data.view.icon,
                                    url: data.view.url,
                                    bread: true,
                                });
                            }
                        });
                    });
                that.$container
                    .on("click", ".s-manage .s-search-ul button.clear", function () {
                        that.$container.find(".s-manage .s-t-search-form input").val("");
                        that.options.tconditionVal = "";
                        that.$container.find(".s-manage .s-search-ul .s-search-bar input").val("");
                        that.$container.find(".s-manage .s-search-ul .s-search-bar select").val("");
                        that.$container.find(".s-manage .s-search-ul .s-search-bar .s-search-applet").data("key", "");
                        that.$container.find(".s-manage button.ul-search").click();
                        that.$container.find(".s-search-bar #" + that.options.search).submit();
                    });
                that.$container
                    .on("click", ".s-manage .s-search-ul button.ul-form-btn", function () {
                        that.$container.find(".s-search-bar #" + that.options.search).submit();
                    });
                that.$container
                    .on("click", ".s-manage .s-search-ul .st-search-dropdown", function (ev) {
                        var me = $(this);
                        me.addClass("open");
                        ev.stopPropagation();
                    });
                that.$container
                    .on("click", ".s-manage .s-search-ul *:not(.st-search-dropdown)", function () {
                        var me = $(this);
                        me.closest(".s-search-ul").find(".st-search-dropdown").removeClass("open");
                    });
                that.$container
                    .on("click", ".s-manage .s-search-ul .st-search-dropdown ul .st-search-con-type", function () {
                        var me = $(this);
                        if (!me.hasClass("selected")) {
                            me.closest("ul").find(".st-search-con-type").removeClass("selected");
                            me.addClass("selected");
                            switch (me.data("type")) {
                                case "isnull":
                                case "isnotnull":
                                case "n_day":
                                case "n_week":
                                case "n_month":
                                case "n_year":
                                    me.closest(".s-search-item").find("input").attr("disabled", "disabled");
                                    me.closest(".s-search-item").find("select").attr("disabled", "disabled");
                                    break;
                                default:
                                    me.closest(".s-search-item").find("input").removeAttr("disabled");
                                    me.closest(".s-search-item").find("select").removeAttr("disabled");
                                    break;
                            }
                            var searchType = me.closest(".st-search-dropdown").find(".st-search-config").data("col").searchType;
                            if (searchType == "time" || searchType == "date") {
                                me.closest(".s-search-item").removeClass("between s-relative both");
                                switch (me.data("type")) {
                                    case "between":
                                        me.closest(".s-search-item").addClass("between");
                                        break;
                                    case "rbigger":
                                    case "rsmaller":
                                        me.closest(".s-search-item").addClass("s-relative");
                                        break;
                                    case "rbetween":
                                        me.closest(".s-search-item").addClass("s-relative both");
                                        break;
                                }
                            }
                        }
                    });
                that.$container
                    .on("submit", ".s-search-bar #" + that.options.search, function () {
                        that.$container.find(".s-manage .s-t-search-form input").val("");
                        that.options.tconditionVal = "";
                        var me = $(this);
                        var cons = me.find(".s-search-item");
                        cons.each(function (key, obj) {
                            that._setConditionConfig(obj);
                        });
                        that.options.pageNow = 1;
                        that._invest().done(function () {
                            that._investData();
                        });
                        if (that.options.searchEvent && typeof that.options.searchEvent == "function") {
                            var conditon = {};
                            if (that.options.tcondition.length && that.options.tconditionVal != "") {
                                var condition = [];
                                for (var i = 0; i < that.options.tcondition.length; i++) {
                                    var tcon = {};
                                    tcon[that.options.tcondition[i]] = " like '%" + that.options.tconditionVal + "%'";
                                    condition.push(tcon);
                                }
                                conditon = condition;
                            } else if (!$.isEmptyObject(that.options.condition)) {
                                conditon = that.options.condition;
                            }
                            that.options.searchEvent(conditon);
                        }
                        return false;
                    });
                that.$container
                    .on("submit", ".s-manage .s-t-search-form", function () {
                        var me = $(this);
                        that.options.tconditionVal = me.find("input").val();
                        that.options.pageNow = 1;
                        that._invest().done(function () {
                            that._investData();
                        });
                        if (that.options.searchEvent && typeof that.options.searchEvent == "function") {
                            var conditon = {};
                            if (that.options.tcondition.length && that.options.tconditionVal != "") {
                                var condition = [];
                                for (var i = 0; i < that.options.tcondition.length; i++) {
                                    var tcon = {};
                                    tcon[that.options.tcondition[i]] = " like '%" + that.options.tconditionVal + "%'";
                                    condition.push(tcon);
                                }
                                conditon = condition;
                            } else if (!$.isEmptyObject(that.options.condition)) {
                                conditon = that.options.condition;
                            }
                            that.options.searchEvent(conditon);
                        }
                        return false;
                    });
                that.$container
                    .on("click", ".s-manage .s-search-bar .s-search-applet", function () {
                        var me = $(this);
                        var applet = me.data("applet");
                        if (Iptools.Tool._checkNull(applet)) {
                            me.addClass("current-s-table-search-picker");
                            component._table("#" + that.options.searchModal + " #" + that.options.searchModalList, {
                                pageNow: 1,
                                pageSize: 10,
                                applet: applet,
                                checkType: "radio"
                            });
                            $("#" + that.options.searchModal).modal("show");
                        }
                    });
                that.$container
                    .on("click", ".s-cell.header .content.sort", function () {
                        var me = $(this);
                        if (me.data("sort") == "not" || me.data("sort") == "up") {
                            that.$container.find(".s-cell.header .content.sort .sort span").removeClass("fa-sort-down fa-sort-up").addClass("fa-sort opacity");
                            me.data("sort", "run");
                            me.find(".sort span").removeClass("fa-sort opacity").addClass("fa-spin fa-spinner");
                            that.options.order = me.data("column");
                            that.options.orderType = "asc";
                            that.options.pageNow = 1;
                            that._invest().done(function () {
                                that._investData();
                                me.data("sort", "down");
                                me.find(".sort span").removeClass("fa-spin fa-spinner").addClass("fa-sort-down");
                            });
                        } else if (me.data("sort") == "down") {
                            that.$container.find(".s-cell.header .content.sort .sort span").removeClass("fa-sort-down fa-sort-up").addClass("fa-sort opacity");
                            me.data("sort", "run");
                            me.find(".sort span").removeClass("fa-sort opacity").addClass("fa-spin fa-spinner");
                            that.options.order = me.data("column");
                            that.options.orderType = "desc";
                            that.options.pageNow = 1;
                            that._invest().done(function () {
                                that._investData();
                                me.data("sort", "up");
                                me.find(".sort span").removeClass("fa-spin fa-spinner").addClass("fa-sort-up");
                            });
                        }
                    });
                that.$container
                    .on("click", ".s-empty-container img.e-img-fc", function () {
                        if (that.options.emptyClick && typeof that.options.emptyClick == "function") {
                            that.options.emptyClick();
                        }
                    });
                that.$container
                    .on("click", ".s-header-bar .s-btn-group button", function () {
                        var me = $(this);
                        if (me.hasClass("revert")) {
                            me.parent().find("button:not(.revert)").addClass("revert");
                            me.removeClass("revert");
                            if (!me.hasClass("no-container")) {
                                var container = me.data("panel");
                                if (container) {
                                    that.$container.find(".s-panel").hide();
                                    that.$container.find("#" + container).show().trigger("s-show");
                                }
                            }
                        }
                    });
                that.$container
                    .on("s-show", "#s-table-list-panel", function () {
                        if (that.options.mainSecOnshow && typeof that.options.mainSecOnshow == "function") {
                            that.options.mainSecOnshow();
                        }
                    });
                $("#" + that.options.searchModal)
                    .on("click", ".s-header-bar .s-manage .ul-search", function () {
                        var me = $(this);
                        me.parent().toggleClass("open");
                    });
                $("#" + that.options.searchModal)
                    .on("click", function (ev) {
                        ev = ev || event;
                        ev.stopPropagation();
                    });
                $("#" + that.options.searchModal)
                    .on("click", ".search-confirm", function () {
                        var radio = $("#" + that.options.searchModalList).data("stable")._getRadio();
                        if (radio && radio.id) {
                            that.$container.find(".current-s-table-search-picker").data("key", radio.id).parent().find("input").val(radio.name);
                            that.$container.find(".current-s-table-search-picker").removeClass("current-s-table-search-picker");
                            $("#" + that.options.searchModal).modal("hide");
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "未选择"
                            });
                        }
                        that.$container.find(".s-header-bar .s-manage .ul-search").parent().addClass("open");
                    });
                if (that.options.events && that.options.events.length) {
                    for (var e = 0; e < that.options.events.length; e++) {
                        var evt = that.options.events[e];
                        if (evt && evt.target && evt.type && evt.event && typeof evt.event == "function") {
                            $(that.$container).on(evt.type, evt.target, evt.event);
                        }
                    }
                }
            }
        };
        var stable = new standardTable(cta, ops);
        $(cta).data("stable", stable);
    },
    _crop: function (options) {
        component._UIDEFAULFS.cropDefaults = Iptools.Tool._extend(component._UIDEFAULFS.cropDefaults, options);
        if (!component._UIDEFAULFS.cropDefaults.init) {
            component._buildCropModal();
            component._addEventListener({
                container: "body",
                target: "#" + component._UIDEFAULFS.cropModal + " .modal-footer .keepBtn",
                type: "click",
                event: function () {
                    if (!$(this).hasClass("disable")) {
                        component._UIDEFAULFS.cropDefaults.canvas = $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("getCroppedCanvas");
                        try {
                            component._UIDEFAULFS.cropDefaults.getCanvas(component._UIDEFAULFS.cropDefaults.canvas);
                        } catch (e) {
                        }
                        $("#" + component._UIDEFAULFS.cropModal).modal("hide");
                    }
                }
            });
            component._addEventListener({
                container: "body",
                target: "#" + component._UIDEFAULFS.cropModal + " #imgput",
                type: "change",
                event: function () {
                    var me = $(this);
                    if (me[0].files.length) {
                        $("#" + component._UIDEFAULFS.cropModal + " .modal-footer .keepBtn").removeClass("disable");
                        var f = me[0].files[0];
                        var src = window.URL.createObjectURL(f);
                        $("#" + component._UIDEFAULFS.cropModal + " #imgshow").attr("src", src);
                        $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("destroy").cropper({
                            aspectRatio: component._UIDEFAULFS.cropDefaults.aspectRatio,
                            preview: "#" + component._UIDEFAULFS.cropModal + " .img-preview"
                        });
                    }
                }
            });
            component._addEventListener({
                container: "body",
                target: "#" + component._UIDEFAULFS.cropModal,
                type: "hidden.bs.modal",
                event: function () {
                    $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("destroy");
                    $("#" + component._UIDEFAULFS.cropModal + " #imgshow").removeAttr("src");
                    $("#" + component._UIDEFAULFS.cropModal + " .modal-footer .keepBtn").addClass("disable");
                }
            });
            component._addEventListener({
                container: "body",
                target: "#" + component._UIDEFAULFS.cropModal,
                type: "shown.bs.modal",
                event: function () {
                    if (Iptools.Tool._checkNull(component._UIDEFAULFS.cropDefaults.src)) {
                        $("#" + component._UIDEFAULFS.cropModal + " #imgshow").attr("src", src);
                        $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("destroy").cropper({
                            aspectRatio: component._UIDEFAULFS.cropDefaults.aspectRatio,
                            preview: "#" + component._UIDEFAULFS.cropModal + " .img-preview"
                        });
                        $("#" + component._UIDEFAULFS.cropModal + " .modal-footer .keepBtn").removeClass("disable");
                    } else if (Iptools.Tool._checkNull(component._UIDEFAULFS.cropDefaults.file)) {
                        var fasrc = window.URL.createObjectURL(component._UIDEFAULFS.cropDefaults.file);
                        $("#" + component._UIDEFAULFS.cropModal + " #imgshow").attr("src", fasrc);
                        $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("destroy").cropper({
                            aspectRatio: component._UIDEFAULFS.cropDefaults.aspectRatio,
                            preview: "#" + component._UIDEFAULFS.cropModal + " .img-preview"
                        });
                        $("#" + component._UIDEFAULFS.cropModal + " .modal-footer .keepBtn").removeClass("disable");
                    }
                }
            });
            component._addEventListener({
                container: "body",
                target: "#" + component._UIDEFAULFS.cropModal + " .crop-tools-btn",
                type: "click",
                event: function () {
                    var me = $(this);
                    switch (me.data("method")) {
                        case "enlarge":
                            $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("zoom", 0.1);
                            break;
                        case "narrow":
                            $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("zoom", -0.1);
                            break;
                        case "c-rotate":
                            $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("rotate", 45);
                            break;
                        case "a-rotate":
                            $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("rotate", -45);
                            break;
                        case "lock":
                            $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("setAspectRatio", NaN);
                            me.removeClass("fa-lock").addClass("fa-unlock");
                            me.data("method", "unlock");
                            break;
                        case "unlock":
                            $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("setAspectRatio", component._UIDEFAULFS.cropDefaults.aspectRatio);
                            me.removeClass("fa-unlock").addClass("fa-lock");
                            me.data("method", "lock");
                            break;
                        case "refresh":
                            $("#" + component._UIDEFAULFS.cropModal + " #imgshow").cropper("reset");
                            break;
                    }
                }
            });
            component._UIDEFAULFS.cropDefaults.init = true;
            $("#" + component._UIDEFAULFS.cropModal).modal("show");
        } else {
            $("#" + component._UIDEFAULFS.cropModal).modal("show");
        }
    },
    _buildCropModal: function () {
        $("body").append("<div class='modal fade crop-pic-modal' id='" + component._UIDEFAULFS.cropModal + "' " +
            "tabindex='-1' role='dialog' aria-hidden='true' data-backdrop='static'>" +
            "<div class='modal-dialog' style='width: 60%;'>" +
            "<div class='modal-content'>" +
            "<div class='modal-header'>" +
            "<button type='button' class='close' data-dismiss='modal'>" +
            "<span aria-hidden='true'>&times;</span>" +
            "<span class='sr-only'>Close</span>" +
            "</button>" +
            "<h4 class='modal-title'>裁剪图片</h4>" +
            "</div>" +
            "<div class='modal-body'>" +
            "<div class='row'>" +
            "<div class='col-sm-9 crop-img'>" +
            "<div class='crop-tools'>" +
            "<div class='crop-tools-group'>" +
            "<span class='crop-tools-btn fa fa-plus top' data-method='enlarge'></span>" +
            "<span class='crop-tools-seperate'></span>" +
            "<span class='crop-tools-btn fa fa-minus bottom' data-method='narrow'></span>" +
            "</div>" +
            "<div class='crop-tools-group'>" +
            "<span class='crop-tools-btn fa fa-repeat top' data-method='c-rotate'></span>" +
            "<span class='crop-tools-seperate'></span>" +
            "<span class='crop-tools-btn fa fa-undo bottom' data-method='a-rotate'></span>" +
            "</div>" +
            "<div class='crop-tools-group'>" +
            "<span class='crop-tools-btn fa fa-lock whole' data-method='lock'></span>" +
            "</div>" +
            "<div class='crop-tools-group'>" +
            "<span class='crop-tools-btn fa fa-refresh whole' data-method='refresh'></span>" +
            "</div>" +
            "</div>" +
            "<div class='crop-show'>" +
            "<img id='imgshow' class='crop-img' alt='' style='max-height: 600px' />" +
            "</div>" +
            "</div>" +
            "<div class='col-sm-3' style='padding-left: 0;'>" +
            "<div>" +
            "<div class='img-preview preview-lg'></div>" +
            "<div class='img-preview preview-cir'></div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='modal-footer'>" +
            "<a class='btn btn-sm commonBtn btn-file'>" +
            "选择图片文件" +
            "<input id='imgput' type='file' accept='.jpg,.png,.jpeg,.gif' />" +
            "</a>" +
            "<button type='button' class='btn keepBtn commonBtn disable'>确认</button>" +
            "<button type='button' class='btn commonBtn revert closeBtn' data-dismiss='modal'>关闭</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>");
    },
    _pager: function (options) {
        if (options.pageCount > 1) {
            if ($("#" + options.container).find(".list-paging").length == 0) {
                options.id = new Date().getTime() + "_" + options.container;
                component._buildPaginationBar({
                    id: options.id,
                    container: options.container,
                    pageSize: options.pageSize,
                    pageCount: options.pageCount,
                    rowCount: options.rowCount,
                    pageNow: options.pageNow
                });
                component._setPagerNumbers({
                    id: options.id,
                    pageCount: options.pageCount
                });
                component._setPager({
                    id: options.id,
                    pageNow: options.pageNow
                });
                $("#" + options.id).on("click", ".paging-pager", function () {
                    var me = $(this);
                    options.jump(me.data("page"));
                });
                $("#" + options.id).on("click", ".list-jump-btn", function () {
                    var me = $(this);
                    var id = me.parents(".list-paging:first").attr("id");
                    var pagerInput = me.parents(".paging-free-box:first").find(".list-jumb-input");
                    if (Iptools.Tool._checkNull(pagerInput.val())) {
                        var page = parseInt(pagerInput.val());
                        if (page && page > 0 && page != component._UIDEFAULFS.pageDefaults[id].pageNow && page <= component._UIDEFAULFS.pageDefaults[id].pageCount) {
                            options.jump(page);
                        }
                    }
                    pagerInput.val("");
                });
                $("#" + options.id).on("submit", ".paging-free-form", function () {
                    var me = $(this);
                    me.find(".list-jump-btn").click();
                    return false;
                });
            } else {
                var sid = $("#" + options.container).find(".list-paging").eq(0).attr("id");
                component._UIDEFAULFS.pageDefaults[sid] = Iptools.Tool._extend(component._UIDEFAULFS.pageDefaults[sid], {
                    pageCount: options.pageCount,
                    rowCount: options.rowCount,
                    pageNow: options.pageNow
                });
                component._setPagerNumbers({
                    id: sid,
                    pageCount: options.pageCount
                });
                component._setPager({
                    id: sid,
                    pageNow: options.pageNow
                });
            }
        } else {
            $("#" + options.container).html("<div class='empty-paging' style='height:54px;float:left'></div>");
        }
    },
    _setPagerNumbers: function (options) {
        var data = component._UIDEFAULFS.pageDefaults[options.id];
        if (options.pageCount == 1) {
            $("#" + options.id + " .tool-size .num").html(data.rowCount);
        } else if (options.pageCount == 0) {
            $("#" + options.id + " .tool-size .num").html(0);
        } else if (data.pageNow == options.pageCount) {
            $("#" + options.id + " .tool-size .num").html(data.rowCount - (data.pageSize * (data.pageCount - 1)));
        } else {
            $("#" + options.id + " .tool-size .num").html(data.pageSize);
        }
        $("#" + options.id + " .tool-total .num").html(data.rowCount);
    },
    _setPager: function (options) {
        var container = $("#" + options.id + " .list-paging-area .paging-container");
        var pellip = "<div class='paging-ellipsis'>...</div>";
        var pHtml = "";
        var data = component._UIDEFAULFS.pageDefaults[options.id];
        if (data.pageCount > 0) {
            var pageLeft = 5;
            var pageLess = data.pageCount - 3;
            var pageShow = [1, data.pageNow, data.pageCount];
            if (data.pageNow < pageLeft) {
                var first = pageLeft < data.pageCount ? pageLeft : data.pageCount;
                for (var f = 1; f < first; f++) {
                    pageShow.push(f);
                }
            }
            if (data.pageNow > pageLess) {
                var medium = pageLess > 1 ? pageLess : 1;
                for (var m = medium; m < data.pageCount; m++) {
                    pageShow.push(m);
                }
            }
            if (data.pageNow - 1 > 0) {
                pageShow.push(data.pageNow - 1);
            }
            if (data.pageNow < data.pageCount) {
                pageShow.push(data.pageNow + 1);
            }
            pageShow = pageShow.unique().sort(function (a, b) {
                return a - b;
            });
            for (var i = 0; i < pageShow.length; i++) {
                pHtml += "<div class='paging-pager" + (pageShow[i] == data.pageNow ? " selected-pager" : "") + "' data-page='" + pageShow[i] + "'>" + pageShow[i] + "</div>";
                if (i < pageShow.length - 1 && pageShow[i] + 1 < pageShow[i + 1]) {
                    pHtml += pellip;
                }
            }
            if (data.pageCount < 2) {
                pHtml = "<div class='paging-pager selected-pager' data-page='1' style='border-radius:5px'>1</div>";
            }
            container.html(pHtml);
        } else {
            container.html(pellip);
        }
        if (data.pageCount < 2) {
            container.find("div").css("border-radius", "5px");
        }
    },
    _buildPaginationBar: function (options) {
        $("#" + options.container).append("<div class='list-paging' id='" + options.id + "'>" +
            "<div class='list-paging-tool'>" +
            "<span class='tool-text tool-size'>" +
            "本页<span class='num'></span>条" +
            "</span>" +
            "<span class='tool-seperate'>/</span>" +
            "<span class='tool-text tool-total'>" +
            "总<span class='num'></span>条" +
            "</span>" +
            "</div>" +
            "<div class='list-paging-area'>" +
            "<div class='paging-container'>" +
            "</div>" +
            "<div class='paging-free-box'><form class='paging-free-form'>" +
            "<div class='input-group list-jump-group'>" +
            "<input type='text' class='form-control list-jumb-input'>" +
            "<span class='input-group-btn'>" +
            "<button class='btn btn-default list-jump-btn' type='button'>" +
            "<span class='fa fa-chevron-right'></span>" +
            "</button>" +
            "</span>" +
            "</div></form>" +
            "</div>" +
            "</div>" +
            "</div>");
        component._UIDEFAULFS.pageDefaults[options.id] = {
            id: options.id,
            pageSize: options.pageSize,
            pageCount: options.pageCount,
            rowCount: options.rowCount,
            pageNow: options.pageNow
        };
    },
    _unit: function (cta, ops) {
        var standardUnit = function (container, options) {
            this.options = $.extend(true, {}, standardUnit.DEFAULT_OPTIONS, options);
            if (this.options.type == "modal") {
                this.options.modal.id = "ut-m-modal-" + new Date().getTime();
                this.options.modal.header = "ut-m-header-modal-" + new Date().getTime();
                this.options.modal.content = "ut-m-content-modal-" + new Date().getTime();
                this.options.modal.footer = "ut-m-footer-modal-" + new Date().getTime();
                var modal = document.createElement('div');
                $(modal).addClass("modal fade").attr({
                    "id": this.options.modal.id,
                    "tabindex": "-1",
                    "role": "dialog",
                    "data-backdrop": "static"
                });
                var mdialog = document.createElement('div');
                $(mdialog).addClass('modal-dialog').attr("role", "document").css("width", this.options.modal.width + "px");
                var mcontent = document.createElement('div');
                $(mcontent).addClass('modal-content').css({
                    "width": "auto",
                    "min-height": "200px",
                    "max-height": this.options.modal.maxHeight + "px"
                }).append(
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' " +
                    "aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' " +
                    "id='" + this.options.modal.header + "'>" + this.options.modal.title + "</h4></div>",
                    "<div class='modal-body' style='padding:0'><div id='" + this.options.modal.content
                    + "' class='i-scroll ut-m-modal-container' style='max-height:" + this.options.modal.maxHeight + "px;'></div></div>",
                    "<div class='modal-footer' style='background:#fff;border-radius:0 0 5px 5px;' id='" + this.options.modal.footer + "'></div>");
                for (var b = 0; b < this.options.modal.buttons.length; b++) {
                    switch (this.options.modal.buttons[b]) {
                        case "save":
                            $(mcontent).find("#" + this.options.modal.footer)
                                .append("<button type='button' class='btn commonBtn save-confirm orl' " +
                                    "data-loading-text='<span class=\"fa fa-spin fa-spinner\"></span>处理中'>保存</button>");
                            break;
                        case "cancel":
                            $(mcontent).find("#" + this.options.modal.footer)
                                .append("<button type='button' class='btn cancel revert orl' data-dismiss='modal' style='margin-left:5px;'>取消</button>");
                            break;
                    }
                }
                for (var c = 0; c < this.options.modal.customButtons.length; c++) {
                    var cb = this.options.modal.customButtons[c];
                    $(mcontent).find("#" + this.options.modal.footer)
                        .append("<button type='button' class='btn " + cb.class + " " + cb.style + " orl cus'>确定</button>");
                }
                $("body").append($(modal).append($(mdialog).append(mcontent)));
                $(modal).modal("show");
                this.$container = $("#" + this.options.modal.content);
            } else {
                this.$container = $(container);
            }
            this.$container.loading();
            var that = this;
            this._init().done(function () {
                that._buildData();
                that._apply();
                that._bindEvents();
                if (that.options.loadComplete && typeof that.options.loadComplete == "function") {
                    that.options.loadComplete();
                }
            });
        };
        standardUnit.DEFAULT_OPTIONS = {
            type: "default",
            modal: {
                id: "",
                title: "-",
                header: "",
                content: "",
                footer: "",
                buttons: ['save', 'cancel'],
                onSave: null,
                onCancel: null,
                customButtons: [],
                events: [],
                width: 800,
                maxHeight: 600,
            },
            mode: "new",
            applet: null,
            valueId: null,
            data: null,
            panels: [],
            buttons: [],
            controls: [],
            ntrols: [],
            allControls: {},
            multiPanel: false,
            searchModal: null,
            DataOriginalSets: {},
            tableTitle: null,
            showHeader: false,
            showTitle: true,
            showButton: true,
            headerStyle: "dock",
            section: 1,
            DataCurrentSets: {},
            formValidations: {},
            controlCalLinks: [],
            controlTriggers: [],
            searchModalTitle: "搜索列表",
            cropImageCanvas: {},
            autoClose: false,
            autoRefresh: true,
            beforeSave: null,
            afterSave: null,
            cusControls: {},
            events: [],
            dataModify: null,
            afterLoad: null,
            sectionMargin: 0,
            loadComplete: null
        };
        standardUnit.prototype = {
            constructor: standardUnit,
            _init: function () {
                var promise = $.Deferred();
                var that = this;
                if (that.options.applet) {
                    var options = {
                        appletId: that.options.applet,
                    }
                    if (that.options.mode == "edit" && Iptools.Tool._checkNull(that.options.valueId)) {
                        options["valueId"] = that.options.valueId;
                    } else {
                        options["valueId"] = 0;
                        that.options.mode = "new";
                    }
                    that.options.form = "ut-form-" + new Date().getTime();
                    that.options.searchModal = "ut-search-modal-" + new Date().getTime();
                    that.options.searchModalList = "ut-search-modal-list-" + new Date().getTime();
                    Iptools.uidataTool._getUserDetailAppletData(options).done(function (r) {
                        if (r) {
                            if (that.options.dataModify && typeof that.options.dataModify == "function") {
                                that.options.dataModify(r).done(function (rm) {
                                    that.options.controls = rm.controls;
                                    that.options.data = rm.data;
                                    that.options.appletData = rm.applet;
                                    that.options.rootLink = rm.rootLink;
                                    Iptools.uidataTool._getAppletButtons({
                                        applet: that.options.applet
                                    }).done(function (rs) {
                                        that.options.buttons = rs.buttons;
                                        promise.resolve();
                                    }).fail(function () {
                                        promise.resolve();
                                    });
                                });
                            } else {
                                that.options.controls = r.controls;
                                that.options.data = r.data;
                                that.options.appletData = r.applet;
                                that.options.rootLink = r.rootLink;
                                Iptools.uidataTool._getAppletButtons({
                                    applet: that.options.applet
                                }).done(function (rs) {
                                    that.options.buttons = rs.buttons;
                                    promise.resolve();
                                }).fail(function () {
                                    promise.resolve();
                                });
                            }
                        }
                    });
                }
                return promise;
            },
            _buildData: function () {
                var that = this;
                if (that.options.controls) {
                    //controls
                    for (var i = 0; i < that.options.controls.length; i++) {
                        var col = that.options.controls[i];
                        that.options.allControls[col.column] = col;
                        var d = document.createElement("div");
                        var size = 3;
                        if (Iptools.Tool._checkNull(col.size)) {
                            size = col.size;
                        }
                        $(d).addClass("u-control form-group col-sm-" + size).data("index", i).data("column", col.column).data("type", col.type);
                        var valires = that._setValidate({
                            validations: that.options.formValidations,
                            control: col,
                        });
                        that.options.formValidations = valires.validation;
                        var lab = document.createElement("label");
                        $(lab).attr({
                            "class": "control-label",
                            "data-for": col.column
                        });
                        $(lab).html(col.name);
                        if (!col.empty && col.empty != undefined) {
                            $(lab).css("position", "relative").append("<span class='e-star'>*</span>");
                        }
                        $(d).append(lab);
                        if (that.options.mode == "new") {
                            $(d).append(that._setControlNonValued({
                                control: col,
                                valid: valires.valid
                            }));
                        } else if (that.options.mode == "edit") {
                            var tkey = 0;
                            var tValue;
                            if (!Iptools.Tool._checkNull(that.options.data) || !Iptools.Tool._checkNull(that.options.data[col.column])) {
                                tValue = "";
                            } else {
                                tValue = that.options.data[col.column];
                            }
                            if (typeof (tValue) == "object") {
                                for (var ikey in tValue) {
                                    if (ikey != "id") {
                                        tValue = tValue[ikey];
                                    } else {
                                        tkey = tValue[ikey];
                                    }
                                }
                                if (typeof (tValue) == "object") {
                                    tValue = tValue["id"];
                                }
                            }
                            $(d).append(that._setControlValued({
                                control: col,
                                value: tValue,
                                key: tkey,
                                valid: valires.valid
                            }));
                            that._setOriginalData({
                                control: col,
                                value: tValue,
                                key: tkey,
                            });
                        }
                        if (col.type == "hidden" || col.isHidden) {
                            $(d).hide();
                        }
                        that.options.ntrols.push({
                            control: col,
                            dom: d
                        });
                    }
                }
            },
            _apply: function () {
                var that = this;
                that.$container.empty();
                //header
                var thd = "";
                if (that.options.showHeader) {
                    switch (that.options.headerStyle) {
                        case "dock":
                        default:
                            thd = that._setPanelHeader();
                            break;
                        case "pane":
                            break;
                    }
                }
                //controls
                var d = document.createElement("div");
                $(d).addClass("col-sm-12 u-main");
                var form = document.createElement("form");
                $(form).attr("id", that.options.form);
                if (that.options.type != "modal") {
                    $(form).css("padding-bottom", "50px");
                }
                var sec = $("<div class='u-section'><div class='panel-body' id='u-container-"
                    + that.options.section++ + "'></div><div class='clear'></div></div>");
                for (var i = 0; i < that.options.ntrols.length; i++) {
                    if (that.options.cusControls[i.toString()]) {
                        var ccls = that.options.cusControls[i.toString()];
                        if (ccls && ccls.controls && ccls.controls.length) {
                            for (var c = 0; c < ccls.controls.length; c++) {
                                var con = ccls.controls[c];
                                var cd = document.createElement("div");
                                $(cd).addClass("form-group col-sm-" + con.size).append($(con.dom).show());
                                $(sec).find("#u-container-" + (that.options.section - 1)).append(cd);
                            }
                        }
                    }
                    var col = that.options.ntrols[i];
                    if (col && col.control) {
                        if (col.control.isSeparate) {
                            if ($(sec).find(".u-control").length > 0) {
                                $(form).append(sec);
                            }
                            sec = that._setSeprateTitle(col.control.separateTitle);
                        }
                        $(sec).find("#u-container-" + (that.options.section - 1)).append(col.dom);
                        if (col.control.isNewLine) {
                            $(sec).find("#u-container-" + (that.options.section - 1)).append("<div class='clear'></div>");
                        }
                    }
                }
                if (that.options.cusControls["-1"]) {
                    var cmls = that.options.cusControls["-1"];
                    if (cmls && cmls.controls && cmls.controls.length) {
                        for (var cm = 0; cm < cmls.controls.length; cm++) {
                            var cmn = cmls.controls[cm];
                            var md = document.createElement("div");
                            $(md).addClass("form-group col-sm-" + cmn.size).append($(cmn.dom).show());
                            $(sec).find("#u-container-" + (that.options.section - 1)).append(md);
                        }
                    }
                }
                $(form).append(sec);
                if (!$.isEmptyObject(that.options.formValidations)) {
                    try {
                        $(form).bootstrapValidator({fields: that.options.formValidations});
                    } catch (e) {
                        console.log("ERROR: Required BootStrap Validator Plugin");
                    }
                }
                //bind datePicker
                try {
                    $(form).find(".dateStampPicker").datetimepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        todayBtn: true,
                        language: "zh-CN",
                        minView: "month"
                    }).on('hide', function () {
                        var me = $(this);
                        me.trigger("input");
                        me.trigger("blur");
                        try {
                            $(form).data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
                        } catch (ev) {
                            console.log("ERROR: Required BootStrap Validator Plugin");
                        }
                    });
                    $(form).find(".timeStampPicker").datetimepicker({
                        format: "yyyy-mm-dd hh:00",
                        autoclose: true,
                        todayBtn: true,
                        language: "zh-CN",
                        minView: 1
                    }).on('hide', function () {
                        var me = $(this);
                        me.trigger("input");
                        me.trigger("blur");
                        try {
                            $(form).data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
                        } catch (ev) {
                            console.log("ERROR: Required BootStrap Validator Plugin");
                        }
                    });
                } catch (e) {
                    console.log("ERROR: required datetimepicker");
                }
                //bind switch-box
                try {
                    $(form).find(".switch-checkbox").bootstrapSwitch({
                        onText: "是",
                        offText: "否",
                        size: "small",
                        handleWidth: 50,
                        labelWidth: 30
                    });
                } catch (e) {
                    console.log("ERROR: Required Bootstrap Switch");
                }
                that.$container.append($(d).append(thd, form));
                //searchModal
                if (that.options.type == "modal") {
                    var sd = document.createElement('div');
                    that.$container.after($(sd).attr("id", that.options.searchModalList));
                    $("#" + that.options.searchModalList).css('background', "#fff");
                } else {
                    var modal = document.createElement('div');
                    $(modal).addClass("modal fade").attr({
                        "id": that.options.searchModal,
                        "tabindex": "-1",
                        "role": "dialog",
                        "data-backdrop": "static"
                    });
                    var mdialog = document.createElement('div');
                    $(mdialog).addClass('modal-dialog').attr("role", "document").css("width", "800px");
                    var mcontent = document.createElement('div');
                    $(mcontent).addClass('modal-content').css({
                        "width": "auto",
                        "min-height": "200px"
                    }).append(
                        "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' " +
                        "aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' " +
                        ">" + that.options.searchModalTitle + "</h4></div>",
                        "<div class='modal-body' style='padding:0'><div id='" + that.options.searchModalList + "'></div></div>",
                        "<div class='modal-footer'><button type='button' class='btn commonBtn search-confirm'>确定</button>" +
                        "<button type='button' class='btn cancel revert' data-dismiss='modal' style='margin-left:5px;'>取消</button></div>");
                    that.$container.after($(modal).append($(mdialog).append(mcontent)));
                }
                //panels
                for (var p = 0; p < that.options.panels.length; p++) {
                    var pan = that.options.panels[p];
                    if (pan.type == "button") {
                        var btn = $("<button type='button' class='btn small commonBtn revert no-container'><span class='" +
                            (pan.icon ? pan.icon : "fa fa-th") + "'></span>" + pan.name + "</button>")
                        $(thd).append(btn);
                        if (pan.onShow && typeof pan.onShow == "function") {
                            btn.bind("click", pan.onShow);
                        }
                    } else {
                        if (pan && pan.name && pan.container) {
                            $(thd).append($("<button type='button' class='btn small commonBtn revert'><span class='" +
                                (pan.icon ? pan.icon : "fa fa-th") + "'></span>" + pan.name + "</button>")
                                .data("panel", pan.container));
                            that.$container.append($("#" + pan.container).addClass("u-panel"));
                            $("#" + pan.container).hide();
                            if (pan.onShow && typeof pan.onShow == "function") {
                                $("#" + pan.container).bind("u-show", pan.onShow);
                            }
                        }
                    }
                }
                if (that.options.afterLoad && typeof that.options.afterLoad == "function") {
                    that.options.afterLoad();
                }
                //calLinks
                for (var ic = 0; ic < that.options.controlCalLinks.length; ic++) {
                    that._loadControlCalLinks({
                        key: that.options.controlCalLinks[ic].key,
                        value: that.options.controlCalLinks[ic].value
                    });
                }
                //triggers
                for (var it = 0; it < that.options.controlTriggers.length; it++) {
                    that.loadControlTrigger(that.options.controlTriggers[it]);
                }
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
            loadControlTrigger: function (trigger) {
                var that = this;
                var target = that.$container.find("input[name='" + trigger.column + "']");
                if (!target.length) {
                    target = that.$container.find("select[name='" + trigger.column + "']");
                }
                switch (trigger.formula.type) {
                    case "switch":
                        target.on("switchChange.bootstrapSwitch", function (event, state) {
                            try {
                                if (state) {
                                    if (trigger.formula.event.toTrue.show && trigger.formula.event.toTrue.show.length) {
                                        for (var i = 0; i < trigger.formula.event.toTrue.show.length; i++) {
                                            var col = trigger.formula.event.toTrue.show[i];
                                            var tObj = that.$container.find("input[name='" + col + "']");
                                            if (!tObj.length) {
                                                tObj = that.$container.find("select[name='" + col + "']");
                                            }
                                            tObj.closest(".u-control").show();
                                        }
                                    }
                                } else {
                                    if (trigger.formula.event.toFalse.hide && trigger.formula.event.toFalse.hide.length) {
                                        for (var f = 0; f < trigger.formula.event.toFalse.hide.length; f++) {
                                            var cof = trigger.formula.event.toFalse.hide[f];
                                            var fObj = that.$container.find("input[name='" + cof + "']");
                                            if (!fObj.length) {
                                                fObj = that.$container.find("select[name='" + cof + "']");
                                            }
                                            fObj.closest(".u-control").hide();
                                        }
                                    }
                                }
                            } catch (e) {
                                console.log("Control Trigger Expression Syntax Error");
                            }
                        });
                        break;
                }
            },
            _loadControlCalLinks: function (cal) {
                var that = this;
                var cols = that._spiltCalLink({
                    str: cal.value
                });
                var target = that.$container.find("input[name='" + cal.key + "']");
                if (!target.length) {
                    target = that.$container.find("select[name='" + cal.key + "']");
                }
                for (var j = 0; j < cols.length; j++) {
                    var ms = cols[j];
                    var tObj = that.$container.find("input[name='" + ms + "']");
                    if (!tObj.length) {
                        tObj = that.$container.find("select[name='" + ms + "']");
                    }
                    if (tObj.length) {
                        tObj.on("focus", function () {
                            if (target.closest(".u-control").data("type") == "bool") {
                                target.closest(".bootstrap-switch").addClass("box-focus-shadow");
                            } else if (target.parent().hasClass("input-group")) {
                                target.parent().addClass("box-focus-shadow");
                            } else {
                                target.addClass("box-focus-shadow");
                            }
                        });
                        tObj.on("blur", function () {
                            if (target.closest(".u-control").data("type") == "bool") {
                                target.closest(".bootstrap-switch").removeClass("box-focus-shadow");
                            } else if (target.parent().hasClass("input-group")) {
                                target.parent().removeClass("box-focus-shadow");
                            } else {
                                target.removeClass("box-focus-shadow");
                            }
                        });
                        tObj.on("input change switchChange.bootstrapSwitch", function () {
                            var flag = true;
                            var cstr = cal.value;
                            for (var x = 0; x < cols.length; x++) {
                                var targetObj = that.$container.find("input[name='" + cols[x] + "']");
                                if (!targetObj.length) {
                                    targetObj = that.$container.find("select[name='" + cols[x] + "']");
                                }
                                if (targetObj.closest(".u-control").data("type") == "bool") {
                                    cstr = cstr.replace(eval("/{" + cols[x] + "}/g"), targetObj.bootstrapSwitch("state"));
                                } else if (targetObj.closest(".u-control").hasClass("has-error")
                                    || Iptools.Tool._blank_replacement(targetObj.val()) == "") {
                                    flag = false;
                                } else {
                                    cstr = cstr.replace(eval("/{" + cols[x] + "}/g"), that._getCalControlVal(targetObj));
                                }
                            }
                            if (flag) {
                                try {
                                    var result = eval(cstr);
                                    var intreg = /^(-|\+)?\d+$/;
                                    var floatreg = /^(-|\+)?\d+\.\d*$/;
                                    if (target.closest(".u-control").data("type") == "bool") {
                                        var rf = false;
                                        if (target.bootstrapSwitch("disabled")) {
                                            rf = true;
                                            target.bootstrapSwitch("disabled", false);
                                        }
                                        target.bootstrapSwitch("state", result ? true : false);
                                        if (rf) {
                                            target.bootstrapSwitch("disabled", true);
                                        }
                                    } else if (typeof (result) == "string") {
                                        target.val(result);
                                    } else if (typeof (result) == "number") {
                                        if (intreg.test(result)) {
                                            target.val(eval(cstr));
                                        } else if (floatreg.test(result)) {
                                            target.val(eval(cstr).toFixed(2));
                                        }
                                    }
                                } catch (e) {
                                    console.log("CAL Expressions Syntax Error");
                                }
                            } else {
                                if (target.closest(".u-control").data("type") == "bool") {
                                    var df = false;
                                    if (target.bootstrapSwitch("disabled")) {
                                        df = true;
                                        target.bootstrapSwitch("disabled", false);
                                    }
                                    target.bootstrapSwitch("state", false);
                                    if (df) {
                                        target.bootstrapSwitch("disabled", true);
                                    }
                                } else {
                                    target.val("");
                                }
                            }
                            if (target.length) {
                                target.trigger("blur change switchChange.bootstrapSwitch");
                            }
                        });
                    }
                }
            },
            _getCalControlVal: function (target) {
                var val = target.val();
                var intreg = /^(-|\+)?\d+$/;
                var floatreg = /^(-|\+)?\d+\.\d*$/;
                if (intreg.test(val) || floatreg.test(val)) {
                    return val;
                } else {
                    return "'" + val + "'";
                }
            },
            _setOriginalData: function (options) {
                var that = this;
                switch (options.control.type) {
                    case "pickApplet":
                    case "pickDetailApplet":
                    case "select":
                    case "radio":
                        that.options.DataOriginalSets[options.control.column] = options.key;
                        break;
                    default:
                        that.options.DataOriginalSets[options.control.column] = options.value;
                        break;
                }
            },
            _setPanelHeader: function () {
                var that = this;
                var nav = document.createElement("nav");
                $(nav).addClass("navbar navbar-default u-header");
                var dc = document.createElement("div");
                $(dc).addClass("container-fluid");
                var dn = document.createElement("div");
                $(dn).addClass("navbar-header");
                var btn = document.createElement("button");
                $(btn).addClass("navbar-toggle collapsed");
                $(btn).attr("type", "button");
                $(btn).attr("data-toggle", "collapse");
                $(btn).attr("data-target", "#nav_bar_" + that.options.appletData.id);
                $(btn).attr("aria-expanded", "false");
                $(btn).append("<span class='sr-only'>Toggle</span>");
                $(btn).append("<span class='fa fa-bar'></span>");
                $(btn).append("<span class='fa fa-bar'></span>");
                $(btn).append("<span class='fa fa-bar'></span>");
                var at = document.createElement("a");
                $(at).addClass("navbar-brand");
                if (that.options.showTitle) {
                    $(at).html(that.options.appletData.displayName);
                }
                $(dn).append(btn, at);
                var dcf = document.createElement("div");
                $(dcf).addClass("collapse navbar-collapse");
                $(dcf).attr("id", "nav_bar_" + that.options.appletData.id);
                var ul = document.createElement("ul");
                $(ul).addClass("nav navbar-nav navbar-right button-nav");
                $(dcf).append(ul);
                $(dc).append(dn, dcf);
                $(nav).append(dc);
                return nav;
            },
            _setButtonsPanel: function () {
                var that = this;
                var btp = document.createElement("div");
                if (that.options.buttons.length) {
                    for (var i = 0; i < that.options.buttons.length; i++) {
                        var btn = that.options.buttons[i];
                        if (btn.name.length == 2) {
                            btn.name = btn.name.substr(0, 1) + " " + btn.name.substr(1, 1);
                        }
                        $(btp).append($("<button class='btn " + btn.style + " " + btn.type + "' " +
                            "data-loading-text=\"<span class='fa fa-spin fa fa-spinner'></span>执行中\">" +
                            "<span class='text'>" + btn.name + "</span></button>").data("view", btn.createView)
                            .data("applet", btn.createApplet));
                    }
                }
                return btp;
            },
            _setSeprateTitle: function (title) {
                var that = this;
                var sdiv = document.createElement("div");
                $(sdiv).addClass("panel panel-default u-section")
                    .css("margin-bottom", that.options.sectionMargin + "px");
                if (Iptools.Tool._checkNull(title)) {
                    $(sdiv).append("<div class='panel-heading clp' role='tab'>" + title + "<span class='fa fa-angle-up helper'></span>" +
                        "<div class='button-nav'></div></div>");
                } else {
                    $(sdiv).addClass("section-border");
                }
                $(sdiv).append("<div class='panel-collapse collapse in' role='tabpanel'><div class='panel-body' id='u-container-"
                    + that.options.section++ + "'></div><div class='clear'></div></div>");
                if (that.options.section == 3) {
                    var btp;
                    //buttons
                    if (that.options.showButton) {
                        btp = that._setButtonsPanel();
                        $(sdiv).find(".button-nav").append(btp);
                    }
                }
                return sdiv;
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
                            regexp: /(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2})$/,
                            message: "请输入正确的时间格式（yyyy-MM-dd HH:mm）"
                        }
                        track = true;
                        break;
                    case "date":
                        vdr["regexp"] = {
                            regexp: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                            message: "请输入正确的日期格式（yyyy-MM-dd）"
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
                    options.validations[options.control.column] = {
                        validators: vdr,
                    }
                }
                return {validation: options.validations, valid: track};
            },
            //load every control field according to its own type
            //type series :text time pickApplet select date check radio picture textarea file percent rmb hidden
            //the values of given controls are empty and needless to initial
            _setControlNonValued: function (options) {
                var that = this;
                var ip = document.createElement("input");
                var dg = document.createElement("div");
                var sg = document.createElement("span");
                var sp = document.createElement("span");
                var sd = document.createElement("span");
                var sdf = document.createElement("span");
                var sl = document.createElement("select");
                if (options.control.isCalControl) {
                    try {
                        var foa = eval("(" + options.control.formula + ")");
                        if (foa && foa.cal) {
                            that.options.controlCalLinks.push({
                                key: options.control.column,
                                value: foa.cal
                            });
                        }
                    } catch (e) {
                        console.log("CAL Expressions Syntax Error");
                    }
                }
                if (options.control.isTrigger) {
                    try {
                        var tfo = eval("(" + options.control.triggerFormula + ")");
                        if (tfo) {
                            that.options.controlTriggers.push({
                                column: options.control.column,
                                formula: tfo
                            });
                        }
                    } catch (e) {
                        console.log("Trigger Expressions Syntax Error");
                    }
                }
                switch (options.control.type) {
                    case "text":
                    default:
                        $(ip).data("column", options.control.column);
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).attr("type", "text");
                        $(ip).data("applet", options.control.pickApplet);
                        $(ip).attr("name", options.control.column);
                        if (!options.control.insert || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        return ip;
                    case "pwd":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "password");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.insert || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        $(sg).addClass("input-group-addon pwd");
                        $(sp).addClass("fa fa-eye-close");
                        $(sg).append(sp);
                        $(dg).append(ip, sg);
                    case "time":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control timeStampPicker control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.insert || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        $(sg).addClass("input-group-addon t-addon");
                        $(sp).addClass("fa fa-clock-o");
                        $(sg).append(sp);
                        $(dg).append(ip, sg);
                        return dg;
                    case "pickApplet":
                    case "pickDetailApplet":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).data("relatedColumn", options.control.formula);
                        $(ip).data("pick", "1");
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("readonly", "readonly");
                        $(ip).attr("data-valid", options.valid);
                        $(ip).data("detailApplet", options.control.detailApplet);
                        $(sg).addClass("input-group-addon modalSearch").data("applet", options.control.pickApplet);
                        $(sp).addClass("fa fa-search").attr("title", "选择");
                        $(sg).append(sp);
                        $(sdf).addClass("input-group-addon clearSearchPick").css("border-left", "1px #fff solid");
                        $(sd).addClass("fa fa-trash");
                        $(sd).attr("aria-hidden", "true");
                        $(sd).attr("title", "清空");
                        $(sd).attr("type", "button");
                        $(sd).css("cursor", "pointer");
                        $(sdf).append(sd);
                        $(dg).append(ip, sg, sdf);
                        return dg;
                    case "pickFor":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text control-pick-for");
                        $(ip).data("column", options.control.column);
                        if (Iptools.Tool._checkNull(options.control.formula)) {
                            var fm = eval("(" + options.control.formula + ")");
                            if (fm && fm.relatedColumn) {
                                $(ip).data("relatedColumn", fm.relatedColumn);
                            }
                            if (fm && fm.reg) {
                                $(ip).data("reg", fm.reg);
                            }
                            if (fm && fm.regMsg) {
                                $(ip).data("regMsg", fm.regMsg);
                            }
                        }
                        $(ip).data("cascadeFields", options.control.cascadeFields);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("data-valid", options.valid);
                        $(ip).data("applet", options.control.pickApplet);
                        $(sg).addClass("input-group-addon u-co-pick-for").append($(sp).addClass("fa fa-caret-down"))
                            .attr({
                                "aria-haspopup": "true",
                                "aria-expanded": "false",
                                "data-toggle": "dropdown"
                            }).css("border-radius", "0 4px 4px 0");
                        var ul = document.createElement("ul");
                        $(ul).addClass('dropdown-menu u-ul-pick-for iscroll').append("<li class='ut-hint'><a>请输入关键字...</a></li>");
                        $(dg).append(ip, sg, ul);
                        return dg;
                    case "pickselect":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("form-control control-normal-select");
                        $(sl).css("box-sizing", "border-box");
                        $(sl).attr("name", options.control.column);
                        $(sl).append("<option value=''>请选择</option>");
                        $.each(component._setPickOptions(options), function (key, obj) {
                            var op = document.createElement("option");
                            $(op).attr("value", obj.key);
                            if (options.control.defaultValue == obj.key) {
                                $(op).attr("selected", "selected");
                            }
                            $(op).html(obj.value);
                            $(sl).append(op);
                        });
                        if (!options.control.insert || options.control.readonly) {
                            $(sl).attr("disabled", "disabled");
                        }
                        return sl;
                    case "select":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("form-control control-normal-select");
                        $(sl).css("box-sizing", "border-box");
                        $(sl).append("<option value=''>请选择</option>");
                        $(sl).attr("name", options.control.column);
                        $.each(options.control.pickList, function (key, obj) {
                            var op = document.createElement("option");
                            $(op).attr("value", obj.id);
                            $(op).html(obj.name);
                            if (options.control.defaultValue == obj.id) {
                                $(op).attr("selected", "selected");
                            }
                            $(sl).append(op);
                        });
                        if (!options.control.insert || options.control.readonly) {
                            $(sl).attr("disabled", "disabled");
                        }
                        return sl;
                    case "date":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control dateStampPicker control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.insert || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        $(sg).addClass("input-group-addon t-addon");
                        $(sp).addClass("fa fa-calendar");
                        $(sp).attr("aria-hidden", "true");
                        $(sp).attr("type", "button");
                        $(sg).append(sp);
                        $(dg).append(ip, sg);
                        return dg;
                    case "check":
                        $(sg).addClass("cr-group form-control");
                        $(sg).data("column", options.control.column);
                        $(sg).css("border", "0").css("box-shadow", "none");
                        $.each(options.control.pickList, function (key, obj) {
                            var lab = document.createElement("label");
                            $(lab).addClass("checkbox-inline");
                            $(lab).css({"margin": "0 10px 0 0"});
                            var ipt = document.createElement("input");
                            $(ipt).addClass("input-cr");
                            $(ipt).attr("type", "checkbox");
                            $(ipt).attr("name", options.control.column);
                            $(ipt).val(obj.id);
                            if (!options.control.insert || options.control.readonly) {
                                $(ipt).attr("disabled", "disabled");
                            }
                            if (options.control.defaultValue && options.control.defaultValue.indexOf(obj.id) > -1) {
                                $(ipt).attr("checked", "checked");
                                that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                            }
                            $(lab).append(ipt, obj.name);
                            $(sg).append(lab);
                        });
                        return sg;
                    case "radio":
                        $(sg).addClass("cr-group form-control");
                        $(sg).data("column", options.control.column);
                        $(sg).css("border", "0").css("box-shadow", "none");
                        $.each(options.control.pickList, function (key, obj) {
                            var lab = document.createElement("label");
                            $(lab).addClass("radio-inline");
                            var ipt = document.createElement("input");
                            $(ipt).addClass("input-cr");
                            $(ipt).attr("type", "radio");
                            $(ipt).attr("name", options.control.column);
                            $(ipt).val(obj.id);
                            if (!options.control.insert || options.control.readonly) {
                                $(ipt).attr("disabled", "disabled");
                            }
                            if (options.control.defaultValue && options.control.defaultValue.indexOf(obj.id) > -1) {
                                $(ipt).attr("checked", "checked");
                                that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                            }
                            $(lab).append(ipt, obj.name);
                            $(sg).append(lab);
                        });
                        return sg;
                    case "picture":
                    case "cropImage":
                        $(dg).css("text-align", "left").css("height", "90px");
                        var a = document.createElement("a");
                        $(a).addClass("lightboxLink");
                        if (options.control.type == "cropImage") {
                            $(a).addClass("with-crop");
                        }
                        $(a).data("has", false);
                        $(a).attr("href", "#");
                        $(a).data("column", options.control.column);
                        var img = document.createElement("img");
                        $(img).attr("src", component._UIDEFAULFS.defaultPicturePath);
                        $(img).attr("width", "90");
                        $(img).css("max-height", "90px");
                        $(img).attr("alt", "");
                        $(a).append(img);
                        var af = document.createElement("a");
                        $(af).addClass("img-file");
                        $(af).append("更改");
                        $(ip).attr("type", "file");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("accept", ".jpg,.png");
                        $(af).append(ip);
                        if (!options.control.insert || options.control.readonly) {
                            $(dg).append(a);
                        } else {
                            $(dg).append(a, af);
                        }
                        return dg;
                    case "textarea":
                        var txa = document.createElement("textarea");
                        $(txa).data("column", options.control.column);
                        $(txa).attr("name", options.control.column);
                        $(txa).addClass("form-control detailTextarea");
                        $(txa).css("width", "95%");
                        if (!options.control.insert || options.control.readonly) {
                            $(txa).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(txa).text(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        return txa;
                    case "richtext":
                        $(dg).addClass("richtext-area");
                        $(dg).data("column", options.control.column);
                        if (!options.control.insert || options.control.readonly) {
                            $(dg).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(dg).html(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        return dg;
                    case "file":
                        var iconUrl = that.options.defaultFilePath;
                        $(dg).css("text-align", "left");
                        var df = document.createElement("div");
                        $(df).addClass("file-data");
                        $(df).data("has", false);
                        $(df).data("column", options.control.column);
                        var im = document.createElement("img");
                        $(im).attr("src", iconUrl);
                        $(im).attr("width", "80");
                        $(im).attr("alt", "");
                        var p = document.createElement("p");
                        $(p).css("display", "inline-block");
                        var afu = document.createElement("a");
                        $(afu).addClass("file-upload");
                        $(sp).html("上传");
                        $(ip).attr("type", "file");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("accept", ".doc,.docx,.xls,.xlsx,.ppt,.pptx");
                        $(afu).append(sp, ip);
                        $(df).append(im, p, afu);
                        $(dg).append(df);
                        return dg;
                    case "percent":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).css("text-align", "right");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.insert || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        $(sg).addClass("input-group-addon static");
                        $(sp).attr("type", "button");
                        $(sp).attr("aria-hidden", "true");
                        $(sp).html("%");
                        $(sg).append(sp);
                        $(dg).append(ip, sg);
                        return dg;
                    case "rmb":
                        $(dg).addClass("input-group");
                        $(sg).addClass("input-group-addon static");
                        $(sp).attr("type", "button");
                        $(sp).attr("aria-hidden", "true");
                        $(sp).html("￥");
                        $(sg).append(sp);
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.insert || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        $(dg).append(sg, ip);
                        return dg;
                    case "cascade":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("form-control control-normal-select");
                        $(sl).css("box-sizing", "border-box");
                        $(sl).attr("name", options.control.column);
                        $(sl).append("<option value=''>请选择</option>");
                        $(sl).attr("disabled", "disabled");
                        $(sl).data("applet", options.control.pickApplet);
                        that._setCascadeListener(options);
                        return sl;
                    case "hidden":
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "hidden");
                        $(ip).attr("name", options.control.column);
                        $(ip).addClass("form-control control-normal-text");
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            $(ip).val(options.control.defaultValue);
                            that.options.DataCurrentSets[options.control.column] = options.control.defaultValue;
                        }
                        return ip;
                    case "bool":
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "checkbox");
                        $(ip).addClass("switch-checkbox");
                        if (!options.control.insert || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                            if (options.control.defaultValue == "1") {
                                $(ip).attr("checked", "checked");
                                that.options.DataCurrentSets[options.control.column] = "1";
                            } else {
                                that.options.DataCurrentSets[options.control.column] = "0";
                            }
                        }
                        $(dg).append(ip);
                        return dg;
                }
            },
            //load every control field according to its own type
            //type series :text time pickApplet select date check radio picture textarea file percent rmb hidden
            //this sets gots its value for controls
            _setControlValued: function (options) {
                var that = this;
                var ip = document.createElement("input");
                var dg = document.createElement("div");
                var sg = document.createElement("span");
                var sp = document.createElement("span");
                var sd = document.createElement("span");
                var sdf = document.createElement("span");
                var sgf = document.createElement("span");
                var spf = document.createElement("span");
                var sl = document.createElement("select");
                if (options.control.isCalControl) {
                    try {
                        var foa = eval("(" + options.control.formula + ")");
                        if (foa && foa.cal) {
                            that.options.controlCalLinks.push({
                                key: options.control.column,
                                value: foa.cal
                            });
                        }
                    } catch (e) {
                        console.log("CAL Expressions Syntax Error");
                    }
                }
                if (options.control.isTrigger) {
                    try {
                        var tfo = eval("(" + options.control.triggerFormula + ")");
                        if (tfo) {
                            that.options.controlTriggers.push({
                                column: options.control.column,
                                formula: foa
                            });
                        }
                    } catch (e) {
                        console.log("Trigger Expressions Syntax Error");
                    }
                }
                switch (options.control.type) {
                    case "text":
                    default:
                        $(ip).data("column", options.control.column);
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).attr("type", "text");
                        $(ip).data("applet", options.control.pickApplet);
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "int":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "text");
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        $(sg).addClass("input-group-addon static");
                        $(sp).html("N");
                        $(sg).append(sp);
                        $(dg).append(sg, ip);
                        return dg;
                    case "float":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "text");
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        $(sg).addClass("input-group-addon static");
                        $(sp).html("F");
                        $(sg).append(sp);
                        $(dg).append(sg, ip);
                        return dg;
                    case "pwd":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "password");
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        $(sg).addClass("input-group-addon pwd");
                        $(sp).addClass("fa fa-eye-close");
                        $(sg).append(sp);
                        $(dg).append(sg, ip);
                        return dg;
                    case "time":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control timeStampPicker control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        $(sg).addClass("input-group-addon t-addon");
                        $(sp).addClass("fa fa-clock-o");
                        $(sg).append(sp);
                        $(dg).append(ip, sg);
                        return dg;
                    case "pickApplet":
                    case "pickDetailApplet":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text control-copy-listener");
                        $(ip).data({
                            "column": options.control.column,
                            "relatedColumn": options.control.formula,
                            "key": options.key,
                            "pick": "1",
                            "detailApplet": options.control.detailApplet,
                            "control": options.control.id
                        }).attr({
                            "type": "text",
                            "name": options.control.column,
                            "readonly": "readonly",
                            "data-valid": options.valid
                        }).val(options.value);
                        $(sg).addClass("input-group-addon modalSearch");
                        $(sdf).addClass("input-group-addon clearSearchPick");
                        $(sdf).css("border-left", "1px #fff solid");
                        $(sd).addClass("fa fa-trash");
                        $(sd).attr("title", "清空");
                        $(sdf).append(sd);
                        $(sp).addClass("fa fa-search");
                        $(sp).attr("title", "选择");
                        $(sg).append(sp).data("applet", options.control.pickApplet);
                        if (options.control.destinationView) {
                            $(sgf).addClass("input-group-addon t-view-jump");
                            $(spf).attr("type", "button");
                            if (options.key) {
                                $(spf).attr("title", "查看");
                                $(spf).addClass("fa fa-eye-open hyperLinkAView");
                            } else {
                                $(spf).addClass("fa fa-eye-close");
                            }
                            $(sgf).data("key", options.control.destinationView);
                            $(sgf).data("id", options.key);
                            $(sgf).append(spf);
                            $(dg).append(sgf);
                        }
                        if ((!options.control.modify || options.control.readonly) && !options.control.destinationView) {
                            return ip;
                        } else if (!options.control.modify || options.control.readonly) {
                            $(dg).append(ip);
                        } else {
                            $(dg).append(ip, sg, sdf);
                        }
                        return dg;
                    case "pickFor":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text control-pick-for");
                        $(ip).data("column", options.control.column);
                        if (Iptools.Tool._checkNull(options.control.formula)) {
                            var fm = eval("(" + options.control.formula + ")");
                            if (fm && fm.relatedColumn) {
                                $(ip).data("relatedColumn", fm.relatedColumn);
                            }
                            if (fm && fm.reg) {
                                $(ip).data("reg", fm.reg);
                            }
                            if (fm && fm.regMsg) {
                                $(ip).data("regMsg", fm.regMsg);
                            }
                        }
                        $(ip).data("cascadeFields", options.control.cascadeFields);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("data-valid", options.valid).val(options.value);
                        $(ip).data("applet", options.control.pickApplet);
                        $(sg).addClass("input-group-addon u-co-pick-for").append($(sp).addClass("fa fa-caret-down"))
                            .attr({
                                "aria-haspopup": "true",
                                "aria-expanded": "false",
                                "data-toggle": "dropdown"
                            }).css("border-radius", "0 4px 4px 0");
                        var ul = document.createElement("ul");
                        $(ul).addClass('dropdown-menu u-ul-pick-for iscroll').append("<li class='ut-hint'><a>请输入关键字...</a></li>");
                        $(dg).append(ip, sg, ul);
                        return dg;
                    case "pickselect":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("form-control control-normal-select");
                        $(sl).css("box-sizing", "border-box");
                        $(sl).attr("name", options.control.column);
                        $(sl).append("<option value=''>请选择</option>");
                        $.each(that._setPickOptions(options), function (key, obj) {
                            var op = document.createElement("option");
                            $(op).attr("value", obj.key);
                            if (options.key == obj.key) {
                                $(sl).find("option").removeAttr("selected");
                                $(op).attr("selected", "selected");
                            }
                            $(op).html(obj.value);
                            $(sl).append(op);
                        });
                        if (!options.control.modify || options.control.readonly) {
                            $(sl).attr("disabled", "disabled");
                        }
                        return sl;
                    case "cascade":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("form-control control-normal-select");
                        $(sl).css("box-sizing", "border-box");
                        $(sl).attr("name", options.control.column);
                        $(sl).append("<option value=''>请选择</option>");
                        $(sl).attr("disabled", "disabled");
                        $(sl).data("applet", options.control.pickApplet);
                        if (Iptools.Tool._checkNull(options.key)) {
                            $(sl).append("<option value='" + options.key + "' selected='selected'>" + options.value + "</option>");
                        }
                        that._setCascadeListener(options);
                        return sl;
                    case "select":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("form-control control-normal-select");
                        $(sl).css("box-sizing", "border-box");
                        $(sl).attr("name", options.control.column);
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
                        if (!options.control.modify || options.control.readonly) {
                            $(sl).attr("disabled", "disabled");
                        }
                        return sl;
                    case "date":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control dateStampPicker control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        $(sg).addClass("input-group-addon t-addon");
                        $(sp).addClass("fa fa-calendar");
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
                            $(lab).css({"margin": "0 10px 0 0"});
                            var ipt = document.createElement("input");
                            $(ipt).addClass("input-cr");
                            $(ipt).attr("type", "checkbox");
                            $(ipt).val(obj.id);
                            if (!options.control.modify || options.control.readonly) {
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
                            $(ipt).addClass("input-cr");
                            $(ipt).attr("type", "radio");
                            $(ipt).attr("name", options.control.column + "_radio");
                            $(ipt).val(obj.id);
                            if (!options.control.modify || options.control.readonly) {
                                $(ipt).attr("disabled", "disabled");
                            }
                            if (options.key && options.key.indexOf(obj.id) > -1) {
                                $(ipt).attr("checked", "checked");
                            }
                            $(lab).append(ipt, obj.name);
                            $(sg).append(lab);
                        });
                        return sg;
                    case "image":
                        $(dg).css("text-align", "left").css("padding-left", "5px").css("height", "80px");
                        var ia = document.createElement("a");
                        $(ia).addClass("imageLink");
                        $(ia).data("has", false);
                        $(ia).data("name", options.control.column);
                        if (options.value) {
                            if (!options.control.empty && options.control.empty != undefined && options.control.modify && !options.control.readonly) {
                                $(ia).addClass("imageLinkControlInput");
                            }
                            $(ia).data("has", true);
                            $(ia).data("href", options.value);
                            $(ia).attr("href", "../ImageView?path=" + options.value);
                        }
                        $(ia).attr("target", "_blank");
                        $(ia).data("column", options.control.column);
                        var iaim = document.createElement("img");
                        if (options.value) {
                            $(iaim).attr("src", options.value);
                        } else {
                            $(iaim).attr("src", component._UIDEFAULFS.defaultPicturePath);
                        }
                        $(iaim).attr("width", "80");
                        $(iaim).css("max-height", "80px");
                        $(iaim).attr("alt", "");
                        $(ia).append(iaim);
                        var iaaf = document.createElement("a");
                        $(iaaf).addClass("img-link");
                        $(iaaf).append("更改");
                        $(ip).attr("type", "file");
                        $(ip).attr("accept", ".jpg,.png,.gif");
                        $(ip).attr("name", options.control.column);
                        $(iaaf).append(ip);
                        if (!options.control.modify || options.control.readonly) {
                            $(dg).append(ia);
                        } else {
                            $(dg).append(ia, iaaf);
                        }
                        return dg;
                    case "picture":
                    case "cropImage":
                        $(dg).css("text-align", "left").css("height", "90px");
                        var a = document.createElement("a");
                        $(a).addClass("lightboxLink");
                        $(a).data("has", false).attr("href", "#");
                        if (options.value) {
                            $(a).data("has", true);
                        }
                        if (options.control.type == "cropImage") {
                            $(a).addClass("with-crop");
                        }
                        $(a).data("column", options.control.column);
                        var img = document.createElement("img");
                        if (options.value) {
                            $(img).attr("src", options.value);
                        } else {
                            $(img).attr("src", component._UIDEFAULFS.defaultPicturePath);
                        }
                        $(img).attr("width", "90");
                        $(img).css("max-height", "90px");
                        $(img).attr("alt", "");
                        $(a).append(img);
                        var af = document.createElement("a");
                        $(af).addClass("img-file");
                        $(af).append("更改");
                        $(ip).attr("type", "file");
                        $(ip).attr("accept", ".jpg,.png,.gif");
                        $(ip).attr("name", options.control.column);
                        $(af).append(ip);
                        if (!options.control.modify || options.control.readonly) {
                            $(dg).append(a);
                        } else {
                            $(dg).append(a, af);
                        }
                        return dg;
                    case "textarea":
                        var txa = document.createElement("textarea");
                        $(txa).data("column", options.control.column);
                        $(txa).addClass("form-control detailTextarea");
                        if (!options.control.modify || options.control.readonly) {
                            $(txa).attr("disabled", "disabled");
                        }
                        $(txa).text(options.value);
                        return txa;
                    case "richtext":
                        $(dg).addClass("richtext-area");
                        $(dg).data("column", options.control.column);
                        if (!options.control.modify || options.control.readonly) {
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
                            iconUrl = component._UIDEFAULFS.defaultWordPath;
                        } else if (filename.indexOf("xls") > 0) {
                            iconUrl = component._UIDEFAULFS.defaultExcelPath;
                        } else if (filename.indexOf("ppt") > 0) {
                            iconUrl = component._UIDEFAULFS.defaultPPTPath;
                        } else {
                            iconUrl = component._UIDEFAULFS.defaultFilePath;
                        }
                        $(dg).css("text-align", "left");
                        var df = document.createElement("div");
                        $(df).addClass("file-data");
                        if (options.value) {
                            if (!options.control.modify || options.control.readonly) {
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
                        $(afu).addClass("file-upload");
                        if (options.value) {
                            $(sp).html("更改");
                        } else {
                            $(sp).html("上传");
                        }
                        $(ip).attr("type", "file");
                        $(ip).attr("accept", ".doc,.docx,.xls,.xlsx,.ppt,.pptx");
                        $(ip).attr("name", options.control.column);
                        $(afu).append(sp, ip);
                        if (!options.control.modify || options.control.readonly) {
                            $(df).append(im, p);
                        } else {
                            $(df).append(im, p, afu);
                        }
                        if (pathname) {
                            var afd = document.createElement("a");
                            $(afd).addClass("file-download");
                            $(afd).attr("href", pathname);
                            $(afd).html("下载");
                            $(df).append(afd);
                        }
                        $(dg).append(df);
                        return dg;
                    case "percent":
                        $(dg).addClass("input-group");
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).css("text-align", "right");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "text");
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        $(sg).addClass("input-group-addon static");
                        $(sp).html("%");
                        $(sg).append(sp);
                        $(dg).append(ip, sg);
                        return dg;
                    case "rmb":
                        $(dg).addClass("input-group");
                        $(sg).addClass("input-group-addon static");
                        $(sp).attr("type", "button");
                        $(sp).html("￥");
                        $(sg).append(sp);
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        $(dg).append(sg, ip);
                        return dg;
                    case "hidden":
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "hidden");
                        $(ip).addClass("form-control control-normal-text");
                        return ip;
                    case "bool":
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "checkbox");
                        $(ip).addClass("switch-checkbox");
                        if (!options.control.modify || options.control.readonly) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (options.value) {
                            $(ip).attr("checked", "checked");
                        }
                        $(dg).append(ip);
                        return dg;
                    case "phoneEncrypt":
                        $(dg).addClass("input-group");
                        $(sg).addClass("input-group-addon static");
                        $(sp).addClass("fa fa-lock");
                        $(sg).append(sp);
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("disabled", "disabled");
                        if (options.value) {
                            $(ip).val(options.value.substr(0, 3) + "****" + options.value.substr(7));
                        }
                        $(dg).append(ip, sg);
                        return dg;
                    case "identityEncrypt":
                        $(dg).addClass("input-group");
                        $(sg).addClass("input-group-addon static");
                        $(sp).addClass("fa fa-lock");
                        $(sg).append(sp);
                        $(ip).addClass("form-control control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("disabled", "disabled");
                        if (options.value) {
                            $(ip).val(options.value.substr(0, options.value.length - 4) + "****");
                        }
                        $(dg).append(ip, sg);
                        return dg;
                }
            },
            _save: function (btn) {
                var that = this;
                $("#" + that.options.form).bootstrapValidator('validate');
                if ($("#" + that.options.form).data("bootstrapValidator").isValid()) {
                    if (btn) {
                        btn.addClass("no-events").button('loading');
                    }
                    var dataImg = $("#" + that.options.form).find(".lightboxLink");
                    var datafile = $("#" + that.options.form).find(".file-data");
                    dataImg.each(function () {
                        if ($(this).data("change")) {
                            var imgPath;
                            var ctrl = $(this);
                            var paraData = new FormData();
                            if (ctrl.hasClass("with-crop")) {
                                Iptools.uidataTool._uploadCanvasData({
                                    canvas: that.options.cropImageCanvas[ctrl.data("column")].canvas,
                                    type: "picture"
                                }).done(function (path) {
                                    imgPath = Iptools.DEFAULTS.serviceUrl + path;
                                    that.options.DataCurrentSets[ctrl.data("column")] = imgPath;
                                });
                            } else {
                                paraData.append("file", $(this).parent().find("input")[0].files[0]);
                                Iptools.uidataTool._uploadfileData({
                                    data: paraData,
                                    type: "picture"
                                }).done(function (path) {
                                    imgPath = Iptools.DEFAULTS.serviceUrl + path;
                                    that.options.DataCurrentSets[ctrl.data("column")] = imgPath;
                                });
                            }
                        }
                    });
                    datafile.each(function () {
                        if ($(this).data("has") && $(this).find("input")[0].files.length) {
                            var ctl = $(this);
                            var filepath;
                            var filename = ctl.find("input")[0].files[0].name;
                            var paraData = new FormData();
                            paraData.append("file", ctl.find("input")[0].files[0]);
                            Iptools.uidataTool._uploadfileData({
                                data: paraData,
                                type: "file"
                            }, function (path) {
                                filepath = Iptools.DEFAULTS.serviceUrl + path;
                                that.options.DataCurrentSets[ctl.data("column")] = filename + "|" + filepath;
                            });
                        }
                    });
                    if (that.options.beforeSave && typeof (that.options.beforeSave) == "function") {
                        that.options.beforeSave(that.options.DataCurrentSets).done(function (bsr) {
                            that.options.DataCurrentSets = bsr;
                            that._submit(btn).done(function (r) {
                                if (that.options.afterSave && typeof (that.options.afterSave) == "function") {
                                    that.options.afterSave(r).done(function () {
                                        if (that.options.mode == "new") {
                                            Iptools.Tool.pAlert({
                                                title: "系统提示",
                                                content: "创建完成"
                                            });
                                            if (that.options.autoClose) {
                                                Iptools.uidataTool._getView({
                                                    view: Iptools.Tool.currentView,
                                                }).done(function (data) {
                                                    if (data) {
                                                        Iptools.Tool._CloseTab({
                                                            view: Iptools.Tool.currentView,
                                                            type: data.view.type,
                                                            valueId: Iptools.Tool.currentViewValue,
                                                        });
                                                    }
                                                });
                                            }
                                        } else if (that.options.mode == "edit") {
                                            Iptools.Tool.pAlert({
                                                title: "系统提示",
                                                content: "更新完成"
                                            });
                                            if (that.options.autoRefresh) {
                                                window.location.reload();
                                            }
                                        }
                                        if (btn) {
                                            btn.removeClass("no-events").button('reset');
                                        }
                                        if (that.options.type == "modal") {
                                            $("#" + that.options.modal.id).modal("hide");
                                        }
                                    }).fail(function () {
                                        if (btn) {
                                            btn.removeClass("no-events").button('reset');
                                        }
                                        if (that.options.type == "modal") {
                                            $("#" + that.options.modal.id).modal("hide");
                                        }
                                    });
                                } else {
                                    if (that.options.mode == "new") {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "创建完成"
                                        });
                                        if (that.options.autoClose) {
                                            Iptools.uidataTool._getView({
                                                view: Iptools.Tool.currentView,
                                            }).done(function (data) {
                                                if (data) {
                                                    Iptools.Tool._CloseTab({
                                                        view: Iptools.Tool.currentView,
                                                        type: data.view.type,
                                                        valueId: Iptools.Tool.currentViewValue,
                                                    });
                                                }
                                            });
                                        }
                                    } else if (that.options.mode == "edit") {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "更新完成"
                                        });
                                        if (that.options.autoRefresh) {
                                            window.location.reload();
                                        }
                                    }
                                    if (btn) {
                                        btn.removeClass("no-events").button('reset');
                                    }
                                    if (that.options.type == "modal") {
                                        $("#" + that.options.modal.id).modal("hide");
                                    }
                                }
                            });
                        }).fail(function () {
                            if (btn) {
                                btn.removeClass("no-events").button('reset');
                            }
                            if (that.options.type == "modal") {
                                $("#" + that.options.modal.id).modal("hide");
                            }
                        });
                    } else {
                        that._submit(btn).done(function (r) {
                            if (that.options.afterSave && typeof (that.options.afterSave) == "function") {
                                that.options.afterSave(r).done(function () {
                                    if (that.options.mode == "new") {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "创建完成"
                                        });
                                        if (that.options.autoClose) {
                                            Iptools.uidataTool._getView({
                                                view: Iptools.Tool.currentView,
                                            }).done(function (data) {
                                                if (data) {
                                                    Iptools.Tool._CloseTab({
                                                        view: Iptools.Tool.currentView,
                                                        type: data.view.type,
                                                        valueId: Iptools.Tool.currentViewValue,
                                                    });
                                                }
                                            });
                                        }
                                    } else if (that.options.mode == "edit") {
                                        Iptools.Tool.pAlert({
                                            title: "系统提示",
                                            content: "更新完成"
                                        });
                                        if (that.options.autoRefresh) {
                                            window.location.reload();
                                        }
                                    }
                                    if (btn) {
                                        btn.removeClass("no-events").button('reset');
                                    }
                                    if (that.options.type == "modal") {
                                        $("#" + that.options.modal.id).modal("hide");
                                    }
                                }).done(function () {
                                    if (btn) {
                                        btn.removeClass("no-events").button('reset');
                                    }
                                    if (that.options.type == "modal") {
                                        $("#" + that.options.modal.id).modal("hide");
                                    }
                                });
                            } else {
                                if (that.options.mode == "new") {
                                    Iptools.Tool.pAlert({
                                        title: "系统提示",
                                        content: "创建完成"
                                    });
                                    if (that.options.autoClose) {
                                        Iptools.uidataTool._getView({
                                            view: Iptools.Tool.currentView,
                                        }).done(function (data) {
                                            if (data) {
                                                Iptools.Tool._CloseTab({
                                                    view: Iptools.Tool.currentView,
                                                    type: data.view.type,
                                                    valueId: Iptools.Tool.currentViewValue,
                                                });
                                            }
                                        });
                                    }
                                } else if (that.options.mode == "edit") {
                                    Iptools.Tool.pAlert({
                                        title: "系统提示",
                                        content: "更新完成"
                                    });
                                    if (that.options.autoRefresh) {
                                        window.location.reload();
                                    }
                                }
                                if (btn) {
                                    btn.removeClass("no-events").button('reset');
                                }
                                if (that.options.type == "modal") {
                                    $("#" + that.options.modal.id).modal("hide");
                                }
                            }
                        });
                    }
                }
            },
            _submit: function () {
                var promise = $.Deferred();
                var that = this;
                if (that.options.mode == "new") {
                    Iptools.uidataTool._addAppletData({
                        appletId: that.options.applet,
                        data: JSON.stringify(that.options.DataCurrentSets)
                    }).done(function (r) {
                        promise.resolve(r);
                    }).fail(function () {
                        promise.reject();
                    });
                } else if (that.options.mode == "edit") {
                    if ($.isEmptyObject(that.options.DataCurrentSets)) {
                        promise.resolve();
                    } else {
                        Iptools.uidataTool._saveAppletData({
                            appletId: that.options.applet,
                            valueId: that.options.valueId,
                            data: JSON.stringify(that.options.DataCurrentSets)
                        }).done(function (r) {
                            promise.resolve(r);
                        }).fail(function () {
                            promise.reject();
                        });
                    }
                }
                return promise;
            },
            _bindEvents: function () {
                var that = this;
                that.$container.unbind();
                that.$container
                    .on("click", ".u-control .t-addon", function () {
                        var me = $(this);
                        me.siblings("input").focus();
                    });
                that.$container
                    .on("click", ".u-control .modalSearch", function () {
                        var me = $(this);
                        var applet = me.data("applet");
                        if (Iptools.Tool._checkNull(applet)) {
                            me.addClass("current-unit-search-picker");
                            if (that.options.type == "modal") {
                                that.$container.hide();
                                $("#" + that.options.modal.header).append("<span class='ut-header-more'>&nbsp;>&nbsp;选择"
                                    + me.closest(".u-control").find("label").text() + "</span>");
                                component._table("#" + that.options.searchModalList, {
                                    pageNow: 1,
                                    pageSize: 10,
                                    applet: applet,
                                    checkType: "radio"
                                });
                                $("#" + that.options.modal.footer).find("button.orl").hide();
                                $("#" + that.options.modal.footer).append("<button class='btn commonBtn confirm-search-list ntl'>选择</button>" +
                                    "<button class='btn cancel cancel-search-list ntl'>返回</button>");
                            } else {
                                component._table("#" + that.options.searchModal + " #" + that.options.searchModalList, {
                                    pageNow: 1,
                                    pageSize: 10,
                                    applet: applet,
                                    checkType: "radio"
                                });
                                $("#" + that.options.searchModal).modal("show");
                            }
                        }
                    });
                that.$container
                    .on("focus", ".u-control .control-pick-for", function () {
                        var me = $(this);
                        if (!me.parent().hasClass("open")) {
                            me.parent().find(".u-co-pick-for").dropdown("toggle");
                        }
                    });
                that.$container
                    .on("input", ".u-control .control-pick-for", function () {
                        var me = $(this);
                        if (Iptools.Tool._checkNull(me.val())) {
                            var valide = true;
                            if (Iptools.Tool._checkNull(me.data("reg"))) {
                                var uReg = new RegExp(me.data("reg"));
                                if (!uReg.test(me.val())) {
                                    valide = false;
                                    me.parent().find(".u-ul-pick-for li.ut-option").remove();
                                    me.parent().find(".u-ul-pick-for li.ut-hint").html("<a>" + Iptools.Tool._GetProperValue(me.data("regMsg")) + "</a>").show();
                                }
                            }
                            if (valide && Iptools.Tool._checkNull(me.data("applet")) && Iptools.Tool._checkNull(me.data("relatedColumn")) && me.data("status") != "loading") {
                                me.parent().find(".u-ul-pick-for li.ut-option").remove();
                                me.parent().find(".u-ul-pick-for li.ut-hint").html("<a>查询中<span class='fa fa-spin fa-spinner'></span></a>").show();
                                me.data("status", "loading");
                                Iptools.uidataTool._getUserlistAppletData({
                                    appletId: me.data("applet"),
                                    pageSize: 50,
                                    pageNow: 1,
                                    condition: "{'" + me.data("relatedColumn") + "':' like \"%" + me.val() + "%\"'}"
                                }).done(function (r) {
                                    if (r && r.data && r.data.records && r.data.records.length) {
                                        for (var i = 0; i < r.data.records.length; i++) {
                                            var od = r.data.records[i];
                                            if (od && od[me.data("relatedColumn")]) {
                                                var val = od[me.data("relatedColumn")];
                                                if (typeof od[me.data("relatedColumn")] == "object") {
                                                    val = od[me.data("relatedColumn")]["name"];
                                                }
                                                me.parent().find(".u-ul-pick-for").append($("<li class='ut-option'><a>"
                                                    + Iptools.Tool._GetProperValue(val) + "</a></li>").data("record", od));
                                            }
                                        }
                                        me.parent().find(".u-ul-pick-for li.ut-hint").hide();
                                    } else {
                                        me.parent().find(".u-ul-pick-for li.ut-hint").html("<a>未查询到数据...</a>").show();
                                        me.parent().find(".u-ul-pick-for li.ut-option").remove();
                                    }
                                    me.data("status", "wait");
                                });
                            }
                        } else {
                            me.parent().find(".u-ul-pick-for li.ut-hint").html("<a>请输入关键字...</a>").show();
                            me.parent().find(".u-ul-pick-for li.ut-option").remove();
                        }
                    });
                that.$container
                    .on("click", ".u-control .u-ul-pick-for li.ut-option a", function () {
                        var me = $(this);
                        var cfs = me.closest(".u-control").find(".control-pick-for").data("cascadeFields");
                        cfs = eval("(" + cfs + ")");
                        if (cfs && cfs.fromFields && cfs.toFields) {
                            var record = me.parent().data("record");
                            if (record) {
                                me.closest(".u-control").find(".control-pick-for").trigger("control-pick-for", record);
                                for (var i = 0; i < cfs.fromFields.length; i++) {
                                    var fd = record[cfs.fromFields[i]];
                                    var key = "", val = fd;
                                    var cot = that.$container.find("input[name='" + cfs.toFields[i] + "']");
                                    if (Iptools.Tool._checkNull(fd)) {
                                        if (typeof fd == "object") {
                                            key = fd["id"];
                                            val = fd["name"];
                                        }
                                    } else {
                                        key = "", val = "";
                                    }
                                    if (cot.hasClass("control-normal-text")) {
                                        if (cot.data("pick") == "1") {
                                            cot.val(val).data("key", key);
                                        } else {
                                            cot.val(val);
                                        }
                                        cot.trigger("blur").trigger("input");
                                    } else if (cot.hasClass("control-normal-select")) {
                                        cot.val(val);
                                        cot.trigger("change");
                                    }
                                }
                            }
                        }
                    });
                that.$container
                    .on("click", ".u-control .clearSearchPick", function () {
                        var me = $(this);
                        me.parent().find("input").val("").data("key", "").trigger("blur");
                    });
                that.$container
                    .on("blur", ".u-control .control-normal-text", function () {
                        var value;
                        if ($(this).data("pick") == "1") {
                            value = $(this).data("key");
                        } else {
                            value = $(this).val();
                        }
                        var col = $(this).data("column");
                        if (that.options.mode == "new") {
                            if ((typeof (value) == "string" && Iptools.Tool._checkNull(value.trim())) || typeof (value) == "number") {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        } else if (that.options.mode == "edit") {
                            if (that.options.DataOriginalSets[col] != value) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        }
                    });
                that.$container
                    .on("change", ".u-control .control-normal-select", function () {
                        var value = $(this).val();
                        var col = $(this).data("column");
                        if (that.options.mode == "new") {
                            if (Iptools.Tool._checkNull(value)) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        } else if (that.options.mode == "edit") {
                            if (that.options.DataOriginalSets[col] != value) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        }
                    });
                that.$container
                    .on("change", ".u-control .cr-group input", function () {
                        var group = $(this).parents(".cr-group:first");
                        var col = group.data("column");
                        var value = "";
                        var data = "";
                        if (that.options.mode == "new") {
                            if (group.find("input[type=checkbox]").length) {
                                $.each(group.find("input[type=checkbox]:checked"), function (lkey, lobj) {
                                    data += lobj.value + "|";
                                });
                                value = data;
                            } else if (group.find("input[type=radio]").length) {
                                value = group.find("input[type=radio]:checked").val();
                            }
                            if (Iptools.Tool._checkNull(value)) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        } else if (that.options.mode == "edit") {
                            value = that.options.DataOriginalSets[col];
                            if (group.find("input[type=checkbox]").length) {
                                $.each(group.find("input[type=checkbox]:checked"), function (lkey, lobj) {
                                    data += lobj.value + "|";
                                });
                                value = data;
                            } else if (group.find("input[type=radio]").length) {
                                value = group.find("input[type=radio]:checked").val();
                            }
                            if (that.options.DataOriginalSets[col] != value) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        }
                    });
                that.$container
                    .on("blur", ".u-control .detailTextarea", function () {
                        var value = $(this).val();
                        var col = $(this).data("column");
                        if (that.options.mode == "new") {
                            if (Iptools.Tool._checkNull(value)) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        } else if (that.options.mode == "edit") {
                            if (that.options.DataOriginalSets[col] != value) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        }
                    });
                that.$container
                    .on("switchChange.bootstrapSwitch", ".u-control .switch-checkbox", function (event, state) {
                        var value = state ? "1" : "0";
                        var col = $(this).data("column");
                        if (that.options.mode == "new") {
                            that.options.DataCurrentSets[col] = value;
                        } else if (that.options.mode == "edit") {
                            if (that.options.DataOriginalSets[col] != value) {
                                that.options.DataCurrentSets[col] = value;
                            } else {
                                delete that.options.DataCurrentSets[col];
                            }
                        }
                    });
                that.$container
                    .on("click", ".button-nav button.save", function (ev) {
                        ev = ev || event;
                        ev.stopPropagation();
                        that._save($(this));
                    });
                that.$container
                    .on("click", ".u-section .clp", function () {
                        var me = $(this);
                        var clp = me.parent().find(".panel-collapse");
                        clp.collapse("toggle");
                    });
                that.$container
                    .on("show.bs.collapse", ".u-section .panel-collapse", function () {
                        var me = $(this);
                        var ch = me.parent().removeClass("pn-close").find(".clp");
                        ch.find("span.helper").removeClass("fa-angle-down").addClass("fa-angle-up");
                    });
                that.$container
                    .on("hide.bs.collapse", ".u-section .panel-collapse", function () {
                        var me = $(this);
                        var ch = me.parent().addClass("pn-close").find(".clp");
                        ch.find("span.helper").removeClass("fa-angle-up").addClass("fa-angle-down");
                    });
                that.$container
                    .on("change", ".u-control .img-file input[type=file]", function () {
                        var me = $(this);
                        if (me[0].files.length) {
                            var f = me[0].files[0];
                            if (f.type.indexOf("jpeg") < 0 && f.type.indexOf("png") < 0 && f.type.indexOf("gif") < 0) {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "类型错误"
                                });
                            } else if (f.size / 1024 > 2048) {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "上传图片大小不可大于2M"
                                });
                            } else {
                                component._crop({
                                    file: f,
                                    aspectRatio: 1 / 1,
                                    getCanvas: function (canvas) {
                                        var parent = me.parent().parent().find(".lightboxLink");
                                        me.parent().parent().find("img").hide();
                                        me.parent().parent().find("canvas").remove();
                                        me.parent().parent().find("img").after(canvas);
                                        parent.data("has", false);
                                        parent.data("change", true);
                                        that.options.cropImageCanvas[parent.data("column")] = {
                                            canvas: canvas
                                        };
                                        that.options.form.data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
                                    }
                                });
                            }
                            me.val("");
                        } else {
                            me.parent().parent().find("img").attr("src", component._UIDEFAULFS.defaultPicturePath);
                            me.parent().parent().find(".lightboxLink").data("has", false);
                        }
                    });
                $("#" + that.options.modal.footer)
                    .on("click", "button.save-confirm", function () {
                        if (that.options.modal.onSave && typeof that.options.modal.onSave == "function") {
                            that.options.modal.onSave();
                        } else {
                            that._save($(this));
                        }
                    });
                $("#" + that.options.modal.id)
                    .on("hidden.bs.modal", function () {
                        $("#" + that.options.modal.id).remove();
                    });
                $("#" + that.options.modal.footer)
                    .on("click", "button.confirm-search-list", function () {
                        var radio = $("#" + that.options.searchModalList).data("stable")._getRadio();
                        if (radio && radio.id) {
                            that.$container.find(".current-unit-search-picker").data("key", radio.id)
                                .parent().find("input").val(radio.name).data("key", radio.id).trigger("blur").trigger("input");
                            that.$container.find(".current-unit-search-picker").removeClass("current-unit-search-picker");
                            $("#" + that.options.searchModalList).empty();
                            that.$container.show();
                            $("#" + that.options.modal.footer).find("button.ntl").remove();
                            $("#" + that.options.modal.footer).find("button.orl").show();
                            $("#" + that.options.modal.header).find(".ut-header-more").remove();
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "未选择"
                            });
                        }
                    });
                $("#" + that.options.modal.footer)
                    .on("click", "button.cancel-search-list", function () {
                        $("#" + that.options.searchModalList).empty();
                        that.$container.show();
                        $("#" + that.options.modal.footer).find("button.ntl").remove();
                        $("#" + that.options.modal.footer).find("button.orl").show();
                        $("#" + that.options.modal.header).find(".ut-header-more").remove();
                    });
                $("#" + that.options.searchModal)
                    .on("click", ".s-header-bar .s-manage .ul-search", function () {
                        var me = $(this);
                        me.parent().toggleClass("open");
                    });
                $("#" + that.options.searchModal)
                    .on("click", function (ev) {
                        ev = ev || event;
                        ev.stopPropagation();
                    });
                $("#" + that.options.searchModal)
                    .on("click", ".search-confirm", function () {
                        var radio = $("#" + that.options.searchModalList).data("stable")._getRadio();
                        if (radio && radio.id) {
                            that.$container.find(".current-unit-search-picker").data("key", radio.id)
                                .parent().find("input").val(radio.name).data("key", radio.id).trigger("blur");
                            that.$container.find(".current-unit-search-picker").removeClass("current-unit-search-picker");
                            $("#" + that.options.searchModal).modal("hide");
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "未选择"
                            });
                        }
                    });
                if (that.options.events && that.options.events.length) {
                    for (var e = 0; e < that.options.events.length; e++) {
                        var evt = that.options.events[e];
                        if (evt && evt.target && evt.type && evt.event && typeof evt.event == "function") {
                            $(that.$container).on(evt.type, evt.target, evt.event);
                        }
                    }
                }
                if (that.options.modal.events && that.options.modal.events.length) {
                    for (var mi = 0; mi < that.options.modal.events.length; mi++) {
                        var mev = that.options.modal.events[mi];
                        if (mev && mev.target && mev.type && mev.event && typeof mev.event == "function") {
                            $("#" + that.options.modal.footer).on(mev.type, mev.target, mev.event);
                        }
                    }
                }
            }
        };
        var unit = new standardUnit(cta, ops);
        $(unit.$container).data("unit", unit);
        return $(unit.$container);
    },
    _panel: function (cta, ops) {
        var standardPanel = function (container, options) {
            this.$container = $(container);
            this.$container.loading();
            this.options = $.extend({}, standardPanel.DEFAULT_OPTIONS, options);
            var that = this;
            this._init().done(function () {
                that._buildData();
                that._apply();
                that._bindEvents();
            });
        };
        standardPanel.DEFAULT_OPTIONS = {
            applet: null,
            valueId: null,
            data: null,
            panels: [],
            buttons: [],
            controls: [],
            ntrols: [],
            allControls: {},
            searchModal: null,
            DataOriginalSets: {},
            tableTitle: null,
            section: 1,
            controlValidations: {},
            controlCalLinks: [],
            showButton: true,
            searchModalTitle: "搜索列表",
            beforeSave: null,
            afterSave: null,
            cusControls: {},
            events: [],
            dataModify: null,
            afterLoad: null,
            allowEdit: true,
            loadComplete: null
        };
        standardPanel.prototype = {
            constructor: standardPanel,
            _init: function () {
                var promise = $.Deferred();
                var that = this;
                if (that.options.applet && that.options.valueId) {
                    var options = {
                        appletId: that.options.applet,
                        valueId: that.options.valueId
                    }
                    that.options.searchModal = "pn-search-modal-" + new Date().getTime();
                    that.options.searchModalList = "pn-search-modal-list-" + new Date().getTime();
                    Iptools.uidataTool._getUserDetailAppletData(options).done(function (r) {
                        if (r) {
                            if (that.options.dataModify && typeof that.options.dataModify == "function") {
                                that.options.dataModify(r).done(function (rm) {
                                    that.options.controls = rm.controls;
                                    that.options.data = rm.data;
                                    that.options.appletData = rm.applet;
                                    that.options.rootLink = rm.rootLink;
                                    Iptools.uidataTool._getAppletButtons({
                                        applet: that.options.applet
                                    }).done(function (rs) {
                                        that.options.buttons = rs.buttons;
                                        promise.resolve();
                                    }).fail(function () {
                                        promise.resolve();
                                    });
                                });
                            } else {
                                that.options.controls = r.controls;
                                that.options.data = r.data;
                                that.options.appletData = r.applet;
                                that.options.rootLink = r.rootLink;
                                Iptools.uidataTool._getAppletButtons({
                                    applet: that.options.applet
                                }).done(function (rs) {
                                    that.options.buttons = rs.buttons;
                                    promise.resolve();
                                }).fail(function () {
                                    promise.resolve();
                                });
                            }
                        }
                    });
                }
                return promise;
            },
            _buildData: function () {
                var that = this;
                if (that.options.controls) {
                    //controls
                    for (var i = 0; i < that.options.controls.length; i++) {
                        var col = that.options.controls[i];
                        that.options.allControls[col.column] = col;
                        var d = document.createElement("div");
                        $(d).addClass("pn-control").data({
                            "index": i,
                            "column": col.column,
                            "type": col.type
                        });
                        if (col.type == "title") {
                            $(d).addClass("title");
                        }
                        var validata = that._setValidate({
                            control: col,
                        });
                        if (!$.isEmptyObject(validata.validation)) {
                            that.options.controlValidations[col.column] = validata.validation;
                        }
                        var lab = document.createElement("div");
                        $(lab).addClass("pn-label col-xs-6").html(col.name);
                        $(d).append(lab);
                        var tkey = 0;
                        var tValue;
                        if (!Iptools.Tool._checkNull(that.options.data) || !Iptools.Tool._checkNull(that.options.data[col.column])) {
                            tValue = "";
                        } else {
                            tValue = that.options.data[col.column];
                        }
                        if (typeof (tValue) == "object") {
                            for (var ikey in tValue) {
                                if (ikey != "id") {
                                    tValue = tValue[ikey];
                                } else {
                                    tkey = tValue[ikey];
                                }
                            }
                            if (typeof (tValue) == "object") {
                                tValue = tValue["id"];
                            }
                        }
                        var vcon = document.createElement("div");
                        $(d).append($(vcon).addClass("pn-content col-xs-6").append($("<form></form>").append(that._setControlValued({
                            control: col,
                            value: tValue,
                            key: tkey,
                        })).addClass("pn-control-form").data({
                            "column": col.column,
                            "valid": "0"
                        })), "<div class='clear'></div>");
                        that._setOriginalData({
                            control: col,
                            value: tValue,
                            key: tkey,
                        });
                        if (col.type == "hidden") {
                            $(d).addClass("pn-hidden").hide();
                        }
                        that.options.ntrols.push({
                            control: col,
                            dom: d
                        });
                    }
                }
            },
            _apply: function () {
                var that = this;
                that.$container.empty();
                //controls
                var d = document.createElement("div");
                $(d).addClass("col-sm-12 pn-main");
                var sec = $("<div class='pn-section'><div class='panel-body' id='pn-container-"
                    + that.options.section++ + "'></div><div class='clear'></div></div>");
                for (var i = 0; i < that.options.ntrols.length; i++) {
                    if (that.options.cusControls[i.toString()]) {
                        var ccls = that.options.cusControls[i.toString()];
                        if (ccls && ccls.controls && ccls.controls.length) {
                            for (var c = 0; c < ccls.controls.length; c++) {
                                var con = ccls.controls[c];
                                var cd = document.createElement("div");
                                $(cd).addClass("pn-control").append($(con.dom).show());
                                $(sec).find("#pn-container-" + (that.options.section - 1)).append(cd);
                            }
                        }
                    }
                    var col = that.options.ntrols[i];
                    if (col && col.control) {
                        if (col.control.isSeparate) {
                            if ($(sec).find(".pn-control").length > 0) {
                                $(d).append(sec);
                            }
                            sec = that._setSeprateTitle(col.control.separateTitle);
                        }
                        $(sec).find("#pn-container-" + (that.options.section - 1)).append(col.dom);
                    }
                }
                if (that.options.cusControls["-1"]) {
                    var cmls = that.options.cusControls["-1"];
                    if (cmls && cmls.controls && cmls.controls.length) {
                        for (var cm = 0; cm < cmls.controls.length; cm++) {
                            var cmn = cmls.controls[cm];
                            var md = document.createElement("div");
                            $(md).addClass("").append($(cmn.dom).show());
                            $(sec).find("#pn-container-" + (that.options.section - 1)).append(md);
                        }
                    }
                }
                $(d).append(sec);
                $(d).find(".pn-section").each(function (key, obj) {
                    $(obj).find(".pn-control:not(.pn-hidden):last").css("border-bottom", "none");
                });
                //bind datePicker
                try {
                    $(d).find(".dateStampPicker").datetimepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        todayBtn: true,
                        language: "zh-CN",
                        minView: "month",
                        pickerPosition: 'bottom-right',
                    }).on('hide', function () {
                        var me = $(this);
                        try {
                            me.closest(".pn-control-form").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
                            me.trigger("pn-blur");
                        } catch (ev) {
                            console.log("ERROR: Required BootStrap Validator Plugin");
                        }
                    });
                    $(d).find(".timeStampPicker").datetimepicker({
                        format: "yyyy-mm-dd hh:00",
                        autoclose: true,
                        todayBtn: true,
                        language: "zh-CN",
                        minView: 1,
                        pickerPosition: 'bottom-right',
                    }).on('hide', function () {
                        var me = $(this);
                        try {
                            me.closest(".pn-control-form").data("bootstrapValidator").updateStatus(me.attr("name"), "NOT_VALIDATED").validateField(me.attr("name"));
                            me.trigger("pn-blur");
                        } catch (ev) {
                            console.log("ERROR: Required BootStrap Validator Plugin");
                        }
                    });
                } catch (e) {
                    console.log("ERROR: required datetimepicker");
                }
                //bind switch-box
                try {
                    $(d).find(".switch-checkbox").bootstrapSwitch({
                        onText: "是",
                        offText: "否",
                        size: "mini",
                        handleWidth: 30,
                        labelWidth: 20
                    });
                } catch (e) {
                    console.log("ERROR: Required Bootstrap Switch");
                }
                that.$container.append(d);
                that.$container.find(".pn-control .pn-control-form").each(function (key, obj) {
                    if (that.options.controlValidations[$(obj).data('column')]) {
                        var vdr = {};
                        vdr[$(obj).data('column')] = {
                            validators: that.options.controlValidations[$(obj).data('column')]
                        };
                        $(obj).bootstrapValidator({fields: vdr});
                        $(obj).data("valid", "1");
                    }
                });
                //searchModal
                var modal = document.createElement('div');
                $(modal).addClass("modal fade").attr({
                    "id": that.options.searchModal,
                    "tabindex": "-1",
                    "role": "dialog",
                    "data-backdrop": "static"
                });
                var mdialog = document.createElement('div');
                $(mdialog).addClass('modal-dialog').attr("role", "document").css("width", "800px");
                var mcontent = document.createElement('div');
                $(mcontent).addClass('modal-content').css({
                    "width": "auto",
                    "min-height": "200px"
                }).append(
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' " +
                    "aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' " +
                    ">" + that.options.searchModalTitle + "</h4></div>",
                    "<div class='modal-body' style='padding:0'><div id='" + that.options.searchModalList + "'></div></div>",
                    "<div class='modal-footer'><button type='button' class='btn commonBtn search-confirm'>确定</button>" +
                    "<button type='button' class='btn cancel revert' data-dismiss='modal' style='margin-left:5px;'>取消</button></div>");
                that.$container.after($(modal).append($(mdialog).append(mcontent)));
                if (that.options.afterLoad && typeof that.options.afterLoad == "function") {
                    that.options.afterLoad();
                }
            },
            _setOriginalData: function (options) {
                var that = this;
                switch (options.control.type) {
                    case "pickApplet":
                    case "pickDetailApplet":
                    case "select":
                    case "radio":
                        that.options.DataOriginalSets[options.control.column] = options.key;
                        break;
                    default:
                        that.options.DataOriginalSets[options.control.column] = options.value;
                        break;
                }
            },
            _setButtonsPanel: function () {
                var that = this;
                var btp = document.createElement("div");
                if (that.options.buttons.length) {
                    for (var i = 0; i < that.options.buttons.length; i++) {
                        var btn = that.options.buttons[i];
                        $(btp).append($("<span class='pn-button " + btn.type + " " + (btn.extraStyle ? btn.extraStyle : "fa fa-plus") + "'></span>")
                            .attr("title", btn.name)
                            .data({
                                view: btn.createView,
                                applet: btn.createApplet
                            }));
                    }
                }
                return btp;
            },
            _setSeprateTitle: function (title) {
                var that = this;
                var sdiv = document.createElement("div");
                $(sdiv).addClass("panel panel-default pn-section");
                $(sdiv).append("<div class='panel-heading clp' role='tab'>" + title + "<span class='fa fa-angle-up helper'></span>" +
                    "<div class='button-nav'></div>" + "</div>",
                    "<div class='panel-collapse collapse in' role='tabpanel'><div class='panel-body' id='pn-container-"
                    + that.options.section++ + "'></div><div class='clear'></div></div>");
                if (that.options.section == 3) {
                    var btp;
                    //buttons
                    if (that.options.showButton) {
                        btp = that._setButtonsPanel();
                        $(sdiv).find(".button-nav").append(btp);
                    }
                }
                return sdiv;
            },
            _setValidate: function (options) {
                var vdr = {};
                if (!options.control.empty && options.control.empty != undefined) {
                    vdr["notEmpty"] = {
                        message: "不可为空"
                    }
                }
                switch (options.control.type) {
                    case "int":
                        vdr["regexp"] = {
                            regexp: /^-?[1-9]\d*$/,
                            message: "请输入整数"
                        }
                        break;
                    case "float":
                        vdr["regexp"] = {
                            regexp: /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/,
                            message: "请输入浮点数"
                        }
                        break;
                    case "time":
                        vdr["regexp"] = {
                            regexp: /(\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}-\d{2}\d{2}:\d{2}:\d{2})|(\d{2}:\d{2})$/,
                            message: "请输入正确的时间格式（yyyy-MM-dd HH:mm）"
                        }
                        break;
                    case "date":
                        vdr["regexp"] = {
                            regexp: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                            message: "请输入正确的日期格式（yyyy-MM-dd）"
                        }
                        break;
                    case "percent":
                        vdr["regexp"] = {
                            regexp: /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/,
                            message: "请输入0-100内的数值，小数不超过两位"
                        }
                        break;
                    case "rmb":
                        vdr["regexp"] = {
                            regexp: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
                            message: "请输入非负的数值，小数不超过两位"
                        }
                        break;
                }
                if (Iptools.Tool._checkNull(options.control.reg)) {
                    vdr["regexp"] = {
                        regexp: eval(options.control.reg),
                        message: options.control.regInfo
                    }
                }
                return {validation: vdr};
            },
            //load every control field according to its own type
            //type series :text time pickApplet select date check radio picture textarea file percent rmb hidden
            //this sets gots its value for controls
            _setControlValued: function (options) {
                var that = this;
                var ip = document.createElement("input");
                var dg = document.createElement("div");
                var sg = document.createElement("span");
                var sp = document.createElement("span");
                var sl = document.createElement("select");
                if (options.control.isCalControl) {
                    try {
                        var foa = eval("(" + options.control.formula + ")");
                        if (foa && foa.cal) {
                            that.options.controlCalLinks.push({
                                key: options.control.column,
                                value: foa.cal
                            });
                        }
                    } catch (e) {
                        console.log("CAL Expressions Syntax Error");
                    }
                }
                switch (options.control.type) {
                    case "text":
                    default:
                        $(ip).data("column", options.control.column);
                        $(ip).addClass("pn-control-i control-normal-text");
                        $(ip).attr("type", "text");
                        $(ip).data("applet", options.control.pickApplet);
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "int":
                        $(ip).addClass("pn-control-i control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "text");
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "float":
                        $(ip).addClass("pn-control-i control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "text");
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "pwd":
                        $(ip).addClass("pn-control-i control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "password");
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "time":
                        $(ip).addClass("pn-control-i timeStampPicker control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "pickApplet":
                    case "pickDetailApplet":
                        if (options.control.destinationView) {
                            $(dg).append($("<a></a>").addClass("pn-v-link").data({
                                column: options.control.column,
                                view: options.control.destinationView,
                                key: options.key
                            }).append(options.value));
                        } else {
                            $(dg).append($("<span></span>").addClass("pn-v-text").data({
                                column: options.control.column,
                                view: options.control.destinationView
                            }).append(options.value));
                        }
                        if (options.control.modify && !options.control.readonly && that.options.allowEdit) {
                            $(dg).append($("<span></span>").addClass("pn-v-sel fa fa-search").data({
                                applet: options.control.pickApplet,
                                column: options.control.column
                            }));
                        }
                        return dg;
                    case "pickselect":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("pn-control-s control-normal-select");
                        $(sl).attr("name", options.control.column);
                        $(sl).append("<option value=''>请选择</option>");
                        $.each(that._setPickOptions(options), function (key, obj) {
                            var op = document.createElement("option");
                            $(op).attr("value", obj.key);
                            if (options.key == obj.key) {
                                $(sl).find("option").removeAttr("selected");
                                $(op).attr("selected", "selected");
                            }
                            $(op).html(obj.value);
                            $(sl).append(op);
                        });
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(sl).attr("disabled", "disabled");
                        }
                        return sl;
                    case "cascade":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("pn-control-s control-normal-select");
                        $(sl).attr("name", options.control.column);
                        $(sl).append("<option value=''>请选择</option>");
                        $(sl).attr("disabled", "disabled");
                        $(sl).data("applet", options.control.pickApplet);
                        if (Iptools.Tool._checkNull(options.key)) {
                            $(sl).append("<option value='" + options.key + "' selected='selected'>" + options.value + "</option>");
                        }
                        that._setCascadeListener(options);
                        return sl;
                    case "select":
                        $(sl).data("column", options.control.column);
                        $(sl).addClass("pn-control-s control-normal-select");
                        $(sl).attr("name", options.control.column);
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
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(sl).attr("disabled", "disabled");
                        }
                        return sl;
                    case "date":
                        $(ip).addClass("pn-control-i dateStampPicker control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "check":
                        $(sg).addClass("cr-group pn-control-ch");
                        $(sg).data("column", options.control.column);
                        $(sg).css("border", "0").css("box-shadow", "none").css("padding", "6px 0");
                        $.each(options.control.pickList, function (key, obj) {
                            var lab = document.createElement("label");
                            $(lab).addClass("checkbox-inline");
                            $(lab).css({"margin": "0 10px 0 0"});
                            var ipt = document.createElement("input");
                            $(ipt).addClass("input-cr");
                            $(ipt).attr("type", "checkbox");
                            $(ipt).val(obj.id);
                            if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
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
                        $(sg).addClass("cr-group pn-control-ra");
                        $(sg).data("column", options.control.column);
                        $(sg).css("border", "0").css("box-shadow", "none").css("padding", "6px 0");
                        $.each(options.control.pickList, function (key, obj) {
                            var lab = document.createElement("label");
                            $(lab).addClass("radio-inline");
                            $(lab).css("margin-left", "2px");
                            var ipt = document.createElement("input");
                            $(ipt).addClass("input-cr");
                            $(ipt).attr("type", "radio");
                            $(ipt).attr("name", options.control.column + "_radio");
                            $(ipt).val(obj.id);
                            if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
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
                    case "cropImage":
                        $(dg).css("text-align", "right").css("height", "100px");
                        var a = document.createElement("a");
                        $(a).addClass("lightboxLink");
                        $(a).data("has", false).attr("href", "#");
                        if (options.value) {
                            $(a).data("has", true);
                        }
                        if (options.control.type == "cropImage") {
                            $(a).addClass("with-crop");
                        }
                        $(a).data("column", options.control.column);
                        var img = document.createElement("img");
                        if (options.value) {
                            $(img).attr("src", options.value);
                        } else {
                            $(img).attr("src", component._UIDEFAULFS.defaultPicturePath);
                        }
                        $(img).attr("width", "90");
                        $(img).css("max-height", "90px");
                        $(img).attr("alt", "");
                        $(a).append(img);
                        var af = document.createElement("a");
                        $(af).addClass("img-file");
                        $(af).append("更改");
                        $(ip).attr("type", "file");
                        $(ip).attr("accept", ".jpg,.png,.gif");
                        $(ip).attr("name", options.control.column);
                        $(ip).data("column", options.control.column);
                        $(af).append(ip);
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(dg).append(a);
                        } else {
                            $(dg).append(a, af);
                        }
                        return dg;
                    case "textarea":
                        var txa = document.createElement("textarea");
                        $(txa).data("column", options.control.column);
                        $(txa).addClass("pn-control-t detailTextarea");
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(txa).attr("disabled", "disabled");
                        }
                        $(txa).text(options.value);
                        return txa;
                    case "richtext":
                        $(dg).addClass("pn-control-rt richtext-area");
                        $(dg).data("column", options.control.column);
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
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
                            iconUrl = component._UIDEFAULFS.defaultWordPath;
                        } else if (filename.indexOf("xls") > 0) {
                            iconUrl = component._UIDEFAULFS.defaultExcelPath;
                        } else if (filename.indexOf("ppt") > 0) {
                            iconUrl = component._UIDEFAULFS.defaultPPTPath;
                        } else {
                            iconUrl = component._UIDEFAULFS.defaultFilePath;
                        }
                        $(dg).css("text-align", "left");
                        var df = document.createElement("div");
                        $(df).addClass("file-data");
                        if (options.value) {
                            if (!options.control.modify || options.control.readonly) {
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
                        $(afu).addClass("file-upload");
                        if (options.value) {
                            $(sp).html("更改");
                        } else {
                            $(sp).html("上传");
                        }
                        $(ip).attr("type", "file");
                        $(ip).attr("accept", ".doc,.docx,.xls,.xlsx,.ppt,.pptx");
                        $(ip).attr("name", options.control.column);
                        $(afu).append(sp, ip);
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(df).append(im, p);
                        } else {
                            $(df).append(im, p, afu);
                        }
                        if (pathname) {
                            var afd = document.createElement("a");
                            $(afd).addClass("file-download");
                            $(afd).attr("href", pathname);
                            $(afd).html("下载");
                            $(df).append(afd);
                        }
                        $(dg).append(df);
                        return dg;
                    case "percent":
                        $(dg).addClass("input-group");
                        $(ip).addClass("pn-control-i control-normal-text");
                        $(ip).css("text-align", "right");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "text");
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "rmb":
                        $(ip).addClass("pn-control-i control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        $(ip).val(options.value);
                        return ip;
                    case "hidden":
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "hidden");
                        $(ip).addClass("pn-control-i control-hidden-text");
                        return ip;
                    case "bool":
                        $(ip).data("column", options.control.column);
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("type", "checkbox");
                        $(ip).addClass("switch-checkbox");
                        if (!options.control.modify || options.control.readonly || !that.options.allowEdit) {
                            $(ip).attr("disabled", "disabled");
                        }
                        if (options.value) {
                            $(ip).attr("checked", "checked");
                        }
                        $(dg).append(ip);
                        return dg;
                    case "phoneEncrypt":
                        $(ip).addClass("pn-control-i control-normal-text");
                        $(ip).data("column", options.control.column);
                        $(ip).attr("type", "text");
                        $(ip).attr("name", options.control.column);
                        $(ip).attr("disabled", "disabled");
                        if (options.value) {
                            $(ip).val(options.value.substr(0, 3) + "****" + options.value.substr(7));
                        }
                        return ip;
                    case "html":
                        $(sp).addClass("pn-control-html");
                        $(sp).data("column", options.control.column);
                        if (options.value) {
                            $(sp).html(options.value);
                        }
                        return sp;
                }
            },
            _submit: function (options) {
                var promise = $.Deferred();
                var that = this;
                if (that.options.beforeSave && typeof that.options.beforeSave == "function") {
                    that.options.beforeSave({
                        col: options.col,
                        key: options.key,
                        value: options.value
                    }).done(function (r) {
                        options = Iptools.Tool._extend(options, r);
                    }).done(function () {
                        var data = {};
                        if (options.key === 0) {
                            data[options.col] = options.value;
                        } else {
                            data[options.col] = options.key;
                        }
                        Iptools.uidataTool._saveAppletData({
                            appletId: that.options.applet,
                            valueId: that.options.valueId,
                            data: JSON.stringify(data)
                        }).done(function (r) {
                            if (options.key === 0) {
                                that.options.data[options.col] = options.value;
                            } else {
                                that.options.data[options.col] = {
                                    id: options.key,
                                    name: options.value
                                }
                            }
                            promise.resolve(r);
                            if (that.options.afterSave && typeof that.options.afterSave == "function") {
                                that.options.afterSave({
                                    col: options.col,
                                    key: options.key,
                                    value: options.value
                                });
                            }
                        }).fail(function () {
                            promise.reject();
                        });
                    });
                } else {
                    var odata = {};
                    if (options.key === 0) {
                        odata[options.col] = options.value;
                    } else {
                        odata[options.col] = options.key;
                    }
                    Iptools.uidataTool._saveAppletData({
                        appletId: that.options.applet,
                        valueId: that.options.valueId,
                        data: JSON.stringify(odata)
                    }).done(function (r) {
                        if (options.key === 0) {
                            that.options.data[options.col] = options.value;
                        } else {
                            that.options.data[options.col] = {
                                id: options.key,
                                name: options.value
                            }
                        }
                        promise.resolve(r);
                        if (that.options.afterSave && typeof that.options.afterSave == "function") {
                            that.options.afterSave({
                                col: options.col,
                                key: options.key,
                                value: options.value
                            });
                        }
                    }).fail(function () {
                        promise.reject();
                    });
                }
                return promise;
            },
            _bindEvents: function () {
                var that = this;
                that.$container.unbind();
                that.$container
                    .on("blur", ".pn-control .control-normal-text:not(.timeStampPicker):not(.dateStampPicker)", function () {
                        $(this).trigger("pn-blur");
                    });
                that.$container
                    .on("pn-blur", ".pn-control .control-normal-text", function () {
                        var key = 0, me = $(this), value = me.val(), col = me.data("column");
                        me.closest(".pn-control-form").bootstrapValidator('validate');
                        if (me.closest(".pn-control-form").data("bootstrapValidator").isValid() || me.closest(".pn-control-form").data("valid") == "0") {
                            if (me.data("pick") == "1") {
                                key = me.data("key");
                            }
                            if ((key == 0 && value != that.options.data[col]) || (key != 0 && that.options.data[col] && that.options.data[col]["id"] != key)) {
                                me.attr("disabled", "disabled");
                                var label = me.closest(".pn-content").siblings(".pn-label").append("<span class='fa fa-spin fa-spinner pn-loading'></span>");
                                that._submit({
                                    key: key,
                                    value: value,
                                    col: col,
                                    obj: me
                                }).done(function () {
                                    label.find(".pn-loading").remove();
                                    me.removeAttr("disabled");
                                });
                            }
                        }
                    });
                that.$container
                    .on("change", ".pn-control .control-normal-select", function () {
                        var me = $(this), key = me.val(), value = me.find("option:selected").text(),
                            col = me.data("column");
                        me.closest(".pn-control-form").bootstrapValidator('validate');
                        if (me.closest(".pn-control-form").data("bootstrapValidator").isValid() || me.closest(".pn-control-form").data("valid") == "0") {
                            if (that.options.data[col] != key) {
                                me.attr("disabled", "disabled");
                                var label = me.closest(".pn-content").siblings(".pn-label").append("<span class='fa fa-spin fa-spinner pn-loading'></span>");
                                that._submit({
                                    key: key,
                                    value: value,
                                    col: col,
                                    obj: me
                                }).done(function () {
                                    label.find(".pn-loading").remove();
                                    me.removeAttr("disabled");
                                });
                            }
                        }
                    });
                that.$container
                    .on("blur", ".pn-control .detailTextarea", function () {
                        var me = $(this), value = me.val(), col = me.data("column");
                        me.closest(".pn-control-form").bootstrapValidator('validate');
                        if (me.closest(".pn-control-form").data("bootstrapValidator").isValid() || me.closest(".pn-control-form").data("valid") == "0") {
                            if (that.options.data[col] != value) {
                                me.attr("disabled", "disabled");
                                var label = me.closest(".pn-content").siblings(".pn-label").append("<span class='fa fa-spin fa-spinner pn-loading'></span>");
                                that._submit({
                                    key: 0,
                                    value: value,
                                    col: col,
                                    obj: me
                                }).done(function () {
                                    label.find(".pn-loading").remove();
                                    me.removeAttr("disabled");
                                });
                            }
                        }
                    });
                that.$container
                    .on("switchChange.bootstrapSwitch", ".pn-control .switch-checkbox", function (event, state) {
                        var me = $(this), value = state ? "1" : "0", col = me.data("column");
                        me.closest(".pn-control-form").bootstrapValidator('validate');
                        if (me.closest(".pn-control-form").data("bootstrapValidator").isValid() || me.closest(".pn-control-form").data("valid") == "0") {
                            if (that.options.data[col] != value) {
                                me.bootstrapSwitch('toggleDisabled');
                                var label = me.closest(".pn-content").siblings(".pn-label").append("<span class='fa fa-spin fa-spinner pn-loading'></span>");
                                that._submit({
                                    key: 0,
                                    value: value,
                                    col: col,
                                    obj: me
                                }).done(function () {
                                    label.find(".pn-loading").remove();
                                    me.bootstrapSwitch('toggleDisabled');
                                });
                            }
                        }
                    });
                that.$container
                    .on("click", ".pn-section .pn-control .pn-v-sel", function () {
                        var me = $(this);
                        if (Iptools.Tool._checkNull(me.data("applet"))) {
                            me.addClass("current-panel-search-picker");
                            component._table("#" + that.options.searchModal + " #" + that.options.searchModalList, {
                                pageNow: 1,
                                pageSize: 10,
                                applet: me.data("applet"),
                                checkType: "radio"
                            });
                            $("#" + that.options.searchModal).modal("show");
                        }
                    });
                that.$container
                    .on("click", ".pn-section .pn-control .pn-v-link", function () {
                        var me = $(this);
                        if (Iptools.Tool._checkNull(me.data("view")) && Iptools.Tool._checkNull(me.data("key"))) {
                            Iptools.uidataTool._getView({
                                view: me.data("view"),
                            }).done(function (data) {
                                Iptools.Tool._jumpView({
                                    view: me.data("view"),
                                    name: data.view.name,
                                    type: data.view.type,
                                    primary: data.view.primary,
                                    icon: data.view.icon,
                                    url: data.view.url,
                                    bread: true,
                                });
                            });
                        }
                    });
                that.$container
                    .on("click", ".pn-section .clp", function () {
                        var me = $(this);
                        var clp = me.parent().find(".panel-collapse");
                        clp.collapse("toggle");
                    });
                that.$container
                    .on("show.bs.collapse", ".pn-section .panel-collapse", function () {
                        var me = $(this);
                        var ch = me.parent().removeClass("pn-close").find(".clp");
                        ch.find("span.helper").removeClass("fa-angle-down").addClass("fa-angle-up");
                    });
                that.$container
                    .on("hide.bs.collapse", ".pn-section .panel-collapse", function () {
                        var me = $(this);
                        var ch = me.parent().addClass("pn-close").find(".clp");
                        ch.find("span.helper").removeClass("fa-angle-up").addClass("fa-angle-down");
                    });
                that.$container
                    .on("change", ".pn-control .img-file input[type=file]", function () {
                        var me = $(this);
                        if (me[0].files.length) {
                            var f = me[0].files[0];
                            if (f.type.indexOf("jpeg") < 0 && f.type.indexOf("png") < 0 && f.type.indexOf("gif") < 0) {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "类型错误"
                                });
                            } else if (f.size / 1024 > 2048) {
                                Iptools.Tool.pAlert({
                                    title: "系统提示",
                                    content: "上传图片大小不可大于2M"
                                });
                            } else {
                                component._crop({
                                    file: f,
                                    aspectRatio: 1 / 1,
                                    getCanvas: function (canvas) {
                                        me.parent().parent().find("canvas").remove();
                                        me.parent().parent().find("img").hide().after(canvas);
                                        Iptools.uidataTool._uploadCanvasData({
                                            canvas: canvas,
                                            type: "picture"
                                        }).done(function (path) {
                                            var imgPath = Iptools.DEFAULTS.serviceUrl + path;
                                            me.parent().addClass("no-events");
                                            var label = me.closest(".pn-content").siblings(".pn-label").append("<span class='fa fa-spin fa-spinner pn-loading'></span>");
                                            that._submit({
                                                key: 0,
                                                value: imgPath,
                                                col: me.data("column"),
                                                obj: me
                                            }).done(function () {
                                                label.find(".pn-loading").remove();
                                                me.parent().removeClass("no-events");
                                            });
                                        });
                                    }
                                });
                            }
                            me.val("");
                        } else {
                            me.parent().parent().find("img").attr("src", component._UIDEFAULFS.defaultPicturePath);
                            me.parent().parent().find(".lightboxLink").data("has", false);
                        }
                    });
                $("#" + that.options.searchModal)
                    .on("click", ".s-header-bar .s-manage .ul-search", function () {
                        var me = $(this);
                        me.parent().toggleClass("open");
                    });
                $("#" + that.options.searchModal)
                    .on("click", function (ev) {
                        ev = ev || event;
                        ev.stopPropagation();
                    });
                $("#" + that.options.searchModal)
                    .on("click", ".search-confirm", function () {
                        var radio = $("#" + that.options.searchModalList).data("stable")._getRadio();
                        if (radio && radio.id) {
                            var me = that.$container.find(".current-panel-search-picker");
                            var label = me.closest(".pn-content").siblings(".pn-label").append("<span class='fa fa-spin fa-spinner pn-loading'></span>");
                            me.addClass("no-events");
                            that._submit({
                                key: radio.id,
                                value: radio.name,
                                col: me.data("column"),
                                obj: me
                            }).done(function () {
                                label.find(".pn-loading").remove();
                                if (me.siblings(".pn-v-text").length) {
                                    me.siblings(".pn-v-text").html(radio.name);
                                } else if (me.siblings(".pn-v-link").length) {
                                    me.siblings(".pn-v-link").data("key", radio.id).html(radio.name);
                                }
                                me.removeClass("no-events");
                            });
                            that.$container.find(".current-unit-search-picker").removeClass("current-unit-search-picker");
                            $("#" + that.options.searchModal).modal("hide");
                        } else {
                            Iptools.Tool.pAlert({
                                title: "系统提示",
                                content: "未选择"
                            });
                        }
                    });
                if (that.options.events && that.options.events.length) {
                    for (var e = 0; e < that.options.events.length; e++) {
                        var evt = that.options.events[e];
                        if (evt && evt.target && evt.type && evt.event && typeof evt.event == "function") {
                            $(that.$container).on(evt.type, evt.target, evt.event);
                        }
                    }
                }
            }
        };
        var panel = new standardPanel(cta, ops);
        $(cta).data("panel", panel);
    },
    _list: function (cta, ops) {
        var standardList = function (container, options) {
            this.$container = $(container);
            this.$container.loading();
            this.options = $.extend({}, standardList.DEFAULT_OPTIONS, options);
            this.options.oCondition = this.options.condition;
            var that = this;
            this._init().done(function () {
                that._buildData();
                that._apply();
                that._bindEvents();
            });
        };
        standardList.DEFAULT_OPTIONS = {
            pageSize: 10,
            pageNow: 1,
            oCondition: {},
            condition: {},
            order: null,
            orderType: null,
            tableTitle: null,
            applet: null,
            view: null,
            valueId: null,
            appletData: null,
            columns: null,
            data: null,
            rootLink: null,
            statisticData: null,
            pag: null,
            buttons: [],
            records: [],
            investStatus: "wait",
            emptyImage: "../Content/Image/nodetail.png",
            emptySize: 150,
            emptyClick: null,
            events: [],
            dataModify: null,
            afterLoad: null
        };
        standardList.prototype = {
            constructor: standardList,
            _init: function () {
                var promise = $.Deferred();
                var that = this;
                if (that.options.applet) {
                    if (Iptools.DEFAULTS.currentView) {
                        var options = {
                            appletId: that.options.applet,
                            pageNow: that.options.pageNow,
                            pageSize: that.options.pageSize,
                        }
                        if (!$.isEmptyObject(that.options.condition)) {
                            options.condition = JSON.stringify(that.options.condition);
                        }
                        if (that.options.order) {
                            options.orderByColumn = that.options.order;
                        }
                        if (that.options.orderType) {
                            options.orderByAscDesc = that.options.orderType;
                        }
                        if (that.options.view) {
                            options.view = that.options.view;
                        }
                        if (that.options.valueId) {
                            options.valueId = that.options.valueId;
                        }
                        that.options.pag = "st-pag-" + new Date().getTime();
                        Iptools.uidataTool._getUserlistAppletData(options).done(function (r) {
                            if (r) {
                                if (that.options.dataModify && typeof that.options.dataModify == "function") {
                                    that.options.dataModify(r).done(function (rm) {
                                        that.options.columns = rm.columns;
                                        that.options.data = rm.data;
                                        that.options.appletData = rm.applet;
                                        that.options.rootLink = rm.rootLink;
                                        that.options.statisticData = rm.statisticData;
                                        Iptools.uidataTool._getAppletButtons({
                                            applet: that.options.applet
                                        }).done(function (rs) {
                                            that.options.buttons = rs.buttons;
                                            promise.resolve();
                                        }).fail(function () {
                                            promise.resolve();
                                        });
                                    });
                                } else {
                                    that.options.columns = r.columns;
                                    that.options.data = r.data;
                                    that.options.appletData = r.applet;
                                    that.options.rootLink = r.rootLink;
                                    that.options.statisticData = r.statisticData;
                                    Iptools.uidataTool._getAppletButtons({
                                        applet: that.options.applet
                                    }).done(function (rs) {
                                        that.options.buttons = rs.buttons;
                                        promise.resolve();
                                    }).fail(function () {
                                        promise.resolve();
                                    });
                                }
                            }
                        });
                    } else {
                        console.log("Invalid Request For Table Component");
                    }
                }
                return promise;
            },
            _buildData: function () {
                var that = this;
                if (that.options.columns && that.options.data && that.options.data.records) {
                    for (var n = 0; n < that.options.data.records.length; n++) {
                        var d = document.createElement('div');
                        $(d).addClass('ls-record');
                        var so = that.options.data.records[n];
                        var key = so[that.options.rootLink + ":id"];
                        for (var c = 0; c < that.options.columns.length; c++) {
                            var col = that.options.columns[c];
                            var sod = so[col.column];
                            if (sod && Iptools.Tool._checkNull(sod) && typeof sod == "object") {
                                if (Iptools.Tool._checkNull(sod["id"])) {
                                    key = sod["id"];
                                }
                                sod = sod["name"];
                            }
                            sod = Iptools.Tool._GetProperValue(sod);
                            if (sod == "") sod = '-';
                            switch (col.type) {
                                case "bool":
                                    sod = (sod == "1" ? "是" : "否");
                                    break;
                                case "rmb":
                                    sod = "&yen;" + sod;
                                    break;
                                case "percent":
                                    sod = sod + "%";
                                    break;
                            }
                            if (col.type != "hidden") {
                                if (col.type == "title") {

                                } else {

                                }
                                if (Iptools.Tool._checkNull(col.destinationView)) {
                                    $(d).append($("<div class='s-cell vlink " + that.options.borderStyle + "' data-index='" + n + "'>" +
                                        "<a class='d-v-link'>" + sod + "<a></div>").data("key", key).data("view", col.destinationView));
                                } else {
                                    $(d).append("<div class='s-cell " + that.options.borderStyle + "' data-index='" + n + "'>" + sod + "</div>");
                                }
                            }
                        }
                    }
                    //search column
                    if (col.allowOutterQuery) {
                        var csd = document.createElement("div");
                        $(csd).addClass("s-search-item").data("type", col.searchType).data("column", col.column).data("name", col.name);
                        var sgd = document.createElement("div");
                        $(sgd).addClass("form-group");
                        var searchFlag = false;
                        var v1 = "", v2 = "";
                        switch (col.searchType) {
                            case "text":
                                if (that.options.condition && that.options.condition[col.column]) {
                                    var tstr = that.options.condition[col.column];
                                    if (Iptools.Tool._checkNull(tstr) && tstr.indexOf("like") != -1) {
                                        v1 = tstr.split("%")[1].split("%")[0];
                                    }
                                }
                                $(sgd).append("<label>" + col.name + "</label>",
                                    $("<input type='text' class='form-control' value='" + v1 + "' />").data("column", col.column));
                                $(csd).append(sgd);
                                searchFlag = true;
                                break;
                            case "select":
                                if (that.options.condition && that.options.condition[col.column]) {
                                    var sstr = that.options.condition[col.column];
                                    if (Iptools.Tool._checkNull(sstr) && sstr.indexOf("=") != -1) {
                                        v1 = sstr.split("=")[1];
                                        if (v1.indexOf("'") != -1 || v1.indexOf('"') != -1) {
                                            v1 = Iptools.Tool._search_replacement(v1);
                                        }
                                    }
                                }
                                $(sgd).append("<label>" + col.name + "</label>");
                                var sel = document.createElement("select");
                                $(sel).addClass("form-control").append("<option value=''>请选择...</option>").data("column", col.column);
                                if (col.pickList && col.pickList.length) {
                                    for (var s = 0; s < col.pickList.length; s++) {
                                        var pi = col.pickList[s];
                                        if (pi.id == v1) {
                                            $(sel).append("<option value='" + pi.id + "' selected='true'>" + pi.name + "</option>");
                                        } else {
                                            $(sel).append("<option value='" + pi.id + "'>" + pi.name + "</option>");
                                        }
                                    }
                                }
                                $(csd).append($(sgd).append(sel));
                                searchFlag = true;
                                break;
                            case "bool":
                                if (that.options.condition && that.options.condition[col.column]) {
                                    var bstr = that.options.condition[col.column];
                                    if (Iptools.Tool._checkNull(bstr) && bstr.indexOf("=") != -1) {
                                        v1 = bstr.split("=")[1];
                                        if (v1.indexOf("'") != -1 || v1.indexOf('"') != -1) {
                                            v1 = Iptools.Tool._search_replacement(v1);
                                        }
                                    }
                                }
                                $(sgd).append("<label>" + col.name + "</label><br />",
                                    $("<input type='checkbox' class='s-search-switch' " +
                                        (v1 == "1" ? "checked:'checked'" : "") + " />").data("column", col.column));
                                $(csd).append(sgd);
                                searchFlag = true;
                                break;
                            case "date":
                                if (that.options.condition && that.options.condition[col.column]) {
                                    var dstr = that.options.condition[col.column];
                                    if (Iptools.Tool._checkNull(dstr) && dstr.indexOf("=") != -1) {
                                        v2 = dstr.split("=")[1];
                                        if (v2.indexOf("'") != -1 || v2.indexOf('"') != -1) {
                                            v2 = Iptools.Tool._search_replacement(v2);
                                        }
                                    }
                                }
                                $(sgd).append("<label>" + col.name + "</label>",
                                    $("<input type='text' class='form-control datePicker low' placeholder='起始日期' />").data("column", col.column),
                                    $("<input type='text' class='form-control datePicker high' placeholder='结束日期' />").data("column", col.column));
                                $(csd).append(sgd);
                                searchFlag = true;
                                break;
                            case "time":
                                $(sgd).append("<label>" + col.name + "</label>",
                                    $("<input type='text' class='form-control timePicker low' placeholder='起始时间' />").data("column", col.column),
                                    $("<input type='text' class='form-control timePicker high' placeholder='结束时间' />").data("column", col.column));
                                $(csd).append(sgd);
                                searchFlag = true;
                                break;
                            case "pickApplet":
                                $(sgd).append("<label>" + col.name + "</label>", $("<div class='input-group'></div>").append(
                                    $("<input type='text' class='form-control s-search-applet-ip' disabled='disabled' />").data("column", col.column),
                                    $("<span class='input-group-addon s-search-applet'><span class='fa fa-search'></span></span>").data("applet", col.pickApplet)));
                                $(csd).append(sgd);
                                searchFlag = true;
                                break;
                        }
                        if (searchFlag) {
                            that.options.searchCons.push(csd);
                        }
                    }
                    //extraColumn
                    var ecd = document.createElement("div");
                    $(ecd).addClass("s-column").data("type", "vlink-column");
                    if (that.options.showManage) {
                        if (that.options.appletData.isDetailView) {
                            var ech = document.createElement("div");
                            $(ech).addClass("s-cell header vlink " + that.options.borderStyle);
                            var ect = document.createElement("div");
                            $(ect).addClass("content").append("<span>" + that.options.appletData.detailColumnName + "</span>");
                            $(ecd).append($(ech).append(ect));
                            if (that.options.data && that.options.data.records) {
                                for (var v = 0; v < that.options.data.records.length; v++) {
                                    var eot = that.options.data.records[v];
                                    if (that.options.jumpType == "template") {
                                        $(ecd).append($("<div class='s-cell vlink " + that.options.borderStyle
                                            + "' data-index='" + v + "'>" + (that.options.jumpTemplate ?
                                                that.options.jumpTemplate : that.options.appletData.detailHrefText)
                                            + "</div>").data("key", eot ? eot[that.options.rootLink + ":id"] : "")
                                            .data("view", that.options.appletData.detailViewId));
                                    } else {
                                        $(ecd).append($("<div class='s-cell vlink " + that.options.borderStyle
                                            + "' data-index='" + v + "'><a class='d-v-link'>" + that.options.appletData.detailHrefText
                                            + "</a></div>").data("key", eot ? eot[that.options.rootLink + ":id"] : "")
                                            .data("view", that.options.appletData.detailViewId));
                                    }
                                }
                            }
                            that._NormalCount++;
                            that.options.manageCols.push(ecd);
                        }
                    }
                }
            },
            _apply: function () {
                var that = this;
                that.$container.empty();
                //header
                var thd = document.createElement("div");
                $(thd).addClass("s-header-bar");
                var tht = document.createElement("div");
                $(tht).addClass("s-title").html(that.options.tableTitle ? that.options.tableTitle : that.options.appletData.displayName);
                var tbg = document.createElement("div");
                if (that.options.multiPanel) {
                    $(tbg).addClass("btn-group s-btn-group").attr("role", "group").append(
                        $("<button type='button' class='btn small commonBtn'><span class='fa fa-list'></span>列表</button>").data("panel", "s-table-list-panel"));
                }
                var thm = document.createElement("div");
                $(thm).addClass("s-manage");
                if (that.options.searchCons.length) {
                    var sbtn = $("<button class='btn small commonBtn revert ul-search dropdown-toggle'" +
                        " data-loading-text=\"<span class='fa fa-spin fa-spinner'></span>\"  " +
                        "data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>筛 选" +
                        "</button>").data("status", "0");
                    var tsd = document.createElement("div");
                    $(tsd).addClass("s-search-bar");
                    var tsf = document.createElement("form");
                    $(tsf).attr("id", that.options.search);
                    var placeHolder = "";
                    if (that.options.searchCons.length) {
                        for (var s = 0; s < that.options.searchCons.length; s++) {
                            var sim = that.options.searchCons[s];
                            if ($(sim).data("type") == "text") {
                                that.options.tcondition.push($(sim).data("column"));
                                if (placeHolder != "") {
                                    placeHolder += "/";
                                }
                                placeHolder += $(sim).data("name");
                            }
                            $(tsf).append(sim);
                        }
                        $(tsd).append(tsf, "<div class='btn-group-right'><button class='btn cancel revert ul-form-btn clear'>清 空</button>" +
                            "<button class='btn commonBtn ul-form-btn'>筛 选</button></div>");
                    }
                    if (that.options.tcondition.length) {
                        $(thm).append("<form class='s-t-search-form'>" +
                            "<input class='form-control' placeholder='" +
                            (Iptools.Tool._checkNull(that.options.placeHolder) ? that.options.placeHolder : placeHolder) + "'/>" +
                            "<span class='form-control-feedback fa fa-search'></span></form>");
                    }
                    var sul = $("<ul class='dropdown-menu dropdown-menu-right s-search-ul'></ul>").append($("<li " +
                        " data-stopPropagation='true'></li>").append(tsd)).css("margin-top", "-10px");
                    $(thm).append($("<div class='btn-group'></div>").append(sbtn, sul));
                    //bind datetimepicker
                    try {
                        $(thm).find(".form-control.datePicker").datetimepicker({
                            format: "yyyy-mm-dd",
                            autoclose: true,
                            todayBtn: true,
                            language: "zh-CN",
                            minView: "month"
                        });
                        $(thm).find(".form-control.timePicker").datetimepicker({
                            format: "yyyy-mm-dd hh:00",
                            autoclose: true,
                            todayBtn: true,
                            language: "zh-CN",
                            minView: 1
                        });
                    } catch (e) {
                        console.log("ERROR: required datetimepicker");
                    }
                    //bind switch
                    try {
                        $(thm).find("input.s-search-switch").bootstrapSwitch({
                            onText: "是",
                            offText: "否",
                            size: "small",
                            handleWidth: 50,
                            labelWidth: 30
                        });
                    } catch (e) {
                        console.log("ERROR: required bootstrap-switch");
                    }
                }
                for (var b = 0; b < that.options.buttons.length; b++) {
                    var btn = that.options.buttons[b];
                    if (btn.name.length == 2) {
                        btn.name = btn.name.substr(0, 1) + " " + btn.name.substr(1, 1);
                    }
                    if (btn.style && btn.style.indexOf("group") != -1) {
                        if ($(thm).find(".s-manage-group").length <= 0) {
                            $(thm).append("<div class='btn-group s-manage-group'><button type='button' class='btn commonBtn small " +
                                "dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='margin-right:0;'>" +
                                "功 能 <span class='caret'></span></button><ul class='dropdown-menu dropdown-menu-right s-group-ul'>" +
                                "</ul></div>");
                        }
                        $(thm).find(".s-manage-group ul.s-group-ul").append($("<li></li>").append($("<a class='" + btn.type + " " +
                            (btn.style && btn.style.indexOf("cascade") != "-1" ? "cascade no-events" : "") + "'>" +
                            btn.name + "</a>").data("view", btn.createView)
                            .data("applet", btn.createApplet)));
                    } else {
                        $(thm).append($("<button class='btn " + btn.style + " " + btn.type
                            + (btn.style && btn.style.indexOf("cascade") != "-1" ? " no-events disableBtn" : "") + "' " +
                            "data-loading-text=\"<span class='fa fa-spin fa-spinner'></span>执行中\">" +
                            "<span class='text'>" + btn.name + "</span></button>").data("view", btn.createView)
                            .data("applet", btn.createApplet));
                    }
                }
                $(thd).append($(tht).append((that.options.multiPanel ? tbg : ""), thm));
                //table
                var table = document.createElement("div");
                $(table).addClass("s-table col-lg-12");
                var tfd = document.createElement("div");
                $(tfd).addClass("s-table-freeze col-lg-" + that.options.freezeCols.length);
                if (that.options.freezeCols.length == 0) {
                    $(tfd).css("display", "none");
                } else {
                    for (var x = 0; x < that.options.freezeCols.length; x++) {
                        $(tfd).append(that.options.freezeCols[x]);
                    }
                }
                var tnd = document.createElement("div");
                $(tnd).addClass("s-table-container col-lg-12");
                if (that.options.normalCols.length) {
                    for (var i = 0; i < that.options.normalCols.length; i++) {
                        $(tnd).append(that.options.normalCols[i]);
                    }
                }
                var tmd = document.createElement("div");
                $(tmd).addClass("s-manage-freeze col-lg-1");
                if (that.options.manageCols.length) {
                    for (var m = 0; m < that.options.manageCols.length; m++) {
                        $(tmd).append(that.options.manageCols[m]);
                    }
                } else {
                    $(tmd).css("display", "none");
                }
                //pagination
                var tpd = document.createElement("div");
                $(tpd).attr("id", that.options.pag).addClass("s-pagination row");
                $(table).append(tfd, tnd, tmd);
                if (that.options.showHeader) {
                    that.$container.append(thd);
                }
                //emptyData
                var eyd = document.createElement("div");
                that.$container.append($("<div id='s-table-list-panel' class='s-panel'></div>").append(table, $(eyd).hide(), tpd));
                //searchModal
                var modal = document.createElement('div');
                $(modal).addClass("modal fade").attr({
                    "id": that.options.searchModal,
                    "tabindex": "-1",
                    "role": "dialog",
                    "data-backdrop": "static"
                });
                var mdialog = document.createElement('div');
                $(mdialog).addClass('modal-dialog').attr("role", "document").css("width", "800px");
                var mcontent = document.createElement('div');
                $(mcontent).addClass('modal-content').css({
                    "width": "auto",
                    "min-height": "200px"
                }).append(
                    "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' " +
                    "aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' " +
                    ">" + that.options.searchModalTitle + "</h4></div>",
                    "<div class='modal-body' style='padding:0'><div id='" + that.options.searchModalList + "'></div></div>",
                    "<div class='modal-footer'><button type='button' class='btn commonBtn search-confirm'>确定</button>" +
                    "<button type='button' class='btn cancel revert' data-dismiss='modal' style='margin-left:5px;'>取消</button></div>");
                that.$container.after($(modal).append($(mdialog).append(mcontent)));
                //panels
                for (var p = 0; p < that.options.panels.length; p++) {
                    var pan = that.options.panels[p];
                    if (pan && pan.name && pan.container) {
                        $(tbg).append($("<button type='button' class='btn small commonBtn revert'><span class='" +
                            (pan.icon ? pan.icon : "fa fa-th") + "'></span>" + pan.name + "</button>")
                            .data("panel", pan.container));
                        that.$container.append($("#" + pan.container).addClass("s-panel"));
                        $("#" + pan.container).hide();
                        if (pan.onShow && typeof pan.onShow == "function") {
                            $("#" + pan.container).bind("s-show", pan.onShow);
                        }
                    }
                }
                if (that.options.data) {
                    component._pager({
                        container: that.options.pag,
                        pageSize: that.options.pageSize,
                        pageCount: that.options.data.pageCount,
                        rowCount: that.options.data.rowCount,
                        pageNow: that.options.pageNow,
                        jump: function (page) {
                            that.options.pageNow = page;
                            that._invest().done(function () {
                                that._investData();
                            });
                        }
                    });
                } else {
                    $(eyd).addClass("s-empty-container col-lg-12").append($("<img src='" + that.options.emptyImage
                        + "' alt='' />").css("height", that.options.emptySize + "px")
                            .addClass((that.options.emptyClick && typeof that.options.emptyClick == "function") ? "e-img-fc" : ""),
                        "<span>" + that.options.emptyText + "</span>").show();
                    component._pager({
                        container: that.options.pag,
                        pageSize: that.options.pageSize,
                        pageCount: 0,
                        rowCount: 0,
                        pageNow: that.options.pageNow,
                        jump: function (page) {
                            that.options.pageNow = page;
                            that._invest().done(function () {
                                that._investData();
                            });
                        }
                    });
                }
                if (that.options.afterLoad && typeof that.options.afterLoad == "function") {
                    that.options.afterLoad();
                }
            },
            _bindEvents: function () {
                var that = this;
                that.$container.unbind();
                that.$container
                    .on("click", ".pn-control .modalSearch", function () {
                        var me = $(this);
                        var applet = me.data("applet");
                        if (Iptools.Tool._checkNull(applet)) {
                            me.addClass("current-unit-search-picker");
                            component._table("#" + that.options.searchModal + " #" + that.options.searchModalList, {
                                pageNow: 1,
                                pageSize: 10,
                                applet: applet,
                                checkType: "radio"
                            });
                            $("#" + that.options.searchModal).modal("show");
                        }
                    });
                if (that.options.events && that.options.events.length) {
                    for (var e = 0; e < that.options.events.length; e++) {
                        var evt = that.options.events[e];
                        if (evt && evt.target && evt.type && evt.event && typeof evt.event == "function") {
                            $(that.$container).on(evt.type, evt.target, evt.event);
                        }
                    }
                }
            }
        };
        var list = new standardList(cta, ops);
        $(cta).data("list", list);
    },
    //初始化活动基础页面
    initCampaignBaseDom: function (opts) {
        var html = '<div class="section-main col-sm-12">' +
            '<section class="section-event">' +
            '<div class="col-main">' +
            '<div class="navLeft">' +
            '<div class="top-bar"></div>' +
            '<div class="preview-area"></div>' +
            '<div class="bottom-bar"></div>' +
            '</div>' +
            '</div>' +
            '<div class="contactInfoTab">' +
            '<ul class="nav nav-tabs contactTabList" role="tablist">' +
            '</ul>' +
            '<!-- Tab panes -->' +
            '<div class="tab-content-main">' +
            '<div class="tab-content">' +
            '</div>' +
            '<!-- 保存按钮 -->' +
            '<div class="foot-btn-area">' +
            '<div class="footer-btn-area">' +
            '<div  class="foot-btn-left">' +
            '<button type="button" class="btn commonBtn wx-preview-btn">微信预览</button>' +
            '</div>' +
            '<div class="foot-btn-right">' +
            ' <button class="btn commonBtn cancel cancel-btn" type="reset" >取&nbsp;消</button>' +
            ' <button type="button" class="btn commonBtn comfirm-btn">保&nbsp;存</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</section>' +
            '</div>';
        if (opts.container) {
            $(opts.container).html(html);
        }
        //活动类型
        if (opts.campaignTypeName) {
            $(".tem-type-name").html(opts.campaignTypeName);
        }
        //render tabs
        if (opts.tabNameArr && opts.tabNameArr.length !== 0) {
            var tabHtml = "";
            var tabPanel = "";
            var tabNames = opts.tabNameArr;
            var len = opts.tabNameArr.length;
            for (var i = 0; i < len; i++) {
                if (i === 0) {
                    tabHtml += '<li role="presentation" class="active">' +
                        '<a href="#tab' + i + '-panel" class="tabSwitch" role="tab" data-toggle="tab" id="tab' + i + '-tablink" aria-expanded="true">' + tabNames[i] + '</a>' +
                        '</li>';
                    tabPanel +=
                        '<div class="tab-pane switchBasic active" id="tab' + i + '-panel" role="tabpanel">' +
                        '</div>';
                } else {
                    tabHtml += '<li role="presentation">' +
                        '<a href="#tab' + i + '-panel" class="tabSwitch" role="tab" data-toggle="tab" id="tab' + i + '-tablink" aria-expanded="true">' + tabNames[i] + '</a>' +
                        '</li>';
                    tabPanel +=
                        '<div class="tab-pane switchBasic" id="tab' + i + '-panel" role="tabpanel">' +
                        '</div>';
                }

            }
            $(".contactTabList").html(tabHtml);
            $(".tab-content").html(tabPanel);
        }
    },
};