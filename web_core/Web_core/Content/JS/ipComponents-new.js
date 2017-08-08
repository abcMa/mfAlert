//IntoPalm Components js file for new
//Author :Ethan
//Created :2016-11-01
/**
    ui element styles and placement
    this plugins provides function able to set the UI elements for detail Applet in Adding mode
    Please Check for standard files exited in /standard directory 
**/
var component = {};
component = {
    /*
        ui dom elements Default Panels
    */
    _UIDEFAULFS: {
        mainPanel: "mainContent",
        detailSearchPanle: "#modalList_body",
        searchForm: ".list-search-form",
        buttonPanel: "#buttonListPanel",
        detailSelectModal: "#detailControlSearchModal",
        defaultPicturePath: "Image/defaultHead.png",
        defaultWordPath: "Image/wordfile.jpg",
        defaultExcelPath: "Image/excelfile.jpg",
        defaultPPTPath: "Image/pptfile.jpg",
        defaultFilePath: "Image/fileadd.jpg",
        controlCalLinks: [],
        DataCurrentSets: {},
        modalCondition: {},
        formValidations: {}
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
    _bindingDomEvent: function () {
        component._enablePickItemModal();
        component._enableDetailSearchModalPick();
        component._enableDetailSearchModalClear();
        component._enableImageControl();
        component._enableFileControl();
        component._enableLightbox();
        component._enablePaginationNext();
        component._enablePaginationPre();
        component._enablePaginationClick();
        component._enableControlSearchSubmit();
        component._enableDateFormatProto();
        component._enableControlChangeData();
    },
    _bindingEventAfterLoad: function () {
        component._enableTimeOrDateField();
        component._enableControlCalLinkBinding();
        component._enableSwitchControl();
        component._enableRichTextArea();
    },
    _initComponents: function () {
        component._bindingDomEvent();
    },
    _enableSpecificControls: function (options) {
        component._bindingEventAfterLoad();
        $("#" + options.form).bootstrapValidator({ fields: component._UIDEFAULFS.formValidations[options.form] });
    },
    _getNonValuedControlsInForm: function (options) {
        var result = "";
        Iptools.uidataTool._getApplet({
            async: false,
            applet: options.appletId
        }, function (ds) {
            if (ds.applet.type == "detail") {
                result = component._setNonValuedControlsInForm({
                    data: ds,
                    form: options.form
                });
            }
        });
        return result;
    },
    _setNonValuedControlsInForm: function (options) {
        var controls = {};
        component._UIDEFAULFS.DataCurrentSets[options.form] = {};
        component._UIDEFAULFS.formValidations[options.form] = {};
        $.each(options.data.controls, function (key, obj) {
            var dd = document.createElement("div");
            $(dd).css("padding-top", "20px");
            $(dd).attr("class", "form-group dataNewAppletMain col-sm-12");
            $(dd).css({ "margin": "0 0 25px 0", "text-align": "left" });
            var lab = document.createElement("label");
            $(lab).attr("class", "control-label");
            $(lab).html(obj.name);
            $(dd).append(lab);
            var valires = component._setValidate({
                validations: component._UIDEFAULFS.formValidations[options.form],
                control: obj,
            });
            component._UIDEFAULFS.formValidations[options.form] = valires.validation;
            $(dd).append(component._setControlNonValued({
                control: obj,
                container: options.form,
                valid: valires.valid
            }));
            controls[obj.column] = dd;
        });
        return controls;
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
        if (options.control.reg != undefined) {
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
        return { validation: options.validations, valid: track };
    },
    //load every control field according to its own type
    //type series :text time pickApplet select date check radio picture textarea file percent rmb hidden
    //the values of given controls are empty and needless to initial
    _setControlNonValued: function (options) {
        var ip = document.createElement("input");
        var dg = document.createElement("div");
        var sg = document.createElement("span");
        var sp = document.createElement("span");
        var sd = document.createElement("span");
        var sdf = document.createElement("span");
        var sl = document.createElement("select");
        switch (options.control.type) {
            case "text":
            default:
                $(ip).data("column", options.control.column);
                $(ip).addClass("form-control control-normal-text");
                $(ip).attr("type", "text");
                $(ip).attr("name", options.control.column);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
                return ip;
            case "pwd":
                $(ip).data("column", options.control.column);
                $(ip).addClass("form-control control-normal-text");
                $(ip).attr("type", "password");
                $(ip).attr("name", options.control.column);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
                return ip;
            case "time":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control timeStampPicker control-normal-text");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.control.column);
                $(ip).attr("data-form", options.container);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
                $(sg).addClass("input-group-addon");
                $(sp).addClass("glyphicon glyphicon-dashboard");
                $(sp).attr("aria-hidden", "true");
                $(sp).attr("type", "button");
                $(sg).append(sp);
                $(dg).append(ip, sg);
                return dg;
            case "pickApplet":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control control-normal-text");
                $(ip).data("column", options.control.column);
                $(ip).data("pick", "1");
                $(ip).attr("type", "text");
                $(ip).attr("name", options.control.column);
                $(ip).attr("readonly", "readonly");
                $(ip).attr("data-form", options.container);
                $(ip).attr("data-valid", options.valid);
                if (Iptools.Tool._checkNull(Iptools.DEFAULTS.currentViewApplet)) {
                    var cbc = 0;
                    Iptools.uidataTool._getApplet({
                        async: false,
                        applet: Iptools.DEFAULTS.currentViewApplet
                    }, function (das) {
                        cbc = das.rootBc;
                    });
                    if (Iptools.Tool._checkNull(cbc)) {
                        var links = Iptools.uidataTool._getFiledLinks({
                            field: options.control.field,
                            cbc: cbc
                        });
                        if (links && links.length > 0) {
                            $(ip).data("key", Iptools.DEFAULTS.currentViewValue);
                            $(ip).val("已自动选择(ID:" + Iptools.DEFAULTS.currentViewValue + ")");
                            component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = Iptools.DEFAULTS.currentViewValue;
                        }
                    }
                }
                $(sg).addClass("input-group-addon");
                $(sp).addClass("glyphicon glyphicon-search");
                $(sp).attr("aria-hidden", "true");
                $(sp).attr("title", "选择");
                $(sp).attr("type", "button");
                $(sp).attr("data-toggle", "modal");
                $(sp).attr("data-target", component._UIDEFAULFS.detailSelectModal);
                $(sp).data("applet", options.control.pickApplet);
                $(sp).css("cursor", "pointer");
                $(sg).append(sp);
                $(sdf).addClass("input-group-addon");
                $(sdf).css("border-left", "1px #fff solid");
                $(sd).addClass("glyphicon glyphicon-trash clearSearchPick");
                $(sd).attr("aria-hidden", "true");
                $(sd).attr("title", "清空");
                $(sd).attr("type", "button");
                $(sd).css("cursor", "pointer");
                $(sdf).append(sd);
                $(dg).append(ip, sg, sdf);
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
                if (!options.control.modify) {
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
                if (!options.control.modify) {
                    $(sl).attr("disabled", "disabled");
                }
                return sl;
            case "date":
                $(dg).addClass("input-group");
                $(ip).addClass("form-control dateStampPicker control-normal-text");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.control.column);
                $(ip).attr("data-form", options.container);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
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
                $(sg).css("border", "0").css("box-shadow", "none");
                $.each(options.control.pickList, function (key, obj) {
                    var lab = document.createElement("label");
                    $(lab).addClass("checkbox-inline");
                    $(lab).css({ "margin": "0 10px 0 0" });
                    var ipt = document.createElement("input");
                    $(ipt).addClass("input-cr");
                    $(ipt).attr("type", "checkbox");
                    $(ipt).attr("name", options.control.column);
                    $(ipt).val(obj.id);
                    if (!options.control.modify) {
                        $(ipt).attr("disabled", "disabled");
                    }
                    if (options.control.defaultValue && options.control.defaultValue.indexOf(obj.id) > -1) {
                        $(ipt).attr("checked", "checked");
                        component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
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
                    $(ipt).attr("name", options.control.column + "_radio");
                    $(ipt).val(obj.id);
                    if (!options.control.modify) {
                        $(ipt).attr("disabled", "disabled");
                    }
                    if (options.control.defaultValue && options.control.defaultValue.indexOf(obj.id) > -1) {
                        $(ipt).attr("checked", "checked");
                        component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
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
                $(a).attr("href", component._UIDEFAULFS.defaultPicturePath);
                $(a).data("column", options.control.column);
                $(a).attr("data-lightbox", options.container + "_lightbox");
                var img = document.createElement("img");
                $(img).attr("src", component._UIDEFAULFS.defaultPicturePath);
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
                $(af).addClass("img-file");
                $(af).append("更改");
                $(ip).attr("type", "file");
                $(ip).attr("name", options.control.column);
                $(ip).attr("accept", ".jpg,.png");
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
                $(txa).attr("name", options.control.column);
                $(txa).addClass("form-control detailTextarea");
                $(txa).css("width", "95%");
                if (!options.control.modify) {
                    $(txa).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(txa).text(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
                return txa;
            case "richtext":
                $(dg).addClass("richtext-area");
                $(dg).data("column", options.control.column);
                if (!options.control.modify) {
                    $(dg).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(dg).html(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
                return dg;
            case "file":
                var iconUrl = component._UIDEFAULFS.defaultFilePath;
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
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
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
                $(ip).addClass("form-control control-normal-text");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.control.column);
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
                $(dg).append(sg, ip);
                return dg;
            case "cal":
                $(dg).addClass("input-group");
                $(sg).addClass("input-group-addon");
                $(sp).attr("type", "button");
                $(sp).attr("aria-hidden", "true");
                $(sp).addClass("icon-stethoscope");
                $(sg).append(sp);
                $(ip).addClass("form-control control-normal-text");
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "text");
                $(ip).attr("name", options.control.column);
                $(ip).attr("disabled", "disabled");
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                    component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                }
                $(dg).append(sg, ip);
                component._UIDEFAULFS.controlCalLinks.push({
                    key: options.control.column,
                    value: options.control.formula
                });
                return dg;
            case "hidden":
                $(ip).data("column", options.control.column);
                $(ip).attr("type", "hidden");
                $(ip).attr("name", options.control.column);
                $(ip).addClass("form-control control-hidden-text");
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    $(ip).val(options.control.defaultValue);
                }
                component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = options.control.defaultValue;
                return ip;
            case "bool":
                $(ip).data("column", options.control.column);
                $(ip).attr("name", options.control.column);
                $(ip).attr("type", "checkbox");
                $(ip).addClass("switch-checkbox");
                if (!options.control.modify) {
                    $(ip).attr("disabled", "disabled");
                }
                if (Iptools.Tool._checkNull(options.control.defaultValue)) {
                    if (options.control.defaultValue == "1") {
                        $(ip).attr("checked", "checked");
                        component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = "1";
                    } else {
                        component._UIDEFAULFS.DataCurrentSets[options.container][options.control.column] = "0";
                    }
                }
                $(dg).append(ip);
                return dg;
        }
    },
    _setPickOptions: function (options) {
        var rs = [];
        Iptools.uidataTool._getUserlistAppletData({
            async: false,
            view: Iptools.DEFAULTS.currentView,
            appletId: options.control.pickApplet,
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
        $(d).append(component._setTableAppletMainData(options));
        var nav = document.createElement("nav");
        $(nav).addClass("text-center");
        $(nav).append(component._setListPaginationPanel({
            pageNow: options.pageNow,
            panel: component._UIDEFAULFS.detailSearchPanle,
            data: options.data,
            type: "table",
            container: options.container
        }));
        $(dg).append(d);
        $(dg).append(nav);
        return dg;
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
        if (options.data.data && options.data.data.records.length) {
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
    _setListSearchContent: function (options) {
        Iptools.uidataTool._getUserlistAppletData(options, function (data) {
            $(component._UIDEFAULFS.searchForm).html("");
            $.each(data.columns, function (key, obj) {
                if (obj.allowOutterQuery) {
                    $(component._UIDEFAULFS.searchForm).append(component._setListSearchItem({
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
            $(component._UIDEFAULFS.searchForm).append(sbtn);
            //component._enableTimeOrDateField();
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
            default:
                $(d).attr("data-type", "text");
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
                $.each(component._setPickSearchOptions(options), function (tkey, tobj) {
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
        component._UIDEFAULFS.modalCondition = {};
        var paraStr = {};
        var objSearchItem = $(component._UIDEFAULFS.searchForm).find(".control-search-item");
        for (var i = 0; i < objSearchItem.length; i++) {
            var columnName;
            var o = objSearchItem.eq(i);
            columnName = o.data("column");
            var inputValue;
            switch (o.data("type")) {
                case "text":
                    inputValue = o.find("input").eq(0).val().replace(component._UIDEFAULFS.blankReg, '');
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = " like '%" + inputValue + "%'";
                        component._UIDEFAULFS.modalCondition[columnName] = " like '%" + inputValue + "%'";
                    }
                    break;
                case "int":
                    inputValue = o.find("input").eq(0).val().replace(component._UIDEFAULFS.blankReg, '');
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "=" + inputValue;
                        component._UIDEFAULFS.modalCondition[columnName] = "=" + inputValue;
                    }
                    break;
                case "select":
                    inputValue = o.find("select").eq(0).val();
                    if (Iptools.Tool._checkNull(inputValue)) {
                        paraStr[columnName] = "='" + inputValue + "'";
                        component._UIDEFAULFS.modalCondition[columnName] = "='" + inputValue + "'";
                    }
                    break;
            }
        }
        return JSON.stringify(paraStr);
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
    _setControlCalLinks: function (options) {
        var cols = component._spiltCalLink({
            str: options.value
        });
        for (var j = 0; j < cols.length; j++) {
            var ms = cols[j];
            var inputFlag = true;
            var tObj = $("input[name='" + ms + "']");
            if (!tObj.length) {
                inputFlag = false;
            }
            if (inputFlag) {
                component._addEventListener({
                    container: "body",
                    type: "focus",
                    target: "input[name='" + ms + "']",
                    event: function () {
                        $("input[name='" + options.key + "']").addClass("border-input-focus");
                        $("input[name='" + options.key + "']").parent().find("span:first").addClass("border-span-focus");
                    }
                });
                component._addEventListener({
                    container: "body",
                    type: "blur",
                    target: "input[name='" + ms + "']",
                    event: function () {
                        $("input[name='" + options.key + "']").removeClass("border-input-focus");
                        $("input[name='" + options.key + "']").parent().find("span:first").removeClass("border-span-focus");
                    }
                });
            } else {
                component._addEventListener({
                    container: "body",
                    type: "focus",
                    target: "select[name='" + ms + "']",
                    event: function () {
                        $("input[name='" + options.key + "']").addClass("border-input-focus");
                        $("input[name='" + options.key + "']").parent().find("span:first").addClass("border-span-focus");
                    }
                });
                component._addEventListener({
                    container: "body",
                    type: "blur",
                    target: "select[name='" + ms + "']",
                    event: function () {
                        $("input[name='" + options.key + "']").removeClass("border-input-focus");
                        $("input[name='" + options.key + "']").parent().find("span:first").removeClass("border-span-focus");
                    }
                });
            }
            if (inputFlag) {
                component._addEventListener({
                    container: "body",
                    type: "input propertychange",
                    target: "input[name='" + ms + "']",
                    event: function () {
                        var flag = true;
                        var cstr = options.value;
                        for (var x = 0; x < cols.length; x++) {
                            var targetObj = $("input[name='" + cols[x] + "']");
                            if (!targetObj.length) {
                                targetObj = $("select[name='" + cols[x] + "']");
                            }
                            if (component._getCalControlVal({
                                name: cols[x]
                            }) < 0 || targetObj.parent().parent().hasClass("has-error")
                                || Iptools.Tool._blank_replacement(targetObj.val()) == "") {
                                flag = false;
                            } else {
                                cstr = cstr.replace(eval("/{" + cols[x] + "}/g"), component._getCalControlVal({
                                    name: cols[x]
                                }));
                            }
                        }
                        var ctl = $("input[name='" + options.key + "']");
                        if (flag) {
                            var result = eval(cstr);
                            var intreg = /^(-|\+)?\d+$/;
                            var floatreg = /^(-|\+)?\d+\.\d*$/;
                            if (typeof (result) == "string") {
                                $("input[name='" + options.key + "']").val(eval(cstr));
                                component._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                            } else if (typeof (result) == "number") {
                                if (intreg.test(result)) {
                                    ctl.val(eval(cstr));
                                    component._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                                } else if (floatreg.test(result)) {
                                    ctl.val(eval(cstr).toFixed(2));
                                    component._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr).toFixed(2);
                                }
                            }
                        } else {
                            ctl.val("");
                        }
                    }
                });
            } else {
                component._addEventListener({
                    container: "body",
                    type: "change",
                    target: "select[name='" + ms + "']",
                    event: function () {
                        var flag = true;
                        var cstr = options.value;
                        for (var x = 0; x < cols.length; x++) {
                            var targetObj = $("input[name='" + cols[x] + "']");
                            if (!targetObj.length) {
                                targetObj = $("select[name='" + cols[x] + "']");
                            }
                            if (component._getCalControlVal({
                                name: cols[x]
                            }) < 0 || targetObj.parent().parent().hasClass("has-error")
                                || Iptools.Tool._blank_replacement(targetObj.val()) == "") {
                                flag = false;
                            } else {
                                cstr = cstr.replace(eval("/{" + cols[x] + "}/g"), component._getCalControlVal({
                                    name: cols[x]
                                }));
                            }
                        }
                        if (flag) {
                            var result = eval(cstr);
                            var intreg = /^(-|\+)?\d+$/;
                            var floatreg = /^(-|\+)?\d+\.\d*$/;
                            var ctl = $("input[name='" + options.key + "']");
                            if (typeof (result) == "string") {
                                $("input[name='" + options.key + "']").val(eval(cstr));
                                component._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                            } else if (typeof (result) == "number") {
                                if (intreg.test(result)) {
                                    ctl.val(eval(cstr));
                                    component._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr);
                                } else if (floatreg.test(result)) {
                                    ctl.val(eval(cstr).toFixed(2));
                                    component._UIDEFAULFS.DataCurrentSets[ctl.parents("form:first").attr("id")][ctl.data("column")] = eval(cstr).toFixed(2);
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
            language: "zh-CN"
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
        for (var i = 0; i < component._UIDEFAULFS.controlCalLinks.length; i++) {
            component._setControlCalLinks({
                key: component._UIDEFAULFS.controlCalLinks[i].key,
                value: component._UIDEFAULFS.controlCalLinks[i].value
            });
        }
    },
    _enablePickItemModal: function () {
        component._addEventListener({
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
                        me.find("#modalList_body").append(component._setTableAppletContent({
                            data: ds,
                            pageNow: 1,
                            pageSize: Iptools.DEFAULTS.pageSize,
                            container: container
                        }));
                        component._setListSearchContent({
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
        component._addEventListener({
            container: "body",
            type: "submit",
            target: ".list-search-form",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                var condition = component._setListSearchParaContext();
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
                        $(component._UIDEFAULFS.detailSearchPanle).html("");
                        $(component._UIDEFAULFS.detailSearchPanle).append(component._setTableAppletContent({
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
    _enableDetailSearchModalPick: function () {
        component._addEventListener({
            container: "body",
            type: "click",
            target: ".detailSearchPick",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var container = $(this).parent().parent().find("#modalList_body");
                var selectTrds = container.find("input[name='modalListRadio']:checked");
                if (selectTrds.length) {
                    var index = 0;
                    container.find("th").each(function (key, obj) {
                        if ($(obj).hasClass("pickColumn")) {
                            index = key;
                        }
                    });
                    var value = selectTrds.parent().parent().find("td").eq(index).html();
                    var target = $(".currentDetailSearchTarget").parent().parent().find("input");
                    target.data("key", selectTrds.data("key"));
                    target.val(value);
                    $(component._UIDEFAULFS.detailSelectModal).modal("hide");
                    if (target.data("valid")) {
                        $("#" + target.data("form")).data("bootstrapValidator")
                            .updateStatus(target.attr("name"), "NOT_VALIDATED").validateField(target.attr("name"));
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
        component._addEventListener({
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
                    $("#" + target.data("form")).data("bootstrapValidator")
                        .updateStatus(target.attr("name"), "NOT_VALIDATED").validateField(target.attr("name"));
                }
                target.trigger("blur");
            }
        });
    },
    _submitFormControlsData: function (options) {
        var newContactId;
        var me = $("#" + options.form);
        me.bootstrapValidator('validate');
//        console.log(me.data("bootstrapValidator").isValid());
        if (me.data("bootstrapValidator").isValid()) {
            var dataImg = me.find(".lightboxLink");
            var datafile = me.find(".file-data");
            dataImg.each(function () {
                if ($(this).data("has")) {
                    var imgPath;
                    var ctrl = $(this);
                    var paraData = new FormData();
                    paraData.append("file", $(this).parent().find("input")[0].files[0]);
                    Iptools.uidataTool._uploadfileData({
                        data: paraData,
                        type: "picture"
                    }, function (path) {
                        imgPath = Iptools.DEFAULTS.serviceUrl + path;
                        component._UIDEFAULFS.DataCurrentSets[options.form][ctrl.data("column")] = imgPath;
                    });
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
                        component._UIDEFAULFS.DataCurrentSets[options.form][ctl.data("column")] = filename + "|" + filepath;
                    });
                }
            });
            var appletId = options.appletId;
            Iptools.uidataTool._addAppletData({
                appletId: appletId,
                valueId: null,
                data: JSON.stringify(component._UIDEFAULFS.DataCurrentSets[options.form])
            }, function (r) {
                if (r.retcode == "fail") {
                    Iptools.Tool.pAlert({
                        title: "系统提示",
                        content: r.retmsg
                    });
                } else {
                    newContactId = r.id;
                }
            }, function () {
                Iptools.Tool.pAlert({
                    title: "系统提示",
                    content: "添加失败"
                });
            });
        }
        return newContactId;
    },
    _enableImageControl: function () {
        component._addEventListener({
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
                        me.parent().parent().find(".lightboxLink").data("has", true);
                        me.parent().parent().find(".lightboxLink").attr("href", src);
                    }
                } else {
                    me.parent().parent().find("img").attr("src", component._UIDEFAULFS.defaultPicturePath);
                    me.parent().parent().find(".lightboxLink").data("has", false);
                    me.parent().parent().find(".lightboxLink").attr("href", component._UIDEFAULFS.defaultPicturePath);
                }
            }
        });
    },
    _enableFileControl: function () {
        component._addEventListener({
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
                        iconUrl = component._UIDEFAULFS.defaultWordPath;
                    } else if (filename.indexOf("xls") > 0) {
                        iconUrl = component._UIDEFAULFS.defaultExcelPath;
                    } else if (filename.indexOf("ppt") > 0) {
                        iconUrl = component._UIDEFAULFS.defaultPPTPath;
                    } else {
                        iconUrl = component._UIDEFAULFS.defaultFilePath;
                    }
                    ctrl.find("img").attr("src", iconUrl);
                    ctrl.find("p").html(filename);
                    ctrl.find("span").html("更改");
                    ctrl.data("has", true);
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
        component._addEventListener({
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
                var condition;
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (pageNow < pageTotal) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow + 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(component._setListAppletMainData({
                                        data: ds,
                                        pageNow: pageNow + 1,
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
                        if (!$.isEmptyObject(component._UIDEFAULFS.modalCondition)) {
                            condition = JSON.stringify(component._UIDEFAULFS.modalCondition);
                        }
                        if (pageNow < pageTotal) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow + 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition ? condition : "",
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(component._setTableAppletMainData({
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
                        }
                        break;
                }
            }
        });
    },
    _enablePaginationPre: function () {
        component._addEventListener({
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
                        if (pageNow > 1) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow - 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(component._setListAppletMainData({
                                        data: ds,
                                        pageNow: pageNow - 1,
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
                        if (!$.isEmptyObject(component._UIDEFAULFS.modalCondition)) {
                            condition = JSON.stringify(component._UIDEFAULFS.modalCondition);
                        }
                        if (pageNow > 1) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow - 1,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                condition: condition ? condition : "",
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(component._setTableAppletMainData({
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
                        }
                        break;
                }
            }
        });
    },
    _enablePaginationClick: function () {
        component._addEventListener({
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
                var condition;
                var applet = me.data("applet");
                var type = me.data("type");
                switch (type) {
                    case "label":
                        if (pageNow > 0 && pageNow != pageCurrent && !(pageNow > pageTotal)) {
                            Iptools.uidataTool._getUserlistAppletData({
                                async: false,
                                view: Iptools.DEFAULTS.currentView,
                                appletId: applet,
                                pageNow: pageNow,
                                pageSize: Iptools.DEFAULTS.pageSize,
                                orderByColumn: null,
                                orderByAscDesc: null,
                            }, function (ds) {
                                if (ds.applet.type == "list") {
                                    container.html("");
                                    container.append(component._setListAppletMainData({
                                        data: ds,
                                        pageNow: pageNow,
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
                        if (!$.isEmptyObject(component._UIDEFAULFS.modalCondition)) {
                            condition = JSON.stringify(component._UIDEFAULFS.modalCondition);
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
                                    container.append(component._setTableAppletMainData({
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
                        }
                        break;
                }
                me.parent().find("input").val("");
                return false;
            }
        });
    },
    _spiltCalLink: function (options) {
        var res = [];
        while (options.str.indexOf("{") > -1) {
            var tstr = options.str.substring(options.str.indexOf("{") + 1);
            var kstr = tstr.substring(0, tstr.indexOf("}"));
            if (res.indexOf(kstr) == -1) {
                res.push(kstr);
            }
            options.str = tstr;
        }
        return res;
    },
    _getCalControlVal: function (options) {
        var targetObj = $("input[name='" + options.name + "']");
        if (!targetObj.length) {
            targetObj = $("select[name='" + options.name + "']");
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
            minHeight: 300,
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
                    component._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                },
            }
        });
    },
    _enableControlChangeData: function () {
        component._addEventListener({
            container: "body",
            type: "blur",
            target: ".control-normal-text",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var value;
                if ($(this).data("pick") == "1") {
                    value = $(this).data("key");
                } else {
                    value = $(this).val().trim();
                }
                var col = $(this).data("column");
                var sets = $(this).parents("form:first").attr("id");
                if (Iptools.Tool._checkNull(value)) {
                    component._UIDEFAULFS.DataCurrentSets[sets][col] = value;
                } else {
                    delete component._UIDEFAULFS.DataCurrentSets[sets][col];
                }
            }
        });
        component._addEventListener({
            container: "body",
            type: "change",
            target: ".control-normal-select",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var value = $(this).val();
                var col = $(this).data("column");
                var sets = $(this).parents("form:first").attr("id");
                component._UIDEFAULFS.DataCurrentSets[sets][col] = value;
            }
        });
        component._addEventListener({
            container: "body",
            type: "change",
            target: ".cr-group input",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var sets = $(this).parents("form:first").attr("id");
                var group = $(this).parents(".cr-group:first");
                var col = group.data("column");
                var value = "";
                var data = "";
                if (group.find("input[type=checkbox]").length) {
                    $.each(group.find("input[type=checkbox]:checked"), function (lkey, lobj) {
                        data += lobj.value + "|";
                    });
                    value = data;
                } else if (group.find("input[type=radio]").length) {
                    value = group.find("input[type=radio]:checked").val();
                }
                component._UIDEFAULFS.DataCurrentSets[sets][col] = value;
            }
        });
        component._addEventListener({
            container: "body",
            type: "blur",
            target: ".detailTextarea",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var value = $(this).val().trim();
                var col = $(this).data("column");
                var sets = $(this).parents("form:first").attr("id");
                component._UIDEFAULFS.DataCurrentSets[sets][col] = value;
            }
        });
        component._addEventListener({
            container: "body",
            type: "switchChange.bootstrapSwitch",
            target: ".switch-checkbox",
            event: function (event, state) {
                var value = state ? "1" : "0";
                var col = $(this).data("column");
                var sets = $(this).parents("form:first").attr("id");
                component._UIDEFAULFS.DataCurrentSets[sets][col] = value;
            }
        });
    },
};