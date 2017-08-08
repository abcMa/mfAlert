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
        viewTabData: {}
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
        Iptools.uidataTool._getUserSettings().done(function (ds) {
            var target = $(widget._UIDEFAULFS.perMenu).find("li:first");
            for (var i = 0; i < ds.settings.length; i++) {
                switch (ds.settings[i].code) {
                    case "screenaddon":
                        var d = document.createElement("div");
                        $(d).attr("class", "screenMenuli");
                        $(d).attr("data-addon", true);
                        $(d).data("url", ds.settings[i].url);
                        $(d).css("display", "inline-block");
                        var spi = document.createElement("span");
//                        $(spi).attr("class", "screenIcons " + ds.settings[i].icon);
                        $(spi).attr("class","iconfont screenIcon");
                        $(spi).html(ds.settings[i].icon);
                        var spc = document.createElement("span");
                        $(spc).attr("class", "icon-content");
                        $(spc).html(ds.settings[i].title);
                        $(spc).css("display", "inline");
                        $(d).append(spi);
                        $(d).append(spc);
                        $(widget._UIDEFAULFS.screenPanel).parent().append(d);
                        break;
                    case "cdrop":
                    default:
                        var li = document.createElement("li");
                        var a = document.createElement("a");
                        $(a).attr("href", "javascript:;");
                        $(a).addClass("pSettingsDropItem");
                        $(a).data("url", ds.settings[i].url);
                        $(a).data("title", ds.settings[i].title);
                        var sp = document.createElement("span");
                        $(sp).addClass(ds.settings[i].icon);
                        $(a).append(sp, ds.settings[i].title);
                        $(li).append(a);
                        $(li).insertBefore(target);
                        break;
                }
            }
        });
    },
    _bindingDomEvent: function () {
        widget._enableScreenClick();
        widget._enableSecondMenuHover();
        widget._enableScreenHover();
        widget._enablePerSettingsClick();
        widget._enableBreadLink();
        widget._enableViewSelect();
        widget._enableLogOut();
        widget._enableIconList();
        widget._enableQueryListJumpView();
        widget._enableFullScreen();
    },
    _initBreadNav: function (options) {
        var e = document.createElement("a");
        $(e).addClass("breadLinkA");
        if (options.singlePage) {
            $(e).addClass("singleView");
            $(e).data("url", options.url);
        }
        e.setAttribute("data-view", options.viewId);
        e.setAttribute("data-value", options.valueId ? options.valueId : null);
        e.setAttribute("data-condition", options.condition ? options.condition : "");
        $(e).html(options.viewName);
        var l = document.createElement("li");
        l.appendChild(e);
        $(".breadNav").append(l);
    },
    _clearBreadNav: function () {
        $(".breadNav").find("li").remove();
    },
    _init: function () {
        widget._initScreenMenu();
        //widget._popCollectNotify();
    },
    //_popCollectNotify: function () {
    //    Iptools.Tool.Alert({
    //        title: "温馨提示",
    //        content: "[Ctrl+D] 将“易掌客工作台”放入收藏夹，客户管理快人一步！",
    //        delay: 0
    //    });
    //},
    _initScreenMenu: function () {
        widget._environmentSettings();
        widget._bindingDomEvent();
        var singleton = true;
        Iptools.uidataTool._getScreenMenu().done(function (ds) {
            //init screen panels html
            for (var i = 0; i < ds.screens.length; i++) {
                var d = document.createElement("div");
                $(d).attr("class", "screenMenuli" + (singleton ? " screen-selected" : ""));
                $(d).attr("data-screen", ds.screens[i].id);
                var spi = document.createElement("span");
                //$(spi).attr("class", "screenIcons " + (ds.screens[i].icon ? ds.screens[i].icon : "icon-home"));
                //$(spi).attr("class","iconfont screenIcon");
                $(spi).attr("class",'iconfont '+ds.screens[i].icon+'');
                //$(spi).html(ds.screens[i].icon);
                var spc = document.createElement("span");
                $(spc).attr("class", "icon-content");
                $(spc).html(ds.screens[i].name);
                $(spc).css("display", "inline");
                $(d).append(spi);
                $(d).append(spc);
                var l = document.createElement("li");
                $(l).append(d);
                $(widget._UIDEFAULFS.screenPanel).append(l);
                if (singleton) {
                    widget._initScreen({
                        screen: ds.screens[i].id,
                        conditions: []
                    });
                }
                singleton = false;
            }
        });
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
                //二级菜单
//                for (var i = 0; i < ds.views.length; i++) {
//                    var l = document.createElement("li");
//                    if (i == 0) {
//                        $(l).addClass("active");
//                        $(l).html(ds.views[i].name);
//                        $(l).data("key", ds.views[i].id);
//                    } else {
//                        var a = document.createElement("a");
//                        $(a).html(ds.views[i].name);
//                        $(l).data("key", ds.views[i].id);
//                        $(a).data("key", ds.views[i].id);
//                        $(l).append(a);
//                    }
//                    $(widget._UIDEFAULFS.viewBread).append(l);
//                }
//                if (ds.views.length == 1) {
//                    $(".viewBarContainer").hide();
//                } else {
//                    $(".viewBarContainer").show();
//                }
            }
            if (optionspara) widget._initView(optionspara);
        });
    },
    _initView: function (options) {
        Iptools.setDefaults({
            key: "currentView",
            value: options.view
        });
        Iptools.setDefaults({
            key: "currentViewName",
            value: options.name
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
        if (options.clear) {
            widget._clearBreadNav();
        }
        if (options.bread) {
            widget._initBreadNav({
                viewId: options.view,
                viewName: options.name,
                valueId: options.valueId
            });
        }
        if (Iptools.Tool._checkNull(options.url)) {
            $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", options.url);
        } else {
            switch (options.type) {
                case "list":
                default:
                    $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", "../lView");
                    break;
                case "detail":
                    $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", "../dView");
                    break;
            }
        }
    },
    _initDataNewView: function (options) {
        Iptools.setDefaults({
            key: "currentNewApplet",
            value: options.applet
        });
        Iptools.uidataTool._getApplet({
            applet: options.applet
        }).done(function (data) {
            widget._initBreadNav({
                viewId: null,
                viewName: data.applet.displayName,
                valueId: null,
                singlePage: true,
                url: "../New"
            });
        });
        $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", "../New");
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
        Iptools.GetJson({
            url:"basic/getMerchantInfoByTenantId",
            data:{
                tenantId:Iptools.DEFAULTS.tenantId
            }
        }).done(function (data) {
            if(data){
                document.title = data.shortName + "——工作台";
            }
        });
    },
    _getViewTabData: function () {
        return widget._UIDEFAULFS.viewTabData;
    },
    _setViewTabData: function (options) {
        widget._UIDEFAULFS.viewTabData[options.key] = options.value;
    },
    _setUserEnvironment: function () {
        Iptools.GetJson({
            url: "basic/employees/" + Iptools.getDefaults({ key: "userId" }),
            data: {
                tenantId: Iptools.getDefaults({ key: "tenantId" })
            }
        }).done(function (r) {
            if ($("#application_user").length) {
                $("#application_user").text(r.name);
                $(".user_headpic").attr("src", (r.headPic ? r.headPic : "../Content/Image/defaultHead2.svg"));
            }
        });
        Iptools.GetJson({
            url:"basic/getMerchantInfoByTenantId",
            data:{
                tenantId:Iptools.DEFAULTS.tenantId
            }
        }).done(function (data) {
            if(data){
                document.title = data.shortName + "——工作台";
            }
        });
    },
    _setCoverModalShow: function () {
        $(widget._UIDEFAULFS.coverModal).modal("show");
    },
    _setCoverModalHide: function () {
        $(widget._UIDEFAULFS.coverModal).modal("hide");
    },
    _setBreadCondition: function (options) {
        $(".breadNav").find("li:last a").data("condition", options.condition);
    },
    _setBreadDetectValue: function (options) {
        $(".breadNav").find("li:last a").data("detectValue", options.detectValue);
    },
    _enableSecondMenuHover:function(){
    	$(document).on("mouseenter", ".secondMenuArea", function() {
        	//$(".screenMenuli").removeClass("screen-selected");
	         // $(this).addClass("screen-selected");
    		  //$(this).parent("li").find(".screenMenuli").css({"color":"#ff6c60","background":"#35404d"});
	          $(this).show();
//	          if ($(this).data("addon")) {
//	              //$(widget._UIDEFAULFS.viewBread).html("");
//	              $(".viewBarContainer").hide();
//	              widget._clearBreadNav();
//	              widget._initBreadNav({
//	                  viewId: null,
//	                  viewName: $(this).html(),
//	                  valueId: null,
//	                  singlePage: true,
//	                  url: $(this).data("url")
//	              });
//	              $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", $(this).data("url"));
//	          } else {
//	              widget.initScreenHoverMenu($(this),{
//	                  screen: $(this).data("screen")
//	              });
//	          }
        });
        $(document).on("mouseleave", ".secondMenuArea", function() {
        	//$(this).parent("li").find(".screenMenuli").css({"color":"#fff","background":"#2a3542"});
        	$(this).hide();
        });
    },
    _enableScreenHover:function(){
        $(document).on("mouseenter", ".screenMenuli", function() {
	          $(".secondMenuArea").hide();
	          if($(this).parent("li").find(".secondMenuArea").length !== 0){
	        	  $(this).parent("li").find(".secondMenuArea").show();
	          }else{
	        	  if ($(this).data("addon")) {
//	                    $(widget._UIDEFAULFS.viewBread).html("");
//	                    $(".viewBarContainer").hide();
//	                    widget._clearBreadNav();
//	                    widget._initBreadNav({
//	                        viewId: null,
//	                        viewName: $(this).html(),
//	                        valueId: null,
//	                        singlePage: true,
//	                        url: $(this).data("url")
//	                    });
//	                    $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", $(this).data("url"));
	        		  return;
	                } else {
		              widget.initScreenHoverMenu($(this),{
		                  screen: $(this).data("screen")
		              });
	                }
	          }
	          
        });
        
        $(document).on("mouseleave", ".screenMenuli", function() {
        	var $this = $(this);
        	//var st=setTimeout(function(){
        	if($this.parent("li").find(".secondMenuArea").css("display") === "none"){
        		$this.parent("li").find(".secondMenuArea").hide();
        	}else{
        		return false;
        	}
        	
        	//},3000);
        	
        });
    },
    _enableScreenClick: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            target: ".screenMenuli",
            event: function () {
                $(".screenMenuli").removeClass("screen-selected");
                $(this).addClass("screen-selected");
                $(".secondMenuArea").find("li.active").each(function (key, obj) {
                    $(obj).removeClass("active");
                    $(obj).html("<a data-key='" + $(obj).data("key") + "'>" + $(obj).html() + "</a>");
                });
                if ($(this).data("addon")) {
                    $(widget._UIDEFAULFS.viewBread).html("");
                    $(".viewBarContainer").hide();
                    widget._clearBreadNav();
                    widget._initBreadNav({
                        viewId: null,
                        viewName: $(this).html(),
                        valueId: null,
                        singlePage: true,
                        url: $(this).data("url")
                    });
                    $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", $(this).data("url"));
                } else {
                    widget._initScreen({
                        screen: $(this).data("screen")
                    });
                }
            }
        });
        $(".screenMenuli").hover(function () {
        	  $(".screenMenuli").removeClass("screen-selected");
	          $(this).addClass("screen-selected");
	          if ($(this).data("addon")) {
	              $(widget._UIDEFAULFS.viewBread).html("");
	              $(".viewBarContainer").hide();
	              widget._clearBreadNav();
	              widget._initBreadNav({
	                  viewId: null,
	                  viewName: $(this).html(),
	                  valueId: null,
	                  singlePage: true,
	                  url: $(this).data("url")
	              });
	              $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", $(this).data("url"));
	          } else {
	              widget._initScreen({
	                  screen: $(this).data("screen")
	              });
	          }
        }, function () {
            $(this).removeClass("changeLayout_hover");
            $(this).find('span').hide();
        });
    },
    initScreenHoverMenu:function($evt,options){
        //widget._clearBreadNav();//clear all exist bread links before loading any screen
        Iptools.setDefaults({
            key: "currentScreen",
            value: options.screen
        });
        Iptools.uidataTool._getViews({
            screen: options.screen
        }).done(function (ds) {
            var optionspara;
            //$(widget._UIDEFAULFS.viewBread).html("");
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
                if (ds.views.length > 1) {
                	var d= document.createElement("div");
                    $(d).addClass("secondMenuArea");
                    $(d).append('<span class="iconfont secondMenuHorn">&#xe7a2;</span>');
                    for (var i = 0; i < ds.views.length; i++) {
                    	
                        var l = document.createElement("li");
                        //这里不需要初始化primary applet
//                        if (i == 0) {
//                            $(l).addClass("active");
//                            $(l).html(ds.views[i].name);
//                            $(l).data("key", ds.views[i].id);
//                        } else {
                            var a = document.createElement("a");
                            $(a).html(ds.views[i].name);
                            $(l).data("key", ds.views[i].id);
                            $(a).data("key", ds.views[i].id);
                            $(l).append(a);
//                        }
                        $(d).append(l);
                        $evt.parent("li").append(d);
                    }
                    
                }
                //if (optionspara) widget._initView(optionspara);
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
                widget._clearBreadNav();
                widget._initBreadNav({
                    viewId: null,
                    viewName: me.data("title"),
                    valueId: null,
                    singlePage: true,
                    url: me.data("url")
                });
                $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", me.data("url"));
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
                    if (btn.hasClass("singleView")) {
                        $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", btn.data("url"));
                    } else {
                        Iptools.uidataTool._getView({
                            view: btn.data("view"),
                        }).done(function (data) {
                            widget._initView({
                                view: btn.data("view"),
                                name: data.view.name,
                                type: data.view.type,
                                valueId: btn.data("value"),
                                condition: btn.data("condition"),
                                detectValue: btn.data("detectValue"),
                                primary: data.view.primary,
                                icon: data.view.icon,
                                url: data.view.url,
                                bread: false,
                            });
                        });
                    }
                }
            }
        });
    },
    _enableViewSelect: function () {
        widget._addEventListener({
            container: "body",
            type: "click",
            //target: ".viewBread li a",
            target: ".secondMenuArea li a",
            event: function (e) {
                e = e || event;
                e.stopPropagation();
                //$(widget._UIDEFAULFS.viewBread).find("li.active").each(function (key, obj) {
                //    $(obj).removeClass("active");
                //    $(obj).html("<a data-key='" + $(obj).data("key") + "'>" + $(obj).html() + "</a>");
                //});
                $(".secondMenuArea").find("li.active").removeClass("active");
                $(this).parents("#screenMenu").find(".screenMenuli").removeClass("screen-selected");
                $(this).parents(".secondMenuArea").closest("li").find(".screenMenuli").addClass("screen-selected");
                $(this).parents(".secondMenuArea").find("li.active").each(function (key, obj) {
                  $(obj).removeClass("active");
                  $(obj).html("<a data-key='" + $(obj).data("key") + "'>" + $(obj).html() + "</a>");
              　});
                var btn = $(this);
                var vkey = btn.data("key");
                var ah = btn.html();
                btn.parent().addClass("active");
                btn.parent().html(ah);
                Iptools.uidataTool._getView({
                    view: vkey,
                }).done(function (data) {
                    widget._initView({
                        view: vkey,
                        name: data.view.name,
                        type: data.view.type,
                        primary: data.view.primary,
                        icon: data.view.icon,
                        url: data.view.url,
                        bread: true,
                        clear: true,
                    });
                    $(this).parents(".secondMenuArea").hide();
                });
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
                self.location = "../";
            }
        });
    },
    _initGroupNewView: function (options) {
        Iptools.setDefaults({
            key: "currentNewView",
            value: options.view
        });
        widget._initBreadNav({
            viewId: null,
            viewName: "新建",
            valueId: null,
            singlePage: true,
            url: "../groupNew"
        });
        $(widget._UIDEFAULFS.mainArea).find("iframe").attr("src", "../groupNew");
    },
    _enableIconList: function () {
        $('.companyId span span').html(Iptools.DEFAULTS.tenantId);
        $(".changeLayout").hover(function () {
            $(this).addClass("changeLayout_hover");
            $(this).find('span').show();
        }, function () {
            $(this).removeClass("changeLayout_hover");
            $(this).find('span').hide();
        });
        $(".companyId").hover(function () {
            $(this).addClass("companyId_hover");
            $(this).find('span').show();
            $(this).find('span').css('display', 'inline-block');
        }, function () {
            $(this).removeClass("companyId_hover");
            $(this).find('span').hide();
        });
        $(".code").hover(function () {
            $(this).addClass("code_hover");
            $(this).find('.pic').show();
        }, function () {
            $(this).removeClass("code_hover");
            $(this).find('.pic').hide();
        });
        $('.goBack').click(function () {
            $("html,body").animate({
                scrollTop: 0
            }, 500);
        });
        $(window).scroll(function () {
            if ($(document).scrollTop() > 200) {
                $('.goBack').fadeIn();
            } else {
                $('.goBack').fadeOut();
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
};