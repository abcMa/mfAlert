//Author :Ethan
//Created :2016-7-19
//use :iptools

var Iptools = Iptools || {};
(function () {
    //defaultDataSet :combine function options
    Iptools.DEFAULTS = {
        loadingObj: "loadingDiv",
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
        icon: "icon-cogs",
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
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        if (Iptools.JsonDefaults.ajaxCounting) {
            Iptools.plusAjaxCount();
        };
        $.ajax({
            async: Iptools.JsonDefaults.async,
            type: "GET",
            dataType: "JSON",
            url: (Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url),
            data: Iptools.JsonDefaults.data,
            cache: false,
            error: function (r) {
                if (Iptools.JsonDefaults.error) {
                    Iptools.JsonDefaults.error(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            },
            success: function (r) {
                if (Iptools.JsonDefaults.success) {
                    Iptools.JsonDefaults.success(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            }
        });
    };

    //Do AJAX :ajaxCounting, async, url, data, success, error,type
    Iptools.DoJson = function (options) {
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        if (Iptools.JsonDefaults.ajaxCounting) {
            Iptools.plusAjaxCount();
        };
        $.ajax({
            async: false,
            type: options.type,
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data,
            error: function (r) {
                if (Iptools.JsonDefaults.error) {
                    Iptools.JsonDefaults.error(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            },
            success: function (r) {
                if (Iptools.JsonDefaults.success) {
                    Iptools.JsonDefaults.success(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            }
        });
    };

    //POST AJAX :ajaxCounting, async, url, data, success, error
    Iptools.PostJson = function (options) {
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        if (Iptools.JsonDefaults.ajaxCounting) {
            Iptools.plusAjaxCount();
        };
        $.ajax({
            async: false,
            type: "POST",
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data,
            error: function (r) {
                if (Iptools.JsonDefaults.error) {
                    Iptools.JsonDefaults.error(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            },
            success: function (r) {
                if (Iptools.JsonDefaults.success) {
                    Iptools.JsonDefaults.success(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            }
        });
    };

    //PUT AJAX :ajaxCounting, async, url, data, success, error
    Iptools.PutJson = function (options) {
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        if (Iptools.JsonDefaults.ajaxCounting) {
            Iptools.plusAjaxCount();
        };
        $.ajax({
            async: false,
            type: "PUT",
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data,
            error: function (r) {
                if (Iptools.JsonDefaults.error) {
                    Iptools.JsonDefaults.error(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            },
            success: function (r) {
                if (Iptools.JsonDefaults.success) {
                    Iptools.JsonDefaults.success(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            }
        });
    };

    //DELETE AJAX :ajaxCounting, async, url, data, success, error
    Iptools.DeleteJson = function (options) {
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        if (Iptools.JsonDefaults.ajaxCounting) {
            Iptools.plusAjaxCount();
        };
        $.ajax({
            async: false,
            type: "DELETE",
            dataType: "JSON",
            url: (Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url),
            data: Iptools.JsonDefaults.data,
            error: function (r) {
                if (Iptools.JsonDefaults.error) {
                    Iptools.JsonDefaults.error(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            },
            success: function (r) {
                if (Iptools.JsonDefaults.success) {
                    Iptools.JsonDefaults.success(r);
                    if (Iptools.JsonDefaults.ajaxCounting) {
                        Iptools.minusAjaxCount();
                    }
                }
            }
        });
    };
    var toolBase = {
        _extend: function (object, options) {
            return $.extend(true, object, options);
        },
        _transSession: function () {
            var extendObject = {
                domain: Iptools.getDefaults({ key: "domain" }),
                tenantId: Iptools.getDefaults({ key: "tenantId" }),
                userId: Iptools.getDefaults({ key: "userId" }),
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
            if (Iptools.InitSetting.userInvironment) {
                this._setUserInvironment();
            }
            this._enableDateFormatProto();
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
            });
        },
        _sessionCheck: function () {
            if (Iptools.DEFAULTS.tenantId == null || Iptools.DEFAULTS.userId == null) {
                self.location = "http://" + Iptools.DEFAULTS.domain + Iptools.DEFAULTS.hostPath;
            } else if (Iptools.DEFAULTS.domain) {
                var options = {
                    ajaxCounting: false,
                    async: true,
                    url: "basic/tenants/getByDomain",
                    data: {
                        domain: window.location.host.split('.')[0]
                    },
                    success: function (r) {
                        if (r && r.companyInfo) {
                            document.title = r.shortName + "——工作台";
                        }
                    }
                };
                Iptools.GetJson(options);
            }
        },
        _setUserInvironment: function () {
            var options = {
                async: false,
                url: "basic/employees/" + Iptools.DEFAULTS.userId,
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId
                },
                success: function (r) {
                    if ($("#application_user").length) {
                        $("#application_user").text(r.name);
                        $("#application_user")
                            .parent()
                            .find('img')
                            .attr("src", (r.headPic ? r.headPic : "../Content/Image/defaultHead.png"));
                    }
                }
            };
            Iptools.GetJson(options);
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
    };

    /**
        ui element basic data solutions and funcions
    **/
    Iptools.uidataTool = {
        _getScreenMenu: function (event) {
            var ds = { screens: [] };
            Iptools.GetJson({
                url: "service/screenMenus",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    channel: "web"
                },
                success: function (r) {
                    $.each(r.screenMenusVO, function (key, obj) {
                        ds.screens.push({
                            id: obj.screen,
                            name: obj.displayName,
                            icon: obj.iconUrl,
                        });
                    });
                    event(ds);
                }
            });
        },
        _getViews: function (options, event) {
            var ds = { views: [], screen: {} };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/screens",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    screenId: options.screen
                },
                success: function (r) {
                    $.each(r.views, function (key, obj) {
                        ds.views.push({
                            id: obj.id,
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
                    event(ds);
                }
            });
        },
        _getView: function (options, event) {
            var ds = { view: {} };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/views",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    viewId: options.view
                },
                success: function (r) {
                    ds.view = {
                        name: r.view.name,
                        screen: r.view.screen,
                        type: r.view.viewType,
                        primary: r.view.primaryApplet,
                        icon: r.view.iconUrl,
                        url: r.view.url,
                    };
                    event(ds);
                }
            });
        },
        _getApplets: function (options, event) {
            var ds = { applets: [] };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/views",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    viewId: options.view
                },
                success: function (r) {
                    $.each(r.applets, function (key, obj) {
                        ds.applets.push({
                            id: obj.id,
                            name: obj.displayName,
                            type: obj.appletType,
                            force: obj.isForceRelated,
                        });
                    });
                    event(ds);
                }
            });
        },
        _getApplet: function (options, event) {
            var ds = { applet: {}, controls: [], columns: [] };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletConfig",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    viewId: Iptools.DEFAULTS.currentView,
                    appletId: options.applet
                },
                success: function (r) {
                    ds.applet = {
                        id: r.applet.id,
                        name: r.applet.name,
                        displayName: r.applet.displayName,
                        type: r.applet.appletType,
                        isShowNav: r.applet.isShowNav,
                        rootPickList: r.applet.navRootPickListId,
                        createApplet: r.applet.createApplet,
                        report: r.applet.report
                    };
                    if (r.controls && r.controls.length > 0) {
                        $.each(r.controls, function (key, obj) {
                            ds.controls.push({
                                id: obj.id,
                                type: obj.field_type,
                                column: obj.columnName,
                                pickList: obj.pickList,
                                pickApplet: obj.pick_applet,
                                name: obj.display_name,
                                destinationView: obj.destination_view,
                                defaultValue: obj.defaultValue,
                                empty: obj.allowEmpty,
                                reg: obj.regularExpression,
                                regInfo: obj.regExpressHint,
                                modify: obj.allowUpdate,
                                insert: obj.allowInsert,
                                formula: obj.formular,
                                field: obj.field,
                                cascadeFields: obj.cascadeFields
                            });
                        });
                    }
                    if (r.listColumns && r.listColumns.length > 0) {
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
                    }
                    ds.rootBc = r.rootBcId;
                    ds.rootLink = r.rootBcGroupLinkId;
                    event(ds);
                }
            });
        },
        _getUserlistAppletData: function (options, event) {
            var ds = { columns: [], data: {}, applet: {} };
            var data = {
                tenantId: Iptools.DEFAULTS.tenantId,
                userId: Iptools.DEFAULTS.userId,
                viewId: options.view,
                appletId: options.appletId,
                pageNow: options.pageNow,
                pageSize: options.pageSize,
            };
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
                async: options.async === false ? false : true,
                url: "service/appletDataGetList",
                data: data,
                success: function (r) {
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
                    ds.rootLink = r.rootBcGroupLinkId;
                    ds.data = r.listData;
                    ds.applet = {
                        id: r.applet.id,
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
                    };
                    event(ds);
                }
            });
        },
        _getUserDetailAppletData: function (options, event) {
            var ds = { controls: [], data: {}, applet: {} };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletDataGetDetail",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    //userId: Iptools.DEFAULTS.userId,
                    appletId: options.appletId,
                    valueId: options.valueId
                },
                success: function (r) {
                    $.each(r.controls, function (key, obj) {
                        ds.controls.push({
                            id: obj.id,
                            type: obj.field_type,
                            column: obj.columnName,
                            pickList: obj.pickList,
                            pickApplet: obj.pick_applet,
                            name: obj.display_name,
                            destinationView: obj.destination_view,
                            defaultValue: obj.defaultValue,
                            empty: obj.allowEmpty,
                            reg: obj.regularExpression,
                            regInfo: obj.regExpressHint,
                            modify: obj.allowUpdate,
                            insert: obj.allowInsert,
                            formula: obj.formular,
                            field: obj.field,
                            cascadeFields: obj.cascadeFields
                        });
                    });
                    ds.data = r.detailData;
                    ds.rootLink = r.rootBcGroupLinkId;
                    ds.applet = {
                        id: r.applet.id,
                        name: r.applet.name,
                        displayName: r.applet.displayName,
                        type: r.applet.appletType,
                    }
                    event(ds);
                }
            });
        },
        _getAppletButtons: function (options) {
            var ds = { buttons: [] };
            Iptools.GetJson({
                async: false,
                url: "basic/appletButtons",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    appletId: options.applet,
                },
                success: function (r) {
                    $.each(r, function (key, obj) {
                        ds.buttons.push({
                            type: obj.name,
                            name: obj.title,
                            createApplet: obj.createApplet,
                            createView: obj.createView
                        });
                    });
                }
            });
            return ds;
        },
        _getAppletLinks: function (options) {
            var ds = { destinationFields: [], displayNames: [] };
            Iptools.GetJson({
                async: false,
                url: "basic/links_field_query",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    parentBCId: options.pbc,
                    childBCId: options.cbc,
                },
                success: function (r) {
                    ds.destinationFields = r.destinationFields;
                    ds.displayNames = r.displayNames;
                }
            });
            return ds;
        },
        _getFiledLinks: function (options) {
            var ds = [];
            Iptools.GetJson({
                async: false,
                url: "basic/links_query",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    destFieldId: options.field,
                    childBcId: options.cbc,
                },
                success: function (r) {
                    ds = r;
                }
            });
            return ds;
        },
        _getRelatedControlValues: function (options, event) {
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletFKDetail",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    appletId: options.applet,
                    controlId: options.control,
                    valueId: options.valueId,
                },
                success: function (r) {
                    if (event && r && r.detailData) {
                        event(r.detailData);
                    }
                }
            });
        },
        _formatUrl: function (options) {
            return "?tenantId=" + Iptools.DEFAULTS.tenantId
                + "&userId=" + Iptools.DEFAULTS.userId
                + "&appletId=" + options.appletId
                + "&fieldData=" + options.data
                + "&valueId=" + options.valueId;
        },
        _addAppletData: function (options, success, error) {
            Iptools.PostJson({
                async: false,
                url: "service/appletData",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    appletId: options.appletId,
                    fieldData: options.data,
                },
                success: function (r) {
                    if (r && success) {
                        success(r);
                    }
                },
                error: function (r) {
                    if (error) {
                        error(r);
                    }
                }
            });
        },
        _addGroupAppletData: function (options, success, error) {
            Iptools.PostJson({
                async: false,
                url: "service/appletDataInsertBatch",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    viewId: Iptools.DEFAULTS.currentNewView,
                    parentAppletData: JSON.stringify(options.data),
                    childAppletData: JSON.stringify(options.cdata.New),
                },
                success: function (r) {
                    if (r && success) {
                        success(r);
                    }
                },
                error: function (r) {
                    if (error) {
                        error(r);
                    }
                }
            });
        },
        _saveAppletData: function (options, success, error) {
            Iptools.PutJson({
                async: false,
                url: "service/appletData",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    appletId: options.appletId,
                    valueId: options.valueId,
                    fieldData: options.data
                },
                success: function (r) {
                    if (r && success) {
                        success(r);
                    }
                },
                error: function (r) {
                    if (error) {
                        error(r);
                    }
                }
            });
        },
        _saveGroupAppletData: function (options, success, error) {
            Iptools.PostJson({
                async: false,
                url: "service/appletDataUpdateBatch",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    viewId: Iptools.DEFAULTS.currentView,
                    valueId: options.valueId,
                    parentAppletUpdate: JSON.stringify(options.data),
                    childAppletInsert: JSON.stringify(options.cdata.New),
                    childAppletUpdate: JSON.stringify(options.cdata.Update),
                    childAppletDelete: JSON.stringify(options.cdata.Delete),
                },
                success: function (r) {
                    if (r && success) {
                        success(r);
                    }
                },
                error: function (r) {
                    if (error) {
                        error(r);
                    }
                }
            });
        },
        _deleteAppletData: function (options, success, error) {
            Iptools.DeleteJson({
                async: false,
                url: "service/delAppletDataByIds" + options.para,
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    appletId: options.appletId,
                    valueIds: options.valueIds
                },
                success: function (r) {
                    if (r && success) {
                        success(r);
                    }
                },
                error: function (r) {
                    if (error) {
                        error(r);
                    }
                }
            });
        },
        _uploadfileData: function (options, event) {
            $.ajax({
                async: false,
                url: (Iptools.DEFAULTS.API_URL + "basic/file/uploadpic?tenantId=" + Iptools.DEFAULTS.tenantId + "&type=" + options.type),
                type: "POST",
                data: options.data,
                processData: false,
                contentType: false,
                success: function (r) {
                    if (r && event) {
                        event(r);
                    }
                },
                error: function () {
                }
            });
        },
        _getCustomizeView: function (options) {
            var ds = { views: [] };
            Iptools.GetJson({
                async: false,
                url: "basic/customizeViewsByNameList",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    nameList: options.nameList,
                },
                success: function (r) {
                    if (r) {
                        $.each(r, function (key, obj) {
                            ds.views.push({
                                view: obj.viewId,
                                name: obj.name,
                                description: obj.description,
                            });
                        });
                    }
                }
            });
            return ds;
        },
        _getCustomizeApplet: function (options) {
            var ds = { applets: [] };
            Iptools.GetJson({
                async: false,
                url: "basic/customizeApplets",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    nameList: options.nameList,
                },
                success: function (r) {
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
                }
            });
            return ds;
        },
        _getDetectTree: function (options) {
            var ds = [];
            Iptools.GetJson({
                async: false,
                url: "basic/pickItems/treeview",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    pickListId: options.pickListId,
                },
                success: function (r) {
                    if (r && r.length) {
                        ds = Iptools.uidataTool._setDetectTreeData({
                            data: r,
                            panelListener: options.panelListener,
                            submitListener: options.submitListener,
                        });
                    }
                }
            });
            return ds;
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
            var ds = [];
            Iptools.GetJson({
                async: false,
                url: "basic/contactTagLink_paging",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    contactId: options.contact,
                    pageNow: 1,
                    pagesize: 3,
                },
                success: function (r) {
                    if (r && r.records && r.records.length) {
                        $.each(r.records, function (key, obj) {
                            ds.push({
                                phone: obj.phone,
                                tag: obj.tagValue,
                                createTime: obj.createTime
                            });
                        });
                    }
                }
            });
            return ds;
        },
        _buildReport: function (options) {
            var report = {};
            var result = { categories: [], series: [] };
            var ds;
            Iptools.uidataTool._getApplet({
                async: false,
                applet: options.applet
            }, function (rs) {
                ds = rs;
            });
            if (ds && ds.applet.type == "report") {
                var para = {
                    tenantId: Iptools.DEFAULTS.tenantId,
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
                    data: para,
                    success: function (r) {
                        if (r) {
                            report = r;
                        }
                    }
                });
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
                    var i, sdata, sjson, item, index;
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
                                        for (item in report.categories) {
                                            index = $.inArray(report.categories[item], sdata.categories);
                                            if (index < 0) {
                                                sjson.data.push(0);
                                            } else {
                                                sjson.data.push(parseInt(sdata.data[index]));
                                            }
                                        }
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
                                        for (item in report.categories) {
                                            index = $.inArray(report.categories[item], sdata.categories);
                                            var pieData = [];
                                            if (index < 0) {
                                                pieData.push(report.categories[item], 0);
                                                sjson.data.push(pieData);
                                            } else {
                                                if (showFlag) {
                                                    pieData = {
                                                        name: (report.categories[item] == "" ? "[空]" : report.categories[item]),
                                                        y: parseInt(sdata.data[index]),
                                                        sliced: true,
                                                        selected: true
                                                    };
                                                    showFlag = false;
                                                } else {
                                                    pieData.push(
                                                        (report.categories[item] == "" ? "[空]" : report.categories[item]),
                                                        parseInt(sdata.data[index]));
                                                }
                                                sjson.data.push(pieData);
                                            }
                                        }
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
                                        for (item in sdata.categories) {
                                            var ptData = [];
                                            switch (options.timeType) {
                                                case "day":
                                                    if (options.date.length < 8) break;
                                                    ptData.push(
                                                        Date.UTC(
                                                            parseInt(options.date.substr(0, 4)),
                                                            parseInt(options.date.substr(4, 2) - 1),
                                                            parseInt(options.date.substr(6, 2)),
                                                            parseInt(sdata.categories[item])
                                                        ),
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                                case "week":
                                                    ptData.push(
                                                        Date.UTC(
                                                            parseInt(sdata.categories[item].substr(0, 4)),
                                                            parseInt(sdata.categories[item].substr(4, 2) - 1),
                                                            parseInt(sdata.categories[item].substr(6, 2))
                                                        ),
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                                case "month":
                                                    ptData.push(
                                                        Date.UTC(
                                                            parseInt(sdata.categories[item].substr(0, 4)),
                                                            parseInt(sdata.categories[item].substr(4, 2) - 1),
                                                            parseInt(sdata.categories[item].substr(6, 2))
                                                        ),
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                                case "year":
                                                    ptData.push(
                                                        Date.UTC(
                                                            parseInt(sdata.categories[item].substr(0, 4)),
                                                            parseInt(sdata.categories[item].substr(4, 2) - 1)
                                                        ),
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                            }
                                            sjson.data.push(ptData);
                                        }
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
                                        for (item in sdata.categories) {
                                            var tData = [];
                                            switch (options.timeType) {
                                                case "day":
                                                    if (options.date.length < 8) break;
                                                    tData.push(
                                                        sdata.categories[item] + ":00",
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                                case "week":
                                                    var week = (new Date(sdata.categories[item].substr(0, 4) + "-" +
                                                            sdata.categories[item].substr(4, 2) + "-" +
                                                            sdata.categories[item].substr(6, 2)
                                                    )).getDay();
                                                    if (week == 0) week = "日";
                                                    tData.push(
                                                        "星期" + week,
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                                case "month":
                                                    tData.push(
                                                        (new Date(sdata.categories[item].substr(0, 4) + "-" +
                                                            sdata.categories[item].substr(4, 2) + "-" +
                                                            sdata.categories[item].substr(6, 2)
                                                        )).format("yyyy-MM-dd"),
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                                case "year":
                                                    tData.push(
                                                        (new Date(sdata.categories[item].substr(0, 4) + "-" +
                                                           sdata.categories[item].substr(4, 2)
                                                        )).format("yyyy-MM"),
                                                        parseInt(sdata.data[item])
                                                    );
                                                    break;
                                            }
                                            sjson.data.push(tData);
                                        }
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
            }
            return result;
        },
    };


    /**
        ui element basic data solutions and funcions
    **/
    Iptools.Tool = {
        Alert: function (options) {
            options = Iptools.Tool._extend(Iptools.NotifyDefaults, options);
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
            return $.extend(true, object, options);
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
        }
    };
})();