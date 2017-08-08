/**
 * Created by 1 on 2017/7/7.
 */
var extendInsuranceWidget ={};
extendInsuranceWidget = {
    _UIDEFAULFS: {
        extendInsuranceApplet: "",
        extendInsuranceDetailApplet: "",
        rootAliasName: "",
        dealsDetailInsuranceRootId: "",
        dealsArray:[],
        plateRecord: "",
        traceDetailApplet: "",
        contact_id: ""

    },
    _rebuildUiDefaults: function (options) {
        extendInsuranceWidget._UIDEFAULFS = Iptools.Tool._extend(extendInsuranceWidget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {
    },
    _bindingEventAfterLoad: function () {
    },
    _init: function () {
        extendInsuranceWidget._bindingDomEvent();//DOM元素加载前绑定事件
        extendInsuranceWidget._initSetTableData();//初始化铺设表单数据
        extendInsuranceWidget._bindingEventAfterLoad();//插件绑定函数
    },
    _initSetTableData: function () {
        Iptools.Tool._pushListen("extend-insurance-list-push", function (ms) {
            if(ms.channel == "extend-insurance-list-push"){
                extendInsuranceWidget._initSetTableData();//初始化铺设表单数据
            }
        });
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'extend-insurance_list'"
        }).done(function (data) {
            extendInsuranceWidget._UIDEFAULFS.extendInsuranceApplet = data.applets[0].applet;
            component._table("#extendInsuranceTest", {
                applet: data.applets[0].applet,
                emptyImage: "../Content/Image/nodetail.png",
                emptySize: "150",
                emptyText: "没有延保记录",
                emptyClick: function () {
                },
                showChecks: false,
                jumpType: "template",
                jumpTemplate: "<a class='del-list'><span class='fa fa-trash-o del-managmen'></span></a>",
                //点击自己配置的按钮后的事件
                events: [
                    {
                        target: ".s-header-bar .s-manage .extend-insurance",
                        type: "click",
                        event: function () {
                            extendInsuranceWidget._initSetPopupData();//初始化铺设详情表单
                        }
                    },
                    {
                        target: ".s-cell .extendNameTitle",
                        type: "click",
                        event: function () {
                            var me = $(this).data("id");
                            Iptools.uidataTool._getCustomizeApplet({
                                nameList: "'extend-insurance_detail'"
                            }).done(function (data) {
                                component._unit("", {
                                    applet: data.applets[0].applet,
                                    type: "modal",
                                    mode: "edit",
                                    valueId: me,
                                    modal:{
                                        title: "编辑-延保"
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
                                para: "?token=" + Iptools.DEFAULTS.token + "&appletId=" + extendInsuranceWidget._UIDEFAULFS.extendInsuranceApplet
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
                                        channel: "extend-insurance-list-push"
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
                                rec[r.rootLink + ":contract_number"] ="<a class='extendNameTitle' data-id='"+rec[r.rootLink + ":id"]+"'>" + rec["car_extended_warranties:contract_number"] + "</a>";
                            }
                        }
                    }
                    promise.resolve(r);
                    return promise;
                }
            });
        })
    },
    _initSetPopupData: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'extend-insurance_detail'"
        }).done(function (data) {
            extendInsuranceWidget._UIDEFAULFS.extendInsuranceDetailApplet = data.applets[0].applet;
            Iptools.uidataTool._getCustomizeApplet({
                nameList: "'Contact Trace Detail'"
            }).done(function (datas) {
                extendInsuranceWidget._UIDEFAULFS.traceDetailApplet = datas.applets[0].applet;
            });
            var extendInsuranceData = component._unit("", {
                applet: extendInsuranceWidget._UIDEFAULFS.extendInsuranceDetailApplet,
                type:"modal",
                modal:{
                    title:"新建-延保"
                },
                cusControls: {

                },
                loadComplete:function(){
                    var name = window.sessionStorage.getItem("userTitle");
                    $(".u-control input[name='car_extended_warranties:chudanren']").val(name).data("key",Iptools.DEFAULTS.userId).trigger("input").trigger("blur");
                },
                afterSave:function(r){
                    var promise= $.Deferred();
                    var prefix = "contact_trace";
                    var paramData = {};
                    var param = {};
                    param[prefix + ":title"] = extendInsuranceData.data("unit").options.DataCurrentSets["car_extended_warranties:contract_number"];
                    param[prefix + ":customer_id"] = extendInsuranceWidget._UIDEFAULFS.plateRecord["customer:id"];
                    if (extendInsuranceWidget._UIDEFAULFS.contact_id != "") {
                        param[prefix + ":contact_id"] = extendInsuranceWidget._UIDEFAULFS.contact_id;
                    }
                    param[prefix + ":trace_time"] = (new Date()).format("yyyy-MM-dd hh:mm:ss");
                    param[prefix + ":owner"] = Iptools.DEFAULTS.userId;
                    param[prefix + ":trace_category"] = "5";
                    param[prefix + ":trace_type"] = "29";
                    param[prefix + ":car_id"] = extendInsuranceWidget._UIDEFAULFS.plateRecord["car:id"];
                    paramData["data"] = JSON.stringify(param);
                    paramData["appletId"] = extendInsuranceWidget._UIDEFAULFS.traceDetailApplet;
                    Iptools.uidataTool._addAppletData(paramData).done(function(){
//                        console.log("成功");
                        Iptools.uidataTool._pushMessage({
                            channel: "extend-insurance-list-push"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "car_detail_trace_listener"
                        });
                        Iptools.uidataTool._pushMessage({
                            channel: "customer_detail_trace_listener" + extendInsuranceWidget._UIDEFAULFS.plateRecord["customer:id"]
                        });
                    });
//                    getlist(extendInsuranceWidget._UIDEFAULFS.plateRecord["car:id"]).(function(r){
//                        for(var i=0;i< r.length;i++){
//                            trace.title=extendInsuranceData.data("unit").options.DataCurrentSets["car_extended_warranties:contract_number"];
//                            trace.contactid = r[i].contactid;
//                            trace.trace_time = (new Date()).format("yyyy-MM-dd hh:mm:ss");
//                            trace.owner = Iptools.DEFAULTS.userId;
//                            trace.trace_category = "3";
//                            trace.trace_type = "29";
//                            console.log(trace);
//                            Iptools.uidataTool._addAppletData(trace).done(function(){
//                                console.log("成功");
//                            });
//                        }
//                    });
                    $(".u-control input[name='car_extended_warranties:chudanren']").val("adssd");
                    promise.resolve(r);
                    return promise;
                },
                events:[{
                    type:"control-pick-for",
                    target:".u-control input[name='car_extended_warranties:contact_phone']",
                    event:function(e,record){
                        extendInsuranceWidget._UIDEFAULFS.plateRecord = record;
                        extendInsuranceWidget._fromPhonetoContactId();//根据手机号获得客户ID
                    }
                },{
                    type:"control-pick-for",
                    target:".u-control input[name='car_extended_warranties:vin']",
                    event:function(e,record){
                        extendInsuranceWidget._UIDEFAULFS.plateRecord = record;
                        extendInsuranceWidget._fromPhonetoContactId();//根据手机号获得客户ID
                    }
                }]
            });
        })
    },
    _fromPhonetoContactId: function () {
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'contact_car_link'"
        }).done(function (data) {
            Iptools.uidataTool._getUserlistAppletData({
                appletId: data.applets[0].applet,
                condition:'{"contact_car_link:car_id":"='+extendInsuranceWidget._UIDEFAULFS.plateRecord["car:id"]+'"}'
            }).done(function(s){
                if(s && s.data){
                    extendInsuranceWidget._UIDEFAULFS.contact_id = s.data.records[0]["contact_car_link:contact_id"].id;
                }
            });
        });
    }
};