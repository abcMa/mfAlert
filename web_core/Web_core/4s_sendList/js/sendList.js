widget = {};
widget = {
    DEFAULTS: {},
    _init:function() {
        widget._buildListData();
        widget._bindDomEvents();
    },
    _bindDomEvents:function(){
        widget._enableSendDetail();
        widget._enableSendStop();
    },
    _enableSendDetail:function(){
        $("body").on("click", ".send-item-detail", function () {
            var $this = $(this);
            var viewobj = {};
            var thisView;
            var channelId = "";
            var index = $this.closest(".s-cell").attr("data-index");
            var options = $(".mainSection").data("stable").options;


            if(options){
                var data=$(".mainSection").data("stable").options.data;
                if(data.records && data.records.length){
                    channelId =data.records[index][options.rootLink+":id"];
                }
            }
            viewobj["nameList"] = '\"channel_detail\"';//查看全部短信记录
            Iptools.uidataTool._getCustomizeView(viewobj).done(function (data) {
                thisView = data;
                Iptools.uidataTool._getView({
                    view: thisView.views[0].view,
                    async: false
                }).done(function (data) {
                    Iptools.Tool._jumpView({
                        view: thisView.views[0].view,
                        name: data.view.name,
                        type: data.view.type,
                        primary: data.view.primary,
                        icon: data.view.icon,
                        url: data.view.url,
                        valueId: channelId,
                        bread: true
                    }, function () {
                    })
                })
            });
        })
    },
    _enableSendStop:function(){
        $("body").on("click",".send-stop",function(){
            var $this = $(this);
            var channelId = "";
            var index = $this.closest(".s-cell").attr("data-index");
            var options = $(".mainSection").data("stable").options;


            if(options){
                var data=$(".mainSection").data("stable").options.data;
                if(data.records && data.records.length){
                    channelId =data.records[index][options.rootLink+":id"];
                }
            }

            Iptools.uidataTool._getCustomizeApplet({"nameList": '\"Campaign Channel Detail Applet\"'}).done(function (json) {

                var prefix;
                Iptools.uidataTool._getApplet({
                        "applet":json.applets[0].applet
                }).done(function(data){
                    if(data){
                        prefix = data.rootLink;
                        var paramData = {"appletId": json.applets[0].applet};
                        var paramStr = "";
                        paramStr += '{';
                        paramStr += "\"" + prefix + ":msg_status\":\"9\"";
                        paramStr += "}";
                        paramData["data"] = paramStr;
                        paramData["valueId"] = channelId;
                        Iptools.uidataTool._saveAppletData(paramData).done(function(data){
                            if(data.retcode !== "fail"){
                                Iptools.Tool.pAlert({
                                    type: "success",
                                    title: "提示：",
                                    content: "操作成功",
                                    delay: 1000
                                });
                                $this.remove();
                            }
                        })
                    }
                })

            })
        })
    },
    _buildListData:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'Campaign Channel List Applet'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                component._table(".mainSection", {
                    pageNow: 1,
                    pageSize: 10,
                    showChecks:false,
                    condition:{"campaign_channel:target_group":" is not null", "campaign_channel:filter_condition_json":" is not null"},
                    applet: r.applets[0].applet,
                    emptyImage: "../Content/Image/nodetail.png",
                    emptySize: "150",
                    emptyText: "没有群发记录",
                    emptySearch:"没有搜索到数据，请更换关键词后再次搜索",
                    emptyClick: function () {
                        Iptools.uidataTool._getCustomizeView({
                            nameList: "'newSendGroup'"
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
                    jumpTemplate: "<a class='send-item-detail' title='查看群发详情'><span class='fa fa-edit'></span></a>",////操作列dom
                    events: [//applet-btn事件及样式
                        {
                            target: ".s-header-bar .s-manage .add-group",//add-group是新建客户群，还有其他类型
                            type: "click",
                            event: function () {
                                $("#newModal").modal("show");
                            }
                        }],
                    dataModify: function (rs) {//更改数据列--columns为表头，data.records为表数据，更改完进行渲染表
                        var promise = $.Deferred();
                        if (rs) {
                            if (rs.columns && rs.columns.length) {
                                if (rs.data && rs.data.records && rs.data.records.length) {
                                    for (var i = 0; i < rs.data.records.length; i++) {
                                        var rec = rs.data.records[i];
                                        var conditionJsonStr = rec[rs.rootLink + ":filter_condition_json"];
                                        var conditionStr = "";
                                        if(conditionJsonStr){
                                            switch(conditionJsonStr){
                                                case "{'contactType':' =2'}":
                                                    conditionStr = "潜在客户";
                                                    break;
                                                case "{'contactType':' =3'}":
                                                    conditionStr = "消费客户";
                                                    break;
                                                case "{'contactType':' =4'}":
                                                    conditionStr = "会员客户";
                                                    break;
                                                case "{'contactType':' in (2,3,4)'}":
                                                    conditionStr = "全部客户";
                                                    break;
                                            }
                                        }
                                        rec[rs.rootLink + ":filter_condition_json"] = conditionStr;
                                    }
                                }
                            }
                        }
                        promise.resolve(rs);
                        return promise;
                    },
                    afterLoad: function () { //当前页加载完执行此方法

                        var stopItems = $(".mainSection .s-table .s-column .send-item-detail");
                        var itemchannelId = "",itemIsRepeat,itemMsgStatus;
                        var options = $(".mainSection").data("stable").options;
                        var records;
                        if(options){
                            var data=$(".mainSection").data("stable").options.data;
                            if(data && data.records && data.records.length){
                                records = data.records;
                                stopItems.each(function (key, obj) {
                                    itemchannelId = data.records[key][options.rootLink+":id"];
                                    itemIsRepeat = data.records[key][options.rootLink+":is_repeat"];
                                    itemMsgStatus = data.records[key][options.rootLink+":msg_status"];
                                    if(itemIsRepeat && (itemMsgStatus.id === "1" || itemMsgStatus.id === "3")){
                                        $(obj).after("<a class='send-stop' title='终止群发任务'><span class='icon-stop'></span></a>");
                                    }
                                })
                            }
                        }

                    }
                });
            }
        });
    },

}