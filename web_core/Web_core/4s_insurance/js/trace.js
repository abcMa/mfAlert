/**
 * Created by sks on 2017/7/12.
 */
/**
 * Created by sks on 2017/5/5.
 */
var InsuTrace = {};
InsuTrace = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        contactTraceDetail:"",
        contactTraceRootId:"",
    },
    _rebuildUiDefaults: function (options) {
        InsuTrace._UIDEFAULFS = Iptools.Tool._extend(InsuTrace._UIDEFAULFS, options);
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
    _bindingDomEvent: function () {

    },
    _bindingEventAfterLoad: function () {

    },
    _init: function () {
        InsuTrace._getId();
        InsuTrace._bindingDomEvent();
        InsuTrace._bindingEventAfterLoad();
    },
    _getId:function(){
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "'Contact Trace Detail'"
        }).done(function (thisApplet) {
            if(thisApplet && thisApplet.applets){
                widget._UIDEFAULFS.contactTraceDetail = thisApplet.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: widget._UIDEFAULFS.contactTraceDetail
                }).done(function(r){
                    if(r && r.rootLink){
                        widget._UIDEFAULFS.contactTraceRootId = r.rootLink;
                    }
                })
            }
        })
    },
    _createInsuranceTrace:function(carId,title){
        var myDate = new Date();
        var traceTime = myDate.format("yyyy-MM-dd hh:mm:ss");
        var paramData = {};
        paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_type"] = "28";
        paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_category"] = "5";
        paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_time"] = traceTime;
        paramData[widget._UIDEFAULFS.contactTraceRootId+":title"] = title;
        paramData[widget._UIDEFAULFS.contactTraceRootId+":owner"] = Iptools.DEFAULTS.userId;
        paramData[widget._UIDEFAULFS.contactTraceRootId+":car_id"] = carId;
        var paramJson = JSON.stringify(paramData);
        Iptools.uidataTool._addAppletData({
            appletId:widget._UIDEFAULFS.contactTraceDetail,
            data:paramJson
        }).done(function(data){
            if(data.retcode == 'ok'){
                Iptools.uidataTool._pushMessage({
                    channel: "4s_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                });
                Iptools.uidataTool._pushMessage({
                    channel: "car_detail_trace_listener", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                });
            }
        });
    },
    _createDealsTrace:function(carArray,dealArr){
        var myDate = new Date();
        var traceTime = myDate.format("yyyy-MM-dd hh:mm:ss");
        for(var i = 0;i<carArray.length;i++){
            var paramData = {};
            paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_type"] = "27";
            paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_category"] = "7";
            paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_time"] = traceTime;
            paramData[widget._UIDEFAULFS.contactTraceRootId+":title"] = carArray[i].title;
            paramData[widget._UIDEFAULFS.contactTraceRootId+":owner"] = Iptools.DEFAULTS.userId;
            paramData[widget._UIDEFAULFS.contactTraceRootId+":car_id"] = carArray[i].carID;
            paramData[widget._UIDEFAULFS.contactTraceRootId+":deal_id"] = dealArr[i];
            var paramJson = JSON.stringify(paramData);
            Iptools.uidataTool._addAppletData({
                appletId:widget._UIDEFAULFS.contactTraceDetail,
                data:paramJson
            }).done(function(data){
                if(data.retcode == 'ok'){
                    Iptools.uidataTool._pushMessage({
                        channel: "4s_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                    });
                    Iptools.uidataTool._pushMessage({
                        channel: "car_detail_trace_listener", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                    });
                }
            });
        }
    },
    /*状态修改为失败，失败原因加入动态*/
    _createDealsFailReason:function(content,dealId){
        var myDate = new Date();
        var traceTime = myDate.format("yyyy-MM-dd hh:mm:ss");
        var paramData = {};
        paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_type"] = "23";
        paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_category"] = "7";
        paramData[widget._UIDEFAULFS.contactTraceRootId+":trace_time"] = traceTime;
        paramData[widget._UIDEFAULFS.contactTraceRootId+":title"] = content;
        paramData[widget._UIDEFAULFS.contactTraceRootId+":owner"] = Iptools.DEFAULTS.userId;
        //paramData[widget._UIDEFAULFS.contactTraceRootId+":car_id"] = carID;
        paramData[widget._UIDEFAULFS.contactTraceRootId+":deal_id"] = dealId;
        var paramJson = JSON.stringify(paramData);
        Iptools.uidataTool._addAppletData({
            appletId:widget._UIDEFAULFS.contactTraceDetail,
            data:paramJson
        }).done(function(data){
            if(data.retcode == 'ok'){
                Iptools.uidataTool._pushMessage({
                    channel: "4s_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                });
            }
        });
    },
}