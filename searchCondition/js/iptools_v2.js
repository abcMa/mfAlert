//Author :Ethan
//Created :2016-7-19
//use :iptools_v2

var Iptools = Iptools || {};
(function () {
    //defaultDataSet :combine function options
    Iptools.DEFAULTS = {
        pageSize: 8,
        blankReg: new RegExp(" ", "gm"),
        lineReg: new RegExp("-", "gm"),
        equalReg: new RegExp("=", "gm"),
        qouteReg: new RegExp("\"", "gm"),
        biggerReg: new RegExp(">", "gm"),
        smallerReg: new RegExp("<", "gm"),
        qoutorReg: new RegExp("\'", "gm"),
        percentReg: new RegExp("%", "gm"),
        enterReg: new RegExp("\n", "gm"),
        ajaxCount: 0,
        tokenRunning: true,
    };
    Iptools.plusAjaxCount = function () {
        parent.Iptools.Tool.plusAjaxCount();
    };
    Iptools.minusAjaxCount = function () {
        parent.Iptools.Tool.minusAjaxCount();
    };
    Iptools.setDefaults = function (options) {
        window.sessionStorage.setItem(options.key, options.value);
    };
    Iptools.getDefaults = function (options) {
        return window.sessionStorage.getItem(options.key);
    };
    Iptools.Start = function (options) {
        toolBase._init(options);
    };
    //set init configurations default values
    Iptools.InitSetting = {
        loadingCircle: false,
        checkSession: false,
        userInvironment: false,
    };
    //Tool Intervals
    Iptools.Intervals = {
        loadingCircle: null,
        toolSearch: null
    };
    //Json ajax Defaults Arguments
    Iptools.JsonDefaults = {
        async: true,
        url: "",
        data: {},
        success: null,
        error: null,
        ajaxCounting: true
    };
    Iptools.SetJsonDefaults = function () {
        Iptools.JsonDefaults = {
            async: true,
            url: "",
            data: {},
            success: null,
            error: null,
            ajaxCounting: false
        };
    };
    Iptools.NotifyDefaults = {
        icon: "icon-ok-circle",
        title: "title",
        message: "content",
        type: "info",
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "center"
        },
        offset: 15,
        spacing: 10,
        z_index: 1031,
        delay: 2000,
        animate: {
            enter: 'animated zoomIn',
            exit: 'animated zoomOut'
        },
    };
    //GET AJAX :ajaxCounting, async, url, data, success, error
    Iptools.GetJson = function (options) {
        if (!Iptools.DEFAULTS.tokenRunning) return $.Deferred();
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "GET",
            dataType: "JSON",
            url: (Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url),
            data: Iptools.JsonDefaults.data,
            cache: false,
        }).then(function (r) {
            if (r && r.retcode == "timeout") {
                if (Iptools.DEFAULTS.tokenRunning)
                    alert(r.retmsg);
                Iptools.DEFAULTS.tokenRunning = false;
                Iptools.Tool._logOut();
                return 0;
            } else return r;
        });
    };

    //Do AJAX :ajaxCounting, async, url, data, success, error,type
    Iptools.DoJson = function (options) {
        if (!Iptools.DEFAULTS.tokenRunning) return $.Deferred();
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: options.type,
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data
        }).then(function (r) {
            if (r && r.retcode == "timeout") {
                if (Iptools.DEFAULTS.tokenRunning)
                    alert(r.retmsg);
                Iptools.DEFAULTS.tokenRunning = false;
                Iptools.Tool._logOut();
                return 0;
            } else return r;
        });
    };

    //POST AJAX :ajaxCounting, async, url, data, success, error
    Iptools.PostJson = function (options) {
        if (!Iptools.DEFAULTS.tokenRunning) return $.Deferred();
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "POST",
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data
        }).then(function (r) {
            if (r && r.retcode == "timeout") {
                if (Iptools.DEFAULTS.tokenRunning)
                    alert(r.retmsg);
                Iptools.DEFAULTS.tokenRunning = false;
                Iptools.Tool._logOut();
                return 0;
            } else return r;
        });
    };

    //PUT AJAX :ajaxCounting, async, url, data, success, error
    Iptools.PutJson = function (options) {
        if (!Iptools.DEFAULTS.tokenRunning) return $.Deferred();
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "PUT",
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data
        }).then(function (r) {
            if (r && r.retcode == "timeout") {
                if (Iptools.DEFAULTS.tokenRunning)
                    alert(r.retmsg);
                Iptools.DEFAULTS.tokenRunning = false;
                Iptools.Tool._logOut();
                return 0;
            } else return r;
        });
    };

    //DELETE AJAX :ajaxCounting, async, url, data, success, error
    Iptools.DeleteJson = function (options) {
        if (!Iptools.DEFAULTS.tokenRunning) return $.Deferred();
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "DELETE",
            dataType: "JSON",
            url: (Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url),
            data: Iptools.JsonDefaults.data
        }).then(function (r) {
            if (r && r.retcode == "timeout") {
                if (Iptools.DEFAULTS.tokenRunning)
                    alert(r.retmsg);
                Iptools.DEFAULTS.tokenRunning = false;
                Iptools.Tool._logOut();
                return 0;
            } else return r;
        });
    };
    var toolBase = {
        _extend: function (object, options) {
            return $.extend(true, {}, object, options);
        },
        _transSession: function () {
            var extendObject = {
                domain: Iptools.getDefaults({ key: "domain" }),
                tenantId: Iptools.getDefaults({ key: "tenantId" }),
                userId: Iptools.getDefaults({ key: "userId" }),
                token: window.sessionStorage.getItem("token"),
                currentScreen: Iptools.getDefaults({ key: "currentScreen" }),
                currentView: Iptools.getDefaults({ key: "currentView" }),
                currentNewView: Iptools.getDefaults({ key: "currentNewView" }),
                currentViewName: Iptools.getDefaults({ key: "currentViewName" }),
                currentViewValue: Iptools.getDefaults({ key: "currentViewValue" }),
                currentViewApplet: Iptools.getDefaults({ key: "currentViewApplet" }),
                currentNewApplet: Iptools.getDefaults({ key: "currentNewApplet" }),
                currentViewAppletControl: Iptools.getDefaults({ key: "currentViewAppletControl" }),
                currentViewAppletControlName: Iptools.getDefaults({ key: "currentViewAppletControlName" }),
                currentViewAppletTitle: Iptools.getDefaults({ key: "currentViewAppletTitle" }),
            };
            Iptools.DEFAULTS = this._extend(Iptools.DEFAULTS, extendObject);
        },
        /**
            loadingCircle :switch status of loadingObj visible interval(auto true)
            checkSession :check current Session permissions(auto true)
            userInvironment :load personal info bar(auto true)
        **/
        _init: function (options) {
            this._transSession();
            this._setProperties(options);
            Iptools.InitSetting = this._extend(Iptools.InitSetting, options);
            if (Iptools.InitSetting.checkSession) {
                this._sessionCheck();
            }
            this._enableProto();
        },
        _setProperties: function (options) {
            var para = {
                async: false,
                type: "GET"
            };
            if (options && Iptools.Tool._checkNull(options.custmomizeUrl)) {
                para["url"] = options.custmomizeUrl;
            } else {
                para["url"] = "../Content/JS/properties.xml";
            }
            $.ajax(para).done(function (r) {
                Iptools.DEFAULTS.serviceUrl = $(r).find("Configs api service_url").text();
                Iptools.DEFAULTS.API_URL = $(r).find("Configs api url").text();
                Iptools.DEFAULTS.hostPath = "." + $(r).find("Configs root path").text();
                Iptools.DEFAULTS.wxhostPath = $(r).find("Configs root wxpath").text();
            });
        },
        _sessionCheck: function () {
            if (Iptools.DEFAULTS.token == null) {
                self.location = "http://" + Iptools.DEFAULTS.domain + Iptools.DEFAULTS.hostPath;
            } else if (Iptools.DEFAULTS.domain) {
                var options = {
                    url: "basic/tenants/getByDomain",
                    data: {
                        domain: window.location.host.split('.')[0]
                    }
                };
                Iptools.GetJson(options).done(function (r) {
                    if (r && r.companyInfo) {
                        document.title = r.companyInfo + "——工作台";
                    }
                });
            }
        },
        _search_replacement: function (obj) {
            return obj.replace(Iptools.DEFAULTS.qouteReg, '')
                .replace(Iptools.DEFAULTS.qoutorReg, '')
                .replace(Iptools.DEFAULTS.equalReg, '')
                .replace(Iptools.DEFAULTS.percentReg, '');
        },
        _blank_replacement: function (obj) {
            return obj.replace(Iptools.DEFAULTS.blankReg, '');
        },
        _enableProto: function () {
            //日期格式化
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
            };
            //获取某日期距当前日期的天数
            Date.prototype.diff = function (date) {
                return (this.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
            }
            //元素从height为0恢复为auto
            jQuery.fn.animateAuto = function (prop, speed, callback) {
                var elem, height, width;
                return this.each(function (i, el) {
                    el = jQuery(el), elem = el.clone().css({ "height": "auto", "width": "auto" }).appendTo("body");
                    height = elem.css("height"),
                        width = elem.css("width"),
                        elem.remove();

                    if (prop === "height")
                        el.animate({ "height": height }, speed, callback);
                    else if (prop === "width")
                        el.animate({ "width": width }, speed, callback);
                    else if (prop === "both")
                        el.animate({ "width": width, "height": height }, speed, callback);
                });
            };
            //数组去重
            Array.prototype.unique = function () {
                var res = [];
                var json = {};
                for (var i = 0; i < this.length; i++) {
                    if (!json[this[i]]) {
                        res.push(this[i]);
                        json[this[i]] = 1;
                    }
                }
                return res;
            }
            //数字自增动画
            jQuery.fn.zeroTonum = function (from, to, speed, suffix) {
                var zpromise = $.Deferred();
                var me = $(this);
                from = parseInt(from);
                to = parseInt(to);
                switch (speed) {
                    case "slow":
                        speed = 50;
                        break;
                    case "normal":
                    default:
                        speed = 20;
                        break;
                    case "fast":
                        speed = 10;
                        break;
                }
                suffix = Iptools.Tool._GetProperValue(suffix);
                if (from >= 0 && to && from != to) {
                    var cell = parseInt((to - from) / 100);
                    if (cell == 0) cell = 1;
                    var ztnListener = setInterval(function () {
                        me.html(from + suffix);
                        if (cell > 0) {
                            if (from < to) from += cell;
                            else {
                                from = to;
                                me.html(from + suffix);
                                clearInterval(ztnListener);
                                zpromise.resolve();
                            }
                        } else {
                            if (from > to) from += cell;
                            else {
                                from = to;
                                me.html(from + suffix);
                                clearInterval(ztnListener);
                                zpromise.resolve();
                            }
                        }
                    }, speed);
                } else {
                    me.html(to + suffix);
                }
                return zpromise;
            };
        },
    };

    /**
        ui element basic data solutions and funcions
    **/
    Iptools.uidataTool = {
        _getScreenMenu: function () {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "service/screenMenus",
                data: {
                    token: Iptools.DEFAULTS.token,
                    channel: "web"
                }
            }).done(function (r) {
                var ds = { screens: [] };
                $.each(r.screenMenusVO, function (key, obj) {
                    ds.screens.push({
                        id: obj.screen,
                        name: obj.displayName,
                        icon: obj.iconUrl,
                    });
                });
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getViews: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "service/screens",
                data: {
                    token: Iptools.DEFAULTS.token,
                    screenId: options.screen
                }
            }).done(function (r) {
                var ds = { views: [], screen: {} };
                $.each(r.views, function (key, obj) {
                    ds.views.push({
                        id: obj.uuid,
                        name: obj.name,
                        type: obj.viewType,
                        primary: obj.primaryApplet,
                        icon: obj.iconUrl
                    });
                });
                ds.screen = {
                    name: r.screen.name,
                    icon: r.screen.iconUrl,
                    defaultView: r.screen.defaultView
                };
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getView: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/views",
                data: {
                    token: Iptools.DEFAULTS.token,
                    viewId: options.view
                }
            }).done(function (r) {
                var ds = { view: {} };
                ds.view = {
                    name: r.view.name,
                    screen: r.view.screen,
                    type: r.view.viewType,
                    primary: r.view.primaryApplet,
                    icon: r.view.iconUrl,
                    url: r.view.url,
                };
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getApplets: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/views",
                data: {
                    token: Iptools.DEFAULTS.token,
                    viewId: options.view
                }
            }).done(function (r) {
                var ds = { applets: [] };
                $.each(r.applets, function (key, obj) {
                    ds.applets.push({
                        id: obj.uuid,
                        name: obj.displayName,
                        type: obj.appletType,
                        force: obj.isForceRelated,
                        approval: r.approvalId,
                    });
                });
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getApplet: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletConfig",
                data: {
                    token: Iptools.DEFAULTS.token,
                    viewId: Iptools.DEFAULTS.currentView,
                    appletId: options.applet
                }
            }).done(function (r) {
                if (r && r.retcode != "fail") {
                    var ds = { applet: {}, controls: [], columns: [] };
                    ds.applet = {
                        id: r.applet.uuid,
                        name: r.applet.name,
                        displayName: r.applet.displayName,
                        type: r.applet.appletType,
                        isShowNav: r.applet.isShowNav,
                        rootPickList: r.applet.navRootPickListId,
                        createApplet: r.applet.createApplet,
                        report: r.applet.report,
                        approval: r.applet.approvalId,
                        PBO: r.applet.relatedApplet1,
                        PAI: r.applet.iconUrl
                    };
                    if (r.controls && r.controls.length > 0) {
                        $.each(r.controls, function (key, obj) {
                            ds.controls.push({
                                id: obj.uuid,
                                type: obj.fieldType,
                                column: obj.columnName,
                                pickList: obj.pickList,
                                pickApplet: obj.pickApplet,
                                name: obj.displayName,
                                destinationView: obj.destinationView,
                                defaultValue: obj.defaultValue,
                                empty: obj.allowEmpty,
                                reg: obj.regularExpression,
                                regInfo: obj.regExpressHint,
                                modify: obj.allowUpdate,
                                insert: obj.allowInsert,
                                formula: obj.formular,
                                field: obj.field,
                                cascadeFields: obj.cascadeFields,
                                isCalControl: obj.isCalControl,
                                isNewLine: obj.isNewLine,
                                size: obj.controlSize,
                                readonly: obj.isReadonly
                            });
                        });
                    }
                    if (r.listColumns && r.listColumns.length > 0) {
                        $.each(r.listColumns, function (key, obj) {
                            ds.columns.push({
                                id: obj.uuid,
                                allowOutterQuery: obj.allowOutterQuery,
                                allowInnerQuery: obj.allowInnerQuery,
                                innerQueryFormula: obj.innerQueryFormula,
                                allowOrderBy: obj.allowOrderBy,
                                pickFlag: obj.pickFlag,
                                type: obj.listColumnType,
                                searchType: obj.columnSearchType,
                                column: obj.columnName,
                                pickListId: obj.pickListId,
                                pickList: obj.pickList,
                                name: obj.displayName,
                                pickApplet: obj.pickApplet,
                                destinationView: obj.destinationView,
                                hrefText: obj.destinationViewHrefText
                            });
                        });
                    }
                    ds.rootBc = r.rootBcId;
                    ds.rootLink = r.rootAliasName;
                    ipromise.resolve(ds);
                } else {
                    ipromise.reject();
                }
            });
            return ipromise;
        },
        _getUserlistAppletData: function (options) {
            var ipromise = $.Deferred();
            var data = {
                token: Iptools.DEFAULTS.token,
                viewId: options.view,
                appletId: options.appletId,
                pageNow: options.pageNow,
                pageSize: options.pageSize,
            };
            if (options.noUser) {
                delete data["userId"];
            }
            if (Iptools.Tool._checkNull(options.valueId)) {
                data["valueId"] = options.valueId;
            }
            if (Iptools.Tool._checkNull(options.condition)) {
                data["condition"] = options.condition;
            }
            if (Iptools.Tool._checkNull(options.orderByColumn)) {
                data["orderByColumn"] = options.orderByColumn;
            }
            if (Iptools.Tool._checkNull(options.orderByAscDesc)) {
                data["orderByAscDesc"] = options.orderByAscDesc;
            }
            Iptools.GetJson({
                async: options.async == false ? false : true,
                url: "service/appletDataGetList",
                data: data
            }).done(function (r) {
                if (r && r.retcode != "fail") {
                    var ds = { columns: [], data: {}, applet: {} };
                    $.each(r.listColumns, function (key, obj) {
                        ds.columns.push({
                            allowOutterQuery: obj.allowOutterQuery,
                            allowOrderBy: obj.allowOrderBy,
                            pickFlag: obj.pickFlag,
                            type: obj.listColumnType,
                            searchType: obj.columnSearchType,
                            column: obj.columnName,
                            pickListId: obj.pickListId,
                            pickList: obj.pickList,
                            name: obj.displayName,
                            pickApplet: obj.pickApplet,
                            destinationView: obj.destinationView,
                            hrefText: obj.destinationViewHrefText
                        });
                    });
                    ds.rootBc = r.rootBcId;
                    ds.rootLink = r.rootAliasName;
                    ds.data = r.listData;
                    ds.applet = {
                        id: r.applet.uuid,
                        name: r.applet.name,
                        displayName: r.applet.displayName,
                        type: r.applet.appletType,
                        isDetailView: r.applet.isDetailView,
                        detailViewId: r.applet.detailViewId,
                        detailColumnName: r.applet.detailViewColumnName,
                        detailHrefText: r.applet.detailViewHrefText,
                        createApplet: r.applet.createApplet,
                        isShowNav: r.applet.isShowNav,
                        rootPickList: r.applet.navRootPickListId,
                        approval: r.approvalId,
                        PBO: r.applet.relatedApplet1,
                        PAI: r.applet.iconUrl
                    };
                    ipromise.resolve(ds);
                } else {
                    ipromise.reject();
                }
            });
            return ipromise;
        },
        _getUserDetailAppletData: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
            	async: options.async == false ? false : true,
                url: "service/appletDataGetDetail",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: options.appletId,
                    valueId: options.valueId
                }
            }).done(function (r) {
                var ds = { controls: [], data: {}, applet: {} };
                $.each(r.controls, function (key, obj) {
                    ds.controls.push({
                        id: obj.uuid,
                        type: obj.fieldType,
                        column: obj.columnName,
                        pickList: obj.pickList,
                        pickApplet: obj.pickApplet,
                        detailApplet: obj.detailApplet,
                        name: obj.displayName,
                        destinationView: obj.destinationView,
                        defaultValue: obj.defaultValue,
                        empty: obj.allowEmpty,
                        reg: obj.regularExpression,
                        regInfo: obj.regExpressHint,
                        modify: obj.allowUpdate,
                        insert: obj.allowInsert,
                        formula: obj.formular,
                        field: obj.field,
                        cascadeFields: obj.cascadeFields,
                        isCalControl: obj.isCalControl,
                        isNewLine: obj.isNewLine,
                        size: obj.controlSize,
                        readonly: obj.isReadonly
                    });
                });
                ds.data = r.detailData;
                ds.rootLink = r.rootAliasName;
                ds.applet = {
                    id: r.applet.uuid,
                    name: r.applet.name,
                    displayName: r.applet.displayName,
                    type: r.applet.appletType,
                    approval: r.approvalId,
                    PBO: r.applet.pbo,
                    PAO: r.applet.pao
                }
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getAppletButtons: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "basic/appletButtons",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: options.applet,
                }
            }).done(function (r) {
                var ds = { buttons: [] };
                $.each(r, function (key, obj) {
                    ds.buttons.push({
                        type: obj.name,
                        name: obj.title,
                        createApplet: obj.createApplet,
                        createView: obj.createView
                    });
                });
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getAppletLinks: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "basic/links_field_query",
                data: {
                    token: Iptools.DEFAULTS.token,
                    parentBCId: options.pbc,
                    childBCId: options.cbc,
                }
            }).done(function (r) {
                var ds = { destinationFields: [], displayNames: [] };
                ds.destinationFields = r.destinationFields;
                ds.displayNames = r.displayNames;
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getFiledLinks: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "basic/links_query",
                data: {
                    token: Iptools.DEFAULTS.token,
                    destFieldId: options.field,
                    childBcId: options.cbc,
                }
            }).done(function (r) {
                var ds = [];
                if (r) {
                    ds = r;
                }
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getRelatedControlValues: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "service/appletFKDetail",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: options.applet,
                    controlId: options.control,
                    valueId: options.valueId,
                }
            }).done(function (r) {
                if (r && r.detailData) {
                    ipromise.resolve(r.detailData);
                }
            });
            return ipromise;
        },
        _addAppletData: function (options) {
            var ipromise = $.Deferred();
            Iptools.PostJson({
                url: "service/appletData",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: options.appletId,
                    fieldData: options.data,
                }
            }).done(function (r) {
                ipromise.resolve(r);
            }).fail(function (r) {
                ipromise.reject(r);
            });
            return ipromise;
        },
        _addGroupAppletData: function (options) {
            var ipromise = $.Deferred();
            Iptools.PostJson({
                url: "service/appletDataInsertBatch",
                data: {
                    token: Iptools.DEFAULTS.token,
                    viewId: Iptools.DEFAULTS.currentNewView,
                    parentAppletData: JSON.stringify(options.data),
                    childAppletData: JSON.stringify(options.cdata.New),
                }
            }).done(function (r) {
                ipromise.resolve(r);
            }).fail(function (r) {
                ipromise.reject(r);
            });
            return ipromise;
        },
        _saveAppletData: function (options) {
            var ipromise = $.Deferred();
            Iptools.PutJson({
                url: "service/appletData",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: options.appletId,
                    valueId: options.valueId,
                    fieldData: options.data
                }
            }).done(function (r) {
                ipromise.resolve(r);
            }).fail(function (r) {
                ipromise.reject(r);
            });
            return ipromise;
        },
        _saveGroupAppletData: function (options) {
            var ipromise = $.Deferred();
            Iptools.PostJson({
                url: "service/appletDataUpdateBatch",
                data: {
                    token: Iptools.DEFAULTS.token,
                    viewId: Iptools.DEFAULTS.currentView,
                    valueId: options.valueId,
                    parentAppletUpdate: JSON.stringify(options.data),
                    childAppletInsert: JSON.stringify(options.cdata.New),
                    childAppletUpdate: JSON.stringify(options.cdata.Update),
                    childAppletDelete: JSON.stringify(options.cdata.Delete),
                }
            }).done(function (r) {
                ipromise.resolve(r);
            }).fail(function (r) {
                ipromise.reject(r);
            });
            return ipromise;
        },
        _deleteAppletData: function (options) {
            var ipromise = $.Deferred();
            Iptools.DeleteJson({
                url: "service/delAppletDataByIds" + options.para,
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: options.appletId,
                    valueIds: options.valueIds
                }
            }).done(function (r) {
                ipromise.resolve(r);
            }).fail(function (r) {
                ipromise.reject(r);
            });
            return ipromise;
        },
        _uploadCanvasData: function (options) {
            var blob = Iptools.Tool._dataURLtoBlob(options.canvas);
            var paraData = new FormData();
            paraData.append("file", blob);
            return $.ajax({
                async: options.async == true ? true : false,
                url: (Iptools.DEFAULTS.API_URL + "basic/file/uploadpic?token=" + Iptools.DEFAULTS.token + "&type=" + options.type),
                type: "POST",
                data: paraData,
                processData: false,
                contentType: false
            });
        },
        _uploadfileData: function (options) {
            return $.ajax({
                async: options.async == true ? true : false,
                url: (Iptools.DEFAULTS.API_URL + "basic/file/uploadpic?token=" + Iptools.DEFAULTS.token + "&type=" + options.type),
                type: "POST",
                data: options.data,
                processData: false,
                contentType: false
            });
        },
        _getCustomizeView: function (options) {
            var ipromise = $.Deferred();
            var ds = { views: [] };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "basic/customizeViewsByNameList",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    nameList: options.nameList,
                }
            }).done(function (r) {
                if (r) {
                    $.each(r, function (key, obj) {
                        ds.views.push({
                            view: obj.viewId,
                            name: obj.name,
                            description: obj.description,
                        });
                    });
                }
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getCustomizeApplet: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "basic/customizeApplets",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    nameList: options.nameList,
                }
            }).done(function (r) {
                var ds = { applets: [] };
                if (r) {
                    $.each(r, function (key, obj) {
                        ds.applets.push({
                            applet: obj.appletId,
                            name: obj.name,
                            description: obj.description,
                            report: obj.report
                        });
                    });
                }
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getDetectTree: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "basic/pickItems/treeview",
                data: {
                    token: Iptools.DEFAULTS.token,
                    pickListId: options.pickListId,
                }
            }).done(function (r) {
                var ds = [];
                if (r && r.length) {
                    ds = Iptools.uidataTool._setDetectTreeData({
                        data: r,
                        panelListener: options.panelListener,
                        submitListener: options.submitListener,
                    });
                }
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _setDetectTreeData: function (options) {
            var result = [];
            for (var i = 0; i < options.data.length; i++) {
                var node = {
                    id: options.data[i].id,
                    text: options.data[i].value,
                    key: options.data[i].key,
                    pickList: options.data[i].pickList,
                    panelListener: options.panelListener,
                    submitListener: options.submitListener,
                }
                if (Iptools.getDefaults({ key: "currentViewDetectValue" }) == node.id) {
                    node["state"] = {
                        selected: true,
                    };
                    widget._UIDEFAULFS.detectCondition = eval("(" + Iptools.getDefaults({ key: "currentViewCondition" }) + ")");
                }
                if (options.data[i].children && options.data[i].children.length) {
                    node.nodes = Iptools.uidataTool._setDetectTreeData({
                        data: options.data[i].children,
                        panelListener: options.panelListener,
                        submitListener: options.submitListener,
                    });
                }
                result.push(node);
            }
            return result;
        },
        _getContactTags: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "basic/contactTagLink_paging",
                data: {
                    token: Iptools.DEFAULTS.token,
                    contactId: options.contact,
                    pageNow: 1,
                    pagesize: 3,
                }
            }).done(function (r) {
                var ds = [];
                if (r && r.records && r.records.length) {
                    $.each(r.records, function (key, obj) {
                        ds.push({
                            phone: obj.phone,
                            tag: obj.tagValue,
                            createTime: obj.createTime
                        });
                    });
                }
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _buildReport: function (options) {
            var ipromise = $.Deferred();
            Iptools.uidataTool._getApplet({
                applet: options.applet
            }).done(function (rs) {
                var ds = rs;
                if (ds && ds.applet.type == "report") {
                    var para = {
                        token: Iptools.DEFAULTS.token,
                        reportId: ds.applet.report,
                    };
                    if (Iptools.Tool._checkNull(options.date)) {
                        para["reportDate"] = options.date;
                    }
                    if (Iptools.Tool._checkNull(options.viewId)) {
                        para["viewId"] = options.viewId;
                    }
                    if (Iptools.Tool._checkNull(options.valueId)) {
                        para["valueId"] = options.valueId;
                    }
                    if (Iptools.Tool._checkNull(options.timeType)) {
                        para["xTimeType"] = options.timeType;
                    }
                    if (Iptools.Tool._checkNull(options.condition)) {
                        para["condition"] = options.condition;
                    }
                    Iptools.GetJson({
                        async: false,
                        url: "service/report",
                        data: para
                    }).done(function (r) {
                        if (r && r.retcode != "fail") {
                            var result = { categories: [], series: [] };
                            var report = r;
                            if (!$.isEmptyObject(report)) {
                                var reportBody = {};
                                reportBody.chart = { type: report.report.type };
                                if (Iptools.Tool._checkNull(report.report.chartTheme) && hcThemes) {
                                    hcThemes.changeTheme({
                                        type: report.report.chartTheme
                                    });
                                }
                                if (report.report.is3dEnabled) {
                                    reportBody.chart.options3d = { enabled: true, alpha: report.report.alpha3d, beta: 0 };
                                }
                                if (Iptools.Tool._checkNull(report.report.legendAlign)) {
                                    reportBody.legend = { layout: "vertical" };
                                    reportBody.legend.align = report.report.legendAlign;
                                }
                                if (Iptools.Tool._checkNull(report.report.legendVerticalAlign)) {
                                    reportBody.legend.verticalAlign = report.report.legendVerticalAlign;
                                }
                                if (!report.report.isLegendShow) {
                                    reportBody.legend = { enabled: false };
                                }
                                if (Iptools.Tool._checkNull(report.report.title)) {
                                    reportBody.title = { text: report.report.title };
                                } else {
                                    reportBody.title = { text: null };
                                }
                                if (Iptools.Tool._checkNull(report.report.subTitle)) {
                                    reportBody.subtitle = { text: report.report.subTitle };
                                }
                                if (Iptools.Tool._checkNull(report.report.yAxisTitle)) {
                                    reportBody.yAxis = { title: { text: report.report.yAxisTitle } };
                                }
                                var i, sdata, sjson, index;
                                if (report.report.xAxisType == "group") {
                                    switch (report.report.type) {
                                        case "line":
                                        case "spline":
                                        case "column":
                                        case "bar":
                                            reportBody.plotOptions = { series: {} };
                                            if (Iptools.Tool._checkNull(report.report.plotColor)) {
                                                reportBody.plotOptions.series.color = report.report.plotColor;
                                            }
                                            if (Iptools.Tool._checkNull(report.report.seriesIsMultiColor) && report.report.seriesIsMultiColor) {
                                                reportBody.plotOptions.series.colorByPoint = true;
                                            }
                                            if (Iptools.Tool._checkNull(report.report.seriesLineWidth)) {
                                                reportBody.plotOptions.series.pointWidth = report.report.seriesLineWidth;
                                            }
                                            if (report.categories && report.categories.length) {
                                                reportBody.xAxis = { categories: report.categories };
                                                result.categories = report.categories;
                                            }
                                            reportBody.series = [];
                                            if (report.series && report.series.length) {
                                                for (i = 0; i < report.series.length; i++) {
                                                    sdata = report.series[i];
                                                    sjson = { name: (Iptools.Tool._checkNull(sdata.name) ? sdata.name : "未分类"), data: [] };
                                                    $.each(report.categories, function (key, obj) {
                                                        index = $.inArray(obj, sdata.categories);
                                                        if (index < 0) {
                                                            sjson.data.push(0);
                                                        } else {
                                                            sjson.data.push(parseInt(sdata.data[index]));
                                                        }
                                                    });
                                                    reportBody.series.push(sjson);
                                                }
                                                result.series = report.series;
                                            }
                                            if (options.showReport) {
                                                $("#" + options.container).highcharts(reportBody);
                                            }
                                            break;
                                        case "pie":
                                            reportBody.plotOptions = {
                                                pie: {
                                                    allowPointSelect: true,
                                                    cursor: 'pointer',
                                                    innerSize: 60,
                                                    dataLabels: {
                                                        enabled: true
                                                    },
                                                }
                                            };
                                            if (report.report.is3dEnabled) {
                                                reportBody.plotOptions.pie.depth = 35;
                                            }
                                            reportBody.tooltip = {
                                                pointFormat: '{series.name}: {point.y}[占比<b>{point.percentage:.1f}%</b>]'
                                            };
                                            if (Iptools.Tool._checkNull(report.report.isLegendShow)) {
                                                reportBody.plotOptions.pie.dataLabels.enabled = false;
                                                reportBody.plotOptions.pie.showInLegend = true;
                                            }
                                            reportBody.series = [];
                                            if (report.series && report.series.length) {
                                                for (i = 0; i < report.series.length; i++) {
                                                    sdata = report.series[i];
                                                    sjson = {
                                                        type: "pie",
                                                        name: (Iptools.Tool._checkNull(sdata.name) ? sdata.name : "未分类"),
                                                        data: []
                                                    };
                                                    var showFlag = true;
                                                    $.each(report.categories, function (key, obj) {
                                                        index = $.inArray(obj, sdata.categories);
                                                        var pieData = [];
                                                        if (index < 0) {
                                                            pieData.push(obj, 0);
                                                            sjson.data.push(pieData);
                                                        } else {
                                                            if (showFlag) {
                                                                pieData = {
                                                                    name: (obj == "" ? "[空]" : obj),
                                                                    y: parseInt(sdata.data[index]),
                                                                    sliced: true,
                                                                    selected: true
                                                                };
                                                                showFlag = false;
                                                            } else {
                                                                pieData.push(
                                                                    (obj == "" ? "[空]" : obj),
                                                                    parseInt(sdata.data[index]));
                                                            }
                                                            sjson.data.push(pieData);
                                                        }
                                                    });
                                                    reportBody.series.push(sjson);
                                                }
                                                result.series = report.series;
                                            }
                                            if (options.showReport) {
                                                $("#" + options.container).highcharts(reportBody);
                                            }
                                            break;
                                    }
                                } else if (report.report.xAxisType == "time") {
                                    switch (report.report.type) {
                                        case "line":
                                        case "spline":
                                        case "column":
                                        case "bar":
                                            reportBody.plotOptions = { series: {} };
                                            if (Iptools.Tool._checkNull(report.report.plotColor)) {
                                                reportBody.plotOptions.series.color = report.report.plotColor;
                                            }
                                            if (Iptools.Tool._checkNull(report.report.seriesIsMultiColor) && report.report.seriesIsMultiColor) {
                                                reportBody.plotOptions.series.colorByPoint = true;
                                            }
                                            if (Iptools.Tool._checkNull(report.report.seriesLineWidth)) {
                                                reportBody.plotOptions.series.pointWidth = report.report.seriesLineWidth;
                                            }
                                            if (report.categories && report.categories.length) {
                                                reportBody.xAxis = {
                                                    type: "datetime",
                                                };
                                                switch (options.timeType) {
                                                    case "day":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            hour: "%H",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.x:%H:%M}: {point.y}'
                                                        };
                                                        break;
                                                    case "week":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            day: "%A",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.x:%A}: {point.y}'
                                                        };
                                                        break;
                                                    case "month":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            day: "%b%e日",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.x:%b%e日}: {point.y}'
                                                        };
                                                        break;
                                                    case "year":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            month: "%Y年%b",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.x:%Y年%b}: {point.y}'
                                                        };
                                                        break;
                                                }
                                            }
                                            reportBody.series = [];
                                            if (report.series && report.series.length) {
                                                for (i = 0; i < report.series.length; i++) {
                                                    sdata = report.series[i];
                                                    sjson = { name: (Iptools.Tool._checkNull(sdata.name) ? sdata.name : "未分类"), data: [] };
                                                    $.each(sdata.categories, function (key, obj) {
                                                        var ptData = [];
                                                        switch (options.timeType) {
                                                            case "day":
                                                                if (options.date.length < 8) break;
                                                                ptData.push(
                                                                    Date.UTC(
                                                                        parseInt(options.date.substr(0, 4)),
                                                                        parseInt(options.date.substr(4, 2) - 1),
                                                                        parseInt(options.date.substr(6, 2)),
                                                                        parseInt(obj)
                                                                    ),
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                            case "week":
                                                                ptData.push(
                                                                    Date.UTC(
                                                                        parseInt(obj.substr(0, 4)),
                                                                        parseInt(obj.substr(4, 2) - 1),
                                                                        parseInt(obj.substr(6, 2))
                                                                    ),
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                            case "month":
                                                                ptData.push(
                                                                    Date.UTC(
                                                                        parseInt(obj.substr(0, 4)),
                                                                        parseInt(obj.substr(4, 2) - 1),
                                                                        parseInt(obj.substr(6, 2))
                                                                    ),
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                            case "year":
                                                                ptData.push(
                                                                    Date.UTC(
                                                                        parseInt(obj.substr(0, 4)),
                                                                        parseInt(obj.substr(4, 2) - 1)
                                                                    ),
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                        }
                                                        sjson.data.push(ptData);
                                                    });
                                                    reportBody.series.push(sjson);
                                                }
                                                result.series = report.series;
                                            }
                                            if (options.showReport) {
                                                $("#" + options.container).highcharts(reportBody);
                                            }
                                            break;
                                        case "pie":
                                            reportBody.plotOptions = {
                                                pie: {
                                                    allowPointSelect: true,
                                                    cursor: 'pointer',
                                                    innerSize: 60,
                                                    dataLabels: {
                                                        enabled: true
                                                    },
                                                }
                                            };
                                            if (report.report.is3dEnabled) {
                                                reportBody.plotOptions.pie.depth = 35;
                                            }
                                            if (Iptools.Tool._checkNull(report.report.isLegendShow)) {
                                                reportBody.plotOptions.pie.dataLabels.enabled = false;
                                                reportBody.plotOptions.pie.showInLegend = true;
                                            }
                                            if (report.categories && report.categories.length) {
                                                reportBody.xAxis = {
                                                    type: "datetime",
                                                };
                                                switch (options.timeType) {
                                                    case "day":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            hour: "%H",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.y}[占比<b>{point.percentage:.1f}%</b>]'
                                                        };
                                                        break;
                                                    case "week":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            day: "%A",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.y}[占比<b>{point.percentage:.1f}%</b>]'
                                                        };
                                                        break;
                                                    case "month":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            day: "%b%e日",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.y}[占比<b>{point.percentage:.1f}%</b>]'
                                                        };
                                                        break;
                                                    case "year":
                                                        reportBody.xAxis.dateTimeLabelFormats = {
                                                            month: "%Y年%b",
                                                        }
                                                        reportBody.tooltip = {
                                                            headerFormat: '<b>{series.name}</b><br>',
                                                            pointFormat: '{point.y}[占比<b>{point.percentage:.1f}%</b>]'
                                                        };
                                                        break;
                                                }
                                            }
                                            reportBody.series = [];
                                            if (report.series && report.series.length) {
                                                for (i = 0; i < report.series.length; i++) {
                                                    sdata = report.series[i];
                                                    sjson = { name: (Iptools.Tool._checkNull(sdata.name) ? sdata.name : "未分类"), data: [] };
                                                    $.each(sdata.categories, function (key, obj) {
                                                        var tData = [];
                                                        switch (options.timeType) {
                                                            case "day":
                                                                if (options.date.length < 8) break;
                                                                tData.push(
                                                                    obj + ":00",
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                            case "week":
                                                                var week = (new Date(obj.substr(0, 4) + "-" +
                                                                        obj.substr(4, 2) + "-" +
                                                                        obj.substr(6, 2)
                                                                )).getDay();
                                                                if (week == 0) week = "日";
                                                                tData.push(
                                                                    "星期" + week,
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                            case "month":
                                                                tData.push(
                                                                    (new Date(obj.substr(0, 4) + "-" +
                                                                        obj.substr(4, 2) + "-" +
                                                                        obj.substr(6, 2)
                                                                    )).format("yyyy-MM-dd"),
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                            case "year":
                                                                tData.push(
                                                                    (new Date(obj.substr(0, 4) + "-" +
                                                                       obj.substr(4, 2)
                                                                    )).format("yyyy-MM"),
                                                                    parseInt(sdata.data[key])
                                                                );
                                                                break;
                                                        }
                                                        sjson.data.push(tData);
                                                    });
                                                    reportBody.series.push(sjson);
                                                }
                                                result.series = report.series;
                                            }
                                            if (options.showReport) {
                                                $("#" + options.container).highcharts(reportBody);
                                            }
                                            break;
                                    }
                                }
                            }
                            ipromise.resolve(result);
                        }
                    });
                }
            });
            return ipromise;
        },
    };


    /**
        ui element basic data solutions and funcions
    **/
    Iptools.Tool = {
        Alert: function (options) {
            options = Iptools.Tool._extend(Iptools.NotifyDefaults, options);
            switch (options.type) {
                case "info":
                    options.icon = "icon-info-sign";
                    break;
                case "danger":
                    options.icon = "icon-exclamation-sign";
                    break;
                case "success":
                    options.icon = "icon-ok-sign";
                    break;
                case "warning":
                    options.icon = "icon-question-sign";
                    break;
            }
            $.notify({
                icon: options.icon,
                title: options.title,
                message: options.content,
            }, {
                type: options.type,
                allow_dismiss: options.allow_dismiss,
                placement: options.placement,
                offset: options.offset,
                spacing: options.spacing,
                z_index: options.z_index,
                delay: options.delay,
                animate: options.animate,
            });
        },
        pAlert: function (options) {
            parent.Iptools.Tool.Alert(options);
        },
        _extend: function (object, options) {
            return $.extend(true, {}, object, options);
        },
        _search_replacement: function (obj) {
            return obj.replace(Iptools.DEFAULTS.qouteReg, '')
                .replace(Iptools.DEFAULTS.qoutorReg, '')
                .replace(Iptools.DEFAULTS.equalReg, '')
                .replace(Iptools.DEFAULTS.percentReg, '');
        },
        _blank_replacement: function (obj) {
            return obj.replace(Iptools.DEFAULTS.blankReg, '');
        },
        _dataURLtoBlob: function (canvas) {
            var arr = canvas.toDataURL("image/png").split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8Arr = new Uint8Array(n);
            while (n--) {
                u8Arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8Arr], { type: mime });
        },
        //
        _checkNull: function (obj) {
            if (obj == null || obj == "NULL" || obj == "null" || obj == "undefined" || obj == "") {
                obj = false;
            } else {
                obj = true;
            }
            return obj;
        },
        _newView: function (options) {
            parent.Iptools.Tool._initNewView(options);
        },
        _groupNewView: function (options) {
            parent.Iptools.Tool._groupNewView(options);
        },
        _initClientHeight: function () {
            parent.Iptools.Tool.FrameHeight({ height: $("body")[0].scrollHeight });
        },
        _redirectToParent: function () {
            parent.Iptools.Tool._redirectToParent();
        },
        _jumpView: function (options, beforeLoad, afterLoad, onLoad) {
            parent.Iptools.Tool._jumpView(options, beforeLoad, afterLoad, onLoad);
        },
        _redirectView: function (options) {
            parent.Iptools.Tool._redirectView(options);
        },
        _reFreshView: function (options) {
            parent.Iptools.Tool._reFreshView(options);
        },
        _parentClick: function () {
            parent.Iptools.Tool._parentClick();
        },
        _coverWindowShow: function () {
            parent.Iptools.Tool._coverWindowShow();
        },
        _coverWindowHide: function () {
            parent.Iptools.Tool._coverWindowHide();
        },
        _setBreadCondition: function (options) {
            parent.Iptools.Tool._setBreadCondition(options);
        },
        _setBreadDetectValue: function (options) {
            parent.Iptools.Tool._setBreadDetectValue(options);
        },
        _setUserInfo: function () {
            parent.Iptools.Tool.setUserInfo();
        },
        _setTabData: function (options) {
            parent.Iptools.Tool._setTabData(options);
        },
        _getTabData: function (options) {
            return parent.Iptools.Tool._getTabData(options);
        },
        _CloseTab: function (options, beforeLoad, afterLoad) {
            parent.Iptools.Tool._CloseTab(options, beforeLoad, afterLoad);
        },
        _getVersion: function () {
            return parent.Iptools.Tool._getVersion();
        },
        _logOut: function () {
            parent.Iptools.Tool._logOut();
        },
        _refreshWindow: function () {
            parent.Iptools.Tool._refreshWindow();
        },
        _GetProperValue: function (value) {
            return Iptools.Tool._checkNull(value) ? value : "";
        },
        _scrollToTop: function () {
            parent.Iptools.Tool._scrollToTop();
        },
    };
})();