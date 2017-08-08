//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :main
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
        mainArea: "#mainArea",
        screenPanel: "#screenMenu",
        toolSearchPanel: ".search-content ul",
        defaultPicturePath: "../Content/Image/defaultHead2.svg",
        perMenu: "#cDropMenu",
        viewBread: ".viewBread",
        coverModal: "#coverModal",
        screenHolder: "#screenHolder",
        tabs: "#parentTabFolder",
        tabContents: "#parentTabContents",
        pnav: "#pullNavigator",
        smenu: "#short_screenMenu",
        tabViewData: {},
        barStatus: 1,
        scrollWay: "left",
        scrollListner: null,
        tabDrag: {
            ulen: 0,
            rlen: 0
        }
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
    _environmentSettings: function () {
        var epromise = $.Deferred();
        Iptools.uidataTool._getUserSettings().done(function (ds) {
            var target = $(widget._UIDEFAULFS.perMenu).find("li:first");
            for (var i = 0; i < ds.settings.length; i++) {
                switch (ds.settings[i].code) {
                    case "screenaddon":
                        var sli = document.createElement("li");
                        var sa = document.createElement("a");
                        $(sa).attr("href", "#");
                        $(sa).addClass("screen-menu-addon");
                        $(sa).attr("aria-expanded", "false");
                        $(sa).data("url", ds.settings[i].url);
                        $(sa).data("name", ds.settings[i].title);
                        $(sa).data("screen", ds.settings[i].id);
                        $(sa).attr("id", ds.settings[i].id);
                        var spis = document.createElement("span");
                        $(spis).attr("class", "screenIcon");
                        $(spis).html(ds.settings[i].icon);
                        $(sa).append(spis, ds.settings[i].title);
                        $(sli).append(sa);
                        $(widget._UIDEFAULFS.screenPanel).append(sli);
                        var ssli = document.createElement("li");
                        var ssa = document.createElement("a");
                        $(ssa).attr("href", "#");
                        $(ssa).addClass("screen-menu-addon");
                        $(ssa).data("url", ds.settings[i].url);
                        $(ssa).data("screen", ds.settings[i].id);
                        $(ssa).attr("id", ds.settings[i].id);
                        $(ssa).data("name", ds.settings[i].title);
                        var sspis = document.createElement("span");
                        $(sspis).attr("class", "screenIcon");
                        $(sspis).html(ds.settings[i].icon);
                        $(ssa).append(sspis);
                        $(ssli).append(ssa);
                        $(widget._UIDEFAULFS.smenu).append(ssli);
                        break;
                    case "cdrop":
                    default:
                        var li = document.createElement("li");
                        var a = document.createElement("a");
                        $(a).attr("href", "#");
                        $(a).addClass("pSettingsDropItem");
                        $(a).data("url", ds.settings[i].url);
                        $(a).data("screen", ds.settings[i].id);
                        $(a).data("title", ds.settings[i].title);
                        var sp = document.createElement("span");
                        $(sp).addClass(ds.settings[i].icon);
                        $(a).append(sp, ds.settings[i].title);
                        $(li).append(a);
                        $(li).insertBefore(target);
                        break;
                }
            }
            epromise.resolve();
        });
        return epromise;
    },
    _bindingDomEvent: function () {
        widget._enableScreenClick();
        widget._enablePerSettingsClick();
        widget._enableViewSelect();
        widget._enableLogOut();
        widget._enableTabRemove();
        widget._enableScreenMenuShow();
        widget._enableScreenMenuHide();
        widget._enableScreenMenuAddons();
        widget._enableViewTabShow();
        widget._enableSingleScreenClick();
        widget._enableIconList();
        widget._enableNavigatePull();
        widget._enableQueryListJumpView();
        widget._enableFullScreen();
        //widget._enablePersonInfoModal();
        widget._enableContentScroll();
    },
    _initBreadNav: function (options) {
        var e = document.createElement("a");
        e.setAttribute("class", "breadLinkA");
        e.setAttribute("data-view", options.viewId);
        e.setAttribute("data-value", options.valueId ? options.valueId : null);
        $(e).html(options.viewName);
        var l = document.createElement("li");
        l.appendChild(e);
        $(".breadNav").append(l);
    },
    _clearBreadNav: function () {
        $(".breadNav").find("li").remove();
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._initScreenMenu();
        $("#pullNavigator").attr("title", "点击此处展开侧边栏");
        $(window).resize(function () {
            widget._loadTabs();
            widget._loadScroll();
        });
    },
    _initScreenMenu: function () {
        Iptools.uidataTool._getScreenMenu().done(function (ds) {
            //init screen panels html
            for (var i = 0; i < ds.screens.length; i++) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                $(a).attr("href", "#");
                $(a).attr("aria-expanded", "false");
                var spi = document.createElement("span");
                $(spi).attr("class", 'fa ' + ds.screens[i].icon + '');
                var spt = document.createElement("span");
                $(spt).attr("class", 'text').append(ds.screens[i].name);
                var sps = document.createElement("span");
                $(sps).attr("class", 'fa ' + ds.screens[i].icon + '');
                var spc = document.createElement("span");
                $(spc).addClass("fa fa-plus arrow-slide");
                var ul = document.createElement("ul");
                $(ul).attr("aria-expanded", "false");
                var sul = document.createElement("ul");
                $(sul).addClass("menuShow");
                var rs = widget._initScreenViewPanel({
                    screen: ds.screens[i].id,
                    container: ul,
                    scontainer: sul
                });
                if (rs.flag) {
                    $(a).append(spi, spt, spc);
                    $(li).append(a, ul);
                } else {
                    if (Iptools.Tool._checkNull(rs.view)) {
                        $(a).addClass("screen-single-menu");
                        $(a).data("view", rs.view);
                    }
                    $(a).append(spi, spt);
                    $(li).append(a);
                }
                $(widget._UIDEFAULFS.screenPanel).append(li);

                var sli = document.createElement("li");
                var sa = document.createElement("a");
                $(sa).attr("href", "#");
                $(sa).attr("aria-expanded", "false");
                $(sa).attr("aria-haspopup", "true");
                $(sa).append(sps);
                $(sli).addClass("menuList");
                $(sli).append(sa, sul);
                $(widget._UIDEFAULFS.smenu).append(sli);
            }
            widget._environmentSettings().done(function () {
                $(widget._UIDEFAULFS.screenPanel).metisMenu();
                var targetScreen = $(widget._UIDEFAULFS.screenPanel).find("li");
                if (targetScreen.length) {
                    var ts = targetScreen.eq(0);
                    if (ts.find("ul").length && ts.find("ul:first").find("li").length) {
                        ts.find("ul:first").find("li:first").find("a:first").click();
                    } else {
                        ts.find("a:first").click();
                    }
                }
            });
        });
    },
    _initScreenViewPanel: function (options) {
        var result = { flag: false };
        Iptools.uidataTool._getViews({
            async: false,
            screen: options.screen
        }).done(function (ds) {
            if (ds.views && ds.views.length) {
                if (ds.views.length == 1) {
                    result.flag = false;
                    result["view"] = ds.views[0].id;
                    var sli = document.createElement("li");
                    $(sli).addClass("presentation");
                    var sai = document.createElement("a");
                    $(sai).attr("role", "menuitem");
                    $(sai).attr("tabindex", "-1");
                    $(sai).addClass("screenview-link");
                    $(sai).html(ds.views[0].name);
                    $(sai).data("key", ds.views[0].id);
                    $(sli).append(sai);
                    $(options.scontainer).append(sli);
                } else {
                    for (var i = 0; i < ds.views.length; i++) {
                        var l = document.createElement("li");
                        var a = document.createElement("a");
                        $(a).addClass("screenview-link");
                        $(a).html(ds.views[i].name);
                        $(a).data("key", ds.views[i].id);
                        $(l).append(a);
                        $(options.container).append(l);
                        var sl = document.createElement("li");
                        $(sl).addClass("presentation");
                        var sa = document.createElement("a");
                        $(sa).attr("role", "menuitem");
                        $(sa).attr("tabindex", "-1");
                        $(sa).addClass("screenview-link");
                        $(sa).html(ds.views[i].name);
                        $(sa).data("key", ds.views[i].id);
                        $(sl).append(sa);
                        $(options.scontainer).append(sl);
                        result.flag = true;
                    }
                }
            }
        });
        return result;
    },
    _initScreen: function (options) {
        widget._clearBreadNav();//clear all exist bread links before loading any screen
        Iptools.setDefaults({
            key: "currentScreen",
            value: options.screen
        });
        Iptools.uidataTool._getViews({
            screen: options.screen
        }).done(function (ds) {
            var optionspara;
            $(widget._UIDEFAULFS.viewBread).html("");
            if (ds.views.length) {
                optionspara = {
                    view: ds.views[0].id,
                    name: ds.views[0].name,
                    type: ds.views[0].type,
                    primary: ds.views[0].primary,
                    icon: ds.views[0].icon,
                    url: ds.views[0].url,
                    bread: true
                };
                for (var i = 0; i < ds.views.length; i++) {
                    var l = document.createElement("li");
                    if (i == 0) {
                        $(l).addClass("active");
                        $(l).html(ds.views[i].name);
                        $(l).data("key", ds.views[i].id);
                    } else {
                        var a = document.createElement("a");
                        $(a).html(ds.views[i].name);
                        $(l).data("key", ds.views[i].id);
                        $(a).data("key", ds.views[i].id);
                        $(l).append(a);
                    }
                    $(widget._UIDEFAULFS.viewBread).append(l);
                }
            }
            if (optionspara) widget._initView(optionspara);
        });
    },
    _initView: function (options, onLoad) {
        var viewPath = options.view + "_viewTab_" + options.type;
        if (options.valueId) {
            viewPath += "_" + options.valueId;
        }
        if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
            Iptools.setDefaults({
                key: "currentView",
                value: widget._UIDEFAULFS.tabViewData["#" + viewPath].view
            });
            Iptools.setDefaults({
                key: "currentViewValue",
                value: widget._UIDEFAULFS.tabViewData["#" + viewPath].valueId
            });
            Iptools.setDefaults({
                key: "currentViewCondition",
                value: widget._UIDEFAULFS.tabViewData["#" + viewPath].condition
            });
            Iptools.setDefaults({
                key: "currentViewDetectValue",
                value: widget._UIDEFAULFS.tabViewData["#" + viewPath].detectValue
            });
            $("#" + widget._UIDEFAULFS.tabViewData["#" + viewPath].listener).click();
            if (options.refresh) {
                setTimeout(function () {
                    $("#" + viewPath).find("iframe").attr("src", $("#" + viewPath).find("iframe").attr("src"));
                }, 100);
            }
            return;
        } else {
            Iptools.setDefaults({
                key: "currentView",
                value: options.view
            });
            Iptools.setDefaults({
                key: "currentViewValue",
                value: options.valueId
            });
            Iptools.setDefaults({
                key: "currentViewCondition",
                value: options.condition
            });
            Iptools.setDefaults({
                key: "currentViewDetectValue",
                value: options.detectValue
            });
        }
        var li = document.createElement("li");
        $(li).attr("role", "presentation");
        if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
            $(li).addClass("active");
        }
        var a = document.createElement("a");
        $(a).attr("id", "viewTarget_" + viewPath);
        $(a).attr("href", "#" + viewPath);
        $(a).attr("role", "tab");
        $(a).attr("data-toggle", "tab");
        widget._UIDEFAULFS.tabViewData["#" + viewPath] = {
            target: viewPath,
            listener: "viewTarget_" + viewPath,
            view: options.view,
            applet: options.applet,
            valueId: options.valueId,
            condition: options.condition,
            detectValue: options.detectValue
        };
        if (onLoad) {
            onLoad();
        }
        var span = document.createElement("span");
        $(span).addClass("fa fa-times-circle tab-remove");
        $(a).css('outline', "none");
        $(a).append(options.name, span);
        $(li).append(a);
        var dc = document.createElement("div");
        $(dc).attr("role", "tabpanel");
        $(dc).attr("id", viewPath);
        $(dc).addClass("tab-pane");
        if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
            $(dc).addClass("active");
        }
        var df = document.createElement("div");
        $(df).addClass("sectionDiv");
        $(df).css({
            width: "100%", height: "auto", border: 0, "min-height": "880px"
        });
        var frame = document.createElement("iframe");
        $(frame).attr("scrolling", "no");
        $(frame).attr("marginheight", "0");
        $(frame).attr("marginwidth", "0");
        $(frame).addClass("containerIframe");
        $(frame).css({
            width: "100%", height: "auto", border: 0, "min-height": "880px"
        });
        $(df).append(frame);
        $(dc).append(df);
        //绑定右键事件
        $(li).bindContextMenu();
        if (Iptools.Tool._checkNull(options.url)) {
            $(widget._UIDEFAULFS.tabs).append(li);
            $(widget._UIDEFAULFS.tabContents).append(dc);
            if (!$(li).hasClass("active")) {
                $(li).find("a").trigger("click");
            }
            $(frame).attr("src", options.url);
        } else {
            switch (options.type) {
                case "list":
                default:
                    $(widget._UIDEFAULFS.tabs).append(li);
                    $(widget._UIDEFAULFS.tabContents).append(dc);
                    if (!$(li).hasClass("active")) {
                        $(li).find("a").trigger("click");
                    }
                    $(frame).attr("src", "../lView");
                    break;
                case "detail":
                    $(widget._UIDEFAULFS.tabs).append(li);
                    $(widget._UIDEFAULFS.tabContents).append(dc);
                    if (!$(li).hasClass("active")) {
                        $(li).find("a").trigger("click");
                    }
                    $(frame).attr("src", "../dView");
                    break;
            }
        }
        widget._loadTabs();
        widget._enableContentScroll();
    },
    _initDataNewView: function (options) {
        var viewPath = options.applet + "_viewTab_new";
        Iptools.uidataTool._getApplet({
            applet: options.applet
        }).done(function (data) {
            if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                Iptools.setDefaults({
                    key: "currentNewApplet",
                    value: widget._UIDEFAULFS.tabViewData["#" + viewPath].currentNewApplet
                });
                $("#" + widget._UIDEFAULFS.tabViewData["#" + viewPath].listener).click();
                return;
            }
            var li = document.createElement("li");
            $(li).attr("role", "presentation");
            if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
                $(li).addClass("active");
            }
            var a = document.createElement("a");
            $(a).attr("id", "viewTarget_" + viewPath);
            $(a).attr("href", "#" + viewPath);
            $(a).attr("role", "tab");
            $(a).attr("data-toggle", "tab");
            widget._UIDEFAULFS.tabViewData["#" + viewPath] = {
                target: viewPath,
                listener: "viewTarget_" + viewPath,
                applet: options.applet,
                currentNewApplet: options.applet
            };
            Iptools.setDefaults({
                key: "currentNewApplet",
                value: options.applet
            });
            var span = document.createElement("span");
            $(span).addClass("fa fa-times-circle tab-remove");
            $(a).append(data.applet.displayName, span);
            $(li).append(a);
            var dc = document.createElement("div");
            $(dc).attr("role", "tabpanel");
            $(dc).attr("id", viewPath);
            $(dc).addClass("tab-pane");
            if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
                $(dc).addClass("active");
            }
            var df = document.createElement("div");
            $(df).addClass("sectionDiv");
            $(df).css({
                width: "100%", height: "auto", "min-height": "880px", border: 0
            });
            var frame = document.createElement("iframe");
            $(frame).attr("scrolling", "no");
            $(frame).attr("marginheight", "0");
            $(frame).attr("marginwidth", "0");
            $(frame).css({
                width: "100%", height: "auto", "min-height": "880px", border: 0
            });
            $(df).append(frame);
            $(dc).append(df);
            $(frame).attr("src", "../New");
            $(widget._UIDEFAULFS.tabs).append(li);
            $(widget._UIDEFAULFS.tabContents).append(dc);
            if (!$(li).hasClass("active")) {
                $(li).find("a").trigger("click");
            }
        });
    },
    _initGroupNewView: function (options) {
        var viewPath = options.view + "_viewTab_groupNew";
        if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
            Iptools.setDefaults({
                key: "currentNewView",
                value: widget._UIDEFAULFS.tabViewData["#" + viewPath].view
            });
            $("#" + widget._UIDEFAULFS.tabViewData["#" + viewPath].listener).click();
            return;
        }
        var li = document.createElement("li");
        $(li).attr("role", "presentation");
        if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
            $(li).addClass("active");
        }
        var a = document.createElement("a");
        $(a).attr("id", "viewTarget_" + viewPath);
        $(a).attr("href", "#" + viewPath);
        $(a).attr("role", "tab");
        $(a).attr("data-toggle", "tab");
        widget._UIDEFAULFS.tabViewData["#" + viewPath] = {
            target: viewPath,
            listener: "viewTarget_" + viewPath,
            view: options.view,
        };
        Iptools.setDefaults({
            key: "currentNewView",
            value: options.view
        });
        var span = document.createElement("span");
        $(span).addClass("fa fa-times-circle tab-remove");
        $(a).append("新建", span);
        $(li).append(a);
        var dc = document.createElement("div");
        $(dc).attr("role", "tabpanel");
        $(dc).attr("id", viewPath);
        $(dc).addClass("tab-pane");
        if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
            $(dc).addClass("active");
        }
        var df = document.createElement("div");
        $(df).addClass("sectionDiv");
        $(df).css({
            width: "100%", height: "auto", "min-height": "880px", border: 0
        });
        var frame = document.createElement("iframe");
        $(frame).attr("scrolling", "no");
        $(frame).attr("marginheight", "0");
        $(frame).attr("marginwidth", "0");
        $(frame).css({
            width: "100%", height: "auto", "min-height": "880px", border: 0
        });
        $(df).append(frame);
        $(dc).append(df);
        $(frame).attr("src", "../groupNew");
        $(widget._UIDEFAULFS.tabs).append(li);
        $(widget._UIDEFAULFS.tabContents).append(dc);
        if (!$(li).hasClass("active")) {
            $(li).find("a").trigger("click");
        }
    },
    _setUserEnvironment: function () {
        Iptools.GetJson({
            async: false,
            url: "basic/getEmployee",
            data: {
                token: Iptools.DEFAULTS.token
            }
        }).done(function (r) {
            if ($("#application_user").length) {
                $("#application_user").text(r.employee.name);
                $(".user_headpic").attr("src", (r.employee.headPic ? r.employee.headPic : "../Content/Image/defaultHead2.svg"));
            }
        });
    },
    _getViewTabData: function (options) {
        var result = {};
        var viewPath;
        switch (options.level) {
            case "view":
            default:
                viewPath = options.view + "_viewTab_" + options.type;
                if (options.valueId) {
                    viewPath += "_" + options.valueId;
                }
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    result = widget._UIDEFAULFS.tabViewData["#" + viewPath];
                }
                break;
            case "new":
                viewPath = options.applet + "_viewTab_new";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    result = widget._UIDEFAULFS.tabViewData["#" + viewPath];
                }
                break;
            case "groupNew":
                viewPath = options.view + "_viewTab_groupNew";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    result = widget._UIDEFAULFS.tabViewData["#" + viewPath];
                }
                break;
            case "screenAddon":
                viewPath = options.screen + "_screen_addon";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    result = widget._UIDEFAULFS.tabViewData["#" + viewPath];
                }
                break;
        }
        return result;
    },
    _setViewTabData: function (options) {
        var viewPath;
        switch (options.level) {
            case "view":
            default:
                viewPath = options.view + "_viewTab_" + options.type;
                if (options.valueId) {
                    viewPath += "_" + options.valueId;
                }
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    widget._UIDEFAULFS.tabViewData["#" + viewPath][options.key] = options.value;
                }
                break;
            case "new":
                viewPath = options.applet + "_viewTab_new";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    widget._UIDEFAULFS.tabViewData["#" + viewPath][options.key] = options.value;
                }
                break;
            case "groupNew":
                viewPath = options.view + "_viewTab_groupNew";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    widget._UIDEFAULFS.tabViewData["#" + viewPath][options.key] = options.value;
                }
                break;
            case "screenAddon":
                viewPath = options.screen + "_screen_addon";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    widget._UIDEFAULFS.tabViewData["#" + viewPath][options.key] = options.value;
                }
                break;
        }
    },
    _setCoverModalShow: function () {
        $(widget._UIDEFAULFS.coverModal).modal("show");
    },
    _setCoverModalHide: function () {
        $(widget._UIDEFAULFS.coverModal).modal("hide");
    },
    _loadTabs: function () {
        widget._UIDEFAULFS.tabDrag.ulen = $(window).width() - 350;
        widget._UIDEFAULFS.tabDrag.rlen = 0;
        $("#parentTabFolder li").each(function (key, obj) {
            widget._UIDEFAULFS.tabDrag.rlen += $(obj).width();
        });
        if (widget._UIDEFAULFS.tabDrag.rlen > widget._UIDEFAULFS.tabDrag.ulen) {
            var mov = widget._UIDEFAULFS.tabDrag.rlen - widget._UIDEFAULFS.tabDrag.ulen;
            $("#parentTabFolder").css({
                "left": (25 - mov) + "px",
                "padding": "0 15px"
            });
            $(".mainContainer .tabs-control").css("display", "inline-block");
        } else {
            $("#parentTabFolder").css({
                "left": "50px",
                "padding": "0"
            });
            $(".mainContainer .tabs-control").css("display", "none");
        }
    },
    _loadScroll: function () {
        var me = $("#parentTabContents .tab-pane.active");
        if (me.scrollTop() > 50) {
            $("#parentTabFolder").addClass('pull-down');
            $("#header").addClass('pull-down');
        } else {
            $("#parentTabFolder").removeClass('pull-down');
            $("#header").removeClass('pull-down');
        }
    },
    _scrollTabs: function () {
        var nw = $(widget._UIDEFAULFS.tabs).css("left");
        nw = parseInt(nw.substr(0, nw.length - 2));
        if (widget._UIDEFAULFS.scrollWay == "left" && nw < 50) {
            if (50 - nw >= 10) {
                var nl = nw + 10;
                $(widget._UIDEFAULFS.tabs).css("left", nl + "px");
            } else {
                $(widget._UIDEFAULFS.tabs).css("left", "50px");
            }
        } else if (widget._UIDEFAULFS.scrollWay == "right") {
            var len = widget._UIDEFAULFS.tabDrag.rlen - widget._UIDEFAULFS.tabDrag.ulen + 15;
            if (len > 50 - nw) {
                $(widget._UIDEFAULFS.tabs).css("left", (nw - 10) + "px");
            }
        }
    },
    _CloseTab: function (options, jView) {
        var viewPath = options.view + "_viewTab_" + options.type;
        if (options.valueId) {
            viewPath += "_" + options.valueId;
        }
        if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
            $("#" + widget._UIDEFAULFS.tabViewData["#" + viewPath].target).remove();
            $("#" + widget._UIDEFAULFS.tabViewData["#" + viewPath].listener).parent().remove();
            delete widget._UIDEFAULFS.tabViewData["#" + viewPath];
        }
        if (jView) {
            widget._initView(jView);
        } else {
            var a = $(widget._UIDEFAULFS.tabs).find('li:last').find("a");
            a.trigger("click");
            if (options.refresh) {
                setTimeout(function () {
                    $(a.attr("href")).find("iframe").attr("src", $(a.attr("href")).find("iframe").attr("src"));
                }, 100);
            }
        }
        widget._loadTabs();
        widget._loadScroll();
    },
    _enableScreenClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".screenMenuli",
            event: function () {
                if ($(this).data("addon")) {
                    $(widget._UIDEFAULFS.viewBread).html("");
                    widget._clearBreadNav();
                    widget._initBreadNav({
                        viewId: null,
                        viewName: $(this).html(),
                        valueId: null
                    });
                    $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", $(this).data("url"));
                } else {
                    $(this).parents(".screenMenu-container").find(".screenView-container").collapse("toggle");
                }
            }
        });
    },
    _enablePerSettingsClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".pSettingsDropItem",
            event: function () {
                var me = $(this);
                var viewPath = me.data("screen") + "_screen_addon";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    $("#" + widget._UIDEFAULFS.tabViewData["#" + viewPath].listener).click();
                    return;
                }
                var li = document.createElement("li");
                $(li).attr("role", "presentation");
                if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
                    $(li).addClass("active");
                }
                var a = document.createElement("a");
                $(a).attr("id", "viewTarget_" + viewPath);
                $(a).attr("href", "#" + viewPath);
                $(a).attr("role", "tab");
                $(a).attr("data-toggle", "tab");
                widget._UIDEFAULFS.tabViewData["#" + viewPath] = {
                    target: viewPath,
                    listener: "viewTarget_" + viewPath,
                    screen: me.data("screen")
                };
                var span = document.createElement("span");
                $(span).addClass("fa fa-times-circle tab-remove");
                $(a).append(me.data("title"), span);
                $(li).append(a);
                //绑定右键事件
                $(li).bindContextMenu();
                var dc = document.createElement("div");
                $(dc).attr("role", "tabpanel");
                $(dc).attr("id", viewPath);
                $(dc).addClass("tab-pane");
                if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
                    $(dc).addClass("active");
                }
                var df = document.createElement("div");
                $(df).addClass("sectionDiv");
                $(df).css({
                    width: "100%", height: "auto", "min-height": "880px", border: 0
                });
                var frame = document.createElement("iframe");
                $(frame).attr("scrolling", "no");
                $(frame).attr("marginheight", "0");
                $(frame).attr("marginwidth", "0");
                $(frame).css({
                    width: "100%", height: "auto", "min-height": "880px", border: 0
                });
                $(df).append(frame);
                $(dc).append(df);
                $(widget._UIDEFAULFS.tabs).append(li);
                $(widget._UIDEFAULFS.tabContents).append(dc);
                if (!$(li).hasClass("active")) {
                    $(li).find("a").trigger("click");
                }
                $(frame).attr("src", me.data("url"));
            }
        });
    },
    _enableBreadLink: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".breadLinkA",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var btn = $(this);
                if (btn.parent().next("li").length > 0) {
                    btn.parent().nextAll("li").remove();
                    Iptools.uidataTool._getView({
                        view: btn.data("view"),
                    }).done(function (data) {
                        widget._initView({
                            view: btn.data("view"),
                            name: data.view.name,
                            type: data.view.type,
                            valueId: btn.data("value"),
                            primary: data.view.primary,
                            icon: data.view.icon,
                            url: data.view.url,
                            bread: false,
                        });
                    });
                }
            }
        });
    },
    _enableViewSelect: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".screenview-link",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                $(".selected-target").removeClass("selected-target");
                me.addClass("selected-target");
                var tar = me.data("key") + "_viewTab";
                if ($(tar).length > 0) {
                    $(tar).trigger("click");
                } else {
                    Iptools.uidataTool._getView({
                        async: false,
                        view: me.data("key"),
                    }).done(function (data) {
                        widget._initView({
                            view: me.data("key"),
                            name: data.view.name,
                            type: data.view.type,
                            primary: data.view.primary,
                            icon: data.view.icon,
                            url: data.view.url,
                            bread: true,
                        });
                    });
                }
                if ($(widget._UIDEFAULFS.pnav).hasClass("opened")) {
                    $(widget._UIDEFAULFS.pnav).trigger("click");
                }
            }
        });
    },
    _enableSingleScreenClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".screen-single-menu",
            event: function () {
                var me = $(this);
                $(".selected-target").removeClass("selected-target");
                me.addClass("selected-target");
                if ($(widget._UIDEFAULFS.pnav).hasClass("opened")) {
                    $(widget._UIDEFAULFS.pnav).trigger("click");
                }

                var tar = me.data("view") + "_viewTab";
                if ($(tar).length > 0) {
                    $(tar).trigger("click");
                } else {
                    Iptools.uidataTool._getView({
                        async: false,
                        view: me.data("view"),
                    }).done(function (data) {
                        widget._initView({
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
            }
        });
    },
    _enableLogOut: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: "#retractSessionBtn",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                window.localStorage.setItem("loginName", null);
                window.localStorage.setItem("loginPwd", null);
                window.sessionStorage.setItem("token", null);
                self.location = "http://" + Iptools.DEFAULTS.crmDomain + Iptools.DEFAULTS.hostPath;
            }
        });
    },
    _enableTabRemove: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".tab-remove",
            event: function () {
                var a = $(this).parent();
                var tablis = $(widget._UIDEFAULFS.tabs).find("li");
                //当前要关闭li在tab中的位置
                var index = $(widget._UIDEFAULFS.tabs).find("li").index(a.parent());
                //大于1个tab
                if (tablis.length > 1) {
                    //如果前边大于1个，当前关闭的前一个显示
                    if (index > 0) {
                        tablis.eq(index - 1).find("a:first").tab("show");
                    } else {
                        tablis.eq(1).find("a:first").tab("show");
                    }
                }
                $(a.attr("href")).remove();
                a.parent().remove();
                if (widget._UIDEFAULFS.tabViewData[a.attr("href")]) {
                    delete widget._UIDEFAULFS.tabViewData[a.attr("href")];
                }
                widget._loadTabs();
                widget._loadScroll();
            }
        });
    },
    _enableScreenMenuShow: function () {
        widget._addEventListener({
            container: "body",
            type: "show.metisMenu",
            target: widget._UIDEFAULFS.screenPanel,
            event: function (e) {
                $(e.target).parent().find(".arrow-slide:first").removeClass("fa-plus").addClass("fa-minus");
            }
        });
    },
    _enableScreenMenuHide: function () {
        widget._addEventListener({
            container: "body",
            type: "hide.metisMenu",
            target: widget._UIDEFAULFS.screenPanel,
            event: function (e) {
                $(e.target).parent().find(".arrow-slide:first").removeClass("fa-minus").addClass("fa-plus");
            }
        });
    },
    _enableScreenMenuAddons: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".screen-menu-addon",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                $(".selected-target").removeClass("selected-target");
                me.addClass("selected-target");
                //收起二级菜单
                $("#screenMenu li.active a:first").trigger("click");
                $("#screenMenu").find("li").removeClass("active");
                $(widget._UIDEFAULFS.screenPanel).trigger("hide.metisMenu");

                var viewPath = me.data("screen") + "_screen_addon";
                if (widget._UIDEFAULFS.tabViewData["#" + viewPath]) {
                    $("#" + widget._UIDEFAULFS.tabViewData["#" + viewPath].listener).click();
                    return;
                }
                var li = document.createElement("li");
                $(li).attr("role", "presentation");
                if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
                    $(li).addClass("active");
                }
                var a = document.createElement("a");
                $(a).attr("id", "viewTarget_" + viewPath);
                $(a).attr("href", "#" + viewPath);
                $(a).attr("role", "tab");
                $(a).attr("data-toggle", "tab");
                widget._UIDEFAULFS.tabViewData["#" + viewPath] = {
                    target: viewPath,
                    listener: "viewTarget_" + viewPath,
                    screen: me.data("screen")
                };
                var span = document.createElement("span");
                $(span).addClass("fa fa-times-circle tab-remove");
                $(a).append(me.data("name"), span);
                $(li).append(a);
                var dc = document.createElement("div");
                $(dc).attr("role", "tabpanel");
                $(dc).attr("id", viewPath);
                $(dc).addClass("tab-pane");
                if ($(widget._UIDEFAULFS.tabs).find("li").length <= 0) {
                    $(dc).addClass("active");
                }
                var df = document.createElement("div");
                $(df).addClass("sectionDiv");
                $(df).css({
                    width: "100%", height: "auto", "min-height": "880px", border: 0
                });
                var frame = document.createElement("iframe");
                $(frame).attr("scrolling", "no");
                $(frame).attr("marginheight", "0");
                $(frame).attr("marginwidth", "0");
                $(frame).addClass("statisticsIframe");
                $(frame).css({
                    width: "100%", height: "auto", "min-height": "880px", border: 0
                });
                $(df).append(frame);
                $(dc).append(df);
                //绑定右键事件
                $(li).bindContextMenu();
                $(widget._UIDEFAULFS.tabs).append(li);
                $(widget._UIDEFAULFS.tabContents).append(dc);
                if (!$(li).hasClass("active")) {
                    $(li).find("a").trigger("click");
                }
                $(frame).attr("src", me.data("url"));
            }
        });
    },
    _enableViewTabShow: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.tab",
            target: "#parentTabFolder a",
            event: function () {
                var me = $(this);
                var data = widget._UIDEFAULFS.tabViewData[me.attr("href")];
                if (!data) return;
                if (Iptools.Tool._checkNull(data.screen)) {
                    Iptools.setDefaults({
                        key: "currentScreen",
                        value: data.screen
                    });
                }
                if (Iptools.Tool._checkNull(data.view)) {
                    Iptools.setDefaults({
                        key: "currentView",
                        value: data.view
                    });
                    Iptools.setDefaults({
                        key: "currentNewView",
                        value: data.view
                    });
                }
                if (Iptools.Tool._checkNull(data.applet)) {
                    Iptools.setDefaults({
                        key: "currentViewApplet",
                        value: data.applet
                    });
                    Iptools.setDefaults({
                        key: "currentNewApplet",
                        value: data.applet
                    });
                }
                if (Iptools.Tool._checkNull(data.valueId)) {
                    Iptools.setDefaults({
                        key: "currentViewValue",
                        value: data.valueId
                    });
                }
                if (Iptools.Tool._checkNull(data.condition)) {
                    Iptools.setDefaults({
                        key: "currentViewCondition",
                        value: data.condition
                    });
                }
                if (Iptools.Tool._checkNull(data.detectValue)) {
                    Iptools.setDefaults({
                        key: "currentViewDetectValue",
                        value: data.detectValue
                    });
                }
            }
        });
        widget._addEventListener({
            container: "body",
            type: "shown.bs.tab",
            target: "#parentTabFolder a",
            event: function () {
                widget._loadScroll();
            }
        });
    },
    _enableNavigatePull: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: widget._UIDEFAULFS.pnav,
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                var me = $(this);
                if (!me.hasClass("move")) {
                    //打开状态
                    if (me.hasClass("opened")) {
                        me.addClass("move");
                        $("#pullNavigator").attr("title", "点击此处展开侧边栏");
                        widget._UIDEFAULFS.barStatus = 0;
                        $(widget._UIDEFAULFS.screenHolder).find(".sidebar").hide();
                        $(".left-banner").css({ "min-width": "0" });
                        //小视图情况
                        $(".left-banner").animate({
                            width: "50px",
                        }, 600, function () {
                            me.removeClass("move");
                            me.removeClass("opened");
                            $(widget._UIDEFAULFS.screenHolder).find(".menuIconbar").show();
                            $(widget._UIDEFAULFS.screenHolder).css({
                                width: "50px"
                            });
                        });
                        $("#pullNavigator span.pull-text").hide();
                        //logo
                        $("#pullNavigator").animate({
                            width: "50px"
                        }, 600);
                        //图标垂直
                        me.find("span:first").css({
                            transform: "rotate(-90deg)",
                        });
                    } else {
                        me.addClass("move");
                        $("#pullNavigator").attr("title", "点击此处收缩侧边栏");
                        widget._UIDEFAULFS.barStatus = 1;
                        $(widget._UIDEFAULFS.screenHolder).find(".menuIconbar").hide();
                        $(widget._UIDEFAULFS.screenHolder).css({
                            width: "230px"
                        });
                        $(".left-banner").animate({
                            width: "230px",
                        }, 600, function () {
                            me.removeClass("move");
                            me.addClass("opened");
                            $(widget._UIDEFAULFS.screenHolder).find(".sidebar").show();
                        });
                        //logo
                        $("#pullNavigator").animate({
                            width: "230px"
                        }, 600, function () {
                            $("#pullNavigator span.pull-text").show();
                        });
                        me.find("span:first").css({
                            transform: "rotate(0)"
                        });
                    }
                }
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mousedown",
            target: ".tabs-control",
            event: function () {
                if ($(this).hasClass("left")) {
                    widget._UIDEFAULFS.scrollWay = "left";
                } else if ($(this).hasClass("right")) {
                    widget._UIDEFAULFS.scrollWay = "right";
                }
                widget._UIDEFAULFS.scrollListner = setInterval(widget._scrollTabs, 30);
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mouseup",
            target: ".tabs-control",
            event: function () {
                clearInterval(widget._UIDEFAULFS.scrollListner);
            }
        });
        widget._addEventListener({
            container: "body",
            type: "hover",
            target: ".tool-ip button",
            event: function () {
                var me = $(this);
                me.parent().css({
                    overflow: "auto"
                });
                me.dropdown("toggle");
            }
        });
        widget._addEventListener({
            container: "body",
            type: "blur",
            target: ".tool-ip button",
            event: function () {
                var me = $(this);
                me.dropdown("toggle");
            }
        });
        //当侧边栏收拢的时候，鼠标进入的时候,出现二级菜单
        widget._addEventListener({
            container: "body",
            type: "mouseenter",
            target: "#short_screenMenu .menuList",
            event: function () {
                $(this).find("ul.menuShow").css("display", "block");
            }
        });
        widget._addEventListener({
            container: "body",
            type: "mouseleave",
            target: "#short_screenMenu .menuList",
            event: function () {
                $(this).find("ul.menuShow").css("display", "none");
            }
        });
    },
    _enableQueryListJumpView: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".tool-v-link",
            event: function () {
                Iptools.uidataTool._getCustomizeView({
                    nameList: "'" + $(this).data("v-name") + "'"
                }).done(function (data) {
                    if (data.views.length) {
                        Iptools.uidataTool._getView({
                            view: data.views[0].view
                        }).done(function (r) {
                            Iptools.Tool._jumpView({
                                view: data.views[0].view,
                                name: r.view.name,
                                type: r.view.type,
                                url: r.view.url,
                                bread: true
                            });
                        });
                    }
                });
            }
        });
    },
    _enableFullScreen: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".full-screen-sizer",
            event: function () {
                try {
                    var dd = document.documentElement, rfs, wscript;
                    var me = $(this);
                    if (me.data("full") == "0") {
                        me.find("span").html("&#xe7a8;");
                        me.data("full", "1");
                        rfs = dd.requestFullScreen || dd.webkitRequestFullScreen || dd.mozRequestFullScreen || dd.msRequestFullScreen;
                        if (typeof rfs != "undefined" && rfs) {
                            rfs.call(dd);
                        } else if (typeof window.ActiveXObject != "undefined") {
                            wscript = new ActiveXObject("WScript.Shell");
                            wscript.SendKeys("{F11}");
                        }
                    } else if (me.data("full") == "1") {
                        me.find("span").html("&#xe7b5;");
                        me.data("full", "0");
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        }
                        else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        }
                        else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        }
                        else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                    }
                } catch (e) { }
            }
        });
    },
    _enablePersonInfoModal: function () {
        widget._addEventListener({
            container: "body",
            type: "show.bs.dropdown",
            target: ".application-funcBar",
            event: function () {
                $(".tabs-control.right").css("z-index", "0");
            }
        });
        widget._addEventListener({
            container: "body",
            type: "hide.bs.dropdown",
            target: ".application-funcBar",
            event: function () {
                $(".tabs-control.right").css("z-index", "2");
            }
        });
    },
    _enableIconList: function () {
        $('.comp-content span.name').html(Iptools.DEFAULTS.tenantId);
        $(".changeLayout").hover(function () {
            $(this).addClass("changeLayout_hover");
            $(this).find('span').show();
        }, function () {
            $(this).removeClass("changeLayout_hover");
            $(this).find('span').hide();
        });
        $(".companyId").hover(function () {
            $('.comp-content').show();
            $('.comp-content').css('display', 'block');
        }, function () {
            $('.comp-content').hide();
        });
        $(".code").hover(function () {
            $(this).addClass("code_hover");
            $(this).find('.pic').show();
        }, function () {
            $(this).removeClass("code_hover");
            $(this).find('.pic').hide();
        });
        $('.goBack').click(function () {
            $(".mainContainer").animate({
                scrollTop: 0
            }, 500);
        });
        $('.mainContainer').on('scroll', function () {
            if ($('.mainContainer').scrollTop() > 200) {
                $('.goBack').fadeIn();
            } else {
                $('.goBack').fadeOut();
            }
        });
    },
    _enableContentScroll: function () {
        $("#parentTabContents .tab-pane").scroll(function () {
            var me = $(this);
            if (me.scrollTop() > 50) {
                $("#parentTabFolder").addClass('pull-down');
                $("#header").addClass('pull-down');
            } else {
                $("#parentTabFolder").removeClass('pull-down');
                $("#header").removeClass('pull-down');
            }
        });
    }
};
//右键菜单
(function ($) {
    $.fn.extend({
        "bindContextMenu": function () {
            $widget.init();
            $(this)[0].addEventListener('contextmenu', function (e) {
                e.preventDefault();
                $widget.showMenu(e.pageX, e.pageY, $(this));
            }, false);
        }
    });
    var $widget = {
        param: {
            menu: "",
            $parentDom: ""
        },
        init: function () {
            $widget.domReady();
            $widget.param.menu = $('.contextMenu');
            $widget.bindEventAfterDomReady();
        },
        bindEventAfterDomReady: function () {
            $widget.refreshCurrentTab();
            $widget.documentClick();
            $widget.closeAllTabs();
            $widget.closeOtherTab();
            $widget.closeCurrentTab();
        },
        domReady: function () {
            var html = "";
            html += '<menu class="contextMenu">' +
				'<li class="menu-item cur-refresh">刷新</li>' +
				'<li class="menu-item cur-close">关闭当前</li>' +
				'<li class="menu-item other-close">关闭其他</li>' +
				'<li class="menu-separator"></li>' +
				'<li class="menu-item all-close">关闭所有</li>' +
			    '</menu>';
            $("body").append(html);
        },
        //showmenu并移动到光标位置
        showMenu: function (x, y, $this) {
            $widget.param.$parentDom = $this;
            $widget.param.menu.css("left", x + 'px');
            $widget.param.menu.css("top", y + 'px');
            $widget.param.menu.addClass('show-menu');
            var tabs = $this.closest("ul").find("li");
            //第一个的时候只有刷新和关闭当前
            if ($this.find("a").attr("id").split("_")[3] === "home") {
                //等于1--只有刷新
                if (tabs.length === 1) {
                    $(".contextMenu").find(".cur-close").hide();
                    $(".contextMenu").find(".other-close").hide();
                    $(".contextMenu").find(".menu-separator").hide();
                    $(".contextMenu").find(".all-close").hide();
                } else {
                    $(".contextMenu").find(".cur-close").hide();
                    $(".contextMenu").find(".menu-separator").hide();
                    $(".contextMenu").find(".all-close").hide();
                }

            } else {
                $(".contextMenu").find(".cur-close").show();
                $(".contextMenu").find(".other-close").show();
                $(".contextMenu").find(".menu-separator").show();
                $(".contextMenu").find(".all-close").show();
            }
        },
        hideMenu: function () {
            $widget.param.menu.removeClass('show-menu');
        },
        documentClick: function () {
            $(document).on("click", function (e) {
                var clkArea = $(e.target);
                if (!clkArea.hasClass("contextMenu")) {
                    $widget.hideMenu();
                }
            });
        },
        refreshCurrentTab: function () {
            $(".cur-refresh").on("click", function () {
                $widget.hideMenu();
                var idarr = $widget.param.$parentDom.find("a").attr("id");
                var index = idarr.indexOf("_");
                var viewPath = idarr.substr(index + 1);
                $("#" + viewPath).find("iframe").attr("src", $("#" + viewPath).find("iframe").attr("src"));
            });
        },
        closeAllTabs: function () {
            $(".all-close").on("click", function () {
                $widget.hideMenu();
                //关闭
                var tabs = $widget.param.$parentDom.parent("ul").find(".tab-remove");
                for (var i = 1; i < tabs.length; i++) {
                    $(tabs[i]).trigger("click");
                }
            });
        },
        closeOtherTab: function () {
            $(".other-close").on("click", function () {
                var otherTabs = [];
                $widget.hideMenu();
                //关闭所有
                var tabs = $widget.param.$parentDom.parent("ul").find(".tab-remove");
                var len = tabs.length;
                for (var i = 1; i < len; i++) {
                    if (!$(tabs[i]).closest("li").hasClass("active") && $widget.param.$parentDom.find("a").attr("id").split("_")[3] !== "home") {
                        otherTabs.push(tabs[i]);
                    } else {
                        continue;
                    }
                }
                if (otherTabs.length > 0) {
                    for (var j = 0; j < otherTabs.length; j++) {
                        $(otherTabs[j]).trigger("click");
                    }
                }
                $widget.param.$parentDom.find("a:first").tab("show");
            });
        },
        closeCurrentTab: function () {
            $(".cur-close").on("click", function () {
                $widget.param.$parentDom.find(".tab-remove").trigger("click");
            });
        }
    }
})(jQuery)