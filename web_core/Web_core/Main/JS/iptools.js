//Author :Ethan
//Created :2016-7-19
//use :Main

var Iptools = Iptools || {};
(function () {
    //defaultDataSet :combine function options
    Iptools.DEFAULTS = {
        domain: "",
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
        goEasy: null
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
        removeLoading: false,
    };
    //Tool Intervals
    Iptools.Intervals = {
        loadingCircle: null,
        removeLoading: null,
        toolSearch: null,
        framesHeight: null
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
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "GET",
            dataType: "JSON",
            url: (Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url),
            data: Iptools.JsonDefaults.data,
            cache: false
        });
    };

    //POST AJAX :ajaxCounting, async, url, data, success, error
    Iptools.PostJson = function (options) {
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "POST",
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data
        });
    };

    //PUT AJAX :ajaxCounting, async, url, data, success, error
    Iptools.PutJson = function (options) {
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "PUT",
            dataType: "JSON",
            url: encodeURI(Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url, "utf-8"),
            data: Iptools.JsonDefaults.data
        });
    };

    //DELETE AJAX :ajaxCounting, async, url, data, success, error
    Iptools.DeleteJson = function (options) {
        Iptools.SetJsonDefaults();
        Iptools.JsonDefaults = toolBase._extend(Iptools.JsonDefaults, options);
        return $.ajax({
            async: Iptools.JsonDefaults.async === false ? false : true,
            type: "DELETE",
            dataType: "JSON",
            url: (Iptools.DEFAULTS.API_URL + Iptools.JsonDefaults.url),
            data: Iptools.JsonDefaults.data
        });
    };
    var toolBase = {
        _extend: function (object, options) {
            return $.extend(true, object, options);
        },
        _FrameHeights: function () {
            Iptools.Intervals.framesHeight = setInterval(function () {
                Iptools.Tool.FrameHeight();
            }, 1000);
        },
        _transSession: function () {
            var extendObject = {
                domain: window.sessionStorage.getItem("domain"),
                tenantId: window.sessionStorage.getItem("tenantId"),
                userId: window.sessionStorage.getItem("userId"),
                token: window.sessionStorage.getItem("token"),
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
            this._setProperties();
            this._FrameHeights();
            Iptools.InitSetting = this._extend(Iptools.InitSetting, options);
            if (Iptools.InitSetting.checkSession) {
                this._sessionCheck();
            }
            if (Iptools.InitSetting.userInvironment) {
                this._setUserInvironment();
            }
            this._pushHandler();
        },
        _setProperties: function () {
            var para = {
                async: false,
                type: "GET",
                url: "../Content/JS/properties.xml"
            };
            $.ajax(para).done(function (r) {
                Iptools.DEFAULTS.serviceUrl = $(r).find("Configs api service_url").text();
                Iptools.DEFAULTS.API_URL = $(r).find("Configs api url").text();
                Iptools.DEFAULTS.hostPath = "." + $(r).find("Configs root path").text();
                Iptools.DEFAULTS.crmDomain = $(r).find("Configs root crmdomain").text();
                Iptools.DEFAULTS.pushKey = $(r).find("Configs root pushKey").text();
            });
        },
        _sessionCheck: function () {
            if (Iptools.getDefaults({ key: "token" }) == null) {
                self.location = "http://" + Iptools.DEFAULTS.crmDomain + Iptools.DEFAULTS.hostPath;
            }
        },
        _setUserInvironment: function () {
            Iptools.GetJson({
                async: false,
                url: "basic/getEmployee",
                data: {
                    token: Iptools.DEFAULTS.token
                }
            }).done(function (r) {
                if ($("#application_user").length) {
                    $("#application_user").text(r.name);
                    $(".user_headpic").attr("src", (r.headPic ? r.headPic : "../Content/Image/defaultHead2.svg"));
                }
            });
            Iptools.GetJson({
                url: "basic/getMerchantInfoByTenantId",
                data: {
                    tenantId: Iptools.DEFAULTS.tenantId
                }
            }).done(function (data) {
                if (data) {
                    document.title = data.shortName + "——工作台";
                }
            });
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
        _pushHandler: function () {
            // ReSharper disable once UseOfImplicitGlobalInFunctionScope
            Iptools.DEFAULTS.goEasy = new GoEasy({
                appkey: Iptools.DEFAULTS.pushKey
            });
            Iptools.DEFAULTS.goEasy.subscribe({
                channel: Iptools.DEFAULTS.tenantId + "_broadcast",
                onMessage: function (message) {
                    if (message) {
                        message = eval("(" + message.content + ")");
                        if (Iptools.Tool._checkNull(message.data.userIdList)) {
                            if (message.data.userIdList.indexOf(Iptools.DEFAULTS.userId) != -1) {
                                Iptools.Tool._notification({
                                    title: message.data.title,
                                    content: message.data.message
                                });
                            }
                        } else {
                            Iptools.Tool._notification({
                                title: message.data.title,
                                content: message.data.message
                            });
                        }
                    }
                }
            });
            Iptools.DEFAULTS.goEasy.subscribe({
                channel: Iptools.DEFAULTS.tenantId + "_broadcast_view",
                onMessage: function (message) {
                    if (message) {
                        message = eval("(" + message.content + ")");
                        Iptools.Tool._notification({
                            title: message.data.title,
                            content: message.data.message
                        }, function () {
                            if (Iptools.Tool._checkNull(message.data.userIdList)) {
                                if (message.data.userIdList.indexOf(Iptools.DEFAULTS.userId) != -1) {
                                    if (Iptools.Tool._checkNull(message.data.viewId)) {
                                        Iptools.uidataTool._getView({
                                            view: message.data.viewId,
                                        }).done(function (data) {
                                            Iptools.Tool._jumpView({
                                                view: message.data.viewId,
                                                name: data.view.name,
                                                type: data.view.type,
                                                valueId: message.data.valueId,
                                                primary: data.view.primary,
                                                icon: data.view.icon,
                                                url: data.view.url,
                                                bread: true,
                                                clear: true
                                            });
                                        });
                                    }
                                }
                            } else {
                                if (Iptools.Tool._checkNull(message.data.viewId)) {
                                    Iptools.uidataTool._getView({
                                        view: message.data.viewId,
                                    }).done(function (data) {
                                        Iptools.Tool._jumpView({
                                            view: message.data.viewId,
                                            name: data.view.name,
                                            type: data.view.type,
                                            valueId: message.data.valueId,
                                            primary: data.view.primary,
                                            icon: data.view.icon,
                                            url: data.view.url,
                                            bread: true,
                                            clear: true
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    };

    /**
        ui element basic data solutions and funcions
    **/
    Iptools.uidataTool = {
        _getUserSettings: function () {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                url: "basic/perSettings",
                data: {
                    token: Iptools.DEFAULTS.token,
                }
            }).done(function (r) {
                var ds = { settings: [] };
                $.each(r, function (key, obj) {
                    ds.settings.push({
                        id: obj.uuid,
                        title: obj.title,
                        code: obj.code,
                        url: obj.url,
                        description: obj.description,
                        icon: obj.icon,
                    });
                });
                ipromise.resolve(ds);
            });
            return ipromise;
        },
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
                async: options.async === false ? false : true,
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
                        icon: obj.iconUrl,
                        url: obj.url
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
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getApplet: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                async: options.async === false ? false : true,
                url: "service/appletDataGetDetail",
                data: {
                    token: Iptools.DEFAULTS.token,
                    appletId: options.applet,
                    valueId: 0,
                }
            }).done(function (r) {
                var ds = { applet: {} };
                ds.applet = {
                    id: r.applet.uuid,
                    name: r.applet.name,
                    displayName: r.applet.displayName,
                    type: r.applet.appletType
                };
                ipromise.resolve(ds);
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
                data: data
            }).done(function (r) {
                var ds = { columns: [], data: {}, applet: {} };
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
                ds.rootBc = r.rootBcId;
                ds.rootLink = r.rootBcGroupLinkId;
                ds.data = r.listData;
                ds.applet = {
                    id: r.applet.uuid,
                    name: r.applet.name,
                    displayName: r.applet.displayName,
                    type: r.applet.appletType,
                };
                ipromise.resolve(ds);
            });
            return ipromise;
        },
        _getUserDetailAppletData: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                async: options.async === false ? false : true,
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
                        type: obj.field_type,
                        column: obj.columnName,
                        pickList: obj.pickList,
                        pickApplet: obj.pick_applet,
                        name: obj.display_name,
                        destinationView: obj.destination_view
                    });
                });
                ds.data = r.detailData;
                ds.applet = {
                    id: r.applet.uuid,
                    name: r.applet.name,
                    displayName: r.applet.displayName,
                    type: r.applet.appletType,
                }
                ipromise.resolve(ds);
            });
            return ipromise;
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
        _getAppletButtons: function (options) {
            var ipromise = $.Deferred();
            Iptools.GetJson({
                async: false,
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
                    });
                });
                ipromise.resolve(ds);
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
        _uploadfileData: function (options) {
            return $.ajax({
                async: false,
                url: (Iptools.DEFAULTS.API_URL + "basic/file/uploadpic?token=" + Iptools.DEFAULTS.token + "&type=" + options.type),
                type: "POST",
                data: options.data,
                processData: false,
                contentType: false
            });
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
        _extend: function (object, options) {
            return $.extend(true, {}, object, options);
        },
        FrameHeight: function () {
            var fhold = $("#mainframe")[0].contentWindow.document;
            var height = $(fhold.body).parent().height();
            if (!height && fhold.body) {
                height = fhold.body.scrollHeight;
            }
            if (!height && height < 800) {
                height = 800;
            }
            $("#mainframe").css("height", height);
        },
        _initNewView: function (options) {
            widget._initDataNewView(options);
        },
        _groupNewView: function (options) {
            widget._initGroupNewView(options);
        },
        _redirectToParent: function () {
            $(".breadNav").find("a").eq($(".breadNav").find("a").length - 2).click();
        },
        _redirectView: function (options) {
            widget._initView(options);
        },
        _checkNull: function (obj) {
            if (obj == null || obj == "NULL" || obj == "undefined" || obj == "") {
                obj = false;
            } else {
                obj = true;
            }
            return obj;
        },
        _jumpView: function (options, beforeLoad, afterLoad) {
            if (beforeLoad) {
                beforeLoad();
            }
            widget._initView(options);
            if (afterLoad) {
                afterLoad();
            }
        },
        _reFreshView: function (options) {
            widget._initView(options);
        },
        plusAjaxCount: function () {
            ++Iptools.DEFAULTS.ajaxCount;
        },
        minusAjaxCount: function () {
            --Iptools.DEFAULTS.ajaxCount;
        },
        setUserInfo: function () {
            widget._setUserEnvironment();
        },
        _coverWindowShow: function () {
            widget._setCoverModalShow();
        },
        _coverWindowHide: function () {
            widget._setCoverModalHide();
        },
        _setBreadCondition: function (options) {
            widget._setBreadCondition(options);
        },
        _setBreadDetectValue: function (options) {
            widget._setBreadDetectValue(options);
        },
        _setTabData: function (options) {
            widget._setViewTabData(options);
        },
        _getTabData: function (options) {
            return widget._getViewTabData(options);
        },
        _CloseTab: function (options, beforeLoad, afterLoad) {
            if (beforeLoad) {
                beforeLoad();
            }
            $(".breadNav").find("li").eq($(".breadNav").find("li").length - 1).remove();
            if (afterLoad) {
                afterLoad();
            }
        },
        _getVersion: function () {
            return "v1";
        },
        _scrollToTop: function () {
            $("body").animate({ scrollTop: 0 });
        },
        _logOut: function () {
            $("#retractSessionBtn").click();
        },
        _notification: function (options, func) {
            if (("Notification" in window)) {
                if (Notification.permission != "granted") {
                    Notification.requestPermission(function (permission) {
                        if (permission == "granted") {
                            if (options.content && options.content.length > 18) {
                                options.content = options.content.substr(0, 18) + "...";
                            }
                            var notification = new Notification(options.title, {
                                icon: (options.icon ? options.icon : "../Content/Image/defaultHead.png"),
                                body: options.content
                            });
                            notification.onclick = function () {
                                notification.close();
                                if (func && typeof (func) == "function") {
                                    func();
                                }
                            };
                        }
                    });
                } else {
                    if (options.content && options.content.length > 18) {
                        options.content = options.content.substr(0, 18) + "...";
                    }
                    var a = new Notification(options.title, {
                        icon: (options.icon ? options.icon : "../Content/Image/defaultHead.png"),
                        body: options.content
                    });
                    a.onclick = function () {
                        a.close();
                        if (func && typeof (func) == "function") {
                            func();
                        }
                    };
                }
            }
        },
        _pushListen: function (channel, func) {
            if (channel != "broadcast" && channel != "broadcast_view") {
                if (Iptools.DEFAULTS.goEasy) {
                    Iptools.DEFAULTS.goEasy.subscribe({
                        channel: Iptools.DEFAULTS.tenantId + "_" + channel,
                        onMessage: function (message) {
                            if (message) {
                                message = eval("(" + message.content + ")");
                                if (func && typeof (func) == "function") {
                                    func(message.data);
                                }
                            }
                        }
                    });
                }
            }
        }
    };
})();