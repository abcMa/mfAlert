//客户和客户群动态               公共引用的widget.js  2017-04-14
var trace = {};
trace = {
    _UIDEFAULFS: {
        contactTraceDeApplet : " ",//客户动态的详情  applet
        contactTraceDeRoot : "  ",//客户动态详情  root
        year:"",
        month:"",
        day:"",
        traceTime:""
    },
    _rebuildUiDefaults: function (options) {
        trace._UIDEFAULFS = Iptools.Tool._extend(trace._UIDEFAULFS, options);
    },
    _addEventListener: function (options) {
        $(options.container).on(options.type, options.target, options.event);
    },
    _bindingDomEvent: function () {//绑定事件
    },
    _bindingEventAfterLoad: function () {//插件的初始化
        var myDate = new Date();
        trace._UIDEFAULFS.year = myDate.getFullYear();
        trace._UIDEFAULFS.month = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
        trace._UIDEFAULFS.day = myDate.getDate();
    },
    _StandardTime: function(shu){
        var time = "";
        if(shu < 10){
            time = "0"+shu;
        }else{
            time = shu;
        }
        return time;
    },
    _init: function () {
        trace._getContactTraceDeApplet();
        trace._bindingEventAfterLoad();
    },
    _getContactTraceDeApplet : function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Contact Trace Detail'"
        }).done(function (data) {
            trace._UIDEFAULFS.contactTraceDeApplet =  data.applets[0].applet;//8143
            Iptools.uidataTool._getApplet({
                applet:trace._UIDEFAULFS.contactTraceDeApplet
            }).done(function(data){
                if(data)
                    trace._UIDEFAULFS.contactTraceDeRoot = data.rootLink;//225
            });
        });
    },

}