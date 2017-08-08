//IntoPalm webtools js file
//Author :Ethan
//Created :2016-7-19
//use :LIST
/**
 * ui element styles and placement this widget is only adapted to CRM workspace
 * for PC style :tag panels listing and horizend placements style
 */
var widget = {};
widget = {
    /*
     * ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        mainArea: "#mainArea",
        buttonPanel: "#buttonListPanel",
        mainPanel: "#contentPanel",
        searchPanle: "#searchPanel",
        ExportModal: "#ExportModal",
        mainSearchModal: "#mainListSearchModal",
        detailSearchPanle: "#modalList_body",
        defaultPicturePath: "../Content/Image/defaultHead.png",
        condition: {},
        modalCondition: {},
        searchClick: false
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    /*
     * container : type : target : event :
     */
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _initBreadNav: function (options) {
        var e = document.createElement("a");
        e.setAttribute("class", "breadLinkA");
        e.setAttribute("data-view", options.viewId);
        e.setAttribute("data-value", options.valueId ? options.valueId : null);
        $(e).html(options.viewName);
        var l = document.createElement("li");
        l.appendChild(e);
        $(".breadNav", window.parent.document).append(l);
    },
    _clearBreadNav: function () {
        $(".breadNav", window.parent.document).find("li").remove();
    },
    _bindingDomEvent: function () {
    },
    _bindingEventAfterLoad: function () {
        widget._enableTimeOrDateField();
    },
    _init: function () {
        widget._bindingDomEvent();
        widget._initPage({
            pageNow: 1
        });
    },
    _initPage: function (options) {
        widget._initView();
    },
    _reFreshView: function () {
        Iptools.uidataTool._getView({
            view: Iptools.DEFAULTS.currentView,
        }).done(function (data) {
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
        widget.buildList();
    },
    buildList: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign List Applet Multi'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                component._table(".mainSection", {
                    pageNow: 1,
                    pageSize: 10,
                    showChecks: false,
                    applet: r.applets[0].applet,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "还没有开展活动，快去创建活动和客户互动起来",
                    emptySearch:"没有搜索到数据，请更换关键词后再次搜索",
                    emptyClick: function () {
                        Iptools.uidataTool._getCustomizeView({
                            nameList: "'campaign_new'"
                        }).done(function(data){
                            if (data && data.views.length) {
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
                        })
                    },
                    jumpType: "template",//操作列跳转类型
                    jumpTemplate: "<a class='campaign-edit' title='查看活动详情'><span class='fa fa-edit'></span></a>",////操作列dom
                    events: [//table中的事件
                        {
                            target: ".campaign-edit",//编辑
                            type: "click",
                            event: function () {
                                widget._enableClickDetail({"$this":$(this)});

                            }
                        },
                        {
                            target:".title-link",//详情
                            type: "click",
                            event: function () {
                                widget._enableClickDetail({"$this":$(this)});

                            }
                        }
                    ],
                    dataModify: function (rs) {//更改数据列--columns为表头，data.records为表数据，更改完进行渲染表
                        var promise = $.Deferred();
                        if (rs) {
                            if (rs.columns && rs.columns.length) {
                                //添加元素
                                //rs.columns.splice(2, 0, {
                                //    type: "text",
                                //    column: "campaign_status",
                                //    name: "活动状态",//启用和停用两种状态
                                //});
                                rs.columns.splice(3, 0, {
                                    type: "text",
                                    column: "custom_pv",
                                    name: "页面访问PV",
                                });
                                rs.columns.splice(4, 0, {
                                    type: "text",
                                    column: "custom_entryNo",
                                    name: "参与人数",
                                });
                                var sceneName = "campaign:campaign_scene_id",viewName = "campaign_h5:view_address",CampaignIdName = "campaign:id",h5IdName = "campaign_h5:id",titleName = "campaign:title";
                                if (rs.data && rs.data.records && rs.data.records.length) {
                                    for (var i = 0; i < rs.data.records.length; i++) {
                                        var rec = rs.data.records[i];
                                        //二维码
                                        rec[viewName] = "<span class='icon-spin icon-spinner ewmArea' " +
                                            "data-h5id='" + rec[rs.rootLink + ":id"] + "' data-url='"+rec[viewName]+"'></span>";
                                        //pv
                                        rec["custom_pv"] = "<span class='icon-spin icon-spinner pvNo' " +
                                            "data-id='" + rec[CampaignIdName] + "' data-h5id='" + rec[rs.rootLink + ":id"] + "'></span>";
                                        //参与量
                                        rec["custom_entryNo"] = "<span class='icon-spin icon-spinner entryNo' " +
                                            "data-id='" + rec[CampaignIdName] + "'></span>";
                                        //活动场景
                                        rec[sceneName] = "<span class='icon-spin icon-spinner scene' " +
                                            "data-id='" + rec[CampaignIdName] + "' data-cid='" + rec[sceneName] + "'></span>";
                                        //活动
                                        rec[titleName] = "<a class='title-link' data-id='" + rec[CampaignIdName] + "'>"+rec[titleName]+"</a>";
                                        //是否关闭活动
                                        if(rec["campaign_h5:is_cancelled"]){
                                            rec["campaign_h5:is_cancelled"] = "关闭";
                                        }else{
                                            rec["campaign_h5:is_cancelled"] = "启用";
                                        }
                                        //活动是否开始
                                        /*
                                        当前时间小于开始时间--活动未开始；
                                        当前时间大于结束时间--活动已结束；
                                         data-end='1'--已结束
                                         '0' -- 进行中
                                         '-1'--未开始
                                        容错：
                                        没有开始时间--活动正在进行中;
                                         */
                                        if(rec["campaign:status"]){
                                            var status = rec["campaign:status"].id;
                                            switch(status){
                                                case "1"://未开始
                                                    rec["campaign:status"].name = "<span class='timeStatus' data-end='1'>"+rec["campaign:status"].name+"</span>";
                                                    break;
                                                case "2"://进行中
                                                    rec["campaign:status"].name = "<span class='timeStatus' data-end='2'>"+rec["campaign:status"].name+"</span>";
                                                    break;
                                                case "3"://已结束
                                                    rec["campaign:status"].name = "<span class='timeStatus' data-end='3'>"+rec["campaign:status"].name+"</span>";
                                                    break;
                                                default:
                                                    rec["campaign:status"].name = "<span class='timeStatus' data-end='1'>"+rec["campaign:status"].name+"</span>";
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        promise.resolve(rs);
                        return promise;
                    },
                    afterLoad: function () { //当前页加载完执行此方法
                        var counts = $(".mainSection .s-table .s-column span.pvNo");
                        var entrydoms = $(".mainSection .s-table .s-column span.entryNo");
                        var ewmDoms = $(".mainSection .s-table .s-column span.ewmArea");
                        var scene = $(".mainSection .s-table .s-column span.scene");
                        var editDoms = $(".mainSection .s-table .s-column .campaign-edit");
                        var timeStatus = $(".mainSection .s-table .s-column .timeStatus");
                        var endColsIndexs = [];
                        //名称列
                        var titleDoms = $(".mainSection .s-table .s-column .title-link");
                        counts.each(function (key, obj) {
                            var id = $(obj).attr("data-id");
                            Iptools.GetJson({
                                url: "basic/getReportData",
                                data: {
                                    "token": Iptools.DEFAULTS.token,
                                    "campaignId": id
                                },
                                async:false
                            }).done(function (data) {
                                if (data) {
                                    //格式化各个列
                                    //pv
                                    $(obj).before(data.pageView);
                                    $(obj).remove();
                                    //参与量
                                    $(entrydoms[key]).before(data.responseCnt);
                                    $(entrydoms[key]).remove();
                                    //二维码
                                    var tempData = '<span class="ewm" data-val="'+$(ewmDoms[key]).attr("data-url")+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="Image/ewm.png">'
                                        + '<div class="ewm-area hide">'
                                        + '</div><div class="left-bot hide"></div><div class="left hide"></div></span>';
                                    $(ewmDoms[key]).before(tempData);
                                    $(ewmDoms[key]).remove();
                                    //编辑
                                    $(editDoms[key]).attr("data-id",$(obj).attr("data-id"));
                                    $(editDoms[key]).attr("data-h5id",$(obj).attr("data-h5id"));
                                    $(editDoms[key]).attr("data-title",$(titleDoms[key]).html());
                                    //标题
                                    $(titleDoms[key]).attr("data-title",$(titleDoms[key]).html());

                                    //活动时间状态为已结束的indexArray
                                    if($(timeStatus[key]).attr("data-end") === "3"){
                                        endColsIndexs.push(key);
                                    }
                                }
                            })
                        })
                        scene.each(function (key, obj) {
                            var id = $(obj).attr("data-cid");
                            Iptools.GetJson({
                                url: "basic/campaignScenes/"
                                + id,

                            }).done(function (data) {
                                if (data) {
                                    //活动场景
                                    $(obj).before(data.title);
                                    //title

                                    $(titleDoms[key]).attr("data-temType",data.sceneTemplateType);
                                    $(editDoms[key]).attr("data-temType",data.sceneTemplateType);
                                    $(titleDoms[key]).attr("data-scene",data.title);
                                    $(editDoms[key]).attr("data-scene",data.title);
                                    $(obj).remove();
                                }
                            })
                        });
                        var allCols = $(".mainSection .s-table .s-column");
                        if(endColsIndexs.length > 0){
                            allCols.each(function (key, obj) {
                                for(var i = 0;i < endColsIndexs.length ;i++){
                                    $(obj).find(".s-cell").eq(parseInt(endColsIndexs[i])+1).css("color", "#c3c3c3");
                                }

                            });
                        }

                    }
                });
            }
        });
    },
    _enableClickDetail:function(options){
        var $this = options.$this;
        var viewobj = {};
        var campaignId = $this.attr("data-id");

        var btn = $(this);
        var sceneName = $this.attr("data-scene");
        var title = $this.attr("data-title");
        var temType = $this.attr("data-temType");
        switch(temType){
            case "7":
                viewobj = {
                    "nameList":"\"survey_info_in_campaign\""
                }
                Iptools.uidataTool._getCustomizeView(viewobj).done(function(thisView){
                    Iptools.uidataTool._getView({
                        view: thisView.views[0].view,
                    }).done(function (data) {
                        Iptools.Tool._jumpView({
                            view: thisView.views[0].view,
                            name: "详情"+ ">" + title,
                            type: data.view.type,
                            valueId: campaignId,
                            primary: data.view.primary,
                            icon: data.view.icon,
                            url: data.view.url,
                            bread: true
                        });
                    });
                })
                break;
            default:
                viewobj["nameList"] = '\"campaign_detail\"';
                Iptools.uidataTool._getCustomizeView(viewobj).done(function (data) {
                    thisView = data;
                    Iptools.uidataTool._getView({
                        view: thisView.views[0].view,
                    }).done(function (data) {
                        Iptools.Tool._jumpView({
                            view: thisView.views[0].view,
                            name: data.view.name,
                            type: data.view.type,
                            primary: data.view.primary,
                            icon: data.view.icon,
                            url: data.view.url,
                            valueId: campaignId,
                            bread: true
                        }, function () {
                        })
                    })
                });
                break;
        }
    },
    _getNowDate:function(){
        //获取时间
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;

            var strDate = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            ////获取下一天
            //if(str === "nextday"){
            //    strDate = strDate + 1;
            //}
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hour >= 1 && hour <= 9) {
                hour = "0" + hour;
            }
            if (min >= 0 && min <= 9) {
                min = "0" + min;
            }
            if (sec >= 0 && sec <= 9) {
                sec = "0" + sec;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + hour + seperator2 + min
                + seperator2 + sec;
            return currentdate;
    }
};