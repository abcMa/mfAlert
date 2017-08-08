/**
 * Created by sks on 2017/7/12.
 */
/**
 * Created by sks on 2017/5/5.
 */
var InDetailDeal = {};
InDetailDeal = {
    /*
     ui dom elements Default Panels
     */
    _UIDEFAULFS: {
        contactTraceDetail:"",
        contactTraceRootId:"",
    },
    _rebuildUiDefaults: function (options) {
        InDetailDeal._UIDEFAULFS = Iptools.Tool._extend(InDetailDeal._UIDEFAULFS, options);
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
        InDetailDeal._getId();
        InDetailDeal._bindingDomEvent();
        InDetailDeal._bindingEventAfterLoad();
    },
    _getId:function(){
        Iptools.uidataTool._getCustomizeApplet({
            "nameList": "'Contact Trace Detail'"
        }).done(function (thisApplet) {
            if(thisApplet && thisApplet.applets){
                InDetailDeal._UIDEFAULFS.contactTraceDetail = thisApplet.applets[0].applet;
                Iptools.uidataTool._getApplet({
                    applet: InDetailDeal._UIDEFAULFS.contactTraceDetail
                }).done(function(r){
                    if(r && r.rootLink){
                        InDetailDeal._UIDEFAULFS.contactTraceRootId = r.rootLink;
                    }
                })
            }
        })
    },
    /*状态修改为失败加入动态*/
    _createDealsFailReason:function(content,dealId,time){
        var paramData = {};
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":trace_type"] = "23";
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":trace_category"] = "7";
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":trace_time"] = time;
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":title"] = content;
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":owner"] = Iptools.DEFAULTS.userId;
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":deal_id"] = dealId;
        var paramJson = JSON.stringify(paramData);
        Iptools.uidataTool._addAppletData({
            appletId:InDetailDeal._UIDEFAULFS.contactTraceDetail,
            data:paramJson
        }).done(function(data){
            if(data.retcode == 'ok'){
                Iptools.uidataTool._pushMessage({
                    channel: "standard_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                });
            }
        });
    },
    /*状态修改为成功原因加入动态*/
    _createDealsSuccReason:function(content,dealId,time){
        var paramData = {};
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":trace_type"] = "24";
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":trace_category"] = "7";
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":trace_time"] = time;
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":title"] = content;
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":owner"] = Iptools.DEFAULTS.userId;
        paramData[InDetailDeal._UIDEFAULFS.contactTraceRootId+":deal_id"] = dealId;
        var paramJson = JSON.stringify(paramData);
        Iptools.uidataTool._addAppletData({
            appletId:InDetailDeal._UIDEFAULFS.contactTraceDetail,
            data:paramJson
        }).done(function(data){
            if(data.retcode == 'ok'){
                Iptools.uidataTool._pushMessage({
                    channel: "standard_deals_trace", //频道，需要确保不同场景下使用不同的频道，请遵循定义规则
                });
            }
        });
    },
}