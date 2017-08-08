widget = {};
widget = {
    DEFAULTS: {
        channelId:""
    },
    _init:function() {
        widget.DEFAULTS.channelId = Iptools.getDefaults({"key":"currentViewValue"});
        widget._buildListData();
        widget._buildChannelDetail();
        widget._bindDomEvents();
    },
    _bindDomEvents:function(){
    },
    _buildListData:function(){
        Iptools.uidataTool._getCustomizeApplet({
            nameList: "'msg_send_list'"
        }).done(function (r) {
            if (r && r.applets && r.applets.length) {
                var prefix;
                Iptools.uidataTool._getApplet({
                    "applet":r.applets[0].applet
                }).done(function(data) {
                    if (data) {
                        prefix = data.rootLink;
                        var conObj ={};
                        conObj[prefix+":campaign_channel_id"] = " ="+widget.DEFAULTS.channelId;
                        component._table(".mainSection", {
                            pageNow: 1,
                            pageSize: 10,
                            condition: conObj,
                            showChecks:false,
                            applet: r.applets[0].applet,
                            emptyImage: "../Content/Image/nodetail.png",
                            emptySize: "150",
                            emptyText: "没有发送记录",
                            jumpType: "template",//操作列跳转类型
                            jumpTemplate: "<a class='send-item-detail'><span class='icon-magic'></span></a><a class='send-stop'><span class='icon-stop'></span></a>",////操作列dom

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
                            }
                        });
                    }
                })

            }
        });
    },
    _buildChannelDetail:function(){
       console.log(widget.DEFAULTS.channelId);
        Iptools.uidataTool._getCustomizeApplet({"nameList": '\"Campaign Channel Detail Applet\"'}).done(function (json) {
                if(json){
                    Iptools.uidataTool._getUserDetailAppletData({
                        appletId: json.applets[0].applet,
                        valueId: widget.DEFAULTS.channelId,
                    }).done(function (ds) {
                         if(ds.data){
                             var prefix = ds.rootLink;
                             var itemData = ds.data;
                             if(itemData[prefix+":title"]){
                                  $(".channel-detail .title").html(itemData[prefix+":title"]);
                             }
                             if(itemData[prefix+":msg_content"]){
                                 $(".channel-detail .content").html(itemData[prefix+":msg_content"]);
                             }
                             if(itemData[prefix+":msg_status"]){
                                 $(".channel-detail .sendStatus").html(itemData[prefix+":msg_status"].name);
                             }
                             if(itemData[prefix+":target_group"]){
                                 $(".channel-detail .target").html(itemData[prefix+":target_group"].name);
                             }

                             if(itemData[prefix+":channel_type"]){
                                 $(".channel-detail .channel").html(itemData[prefix+":channel_type"].name);
                             }
                             if(itemData[prefix+":release_time"]){
                                 $(".channel-detail .sendTime").html(itemData[prefix+":release_time"]);
                             }
                             var sendType = "";
                             if(itemData[prefix+":sendnow"]){//直接发送
                                 sendType = "直接发送";
                             }else{
                                 sendType = "定时发送";
                             }
                             var repeatType = "";
                             //循环方式
                             if(itemData[prefix+":is_repeat"]){//循环
                                 repeatType  = itemData[prefix+":repeat_type"].name;
                             }else{
                                 repeatType = "不循环";
                             }
                             $(".channel-detail .sendType").html(sendType + " " + repeatType);
                         }
                    })
                }

        })
    }

}