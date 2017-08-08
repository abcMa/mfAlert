/**
 * Created by 1 on 2017/7/7.
 */
var onStarWidget ={};
onStarWidget = {
    _UIDEFAULFS: {
        onStarApplet: "",
        onStarDetailApplet: "",
        plateRecord: "",
        traceDetailApplet: ""

    },
    _rebuildUiDefaults: function (options) {
        onStarWidget._UIDEFAULFS = Iptools.Tool._extend(onStarWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        onStarWidget._bindingDomEvent();
        onStarWidget._initSetOnStarList();//初始化铺设安吉星数据
        onStarWidget._bindingEventAfterLoad();
    },
    _initSetOnStarList: function () {
        Iptools.Tool._pushListen("onStar-list-push", function (ms) {
            if(ms.channel == "onStar-list-push"){
                onStarWidget._initSetOnStarList();//初始化铺设列表数据
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'onStar_list'"
        }).done(function (data) {
            onStarWidget._UIDEFAULFS.onStarApplet = data.applets[0].applet;
            component._table("#onStarList", {
                applet: data.applets[0].applet,
                emptyImage: "../Content/Image/nodetail.png",
                emptySize: "150",
                emptyText: "没有安吉星数据记录",
                emptyClick: function () {
                },
                showChecks: false,
                jumpType: "template",
                jumpTemplate: "<a class='del-list'><span class='fa fa-trash-o del-managmen'></span></a>",
                //点击自己配置的按钮后的事件
                events: [
                    {
                        target: ".s-header-bar .s-manage .onStar-btn",
                        type: "click",
                        event: function () {
                            onStarWidget._initSetOnStarForm();//初始化新建表单数据
                        }
                    },
                    {
                        target: ".s-cell .carNameTitle",
                        type: "click",
                        event: function () {
                            var me = $(this).data("id");
                            Iptools.uidataTool._getCustomizeApplet({
                                nameList: "'onStar-detail'"
                            }).done(function (data) {
                                component._unit("", {
                                    applet: data.applets[0].applet,
                                    type: "modal",
                                    mode: "edit",
                                    valueId: me,
                                    modal:{
                                        title: "编辑-安吉星"
                                    },
                                    cusControls: {

                                    },
                                    events:[]
                                });
                            });
                        }
                    },
                    {
                        target: ".del-list",
                        type: "click",
                        event: function () {
                            var me = $(this);
                            Iptools.uidataTool._deleteAppletData({
                                para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + onStarWidget._UIDEFAULFS.onStarApplet
                                    + "&valueIds=" + me.parent().data("key")
                            }).done(function (data) {
                                if (data.retcode = "ok") {
                                    Iptools.Tool.pAlert({
                                        type: "info",
                                        title: "系统提示：",
                                        content: "删除成功",
                                        delay: 1000
                                    });
                                    Iptools.uidataTool._pushMessage({
                                        channel: "onStar-list-push"
                                    });
                                }

                            })
                        }
                    }
                ],
                dataModify: function (r) {
                    var promise = $.Deferred();
                    if (r) {
                        if (r.data && r.data.records && r.data.records.length) {
                            for (var i = 0; i < r.data.records.length; i++) {
                                var rec = r.data.records[i];
                                rec[r.rootLink + ":xufei_taocan"] ="<a class='carNameTitle' data-id='"+rec[r.rootLink + ":id"]+"'>" + rec[r.rootLink + ":xufei_taocan"] + "</a>";
                            }
                        }
                    }
                    promise.resolve(r);
                    return promise;
                }
            });
        })
    },
    _initSetOnStarForm: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'onStar-detail'"
        }).done(function (data) {
            onStarWidget._UIDEFAULFS.onStarDetailApplet = data.applets[0].applet;
            Iptools.uidataTool._getCustomizeApplet({
                nameList: "'Contact Trace Detail'"
            }).done(function (datas) {
                onStarWidget._UIDEFAULFS.traceDetailApplet = datas.applets[0].applet;
            });
            var onStarData = component._unit("", {
                applet: data.applets[0].applet,
                type:"modal",
                modal:{
                    title:"新建-安吉星"
                },
                cusControls: {

                },
                loadComplete:function(){
                    var name = window.sessionStorage.getItem("userTitle");
                    $(".u-control input[name='anji_star:fuzeren']").val(name).data("key",Iptools.DEFAULTS.userId).trigger("input").trigger("blur");
                },
                afterSave:function(r){
                    var promise= $.Deferred();
                    var prefix = "contact_trace";
                    var paramData = {};
                    var param = {};
                    param[prefix + ":title"] = onStarData.data("unit").options.DataCurrentSets["anji_star:xufei_taocan"];
                    param[prefix + ":customer_id"] = onStarWidget._UIDEFAULFS.plateRecord["customer:id"];
                    param[prefix + ":trace_time"] = (new Date()).format("yyyy-MM-dd hh:mm:ss");
                    param[prefix + ":owner"] = Iptools.DEFAULTS.userId;
                    param[prefix + ":trace_category"] = "5";
                    param[prefix + ":trace_type"] = "30";
                    param[prefix + ":car_id"] = onStarWidget._UIDEFAULFS.plateRecord["car:id"];
                    paramData["data"] = JSON.stringify(param);
                    paramData["appletId"] = onStarWidget._UIDEFAULFS.traceDetailApplet;
                    Iptools.uidataTool._addAppletData(paramData).done(function(){
//                        console.log("成功");
                        Iptools.uidataTool._pushMessage({
                            channel: "onStar-list-push"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "car_detail_trace_listener"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "customer_detail_trace_listener" + onStarWidget._UIDEFAULFS.plateRecord["customer:id"]
                        });
                    });
                    promise.resolve(r);
                    return promise;
                },
                events:[{
                    type:"control-pick-for",
                    target:".u-control input[name='anji_star:plate_number']",
                    event:function(e,record){
                        onStarWidget._UIDEFAULFS.plateRecord=record;
                    }
                },{
                    type:"control-pick-for",
                    target:".u-control input[name='anji_star:vin']",
                    event:function(e,record){
                        onStarWidget._UIDEFAULFS.plateRecord=record;
                    }
                }]
            });
        })
    }
};