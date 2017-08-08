/**
 * Created by sks on 2017/5/12.
 */
//客户和客户群动态               公共引用的widget.js  2017-04-14
var trace = {};
trace = {
    _UIDEFAULFS: {
        dealTraceDeApplet:"",
        dealTraceDeRoot:"",
    },
    _rebuildUiDefaults: function (options) {
        widget._UIDEFAULFS = Iptools.Tool._extend(widget._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
    },
    _bindingEventAfterLoad: function () {//插件的初始化
    },
    _init: function () {
        trace._getDealTraceApplet();
    },
    /*交易动态埋点*/
    //获取交易动态detail的applet
    _getDealTraceApplet : function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'deal_trace_detail'",
            async:false,
        }).done(function (data) {
            trace._UIDEFAULFS.dealTraceDeApplet =  data.applets[0].applet;
            Iptools.uidataTool._getApplet({
                applet:trace._UIDEFAULFS.dealTraceDeApplet,
                async:false,
            }).done(function(data){
                if(data)
                    //console.log(data)
                    trace._UIDEFAULFS.dealTraceDeRoot = data.rootLink;
            });
        });
    },
    //创建交易
    _createDealTrace:function(title,pipeline,dealStage,pre_amount,due_time,owner,contact_id){
        var param_trace = {};
        param_trace[widget._UIDEFAULFS.dealTraceRoot+":title"] = title;
        param_trace[widget._UIDEFAULFS.dealTraceRoot+":pipeline"] = pipeline;
        param_trace[widget._UIDEFAULFS.dealTraceRoot+":deal_stage"] = dealStage;
        param_trace[widget._UIDEFAULFS.dealTraceRoot+":pre_amount"] = pre_amount;
        param_trace[widget._UIDEFAULFS.dealTraceRoot+":due_time"] = due_time;
        param_trace[widget._UIDEFAULFS.dealTraceRoot+":owner"] = owner;
        param_trace[widget._UIDEFAULFS.dealTraceRoot+":contact_id"] = contact_id;
        param_trace[widget._UIDEFAULFS.dealTraceRoot+':trace_type'] = "1";
        var paramTrace = JSON.stringify(param_trace);
        console.log(paramTrace)
        Iptools.uidataTool._addAppletData({
            appletId:trace._UIDEFAULFS.dealTraceDeApplet,
            data:paramTrace,
        }).done(function(data){
            if(data && data.retcode == "ok"){

            }
        });
    },
    //创建笔记
    _createNoteTrace:function(content){
        var noteParamTrace = {};
        noteParamTrace[widget._UIDEFAULFS.dealTraceRoot+':content'] = content;
        noteParamTrace[widget._UIDEFAULFS.dealTraceRoot+':trace_type'] = "5";
        var noteParamTraceStr = JSON.stringify(noteParamTrace);
        Iptools.uidataTool._addAppletData({
            appletId:trace._UIDEFAULFS.dealTraceDeApplet,
            data:noteParamTraceStr,
        }).done(function(data){
            if(data && data.retcode == "ok"){

            }
        });
    },
    //为交易发送短信
    _createMsgForContact: function(msg,contact_id){//为客户发送短信
        var msgParamTrace = {};
        msgParamTrace[widget._UIDEFAULFS.dealTraceRoot+':title'] = msg;
        msgParamTrace[widget._UIDEFAULFS.dealTraceRoot+':trace_type'] = "6";
        msgParamTrace[trace._UIDEFAULFS.contactTraceDeRoot+":contact_id"]=contact_id;
        var msgParamTraceStr = JSON.stringify(msgParamTrace);
        Iptools.uidataTool._addAppletData({
            appletId:trace._UIDEFAULFS.dealTraceDeApplet,
            data:msgParamTraceStr
        }).done(function(data){
            console.log('为客户发送短信动态已post---客户方')
        });
    }
}