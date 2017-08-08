//Author :Ethan
//Created :2016-7-19
//use :dView

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
        //serviceUrl: "http://enterpriseserver.intopalm.com/",
        ////API_URL: "http://enterpriseserver.intopalm.com:80/eis/v1/",
        //serviceUrl: "http://eis.63home.cn/",
        //API_URL: "http://eis.63home.cn:80/eis/v1/",
        //serviceUrl: "http://eisnew.63home.cn/",
        //API_URL: "http://eisnew.63home.cn:80/eis/v1/",
        serviceUrl: "http://www.fangxindai.com/",
        API_URL: "http://eis.fangxindai.com:80/eis/v1/",
        //serviceUrl: "http://eis.yizhangke.cn/",
        //API_URL: "http://eis.yizhangke.cn:80/eis/v1/",
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
    Iptools.Start = function () {
        toolBase._init();
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
            ajaxCounting: true
        };
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
            Iptools.InitSetting = this._extend(Iptools.InitSetting, options);
            if (Iptools.InitSetting.checkSession) {
                this._sessionCheck();
            }
            if (Iptools.InitSetting.userInvironment) {
                this._setUserInvironment();
            }
        },
        _sessionCheck: function () {
            if (Iptools.DEFAULTS.tenantId == null || Iptools.DEFAULTS.userId == null) {
                self.location = "http://" + Iptools.DEFAULTS.domain + ".intopalm.com";
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
                            document.title = r.companyInfo + "——工作台";
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
                            calendar: obj.calendar,
                            report: obj.report,
                            icon: obj.iconUrl,
                            ra1: obj.relatedApplet1,
                            ra2: obj.relatedApplet2,
                            ra3: obj.relatedApplet3,
                            ra4: obj.relatedApplet4,
                            ra5: obj.relatedApplet5,
                            rv1: obj.relatedView1,
                            rv2: obj.relatedView2,
                        });
                    });
                    event(ds);
                }
            });
        },
        _getApplet: function (options, event) {
            var ds = { applet: {} };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletData",
                data: {
                    tenantId: Iptools.getDefaults({ key: "tenantId" }),
                    userId: Iptools.getDefaults({ key: "userId" }),
                    viewId: Iptools.getDefaults({ key: "currentView" }),
                    appletId: options.applet
                },
                success: function (r) {
                    ds.applet = {
                        id: r.applet.id,
                        name: r.applet.name,
                        displayName: r.applet.displayName,
                        type: r.applet.appletType,
                        bc: r.bc.id
                    };
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
                condition: options.condition ? options.condition : null,
                orderByColumn: options.orderByColumn ? options.orderByColumn : null,
                orderByAscDesc: options.orderByAscDesc ? options.orderByAscDesc : null
            };
            if (Iptools.Tool._checkNull(options.valueId)) {
                data["valueId"] = options.valueId;
            }
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletData",
                data: data,
                success: function (r) {
                    $.each(r.listColumns, function (key, obj) {
                        ds.columns.push({
                            allowOutterQuery: obj.allowOutterQuery,
                            allowOrderBy: obj.allowOrderBy,
                            pickFlag: obj.pickFlag,
                            type: obj.listColumnType,
                            column: obj.columnName,
                            pickList: obj.pickList,
                            name: obj.displayName,
                            pickApplet: obj.pickApplet,
                            destinationView: obj.destinationView
                        });
                    });
                    ds.data = r.listData;
                    ds.applet = {
                        id: r.applet.id,
                        name: r.applet.name,
                        displayName: r.applet.displayName,
                        type: r.applet.appletType,
                    };
                    event(ds);
                }
            });
        },
        _getUserDetailAppletData: function (options, event) {
            var ds = { controls: [], data: {}, applet: {} };
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletData",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    viewId: options.view,
                    appletId: options.appletId,
                    valueId: options.valueId
                },
                success: function (r) {
                    $.each(r.controls, function (key, obj) {
                        ds.controls.push({
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
                            modify: obj.allowModify,
                            formula: obj.formular,
                            field: obj.field
                        });
                    });
                    ds.data = r.detailData;
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
                url: "service/appletData" + Iptools.uidataTool._formatUrl(options),
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    appletId: options.appletId,
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
                url: "service/appletData" + Iptools.uidataTool._formatUrl(options),
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId,
                    userId: Iptools.DEFAULTS.userId,
                    appletId: options.appletId,
                    valueId: options.valueId
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
        }
    };


    /**
        ui element basic data solutions and funcions
    **/
    Iptools.Tool = {
        Alert: function (options) {
            Lobibox.notify('warning', {
                delay: 3000,
                showClass: 'zoomInUp',
                hideClass: 'zoomOutDown',
                size: 'mini',
                title: options.title,
                msg: options.content,
                position: "center",
                closable: false
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
        _checkNull: function (obj) {
            if (obj == null || obj == "NULL" || obj == "undefined") {
                obj = false;
            } else {
                obj = true;
            }
            return obj;
        },
        _newView: function (options) {
            parent.Iptools.Tool._initNewView(options);
        },
        _initClientHeight: function () {
            parent.Iptools.Tool.FrameHeight({ height: $("body").css("height") });
        },
        _redirectToParent: function () {
            parent.Iptools.Tool._redirectToParent();
        },
        _jumpView: function (options) {
            parent.Iptools.Tool._jumpView(options);
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
    };
})();