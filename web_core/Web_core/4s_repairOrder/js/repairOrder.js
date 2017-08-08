/**
 * Created by 1 on 2017/7/7.
 */
var repairOrderWidget ={};
repairOrderWidget = {
    _UIDEFAULFS: {
        repairOrderApplet: "",
        repairOrderDetailApplet: ""

    },
    _rebuildUiDefaults: function (options) {
        repairOrderWidget._UIDEFAULFS = Iptools.Tool._extend(repairOrderWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        repairOrderWidget._bindingDomEvent();
        repairOrderWidget._initSetRepairOrderList();//初始化铺设工单列表数据
        repairOrderWidget._bindingEventAfterLoad();
    },
    _initSetRepairOrderList: function () {
        Iptools.Tool._pushListen("repairOrder-list-push", function (ms) {
            if(ms.channel == "repairOrder-list-push"){
                repairOrderWidget._initSetRepairOrderList();//初始化铺设列表数据
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'repairOrder-list'"
        }).done(function (data) {
            repairOrderWidget._UIDEFAULFS.repairOrderApplet = data.applets[0].applet;
            component._table("#repairOrderList", {
                applet: data.applets[0].applet,
                emptyImage: "../Content/Image/nodetail.png",
                emptySize: "150",
                emptyText: "没有维修记录数据记录",
                emptyClick: function () {
                },
                showChecks: false,
                jumpType: "template",
                //点击自己配置的按钮后的事件
                events: [
                    {
                        target: ".s-header-bar .s-manage .repairOrder-btn",
                        type: "click",
                        event: function () {
                            repairOrderWidget._initSetRepairOrderForm();//初始化新建表单数据
                        }
                    }
                ]
            });
        })
    },
    _initSetRepairOrderForm: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'repairOrder-detail'"
        }).done(function (data) {
            repairOrderWidget._UIDEFAULFS.repairOrderDetailApplet = data.applets[0].applet;
            component._unit("", {
                applet: data.applets[0].applet,
                type:"modal",
                modal:{
                    title:"新建-维修工单"
                },
                cusControls: {

                },
                afterSave:function(r){
                    var promise= $.Deferred();
                    Iptools.uidataTool._pushMessage({
                        channel: "repairOrder-list-push"
                    });
                    promise.resolve(r);
                    return promise;
                }
            });
        })
    }
};